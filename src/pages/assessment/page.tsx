
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAssessmentResponse, updateAssessment } from '../../lib/database';
import { analyzePropertyReadiness } from '../../lib/riskAnalysis';
import { questions } from '../../data/questions';

export default function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentAssessment, setCurrentAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [skipped, setSkipped] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user and assessment data from session storage
    const userStr = sessionStorage.getItem('currentUser');
    const assessmentStr = sessionStorage.getItem('currentAssessment');
    
    if (userStr && assessmentStr) {
      setCurrentUser(JSON.parse(userStr));
      setCurrentAssessment(JSON.parse(assessmentStr));
    } else {
      // Redirect to home if no user/assessment data
      navigate('/');
    }
  }, [navigate]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    // Selecting an option means we're not in a skipped state
    if ((questions[currentQuestion].type ?? 'choice') === 'text') {
      setSkipped(false);
    }
  };

  const saveCurrentAnswer = () => {
    const q = questions[currentQuestion];
    const newAnswers = [...answers];
    if ((q.type ?? 'choice') === 'text') {
      // If user provided text, save it; otherwise mark as skipped
      newAnswers[currentQuestion] = textAnswer.trim() !== '' ? textAnswer : '__SKIPPED__';
    } else if (selectedOption !== null) {
      newAnswers[currentQuestion] = selectedOption;
    }
    setAnswers(newAnswers);
    return newAnswers;
  };

  const loadAnswerFor = (index: number) => {
    const q = questions[index];
    const existing = answers[index];
    if ((q.type ?? 'choice') === 'text') {
      if (typeof existing === 'string') {
        if (existing === '__SKIPPED__') {
          setTextAnswer('');
          setSkipped(true);
        } else {
          setTextAnswer(existing);
          setSkipped(false);
        }
      } else {
        setTextAnswer('');
        setSkipped(false);
      }
      setSelectedOption(null);
    } else {
      setSelectedOption(typeof existing === 'number' ? existing : null);
      setTextAnswer('');
      setSkipped(false);
    }
  };

  const handleNext = async () => {
    if (!currentAssessment) return;
    
    const q = questions[currentQuestion];
    const isText = (q.type ?? 'choice') === 'text';
    const hasValidAnswer = (isText && (textAnswer.trim() !== '' || skipped)) || (!isText && selectedOption !== null);
    
    if (hasValidAnswer) {
      setLoading(true);
      
      try {
        let answerText: string;
        let score: number;
        
        if (isText) {
          answerText = skipped ? 'Skipped' : textAnswer.trim();
          score = skipped ? 0 : 1; // Basic scoring for text questions
        } else {
          answerText = q.options![selectedOption!];
          score = selectedOption!; // Use option index as score
        }
        
        // Save the current response to database
        await saveAssessmentResponse({
          assessmentId: currentAssessment.id,
          questionId: currentQuestion + 1,
          questionText: q.text,
          answerText,
          score
        });
        
        // Update local answers array
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = { answerText, score };
        setAnswers(newAnswers);
        
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOption(null);
          setTextAnswer('');
          setSkipped(false);
        } else {
          // Assessment complete - analyze using NGS Property Readiness system
          const responseData = newAnswers.map((answer, idx) => {
            if (typeof answer === 'object' && answer.score !== undefined) {
              return answer.score;
            }
            return answer || 0;
          });
          
          // Extract text response from Q24 (biggest challenge) - now at the end
          const textResponseIndex = questions.findIndex(q => q.type === 'text');
          const textResponse = textResponseIndex >= 0 && newAnswers[textResponseIndex] ? 
            (typeof newAnswers[textResponseIndex] === 'string' ? newAnswers[textResponseIndex] : newAnswers[textResponseIndex].answerText || '') : '';
          
          console.log('Response data for analysis:', responseData);
          console.log('Text response:', textResponse);
          
          const propertyAnalysis = analyzePropertyReadiness(responseData, textResponse);
          
          console.log('Property analysis result:', propertyAnalysis);
          
          // Use security score as the main score for database compatibility
          await updateAssessment(currentAssessment.id, {
            status: 'completed',
            total_score: propertyAnalysis.securityScore,
            risk_level: propertyAnalysis.securityLevel,
            completed_at: new Date().toISOString()
          });

          // Store comprehensive results for results page
          sessionStorage.setItem('assessmentResults', JSON.stringify({
            ...propertyAnalysis,
            responses: newAnswers
          }));

          navigate('/results');
        }
        } catch (error) {
          console.error('Error saving response:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          alert(`There was an error saving your response: ${errorMessage}. Please try again.`);
        } finally {
          setLoading(false);
        }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      // Optionally save current answer before going back
      saveCurrentAnswer();
      const prevIndex = currentQuestion - 1;
      setCurrentQuestion(prevIndex);
      // Load any existing answer for previous question
      setTimeout(() => loadAnswerFor(prevIndex), 0);
    }
  };

  const handleSkip = () => {
    // For the last question (text), enable completion without text
    if ((questions[currentQuestion].type ?? 'choice') === 'text') {
      setSkipped(true);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-2xl font-bold" style={{ color: 'hsla(187.82608696,42.99065421%,41.96078431%,1)' }}>
              <img
                alt="NGS Security"
                className="h-10 w-auto"
                loading="eager"
                src="../images/NGS+Logo__White.PNG"
              />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            NGS Property Readiness Assessment
          </h1>
          <p className="text-sm text-gray-600">
            Security & Cleaning Standards Evaluation
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: 'hsla(187.82608696,42.99065421%,41.96078431%,1)',
                width: `${progress}%`
              }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-6 leading-relaxed">
            {questions[currentQuestion].text}
          </h2>
          {/* Options or Text Input */}
          { (questions[currentQuestion].type ?? 'choice') === 'text' ? (
            <div>
              <textarea
                value={textAnswer}
                onChange={(e) => {
                  setTextAnswer(e.target.value);
                  if (e.target.value.trim() !== '') {
                    setSkipped(false);
                  }
                }}
                placeholder="Type your response here..."
                rows={4}
                className="w-full p-4 rounded-lg border-2 border-gray-200 text-gray-700 focus:outline-none focus:ring-2"
                style={{
                  // match brand color on focus ring using inline style fallbacks
                  boxShadow: 'none',
                }}
              />
              <p className="mt-2 text-sm text-gray-500">Please provide a brief description.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions[currentQuestion].options!.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`w-full p-4 text-left border-2 transition-all duration-200 cursor-pointer btn-angled ${
                    selectedOption === index
                      ? 'border-opacity-100 text-white'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                  style={{
                    backgroundColor: selectedOption === index
                      ? 'rgb(61, 141, 153)'
                      : 'transparent',
                    borderColor: selectedOption === index
                      ? 'rgb(61, 141, 153)'
                      : undefined,
                  }}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedOption === index ? 'border-white' : 'border-gray-400'
                    }`}>
                      {selectedOption === index && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 font-medium transition-colors cursor-pointer whitespace-nowrap btn-angled ${
              currentQuestion === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Back
          </button>

          <div className="flex items-center gap-3">
            {currentQuestion === questions.length - 1 && (
              <button
                onClick={handleSkip}
                className="px-6 py-3 font-medium transition-colors cursor-pointer whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200 btn-angled"
                title="Skip this question and finish"
              >
                Skip
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={
                (questions[currentQuestion].type ?? 'choice') === 'text'
                  ? textAnswer.trim() === '' && !skipped
                  : selectedOption === null
              }
              className={`px-8 py-3 font-medium transition-colors cursor-pointer whitespace-nowrap btn-angled ${
                ((questions[currentQuestion].type ?? 'choice') === 'text'
                  ? textAnswer.trim() === '' && !skipped
                  : selectedOption === null)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'text-white'
              }`}
              style={{
                backgroundColor:
                  ((questions[currentQuestion].type ?? 'choice') === 'text'
                    ? (textAnswer.trim() !== '' || skipped)
                    : selectedOption !== null)
                    ? 'rgb(61, 141, 153)'
                    : undefined,
              }}
              onMouseEnter={(e) => {
                const enabled = (questions[currentQuestion].type ?? 'choice') === 'text' ? (textAnswer.trim() !== '' || skipped) : selectedOption !== null;
                if (enabled) {
                  e.currentTarget.style.backgroundColor = 'rgb(54, 125, 136)';
                }
              }}
              onMouseLeave={(e) => {
                const enabled = (questions[currentQuestion].type ?? 'choice') === 'text' ? (textAnswer.trim() !== '' || skipped) : selectedOption !== null;
                if (enabled) {
                  e.currentTarget.style.backgroundColor = 'rgb(61, 141, 153)';
                }
              }}
            >
              {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center text-xs text-gray-400">
            <span className="font-semibold">NGS Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
