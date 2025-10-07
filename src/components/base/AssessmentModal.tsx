import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, createAssessment } from '../../lib/database';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssessmentModal({ isOpen, onClose }: AssessmentModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create or get existing user in database
      const user = await createUser({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        phone: formData.phone
      });

      // Create new assessment in database
      const assessment = await createAssessment(user.id);

      // Store user and assessment data in sessionStorage for the assessment flow
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      sessionStorage.setItem('currentAssessment', JSON.stringify(assessment));

      onClose();
      navigate('/assessment');
    } catch (error) {
      console.error('Error creating user/assessment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Provide more helpful error messages
      if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        alert('It looks like you already have an assessment with this email. Please use a different email or contact support.');
      } else if (errorMessage.includes('connection') || errorMessage.includes('network')) {
        alert('Network connection error. Please check your internet connection and try again.');
      } else {
        alert(`There was an error starting your assessment: ${errorMessage}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          <i className="ri-close-line"></i>
        </button>
        
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm mb-4">
            Enter your details below to start the Assessment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First name *"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(61,141,153)] focus:ring-opacity-50"
              />
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last name *"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(61,141,153)] focus:ring-opacity-50"
              />
            </div>
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(61,141,153)] focus:ring-opacity-50"
            />
          </div>

          <div>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name *"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(61,141,153)] focus:ring-opacity-50"
            />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-2 flex items-center">
              <img 
                src="https://flagcdn.com/w20/gb.png" 
                alt="UK" 
                className="w-4 h-3 mr-2"
              />
              <span className="text-gray-600 text-sm">+44</span>
              <div className="w-px h-4 bg-gray-300 ml-2"></div>
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="07000 123456"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-20 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(61,141,153)] focus:ring-opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap btn-angled disabled:opacity-50"
            style={{ backgroundColor: loading ? '#94a3b8' : 'rgb(61, 141, 153)' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgb(54, 125, 136)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgb(61, 141, 153)')}
          >
            {loading ? 'Starting Assessment...' : 'Start'}
          </button>
        </form>

        <div className="mt-4 text-right">
          <div className="flex items-center justify-end text-xs text-gray-400">
            <span className="font-semibold">NGS Security Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}
