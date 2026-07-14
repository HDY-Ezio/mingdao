'use client'

export const dynamic = 'force-dynamic'

import { useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BaziChart, FiveElementsChart, StrengthIndicator, FavorableElements } from '@/components/bazi/bazi-chart'
import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { calculateBazi, generateFreeReading } from '@/lib/bazi-calculator'
import { Sparkles, Crown, MessageCircle, ChevronRight, Lock, Shield, Star } from 'lucide-react'

export default function BaziResultPage() {
  const searchParams = useSearchParams()
  
  const reading = useMemo(() => {
    const name = searchParams.get('name') || ''
    const gender = (searchParams.get('gender') as 'male' | 'female') || 'male'
    const dateStr = searchParams.get('date') || '1990-01-15'
    const timeStr = searchParams.get('time') || '12:00'
    const place = searchParams.get('place') || ''
    
    const [year, month, day] = dateStr.split('-').map(Number)
    const [hours, minutes] = timeStr.split(':').map(Number)
    const birthDate = new Date(year, month - 1, day, hours, minutes)
    
    return calculateBazi({
      name,
      gender,
      birthDate,
      birthPlace: place,
      longitude: 120, // 默认，后续根据城市调整
    })
  }, [searchParams])

  const freeReading = useMemo(() => generateFreeReading(reading), [reading])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.06}
        symbolOpacity={0.03}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* 顶部信息 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-50 border border-gold-200/50 rounded-full text-gold-700 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Your Bazi Chart is Ready</span>
          </div>
          <h1 className="heading-h1 text-ink-900 mb-2">
            {reading.name ? reading.name : 'Your'} Four Pillars
          </h1>
          <p className="text-ink-500">
            {formatDate(reading.birthDate)} at {formatTime(reading.birthDate)}
            {reading.birthPlace && ` • ${reading.birthPlace}`}
          </p>
          <p className="text-sm text-ink-400 mt-1">
            <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>{reading.lunarDate.year}</span>
            {' '}农历年 · {reading.naYinYearCn} ({reading.naYinYear})
          </p>
        </div>

        {/* 主排盘区 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-5 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-semibold text-ink-900">
              <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>四柱八字</span>
              <span className="text-sm font-normal text-ink-500 ml-2">Four Pillars Chart</span>
            </h2>
            <span className={`text-xs px-2.5 py-1 rounded-full ${
              reading.gender === 'male' 
                ? 'bg-ink-100 text-ink-700' 
                : 'bg-cinnabar-50 text-cinnabar-700'
            }`}>
              {reading.gender === 'male' ? '乾造 Male' : '坤造 Female'}
            </span>
          </div>
          
          <BaziChart reading={reading} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 五行分布 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6">
            <h3 className="font-serif text-lg font-semibold text-ink-900 mb-4">
              <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>五行分布</span>
              <span className="text-sm font-normal text-ink-500 ml-2">Five Elements</span>
            </h3>
            <FiveElementsChart elements={reading.fiveElements} />
          </div>

          {/* 日主强弱 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6">
            <h3 className="font-serif text-lg font-semibold text-ink-900 mb-4">
              <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>日主强弱</span>
              <span className="text-sm font-normal text-ink-500 ml-2">Day Master Strength</span>
            </h3>
            <StrengthIndicator
              strength={reading.dayMasterStrength}
              score={reading.dayMasterStrengthScore}
            />
            
            <div className="mt-6">
              <div className="text-sm text-ink-600 mb-2">
                Your Day Master:
                <span
                  className="ml-2 text-xl font-semibold text-cinnabar-600"
                  style={{ fontFamily: 'var(--font-kaishu), serif' }}
                >
                  {reading.dayPillar.stemCn}
                </span>
                <span className="ml-1 text-sm text-gold-600">{reading.dayPillar.stemPinyin}</span>
                <span className="ml-1 text-sm text-ink-500">({reading.dayMasterElement})</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-ink-100">
              <FavorableElements
                favorable={reading.favorableElements}
                favorableCn={reading.favorableElementsCn}
                unfavorable={reading.unfavorableElements}
                unfavorableCn={reading.unfavorableElementsCn}
              />
            </div>
          </div>
        </div>

        {/* 免费解读 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6 md:p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-gold-500" />
            <h2 className="font-serif text-xl font-semibold text-ink-900">
              Free Reading Preview
            </h2>
            <span className="text-xs px-2 py-0.5 bg-ink-100 text-ink-600 rounded-full ml-auto">
              Basic Version
            </span>
          </div>

          <div className="space-y-8">
            {/* 性格特点 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-jade-100 flex items-center justify-center">
                  <span className="text-lg">🌿</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink-900">
                  <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>性格特点</span>
                  <span className="text-sm font-normal text-ink-500 ml-2">Personality</span>
                </h3>
              </div>
              <ul className="space-y-3 ml-10">
                {freeReading.personality.map((trait, i) => (
                  <li key={i} className="flex gap-3 text-ink-700">
                    <span className="text-gold-500 font-bold mt-0.5">◆</span>
                    <span>{trait}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 事业 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gold-100 flex items-center justify-center">
                  <span className="text-lg">💼</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink-900">
                  <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>事业潜质</span>
                  <span className="text-sm font-normal text-ink-500 ml-2">Career</span>
                </h3>
              </div>
              <p className="ml-10 text-ink-700 leading-relaxed">
                {freeReading.career}
              </p>
            </div>

            {/* 感情 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cinnabar-100 flex items-center justify-center">
                  <span className="text-lg">💕</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink-900">
                  <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>感情特质</span>
                  <span className="text-sm font-normal text-ink-500 ml-2">Relationships</span>
                </h3>
              </div>
              <p className="ml-10 text-ink-700 leading-relaxed">
                {freeReading.relationships}
              </p>
            </div>

            {/* 财运 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink-900">
                  <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>财运概况</span>
                  <span className="text-sm font-normal text-ink-500 ml-2">Wealth</span>
                </h3>
              </div>
              <p className="ml-10 text-ink-700 leading-relaxed">
                {freeReading.wealth}
              </p>
            </div>

            {/* 健康 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-jade-100 flex items-center justify-center">
                  <span className="text-lg">🏥</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink-900">
                  <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>健康注意</span>
                  <span className="text-sm font-normal text-ink-500 ml-2">Health</span>
                </h3>
              </div>
              <p className="ml-10 text-ink-700 leading-relaxed">
                {freeReading.health}
              </p>
            </div>
          </div>

          {/* 模糊遮罩 - 表示还有更多内容 */}
          <div className="relative mt-8">
            <div className="h-16 bg-gradient-to-t from-white via-white/80 to-transparent absolute bottom-full left-0 right-0 pointer-events-none" />
            <div className="flex items-center justify-center gap-4 py-4 border-t border-ink-100">
              <Lock className="w-4 h-4 text-ink-400" />
              <span className="text-sm text-ink-500">
                {reading.greatFortunes.length * 10}+ years of fortune cycles locked
              </span>
            </div>
          </div>
        </div>

        {/* 升级引导 */}
        <div className="space-y-4 mb-12">
          {/* 完整报告 */}
          <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 rounded-2xl p-6 md:p-8 text-white shadow-ink-xl relative overflow-hidden">
            {/* 装饰 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-xl font-semibold">
                      Unlock Full Bazi Report
                    </h3>
                    <span className="text-xs px-2 py-0.5 bg-gold-500/20 text-gold-300 rounded-full">
                      PREMIUM
                    </span>
                  </div>
                  <p className="text-ink-300 text-sm mb-4">
                    Complete 100+ page analysis with 10-year fortune cycles, 
                    yearly predictions, compatibility analysis, and more.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-5 text-sm">
                    {[
                      '10-Year Fortune Cycles 大运',
                      'Yearly Predictions 流年',
                      'Career & Wealth Timing',
                      'Relationship Compatibility',
                      'Health & Vitality Analysis',
                      'Favorable Directions & Colors',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-ink-200">
                        <ChevronRight className="w-3 h-3 text-gold-400" />
                        <span className="text-xs">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <Button variant="gold" size="lg" className="h-12 px-6">
                      <span className="text-sm">$19.99</span>
                      <span className="mx-1">·</span>
                      <span>Unlock Full Report</span>
                    </Button>
                    <div className="text-right">
                      <div className="text-xs text-ink-400">One-time payment</div>
                      <div className="text-xs text-ink-500">Instant delivery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI 对话 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-jade-400 to-jade-600 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-semibold text-ink-900">
                  Ask the Master
                </h3>
                <p className="text-sm text-ink-500">
                  Chat with our AI Daoist master about your chart — 10 free messages
                </p>
              </div>
              <Button variant="outline" size="md">
                Start Chat
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pb-8">
          <Link href="/bazi" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              ← Create New Chart
            </Button>
          </Link>
          <Button variant="ghost" className="w-full sm:w-auto">
            <Shield className="w-4 h-4 mr-2" />
            Save Chart (Sign Up)
          </Button>
        </div>
      </div>
    </div>
  )
}
