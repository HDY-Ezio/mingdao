'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShichenWheel } from '@/components/bazi/shichen-wheel'
import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { getDayPillar, getMonthPillar, SHICHEN_TIME_RANGES, solarToLunar, HEAVENLY_STEMS, EARTHLY_BRANCHES, HEAVENLY_STEMS_PINYIN, EARTHLY_BRANCHES_PINYIN } from '@/lib/lunar-calendar'
import { cn } from '@/lib/utils'

export default function BaziPage() {
  const router = useRouter()
  
  const [name, setName] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [birthDate, setBirthDate] = useState('1990-01-15')
  const [birthTime, setBirthTime] = useState('12:00')
  const [birthPlace, setBirthPlace] = useState('')
  const [shichenIndex, setShichenIndex] = useState(6) // 默认午时
  const [isCalculating, setIsCalculating] = useState(false)

  // 根据日期和时间计算干支显示
  const ganzhiDisplay = useMemo(() => {
    try {
      const [year, month, day] = birthDate.split('-').map(Number)
      const [hours, minutes] = birthTime.split(':').map(Number)
      const date = new Date(year, month - 1, day, hours, minutes)
      
      const monthPillar = getMonthPillar(date)
      const dayPillar = getDayPillar(date)
      
      return {
        monthStem: HEAVENLY_STEMS[monthPillar.stem],
        monthBranch: EARTHLY_BRANCHES[monthPillar.branch],
        monthStemPy: HEAVENLY_STEMS_PINYIN[monthPillar.stem],
        monthBranchPy: EARTHLY_BRANCHES_PINYIN[monthPillar.branch],
        dayStem: HEAVENLY_STEMS[dayPillar.stem],
        dayBranch: EARTHLY_BRANCHES[dayPillar.branch],
        dayStemPy: HEAVENLY_STEMS_PINYIN[dayPillar.stem],
        dayBranchPy: EARTHLY_BRANCHES_PINYIN[dayPillar.branch],
      }
    } catch {
      return null
    }
  }, [birthDate, birthTime])

  // 时间变化时同步更新时辰索引
  const handleTimeChange = (time: string) => {
    setBirthTime(time)
    const [hours] = time.split(':').map(Number)
    const index = Math.floor((hours + 1) / 2) % 12
    setShichenIndex(index)
  }

  // 时辰选择变化时同步更新时间
  const handleShichenChange = (index: number) => {
    setShichenIndex(index)
    // 取时辰的中间时间
    const shichen = SHICHEN_TIME_RANGES[index]
    const [startHour] = shichen.start.split(':').map(Number)
    const midHour = (startHour + 1) % 24
    setBirthTime(`${midHour.toString().padStart(2, '0')}:30`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCalculating(true)
    
    // 将参数编码到 URL
    const params = new URLSearchParams({
      name,
      gender,
      date: birthDate,
      time: birthTime,
      place: birthPlace,
    })
    
    // 模拟计算延迟，增加仪式感
    setTimeout(() => {
      router.push(`/bazi/result?${params.toString()}`)
    }, 800)
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] relative overflow-hidden py-10 md:py-16">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.08}
        symbolOpacity={0.04}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-10 md:mb-14">
          <div className="eyebrow text-gold-600 mb-3">Bazi Reading</div>
          <h1 className="heading-h1 text-ink-900 mb-4">
            <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>八字排盘</span>
          </h1>
          <p className="text-ink-500 max-w-lg mx-auto">
            Enter your birth details to calculate your Four Pillars of Destiny
            and discover your unique cosmic blueprint.
          </p>
        </div>

        {/* 表单卡片 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 姓名 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink-700 mb-2">
                Name <span className="text-ink-400 font-normal">(optional)</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            {/* 性别 */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={cn(
                    'h-14 rounded-lg border font-medium transition-all duration-200',
                    gender === 'male'
                      ? 'bg-ink-900 text-white border-ink-900 shadow-ink'
                      : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300'
                  )}
                >
                  <span className="text-lg mr-2">♂</span>
                  Male
                  <span
                    className="block text-xs opacity-70"
                    style={{ fontFamily: 'var(--font-kaishu), serif' }}
                  >
                    乾造
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={cn(
                    'h-14 rounded-lg border font-medium transition-all duration-200',
                    gender === 'female'
                      ? 'bg-cinnabar-600 text-white border-cinnabar-600 shadow-md'
                      : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300'
                  )}
                >
                  <span className="text-lg mr-2">♀</span>
                  Female
                  <span
                    className="block text-xs opacity-70"
                    style={{ fontFamily: 'var(--font-kaishu), serif' }}
                  >
                    坤造
                  </span>
                </button>
              </div>
            </div>

            {/* 出生日期 */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-ink-700 mb-2">
                Date of Birth
              </label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="h-12"
              />
              {/* 干支显示 */}
              {ganzhiDisplay && (
                <div className="mt-3 flex items-center justify-center gap-4 py-3 bg-paper-warm rounded-lg border border-gold-200/30">
                  <div className="text-center">
                    <div className="text-[10px] text-ink-400 uppercase tracking-wider mb-1">Month 月柱</div>
                    <div className="flex gap-1">
                      <span
                        className="text-xl font-semibold text-ink-700"
                        style={{ fontFamily: 'var(--font-kaishu), serif' }}
                      >
                        {ganzhiDisplay.monthStem}
                      </span>
                      <span
                        className="text-xl font-semibold text-ink-700"
                        style={{ fontFamily: 'var(--font-kaishu), serif' }}
                      >
                        {ganzhiDisplay.monthBranch}
                      </span>
                    </div>
                    <div className="text-[10px] text-gold-600">
                      {ganzhiDisplay.monthStemPy} {ganzhiDisplay.monthBranchPy}
                    </div>
                  </div>
                  <div className="w-px h-10 bg-ink-200" />
                  <div className="text-center">
                    <div className="text-[10px] text-ink-400 uppercase tracking-wider mb-1">Day 日柱</div>
                    <div className="flex gap-1">
                      <span
                        className="text-xl font-semibold text-cinnabar-600"
                        style={{ fontFamily: 'var(--font-kaishu), serif' }}
                      >
                        {ganzhiDisplay.dayStem}
                      </span>
                      <span
                        className="text-xl font-semibold text-cinnabar-600"
                        style={{ fontFamily: 'var(--font-kaishu), serif' }}
                      >
                        {ganzhiDisplay.dayBranch}
                      </span>
                    </div>
                    <div className="text-[10px] text-gold-600">
                      {ganzhiDisplay.dayStemPy} {ganzhiDisplay.dayBranchPy}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 出生时间 - 罗盘选择器 */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-4">
                Birth Hour — 出生时辰
              </label>
              
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* 时辰罗盘 */}
                <div className="flex justify-center">
                  <div className="w-64 h-64 md:w-72 md:h-72">
                    <ShichenWheel
                      selectedIndex={shichenIndex}
                      onChange={handleShichenChange}
                    />
                  </div>
                </div>

                {/* 精确时间输入 */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="birthTime" className="block text-xs text-ink-500 mb-2">
                      Exact Time (optional, for precision)
                    </label>
                    <Input
                      id="birthTime"
                      type="time"
                      value={birthTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="h-12"
                    />
                    <p className="mt-2 text-xs text-ink-400">
                      Using True Solar Time for accuracy
                    </p>
                  </div>

                  <div className="p-4 bg-paper-warm rounded-lg border border-ink-200/30">
                    <div className="text-xs text-ink-500 mb-2">Selected Shichen</div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-3xl font-semibold text-ink-800"
                        style={{ fontFamily: 'var(--font-kaishu), serif' }}
                      >
                        {SHICHEN_TIME_RANGES[shichenIndex].name}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gold-600">
                          {SHICHEN_TIME_RANGES[shichenIndex].pinyin}
                        </div>
                        <div className="text-xs text-ink-500">
                          {SHICHEN_TIME_RANGES[shichenIndex].start} – {SHICHEN_TIME_RANGES[shichenIndex].end}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 出生地点 */}
            <div>
              <label htmlFor="birthPlace" className="block text-sm font-medium text-ink-700 mb-2">
                Place of Birth <span className="text-ink-400 font-normal">(optional)</span>
              </label>
              <Input
                id="birthPlace"
                type="text"
                placeholder="City, Country"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                autoComplete="off"
              />
              <p className="mt-2 text-xs text-ink-400">
                Used for True Solar Time calculation (longitude-based)
              </p>
            </div>

            {/* 提交按钮 */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full h-14 text-base"
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </>
              ) : (
                <>
                  <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>起盘</span>
                  <span className="ml-2">Generate Reading</span>
                </>
              )}
            </Button>
          </form>

          {/* 底部说明 */}
          <div className="mt-8 pt-6 border-t border-ink-200/30 text-center">
            <p className="text-xs text-ink-400">
              ⚡ Free Bazi chart with basic interpretation
              <span className="mx-2">•</span>
              🔒 Your data is private
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
