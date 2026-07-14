'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient, onAuthStateChange } from '@/lib/supabase/client'
import { User, LogOut, LayoutDashboard, Settings, FileText, Mail } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navLinks = [
  { href: '/bazi', label: 'Bazi Reading' },
  { href: '/services', label: 'Services' },
  { href: '/observatory', label: 'Observatory' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Wisdom Journal' },
]

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [user, setUser] = React.useState<SupabaseUser | null>(null)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const userMenuRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 获取当前用户并监听认证状态变化
  React.useEffect(() => {
    const supabase = createClient()
    
    // 获取当前用户
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
    
    // 监听认证状态变化
    const { data: { subscription } } = onAuthStateChange((event, user) => {
      setUser(user)
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 点击外部关闭用户菜单
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-paper/85 backdrop-blur-md border-b border-ink-200/50 shadow-ink-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              {/* Circular seal logo */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cinnabar-600 to-cinnabar-700 flex items-center justify-center shadow-ink-sm group-hover:shadow-ink transition-shadow">
                <span className="text-white font-serif text-lg font-semibold" style={{ fontSize: '0.9rem' }}>
                  明
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-semibold text-ink-800 tracking-wide">
                Mingdao
              </span>
              <span className="text-[10px] text-ink-500 tracking-widest uppercase -mt-1">
                Light Your Path
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-600 hover:text-ink-900 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop Auth / User */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              // 已登录 - 用户菜单
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-100/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <svg
                    className={cn(
                      'w-4 h-4 text-ink-500 transition-transform',
                      userMenuOpen && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 下拉菜单 */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-ink-lg border border-ink-200/60 py-2 z-50">
                    <div className="px-4 py-3 border-b border-ink-100">
                      <p className="text-sm font-medium text-ink-900 truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-ink-500">Free Plan</p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/reports"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FileText className="w-4 h-4" />
                        My Reports
                      </Link>
                      <Link
                        href="/subscribe"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Mail className="w-4 h-4" />
                        Daily Fortune
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </div>
                    
                    <div className="border-t border-ink-100 pt-1 mt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-cinnabar-600 hover:bg-cinnabar-50 w-full text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 未登录 - 登录/注册按钮
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="gold" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-ink-700 hover:text-ink-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-ink-200/50 bg-paper/95 backdrop-blur-md">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-ink-700 hover:bg-ink-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 mt-2 border-t border-ink-200/50 flex flex-col gap-2 px-4">
                {user ? (
                  <>
                    <div className="px-2 py-2 text-sm text-ink-600">
                      {user.email}
                    </div>
                    <Link
                      href="/dashboard"
                      className="w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" size="md" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Link
                      href="/dashboard/reports"
                      className="w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" size="md" className="w-full">
                        My Reports
                      </Button>
                    </Link>
                    <Link
                      href="/subscribe"
                      className="w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" size="md" className="w-full">
                        Daily Fortune
                      </Button>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full"
                    >
                      <Button variant="ghost" size="md" className="w-full text-cinnabar-600">
                        Sign Out
                      </Button>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="md" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="gold" size="md" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
