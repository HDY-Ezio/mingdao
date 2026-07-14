'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      setSuccess('Sign in successful. Redirecting...')
      
      // 延迟一下让用户看到成功消息
      setTimeout(() => {
        router.push(next)
        router.refresh()
      }, 500)
      
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email first')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) throw error
      
      setSuccess('Password reset link sent to your email')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative overflow-hidden py-12">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.12}
        symbolOpacity={0.06}
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cinnabar-600 to-cinnabar-700 flex items-center justify-center shadow-ink">
              <span className="text-white font-serif text-xl font-semibold">明</span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl font-semibold text-ink-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-ink-500">
              Sign in to continue your journey
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 p-3 bg-cinnabar-50 border border-cinnabar-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-cinnabar-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-cinnabar-700">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-5 p-3 bg-jade-50 border border-jade-200 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-jade-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-jade-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-ink-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-gold-700 hover:text-gold-600"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-ink-300 text-gold-600 focus:ring-gold-500"
                defaultChecked
              />
              <label htmlFor="remember" className="text-sm text-ink-600">
                Remember me
              </label>
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ink-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white/90 px-3 text-ink-400">or continue with</span>
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-11 rounded-lg border border-ink-200 text-ink-700 text-sm hover:bg-ink-50 transition-colors"
              onClick={async () => {
                const supabase = createClient()
                await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
                  },
                })
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-11 rounded-lg border border-ink-200 text-ink-700 text-sm hover:bg-ink-50 transition-colors"
              onClick={async () => {
                const supabase = createClient()
                await supabase.auth.signInWithOAuth({
                  provider: 'github',
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
                  },
                })
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-ink-600">
            New to Mingdao?{' '}
            <Link href="/register" className="text-gold-700 hover:text-gold-600 font-medium">
              Create an account
            </Link>
          </p>
        </div>

        {/* Privacy note */}
        <p className="mt-6 text-center text-xs text-ink-400">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-ink-600">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-ink-600">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  )
}
