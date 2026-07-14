'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { Button } from '@/components/ui/button'
import { getProduct } from '@/lib/products'
import { ArrowLeft, Sparkles, User, Calendar, Clock, MapPin, HelpCircle, Coins, Clock as ClockIcon } from 'lucide-react'
import type { ReportType } from '@/types'

export default function ReportInputPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.productId as string
  const product = getProduct(productId)
  
  const [formData, setFormData] = React.useState<Record<string, any>>({
    name: '',
    gender: 'male',
    birthDate: '1990-01-15',
    birthTime: '12:00',
    birthPlace: '',
    question: '',
    // I Ching divination method
    divinationMethod: 'time', // 'coins' | 'time'
    // Person B for compatibility
    nameB: '',
    genderB: 'female',
    birthDateB: '1990-06-20',
    birthTimeB: '14:00',
    birthPlaceB: '',
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  if (!product) {
    return <div>Product not found</div>
  }

  const reportType = product.category as ReportType

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // 构建查询参数
    const searchParams = new URLSearchParams()
    searchParams.set('productId', productId)
    
    if (reportType === 'iching') {
      searchParams.set('question', formData.question)
      searchParams.set('method', formData.divinationMethod)
    } else if (reportType === 'compatibility') {
      searchParams.set('name', formData.name)
      searchParams.set('gender', formData.gender)
      searchParams.set('birthDate', formData.birthDate)
      searchParams.set('birthTime', formData.birthTime)
      searchParams.set('birthPlace', formData.birthPlace)
      searchParams.set('nameB', formData.nameB)
      searchParams.set('genderB', formData.genderB)
      searchParams.set('birthDateB', formData.birthDateB)
      searchParams.set('birthTimeB', formData.birthTimeB)
      searchParams.set('birthPlaceB', formData.birthPlaceB)
    } else {
      searchParams.set('name', formData.name)
      searchParams.set('gender', formData.gender)
      searchParams.set('birthDate', formData.birthDate)
      searchParams.set('birthTime', formData.birthTime)
      searchParams.set('birthPlace', formData.birthPlace)
    }
    
    // 跳转到生成等待页
    router.push(`/reports/${productId}/generating?${searchParams.toString()}`)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.04}
        symbolOpacity={0.02}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* 返回按钮 */}
        <Link href={`/reports/${productId}`} className="inline-flex items-center gap-2 text-ink-500 hover:text-ink-700 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to {product.nameCn}
        </Link>

        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-50 border border-gold-200/50 rounded-full text-gold-700 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Step 1 of 3 · 第一步</span>
          </div>
          <h1 className="heading-h2 text-ink-900 mb-2">
            {getInputTitle(reportType)}
          </h1>
          <p className="text-ink-500">
            {getInputSubtitle(reportType)}
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6 md:p-8">
          {/* 易经：只需要问题 */}
          {reportType === 'iching' ? (
            <IChingForm formData={formData} onChange={handleInputChange} />
          ) : reportType === 'compatibility' ? (
            <CompatibilityForm formData={formData} onChange={handleInputChange} />
          ) : (
            <BaziBasedForm formData={formData} onChange={handleInputChange} />
          )}

          {/* 提交按钮 */}
          <div className="mt-8 pt-6 border-t border-ink-100">
            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full h-14 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Generating...' : `Generate ${product.nameCn}`}
              {!isSubmitting && <Sparkles className="w-4 h-4 ml-2" />}
            </Button>
            <p className="text-xs text-center text-ink-400 mt-3">
              你的数据将被安全加密存储 · Your data is securely encrypted
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

function getInputTitle(type: ReportType): string {
  const titles: Record<ReportType, string> = {
    bazi: 'Enter Your Birth Info',
    ziwei: 'Enter Your Birth Info',
    iching: 'Ask Your Question',
    relationship: 'Enter Your Birth Info',
    career: 'Enter Your Birth Info',
    compatibility: 'Enter Both Birth Details',
  }
  return titles[type]
}

function getInputSubtitle(type: ReportType): string {
  const subtitles: Record<ReportType, string> = {
    bazi: '准确的出生时间是精确排盘的关键',
    ziwei: '紫微斗数需要精确的出生时辰',
    iching: '心诚则灵，默念你的问题',
    relationship: '感情命盘基于你的八字推算',
    career: '事业财运基于你的八字推算',
    compatibility: '双人合盘需要双方的出生信息',
  }
  return subtitles[type]
}

// 八字类报告表单（八字/感情/事业/紫微）
function BaziBasedForm({ 
  formData, 
  onChange 
}: { 
  formData: Record<string, any>
  onChange: (field: string, value: string) => void 
}) {
  return (
    <div className="space-y-5">
      {/* 姓名 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-ink-700 mb-2">
          <User className="w-4 h-4 text-gold-500" />
          Name (optional)
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Your name"
          className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
        />
      </div>

      {/* 性别 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-ink-700 mb-2">
          <User className="w-4 h-4 text-gold-500" />
          Gender · 性别
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange('gender', 'male')}
            className={`h-12 rounded-xl border text-sm font-medium transition-all ${
              formData.gender === 'male'
                ? 'border-gold-400 bg-gold-50 text-gold-700'
                : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
            }`}
          >
            乾造 · Male
          </button>
          <button
            type="button"
            onClick={() => onChange('gender', 'female')}
            className={`h-12 rounded-xl border text-sm font-medium transition-all ${
              formData.gender === 'female'
                ? 'border-cinnabar-400 bg-cinnabar-50 text-cinnabar-700'
                : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
            }`}
          >
            坤造 · Female
          </button>
        </div>
      </div>

      {/* 出生日期 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-ink-700 mb-2">
          <Calendar className="w-4 h-4 text-gold-500" />
          Date of Birth · 出生日期
        </label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => onChange('birthDate', e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
        />
      </div>

      {/* 出生时间 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-ink-700 mb-2">
          <Clock className="w-4 h-4 text-gold-500" />
          Time of Birth · 出生时间
        </label>
        <input
          type="time"
          value={formData.birthTime}
          onChange={(e) => onChange('birthTime', e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
        />
        <p className="text-xs text-ink-400 mt-1.5">
          准确的出生时间对于精确排盘很重要。如果不确定，可以选择中午12点。
        </p>
      </div>

      {/* 出生地点 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-ink-700 mb-2">
          <MapPin className="w-4 h-4 text-gold-500" />
          Place of Birth · 出生地点 (optional)
        </label>
        <input
          type="text"
          value={formData.birthPlace}
          onChange={(e) => onChange('birthPlace', e.target.value)}
          placeholder="e.g., Beijing, China"
          className="w-full h-11 px-4 rounded-xl border border-ink-200 bg-white text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
        />
      </div>
    </div>
  )
}

// 易经表单
function IChingForm({ 
  formData, 
  onChange 
}: { 
  formData: Record<string, any>
  onChange: (field: string, value: string) => void 
}) {
  const [coinResults, setCoinResults] = React.useState<number[]>([])
  const [isFlipping, setIsFlipping] = React.useState(false)

  // 模拟铜钱起卦
  const flipCoins = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setCoinResults([])
    
    // 分六次掷出，模拟六爻生成
    let results: number[] = []
    const flipOne = (index: number) => {
      if (index >= 6) {
        setIsFlipping(false)
        onChange('divinationMethod', 'coins')
        return
      }
      setTimeout(() => {
        // 三枚铜钱：2正1反=3少阳，1正2反=2少阴，3正=9老阳，3反=6老阴
        const coin1 = Math.random() > 0.5 ? 3 : 2 // 正=3，反=2
        const coin2 = Math.random() > 0.5 ? 3 : 2
        const coin3 = Math.random() > 0.5 ? 3 : 2
        const lineValue = coin1 + coin2 + coin3
        results = [...results, lineValue]
        setCoinResults([...results])
        flipOne(index + 1)
      }, 400)
    }
    flipOne(0)
  }

  const method = formData.divinationMethod

  return (
    <div className="space-y-6">
      {/* 起卦方式选择 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-ink-700 mb-3">
          <Sparkles className="w-4 h-4 text-gold-500" />
          Divination Method · 起卦方式
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange('divinationMethod', 'time')}
            className={`h-auto p-4 rounded-xl border text-left transition-all ${
              method === 'time'
                ? 'border-gold-400 bg-gold-50 ring-2 ring-gold-400/30'
                : 'border-ink-200 bg-white hover:border-ink-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <ClockIcon className={`w-4 h-4 ${method === 'time' ? 'text-gold-600' : 'text-ink-400'}`} />
              <span className={`font-medium text-sm ${method === 'time' ? 'text-gold-700' : 'text-ink-700'}`}>
                时间起卦
              </span>
            </div>
            <p className="text-xs text-ink-500">
              Time-based · 基于当下时间生成卦象
            </p>
          </button>
          <button
            type="button"
            onClick={() => onChange('divinationMethod', 'coins')}
            className={`h-auto p-4 rounded-xl border text-left transition-all ${
              method === 'coins'
                ? 'border-jade-400 bg-jade-50/50 ring-2 ring-jade-400/30'
                : 'border-ink-200 bg-white hover:border-ink-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Coins className={`w-4 h-4 ${method === 'coins' ? 'text-jade-600' : 'text-ink-400'}`} />
              <span className={`font-medium text-sm ${method === 'coins' ? 'text-jade-700' : 'text-ink-700'}`}>
                铜钱起卦
              </span>
            </div>
            <p className="text-xs text-ink-500">
              Three Coins · 三枚铜钱法
            </p>
          </button>
        </div>
      </div>

      {/* 问题输入 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-ink-700 mb-2">
          <HelpCircle className="w-4 h-4 text-gold-500" />
          Your Question · 你想问什么？
        </label>
        <textarea
          value={formData.question}
          onChange={(e) => onChange('question', e.target.value)}
          placeholder="请在心中默念你的问题，然后输入在这里...&#10;例如：我今年适合换工作吗？"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-ink-200 bg-white text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 resize-none"
        />
      </div>

      {/* 铜钱起卦交互 */}
      {method === 'coins' && (
        <div className="bg-bamboo-50/50 rounded-xl p-5 border border-bamboo-200/40">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-serif font-medium text-ink-800">三枚铜钱起卦</h4>
            <span className="text-xs text-ink-500">
              {coinResults.length}/6 爻
            </span>
          </div>

          {/* 铜钱展示区 */}
          <div className="flex justify-center gap-4 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isFlipping
                    ? 'animate-bounce border-gold-400 bg-gold-100'
                    : coinResults.length > 0
                    ? 'border-gold-500 bg-gradient-to-br from-gold-300 to-gold-500 shadow-md'
                    : 'border-ink-300 bg-ink-100'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className={`text-xs font-serif ${
                  coinResults.length > 0 ? 'text-white/90' : 'text-ink-400'
                }`}>
                  乾隆
                </span>
              </div>
            ))}
          </div>

          {/* 六爻结果展示 */}
          {coinResults.length > 0 && (
            <div className="flex flex-col-reverse items-center gap-1 mb-4 py-2 bg-ink-900/5 rounded-lg">
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const val = coinResults[i]
                const isYang = val === 7 || val === 9
                const isChanging = val === 6 || val === 9
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-4 text-[10px] text-ink-400 text-right">
                      {i < coinResults.length ? `${i + 1}` : ''}
                    </span>
                    <div className="h-3 flex items-center">
                      {val === undefined ? (
                        <div className="w-16 h-1 bg-ink-200/50 rounded-full" />
                      ) : isYang ? (
                        <div className={`w-16 h-2 rounded-full ${
                          isChanging ? 'bg-gold-500 ring-2 ring-gold-300 ring-opacity-50' : 'bg-ink-700'
                        }`} />
                      ) : (
                        <div className="w-16 h-2 flex justify-between">
                          <div className={`w-7 h-2 rounded-full ${
                            isChanging ? 'bg-gold-500 ring-2 ring-gold-300 ring-opacity-50' : 'bg-ink-700'
                          }`} />
                          <div className={`w-7 h-2 rounded-full ${
                            isChanging ? 'bg-gold-500 ring-2 ring-gold-300 ring-opacity-50' : 'bg-ink-700'
                          }`} />
                        </div>
                      )}
                    </div>
                    <span className="w-8 text-[10px] text-ink-400">
                      {val ? (
                        val === 9 ? '老阳' :
                        val === 6 ? '老阴' :
                        val === 7 ? '少阳' :
                        val === 8 ? '少阴' : ''
                      ) : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          <button
            type="button"
            onClick={flipCoins}
            disabled={isFlipping}
            className={`w-full h-11 rounded-lg text-sm font-medium transition-all ${
              isFlipping
                ? 'bg-ink-200 text-ink-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isFlipping ? '起卦中...' : coinResults.length === 6 ? '重新起卦' : '点击起卦 · Flip Coins'}
          </button>

          {coinResults.length === 6 && (
            <p className="text-xs text-jade-700 text-center mt-3">
              卦象已成，请点击下方按钮查看详解
            </p>
          )}
        </div>
      )}

      <div className="bg-jade-50/50 rounded-xl p-4 border border-jade-200/30">
        <p className="text-sm text-jade-700 leading-relaxed">
          <strong className="font-medium">占卜须知：</strong>
          一事一占，不宜多问。请以诚心问卜，卦象方能应验。
          占卜结果仅供参考，最终决策还需结合实际情况。
        </p>
      </div>
    </div>
  )
}

// 双人合盘表单
function CompatibilityForm({ 
  formData, 
  onChange 
}: { 
  formData: Record<string, any>
  onChange: (field: string, value: string) => void 
}) {
  return (
    <div className="space-y-8">
      {/* Person A */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-gold-500 text-white text-xs font-bold flex items-center justify-center">
            A
          </div>
          <h3 className="font-serif text-lg font-semibold text-ink-900">
            Person A · 甲方
          </h3>
        </div>
        
        <div className="space-y-4 pl-8">
          <div>
            <label className="text-sm font-medium text-ink-700 mb-1.5 block">Name (optional)</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Name"
              className="w-full h-10 px-3 rounded-lg border border-ink-200 bg-white text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange('gender', 'male')}
              className={`h-10 rounded-lg border text-sm font-medium transition-all ${
                formData.gender === 'male'
                  ? 'border-gold-400 bg-gold-50 text-gold-700'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
              }`}
            >
              Male · 男
            </button>
            <button
              type="button"
              onClick={() => onChange('gender', 'female')}
              className={`h-10 rounded-lg border text-sm font-medium transition-all ${
                formData.gender === 'female'
                  ? 'border-cinnabar-400 bg-cinnabar-50 text-cinnabar-700'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
              }`}
            >
              Female · 女
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-ink-500 mb-1 block">Birth Date</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => onChange('birthDate', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-ink-200 bg-white text-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-ink-500 mb-1 block">Birth Time</label>
              <input
                type="time"
                value={formData.birthTime}
                onChange={(e) => onChange('birthTime', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-ink-200 bg-white text-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs text-ink-500 mb-1 block">Birth Place (optional)</label>
            <input
              type="text"
              value={formData.birthPlace}
              onChange={(e) => onChange('birthPlace', e.target.value)}
              placeholder="City, Country"
              className="w-full h-10 px-3 rounded-lg border border-ink-200 bg-white text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ink-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-ink-400 font-serif">
            &
          </span>
        </div>
      </div>

      {/* Person B */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-jade-500 text-white text-xs font-bold flex items-center justify-center">
            B
          </div>
          <h3 className="font-serif text-lg font-semibold text-ink-900">
            Person B · 乙方
          </h3>
        </div>
        
        <div className="space-y-4 pl-8">
          <div>
            <label className="text-sm font-medium text-ink-700 mb-1.5 block">Name (optional)</label>
            <input
              type="text"
              value={formData.nameB}
              onChange={(e) => onChange('nameB', e.target.value)}
              placeholder="Name"
              className="w-full h-10 px-3 rounded-lg border border-ink-200 bg-white text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange('genderB', 'male')}
              className={`h-10 rounded-lg border text-sm font-medium transition-all ${
                formData.genderB === 'male'
                  ? 'border-gold-400 bg-gold-50 text-gold-700'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
              }`}
            >
              Male · 男
            </button>
            <button
              type="button"
              onClick={() => onChange('genderB', 'female')}
              className={`h-10 rounded-lg border text-sm font-medium transition-all ${
                formData.genderB === 'female'
                  ? 'border-cinnabar-400 bg-cinnabar-50 text-cinnabar-700'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
              }`}
            >
              Female · 女
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-ink-500 mb-1 block">Birth Date</label>
              <input
                type="date"
                value={formData.birthDateB}
                onChange={(e) => onChange('birthDateB', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-ink-200 bg-white text-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-ink-500 mb-1 block">Birth Time</label>
              <input
                type="time"
                value={formData.birthTimeB}
                onChange={(e) => onChange('birthTimeB', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-ink-200 bg-white text-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs text-ink-500 mb-1 block">Birth Place (optional)</label>
            <input
              type="text"
              value={formData.birthPlaceB}
              onChange={(e) => onChange('birthPlaceB', e.target.value)}
              placeholder="City, Country"
              className="w-full h-10 px-3 rounded-lg border border-ink-200 bg-white text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
