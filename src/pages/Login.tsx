import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const { signUp, signIn, verifyOtp } = useAuth()

  useEffect(() => {
    // クールダウンタイマー
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cooldown > 0) {
      toast.error(`${cooldown}秒後に再試行してください`)
      return
    }

    setLoading(true)

    const result = await signUp(email, password)

    console.log('SignUp完了:', result)

    if (result.error) {
      if (result.error.message.includes('429') || result.error.message.includes('rate limit')) {
        toast.error('送信回数が多すぎます。しばらく待ってから再試行してください')
        setCooldown(60)
      } else if (result.error.message.includes('User already registered')) {
        toast.error('このメールアドレスは既に登録されています。ログインしてください。')
      } else {
        toast.error('サインアップに失敗しました: ' + result.error.message)
        console.error('SignUp Error:', result.error)
      }
    } else if (result.data?.user) {
      if (result.data.session) {
        // メール確認が無効の場合、即座にログイン
        toast.success('アカウントを作成しました！')
      } else {
        // メール確認が必要な場合
        setCodeSent(true)
        toast.success(`${email} に認証コードを送信しました！メールを確認してください。`)
        setCooldown(60)
      }
    } else {
      toast.error('予期しないエラーが発生しました')
    }

    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      // エラーメッセージをより分かりやすく
      if (error.message.includes('Invalid login credentials')) {
        toast.error('メールアドレスまたはパスワードが正しくありません')
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('メールアドレスが確認されていません。新規登録からやり直してください。')
      } else if (error.message.includes('User not found')) {
        toast.error('このメールアドレスは登録されていません。新規登録してください。')
      } else {
        toast.error('ログインに失敗しました: ' + error.message)
      }
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                  placeholder="6文字以上"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                  aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (isSignUp && cooldown > 0)}
              className="w-full bg-primary-400 hover:bg-primary-500 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              {loading
                ? '処理中...'
                : isSignUp && cooldown > 0
                  ? `待機中... (${cooldown}秒)`
                  : isSignUp
                    ? '新規登録'
                    : 'ログイン'}
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
                ? cooldown > 0
                  ? `レート制限のため、${cooldown}秒後に再試行できます。`
                  : '新規登録後、メールに送信される認証コードを入力してください。'
                : 'メールアドレスとパスワードでログインできます。'}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
