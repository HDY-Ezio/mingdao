'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Hexagram, Trigram } from '@/lib/iching-data'
import { EIGHT_TRIGRAMS } from '@/lib/iching-data'

interface HexagramDisplayProps {
  lines: number[]  // 6 lines, bottom to top, 1=yang, 0=yin
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabels?: boolean
}

/**
 * CSS绘制的卦象图
 * - 阳爻：一条完整的线
 * - 阴爻：中间断开的两条线
 * - 从下往上排列
 */
export function HexagramDisplay({
  lines,
  size = 'md',
  className,
  showLabels = false,
}: HexagramDisplayProps) {
  const sizeClasses = {
    sm: 'w-12',
    md: 'w-20',
    lg: 'w-32',
  }
  
  const lineHeightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }
  
  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  }

  // 卦象从上到下显示，但数组是从下到上
  const displayLines = [...lines].reverse()

  return (
    <div className={cn('flex flex-col', gapClasses[size], sizeClasses[size], className)}>
      {displayLines.map((line, index) => {
        const position = 6 - index  // 6=top, 1=bottom
        return (
          <div key={index} className="relative">
            {line === 1 ? (
              // 阳爻 - 一条整线
              <div className={cn(
                'w-full rounded-sm bg-gradient-to-r from-ink-700 via-ink-600 to-ink-700',
                lineHeightClasses[size]
              )} />
            ) : (
              // 阴爻 - 断开的两条线
              <div className="flex justify-between">
                <div className={cn(
                  'w-[42%] rounded-sm bg-gradient-to-r from-ink-700 via-ink-600 to-ink-700',
                  lineHeightClasses[size]
                )} />
                <div className={cn(
                  'w-[42%] rounded-sm bg-gradient-to-r from-ink-700 via-ink-600 to-ink-700',
                  lineHeightClasses[size]
                )} />
              </div>
            )}
            {showLabels && (
              <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-ink-400">
                {position}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

interface TrigramDisplayProps {
  binary: number[]  // 3 lines, bottom to top
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * 八卦单卦显示
 */
export function TrigramDisplay({ binary, size = 'md', className }: TrigramDisplayProps) {
  return <HexagramDisplay lines={[...binary, 0, 0, 0].slice(0, 6)} size={size} className={className} />
}

interface ChangingHexagramDisplayProps {
  originalLines: number[]
  changingLines: number[]  // positions 1-6
  changedLines?: number[]
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * 变卦显示 - 本卦/变卦对照
 * 变爻用特殊标记
 */
export function ChangingHexagramDisplay({
  originalLines,
  changingLines,
  changedLines,
  size = 'md',
  className,
}: ChangingHexagramDisplayProps) {
  const sizeClasses = {
    sm: 'w-10',
    md: 'w-16',
    lg: 'w-24',
  }
  
  const lineHeightClasses = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2.5',
  }
  
  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  }

  const displayLines = [...originalLines].reverse()

  return (
    <div className={cn('flex flex-col', gapClasses[size], sizeClasses[size], className)}>
      {displayLines.map((line, index) => {
        const position = 6 - index
        const isChanging = changingLines.includes(position)
        
        return (
          <div 
            key={index} 
            className={cn(
              'relative transition-all',
              isChanging && 'animate-pulse'
            )}
          >
            {line === 1 ? (
              // 阳爻
              <div className={cn(
                'w-full rounded-sm',
                isChanging 
                  ? 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 shadow-[0_0_8px_rgba(184,148,47,0.5)]' 
                  : 'bg-gradient-to-r from-ink-700 via-ink-600 to-ink-700',
                lineHeightClasses[size]
              )} />
            ) : (
              // 阴爻
              <div className="flex justify-between">
                <div className={cn(
                  'w-[42%] rounded-sm',
                  isChanging 
                    ? 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 shadow-[0_0_8px_rgba(184,148,47,0.5)]' 
                    : 'bg-gradient-to-r from-ink-700 via-ink-600 to-ink-700',
                  lineHeightClasses[size]
                )} />
                <div className={cn(
                  'w-[42%] rounded-sm',
                  isChanging 
                    ? 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 shadow-[0_0_8px_rgba(184,148,47,0.5)]' 
                    : 'bg-gradient-to-r from-ink-700 via-ink-600 to-ink-700',
                  lineHeightClasses[size]
                )} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

interface HexagramCardProps {
  hexagram: Hexagram
  showDetails?: boolean
  className?: string
}

/**
 * 卦象卡片 - 带卦名和卦辞
 */
export function HexagramCard({ hexagram, showDetails = false, className }: HexagramCardProps) {
  const upperTrigram = EIGHT_TRIGRAMS.find(t => t.id === hexagram.upperTrigram)
  const lowerTrigram = EIGHT_TRIGRAMS.find(t => t.id === hexagram.lowerTrigram)
  
  const lines = [
    ...(lowerTrigram?.binary || [0, 0, 0]),
    ...(upperTrigram?.binary || [0, 0, 0]),
  ]

  return (
    <div className={cn(
      'bg-gradient-to-br from-paper to-paper-warm rounded-2xl border border-gold-200/40 shadow-ink-lg p-6',
      className
    )}>
      {/* 卦号和卦名 */}
      <div className="flex items-start gap-6">
        {/* 卦象 */}
        <div className="flex-shrink-0">
          <HexagramDisplay lines={lines} size="lg" />
        </div>
        
        {/* 卦名信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-xs text-ink-400">第 {hexagram.number} 卦</span>
            <span className="text-xs px-2 py-0.5 bg-gold-100 text-gold-700 rounded-full">
              {hexagram.category}
            </span>
          </div>
          <h2 
            className="text-3xl font-bold text-ink-900 mb-1"
            style={{ fontFamily: 'var(--font-kaishu), serif' }}
          >
            {hexagram.nameCn}
          </h2>
          <p className="text-sm text-ink-500 mb-1">{hexagram.pinyin}</p>
          <p className="text-base text-ink-700 font-serif">{hexagram.name}</p>
          
          {/* 上下卦 */}
          <div className="flex items-center gap-2 mt-3 text-sm text-ink-500">
            <span>{upperTrigram?.nameCn}上</span>
            <span className="text-gold-400">☰</span>
            <span>{lowerTrigram?.nameCn}下</span>
          </div>
        </div>
      </div>

      {/* 卦辞 */}
      {showDetails && (
        <div className="mt-6 pt-5 border-t border-gold-100/60">
          <div className="text-xs text-ink-400 mb-2">卦辞 · Judgment</div>
          <p 
            className="text-lg text-ink-800 leading-relaxed mb-2"
            style={{ fontFamily: 'var(--font-kaishu), serif' }}
          >
            {hexagram.judgmentCn}
          </p>
          <p className="text-sm text-ink-600 italic">"{hexagram.judgment}"</p>
        </div>
      )}

      {/* 象辞 */}
      {showDetails && (
        <div className="mt-4">
          <div className="text-xs text-ink-400 mb-2">象辞 · Image</div>
          <p 
            className="text-base text-ink-700 leading-relaxed mb-2"
            style={{ fontFamily: 'var(--font-kaishu), serif' }}
          >
            {hexagram.imageCn}
          </p>
          <p className="text-sm text-ink-500 italic">{hexagram.image}</p>
        </div>
      )}
    </div>
  )
}

interface HexagramComparisonProps {
  originalHexagram: Hexagram
  changedHexagram?: Hexagram
  changingLines: number[]
  className?: string
}

/**
 * 本卦/变卦对照显示
 */
export function HexagramComparison({
  originalHexagram,
  changedHexagram,
  changingLines,
  className,
}: HexagramComparisonProps) {
  const upperOriginal = EIGHT_TRIGRAMS.find(t => t.id === originalHexagram.upperTrigram)
  const lowerOriginal = EIGHT_TRIGRAMS.find(t => t.id === originalHexagram.lowerTrigram)
  const originalLines = [
    ...(lowerOriginal?.binary || [0, 0, 0]),
    ...(upperOriginal?.binary || [0, 0, 0]),
  ]
  
  const upperChanged = changedHexagram ? EIGHT_TRIGRAMS.find(t => t.id === changedHexagram.upperTrigram) : undefined
  const lowerChanged = changedHexagram ? EIGHT_TRIGRAMS.find(t => t.id === changedHexagram.lowerTrigram) : undefined
  const changedLines = changedHexagram && upperChanged && lowerChanged
    ? [...lowerChanged.binary, ...upperChanged.binary]
    : originalLines

  return (
    <div className={cn(
      'bg-gradient-to-br from-paper to-paper-warm rounded-2xl border border-gold-200/40 shadow-ink-lg p-6 md:p-8',
      className
    )}>
      <div className="grid grid-cols-2 gap-6 md:gap-12">
        {/* 本卦 */}
        <div className="text-center">
          <div className="text-xs text-ink-400 mb-1">本卦</div>
          <div className="text-sm font-medium text-ink-600 mb-4">Present Hexagram</div>
          
          <div className="flex justify-center mb-4">
            <ChangingHexagramDisplay
              originalLines={originalLines}
              changingLines={changingLines}
              size="lg"
            />
          </div>
          
          <h3 
            className="text-xl font-bold text-ink-900 mb-1"
            style={{ fontFamily: 'var(--font-kaishu), serif' }}
          >
            {originalHexagram.nameCn}
          </h3>
          <p className="text-sm text-ink-500">{originalHexagram.name}</p>
        </div>

        {/* 箭头分隔 */}
        {changedHexagram && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
            <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
              <span className="text-gold-600 text-lg">→</span>
            </div>
          </div>
        )}

        {/* 变卦 */}
        {changedHexagram ? (
          <div className="text-center">
            <div className="text-xs text-gold-600 mb-1">变卦</div>
            <div className="text-sm font-medium text-gold-700 mb-4">Changing Hexagram</div>
            
            <div className="flex justify-center mb-4">
              <HexagramDisplay lines={changedLines} size="lg" />
            </div>
            
            <h3 
              className="text-xl font-bold text-gold-700 mb-1"
              style={{ fontFamily: 'var(--font-kaishu), serif' }}
            >
              {changedHexagram.nameCn}
            </h3>
            <p className="text-sm text-gold-600">{changedHexagram.name}</p>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center justify-center">
            <div className="text-xs text-ink-400 mb-2">无变爻</div>
            <p className="text-sm text-ink-500">No changing lines</p>
          </div>
        )}
      </div>

      {/* 变爻位置 */}
      {changingLines.length > 0 && (
        <div className="mt-6 pt-5 border-t border-gold-100/60 text-center">
          <div className="text-xs text-ink-400 mb-2">变爻 · Changing Lines</div>
          <div className="flex justify-center gap-2">
            {changingLines.map(pos => (
              <span 
                key={pos}
                className="px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-sm"
                style={{ fontFamily: 'var(--font-kaishu), serif' }}
              >
                {getPositionName(pos)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper: 爻位名称
function getPositionName(position: number): string {
  const names = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
  return names[position - 1] || `${position}爻`
}

interface CoinTossAnimationProps {
  results: number[]  // 3 coins, 2 or 3 each
  isAnimating?: boolean
  className?: string
}

/**
 * 三枚铜钱动画显示
 */
export function CoinTossAnimation({ results, isAnimating, className }: CoinTossAnimationProps) {
  return (
    <div className={cn('flex justify-center gap-4', className)}>
      {results.map((result, i) => (
        <div
          key={i}
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-gold-300 via-gold-400 to-gold-500',
            'border-2 border-gold-600/30 shadow-lg',
            isAnimating && 'animate-bounce'
          )}
          style={{ 
            animationDelay: `${i * 0.1}s`,
            boxShadow: '0 4px 12px rgba(184, 148, 47, 0.3), inset 0 1px 2px rgba(255,255,255,0.4)'
          }}
        >
          <span 
            className="text-gold-800 font-bold text-sm"
            style={{ fontFamily: 'var(--font-kaishu), serif' }}
          >
            {result === 3 ? '字' : '背'}
          </span>
        </div>
      ))}
    </div>
  )
}
