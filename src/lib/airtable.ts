// Alternative: Airtable Integration
// Super simple setup - just need API key and base ID

const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY || 'your-api-key';
const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID || 'your-base-id';
const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

const headers = {
  'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json'
};

// Create User
export const createUser = async (userData: {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone?: string;
}) => {
  const response = await fetch(`${AIRTABLE_URL}/Users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      records: [{
        fields: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          companyName: userData.companyName,
          phone: userData.phone || '',
          createdAt: new Date().toISOString()
        }
      }]
    })
  });
  
  const data = await response.json();
  return data.records[0];
};

// Save Assessment Response
export const saveAssessmentResponse = async (responseData: {
  assessmentId: string;
  questionId: number;
  questionText: string;
  answerText: string;
  score: number;
}) => {
  const response = await fetch(`${AIRTABLE_URL}/Responses`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      records: [{
        fields: {
          assessmentId: responseData.assessmentId,
          questionId: responseData.questionId,
          questionText: responseData.questionText,
          answerText: responseData.answerText,
          score: responseData.score,
          createdAt: new Date().toISOString()
        }
      }]
    })
  });
  
  return await response.json();
};

// Get Admin Stats
export const getAdminStats = async () => {
  // Get all assessments
  const assessmentsResponse = await fetch(`${AIRTABLE_URL}/Assessments`, {
    headers
  });
  const assessments = await assessmentsResponse.json();
  
  // Get all consultations
  const consultationsResponse = await fetch(`${AIRTABLE_URL}/Consultations`, {
    headers
  });
  const consultations = await consultationsResponse.json();
  
  const totalAssessments = assessments.records?.length || 0;
  const completedAssessments = assessments.records?.filter((r: any) => r.fields.status === 'completed').length || 0;
  const consultationBookings = consultations.records?.length || 0;
  
  return {
    totalAssessments,
    completedAssessments,
    consultationBookings,
    completionRate: totalAssessments > 0 ? (completedAssessments / totalAssessments * 100) : 0,
    conversionRate: completedAssessments > 0 ? (consultationBookings / completedAssessments * 100) : 0
  };
};