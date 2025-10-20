import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 現在のセッションをチェック
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 認証状態の変更をリッスン
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    console.log('SignUp開始:', email)

    const { data, error } = await supabase.auth.signUp({
      email,
      password
      // options を削除 - OTP方式の場合は不要
    })

    // 詳細なデバッグログ
    console.log('SignUp結果:', {
      user: data?.user?.id,
      email: data?.user?.email,
      confirmed: data?.user?.confirmed_at,
      session: !!data?.session,
      error: error?.message
    })

    if (error) {
      console.error('SignUpエラー詳細:', error)
    } else if (data?.user) {
      if (data.session) {
        console.log('即座にログインしました（メール確認不要）')
      } else {
        console.log('確認メールが送信されました。メールのOTPコードを入力してください。')
      }
    }

    return { data, error }
  }

  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signUp,
    verifyOtp,
    signIn,
    signOut
  }
}
