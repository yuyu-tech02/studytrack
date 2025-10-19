import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { signIn, verifyOtp } = useAuth()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(email)

    if (error) {
      toast.error('ログインに失敗しました: ' + error.message)
    } else {
      toast.success('6桁のコードをメールで送信しました')
      setSent(true)
    }

    setLoading(false)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await verifyOtp(email, otp)

    if (error) {
      toast.error('コードが正しくありません: ' + error.message)
    } else {
      toast.success('ログイン成功！')
      // useAuthのセッション管理により自動的にダッシュボードへリダイレクト
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-400 to-navy-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy-900 dark:text-white mb-2">
            StudyTrack
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            学習時間を記録・可視化しよう
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-400 hover:bg-primary-500 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? '送信中...' : '認証コードを送信'}
            </button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              メールアドレスに6桁の認証コードを送信します。<br />
              メールを開いてコードを確認してください。
            </p>
          </form>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="mb-4 text-6xl">📧</div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                認証コードを入力
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-semibold">{email}</span> に6桁のコードを送信しました。
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                メールを確認してコードを入力してください。
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  認証コード（6桁）
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  autoComplete="one-time-code"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary-400 hover:bg-primary-500 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? '確認中...' : 'ログイン'}
              </button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setSent(false)
                    setOtp('')
                  }}
                  className="text-primary-400 hover:text-primary-500 font-medium text-sm"
                >
                  別のメールアドレスで試す
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
