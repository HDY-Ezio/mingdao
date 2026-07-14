'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { 
  FileText, MessageCircle, Calendar, ChevronRight, 
  Sparkles, Crown, BarChart3, Heart, Briefcase, Users, BookOpen
} from 'lucide-react'
import type { ReportType } from '@/types'

// Mock data for demo
const mockReports = [
  {
    id: '1',
    productId: 'bazi_full',
    title: 'Your Bazi Complete Report',
    titleCn: '八字完整报告',
    type: 'bazi' as ReportType,
    createdAt: '2024-01-15',
    questionsUsed: 3,
    questionsTotal: 10,
    isPremium: true,
    isDeepUnlocked: false,
  },
  {
    id: '2',
    productId: 'relationship_report',
    title: 'Your Relationship Report',
    titleCn: '感情专项报告',
    type: 'relationship' as ReportType,
    createdAt: '2024-01-10',
    questionsUsed: 12,
    questionsTotal: 15,
    isPremium: true,
    isDeepUnlocked: false,
  },
  {
    id: '3',
    productId: 'iching_deep',
    title: 'I Ching Reading: Career Change',
    titleCn: '易经深度解读',
    type: 'iching' as ReportType,
    createdAt: '2024-01-05',
    questionsUsed: 8,
    questionsTotal: 10,
    isPremium: true,
    isDeepUnlocked: true,
  },
]

export default function DashboardReportsPage() {
  const [reports, setReports] = React.useState(mockReports)
  const [filter, setFilter] = React.useState<string>('all')
  const router = useRouter()

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.type === filter)

  const reportTypes = [
    { value: 'all', label: 'All Reports', labelCn: '全部' },
    { value: 'bazi', label: 'Bazi', labelCn: '八字' },
    { value: 'ziwei', label: 'Ziwei', labelCn: '紫微' },
    { value: 'iching', label: 'I Ching', labelCn: '易经' },
    { value: 'relationship', label: 'Love', labelCn: '感情' },
    { value: 'career', label: 'Career', labelCn: '事业' },
    { value: 'compatibility', label: 'Couple', labelCn: '合盘' },
  ]

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.03}
        symbolOpacity={0.02}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="heading-h2 text-ink-900 mb-2">
            My Reports
          </h1>
          <p className="text-ink-500">
            我的报告 · All your destiny readings in one place
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<FileText className="w-5 h-5" />}
            label="Total Reports"
            value={reports.length}
            color="gold"
          />
          <StatCard
            icon={<MessageCircle className="w-5 h-5" />}
            label="Questions Used"
            value={reports.reduce((sum, r) => sum + r.questionsUsed, 0)}
            color="jade"
          />
          <StatCard
            icon={<Crown className="w-5 h-5" />}
            label="Premium Reports"
            value={reports.filter(r => r.isPremium).length}
            color="cinnabar"
          />
          <StatCard
            icon={<Sparkles className="w-5 h-5" />}
            label="Deep Unlocked"
            value={reports.filter(r => r.isDeepUnlocked).length}
            color="purple"
          />
        </div>

        {/* 筛选器 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {reportTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === type.value
                  ? 'bg-gold-500 text-white shadow-md'
                  : 'bg-white/80 text-ink-600 hover:bg-ink-50 border border-ink-200'
              }`}
            >
              {type.label}
              <span className="text-xs opacity-70 ml-1">{type.labelCn}</span>
            </button>
          ))}
        </div>

        {/* 报告列表 */}
        {filteredReports.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredReports.map((report) => (
              <ReportCard 
                key={report.id} 
                report={report}
                onOpen={() => router.push(`/reports/${report.productId}/result`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-ink-200/50">
            <div className="w-16 h-16 rounded-full bg-ink-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-ink-400" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-ink-700 mb-2">
              No reports yet
            </h3>
            <p className="text-ink-500 text-sm mb-6 max-w-sm mx-auto">
              You haven't purchased any reports yet. 
              Start your destiny journey today.
            </p>
            <Link href="/pricing">
              <Button variant="gold" size="md">
                Explore Reports
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}

        {/* 获取更多报告 CTA */}
        {reports.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-xl font-semibold mb-1">
                  Want more insights?
                </h3>
                <p className="text-ink-400 text-sm">
                  Explore all our report types for comprehensive guidance
                </p>
              </div>
              <Link href="/pricing">
                <Button variant="gold" size="md">
                  Browse All Reports
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  value: number
  color: 'gold' | 'jade' | 'cinnabar' | 'purple'
}) {
  const colorClasses = {
    gold: 'from-gold-100 to-gold-50 text-gold-600',
    jade: 'from-jade-100 to-jade-50 text-jade-600',
    cinnabar: 'from-cinnabar-100 to-cinnabar-50 text-cinnabar-600',
    purple: 'from-purple-100 to-purple-50 text-purple-600',
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-ink-200/50 p-4 shadow-ink-sm">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-serif font-bold text-ink-900">{value}</div>
      <div className="text-xs text-ink-500">{label}</div>
    </div>
  )
}

function ReportCard({ 
  report, 
  onOpen 
}: { 
  report: typeof mockReports[0]
  onOpen: () => void
}) {
  const icon = getReportIcon(report.type)
  const progress = (report.questionsUsed / report.questionsTotal) * 100
  const remaining = report.questionsTotal - report.questionsUsed

  return (
    <Card variant="paper" className="overflow-hidden hover:shadow-ink-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-100 to-gold-200/50 flex items-center justify-center flex-shrink-0 text-gold-600">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-serif font-semibold text-ink-900 truncate">
                {report.title}
              </h3>
              {report.isDeepUnlocked && (
                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full flex-shrink-0">
                  49问
                </span>
              )}
            </div>
            <p className="text-sm text-gold-600 mb-3" style={{ fontFamily: 'var(--font-kaishu), serif' }}>
              {report.titleCn}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-ink-500 mb-3">
              <Calendar className="w-3 h-3" />
              <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              <span className="mx-1">·</span>
              <MessageCircle className="w-3 h-3" />
              <span>{remaining} left</span>
            </div>

            {/* 问道进度 */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-ink-500 mb-1">
                <span>Questions 问道进度</span>
                <span>{report.questionsUsed}/{report.questionsTotal}</span>
              </div>
              <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-jade-400 to-jade-500 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="gold" size="sm" className="flex-1" onClick={onOpen}>
                <MessageCircle className="w-4 h-4 mr-1" />
                Continue Chat
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getReportIcon(type: ReportType) {
  const icons: Record<ReportType, React.ReactNode> = {
    bazi: <BarChart3 className="w-6 h-6" />,
    ziwei: <Sparkles className="w-6 h-6" />,
    iching: <BookOpen className="w-6 h-6" />,
    relationship: <Heart className="w-6 h-6" />,
    career: <Briefcase className="w-6 h-6" />,
    compatibility: <Users className="w-6 h-6" />,
  }
  return icons[type] || <FileText className="w-6 h-6" />
}
