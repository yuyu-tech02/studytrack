export interface Profile {
  id: string
  display_name: string
  created_at: string
}

export interface StudySession {
  id: string
  user_id: string
  subject: string
  minutes: number
  started_at: string
  note?: string
  created_at: string
  synced?: boolean // ローカルのみ（オフライン時）
}

export interface SessionFormData {
  subject: string
  minutes: number
  started_at: Date
  note?: string
}

export interface DailyStats {
  date: string
  totalMinutes: number
  subjects: { [key: string]: number }
}

export interface SubjectStats {
  subject: string
  totalMinutes: number
  percentage: number
}

export interface OverallStats {
  totalMinutes: number
  totalSessions: number
  averageMinutesPerDay: number
  consecutiveDays: number
  favoriteSubject: string
}
