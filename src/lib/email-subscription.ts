/**
 * Email Subscription Service - 邮件订阅服务
 * 
 * Features:
 * - Subscribe / Unsubscribe
 * - Manage preferences
 * - Resend integration placeholder
 * - Daily fortune generation
 */

import type { EmailSubscription, DailyFortuneEmail } from '@/types'
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, FIVE_ELEMENTS, FIVE_ELEMENTS_CN, ZODIAC_ANIMALS, ZODIAC_ANIMALS_CN } from './lunar-calendar'

// ============================================================================
// Daily Fortune Generation
// ============================================================================

/**
 * Generate daily fortune for a user
 * 基于用户命盘 + 当日干支生成个性化运势
 */
export function generateDailyFortune(params: {
  date?: Date
  userBazi?: {
    dayMaster: string
    dayMasterStrength: 'strong' | 'balanced' | 'weak'
    favorableElements: string[]
    zodiac: string
  }
}): DailyFortuneEmail {
  const date = params.date || new Date()
  const userBazi = params.userBazi
  
  // 计算当日干支 (简化版)
  const dayIndex = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
  const dayStemIndex = (dayIndex + 9) % 10  // 偏移校准
  const dayBranchIndex = (dayIndex + 1) % 12
  
  const dayStem = HEAVENLY_STEMS[dayStemIndex]
  const dayBranch = EARTHLY_BRANCHES[dayBranchIndex]
  
  // 当日五行
  const dayElementIndex = Math.floor(dayStemIndex / 2)
  const fiveElementDay = FIVE_ELEMENTS[dayElementIndex]
  const fiveElementDayCn = FIVE_ELEMENTS_CN[dayElementIndex]
  
  // 计算运势分数 (基于日主与当日五行的关系)
  let baseScore = 60
  
  if (userBazi) {
    const isFavorable = userBazi.favorableElements.some(
      e => e.toLowerCase() === fiveElementDay.toLowerCase()
    )
    if (isFavorable) {
      baseScore += 20
    }
    
    if (userBazi.dayMasterStrength === 'strong') {
      // 身强喜克泄耗
      if (dayElementIndex !== FIVE_ELEMENTS.indexOf(userBazi.dayMaster as typeof FIVE_ELEMENTS[number])) {
        baseScore += 5
      }
    } else if (userBazi.dayMasterStrength === 'weak') {
      // 身弱喜生助
      if (dayElementIndex === FIVE_ELEMENTS.indexOf(userBazi.dayMaster as typeof FIVE_ELEMENTS[number])) {
        baseScore += 10
      }
    }
  }
  
  // 添加一些"随机性"让每天不同
  const pseudoRandom = ((dayIndex * 7 + 3) % 15) - 7
  baseScore += pseudoRandom
  
  const overallScore = Math.max(30, Math.min(98, baseScore))
  
  // 各方面运势
  const loveScore = Math.max(30, Math.min(98, baseScore + ((dayIndex * 3 + 5) % 20) - 10))
  const careerScore = Math.max(30, Math.min(98, baseScore + ((dayIndex * 5 + 2) % 20) - 10))
  const wealthScore = Math.max(30, Math.min(98, baseScore + ((dayIndex * 11 + 7) % 20) - 10))
  const healthScore = Math.max(40, Math.min(95, baseScore + ((dayIndex * 2 + 1) % 15) - 7))
  
  // 幸运物
  const luckyItems = generateLuckyItems(dayStemIndex, dayBranchIndex, fiveElementDay)
  
  // 每日寄语
  const dailyMessage = generateDailyMessage(overallScore, fiveElementDay)
  
  // 生肖运势
  const zodiacFortune = generateZodiacFortune(date, userBazi?.zodiac)
  
  return {
    date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    dayStem,
    dayBranch,
    dayStemCn: dayStem,
    dayBranchCn: dayBranch,
    fiveElementDay,
    fiveElementDayCn,
    overallFortune: overallScore,
    loveFortune: loveScore,
    careerFortune: careerScore,
    wealthFortune: wealthScore,
    healthFortune: healthScore,
    luckyColor: luckyItems.color,
    luckyNumber: luckyItems.number,
    luckyDirection: luckyItems.direction,
    dailyMessage: dailyMessage.en,
    dailyMessageCn: dailyMessage.cn,
    zodiacFortune: {},
  }
}

function generateLuckyItems(stemIndex: number, branchIndex: number, element: string) {
  const colorsByElement: Record<string, { en: string; cn: string }> = {
    Wood: { en: 'Jade Green', cn: '碧玉色' },
    Fire: { en: 'Crimson Red', cn: '朱砂红' },
    Earth: { en: 'Golden Yellow', cn: '土黄色' },
    Metal: { en: 'Pearl White', cn: '珍珠白' },
    Water: { en: 'Deep Blue', cn: '深海蓝' },
  }
  
  const numbersByElement: Record<string, number> = {
    Wood: 3,
    Fire: 9,
    Earth: 5,
    Metal: 7,
    Water: 1,
  }
  
  const directionsByElement: Record<string, { en: string; cn: string }> = {
    Wood: { en: 'East', cn: '东' },
    Fire: { en: 'South', cn: '南' },
    Earth: { en: 'Center', cn: '中' },
    Metal: { en: 'West', cn: '西' },
    Water: { en: 'North', cn: '北' },
  }
  
  return {
    color: colorsByElement[element]?.en || 'Gold',
    colorCn: colorsByElement[element]?.cn || '金色',
    number: numbersByElement[element] || 8,
    direction: directionsByElement[element]?.en || 'Southeast',
    directionCn: directionsByElement[element]?.cn || '东南',
  }
}

function generateDailyMessage(score: number, element: string): { en: string; cn: string } {
  const messages: Record<string, { en: string; cn: string }[]> = {
    high: [
      { en: 'The stars align in your favor today. Seize the moment — opportunities present themselves effortlessly.', cn: '今日吉星高照，诸事顺遂。把握时机，机遇自来。' },
      { en: 'A day of great potential. Your natural talents shine brightly and others take notice.', cn: '今日大有可为，才华展露，引人瞩目。' },
      { en: 'Harmonious energy flows around you. Relationships deepen and plans move forward smoothly.', cn: '今日气场和谐，感情升温，诸事亨通。' },
    ],
    medium: [
      { en: 'A balanced day with steady energy. Focus on consolidation rather than bold new moves.', cn: '今日能量平稳，宜守不宜攻，巩固成果为上。' },
      { en: 'Mixed fortunes — some things flow easily while others require patience. Pick your battles.', cn: '今日吉凶参半，顺势而为，知进退。' },
      { en: 'A day for inner work and reflection. Progress may be slow but is still meaningful.', cn: '今日宜内省深思，进展虽缓但意义深远。' },
    ],
    low: [
      { en: 'A day to lay low and conserve energy. Focus on self-care and avoid major decisions.', cn: '今日宜韬光养晦，休养生息，不做重大决策。' },
      { en: 'Challenges may arise but they are temporary. Stay centered and respond wisely.', cn: '今日或有挑战，但皆为暂时，静心应对即可。' },
      { en: 'A time for rest and renewal. What cannot be done today will flow tomorrow.', cn: '今日宜休整，今日不成之事，明日自成。' },
    ],
  }
  
  const category = score >= 75 ? 'high' : score >= 55 ? 'medium' : 'low'
  const index = Math.floor((score + element.length) % messages[category].length)
  
  return messages[category][index]
}

function generateZodiacFortune(date: Date, userZodiac?: string) {
  const zodiacs = ZODIAC_ANIMALS
  const fortunes: Record<string, { score: number; note: string }> = {}
  
  zodiacs.forEach((zodiac, i) => {
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const score = 40 + ((dayOfYear * 3 + i * 7) % 45)
    fortunes[zodiac.toLowerCase()] = {
      score,
      note: score >= 70 ? 'Auspicious day for your sign' : score >= 55 ? 'Moderate energy' : 'Caution advised',
    }
  })
  
  return fortunes
}

// ============================================================================
// Subscription Management (Mock Implementation)
// ============================================================================

// In-memory store for demo purposes
const mockSubscriptions: Map<string, EmailSubscription> = new Map()

/**
 * Subscribe to email list
 */
export async function subscribe(params: {
  email: string
  name?: string
  userId?: string
  preferences?: Partial<EmailSubscription['preferences']>
}): Promise<EmailSubscription> {
  const existing = Array.from(mockSubscriptions.values()).find(s => s.email === params.email)
  
  if (existing) {
    // Reactivate if exists
    existing.isActive = true
    existing.unsubscribedAt = undefined
    if (params.preferences) {
      existing.preferences = { ...existing.preferences, ...params.preferences }
    }
    return existing
  }
  
  const token = generateToken()
  
  const subscription: EmailSubscription = {
    id: generateId(),
    userId: params.userId,
    email: params.email,
    isActive: true,
    frequency: 'daily',
    preferences: {
      dailyFortune: params.preferences?.dailyFortune ?? true,
      weeklyForecast: params.preferences?.weeklyForecast ?? true,
      specialOccasions: params.preferences?.specialOccasions ?? true,
      productUpdates: params.preferences?.productUpdates ?? false,
    },
    subscribedAt: new Date().toISOString(),
    token,
  }
  
  mockSubscriptions.set(subscription.id, subscription)
  
  // TODO: Send welcome email via Resend
  // await resend.emails.send({ ... })
  
  return subscription
}

/**
 * Unsubscribe from email list
 */
export async function unsubscribe(token: string): Promise<boolean> {
  const subscription = Array.from(mockSubscriptions.values()).find(s => s.token === token)
  
  if (!subscription) {
    return false
  }
  
  subscription.isActive = false
  subscription.unsubscribedAt = new Date().toISOString()
  
  return true
}

/**
 * Get subscription by email
 */
export async function getSubscriptionByEmail(email: string): Promise<EmailSubscription | undefined> {
  return Array.from(mockSubscriptions.values()).find(s => s.email === email)
}

/**
 * Update subscription preferences
 */
export async function updatePreferences(
  email: string,
  preferences: Partial<EmailSubscription['preferences']>
): Promise<EmailSubscription | undefined> {
  const subscription = Array.from(mockSubscriptions.values()).find(s => s.email === email)
  
  if (!subscription) {
    return undefined
  }
  
  subscription.preferences = { ...subscription.preferences, ...preferences }
  
  return subscription
}

// ============================================================================
// Resend Integration Placeholder
// ============================================================================

/**
 * Send daily fortune email via Resend (placeholder)
 * 实际集成时替换为真实的 Resend SDK 调用
 */
export async function sendDailyFortuneEmail(params: {
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; messageId?: string }> {
  // TODO: Replace with actual Resend integration
  // import { Resend } from 'resend'
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // const { data, error } = await resend.emails.send({ ... })
  
  console.log(`[Resend Mock] Sending daily fortune to ${params.to}`)
  console.log(`[Resend Mock] Subject: ${params.subject}`)
  
  // Mock delay
  await new Promise(resolve => setTimeout(resolve, 50))
  
  return {
    success: true,
    messageId: `mock_${Date.now()}`,
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

function generateId(): string {
  return 'sub_' + Math.random().toString(36).substring(2, 15)
}

function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
