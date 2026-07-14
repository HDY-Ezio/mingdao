import { cn } from '@/lib/utils'
import type { BaziReading, Pillar, ElementCount } from '@/lib/bazi-calculator'

interface BaziChartProps {
  reading: BaziReading
  className?: string
}

/**
 * 八字排盘展示组件
 * 中文原字 + 英文注释双轨制
 */
export function BaziChart({ reading, className }: BaziChartProps) {
  const pillars = [
    reading.yearPillar,
    reading.monthPillar,
    reading.dayPillar,
    reading.hourPillar,
  ]

  return (
    <div className={cn('w-full', className)}>
      {/* 主排盘区 */}
      <div className="relative">
        {/* 装饰边框 */}
        <div className="absolute -inset-2 border border-gold-300/20 rounded-lg" />
        <div className="absolute -inset-1 border border-gold-200/10 rounded-lg" />
        
        {/* 四柱表格 */}
        <div className="grid grid-cols-4 gap-1 md:gap-2 bg-paper-warm/50 rounded-lg p-3 md:p-4 border border-ink-200/30">
          {/* 柱位标题 */}
          {pillars.map((pillar, i) => (
            <div key={i} className="text-center">
              <div className="text-xs text-ink-400 tracking-widest uppercase mb-2">
                {pillar.positionName}
              </div>
              <div
                className="text-sm text-ink-500 font-medium mb-2"
                style={{ fontFamily: 'var(--font-kaishu), serif' }}
              >
                {pillar.positionNameCn}
              </div>
            </div>
          ))}

          {/* 天干 - 大字中文 */}
          {pillars.map((pillar, i) => (
            <div key={`stem-${i}`} className="text-center py-2 md:py-3 border-b border-gold-300/20">
              <div
                className={cn(
                  'text-4xl md:text-5xl font-semibold leading-none',
                  i === 2 ? 'text-cinnabar-600' : 'text-ink-800'
                )}
                style={{ fontFamily: 'var(--font-kaishu), serif' }}
              >
                {pillar.stemCn}
              </div>
              <div className="text-xs text-gold-600 mt-1.5 font-medium">
                {pillar.stemPinyin}
              </div>
              <div className="text-[10px] text-ink-400 mt-0.5 uppercase tracking-wide">
                {pillar.stemElement}
              </div>
              {pillar.stemTenGod && (
                <div className="mt-2">
                  <div
                    className="text-xs text-ink-500 font-medium"
                    style={{ fontFamily: 'var(--font-kaishu), serif' }}
                  >
                    {pillar.stemTenGodCn}
                  </div>
                  <div className="text-[9px] text-ink-400 uppercase tracking-tight">
                    {pillar.stemTenGod}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 地支 - 大字中文 */}
          {pillars.map((pillar, i) => (
            <div key={`branch-${i}`} className="text-center py-2 md:py-3">
              <div
                className={cn(
                  'text-4xl md:text-5xl font-semibold leading-none',
                  i === 2 ? 'text-cinnabar-600' : 'text-ink-800'
                )}
                style={{ fontFamily: 'var(--font-kaishu), serif' }}
              >
                {pillar.branchCn}
              </div>
              <div className="text-xs text-gold-600 mt-1.5 font-medium">
                {pillar.branchPinyin}
              </div>
              <div className="text-[10px] text-ink-400 mt-0.5 capitalize">
                {pillar.zodiac}
              </div>
              <div className="mt-2">
                <div
                  className="text-xs text-ink-500 font-medium"
                  style={{ fontFamily: 'var(--font-kaishu), serif' }}
                >
                  {pillar.branchTenGodCn}
                </div>
                <div className="text-[9px] text-ink-400 uppercase tracking-tight">
                  {pillar.branchTenGod}
                </div>
              </div>
            </div>
          ))}

          {/* 藏干 */}
          {pillars.map((pillar, i) => (
            <div key={`hidden-${i}`} className="text-center pt-2 border-t border-ink-200/30">
              <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-1.5">
                Hidden
              </div>
              <div className="flex flex-col gap-1 items-center">
                {pillar.hiddenStemsCn.map((stem, j) => (
                  <div key={j} className="text-center">
                    <div
                      className={cn(
                        'text-base font-medium',
                        j === 0 ? 'text-ink-700' : j === 1 ? 'text-ink-500' : 'text-ink-400'
                      )}
                      style={{ fontFamily: 'var(--font-kaishu), serif' }}
                    >
                      {stem}
                    </div>
                    <div className="text-[8px] text-ink-400">
                      {pillar.hiddenStemsTenGodsCn[j]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 日柱标记 */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-cinnabar-600 text-white text-xs rounded-full shadow-md">
          <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>日主</span>
          <span className="ml-1 opacity-80">Day Master</span>
        </div>
      </div>
    </div>
  )
}

interface FiveElementsChartProps {
  elements: ElementCount[]
  className?: string
}

/**
 * 五行分布可视化
 */
export function FiveElementsChart({ elements, className }: FiveElementsChartProps) {
  const elementColors: Record<string, string> = {
    Wood: 'from-jade-500 to-jade-600',
    Fire: 'from-cinnabar-500 to-cinnabar-600',
    Earth: 'from-gold-500 to-gold-600',
    Metal: 'from-ink-300 to-ink-400',
    Water: 'from-ink-700 to-ink-800',
  }

  const elementBgColors: Record<string, string> = {
    Wood: 'bg-jade-500',
    Fire: 'bg-cinnabar-500',
    Earth: 'bg-gold-500',
    Metal: 'bg-ink-400',
    Water: 'bg-ink-700',
  }

  const maxCount = Math.max(...elements.map(e => e.count))

  return (
    <div className={cn('', className)}>
      <div className="flex items-end justify-between gap-3 h-40">
        {elements.map((elem, i) => {
          const heightPercent = maxCount > 0 ? (elem.count / maxCount) * 100 : 0
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              {/* 柱子 */}
              <div className="w-full flex flex-col items-center justify-end h-32">
                <div className="text-xs font-semibold text-ink-700 mb-1.5">
                  {elem.count.toFixed(1)}
                </div>
                <div
                  className={cn(
                    'w-full max-w-[40px] rounded-t-md bg-gradient-to-t transition-all duration-700',
                    elementColors[elem.element]
                  )}
                  style={{ height: `${Math.max(heightPercent, 5)}%` }}
                />
              </div>
              {/* 标签 */}
              <div className="mt-2 text-center">
                <div
                  className="text-lg font-semibold text-ink-700"
                  style={{ fontFamily: 'var(--font-kaishu), serif' }}
                >
                  {elem.elementCn}
                </div>
                <div className="text-[10px] text-ink-500 uppercase tracking-wide">
                  {elem.element}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 图例 - 圆形分布 */}
      <div className="mt-6 flex justify-center">
        <div className="relative w-32 h-32">
          {elements.map((elem, i) => {
            const angle = (i / 5) * 360 - 90
            const radian = (angle * Math.PI) / 180
            const radius = 50 // px
            const x = 50 + radius * Math.cos(radian)
            const y = 50 + radius * Math.sin(radian)
            
            return (
              <div
                key={i}
                className={cn(
                  'absolute w-4 h-4 rounded-full border-2 border-white shadow-md',
                  elementBgColors[elem.element]
                )}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                title={elem.element}
              />
            )
          })}
          {/* 中心太极 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-ink-800 via-ink-500 to-white border-2 border-gold-400/50">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-ink-800 border border-ink-500" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border border-ink-300" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface StrengthIndicatorProps {
  strength: 'strong' | 'balanced' | 'weak'
  score: number
  className?: string
}

/**
 * 日主强弱指示器
 */
export function StrengthIndicator({ strength, score, className }: StrengthIndicatorProps) {
  const strengthLabels = {
    strong: { label: 'Strong', cn: '身强', color: 'text-cinnabar-600', bg: 'bg-cinnabar-50', border: 'border-cinnabar-200' },
    balanced: { label: 'Balanced', cn: '中和', color: 'text-jade-600', bg: 'bg-jade-50', border: 'border-jade-200' },
    weak: { label: 'Weak', cn: '身弱', color: 'text-ink-600', bg: 'bg-ink-50', border: 'border-ink-200' },
  }

  const info = strengthLabels[strength]
  // score 范围大概 -5 到 +5，映射到百分比
  const percentage = Math.max(0, Math.min(100, ((score + 5) / 10) * 100))

  return (
    <div className={cn('', className)}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span
            className="text-sm font-medium text-ink-600"
            style={{ fontFamily: 'var(--font-kaishu), serif' }}
          >
            日主强弱
          </span>
          <span className="text-xs text-ink-400 ml-2">Day Master Strength</span>
        </div>
        <div className={cn('px-3 py-1 rounded-full text-sm font-semibold', info.bg, info.color, 'border', info.border)}>
          <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>{info.cn}</span>
          <span className="ml-1.5 text-xs">{info.label}</span>
        </div>
      </div>
      
      {/* 强弱条 */}
      <div className="relative h-3 bg-ink-100 rounded-full overflow-hidden">
        {/* 弱区 */}
        <div className="absolute left-0 top-0 h-full w-1/3 bg-ink-200/50" />
        {/* 中和区 */}
        <div className="absolute left-1/3 top-0 h-full w-1/3 bg-jade-200/30" />
        {/* 强区 */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-cinnabar-200/30" />
        {/* 指示器 */}
        <div
          className="absolute top-0 h-full w-3 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full shadow-md transition-all duration-500"
          style={{ left: `calc(${percentage}% - 6px)` }}
        />
      </div>
      
      <div className="flex justify-between mt-1.5 text-[10px] text-ink-400">
        <span>Weak</span>
        <span>Balanced</span>
        <span>Strong</span>
      </div>
    </div>
  )
}

interface FavorableElementsProps {
  favorable: string[]
  favorableCn: string[]
  unfavorable: string[]
  unfavorableCn: string[]
  className?: string
}

/**
 * 喜用神展示
 */
export function FavorableElements({ favorable, favorableCn, unfavorable, unfavorableCn, className }: FavorableElementsProps) {
  const elementEmoji: Record<string, string> = {
    Wood: '🌿',
    Fire: '🔥',
    Earth: '🪨',
    Metal: '⚔️',
    Water: '💧',
  }

  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      {/* 喜用 */}
      <div className="bg-jade-50/50 rounded-lg p-4 border border-jade-200/30">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-sm font-semibold text-jade-700"
            style={{ fontFamily: 'var(--font-kaishu), serif' }}
          >
            喜用神
          </span>
          <span className="text-xs text-jade-600">Favorable</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {favorable.map((elem, i) => (
            <div
              key={i}
              className="px-3 py-1.5 bg-white rounded-md text-sm shadow-sm border border-jade-100 flex items-center gap-1.5"
            >
              <span>{elementEmoji[elem]}</span>
              <span
                className="font-medium text-ink-700"
                style={{ fontFamily: 'var(--font-kaishu), serif' }}
              >
                {favorableCn[i]}
              </span>
              <span className="text-xs text-ink-500">{elem}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 忌神 */}
      {unfavorable.length > 0 && (
        <div className="bg-cinnabar-50/50 rounded-lg p-4 border border-cinnabar-200/30">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-sm font-semibold text-cinnabar-700"
              style={{ fontFamily: 'var(--font-kaishu), serif' }}
            >
              忌神
            </span>
            <span className="text-xs text-cinnabar-600">Unfavorable</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {unfavorable.map((elem, i) => (
              <div
                key={i}
                className="px-3 py-1.5 bg-white rounded-md text-sm shadow-sm border border-cinnabar-100 flex items-center gap-1.5"
              >
                <span>{elementEmoji[elem]}</span>
                <span
                  className="font-medium text-ink-700"
                  style={{ fontFamily: 'var(--font-kaishu), serif' }}
                >
                  {unfavorableCn[i]}
                </span>
                <span className="text-xs text-ink-500">{elem}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
