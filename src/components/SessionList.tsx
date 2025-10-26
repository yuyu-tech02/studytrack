import { StudySession } from '@/types'
import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import { formatMinutes } from '@/utils/statistics'

interface SessionListProps {
  sessions: StudySession[]
  onEdit: (session: StudySession) => void
  onDelete: (id: string) => void
}

export const SessionList = ({ sessions, onEdit, onDelete }: SessionListProps) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-gray-500 dark:text-gray-400">
          まだ学習記録がありません。<br />
          右下のボタンから記録を追加しましょう！
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sessions.map(session => (
        <div
          key={session.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition border-l-4 border-primary-400"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {session.subject}
                </h3>
                {session.synced === false && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    未同期
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {format(parseISO(session.started_at), 'yyyy年MM月dd日(E) HH:mm', {
                  locale: ja
                })}
              </p>

              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formatMinutes(session.minutes)}
                </span>
              </div>

              {session.note && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                  {session.note}
                </p>
              )}
            </div>

            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(session)}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition"
                title="編集"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm('この学習記録を削除しますか？')) {
                    onDelete(session.id)
                  }
                }}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition"
                title="削除"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
