/**
 * Supabase Auth Middleware
 * 路由保护 - 参考 Supabase 官方示例
 */
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 刷新会话
  const { data: { user } } = await supabase.auth.getUser()

  // 受保护的路由
  const protectedPaths = ['/dashboard', '/settings', '/profile']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
  )

  // 认证页面（已登录用户不应访问）
  const authPaths = ['/login', '/register']
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname === path
  )

  // 未登录用户访问受保护路由 -> 重定向到登录页
  if (isProtectedPath && !user) {
    const redirectUrl = request.nextUrl.pathname + request.nextUrl.search
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(redirectUrl)}`, request.url))
  }

  // 已登录用户访问登录/注册页 -> 重定向到仪表盘
  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest|xml)$).*)',
  ],
}
