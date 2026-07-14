/**
 * Email Design System - 邮件设计系统
 * 
 * Three-layer fallback for backgrounds:
 * 1. Solid background color (base fallback)
 * 2. Background image (gradient/pattern)
 * 3. VML for Outlook compatibility
 * 
 * Seasonal theme support: spring (dragon), summer (phoenix), autumn (tiger), winter (tortoise)
 */

export type SeasonTheme = 'spring' | 'summer' | 'autumn' | 'winter'

export const seasonThemes = {
  spring: {
    name: 'Azure Dragon',
    chineseName: '青龙',
    primary: '#316a57',
    secondary: '#bbd9cb',
    accent: '#42846d',
    background: '#f0f7f4',
    paper: '#f8fbf9',
    text: '#1f3a32',
    textMuted: '#4a6b5d',
    constellation: 'linear-gradient(135deg, #1f3a32 0%, #316a57 50%, #42846d 100%)',
    symbol: 'linear-gradient(135deg, #bbd9cb 0%, #dcece4 50%, #f0f7f4 100%)',
  },
  summer: {
    name: 'Vermilion Bird',
    chineseName: '朱雀',
    primary: '#cc3624',
    secondary: '#f5a89f',
    accent: '#b8942f',
    background: '#fdf3f2',
    paper: '#fef8f7',
    text: '#76261d',
    textMuted: '#9a4a3f',
    constellation: 'linear-gradient(135deg, #76261d 0%, #cc3624 50%, #ed786a 100%)',
    symbol: 'linear-gradient(135deg, #d6c072 0%, #e6d9a8 50%, #f2ecd4 100%)',
  },
  autumn: {
    name: 'White Tiger',
    chineseName: '白虎',
    primary: '#6b6456',
    secondary: '#c4b89a',
    accent: '#8c8576',
    background: '#f7f6f4',
    paper: '#faf9f6',
    text: '#3d3832',
    textMuted: '#6b6456',
    constellation: 'linear-gradient(135deg, #3d3832 0%, #6b6456 50%, #8c8576 100%)',
    symbol: 'linear-gradient(135deg, #c4b89a 0%, #d4d0c7 50%, #eae8e3 100%)',
  },
  winter: {
    name: 'Black Tortoise',
    chineseName: '玄武',
    primary: '#1e2a3a',
    secondary: '#4a6070',
    accent: '#b8942f',
    background: '#0f0d0b',
    paper: '#1a1814',
    text: '#f7f6f4',
    textMuted: '#b5afa2',
    constellation: 'linear-gradient(135deg, #0f0d0b 0%, #1e2a3a 50%, #2a2722 100%)',
    symbol: 'linear-gradient(135deg, #b5afa2 0%, #d4d0c7 50%, #eae8e3 100%)',
  },
} as const

export function getCurrentSeasonTheme(): SeasonTheme {
  const month = new Date().getMonth()
  const day = new Date().getDate()
  
  if (month === 1 && day >= 4) return 'spring'
  if (month >= 2 && month <= 3) return 'spring'
  if (month === 4 && day < 5) return 'spring'
  
  if (month === 4 && day >= 5) return 'summer'
  if (month >= 5 && month <= 6) return 'summer'
  if (month === 7 && day < 7) return 'summer'
  
  if (month === 7 && day >= 7) return 'autumn'
  if (month >= 8 && month <= 9) return 'autumn'
  if (month === 10 && day < 7) return 'autumn'
  
  return 'winter'
}

// 28 mansions for daily rotation
export const emailMansions = [
  { name: 'Jiao', chinese: '角', meaning: 'Horn' },
  { name: 'Kang', chinese: '亢', meaning: 'Neck' },
  { name: 'Di', chinese: '氐', meaning: 'Root' },
  { name: 'Fang', chinese: '房', meaning: 'Room' },
  { name: 'Xin', chinese: '心', meaning: 'Heart' },
  { name: 'Wei', chinese: '尾', meaning: 'Tail' },
  { name: 'Ji', chinese: '箕', meaning: 'Winnowing Basket' },
  { name: 'Dou', chinese: '斗', meaning: 'Southern Dipper' },
  { name: 'Niu', chinese: '牛', meaning: 'Ox' },
  { name: 'Nü', chinese: '女', meaning: 'Girl' },
  { name: 'Xu', chinese: '虚', meaning: 'Emptiness' },
  { name: 'Wei', chinese: '危', meaning: 'Rooftop' },
  { name: 'Shi', chinese: '室', meaning: 'Encampment' },
  { name: 'Bi', chinese: '壁', meaning: 'Wall' },
  { name: 'Kui', chinese: '奎', meaning: 'Legs' },
  { name: 'Lou', chinese: '娄', meaning: 'Bond' },
  { name: 'Wei', chinese: '胃', meaning: 'Stomach' },
  { name: 'Mao', chinese: '昴', meaning: 'Hairy Head' },
  { name: 'Bi', chinese: '毕', meaning: 'Net' },
  { name: 'Zi', chinese: '觜', meaning: 'Turtle Beak' },
  { name: 'Shen', chinese: '参', meaning: 'Three Stars' },
  { name: 'Jing', chinese: '井', meaning: 'Well' },
  { name: 'Gui', chinese: '鬼', meaning: 'Ghost' },
  { name: 'Liu', chinese: '柳', meaning: 'Willow' },
  { name: 'Xing', chinese: '星', meaning: 'Star' },
  { name: 'Zhang', chinese: '张', meaning: 'Extended Net' },
  { name: 'Yi', chinese: '翼', meaning: 'Wings' },
  { name: 'Zhen', chinese: '轸', meaning: 'Chariot' },
]

export function getDailyMansionForEmail(date: Date = new Date()) {
  const refDate = new Date(Date.UTC(2000, 0, 1))
  const targetDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const daysDiff = Math.floor((targetDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24))
  const index = ((daysDiff % 28) + 28) % 28
  return emailMansions[index]
}
