/**
 * User Dashboard - 用户仪表盘
 * 基础框架，展示用户的排盘记录等
 */
import { createClient, getCurrentUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { BookOpen, Sparkles, Calendar, MessageCircle, Crown, Settings, User, FileText, Heart, Briefcase, Users } from 'lucide-react'

export const metadata = {
  title: 'Dashboard',
  description: 'Your Mingdao dashboard — manage your readings and explore your destiny.',
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // 获取用户的排盘记录（示例）
  const supabase = createClient()
  const { data: readings } = await supabase
    .from('bazi_readings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)
    .catch(() => ({ data: [] }))

  const recentReadings = readings || []

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.06}
        symbolOpacity={0.03}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* 欢迎区域 */}
        <div className="mb-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="heading-h1 text-ink-900 mb-2">
                Welcome back
              </h1>
              <p className="text-ink-500">
                {user.email}
              </p>
            </div>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 快捷操作卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Link href="/bazi" className="block">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-ink-200/60 p-5 hover:shadow-ink-md hover:border-gold-300/50 transition-all duration-200 h-full">
              <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-gold-600" />
              </div>
              <h3 className="font-medium text-ink-900 mb-1">Bazi Reading</h3>
              <p className="text-xs text-ink-500">
                <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>八字排盘</span>
              </p>
            </div>
          </Link>

          <Link href="/dashboard/reports" className="block">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-ink-200/60 p-5 hover:shadow-ink-md hover:border-gold-300/50 transition-all duration-200 h-full">
              <div className="w-10 h-10 rounded-lg bg-jade-100 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-jade-600" />
              </div>
              <h3 className="font-medium text-ink-900 mb-1">My Reports</h3>
              <p className="text-xs text-ink-500">
                <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>我的报告</span>
              </p>
            </div>
          </Link>

          <Link href="/reports/iching_deep" className="block">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-ink-200/60 p-5 hover:shadow-ink-md hover:border-gold-300/50 transition-all duration-200 h-full">
              <div className="w-10 h-10 rounded-lg bg-cinnabar-100 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-cinnabar-600" />
              </div>
              <h3 className="font-medium text-ink-900 mb-1">I Ching</h3>
              <p className="text-xs text-ink-500">
                <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>易经占卜</span>
              </p>
            </div>
          </Link>

          <Link href="/pricing" className="block">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-ink-200/60 p-5 hover:shadow-ink-md hover:border-gold-300/50 transition-all duration-200 h-full">
              <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center mb-3">
                <Crown className="w-5 h-5 text-ink-600" />
              </div>
              <h3 className="font-medium text-ink-900 mb-1">Upgrade</h3>
              <p className="text-xs text-ink-500">
                <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>升级会员</span>
              </p>
            </div>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 最近排盘 */}
          <div className="md:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-lg font-semibold text-ink-900">
                  Recent Readings
                </h2>
                <Link href="/bazi" className="text-sm text-gold-600 hover:text-gold-700 font-medium">
                  New Reading →
                </Link>
              </div>

              {recentReadings.length > 0 ? (
                <div className="space-y-3">
                  {recentReadings.map((reading: any) => (
                    <div
                      key={reading.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-ink-50 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gold-50 border border-gold-200/50 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-gold-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-ink-900 truncate">
                          {reading.name || 'Bazi Reading'}
                        </div>
                        <div className="text-sm text-ink-500">
                          {new Date(reading.birth_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-xs text-ink-400">
                        {new Date(reading.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ink-50 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-ink-300" />
                  </div>
                  <h3 className="font-medium text-ink-700 mb-1">No readings yet</h3>
                  <p className="text-sm text-ink-500 mb-4">
                    Generate your first Bazi chart to get started
                  </p>
                  <Link href="/bazi">
                    <Button variant="gold" size="sm">
                      Create Chart
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 订阅状态 */}
            <Link href="/pricing">
              <div className="bg-gradient-to-br from-ink-900 to-ink-800 rounded-2xl p-6 text-white hover:shadow-ink-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5 text-gold-400" />
                  <h3 className="font-medium">Free Plan</h3>
                </div>
                <p className="text-sm text-ink-300 mb-4">
                  Unlock premium reports and 49 AI questions per month.
                </p>
                <Button variant="gold" size="sm" className="w-full">
                  Upgrade — From $9.99/mo
                </Button>
              </div>
            </Link>

            {/* 账户信息 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6">
              <h3 className="font-serif text-lg font-semibold text-ink-900 mb-4">
                Account
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-ink-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink-900 truncate">
                      {user.email}
                    </div>
                    <div className="text-xs text-ink-500">
                      Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-ink-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-ink-600">Free readings</span>
                    <span className="font-medium text-ink-900">3 / 3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-600">AI messages</span>
                    <span className="font-medium text-ink-900">10 / 10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
