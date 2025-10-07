
import { useState, useEffect } from 'react';
import { getAdminStats, getAllAssessmentResponses, authenticateAdmin, getScoreDistribution, getRiskLevelDistribution, getCompletionTrend, getRecentActivity } from '../../lib/database';
import { ScoreDistributionChart, CompletionTrendChart, RiskLevelPieChart } from '../../components/base/Charts';
import TestConnection from '../../components/TestConnection';

interface AdminStats {
  totalAssessments: number;
  completedAssessments: number;
  consultationBookings: number;
  completionRate: number;
  conversionRate: number;
}

interface AssessmentResponse {
  id: string;
  status: string;
  total_score: number;
  risk_level: 'low' | 'medium' | 'high';
  completed_at: string;
  users: {
    first_name: string;
    last_name: string;
    email: string;
    company_name: string;
  } | null;
  assessment_responses: {
    question_id: number;
    question_text: string;
    answer_text: string;
    score: number;
  }[];
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'responses'>('dashboard');
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [stats, setStats] = useState<AdminStats>({
    totalAssessments: 0,
    completedAssessments: 0,
    consultationBookings: 0,
    completionRate: 0,
    conversionRate: 0
  });
  const [assessmentResponses, setAssessmentResponses] = useState<AssessmentResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<AssessmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({
    scoreDistribution: [],
    riskLevelData: [],
    completionTrend: []
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Check if already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsLoggedIn(true);
      loadStats();
      loadAssessmentResponses();
      loadChartData();
      loadRecentActivity();
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authenticateAdmin(loginData.username, loginData.password);
      
      if (result.success) {
        localStorage.setItem('adminToken', 'authenticated');
        setIsLoggedIn(true);
        await loadStats();
        await loadAssessmentResponses();
        await loadChartData();
        await loadRecentActivity();
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const realStats = await getAdminStats();
      setStats(realStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback to zeros if there's an error
      setStats({
        totalAssessments: 0,
        completedAssessments: 0,
        consultationBookings: 0,
        completionRate: 0,
        conversionRate: 0
      });
    }
  };

  const loadChartData = async () => {
    try {
      const [scoreDistribution, riskLevelData, completionTrend] = await Promise.all([
        getScoreDistribution(),
        getRiskLevelDistribution(),
        getCompletionTrend(7)
      ]);
      
      setChartData({
        scoreDistribution,
        riskLevelData,
        completionTrend
      });
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const activities = await getRecentActivity(10);
      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading recent activity:', error);
      setRecentActivity([]);
    }
  };

  const loadAssessmentResponses = async () => {
    try {
      const realResponses = await getAllAssessmentResponses();
      setAssessmentResponses(realResponses);
    } catch (error) {
      console.error('Error loading assessment responses:', error);
      setAssessmentResponses([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setCurrentView('dashboard');
    setLoginData({ username: '', password: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'LOW RISK';
      case 'medium': return 'MEDIUM RISK';
      case 'high': return 'HIGH RISK';
      default: return 'UNKNOWN';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="text-3xl font-bold mb-2" style={{ color: 'hsla(187.82608696,42.99065421%,41.96078431%,1)' }}>
              NGS
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Admin Login</h1>
            <p className="text-gray-600 mt-2">Access your assessment dashboard</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(61,141,153)] focus:ring-opacity-50"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(61,141,153)] focus:ring-opacity-50"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 font-semibold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 btn-angled"
              style={{ backgroundColor: 'rgb(61, 141, 153)' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgb(54, 125, 136)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgb(61, 141, 153)')}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Supabase Connection Test - Only in Admin */}
      <TestConnection />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-8" style={{ color: 'hsla(187.82608696,42.99065421%,41.96078431%,1)' }}>
                NGS
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 font-medium transition-colors cursor-pointer whitespace-nowrap btn-angled ${
                    currentView === 'dashboard'
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={{
                    backgroundColor: currentView === 'dashboard' 
                      ? 'rgb(61, 141, 153)'
                      : 'transparent'
                  }}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('responses')}
                  className={`px-4 py-2 font-medium transition-colors cursor-pointer whitespace-nowrap btn-angled ${
                    currentView === 'responses'
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={{
                    backgroundColor: currentView === 'responses' 
                      ? 'rgb(61, 141, 153)'
                      : 'transparent'
                  }}
                >
                  Assessment Responses
                </button>
              </nav>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-logout-box-line mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      {currentView === 'dashboard' && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: 'hsla(187.82608696,42.99065421%,41.96078431%,0.1)' }}>
                  <i className="ri-file-list-3-line text-2xl" style={{ color: 'hsla(187.82608696,42.99065421%,41.96078431%,1)' }}></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: 'hsla(120,60%,50%,0.1)' }}>
                  <i className="ri-checkbox-circle-line text-2xl text-green-600"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedAssessments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: 'hsla(45,100%,50%,0.1)' }}>
                  <i className="ri-calendar-check-line text-2xl text-yellow-600"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Consultations Booked</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.consultationBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: 'hsla(270,60%,50%,0.1)' }}>
                  <i className="ri-percent-line text-2xl text-purple-600"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Assessment Funnel */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Assessment Funnel</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Started Assessment</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="h-2 rounded-full" style={{ backgroundColor: 'hsla(187.82608696,42.99065421%,41.96078431%,1)', width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12">{stats.totalAssessments}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed Assessment</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: `${stats.completionRate}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12">{stats.completedAssessments}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Booked Consultation</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div className="h-2 rounded-full bg-yellow-500" style={{ width: `${stats.conversionRate}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12">{stats.consultationBookings}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Key Performance Indicators</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-lg font-bold text-gray-900">{stats.completionRate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">of started assessments</p>
                    <p className="text-sm text-green-600 font-medium">+5.2% vs last month</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-lg font-bold text-gray-900">{stats.conversionRate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">to consultation bookings</p>
                    <p className="text-sm text-green-600 font-medium">+2.8% vs last month</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Drop-off Rate</p>
                    <p className="text-lg font-bold text-gray-900">{(100 - stats.completionRate).toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">abandoned assessments</p>
                    <p className="text-sm text-red-600 font-medium">-3.1% vs last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Activity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">{activity.date}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{activity.activity}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{activity.user}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            activity.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                            activity.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                        No recent activity found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Responses View */}
      {currentView === 'responses' && (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {!selectedResponse ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Responses</h2>
                <p className="text-gray-600">View detailed responses from completed assessments</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium text-gray-600">User</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-600">Email</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-600">Completed</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-600">Score</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-600">Risk Level</th>
                        <th className="text-left py-4 px-6 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessmentResponses.map((response) => (
                        <tr key={response.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">
                            {response.users ? `${response.users.first_name} ${response.users.last_name}` : 'Unknown User'}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {response.users?.email || 'No email'}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {formatDate(response.completed_at)}
                          </td>
                          <td className="py-4 px-6 text-sm font-bold text-gray-900">{response.total_score}%</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(response.total_score)} ${
                              response.total_score >= 70 ? 'bg-green-100' : 
                              response.total_score >= 40 ? 'bg-yellow-100' : 'bg-red-100'
                            }`}>
                              {getScoreLabel(response.risk_level)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => setSelectedResponse(response)}
                              className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                              style={{ backgroundColor: 'hsla(187.82608696,42.99065421%,41.96078431%,1)' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsla(187.82608696,42.99065421%,36.96078431%,1)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsla(187.82608696,42.99065421%,41.96078431%,1)'}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8 flex items-center">
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap mr-4"
                >
                  <i className="ri-arrow-left-line mr-2"></i>
                  Back to List
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Assessment Details</h2>
                  <p className="text-gray-600">
                    {selectedResponse.users ? `${selectedResponse.users.first_name} ${selectedResponse.users.last_name} - ${selectedResponse.users.email}` : 'Unknown User'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Summary Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Completed Date</p>
                      <p className="font-medium text-gray-900">{formatDate(selectedResponse.completed_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Overall Score</p>
                      <p className={`text-2xl font-bold ${getScoreColor(selectedResponse.total_score)}`}>
                        {selectedResponse.total_score}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Risk Level</p>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getScoreColor(selectedResponse.total_score)} ${
                        selectedResponse.total_score >= 70 ? 'bg-green-100' : 
                        selectedResponse.total_score >= 40 ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {getScoreLabel(selectedResponse.risk_level)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detailed Responses */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Question Responses</h3>
                  <div className="space-y-6">
                    {selectedResponse.assessment_responses.map((response, index) => (
                      <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="mb-3">
                          <p className="font-medium text-gray-800 mb-2">
                            Question {response.question_id}: {response.question_text}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-gray-600">
                              <span className="font-medium">Answer:</span> {response.answer_text}
                            </p>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 mr-2">Score:</span>
                              <span className={`font-bold ${
                                response.score >= 3 ? 'text-green-600' :
                                response.score >= 2 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {response.score}/3
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              response.score >= 3 ? 'bg-green-500' :
                              response.score >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(response.score / 3) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
