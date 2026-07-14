'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Lock, Crown, ChevronRight, Sparkles } from 'lucide-react'
import { ZiweiChartPanel } from '@/components/ziwei/ziwei-chart'
import { HexagramCard, HexagramComparison } from '@/components/iching/hexagram-display'
import type { ReportType } from '@/types'

interface ReportViewerProps {
  reportType: ReportType
  reportData: Record<string, any>
  isPremium?: boolean
  productName?: string
  productNameCn?: string
  className?: string
}

export function ReportViewer({
  reportType,
  reportData,
  isPremium = false,
  productName,
  productNameCn,
  className,
}: ReportViewerProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* 报告头部 */}
      <ReportHeader 
        reportType={reportType} 
        reportData={reportData}
        productName={productName}
        productNameCn={productNameCn}
      />

      {/* 免费内容 / 基础内容 */}
      {reportData.freeReading && (
        <FreeReadingSection reading={reportData.freeReading} />
      )}

      {/* 付费内容 */}
      {isPremium && reportData.premium ? (
        <PremiumReportContent reportType={reportType} reportData={reportData} />
      ) : (
        <PremiumLockSection 
          reportType={reportType} 
          price={getReportPrice(reportType)}
        />
      )}
    </div>
  )
}

function ReportHeader({ 
  reportType, 
  reportData,
  productName,
  productNameCn,
}: { 
  reportType: ReportType
  reportData: Record<string, any>
  productName?: string
  productNameCn?: string
}) {
  const basic = reportData.basic || {}
  
  return (
    <div className="bg-gradient-to-br from-ink-900 to-ink-800 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
      {/* 装饰 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-jade-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2.5 py-0.5 bg-gold-500/20 text-gold-300 rounded-full">
            {productNameCn || getReportTypeNameCn(reportType)}
          </span>
          <span className="text-xs text-ink-400">
            {productName || getReportTypeName(reportType)}
          </span>
        </div>
        
        <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
          {basic.name ? `${basic.name}'s ` : ''}
          {getReportTitle(reportType)}
        </h1>
        
        {basic.birthDate && (
          <p className="text-ink-400 text-sm">
            {new Date(basic.birthDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            {basic.birthPlace && ` · ${basic.birthPlace}`}
          </p>
        )}
        
        {basic.lunarDate && (
          <p className="text-gold-400/80 text-sm mt-1">
            <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>
              {basic.lunarDate.year}年{basic.lunarDate.month}{basic.lunarDate.day}
            </span>
            {' '}农历
            {basic.naYinCn && ` · ${basic.naYinCn}`}
          </p>
        )}
      </div>
    </div>
  )
}

function FreeReadingSection({ reading }: { reading: Record<string, any> }) {
  const sections = [
    { key: 'personality', label: '性格特点', labelEn: 'Personality', icon: '🌿', color: 'jade' },
    { key: 'career', label: '事业潜质', labelEn: 'Career', icon: '💼', color: 'gold' },
    { key: 'relationships', label: '感情特质', labelEn: 'Relationships', icon: '💕', color: 'cinnabar' },
    { key: 'wealth', label: '财运概况', labelEn: 'Wealth', icon: '💰', color: 'yellow' },
    { key: 'health', label: '健康注意', labelEn: 'Health', icon: '🏥', color: 'jade' },
  ]

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-gold-500" />
        <h2 className="font-serif text-xl font-semibold text-ink-900">
          Basic Reading
          <span className="text-sm font-normal text-ink-500 ml-2">基础解读</span>
        </h2>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const content = reading[section.key]
          if (!content) return null
          
          return (
            <div key={section.key} className="pb-6 border-b border-ink-100 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg bg-${section.color}-100 flex items-center justify-center`}>
                  <span className="text-lg">{section.icon}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink-900">
                  <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>{section.label}</span>
                  <span className="text-sm font-normal text-ink-500 ml-2">{section.labelEn}</span>
                </h3>
              </div>
              
              <div className="ml-10">
                {Array.isArray(content) ? (
                  <ul className="space-y-2">
                    {content.map((item: string, i: number) => (
                      <li key={i} className="flex gap-3 text-ink-700">
                        <span className="text-gold-500 font-bold mt-0.5">◆</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ink-700 leading-relaxed">{content}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PremiumLockSection({ 
  reportType, 
  price,
}: { 
  reportType: ReportType
  price: number
}) {
  const premiumFeatures = getPremiumFeatures(reportType)
  
  return (
    <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
      {/* 装饰 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold flex-shrink-0">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-serif text-xl font-semibold">
                Unlock Premium Report
              </h3>
              <span className="text-xs px-2 py-0.5 bg-gold-500/20 text-gold-300 rounded-full">
                PREMIUM
              </span>
            </div>
            <p className="text-ink-300 text-sm">
              解锁完整深度报告 + AI 道长问答
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 mb-6">
          {premiumFeatures.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-ink-200">
              <ChevronRight className="w-3 h-3 text-gold-400 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="gold" size="lg" className="h-12 px-6">
            <span className="text-sm">${price}</span>
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
  )
}

function PremiumReportContent({ 
  reportType, 
  reportData,
}: { 
  reportType: ReportType
  reportData: Record<string, any>
}) {
  const premium = reportData.premium || {}
  
  // 紫微斗数专属展示
  if (reportType === 'ziwei' && reportData.ziwei) {
    return <ZiweiPremiumContent reportData={reportData} />
  }
  
  // 易经专属展示
  if (reportType === 'iching' && reportData.iching) {
    return <IChingPremiumContent reportData={reportData} />
  }
  
  return (
    <div className="space-y-6">
      {/* 大运 */}
      {premium.greatFortunes && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6 md:p-8">
          <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">
            <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>十年大运</span>
            <span className="text-sm font-normal text-ink-500 ml-2">10-Year Fortune Cycles</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {premium.greatFortunes.slice(0, 5).map((fortune: any, i: number) => (
              <div key={i} className="text-center p-3 bg-ink-50/50 rounded-xl border border-ink-100">
                <div className="text-xs text-ink-500 mb-1">Age {fortune.age}</div>
                <div 
                  className="text-xl mb-1"
                  style={{ fontFamily: 'var(--font-kaishu), serif' }}
                >
                  {fortune.pillar?.stemCn}{fortune.pillar?.branchCn}
                </div>
                <div className="text-xs text-gold-600">{fortune.tenGod}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 流年预测 */}
      {premium.yearlyForecast && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6 md:p-8">
          <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">
            <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>流年运势</span>
            <span className="text-sm font-normal text-ink-500 ml-2">Yearly Predictions</span>
          </h3>
          
          <div className="space-y-2">
            {premium.yearlyForecast.slice(0, 5).map((year: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-ink-50/30 rounded-xl">
                <div className="w-16 text-center">
                  <div className="font-serif text-lg font-semibold text-ink-900">{year.year}</div>
                  <div className="text-xs text-ink-500">{year.yearStemCn}{year.yearBranchCn}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  year.isFavorable ? 'bg-jade-500' : 'bg-gold-500'
                }`} />
                <div className="flex-1 text-sm text-ink-600">
                  {year.summary}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  year.outlook === 'auspicious' 
                    ? 'bg-jade-100 text-jade-700' 
                    : 'bg-gold-100 text-gold-700'
                }`}>
                  {year.outlook === 'auspicious' ? '吉' : '慎'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 喜用方位 */}
      {premium.favorable && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6 md:p-8">
          <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">
            <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>喜用指南</span>
            <span className="text-sm font-normal text-ink-500 ml-2">Favorable Directions</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {premium.favorable.colors && (
              <div className="p-4 bg-ink-50/50 rounded-xl">
                <div className="text-sm text-ink-500 mb-2">幸运颜色 Lucky Colors</div>
                <div className="flex flex-wrap gap-2">
                  {premium.favorable.colors.slice(0, 4).map((color: string, i: number) => (
                    <span key={i} className="text-sm px-2 py-1 bg-white rounded-md border border-ink-200">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {premium.favorable.directions && (
              <div className="p-4 bg-ink-50/50 rounded-xl">
                <div className="text-sm text-ink-500 mb-2">吉利方位 Lucky Directions</div>
                <div className="text-ink-800">
                  {premium.favorable.directions.join('、')}
                </div>
              </div>
            )}
            
            {premium.favorable.numbers && (
              <div className="p-4 bg-ink-50/50 rounded-xl">
                <div className="text-sm text-ink-500 mb-2">幸运数字 Lucky Numbers</div>
                <div className="flex gap-2">
                  {premium.favorable.numbers.slice(0, 4).map((num: number, i: number) => (
                    <span key={i} className="w-8 h-8 rounded-lg bg-gold-100 text-gold-700 flex items-center justify-center font-semibold">
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 紫微斗数专属报告内容
// ============================================================================

function ZiweiPremiumContent({ reportData }: { reportData: Record<string, any> }) {
  const ziwei = reportData.ziwei
  const premium = reportData.premium || {}
  
  return (
    <div className="space-y-6">
      {/* 命盘总览 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6 md:p-8">
        <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">
          <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>紫微命盘</span>
          <span className="text-sm font-normal text-ink-500 ml-2">Ziwei Chart</span>
        </h3>
        
        {/* 命盘基本信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <InfoItem 
            label="命宫" 
            labelEn="Life Palace" 
            value={`${ziwei.lifePalaceStemCn}${ziwei.lifePalaceBranchCn}`}
            valueSub={ziwei.lifePalaceStarsCn?.join('') || ''}
          />
          <InfoItem 
            label="身宫" 
            labelEn="Body Palace" 
            value={ziwei.bodyPalaceCn || ''}
            valueSub={ziwei.bodyPalace || ''}
          />
          <InfoItem 
            label="五行局" 
            labelEn="Element Bureau" 
            value={ziwei.fiveElementBureauCn || ''}
            valueSub={ziwei.fiveElementBureau || ''}
          />
          <InfoItem 
            label="格局" 
            labelEn="Pattern" 
            value={ziwei.patternCn || ''}
            valueSub={ziwei.pattern || ''}
          />
        </div>
        
        {/* 十二宫环形图 */}
        <div className="flex justify-center">
          {ziwei.palaces && <ZiweiChartPanel palaces={ziwei.palaces} />}
        </div>
      </div>

      {/* 命宫深度解读 */}
      <div className="bg-gradient-to-br from-gold-50 to-paper rounded-2xl border border-gold-200/50 p-6 md:p-8">
        <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">
          <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>命宫深度解读</span>
          <span className="text-sm font-normal text-ink-500 ml-2">Life Palace Deep Reading</span>
        </h3>
        
        {ziwei.overallReading && (
          <div className="space-y-5">
            {/* 性格特质 */}
            <div>
              <h4 className="text-sm font-medium text-gold-700 mb-2">性格特质 · Personality</h4>
              <ul className="space-y-2">
                {ziwei.overallReading.personality?.map((item: string, i: number) => (
                  <li key={i} className="flex gap-3 text-ink-700 text-sm">
                    <span className="text-gold-500 font-bold mt-0.5">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 优势 */}
            <div>
              <h4 className="text-sm font-medium text-jade-700 mb-2">天赋优势 · Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {ziwei.overallReading.strengths?.map((item: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-jade-50 text-jade-700 rounded-full text-xs border border-jade-200/50">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            {/* 注意事项 */}
            <div>
              <h4 className="text-sm font-medium text-cinnabar-700 mb-2">注意事项 · Areas to Work</h4>
              <ul className="space-y-1.5">
                {ziwei.overallReading.areasToWork?.map((item: string, i: number) => (
                  <li key={i} className="flex gap-2 text-ink-600 text-sm">
                    <span className="text-cinnabar-500">◇</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 大运 */}
      {premium.greatFortunes && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6 md:p-8">
          <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">
            <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>十年大运</span>
            <span className="text-sm font-normal text-ink-500 ml-2">10-Year Fortune Cycles</span>
          </h3>
          
          <div className="space-y-3">
            {premium.greatFortunes.slice(0, 6).map((fortune: any, i: number) => (
              <div key={i} className={`p-4 rounded-xl border ${
                fortune.outlook === 'favorable' 
                  ? 'bg-jade-50/50 border-jade-200/30' 
                  : fortune.outlook === 'challenging'
                    ? 'bg-gold-50/50 border-gold-200/30'
                    : 'bg-ink-50/50 border-ink-200/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-serif text-lg font-semibold text-ink-900">
                      Ages {fortune.ageStart}-{fortune.ageEnd}
                    </span>
                    <span 
                      className="ml-3 text-sm"
                      style={{ fontFamily: 'var(--font-kaishu), serif' }}
                    >
                      {fortune.palaceNameCn}大运
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    fortune.outlook === 'favorable' 
                      ? 'bg-jade-100 text-jade-700' 
                      : fortune.outlook === 'challenging'
                        ? 'bg-gold-100 text-gold-700'
                        : 'bg-ink-100 text-ink-700'
                  }`}>
                    {fortune.outlook === 'favorable' ? '吉' : fortune.outlook === 'challenging' ? '慎' : '平'}
                  </span>
                </div>
                {fortune.majorStars && (
                  <div 
                    className="text-sm text-gold-600 mb-1"
                    style={{ fontFamily: 'var(--font-kaishu), serif' }}
                  >
                    {fortune.majorStars}
                  </div>
                )}
                <p className="text-sm text-ink-600">{fortune.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 深度分析 */}
      {premium.deepAnalysis && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6 md:p-8">
          <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">
            <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>深度剖析</span>
            <span className="text-sm font-normal text-ink-500 ml-2">Deep Analysis</span>
          </h3>
          
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-medium text-ink-700 mb-2">人生使命 · Life Purpose</h4>
              <p className="text-sm text-ink-600 leading-relaxed">{premium.deepAnalysis.lifePurpose}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-ink-700 mb-2">隐藏天赋 · Hidden Talents</h4>
              <ul className="space-y-1.5">
                {premium.deepAnalysis.hiddenTalents?.map((item: string, i: number) => (
                  <li key={i} className="text-sm text-ink-600 flex gap-2">
                    <span className="text-jade-500">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-ink-700 mb-2">灵修路径 · Spiritual Path</h4>
              <p className="text-sm text-ink-600 leading-relaxed">{premium.deepAnalysis.spiritualPath}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 易经专属报告内容
// ============================================================================

function IChingPremiumContent({ reportData }: { reportData: Record<string, any> }) {
  const iching = reportData.iching
  const premium = reportData.premium || {}
  
  return (
    <div className="space-y-6">
      {/* 卦象总览 */}
      <div className="relative">
        <HexagramCard hexagram={iching.hexagram} showDetails />
      </div>

      {/* 本卦变卦对照 */}
      {iching.changedHexagram && (
        <HexagramComparison
          originalHexagram={iching.hexagram}
          changedHexagram={iching.changedHexagram}
          changingLines={iching.changingLines || []}
        />
      )}

      {/* 卦义详解 */}
      <div className="bg-gradient-to-br from-jade-50/50 to-paper rounded-2xl border border-jade-200/30 p-6 md:p-8">
        <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">
          <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>卦义详解</span>
          <span className="text-sm font-normal text-ink-500 ml-2">Hexagram Meaning</span>
        </h3>
        
        <p className="text-ink-700 leading-relaxed mb-4">
          {iching.interpretation?.hexagramMeaning}
        </p>
        
        {/* 上下卦分析 */}
        {premium.trigramAnalysis && (
          <div className="grid md:grid-cols-2 gap-4 mt-5 pt-5 border-t border-jade-200/30">
            <div className="p-4 bg-white/60 rounded-xl">
              <div className="text-xs text-ink-400 mb-1">上卦 · Outer</div>
              <div className="flex items-center gap-3">
                <span 
                  className="text-2xl"
                  style={{ fontFamily: 'var(--font-kaishu), serif' }}
                >
                  {premium.trigramAnalysis.upperTrigram?.nameCn}
                </span>
                <div>
                  <div className="text-sm font-medium text-ink-800">
                    {premium.trigramAnalysis.upperTrigram?.name}
                  </div>
                  <div className="text-xs text-ink-500">
                    {premium.trigramAnalysis.upperTrigram?.element} · {premium.trigramAnalysis.upperTrigram?.nature}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/60 rounded-xl">
              <div className="text-xs text-ink-400 mb-1">下卦 · Inner</div>
              <div className="flex items-center gap-3">
                <span 
                  className="text-2xl"
                  style={{ fontFamily: 'var(--font-kaishu), serif' }}
                >
                  {premium.trigramAnalysis.lowerTrigram?.nameCn}
                </span>
                <div>
                  <div className="text-sm font-medium text-ink-800">
                    {premium.trigramAnalysis.lowerTrigram?.name}
                  </div>
                  <div className="text-xs text-ink-500">
                    {premium.trigramAnalysis.lowerTrigram?.element} · {premium.trigramAnalysis.lowerTrigram?.nature}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 变爻解读 */}
      {iching.interpretation?.changingLinesInterpretation?.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6 md:p-8">
          <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">
            <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>变爻解读</span>
            <span className="text-sm font-normal text-ink-500 ml-2">Changing Lines Interpretation</span>
          </h3>
          
          <div className="space-y-4">
            {iching.interpretation.changingLinesInterpretation.map((line: any, i: number) => (
              <div key={i} className="p-4 bg-gold-50/50 rounded-xl border border-gold-200/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-full bg-gold-500 text-white text-sm font-bold flex items-center justify-center">
                    {line.position}
                  </span>
                  <span 
                    className="text-base text-ink-800"
                    style={{ fontFamily: 'var(--font-kaishu), serif' }}
                  >
                    {getLineNameCn(line.position)}
                  </span>
                </div>
                <p 
                  className="text-ink-700 mb-2 pl-11"
                  style={{ fontFamily: 'var(--font-kaishu), serif' }}
                >
                  {line.textCn}
                </p>
                <p className="text-sm text-ink-600 italic pl-11">"{line.text}"</p>
                <p className="text-sm text-ink-600 mt-2 pl-11 leading-relaxed">
                  {line.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 实用指引 */}
      {premium.practicalAdvice && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-lg p-6 md:p-8">
          <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">
            <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>实用指引</span>
            <span className="text-sm font-normal text-ink-500 ml-2">Practical Guidance</span>
          </h3>
          
          <ul className="space-y-3">
            {premium.practicalAdvice.map((item: string, i: number) => (
              <li key={i} className="flex gap-3 text-ink-700">
                <span className="text-jade-500 font-bold mt-0.5">✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 时机把握 */}
      {premium.timingGuidance && (
        <div className="bg-gradient-to-br from-ink-900 to-ink-800 rounded-2xl p-6 md:p-8 text-white">
          <h3 className="font-serif text-xl font-semibold mb-4">
            <span style={{ fontFamily: 'var(--font-kaishu), serif' }}>时机把握</span>
            <span className="text-sm font-normal text-ink-400 ml-2">Timing Guidance</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gold-400 mb-1">最佳时机 Best Time</div>
              <p className="text-ink-200 text-sm">{premium.timingGuidance.bestTime}</p>
            </div>
            <div>
              <div className="text-xs text-gold-400 mb-1">注意时期 Caution Period</div>
              <p className="text-ink-200 text-sm">{premium.timingGuidance.cautionPeriod}</p>
            </div>
            <div>
              <div className="text-xs text-gold-400 mb-1">吉利方位 Favorable Directions</div>
              <div className="flex gap-2">
                {premium.timingGuidance.favorableDirections?.map((dir: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-gold-500/20 text-gold-300 rounded text-xs">
                    {dir}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getLineNameCn(position: number): string {
  const names = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
  return names[position - 1] || `${position}爻`
}

function InfoItem({ 
  label, 
  labelEn, 
  value, 
  valueSub 
}: { 
  label: string
  labelEn: string
  value: string
  valueSub?: string
}) {
  return (
    <div className="text-center p-3 bg-ink-50/50 rounded-xl border border-ink-100">
      <div className="text-xs text-ink-400 mb-1">{labelEn}</div>
      <div 
        className="text-lg font-bold text-ink-800"
        style={{ fontFamily: 'var(--font-kaishu), serif' }}
      >
        {label}
      </div>
      <div 
        className="text-base text-gold-600"
        style={{ fontFamily: 'var(--font-kaishu), serif' }}
      >
        {value}
      </div>
      {valueSub && (
        <div className="text-xs text-ink-500 mt-0.5">{valueSub}</div>
      )}
    </div>
  )
}

// Helper functions
function getReportTypeName(type: ReportType): string {
  const names: Record<ReportType, string> = {
    bazi: 'Bazi Report',
    ziwei: 'Ziwei Dou Shu Report',
    iching: 'I Ching Reading',
    relationship: 'Relationship Report',
    career: 'Career & Wealth Report',
    compatibility: 'Couple Compatibility',
  }
  return names[type]
}

function getReportTypeNameCn(type: ReportType): string {
  const names: Record<ReportType, string> = {
    bazi: '八字报告',
    ziwei: '紫微斗数',
    iching: '易经占卜',
    relationship: '感情专项',
    career: '事业财运',
    compatibility: '双人合盘',
  }
  return names[type]
}

function getReportTitle(type: ReportType): string {
  const titles: Record<ReportType, string> = {
    bazi: 'Four Pillars of Destiny Report',
    ziwei: 'Purple Star Astrology Report',
    iching: 'I Ching Divination Reading',
    relationship: 'Love & Relationship Report',
    career: 'Career & Wealth Destiny Report',
    compatibility: 'Couple Compatibility Analysis',
  }
  return titles[type]
}

function getReportPrice(type: ReportType): number {
  const prices: Record<ReportType, number> = {
    bazi: 19.99,
    ziwei: 29.99,
    iching: 14.99,
    relationship: 19.99,
    career: 19.99,
    compatibility: 39.99,
  }
  return prices[type]
}

function getPremiumFeatures(type: ReportType): string[] {
  const features: Record<ReportType, string[]> = {
    bazi: [
      '10-Year Fortune Cycles 十年大运',
      'Yearly Predictions 流年运势',
      'Career & Wealth Timing',
      'Relationship Compatibility',
      'Health & Vitality Analysis',
      'Favorable Directions & Colors',
    ],
    ziwei: [
      '12 Palace Analysis 十二宫详解',
      'Major Stars Interpretation',
      '10-Year Cycles 十年大运',
      'Career & Finance Palace',
      'Relationship Palace',
      'Health Palace Analysis',
    ],
    iching: [
      'Full Hexagram Analysis',
      'All Changing Lines 全爻解读',
      'Practical Action Plan',
      'Timing Guidance 时机把握',
      'Inner/Outer Trigram 内外卦',
      'Traditional Commentary 注疏',
    ],
    relationship: [
      'Love Destiny 感情命盘详解',
      'Partner Type Analysis',
      'Best Timing for Love',
      'Karmic Patterns 前世因缘',
      'Marriage Outlook 婚姻运势',
      'Peach Blossom Analysis',
    ],
    career: [
      'Career Path Deep Dive',
      'Wealth Cycles 财运周期',
      'Best Industries & Roles',
      'Career Milestones 里程碑',
      'Investment Guidance',
      'Success Elements 成功要素',
    ],
    compatibility: [
      'Dual Chart Comparison',
      'Five Elements Harmony 五行',
      'Relationship Dynamics',
      'Strengths & Challenges',
      'Communication Patterns',
      'Timing for Decisions',
    ],
  }
  return features[type]
}
