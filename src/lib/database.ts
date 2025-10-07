import { supabase } from './supabase'
import type { User, Assessment, AssessmentResponse, Consultation } from './supabase'

// User Management
export const createUser = async (userData: {
  email: string
  firstName: string
  lastName: string
  companyName: string
  phone?: string
}) => {
  // First check if user already exists
  const existingUser = await getUserByEmail(userData.email)
  if (existingUser) {
    return existingUser // Return existing user instead of error
  }
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      company_name: userData.companyName,
      phone: userData.phone || ''
    })
    .select()
    .single()

  if (error) {
    // Handle duplicate email error specifically
    if (error.code === '23505') {
      // Try to get the user again (race condition)
      const user = await getUserByEmail(userData.email)
      if (user) return user
    }
    throw error
  }
  return data
}

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Assessment Management
export const createAssessment = async (userId: string) => {
  const { data, error } = await supabase
    .from('assessments')
    .insert({
      user_id: userId,
      status: 'started',
      started_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateAssessment = async (
  assessmentId: string, 
  updates: {
    status?: 'started' | 'completed' | 'abandoned'
    total_score?: number
    risk_level?: 'low' | 'medium' | 'high'
    completed_at?: string
  }
) => {
  const { data, error } = await supabase
    .from('assessments')
    .update(updates)
    .eq('id', assessmentId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getAssessmentById = async (assessmentId: string) => {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', assessmentId)
    .single()

  if (error) throw error
  return data
}

// Assessment Responses
export const saveAssessmentResponse = async (responseData: {
  assessmentId: string
  questionId: number
  questionText: string
  answerText: string
  score: number
}) => {
  const { data, error } = await supabase
    .from('assessment_responses')
    .upsert({
      assessment_id: responseData.assessmentId,
      question_id: responseData.questionId,
      question_text: responseData.questionText,
      answer_text: responseData.answerText,
      score: responseData.score
    }, {
      onConflict: 'assessment_id,question_id'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getAssessmentResponses = async (assessmentId: string) => {
  const { data, error } = await supabase
    .from('assessment_responses')
    .select('*')
    .eq('assessment_id', assessmentId)
    .order('question_id', { ascending: true })

  if (error) throw error
  return data || []
}

// Consultation Bookings
export const createConsultation = async (consultationData: {
  assessmentId: string
  userId: string
  name: string
  email: string
  phone: string
  company?: string
  message?: string
}) => {
  const { data, error } = await supabase
    .from('consultations')
    .insert({
      assessment_id: consultationData.assessmentId,
      user_id: consultationData.userId,
      name: consultationData.name,
      email: consultationData.email,
      phone: consultationData.phone,
      company: consultationData.company || '',
      message: consultationData.message || '',
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Admin Dashboard Queries
export const getAdminStats = async () => {
  // Get total assessments
  const { count: totalAssessments } = await supabase
    .from('assessments')
    .select('*', { count: 'exact', head: true })

  // Get completed assessments
  const { count: completedAssessments } = await supabase
    .from('assessments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')

  // Get consultation bookings
  const { count: consultationBookings } = await supabase
    .from('consultations')
    .select('*', { count: 'exact', head: true })

  const completionRate = totalAssessments ? (completedAssessments! / totalAssessments! * 100) : 0
  const conversionRate = completedAssessments ? (consultationBookings! / completedAssessments! * 100) : 0

  return {
    totalAssessments: totalAssessments || 0,
    completedAssessments: completedAssessments || 0,
    consultationBookings: consultationBookings || 0,
    completionRate: Math.round(completionRate * 10) / 10,
    conversionRate: Math.round(conversionRate * 10) / 10
  }
}

export const getAllAssessmentResponses = async () => {
  const { data, error } = await supabase
    .from('assessments')
    .select(`
      id,
      status,
      total_score,
      risk_level,
      completed_at,
      users (
        first_name,
        last_name,
        email,
        company_name
      ),
      assessment_responses (
        question_id,
        question_text,
        answer_text,
        score
      )
    `)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const getScoreDistribution = async () => {
  const { data, error } = await supabase
    .from('assessments')
    .select('total_score')
    .eq('status', 'completed')

  if (error) throw error

  const scores = data || []
  const distribution = {
    '0-25': 0,
    '26-50': 0,
    '51-75': 0,
    '76-100': 0
  }

  scores.forEach(assessment => {
    const score = assessment.total_score
    if (score >= 0 && score <= 25) distribution['0-25']++
    else if (score >= 26 && score <= 50) distribution['26-50']++
    else if (score >= 51 && score <= 75) distribution['51-75']++
    else if (score >= 76 && score <= 100) distribution['76-100']++
  })

  return [
    { scoreRange: '0-25', count: distribution['0-25'], percentage: 0 },
    { scoreRange: '26-50', count: distribution['26-50'], percentage: 0 },
    { scoreRange: '51-75', count: distribution['51-75'], percentage: 0 },
    { scoreRange: '76-100', count: distribution['76-100'], percentage: 0 }
  ]
}

export const getRiskLevelDistribution = async () => {
  const { data, error } = await supabase
    .from('assessments')
    .select('risk_level')
    .eq('status', 'completed')

  if (error) throw error

  const assessments = data || []
  const distribution = { high: 0, medium: 0, low: 0 }

  assessments.forEach(assessment => {
    if (assessment.risk_level) {
      distribution[assessment.risk_level]++
    }
  })

  return [
    { name: 'High Risk', value: distribution.high, color: '#ef4444' },
    { name: 'Medium Risk', value: distribution.medium, color: '#f59e0b' },
    { name: 'Low Risk', value: distribution.low, color: '#10b981' }
  ]
}

export const getCompletionTrend = async (days: number = 7) => {
  const { data, error } = await supabase
    .from('assessments')
    .select('created_at, completed_at, status')
    .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true })

  if (error) throw error

  const assessments = data || []
  const trendData: { date: string; started: number; completed: number }[] = []

  // Group by date
  const dateGroups: { [key: string]: { started: number; completed: number } } = {}

  assessments.forEach(assessment => {
    const date = new Date(assessment.created_at).toISOString().split('T')[0]
    if (!dateGroups[date]) {
      dateGroups[date] = { started: 0, completed: 0 }
    }
    
    dateGroups[date].started++
    if (assessment.status === 'completed') {
      dateGroups[date].completed++
    }
  })

  // Convert to array format
  Object.entries(dateGroups).forEach(([date, counts]) => {
    trendData.push({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      started: counts.started,
      completed: counts.completed
    })
  })

  return trendData
}

// Get recent activity for admin dashboard
export const getRecentActivity = async (limit: number = 10) => {
  try {
    // Get recent assessments and consultations
    const { data: recentAssessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select(`
        id,
        status,
        created_at,
        completed_at,
        users (
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit / 2);

    if (assessmentsError) throw assessmentsError;

    const { data: recentConsultations, error: consultationsError } = await supabase
      .from('consultations')
      .select(`
        id,
        name,
        email,
        status,
        created_at,
        users (
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit / 2);

    if (consultationsError) throw consultationsError;

    // Combine and format activities
    const activities = [];

    // Add assessment activities
    (recentAssessments || []).forEach(assessment => {
      const activityDate = assessment.completed_at || assessment.created_at;
      activities.push({
        id: `assessment_${assessment.id}`,
        date: new Date(activityDate).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        activity: assessment.status === 'completed' ? 'Assessment Completed' : 'Assessment Started',
        user: assessment.users?.email || 'Unknown User',
        status: assessment.status === 'completed' ? 'Completed' : assessment.status === 'started' ? 'In Progress' : 'Abandoned',
        type: 'assessment',
        rawDate: activityDate  // Keep raw date for sorting
      });
    });

    // Add consultation activities
    (recentConsultations || []).forEach(consultation => {
      activities.push({
        id: `consultation_${consultation.id}`,
        date: new Date(consultation.created_at).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        activity: 'Consultation Booked',
        user: consultation.email,
        status: consultation.status === 'pending' ? 'Scheduled' : consultation.status,
        type: 'consultation',
        rawDate: consultation.created_at  // Keep raw date for sorting
      });
    });

    // Sort by date (most recent first) and limit
    activities.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
    
    return activities.slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
};

// Admin Authentication
export const authenticateAdmin = async (username: string, password: string) => {
  // For demo purposes, we'll use a simple check
  // In production, you should hash passwords and store them properly
  if (username === 'admin' && password === 'admin123') {
    return { success: true, admin: { id: '1', username: 'admin' } }
  }
  return { success: false, admin: null }
}
