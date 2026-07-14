'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { PalaceData } from '@/lib/ziwei-calculator'

interface ZiweiChartProps {
  palaces: PalaceData[]
  size?: number
  className?: string
  onPalaceClick?: (palace: PalaceData) => void
  activePalaceId?: string
}

/**
 * Ziwei 12-Palace Ring Chart - 紫微十二宫环形图
 * 
 * 用CSS实现的十二宫环形排布
 * - 中间：命宫主星
 * - 外圈：十二宫按顺时针排列
 * - 命宫在正下方（6点钟位置）
 */
export function ZiweiChart({
  palaces,
  size = 420,
  className,
  onPalaceClick,
  activePalaceId,
}: ZiweiChartProps) {
  const center = size / 2
  const outerRadius = size * 0.45
  const innerRadius = size * 0.28
  const palaceWidth = (2 * Math.PI * outerRadius) / 12 * 0.85

  // 命宫在正下方（6点钟位置），顺时针排列
  // 第0宫(命宫)在 270度 = 3π/2 = bottom
  const startAngle = -Math.PI / 2 // 从顶部开始
  
  return (
    <div 
      className={cn('relative mx-auto', className)}
      style={{ width: size, height: size }}
    >
      {/* 外圈装饰 */}
      <div 
        className="absolute rounded-full border-2 border-gold-200/50"
        style={{
          width: size,
          height: size,
          top: 0,
          left: 0,
        }}
      />
      
      {/* 内圈装饰 */}
      <div 
        className="absolute rounded-full border border-gold-300/40 bg-paper-warm/50"
        style={{
          width: innerRadius * 2,
          height: innerRadius * 2,
          top: center - innerRadius,
          left: center - innerRadius,
        }}
      />

      {/* 十二宫 */}
      {palaces.map((palace, index) => {
        // 计算宫位角度（从顶部开始，顺时针）
        const angle = startAngle + (index / palaces.length) * 2 * Math.PI
        const nextAngle = startAngle + ((index + 1) / palaces.length) * 2 * Math.PI
        const midAngle = (angle + nextAngle) / 2
        
        // 宫位中心点
        const midRadius = (outerRadius + innerRadius) / 2
        const x = center + midRadius * Math.cos(midAngle)
        const y = center + midRadius * Math.sin(midAngle)
        
        // 宫位扇形路径
        const x1 = center + outerRadius * Math.cos(angle)
        const y1 = center + outerRadius * Math.sin(angle)
        const x2 = center + outerRadius * Math.cos(nextAngle)
        const y2 = center + outerRadius * Math.sin(nextAngle)
        const x3 = center + innerRadius * Math.cos(nextAngle)
        const y3 = center + innerRadius * Math.sin(nextAngle)
        const x4 = center + innerRadius * Math.cos(angle)
        const y4 = center + innerRadius * Math.sin(angle)
        
        const pathD = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`
        
        const isLife = palace.id === 'life'
        const isActive = activePalaceId === palace.id
        const hasStars = palace.majorStars.length > 0
        
        return (
          <g key={palace.id}>
            {/* 宫位扇形背景 */}
            <path
              d={pathD}
              onClick={() => onPalaceClick?.(palace)}
              className={cn(
                'cursor-pointer transition-all duration-300',
                isLife 
                  ? 'fill-gold-100/60 hover:fill-gold-200/80' 
                  : isActive
                    ? 'fill-jade-100/60'
                    : hasStars 
                      ? 'fill-ink-50/50 hover:fill-ink-100/70' 
                      : 'fill-paper/50 hover:fill-ink-50/70'
              )}
              stroke="rgba(184, 148, 47, 0.3)"
              strokeWidth="1"
            />
            
            {/* 宫位名称 */}
            <foreignObject
              x={x - 35}
              y={y - 28}
              width={70}
              height={56}
              className="pointer-events-none"
            >
              <div className="text-center h-full flex flex-col items-center justify-center">
                {/* 中文宫名 */}
                <div 
                  className={cn(
                    'font-bold leading-tight',
                    isLife ? 'text-gold-700 text-base' : 'text-ink-700 text-sm'
                  )}
                  style={{ fontFamily: 'var(--font-kaishu), serif' }}
                >
                  {palace.nameCn}
                </div>
                {/* 主星 */}
                {palace.majorStars.slice(0, 2).map((star, i) => (
                  <div 
                    key={i}
                    className={cn(
                      'text-xs leading-tight',
                      isLife ? 'text-gold-600' : 'text-ink-500'
                    )}
                    style={{ fontFamily: 'var(--font-kaishu), serif' }}
                  >
                    {star.nameCn}
                  </div>
                ))}
              </div>
            </foreignObject>
          </g>
        )
      })}

      {/* 中心区域 - 命宫主星 */}
      <div 
        className="absolute flex flex-col items-center justify-center text-center"
        style={{
          width: innerRadius * 1.6,
          height: innerRadius * 1.6,
          top: center - innerRadius * 0.8,
          left: center - innerRadius * 0.8,
        }}
      >
        <div 
          className="text-lg font-bold text-gold-700 mb-1"
          style={{ fontFamily: 'var(--font-kaishu), serif' }}
        >
          命宫
        </div>
        <div className="text-xs text-ink-500 mb-2">Life Palace</div>
        <div className="text-2xl">
          {palaces[0]?.majorStars.slice(0, 2).map(s => s.nameCn).join('')}
        </div>
        <div className="text-xs text-gold-600 mt-1">
          {palaces[0]?.branchCn}宫
        </div>
      </div>
    </div>
  )
}

/**
 * Palace Detail Card - 宫位详情卡片
 */
export function PalaceDetailCard({
  palace,
  className,
}: {
  palace: PalaceData
  className?: string
}) {
  return (
    <div className={cn(
      'bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-5',
      className
    )}>
      {/* 宫位标题 */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-ink-100">
        <div>
          <h3 
            className="text-xl font-bold text-ink-900"
            style={{ fontFamily: 'var(--font-kaishu), serif' }}
          >
            {palace.nameCn}
          </h3>
          <p className="text-xs text-ink-500">{palace.name}</p>
        </div>
        <div className="text-right">
          <div 
            className="text-lg text-gold-600"
            style={{ fontFamily: 'var(--font-kaishu), serif' }}
          >
            {palace.branchCn}
          </div>
          <div className="text-xs text-ink-400">{palace.branchPinyin}</div>
        </div>
      </div>

      {/* 主星 */}
      {palace.majorStars.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-ink-500 mb-2">主星 Major Stars</div>
          <div className="flex flex-wrap gap-2">
            {palace.majorStars.map((star, i) => (
              <div 
                key={i}
                className="px-3 py-1.5 bg-gold-50 border border-gold-200/50 rounded-lg"
              >
                <div 
                  className="text-sm font-medium text-gold-700"
                  style={{ fontFamily: 'var(--font-kaishu), serif' }}
                >
                  {star.nameCn}
                </div>
                <div className="text-xs text-gold-500">{star.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 辅星 */}
      {palace.auxiliaryStars.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-ink-500 mb-2">辅星 Auxiliary Stars</div>
          <div className="flex flex-wrap gap-1.5">
            {palace.auxiliaryStars.map((star, i) => (
              <span 
                key={i}
                className="px-2 py-0.5 bg-ink-50 border border-ink-200/50 rounded text-xs text-ink-600"
                style={{ fontFamily: 'var(--font-kaishu), serif' }}
              >
                {star}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 解读 */}
      <div className="space-y-3">
        <div>
          <div className="text-xs text-ink-500 mb-1">解读 Interpretation</div>
          <p className="text-sm text-ink-700 leading-relaxed">
            {palace.interpretation.summary}
          </p>
        </div>

        {palace.interpretation.highlights.length > 0 && (
          <div>
            <div className="text-xs text-ink-500 mb-1">亮点 Highlights</div>
            <ul className="space-y-1">
              {palace.interpretation.highlights.map((h, i) => (
                <li key={i} className="text-xs text-jade-700 flex gap-2">
                  <span className="text-jade-500">◆</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {palace.interpretation.challenges.length > 0 && (
          <div>
            <div className="text-xs text-ink-500 mb-1">注意 Challenges</div>
            <ul className="space-y-1">
              {palace.interpretation.challenges.map((c, i) => (
                <li key={i} className="text-xs text-cinnabar-700 flex gap-2">
                  <span className="text-cinnabar-500">◇</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Interactive Ziwei Chart Panel - 交互式紫微命盘面板
 */
export function ZiweiChartPanel({
  palaces,
  className,
}: {
  palaces: PalaceData[]
  className?: string
}) {
  const [activePalace, setActivePalace] = React.useState(palaces[0])

  return (
    <div className={cn('space-y-6', className)}>
      {/* 环形图 */}
      <div className="flex justify-center">
        <svg viewBox="0 0 420 420" className="w-full max-w-md">
          <ZiweiChartSVG 
            palaces={palaces} 
            activePalaceId={activePalace.id}
            onPalaceClick={setActivePalace}
          />
        </svg>
      </div>

      {/* 宫位详情 */}
      <PalaceDetailCard palace={activePalace} />

      {/* 宫位快速导航 */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {palaces.map(palace => (
          <button
            key={palace.id}
            onClick={() => setActivePalace(palace)}
            className={cn(
              'p-2 rounded-lg text-center transition-all',
              activePalace.id === palace.id
                ? 'bg-gold-100 border border-gold-300 text-gold-800'
                : 'bg-white/50 border border-ink-200/50 text-ink-600 hover:bg-ink-50'
            )}
          >
            <div 
              className="text-sm"
              style={{ fontFamily: 'var(--font-kaishu), serif' }}
            >
              {palace.nameCn.slice(0, 2)}
            </div>
            <div className="text-xs opacity-60">{palace.branchCn}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// SVG版本的紫微图（用于SVG渲染）
function ZiweiChartSVG({
  palaces,
  activePalaceId,
  onPalaceClick,
}: {
  palaces: PalaceData[]
  activePalaceId?: string
  onPalaceClick?: (palace: PalaceData) => void
}) {
  const size = 420
  const center = size / 2
  const outerRadius = size * 0.45
  const innerRadius = size * 0.28
  const startAngle = -Math.PI / 2

  return (
    <g>
      {/* 外圈 */}
      <circle cx={center} cy={center} r={outerRadius + 4} fill="none" stroke="rgba(184,148,47,0.3)" strokeWidth="2" />
      <circle cx={center} cy={center} r={innerRadius} fill="rgba(248,244,235,0.6)" stroke="rgba(184,148,47,0.4)" strokeWidth="1.5" />
      
      {/* 十二宫 */}
      {palaces.map((palace, index) => {
        const angle = startAngle + (index / palaces.length) * 2 * Math.PI
        const nextAngle = startAngle + ((index + 1) / palaces.length) * 2 * Math.PI
        const midAngle = (angle + nextAngle) / 2
        
        const midRadius = (outerRadius + innerRadius) / 2
        const x = center + midRadius * Math.cos(midAngle)
        const y = center + midRadius * Math.sin(midAngle)
        
        // 扇形路径
        const x1 = center + outerRadius * Math.cos(angle)
        const y1 = center + outerRadius * Math.sin(angle)
        const x2 = center + outerRadius * Math.cos(nextAngle)
        const y2 = center + outerRadius * Math.sin(nextAngle)
        const x3 = center + innerRadius * Math.cos(nextAngle)
        const y3 = center + innerRadius * Math.sin(nextAngle)
        const x4 = center + innerRadius * Math.cos(angle)
        const y4 = center + innerRadius * Math.sin(angle)
        
        const pathD = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`
        
        const isLife = palace.id === 'life'
        const isActive = activePalaceId === palace.id
        const hasStars = palace.majorStars.length > 0
        
        return (
          <g key={palace.id} onClick={() => onPalaceClick?.(palace)} style={{ cursor: 'pointer' }}>
            <path
              d={pathD}
              fill={
                isActive ? 'rgba(99, 160, 136, 0.25)' :
                isLife ? 'rgba(184, 148, 47, 0.15)' :
                hasStars ? 'rgba(234, 232, 227, 0.5)' :
                'rgba(245, 241, 232, 0.5)'
              }
              stroke="rgba(184, 148, 47, 0.3)"
              strokeWidth="1"
              className="transition-all duration-300"
            />
            
            {/* 宫位名称 - 中文 */}
            <text
              x={x}
              y={y - 8}
              textAnchor="middle"
              className="select-none"
              fill={isLife ? '#a07726' : isActive ? '#316a57' : '#3d3832'}
              fontSize="13"
              fontWeight="bold"
              fontFamily="serif"
            >
              {palace.nameCn}
            </text>
            
            {/* 主星名 */}
            {palace.majorStars.slice(0, 2).map((star, i) => (
              <text
                key={i}
                x={x}
                y={y + 8 + i * 10}
                textAnchor="middle"
                className="select-none"
                fill={isLife ? '#835a21' : '#6b6456'}
                fontSize="10"
                fontFamily="serif"
              >
                {star.nameCn}
              </text>
            ))}
          </g>
        )
      })}

      {/* 中心 */}
      <text
        x={center}
        y={center - 8}
        textAnchor="middle"
        fill="#a07726"
        fontSize="16"
        fontWeight="bold"
        fontFamily="serif"
        className="select-none"
      >
        命宫
      </text>
      <text
        x={center}
        y={center + 8}
        textAnchor="middle"
        fill="#524c42"
        fontSize="11"
        fontFamily="serif"
        className="select-none"
      >
        {palaces[0]?.majorStars.slice(0, 2).map(s => s.nameCn).join('')}
      </text>
      <text
        x={center}
        y={center + 22}
        textAnchor="middle"
        fill="#b8942f"
        fontSize="10"
        fontFamily="serif"
        className="select-none"
      >
        {palaces[0]?.branchCn}宫
      </text>
    </g>
  )
}
