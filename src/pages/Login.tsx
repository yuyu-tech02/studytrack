import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const { sendOtp, verifyOtp } = useAuth()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await sendOtp(email)

    if (error) {
      toast.error('メール送信に失敗しました: ' + error.message)
    } else {
      setCodeSent(true)
      toast.success('認証コードを送信しました！')
    }

    setLoading(false)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await verifyOtp(email, code)

    if (error) {
      toast.error('認証に失敗しました: ' + error.message)
    } else {
      toast.success('ログイン成功！')
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

        {codeSent ? (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">
                {email} に6桁の認証コードを送信しました。
              </p>
            </div>

            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                認証コード
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                maxLength={6}
                pattern="[0-9]{6}"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-primary-400 hover:bg-primary-500 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? '認証中...' : 'ログイン'}
            </button>

            <button
              type="button"
              onClick={() => {
                setCodeSent(false)
                setCode('')
              }}
              className="w-full text-primary-400 hover:text-primary-500 font-medium text-sm"
            >
              別のメールアドレスでログイン
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendCode} className="space-y-6">
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
              メールアドレスを入力すると、6桁の認証コードが送信されます。
              <br />
              初回の場合は自動的にアカウントが作成されます。
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
