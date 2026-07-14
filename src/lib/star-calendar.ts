/**
 * Star Calendar System - 星宿日历
 * 
 * 28 Mansions (二十八宿) - Daily rotation
 * Four Symbols (四象) - Seasonal rotation
 * 
 * The 28 mansions cycle daily. The calculation is based on the
 * traditional Chinese calendar system.
 */

// Four Symbols - 四象
export const FOUR_SYMBOLS = {
  dragon: {
    name: 'Azure Dragon',
    chineseName: '青龙',
    direction: 'East',
    season: 'Spring',
    color: '#2d5a4e',
    mansions: ['Jiao', 'Kang', 'Di', 'Fang', 'Xin', 'Wei', 'Ji'],
  },
  phoenix: {
    name: 'Vermilion Bird',
    chineseName: '朱雀',
    direction: 'South',
    season: 'Summer',
    color: '#b83a2a',
    mansions: ['Jing', 'Gui', 'Liu', 'Xing', 'Zhang', 'Yi', 'Zhen'],
  },
  tiger: {
    name: 'White Tiger',
    chineseName: '白虎',
    direction: 'West',
    season: 'Autumn',
    color: '#c4b89a',
    mansions: ['Kui', 'Lou', 'Wei', 'Mao', 'Bi', 'Zi', 'Shen'],
  },
  tortoise: {
    name: 'Black Tortoise',
    chineseName: '玄武',
    direction: 'North',
    season: 'Winter',
    color: '#1e2a3a',
    mansions: ['Dou', 'Niu', 'Nü', 'Xu', 'Wei', 'Shi', 'Bi'],
  },
} as const

export type SymbolKey = keyof typeof FOUR_SYMBOLS

// 28 Mansions in order - 二十八宿顺序
export const TWENTY_EIGHT_MANSIONS = [
  // Azure Dragon (Spring/East)
  { name: 'Jiao', chinese: '角', number: 1, symbol: 'dragon', meaning: 'Horn' },
  { name: 'Kang', chinese: '亢', number: 2, symbol: 'dragon', meaning: 'Neck' },
  { name: 'Di', chinese: '氐', number: 3, symbol: 'dragon', meaning: 'Root' },
  { name: 'Fang', chinese: '房', number: 4, symbol: 'dragon', meaning: 'Room' },
  { name: 'Xin', chinese: '心', number: 5, symbol: 'dragon', meaning: 'Heart' },
  { name: 'Wei', chinese: '尾', number: 6, symbol: 'dragon', meaning: 'Tail' },
  { name: 'Ji', chinese: '箕', number: 7, symbol: 'dragon', meaning: 'Winnowing Basket' },
  // Black Tortoise (Winter/North)
  { name: 'Dou', chinese: '斗', number: 8, symbol: 'tortoise', meaning: 'Southern Dipper' },
  { name: 'Niu', chinese: '牛', number: 9, symbol: 'tortoise', meaning: 'Ox' },
  { name: 'Nü', chinese: '女', number: 10, symbol: 'tortoise', meaning: 'Girl' },
  { name: 'Xu', chinese: '虚', number: 11, symbol: 'tortoise', meaning: 'Emptiness' },
  { name: 'Wei', chinese: '危', number: 12, symbol: 'tortoise', meaning: 'Rooftop' },
  { name: 'Shi', chinese: '室', number: 13, symbol: 'tortoise', meaning: 'Encampment' },
  { name: 'Bi', chinese: '壁', number: 14, symbol: 'tortoise', meaning: 'Wall' },
  // White Tiger (Autumn/West)
  { name: 'Kui', chinese: '奎', number: 15, symbol: 'tiger', meaning: 'Legs' },
  { name: 'Lou', chinese: '娄', number: 16, symbol: 'tiger', meaning: 'Bond' },
  { name: 'Wei', chinese: '胃', number: 17, symbol: 'tiger', meaning: 'Stomach' },
  { name: 'Mao', chinese: '昴', number: 18, symbol: 'tiger', meaning: 'Hairy Head' },
  { name: 'Bi', chinese: '毕', number: 19, symbol: 'tiger', meaning: 'Net' },
  { name: 'Zi', chinese: '觜', number: 20, symbol: 'tiger', meaning: 'Turtle Beak' },
  { name: 'Shen', chinese: '参', number: 21, symbol: 'tiger', meaning: 'Three Stars' },
  // Vermilion Bird (Summer/South)
  { name: 'Jing', chinese: '井', number: 22, symbol: 'phoenix', meaning: 'Well' },
  { name: 'Gui', chinese: '鬼', number: 23, symbol: 'phoenix', meaning: 'Ghost' },
  { name: 'Liu', chinese: '柳', number: 24, symbol: 'phoenix', meaning: 'Willow' },
  { name: 'Xing', chinese: '星', number: 25, symbol: 'phoenix', meaning: 'Star' },
  { name: 'Zhang', chinese: '张', number: 26, symbol: 'phoenix', meaning: 'Extended Net' },
  { name: 'Yi', chinese: '翼', number: 27, symbol: 'phoenix', meaning: 'Wings' },
  { name: 'Zhen', chinese: '轸', number: 28, symbol: 'phoenix', meaning: 'Chariot' },
] as const

export type Mansion = typeof TWENTY_EIGHT_MANSIONS[number]

// Seasons based on Northern hemisphere solar terms (approximate)
export function getCurrentSeason(date: Date = new Date()): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = date.getMonth()
  const day = date.getDate()
  
  // Approximate solar term boundaries
  // Spring: Feb 4 - May 5 (Lichun to Lixia)
  // Summer: May 5 - Aug 7 (Lixia to Liqiu)
  // Autumn: Aug 7 - Nov 7 (Liqiu to Lidong)
  // Winter: Nov 7 - Feb 4 (Lidong to Lichun)
  
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

// Get the current symbol (四象) based on season
export function getCurrentSymbol(date: Date = new Date()): SymbolKey {
  const season = getCurrentSeason(date)
  switch (season) {
    case 'spring': return 'dragon'
    case 'summer': return 'phoenix'
    case 'autumn': return 'tiger'
    case 'winter': return 'tortoise'
  }
}

// Get the daily mansion (值日星宿)
// The 28 mansions cycle through the days
// Using a reference point: 2000-01-01 was Jiao (角宿) day
// Note: This is an approximation for decorative/atmospheric purposes
export function getDailyMansion(date: Date = new Date()): Mansion {
  // Reference date: January 1, 2000 (角宿 day - approximate for decorative use)
  const referenceDate = new Date(Date.UTC(2000, 0, 1))
  const targetDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  
  const daysDiff = Math.floor((targetDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24))
  const index = ((daysDiff % 28) + 28) % 28
  
  return TWENTY_EIGHT_MANSIONS[index]
}

// Get mansion by index (0-27)
export function getMansionByIndex(index: number): Mansion {
  return TWENTY_EIGHT_MANSIONS[((index % 28) + 28) % 28]
}

// Get theme class based on season
export function getSeasonThemeClass(date: Date = new Date()): string {
  const season = getCurrentSeason(date)
  return `theme-${season}`
}

// Get symbol info
export function getSymbolInfo(key: SymbolKey) {
  return FOUR_SYMBOLS[key]
}
