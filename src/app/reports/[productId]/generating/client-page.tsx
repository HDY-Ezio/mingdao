'use client'

export const dynamic = 'force-dynamic'

import * as React from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { getProduct } from '@/lib/products'
import { Sparkles, Loader2 } from 'lucide-react'
import type { ReportType } from '@/types'

export default function ReportGeneratingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const productId = params.productId as string
  const product = getProduct(productId)
  const reportType = product?.category as ReportType
  
  const [progress, setProgress] = React.useState(0)
  const [currentStep, setCurrentStep] = React.useState(0)

  const steps = getGenerationSteps(reportType || 'bazi')

  React.useEffect(() => {
    if (!product) return

    const totalDuration = 3500 // 3.5秒总时长
    const stepDuration = totalDuration / steps.length
    let currentProgress = 0

    const progressInterval = setInterval(() => {
      currentProgress += 1
      setProgress(Math.min(currentProgress, 100))
    }, totalDuration / 100)

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }, stepDuration)

    // 完成后跳转到结果页
    const timeout = setTimeout(() => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      
      // 保留所有查询参数
      const paramsStr = searchParams.toString()
      router.push(`/reports/${productId}/result?${paramsStr}`)
    }, totalDuration)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      clearTimeout(timeout)
    }
  }, [product, productId, router, searchParams, steps.length])

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.06}
        symbolOpacity={0.04}
      />

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-5rem)] px-4">
        <div className="text-center max-w-md mx-auto">
          {/* 旋转的太极图 */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-gold-300/30 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold-100 to-gold-200/50 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold-600 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-t-gold-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }} />
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-ink-900 mb-2">
            Generating Your {product.nameCn}
          </h1>
          <p className="text-ink-500 mb-8">
            正在为您推演命理，请稍候...
          </p>

          {/* 进度条 */}
          <div className="mb-8">
            <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-ink-400 mt-2">{progress}%</p>
          </div>

          {/* 生成步骤 */}
          <div className="space-y-3 text-left bg-white/60 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-5">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  index < currentStep 
                    ? 'bg-jade-500 text-white' 
                    : index === currentStep 
                      ? 'bg-gold-500 text-white animate-pulse' 
                      : 'bg-ink-100 text-ink-400'
                }`}>
                  {index < currentStep ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : index === currentStep ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span className={`text-sm transition-colors duration-300 ${
                  index <= currentStep ? 'text-ink-700' : 'text-ink-400'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* 小贴士 */}
          <p className="text-xs text-ink-400 mt-6 italic">
            "命由己造，相由心生。福祸无门，惟人自召。"
          </p>
        </div>
      </div>
    </div>
  )
}

function getGenerationSteps(type: ReportType): string[] {
  const baseSteps = [
    'Calculating celestial positions / 推演天干地支',
    'Analyzing five elements balance / 分析五行平衡',
    'Generating chart interpretation / 生成命盘解读',
    'Preparing your report / 整理您的专属报告',
  ]

  const typeSteps: Record<ReportType, string[]> = {
    bazi: [
      'Calculating Four Pillars / 计算四柱八字',
      'Analyzing Day Master strength / 分析日主强弱',
      'Determining favorable elements / 确定喜用神',
      'Calculating 10-year fortune cycles / 推算十年大运',
      'Generating comprehensive reading / 生成完整解读',
    ],
    ziwei: [
      'Calculating Ziwei chart / 排紫微斗数命盘',
      'Placing major stars / 安布十四主星',
      'Analyzing twelve palaces / 解析十二宫位',
      'Calculating fortune cycles / 推算大运流年',
      'Generating comprehensive reading / 生成完整解读',
    ],
    iching: [
      'Casting the hexagram / 起卦排盘',
      'Analyzing trigrams / 解析内外卦',
      'Interpreting changing lines / 解读变爻',
      'Applying to your question / 对应您的问题',
      'Generating guidance / 生成指引建议',
    ],
    relationship: [
      'Calculating your Bazi chart / 排算八字命盘',
      'Analyzing love destiny / 分析感情命数',
      'Mapping relationship patterns / 推演感情模式',
      'Identifying timing & opportunities / 把握时机',
      'Generating relationship guidance / 生成感情指引',
    ],
    career: [
      'Calculating your Bazi chart / 排算八字命盘',
      'Analyzing career potential / 分析事业潜质',
      'Mapping wealth cycles / 推算财运周期',
      'Identifying opportunity timing / 把握机遇',
      'Generating career & wealth guidance / 生成指引',
    ],
    compatibility: [
      'Calculating both Bazi charts / 排算双方八字',
      'Analyzing five elements harmony / 分析五行和谐',
      'Comparing Day Masters / 对比日主特质',
      'Mapping relationship dynamics / 推演相处模式',
      'Generating compatibility report / 生成合婚报告',
    ],
  }

  return typeSteps[type] || baseSteps
}
