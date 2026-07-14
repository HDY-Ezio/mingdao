/**
 * Supabase Client - Browser Side
 * 使用 @supabase/ssr 官方库
 */
'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * 获取当前用户
 */
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * 监听认证状态变化
 */
export function onAuthStateChange(callback: (event: string, user: any) => void) {
  const supabase = createClient()
  return supabase.auth.onAuthStateChange(callback)
}
