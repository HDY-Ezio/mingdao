'use client'

export const dynamic = 'force-dynamic'

import * as React from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { ReportViewer } from '@/components/report/report-viewer'
import { ChatPanel } from '@/components/chat/chat-panel'
import { getProduct } from '@/lib/products'
import { calculateBazi } from '@/lib/bazi-calculator'
import { generateReport } from '@/lib/report-generator'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MessageCircle, FileText } from 'lucide-react'
import type { ReportType, BaziResult } from '@/types'

export default function ReportResultPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  
  const productId = params.productId as string
  const product = getProduct(productId)
  const reportType = product?.category as ReportType
  
  const [reportData, setReportData] = React.useState<Record<string, any> | null>(null)
  const [showChat, setShowChat] = React.useState(false)
  const [isPremium, setIsPremium] = React.useState(false) // MVP期默认false，可点击解锁模拟支付

  // 生成报告数据
  React.useEffect(() => {
    if (!product) return
    
    const generateReportData = () => {
      const name = searchParams.get('name') || ''
      const gender = (searchParams.get('gender') as 'male' | 'female') || 'male'
      const dateStr = searchParams.get('birthDate') || searchParams.get('date') || '1990-01-15'
      const timeStr = searchParams.get('birthTime') || searchParams.get('time') || '12:00'
      const place = searchParams.get('birthPlace') || searchParams.get('place') || ''
      const question = searchParams.get('question') || ''
      
      // Person B for compatibility
      const nameB = searchParams.get('nameB') || ''
      const genderB = (searchParams.get('genderB') as 'male' | 'female') || 'female'
      const dateStrB = searchParams.get('birthDateB') || '1990-06-20'
      const timeStrB = searchParams.get('birthTimeB') || '14:00'
      const placeB = searchParams.get('birthPlaceB') || ''

      const [year, month, day] = dateStr.split('-').map(Number)
      const [hours, minutes] = timeStr.split(':').map(Number)
      const birthDate = new Date(year, month - 1, day, hours, minutes)
      
      const baziResult: BaziResult = calculateBazi({
        name,
        gender,
        birthDate,
        birthPlace: place,
        longitude: 120,
      })

      if (reportType === 'compatibility') {
        const [yearB, monthB, dayB] = dateStrB.split('-').map(Number)
        const [hoursB, minutesB] = timeStrB.split(':').map(Number)
        const birthDateB = new Date(yearB, monthB - 1, dayB, hoursB, minutesB)
        
        const baziResultB: BaziResult = calculateBazi({
          name: nameB,
          gender: genderB,
          birthDate: birthDateB,
          birthPlace: placeB,
          longitude: 120,
        })
        
        return generateReport('compatibility', { reading1: baziResult, reading2: baziResultB })
      }
      
      if (reportType === 'iching') {
        const method = (searchParams.get('method') as 'time' | 'coins') || 'time'
        return generateReport('iching', { question, method })
      }
      
      return generateReport(reportType, {}, baziResult)
    }
    
    const data = generateReportData()
    setReportData(data)
  }, [product, reportType, searchParams])

  if (!product || !reportData) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <p className="text-ink-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.04}
        symbolOpacity={0.02}
      />

      {/* 顶部导航栏 - 移动端切换按钮 */}
      <div className="sticky top-16 md:top-20 z-30 bg-paper/80 backdrop-blur-md border-b border-ink-200/50 md:hidden">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2">
          <button
            onClick={() => setShowChat(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              !showChat 
                ? 'bg-gold-100 text-gold-700' 
                : 'text-ink-500 hover:bg-ink-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            Report
          </button>
          <button
            onClick={() => setShowChat(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              showChat 
                ? 'bg-jade-100 text-jade-700' 
                : 'text-ink-500 hover:bg-ink-100'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* 返回按钮 */}
        <div className="mb-6 hidden md:block">
          <Link href={`/reports/${productId}`} className="inline-flex items-center gap-2 text-ink-500 hover:text-ink-700 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to {product.nameCn}
          </Link>
        </div>

        {/* 主内容区 - 桌面端左右布局，移动端上下切换 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 报告内容区 */}
          <div className={`flex-1 min-w-0 ${showChat ? 'hidden lg:block' : 'block'}`}>
            <ReportViewer
              reportType={reportType}
              reportData={reportData}
              isPremium={isPremium}
              productName={product.name}
              productNameCn={product.nameCn}
            />
            
            {/* 解锁按钮 - 模拟支付流程 */}
            {!isPremium && (
              <div className="mt-6">
                <Button 
                  variant="gold" 
                  size="lg" 
                  className="w-full h-14"
                  onClick={() => {
                    // MVP期模拟支付解锁
                    setIsPremium(true)
                  }}
                >
                  Unlock Full Report - ${product.price}
                </Button>
                <p className="text-xs text-center text-ink-400 mt-2">
                  MVP Demo · 点击即可模拟解锁完整报告
                </p>
              </div>
            )}
          </div>

          {/* 聊天面板 - 桌面端右侧，移动端条件显示 */}
          <div className={`w-full lg:w-96 lg:flex-shrink-0 ${showChat ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-28 h-[calc(100vh-10rem)] lg:h-[calc(100vh-8rem)] min-h-[500px]">
              <ChatPanel
                reportType={reportType}
                reportData={reportData}
                questionsUsed={0}
                questionsTotal={product.baseQuestions}
                isDeepUnlocked={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
