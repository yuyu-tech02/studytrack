import { StudySession, DailyStats, SubjectStats, OverallStats } from '@/types'
import { format, startOfDay, subDays, isSameDay, parseISO } from 'date-fns'

export const calculateDailyStats = (
  sessions: StudySession[],
  days: number = 7
): DailyStats[] => {
  const stats: DailyStats[] = []
  const today = startOfDay(new Date())

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i)
    const dateStr = format(date, 'yyyy-MM-dd')

    const daySessions = sessions.filter(session => {
      const sessionDate = startOfDay(parseISO(session.started_at))
      return isSameDay(sessionDate, date)
    })

    const subjects: { [key: string]: number } = {}
    let totalMinutes = 0

    daySessions.forEach(session => {
      subjects[session.subject] = (subjects[session.subject] || 0) + session.minutes
      totalMinutes += session.minutes
    })

    stats.push({ date: dateStr, totalMinutes, subjects })
  }

  return stats
}

export const calculateSubjectStats = (sessions: StudySession[]): SubjectStats[] => {
  const subjectMap: { [key: string]: number } = {}
  let totalMinutes = 0

  sessions.forEach(session => {
    subjectMap[session.subject] = (subjectMap[session.subject] || 0) + session.minutes
    totalMinutes += session.minutes
  })

  return Object.entries(subjectMap)
    .map(([subject, minutes]) => ({
      subject,
      totalMinutes: minutes,
      percentage: totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes)
}

export const calculateOverallStats = (sessions: StudySession[]): OverallStats => {
  if (sessions.length === 0) {
    return {
      totalMinutes: 0,
      totalSessions: 0,
      averageMinutesPerDay: 0,
      consecutiveDays: 0,
      favoriteSubject: ''
    }
  }

  // 総学習時間
  const totalMinutes = sessions.reduce((sum, session) => sum + session.minutes, 0)

  // 総セッション数
  const totalSessions = sessions.length

  // 科目別集計
  const subjectStats = calculateSubjectStats(sessions)
  const favoriteSubject = subjectStats[0]?.subject || ''

  // 日付の重複を排除して学習日を取得
  const studyDates = Array.from(
    new Set(
      sessions.map(session => format(startOfDay(parseISO(session.started_at)), 'yyyy-MM-dd'))
    )
  ).sort()

  // 連続学習日数を計算
  let consecutiveDays = 0
  const today = startOfDay(new Date())
  let currentDate = today

  for (let i = 0; i < 365; i++) {
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    if (studyDates.includes(dateStr)) {
      consecutiveDays++
      currentDate = subDays(currentDate, 1)
    } else {
      break
    }
  }

  // 平均学習時間（学習日のみ）
  const averageMinutesPerDay = studyDates.length > 0 ? totalMinutes / studyDates.length : 0

  return {
    totalMinutes,
    totalSessions,
    averageMinutesPerDay: Math.round(averageMinutesPerDay),
    consecutiveDays,
    favoriteSubject
  }
}

export const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) {
    return `${mins}分`
  } else if (mins === 0) {
    return `${hours}時間`
  } else {
    return `${hours}時間${mins}分`
  }
}
