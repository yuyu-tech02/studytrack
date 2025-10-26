import { useState, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useStudySessions } from '@/hooks/useStudySessions'
import { AddSessionModal } from '@/components/AddSessionModal'
import { SessionList } from '@/components/SessionList'
import { DailyChart, SubjectChart } from '@/components/Charts'
import { StatsCards } from '@/components/StatsCards'
import { SessionFormData, StudySession } from '@/types'
import {
  calculateDailyStats,
  calculateSubjectStats,
  calculateOverallStats
} from '@/utils/statistics'
import { isToday, parseISO } from 'date-fns'

export const Dashboard = () => {
  const { user, signOut } = useAuth()
  const {
    sessions,
    loading,
    addSession,
    updateSession,
    deleteSession,
    syncPendingSessions
  } = useStudySessions(user?.id)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<StudySession | null>(null)
  const [period, setPeriod] = useState<7 | 30>(7)

  // 統計データの計算
  const dailyStats = useMemo(() => calculateDailyStats(sessions, period), [sessions, period])
  const subjectStats = useMemo(() => calculateSubjectStats(sessions), [sessions])
  const overallStats = useMemo(() => calculateOverallStats(sessions), [sessions])

  const todayMinutes = useMemo(() => {
    return sessions
      .filter(s => isToday(parseISO(s.started_at)))
      .reduce((sum, s) => sum + s.minutes, 0)
  }, [sessions])

  const handleAddSession = async (data: SessionFormData) => {
    if (editingSession) {
      await updateSession(editingSession.id, data)
      setEditingSession(null)
    } else {
      await addSession(data)
    }
    setIsModalOpen(false)
  }

  const handleEdit = (session: StudySession) => {
    setEditingSession(session)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSession(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-navy-900 dark:text-white">StudyTrack</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => syncPendingSessions()}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-400 transition"
                title="同期"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 統計カード */}
        <StatsCards stats={overallStats} todayMinutes={todayMinutes} />

        {/* グラフセクション */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">学習時間推移</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPeriod(7)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    period === 7
                      ? 'bg-primary-400 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  週
                </button>
                <button
                  onClick={() => setPeriod(30)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    period === 30
                      ? 'bg-primary-400 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  月
                </button>
              </div>
            </div>
            <DailyChart data={dailyStats} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              科目別学習時間
            </h2>
            <SubjectChart data={subjectStats} />
          </div>
        </div>

        {/* 学習記録リスト */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            最近の学習記録
          </h2>
          <SessionList sessions={sessions.slice(0, 10)} onEdit={handleEdit} onDelete={deleteSession} />
        </div>
      </main>

      {/* FABボタン */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary-400 hover:bg-primary-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition duration-200 flex items-center justify-center"
        title="学習記録を追加"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* モーダル */}
      <AddSessionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddSession}
        initialData={
          editingSession
            ? {
                ...editingSession,
                started_at: new Date(editingSession.started_at)
              }
            : undefined
        }
      />
    </div>
  )
}
