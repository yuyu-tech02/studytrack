import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const { signUp, signIn, verifyOtp } = useAuth()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signUp(email, password)

    if (error) {
      toast.error('サインアップに失敗しました: ' + error.message)
    } else {
      setCodeSent(true)
      toast.success('認証コードをメールに送信しました！')
    }

    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      toast.error('ログインに失敗しました: ' + error.message)
    } else {
      toast.success('ログイン成功！')
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
      toast.success('アカウント作成完了！')
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
              {loading ? '認証中...' : 'アカウント作成完了'}
            </button>

            <button
              type="button"
              onClick={() => {
                setCodeSent(false)
                setCode('')
              }}
              className="w-full text-primary-400 hover:text-primary-500 font-medium text-sm"
            >
              戻る
            </button>
          </form>
        ) : (
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                placeholder="6文字以上"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-400 hover:bg-primary-500 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? '処理中...' : isSignUp ? '新規登録' : 'ログイン'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary-400 hover:text-primary-500 font-medium text-sm"
              >
                {isSignUp ? 'すでにアカウントをお持ちですか？ログイン' : 'アカウントをお持ちでないですか？新規登録'}
              </button>
            </div>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              {isSignUp
                ? '新規登録後、メールに送信される認証コードを入力してください。'
                : 'メールアドレスとパスワードでログインできます。'}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
