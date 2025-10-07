import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hpincvncnpgmqcriahta.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaW5jdm5jbnBnbXFjcmlhaHRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MzgwODAsImV4cCI6MjA3NTQxNDA4MH0.gh0zhX6QCXDpOc4gloQ0wSM1gMpgtsst1Y1fpaMZSic'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          company_name: string
          phone: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          company_name: string
          phone?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          company_name?: string
          phone?: string
          created_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          status: 'started' | 'completed' | 'abandoned'
          total_score: number
          risk_level: 'low' | 'medium' | 'high'
          started_at: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'started' | 'completed' | 'abandoned'
          total_score?: number
          risk_level?: 'low' | 'medium' | 'high'
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'started' | 'completed' | 'abandoned'
          total_score?: number
          risk_level?: 'low' | 'medium' | 'high'
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
      }
      assessment_responses: {
        Row: {
          id: string
          assessment_id: string
          question_id: number
          question_text: string
          answer_text: string
          score: number
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          question_id: number
          question_text: string
          answer_text: string
          score: number
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          question_id?: number
          question_text?: string
          answer_text?: string
          score?: number
          created_at?: string
        }
      }
      consultations: {
        Row: {
          id: string
          assessment_id: string
          user_id: string
          name: string
          email: string
          phone: string
          company: string
          message: string
          status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          user_id: string
          name: string
          email: string
          phone: string
          company?: string
          message?: string
          status?: 'pending' | 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string
          company?: string
          message?: string
          status?: 'pending' | 'scheduled' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          username: string
          email: string
          password_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password_hash?: string
          created_at?: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Assessment = Database['public']['Tables']['assessments']['Row']
export type AssessmentResponse = Database['public']['Tables']['assessment_responses']['Row']
export type Consultation = Database['public']['Tables']['consultations']['Row']
export type Admin = Database['public']['Tables']['admins']['Row']