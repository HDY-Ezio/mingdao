// Product configurations for Mingdao reports
// 明道报告产品配置

import type { Product, ReportType } from '@/types'

export const PRODUCTS: Record<string, Product> = {
  bazi_full: {
    id: 'bazi_full',
    name: 'Bazi Complete Report',
    nameCn: '八字完整报告',
    description: 'Complete 100+ page Bazi analysis with 10-year fortune cycles, yearly predictions, and detailed life guidance. Unlock the full picture of your destiny.',
    category: 'bazi',
    price: 19.99,
    currency: 'USD',
    baseQuestions: 10,
    isActive: true,
    features: [
      'Full 4-Pillars Analysis 四柱详解',
      '10-Year Fortune Cycles 十年大运',
      'Yearly Predictions (10 years) 流年运势',
      'Career & Wealth Timing 事业财运',
      'Relationship & Marriage Analysis 感情婚姻',
      'Health & Vitality Reading 健康养生',
      'Favorable Directions & Colors 喜用方位',
      'Lucky Numbers & Elements 幸运数字',
      'AI Daoist Chat (10 questions) 问道十次',
    ],
    sortOrder: 1,
  },
  ziwei_full: {
    id: 'ziwei_full',
    name: 'Ziwei Dou Shu Report',
    nameCn: '紫微斗数完整报告',
    description: 'Comprehensive Purple Star Astrology reading with palace analysis, major stars interpretation, and life path guidance from the imperial astrology system.',
    category: 'ziwei',
    price: 29.99,
    currency: 'USD',
    baseQuestions: 25,
    isActive: true,
    features: [
      '12 Palace Analysis 十二宫详解',
      'Major Stars Interpretation 主星解读',
      'Auxiliary Stars Analysis 辅星耀动',
      '10-Year Cycles 十年大运',
      'Career & Finance Palace 财帛官禄',
      'Relationship & Marriage Palace 夫妻感情',
      'Health & Vitality Palace 疾厄健康',
      'AI Daoist Chat (25 questions) 问道廿五次',
    ],
    sortOrder: 2,
  },
  iching_deep: {
    id: 'iching_deep',
    name: 'I Ching Deep Reading',
    nameCn: '易经深度解读',
    description: 'Deep divination reading with hexagram analysis, changing lines interpretation, and practical guidance for your specific question from the Book of Changes.',
    category: 'iching',
    price: 14.99,
    currency: 'USD',
    baseQuestions: 10,
    isActive: true,
    features: [
      'Hexagram Analysis 卦象解析',
      'Changing Lines Interpretation 变爻解读',
      'Practical Guidance & Advice 实用建议',
      'Timing & Action Items 时机把握',
      'Relationship with Your Question 对应问题',
      'Inner & Outer Trigram Analysis 内外卦',
      'Traditional Commentary 传统注疏',
      'AI Daoist Chat (10 questions) 问道十次',
    ],
    sortOrder: 3,
  },
  relationship_report: {
    id: 'relationship_report',
    name: 'Relationship Report',
    nameCn: '感情专项报告',
    description: 'Deep dive into your love and relationship destiny — patterns, timing, compatibility, and guidance for harmonious partnerships based on your Bazi chart.',
    category: 'relationship',
    price: 19.99,
    currency: 'USD',
    baseQuestions: 15,
    isActive: true,
    features: [
      'Love Destiny Analysis 感情命盘',
      'Partner Type & Compatibility 伴侣特质',
      'Best Timing for Love 恋爱时机',
      'Relationship Patterns to Heal 感情模式',
      'Marriage Outlook 婚姻运势',
      'Peach Blossom Analysis 桃花运',
      'Communication & Harmony Tips 相处之道',
      'AI Daoist Chat (15 questions) 问道十五次',
    ],
    sortOrder: 4,
  },
  career_wealth_report: {
    id: 'career_wealth_report',
    name: 'Career & Wealth Report',
    nameCn: '事业财运专项',
    description: 'Comprehensive career and wealth analysis — ideal industries, timing for opportunities, wealth accumulation strategies, and financial destiny reading.',
    category: 'career',
    price: 19.99,
    currency: 'USD',
    baseQuestions: 15,
    isActive: true,
    features: [
      'Career Path Analysis 事业方向',
      'Wealth Destiny Pattern 财运格局',
      'Best Industries & Roles 适合行业',
      'Opportunity Timing 时机把握',
      'Investment Guidance 投资建议',
      'Wealth Accumulation Strategy 聚财之道',
      'Career Change Timing 转行时机',
      'AI Daoist Chat (15 questions) 问道十五次',
    ],
    sortOrder: 5,
  },
  couple_compatibility: {
    id: 'couple_compatibility',
    name: 'Couple Compatibility Report',
    nameCn: '双人合盘',
    description: 'Side-by-side comparison of two Bazi charts — relationship dynamics, strengths, challenges, harmony guidance, and timing for major relationship decisions.',
    category: 'compatibility',
    price: 39.99,
    currency: 'USD',
    baseQuestions: 30,
    isActive: true,
    features: [
      'Dual Chart Comparison 双人排盘',
      'Five Elements Harmony 五行合婚',
      'Day Master Compatibility 日主匹配',
      'Relationship Dynamics 相处模式',
      'Strengths & Challenges 优劣分析',
      'Communication Patterns 沟通方式',
      'Timing for Major Decisions 大事时机',
      'Harmony Enhancement Tips 和合之道',
      'AI Daoist Chat (30 questions) 问道三十次',
    ],
    sortOrder: 6,
  },
}

export const SUBSCRIPTION_PLANS = {
  mingdao_member: {
    id: 'mingdao_member',
    name: 'Mingdao Member',
    nameCn: '明道会员',
    description: 'Unlock daily fortune emails, report discounts, and monthly AI questions — perfect for regular guidance seekers.',
    priceMonthly: 9.99,
    priceYearly: 79.00,
    currency: 'USD',
    features: [
      'Daily Fortune Email 每日运势邮件',
      '30% off all reports 报告7折优惠',
      '49 AI Questions/month 每月49次问道',
      'Member-only content 会员专属内容',
      'Priority email support 优先邮件支持',
    ],
    questionsPerMonth: 49,
    reportDiscount: 0.7,
    freeReportsPerMonth: 0,
    prioritySupport: false,
    sortOrder: 1,
    isActive: true,
  },
  daoist_personal: {
    id: 'daoist_personal',
    name: 'Daoist Personal',
    nameCn: '道长亲传',
    description: 'The ultimate guidance experience — free reports, deepest discounts, priority responses, and monthly deep dives into your path.',
    priceMonthly: 29.99,
    priceYearly: 249.00,
    currency: 'USD',
    features: [
      'Everything in Mingdao Member 包含会员全部',
      '2 Free Reports/month 每月2份免费报告',
      '40% off all reports 报告6折优惠',
      'Priority AI Response AI优先响应',
      'Monthly Deep Dive 每月专题深度解读',
      '49 AI Questions/month 每月49次问道',
      'VIP Support 专属客服支持',
    ],
    questionsPerMonth: 49,
    reportDiscount: 0.6,
    freeReportsPerMonth: 2,
    prioritySupport: true,
    sortOrder: 2,
    isActive: true,
  },
}

export const DEEP_QUESTIONS_PRICE = 9.90
export const DEEP_QUESTIONS_TOTAL = 49

// Get product by ID
export function getProduct(id: string): Product | undefined {
  return PRODUCTS[id]
}

// Get all products sorted
export function getAllProducts(): Product[] {
  return Object.values(PRODUCTS).sort((a, b) => a.sortOrder - b.sortOrder)
}

// Get report type from product
export function getReportTypeFromProduct(productId: string): ReportType {
  const product = PRODUCTS[productId]
  return product?.category || 'bazi'
}

// Calculate discounted price for members
export function getDiscountedPrice(price: number, plan: string): number {
  if (plan === 'premium' || plan === 'mingdao_member') {
    return Math.round(price * 0.7 * 100) / 100
  }
  if (plan === 'pro' || plan === 'daoist_personal') {
    return Math.round(price * 0.6 * 100) / 100
  }
  return price
}
