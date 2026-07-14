// Types for Mingdao application

export interface User {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  gender?: 'male' | 'female' | 'other'
  birthDate?: string
  birthPlace?: string
  subscriptionType: 'free' | 'premium' | 'pro'
  credits: number
  isSubscribed: boolean
  createdAt: string
  updatedAt: string
}

export interface BaziReading {
  id: string
  userId: string
  yearPillar: { stem: string; branch: string }
  monthPillar: { stem: string; branch: string }
  dayPillar: { stem: string; branch: string }
  hourPillar: { stem: string; branch: string }
  reading: string
  createdAt: string
}

export interface IChingReading {
  id: string
  userId: string
  question: string
  hexagram: number
  hexagramName: string
  changingLines: number[]
  reading: string
  createdAt: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  author: string
  publishedAt: string
  tags: string[]
}

export interface Service {
  id: string
  name: string
  nameChinese: string
  description: string
  longDescription: string
  price: number
  duration: string
  features: string[]
  icon: string
}

// ============================================================================
// Phase 3 Types
// ============================================================================

export type ReportType = 'bazi' | 'ziwei' | 'iching' | 'relationship' | 'career' | 'compatibility'

export interface Product {
  id: string
  name: string
  nameCn: string
  description: string
  category: ReportType
  price: number
  currency: string
  baseQuestions: number
  isActive: boolean
  features: string[]
  sortOrder: number
}

export interface Report {
  id: string
  userId: string
  productId: string
  title: string
  reportType: ReportType
  inputData: Record<string, any>
  reportData: Record<string, any>
  questionsUsed: number
  questionsTotal: number
  status: 'generating' | 'ready' | 'failed'
  isDeepUnlocked: boolean
  orderId?: string
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  userId: string
  reportId?: string
  title?: string
  contextType: ReportType | 'general'
  contextData: Record<string, any>
  messageCount: number
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  userId: string
  conversationId?: string
  reportId?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  messageType: 'text' | 'bazi_reading' | 'iching'
  metadata: Record<string, any>
  tokensUsed: number
  createdAt: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  nameCn: string
  description: string
  priceMonthly: number
  priceYearly: number
  currency: string
  features: string[]
  questionsPerMonth: number
  reportDiscount: number
  freeReportsPerMonth: number
  prioritySupport: boolean
  sortOrder: number
  isActive: boolean
}

export interface Subscription {
  id: string
  userId: string
  plan: 'free' | 'premium' | 'pro'
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  currentPeriodStart?: string
  currentPeriodEnd?: string
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  userId: string
  orderType: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  productId?: string
  quantity: number
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface PayPalOrder {
  id: string
  userId: string
  paypalOrderId?: string
  paypalCaptureId?: string
  orderType: 'subscription' | 'report' | 'deep_questions'
  productId?: string
  reportId?: string
  amount: number
  currency: string
  status: 'created' | 'approved' | 'completed' | 'failed' | 'refunded'
  payerEmail?: string
  payerName?: string
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

// Season & Star types
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type Symbol = 'dragon' | 'phoenix' | 'tiger' | 'tortoise'

export interface DailyStarInfo {
  mansion: {
    name: string
    chinese: string
    meaning: string
    number: number
  }
  symbol: {
    name: string
    chineseName: string
    season: string
    direction: string
  }
  season: Season
}

// Bazi Calculator Types
export interface BaziInput {
  name?: string
  gender: 'male' | 'female'
  birthDate: Date
  birthPlace?: string
  longitude?: number
}

export interface Pillar {
  stem: string
  stemCn: string
  stemPinyin: string
  stemElement: string
  stemElementCn: string
  branch: string
  branchCn: string
  branchPinyin: string
  branchElement: string
  branchElementCn: string
  branchZodiac: string
  branchZodiacCn: string
  tenGod: string
  tenGodCn: string
  hiddenStems: Array<{
    stem: string
    stemCn: string
    type: 'ben' | 'zhong' | 'yu'
    strength: number
  }>
}

export interface BaziResult {
  name: string
  gender: 'male' | 'female'
  birthDate: Date
  birthPlace: string
  lunarDate: {
    year: string
    month: string
    day: string
    isLeap: boolean
  }
  yearPillar: Pillar
  monthPillar: Pillar
  dayPillar: Pillar
  hourPillar: Pillar
  dayMasterElement: string
  dayMasterStrength: 'strong' | 'balanced' | 'weak'
  dayMasterStrengthScore: number
  favorableElements: string[]
  favorableElementsCn: string[]
  unfavorableElements: string[]
  unfavorableElementsCn: string[]
  fiveElements: {
    wood: number
    fire: number
    earth: number
    metal: number
    water: number
  }
  naYinYear: string
  naYinYearCn: string
  greatFortunes: Array<{
    age: number
    year: string
    pillar: { stem: string; branch: string; stemCn: string; branchCn: string }
    tenGod: string
  }>
}

export interface FreeReading {
  personality: string[]
  career: string
  relationships: string
  wealth: string
  health: string
}


// ============================================================================
// Phase 4 Types - 紫微斗数、易经、邮件订阅
// ============================================================================

// 紫微斗数
export interface ZiweiPalace {
  id: string
  name: string
  nameCn: string
  position: number
  branch: string
  branchCn: string
  branchPinyin: string
  majorStars: Array<{
    id: string
    name: string
    nameCn: string
    element: string
    nature: string
  }>
  auxiliaryStars: string[]
  interpretation: {
    summary: string
    summaryCn: string
    highlights: string[]
    highlightsCn: string[]
    challenges: string[]
    challengesCn: string[]
  }
}

export interface ZiweiResult {
  name: string
  gender: 'male' | 'female'
  birthDate: Date
  birthPlace: string
  lifePalaceBranch: number
  lifePalaceBranchCn: string
  lifePalaceStem: number
  lifePalaceStemCn: string
  bodyPalace: string
  bodyPalaceCn: string
  lifePalaceStars: string[]
  lifePalaceStarsCn: string[]
  palaces: ZiweiPalace[]
  fiveElementBureau: string
  fiveElementBureauCn: string
  pattern: string
  patternCn: string
  overallReading: {
    personality: string[]
    personalityCn: string[]
    strengths: string[]
    strengthsCn: string[]
    areasToWork: string[]
    areasToWorkCn: string[]
  }
}

// 易经
export interface IChingLine {
  position: number
  text: string
  textCn: string
}

export interface IChingHexagram {
  number: number
  name: string
  nameCn: string
  pinyin: string
  judgment: string
  judgmentCn: string
  image: string
  imageCn: string
  upperTrigram: number
  lowerTrigram: number
  lines: IChingLine[]
  category: string
}

export type CastingMethod = 'coins' | 'time'

export interface IChingReading {
  question: string
  method: CastingMethod
  castTime: Date
  hexagram: IChingHexagram
  hexagramLines: number[]
  changingLines: number[]
  changedHexagram?: IChingHexagram
  changedLines?: number[]
  interpretation: {
    summary: string
    summaryCn: string
    hexagramMeaning: string
    hexagramMeaningCn: string
    changingLinesInterpretation: Array<{
      position: number
      text: string
      textCn: string
      meaning: string
      meaningCn: string
    }>
    changedHexagramMeaning: string
    changedHexagramMeaningCn: string
    guidance: string
    guidanceCn: string
    timing: string
    timingCn: string
  }
}

// 邮件订阅
export interface EmailSubscription {
  id: string
  userId?: string
  email: string
  isActive: boolean
  frequency: 'daily' | 'weekly'
  preferences: {
    dailyFortune: boolean
    weeklyForecast: boolean
    specialOccasions: boolean
    productUpdates: boolean
  }
  subscribedAt: string
  unsubscribedAt?: string
  token: string  // 退订token
}

export interface DailyFortuneEmail {
  date: string
  dayStem: string
  dayBranch: string
  dayStemCn: string
  dayBranchCn: string
  fiveElementDay: string
  fiveElementDayCn: string
  overallFortune: number  // 1-100
  loveFortune: number
  careerFortune: number
  wealthFortune: number
  healthFortune: number
  luckyColor: string
  luckyNumber: number
  luckyDirection: string
  dailyMessage: string
  dailyMessageCn: string
  zodiacFortune: Record<string, { score: number; note: string }>
}

// 二十八星宿
export interface ConstellationMansion {
  number: number
  name: string
  nameCn: string
  pinyin: string
  symbol: string  // 动物象征
  element: string
  direction: 'east' | 'south' | 'west' | 'north'
  meaning: string
  stars: number
}

// 七政四余
export interface SevenGovernors {
  name: string
  nameCn: string
  planet: string  // Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn
  element: string
  nature: string
}

export interface FourRemainders {
  name: string
  nameCn: string
  nature: string
  meaning: string
}
