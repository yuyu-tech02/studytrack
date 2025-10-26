import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { StudySession, SessionFormData } from '@/types'
import { localStorageUtils } from '@/utils/storage'
import toast from 'react-hot-toast'

export const useStudySessions = (userId: string | undefined) => {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // セッションを取得
  const fetchSessions = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })

      if (error) throw error

      setSessions(data || [])
      localStorageUtils.saveSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
      // オフライン時はローカルストレージから取得
      const localSessions = localStorageUtils.getSessions()
      setSessions(localSessions)
      toast.error('オフラインモードで動作しています')
    } finally {
      setLoading(false)
    }
  }

  // 新規セッションを追加
  const addSession = async (formData: SessionFormData) => {
    if (!userId) {
      toast.error('ログインが必要です')
      return
    }

    const newSession: Omit<StudySession, 'id' | 'created_at'> = {
      user_id: userId,
      subject: formData.subject,
      minutes: formData.minutes,
      started_at: formData.started_at.toISOString(),
      note: formData.note
    }

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([newSession])
        .select()
        .single()

      if (error) throw error

      setSessions(prev => [data, ...prev])
      localStorageUtils.saveSessions([data, ...sessions])
      toast.success('学習記録を追加しました')
    } catch (error) {
      console.error('Error adding session:', error)
      // オフライン時は一時保存
      const tempSession: StudySession = {
        ...newSession,
        id: `temp_${Date.now()}`,
        created_at: new Date().toISOString(),
        synced: false
      }
      setSessions(prev => [tempSession, ...prev])

      const pending = localStorageUtils.getPendingSync()
      localStorageUtils.savePendingSync([...pending, tempSession])
      toast.error('オフラインのため、後で同期されます')
    }
  }

  // セッションを更新
  const updateSession = async (id: string, formData: SessionFormData) => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          subject: formData.subject,
          minutes: formData.minutes,
          started_at: formData.started_at.toISOString(),
          note: formData.note
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setSessions(prev => prev.map(s => (s.id === id ? data : s)))
      toast.success('学習記録を更新しました')
    } catch (error) {
      console.error('Error updating session:', error)
      toast.error('更新に失敗しました')
    }
  }

  // セッションを削除
  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase.from('study_sessions').delete().eq('id', id)

      if (error) throw error

      setSessions(prev => prev.filter(s => s.id !== id))
      toast.success('学習記録を削除しました')
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error('削除に失敗しました')
    }
  }

  // 未同期データを同期
  const syncPendingSessions = async () => {
    if (!userId) return

    const pending = localStorageUtils.getPendingSync()
    if (pending.length === 0) return

    setSyncing(true)

    try {
      const sessionsToSync = pending.map(({ id, synced, ...session }) => session)

      const { data, error } = await supabase
        .from('study_sessions')
        .insert(sessionsToSync)
        .select()

      if (error) throw error

      // 同期成功したら一時IDを削除してDBのデータで置き換え
      setSessions(prev => {
        const filtered = prev.filter(s => !s.id.startsWith('temp_'))
        return [...data, ...filtered]
      })

      localStorageUtils.clearPendingSync()
      toast.success('オフラインデータを同期しました')
    } catch (error) {
      console.error('Error syncing sessions:', error)
      toast.error('同期に失敗しました')
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [userId])

  // オンライン復帰時に同期
  useEffect(() => {
    const handleOnline = () => {
      syncPendingSessions()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [userId])

  return {
    sessions,
    loading,
    syncing,
    addSession,
    updateSession,
    deleteSession,
    refreshSessions: fetchSessions,
    syncPendingSessions
  }
}
