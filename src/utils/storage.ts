import { StudySession } from '@/types'

const STORAGE_KEY = 'studytrack_sessions'
const PENDING_SYNC_KEY = 'studytrack_pending_sync'

export const localStorageUtils = {
  // ローカルストレージにセッションを保存
  saveSessions: (sessions: StudySession[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    } catch (error) {
      console.error('Failed to save sessions to localStorage:', error)
    }
  },

  // ローカルストレージからセッションを取得
  getSessions: (): StudySession[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to get sessions from localStorage:', error)
      return []
    }
  },

  // 同期待ちのセッションを保存
  savePendingSync: (sessions: StudySession[]) => {
    try {
      localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(sessions))
    } catch (error) {
      console.error('Failed to save pending sync sessions:', error)
    }
  },

  // 同期待ちのセッションを取得
  getPendingSync: (): StudySession[] => {
    try {
      const data = localStorage.getItem(PENDING_SYNC_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to get pending sync sessions:', error)
      return []
    }
  },

  // 同期待ちのセッションをクリア
  clearPendingSync: () => {
    try {
      localStorage.removeItem(PENDING_SYNC_KEY)
    } catch (error) {
      console.error('Failed to clear pending sync sessions:', error)
    }
  },

  // すべてのデータをクリア
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(PENDING_SYNC_KEY)
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }
}
