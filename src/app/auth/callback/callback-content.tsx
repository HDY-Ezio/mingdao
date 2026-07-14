'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient()
        
        const code = searchParams.get('code')
        
        if (code) {
          await supabase.auth.exchangeCodeForSession(code)
        }
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          router.push(next)
          router.refresh()
        } else {
          router.push('/login?error=Authentication failed')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login?error=Authentication failed')
      }
    }

    handleCallback()
  }, [router, searchParams, next])

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-stone-600">正在验证登录信息...</p>
      </div>
    </div>
  )
}
