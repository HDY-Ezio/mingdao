'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { getCurrentSeason, getDailyMansion, getCurrentSymbol, type SymbolKey } from '@/lib/star-calendar'

interface DiagonalBackgroundProps {
  children: React.ReactNode
  className?: string
  season?: 'spring' | 'summer' | 'autumn' | 'winter'
  /** Opacity for the constellation (top-left) layer - 星宿图透明度 */
  constellationOpacity?: number
  /** Opacity for the symbol (bottom-right) layer - 四象图透明度 */
  symbolOpacity?: number
  /** Show the gradient diagonal line - 渐变过渡带 */
  showGradientLine?: boolean
  /** Show star pattern overlay - 星宿点阵 */
  showStars?: boolean
}

/**
 * Diagonal Dual Background - 斜对角双背景（古籍书封风格）
 * 
 * 左上三角：当日值日星宿图（二十八星宿）
 * 右下三角：当季四象图（青龙/朱雀/白虎/玄武）
 * 中间渐变过渡带
 * 
 * Desktop: diagonal split from top-left to bottom-right
 * Mobile: top-bottom split (handled via media query in globals.css)
 */
export function DiagonalBackground({
  children,
  className,
  season: seasonProp,
  constellationOpacity = 0.12,
  symbolOpacity = 0.1,
  showGradientLine = true,
  showStars = true,
}: DiagonalBackgroundProps) {
  const [season, setSeason] = React.useState<'spring' | 'summer' | 'autumn' | 'winter'>(
    seasonProp || 'winter'
  )

  React.useEffect(() => {
    if (seasonProp) {
      setSeason(seasonProp)
    } else {
      setSeason(getCurrentSeason())
    }
  }, [seasonProp])

  // Color palettes for each season/symbol
  const colorSchemes = {
    spring: {
      constellation: 'linear-gradient(135deg, #1f3a32 0%, #316a57 50%, #42846d 100%)',
      symbol: 'linear-gradient(135deg, #bbd9cb 0%, #dcece4 50%, #f0f7f4 100%)',
      accent: '#42846d',
    },
    summer: {
      constellation: 'linear-gradient(135deg, #76261d 0%, #cc3624 50%, #ed786a 100%)',
      symbol: 'linear-gradient(135deg, #d6c072 0%, #e6d9a8 50%, #f2ecd4 100%)',
      accent: '#b8942f',
    },
    autumn: {
      constellation: 'linear-gradient(135deg, #3d3832 0%, #6b6456 50%, #8c8576 100%)',
      symbol: 'linear-gradient(135deg, #c4b89a 0%, #d4d0c7 50%, #eae8e3 100%)',
      accent: '#8c8576',
    },
    winter: {
      constellation: 'linear-gradient(135deg, #0f0d0b 0%, #1e2a3a 50%, #2a2722 100%)',
      symbol: 'linear-gradient(135deg, #b5afa2 0%, #d4d0c7 50%, #eae8e3 100%)',
      accent: '#b8942f',
    },
  }

  const colors = colorSchemes[season]

  return (
    <div className={cn('relative overflow-hidden bg-paper', className)}>
      {/* Top-left triangle: Constellation (二十八星宿) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 diagonal-bg-constellation"
        style={{
          background: colors.constellation,
          opacity: constellationOpacity,
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
        }}
        aria-hidden="true"
      />

      {/* Bottom-right triangle: Four Symbols (四象) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 diagonal-bg-symbol"
        style={{
          background: colors.symbol,
          opacity: symbolOpacity,
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
        aria-hidden="true"
      />

      {/* Diagonal gradient transition line - 渐变过渡带 */}
      {showGradientLine && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: `linear-gradient(
              135deg,
              transparent 0%,
              ${colors.accent}08 42%,
              ${colors.accent}12 48%,
              ${colors.accent}12 52%,
              ${colors.accent}08 58%,
              transparent 100%
            )`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Star pattern overlay - 星宿点阵 */}
      {showStars && (
        <div
          className="absolute inset-0 pointer-events-none z-[1] constellation-pattern"
          style={{
            opacity: 0.3,
            maskImage: 'linear-gradient(135deg, black 0%, black 35%, transparent 65%)',
            WebkitMaskImage: 'linear-gradient(135deg, black 0%, black 35%, transparent 65%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Subtle ink texture */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] mix-blend-multiply"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
        aria-hidden="true"
      />

      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
