import { useState } from 'react'
import { SessionFormData } from '@/types'

interface AddSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SessionFormData) => Promise<void>
  initialData?: SessionFormData & { id?: string }
}

export const AddSessionModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: AddSessionModalProps) => {
  const [subject, setSubject] = useState(initialData?.subject || '')
  const [minutes, setMinutes] = useState(initialData?.minutes || 30)
  const [startedAt, setStartedAt] = useState(
    initialData?.started_at || new Date()
  )
  const [note, setNote] = useState(initialData?.note || '')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        subject,
        minutes,
        started_at: startedAt,
        note
      })
      onClose()
    } catch (error) {
      console.error('Error submitting session:', error)
    } finally {
      setLoading(false)
    }
  }

  const addMinutes = (mins: number) => {
    setMinutes(prev => Math.max(1, prev + mins))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {initialData?.id ? '学習記録を編集' : '学習記録を追加'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              科目
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="例: 数学、英語、プログラミング"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              学習時間（分）
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={minutes}
                onChange={e => setMinutes(Number(e.target.value))}
                required
                min="1"
                max="1440"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => addMinutes(15)}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium"
              >
                +15
              </button>
              <button
                type="button"
                onClick={() => addMinutes(30)}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium"
              >
                +30
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              開始時刻
            </label>
            <input
              type="datetime-local"
              value={startedAt instanceof Date
                ? startedAt.toISOString().slice(0, 16)
                : new Date(startedAt).toISOString().slice(0, 16)}
              onChange={e => setStartedAt(new Date(e.target.value))}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              メモ（任意）
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="学習内容や感想など"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-400 hover:bg-primary-500 disabled:bg-gray-400 text-white rounded-lg font-medium"
            >
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
