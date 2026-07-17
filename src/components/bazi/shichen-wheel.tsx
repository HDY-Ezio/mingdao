'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { SHICHEN_TIME_RANGES } from '@/lib/lunar-calendar'

interface ShichenWheelProps {
  selectedIndex: number
  onChange: (index: number) => void
  className?: string
}

/**
 * 时辰罗盘选择器
 * 十二时辰环绕圆形排列，用户可旋转选择
 */
export function ShichenWheel({ selectedIndex, onChange, className }: ShichenWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  const startAngleRef = useRef(0)
  const startRotationRef = useRef(0)

  // 每个时辰对应的角度
  const itemAngle = 360 / 12

  // 计算选中项对应的旋转角度
  // 第 index 个时辰转到正上方（0度位置）
  const targetRotation = -selectedIndex * itemAngle + 90

  useEffect(() => {
    setRotation(targetRotation)
  }, [targetRotation])

  const getAngleFromEvent = useCallback((clientX: number, clientY: number) => {
    if (!wheelRef.current) return 0
    const rect = wheelRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI)
    return angle
  }, [])

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true)
    startAngleRef.current = getAngleFromEvent(clientX, clientY)
    startRotationRef.current = rotation
  }, [rotation, getAngleFromEvent])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return
    
    const currentAngle = getAngleFromEvent(clientX, clientY)
    const deltaAngle = currentAngle - startAngleRef.current
    const newRotation = startRotationRef.current + deltaAngle
    setRotation(newRotation)
  }, [isDragging, getAngleFromEvent])

  const handleEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    
    // 吸附到最近的时辰
    // 找到最接近0度（正上方）的时辰
    const normalizedRotation = ((rotation % 360) + 360) % 360
    // 时辰在旋转后的位置：原始角度 + rotation
    // 我们要找哪个时辰最接近 90度（正上方）
    // 时辰 i 的角度 = i * 30 + rotation
    // 距离 90 度最近的 = (90 - rotation) / 30
    
    let targetIndex = Math.round((90 - rotation) / itemAngle) % 12
    if (targetIndex < 0) targetIndex += 12
    
    onChange(targetIndex)
  }, [isDragging, rotation, itemAngle, onChange])

  // 鼠标事件
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const handleMouseUp = () => handleEnd()

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMove, handleEnd])

  // 触摸事件
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const handleTouchEnd = () => handleEnd()

    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, handleMove, handleEnd])

  // 点击某个时辰直接选中
  const handleItemClick = (index: number) => {
    onChange(index)
  }

  const selected = SHICHEN_TIME_RANGES[selectedIndex]

  return (
    <div className={cn('relative select-none', className)}>
      {/* 外圈装饰 */}
      <div className="absolute inset-0 rounded-full border-2 border-gold-300/30" />
      <div className="absolute inset-2 rounded-full border border-gold-200/20" />
      
      {/* 时辰转盘 */}
      <div
        ref={wheelRef}
        className="relative w-full aspect-square cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            handleStart(e.touches[0].clientX, e.touches[0].clientY)
          }
        }}
        style={{ touchAction: 'none' }}
      >
        {/* 旋转容器 */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isDragging ? '0ms' : '300ms',
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {SHICHEN_TIME_RANGES.map((shichen, index) => {
            const angle = index * itemAngle
            const isSelected = index === selectedIndex
            
            return (
              <div
                key={index}
                className="absolute left-1/2 top-1/2 origin-bottom"
                style={{
                  transform: `translate(-50%, -100%) rotate(${angle}deg) translateY(-42%)`,
                  height: '50%',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleItemClick(index)
                }}
              >
                <div
                  className={cn(
                    'flex flex-col items-center transition-all duration-200',
                    isSelected ? 'scale-110' : 'opacity-60 hover:opacity-80'
                  )}
                  style={{ transform: `rotate(${-rotation - angle}deg)` }}
                >
                  {/* 时辰中文大字 */}
                  <span
                    className={cn(
                      'font-serif text-xl md:text-2xl font-semibold transition-colors',
                      isSelected ? 'text-cinnabar-600' : 'text-ink-700'
                    )}
                    style={{ fontFamily: 'var(--font-kaishu), serif' }}
                  >
                    {shichen.name}
                  </span>
                  {/* 拼音 */}
                  <span className={cn(
                    'text-[10px] mt-0.5',
                    isSelected ? 'text-gold-600 font-medium' : 'text-ink-400'
                  )}>
                    {shichen.pinyin}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* 中心显示 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-ink-800 to-ink-900 flex flex-col items-center justify-center shadow-ink-lg border-2 border-gold-500/30">
          <span
            className="text-2xl md:text-3xl text-gold-400 font-serif font-semibold"
            style={{ fontFamily: 'var(--font-kaishu), serif' }}
          >
            {selected.name}
          </span>
          <span className="text-[10px] text-gold-300/70 mt-0.5">
            {selected.start} – {selected.end}
          </span>
        </div>

        {/* 顶部指示标记 */}
        <div className="absolute left-1/2 -top-2 -translate-x-1/2">
          <div className="w-4 h-4 bg-cinnabar-500 rotate-45 shadow-lg" />
        </div>
      </div>

      {/* 提示文字 */}
      <p className="text-center text-xs text-ink-400 mt-4">
        Rotate the wheel or tap to select your birth hour
      </p>
    </div>
  )
}
