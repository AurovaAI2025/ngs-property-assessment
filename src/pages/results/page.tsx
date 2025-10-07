import { useState, useEffect } from 'react';
import type { PropertyReadinessAnalysis } from '../../lib/riskAnalysis';
import { ASSESSMENT_CATEGORIES } from '../../lib/riskAnalysis';

export default function Results() {
  const [assessmentResults, setAssessmentResults] = useState<PropertyReadinessAnalysis | null>(null);

  useEffect(() => {
    // Get results from session storage
    const resultsStr = sessionStorage.getItem('assessmentResults');
    if (resultsStr) setAssessmentResults(JSON.parse(resultsStr));
  }, []);

  // Helper functions for dynamic content
  const getLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelText = (level: 'low' | 'medium' | 'high', area: 'security' | 'cleaning') => {
    if (area === 'security') {
      switch (level) {
        case 'low': return 'HIGH RISK';
        case 'medium': return 'MEDIUM RISK';
        case 'high': return 'LOW RISK';
        default: return 'UNKNOWN';
      }
    } else {
      switch (level) {
        case 'low': return 'FALLING SHORT';
        case 'medium': return 'INCONSISTENT';
        case 'high': return 'WELL MANAGED';
        default: return 'UNKNOWN';
      }
    }
  };

  const getOverallMessage = (securityLevel: 'low' | 'medium' | 'high') => {
    if (securityLevel === 'low') {
      return {
        title: 'Your property is at risk.',
        description: 'Your score indicates critical gaps in your current security measures. These vulnerabilities may place residents, staff, and assets at risk.'
      };
    } else if (securityLevel === 'medium') {
      return {
        title: 'Your property has a foundation, but gaps remain.',
        description: 'While certain measures are in place, there are still areas of vulnerability that may be lowering resident confidence and creating risks.'
      };
    } else {
      return {
        title: 'Your property is well-prepared.',
        description: 'Your score indicates strong existing security measures with good coverage, monitoring, and resident confidence.'
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div 
        className="relative py-20 px-6"
        style={{
          background: 'linear-gradient(135deg, #40E0D0 0%, #48CAE4 50%, #0077BE 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto text-white">
          <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Thank you for completing the<br />
            <span className="text-gray-800">Security Readiness Questionnaire!</span>
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Below is a breakdown of your scores across key categories: Access Control, Security, Staffing & Response, Technology & Monitoring, and Resident Experience & Safety Culture. Your results highlight areas of strength and opportunities for improvement.
          </p>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {assessmentResults ? (
            <>
              {/* Overall Scores */}
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Property Readiness Score</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Security Readiness Score */}
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Security Readiness</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{assessmentResults.securityScore}%</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getLevelColor(assessmentResults.securityLevel)}`}>
                      {getLevelText(assessmentResults.securityLevel, 'security')}
                    </div>
                  </div>
                  
                  {/* Cleaning Standards Score */}
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Cleaning Standards</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{assessmentResults.cleaningScore}%</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getLevelColor(assessmentResults.cleaningLevel)}`}>
                      {getLevelText(assessmentResults.cleaningLevel, 'cleaning')}
                    </div>
                  </div>
                </div>
                
                {/* Overall Message */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {getOverallMessage(assessmentResults.securityLevel).title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {getOverallMessage(assessmentResults.securityLevel).description}
                  </p>
                </div>
                 {/* Centered CTA Button: Book a Consultation (Calendly link) */}
                <div className="flex justify-center mb-6">
                  <a
                    className="btn-ngs"
                    href="https://calendly.com/ngssecurity-sales/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book a Consultation
                  </a>
                </div>
              </div>

              {/* Detailed Category Breakdown */}
              <div className="space-y-6 mb-12">
               
                <h3 className="text-xl font-bold text-gray-800 text-center mb-6">Detailed Category Analysis</h3>
                
                {Object.entries(assessmentResults.categoryBreakdown)
                  .filter(([categoryId]) => ASSESSMENT_CATEGORIES[categoryId]) // Only show valid categories
                  .map(([categoryId, breakdown]) => {
                    const category = ASSESSMENT_CATEGORIES[categoryId];
                    const iconMap: { [key: string]: string } = {
                      'security_staffing': 'ri-user-settings-line',
                      'access_control': 'ri-shield-check-line', 
                      'technology_monitoring': 'ri-computer-line',
                      'resident_experience': 'ri-community-line',
                      'cleaning_facilities': 'ri-brush-line'
                    };
                    
                    return (
                      <div key={categoryId} 
                        className="rounded-lg p-6 text-white"
                        style={{ backgroundColor: 'rgb(61, 141, 153)' }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                              <i className={`${iconMap[categoryId] || 'ri-star-line'} text-2xl`}></i>
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">{category.name}</h3>
                              <p className="text-sm opacity-75">{breakdown.score}/{breakdown.maxScore} points ({breakdown.percentage}%)</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                            category.scoringArea === 'security' ? getLevelColor(assessmentResults.securityLevel) : getLevelColor(assessmentResults.cleaningLevel)
                          }`}>
                            {category.scoringArea === 'security' 
                              ? getLevelText(breakdown.level, 'security') 
                              : getLevelText(breakdown.level, 'cleaning')
                            }
                          </div>
                        </div>
                        
                        {/* Strengths */}
                        {breakdown.strengths && breakdown.strengths.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-semibold mb-2 text-green-200">✓ Strengths:</h4>
                            <ul className="text-sm opacity-90 space-y-1">
                              {breakdown.strengths.map((strength: string, index: number) => (
                                <li key={index}>• {strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Improvements */}
                        {breakdown.improvements && breakdown.improvements.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-yellow-200">⚠ Areas for Improvement:</h4>
                            <ul className="text-sm opacity-90 space-y-1">
                              {breakdown.improvements.map((improvement: string, index: number) => (
                                <li key={index}>• {improvement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })
                }
              </div>
              
              {/* Priority Recommendations */}
              {assessmentResults.overallRecommendations?.priority && assessmentResults.overallRecommendations.priority.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-400 mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 Priority Actions</h3>
                  <ul className="space-y-2">
                    {assessmentResults.overallRecommendations.priority.map((action, index) => (
                      <li key={index} className="text-gray-700 font-medium">• {action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading your results...</h2>
              <p className="text-gray-600">Please wait while we analyze your assessment.</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className="py-20 px-6 text-white"
        style={{ backgroundColor: 'rgb(61, 141, 153)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img
              alt="NGS Security"
              className="h-10 w-auto"
              loading="eager"
              src="https://images.squarespace-cdn.com/content/v1/63a061087c044706137df0b8/b08f0a7c-3dca-4e5c-ab8c-d9a4e4819a1e/NGS+Logo__White.png"
            />
          </div>
          <h3 className="text-3xl font-bold mb-6">
            Protect Your Residents, Strengthen Your Property.
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Your score shows where improvements can be made. Don't leave gaps that put residents, 
            guests or assets at risk.
          </p>
          <p className="text-lg opacity-90 mb-8">
            Based on your Security Readiness Score, there are clear opportunities to strengthen safety, compliance, and resident confidence.
          </p>
          
          <div className="bg-yellow-400 text-gray-800 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h4 className="text-xl font-bold mb-4">Book a free consultation with NGS security and receive:</h4>
            <ul className="text-left space-y-2">
              <li>• Personalised advice on improving your current security and monitoring your residents' experience</li>
              <li>• Priority access to our security specialists and expert advice</li>
              <li>• Flexible installation schedules to suit your property and resident needs</li>
            </ul>
          </div>

          {/* Single centered Calendly button */}
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center">
              <a 
                className="bg-white text-lg font-semibold px-8 py-4 transition-colors cursor-pointer whitespace-nowrap hover:bg-gray-100 btn-angled"
            style={{ color: 'hsla(187.82608696,42.99065421%,41.96078431%,1)' }}
                href="https://calendly.com/ngssecurity-sales/30min"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Consultation
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold mr-8"><img alt="NGS Security" className="h-10 w-auto" loading="eager" src="https://images.squarespace-cdn.com/content/v1/63a061087c044706137df0b8/b08f0a7c-3dca-4e5c-ab8c-d9a4e4819a1e/NGS+Logo__White.png?format=1500w" /></div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end text-xs text-gray-400 mb-2">
              <span className="font-semibold">NGS Security </span>
            </div>
            <p className="text-xs text-gray-400">© 2024 NGS Security. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
