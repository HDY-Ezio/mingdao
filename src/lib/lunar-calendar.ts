/**
 * Lunar Calendar Converter
 * 阳历转农历 - 基于天文算法的简化实现
 * 支持年份范围: 1900-2100
 */

// 农历信息表 - 每年的农历数据
// 每个数字表示该年农历的大小月、闰月等信息
// 格式: 0xYYYYMMDD 编码方式
// 低4位: 闰月月份(0表示无闰月)
// 中间12位: 12个月的大小(1=大月30天, 0=小月29天)，从高位到低位为正月到腊月
// 高4位: 保留
const LUNAR_INFO: number[] = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, // 2090-2099
  0x0d520, // 2100
]

const LUNAR_START_YEAR = 1900
const LUNAR_END_YEAR = 2100

// 天干
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const
export const HEAVENLY_STEMS_PINYIN = ['Jiǎ', 'Yǐ', 'Bǐng', 'Dīng', 'Wù', 'Jǐ', 'Gēng', 'Xīn', 'Rén', 'Guǐ'] as const

// 地支
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const
export const EARTHLY_BRANCHES_PINYIN = ['Zǐ', 'Chǒu', 'Yín', 'Mǎo', 'Chén', 'Sì', 'Wǔ', 'Wèi', 'Shēn', 'Yǒu', 'Xū', 'Hài'] as const

// 十二生肖
export const ZODIAC_ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'] as const
export const ZODIAC_ANIMALS_CN = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'] as const

// 五行
export const FIVE_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const
export const FIVE_ELEMENTS_CN = ['木', '火', '土', '金', '水'] as const

// 天干五行
export const STEM_ELEMENTS = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'] as const
export const STEM_ELEMENTS_CN = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'] as const

// 地支五行
export const BRANCH_ELEMENTS = ['Water', 'Earth', 'Wood', 'Wood', 'Earth', 'Fire', 'Fire', 'Earth', 'Metal', 'Metal', 'Earth', 'Water'] as const
export const BRANCH_ELEMENTS_CN = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'] as const

// 地支藏干
// 每个地支包含的天干，按本气、中气、余气排列
export const BRANCH_HIDDEN_STEMS: number[][] = [
  [9],           // 子: 癸
  [5, 9, 7],     // 丑: 己、癸、辛
  [0, 2, 4],     // 寅: 甲、丙、戊
  [1],           // 卯: 乙
  [4, 1, 9],     // 辰: 戊、乙、癸
  [2, 4, 6],     // 巳: 丙、戊、庚
  [3, 5],        // 午: 丁、己
  [5, 3, 1],     // 未: 己、丁、乙
  [6, 4, 8],     // 申: 庚、戊、壬
  [7],           // 酉: 辛
  [4, 7, 3],     // 戌: 戊、辛、丁
  [8, 0],        // 亥: 壬、甲
]

// 纳音表 - 60甲子纳音
export const NA_YIN = [
  'Sea Metal', 'Sea Metal', 'Furnace Fire', 'Furnace Fire', 'Forest Wood', 'Forest Wood',
  'Road Earth', 'Road Earth', 'Sword Metal', 'Sword Metal',
  'Candle Fire', 'Candle Fire', 'Spring Water', 'Spring Water', 'Rooftop Earth', 'Rooftop Earth',
  'Pine Cedar Wood', 'Pine Cedar Wood', 'Stream Metal', 'Stream Metal',
  'Sand Earth', 'Sand Earth', 'Fire Below', 'Fire Below', 'Heavenly River Water', 'Heavenly River Water',
  'Ridge Wood', 'Ridge Wood', 'White Wax Gold', 'White Wax Gold',
  'Willow Earth', 'Willow Earth', 'Rain Water', 'Rain Water', 'Thunder Fire', 'Thunder Fire',
  'Wind Wood', 'Wind Wood', 'Hairpin Gold', 'Hairpin Gold',
  'Mulberry Earth', 'Mulberry Earth', 'Big Stream Water', 'Big Stream Water', 'Sky Fire', 'Sky Fire',
  'Stone Pine Wood', 'Stone Pine Wood', 'Gold Foil', 'Gold Foil',
  'Wall Earth', 'Wall Earth', 'Crown Water', 'Crown Water', 'Medium Fire', 'Medium Fire',
  'Flat Wood', 'Flat Wood', 'Sandy Gold', 'Sandy Gold',
] as const

export const NA_YIN_CN = [
  '海中金', '海中金', '炉中火', '炉中火', '大林木', '大林木',
  '路旁土', '路旁土', '剑锋金', '剑锋金',
  '山头火', '山头火', '涧下水', '涧下水', '城头土', '城头土',
  '白蜡金', '白蜡金', '杨柳木', '杨柳木',
  '泉中水', '泉中水', '屋上土', '屋上土', '霹雳火', '霹雳火',
  '松柏木', '松柏木', '长流水', '长流水',
  '沙中金', '沙中金', '山下火', '山下火', '平地木', '平地木',
  '壁上土', '壁上土', '金箔金', '金箔金',
  '覆灯火', '覆灯火', '天河水', '天河水', '大驿土', '大驿土',
  '钗钏金', '钗钏金', '桑柘木', '桑柘木',
  '大溪水', '大溪水', '沙中土', '沙中土', '天上火', '天上火',
  '石榴木', '石榴木', '大海水', '大海水',
] as const

// 十二时辰对应的时间段
export const SHICHEN_TIME_RANGES = [
  { name: '子', pinyin: 'Zǐ', start: '23:00', end: '01:00' },
  { name: '丑', pinyin: 'Chǒu', start: '01:00', end: '03:00' },
  { name: '寅', pinyin: 'Yín', start: '03:00', end: '05:00' },
  { name: '卯', pinyin: 'Mǎo', start: '05:00', end: '07:00' },
  { name: '辰', pinyin: 'Chén', start: '07:00', end: '09:00' },
  { name: '巳', pinyin: 'Sì', start: '09:00', end: '11:00' },
  { name: '午', pinyin: 'Wǔ', start: '11:00', end: '13:00' },
  { name: '未', pinyin: 'Wèi', start: '13:00', end: '15:00' },
  { name: '申', pinyin: 'Shēn', start: '15:00', end: '17:00' },
  { name: '酉', pinyin: 'Yǒu', start: '17:00', end: '19:00' },
  { name: '戌', pinyin: 'Xū', start: '19:00', end: '21:00' },
  { name: '亥', pinyin: 'Hài', start: '21:00', end: '23:00' },
] as const

export interface LunarDate {
  year: number
  month: number
  day: number
  isLeap: boolean
  yearStem: number  // 年天干索引
  yearBranch: number // 年地支索引
  zodiac: string
  zodiacCn: string
}

/**
 * 获取农历年的总天数
 */
function getLunarYearDays(year: number): number {
  const info = LUNAR_INFO[year - LUNAR_START_YEAR]
  let sum = 348 // 12个月 * 29天 = 348
  
  // 12个月的大小
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (info & i) ? 1 : 0
  }
  
  // 加上闰月的天数
  sum += getLeapMonthDays(year)
  
  return sum
}

/**
 * 获取闰月月份，0表示无闰月
 */
function getLeapMonth(year: number): number {
  return LUNAR_INFO[year - LUNAR_START_YEAR] & 0xf
}

/**
 * 获取闰月的天数
 */
function getLeapMonthDays(year: number): number {
  if (getLeapMonth(year) === 0) return 0
  // 闰月的大小由第13位决定（高4位中的某一位）
  return (LUNAR_INFO[year - LUNAR_START_YEAR] & 0x10000) ? 30 : 29
}

/**
 * 获取农历某个月的天数
 */
function getLunarMonthDays(year: number, month: number): number {
  return (LUNAR_INFO[year - LUNAR_START_YEAR] & (0x10000 >> month)) ? 30 : 29
}

/**
 * 阳历转农历
 */
export function solarToLunar(date: Date): LunarDate {
  const solarYear = date.getFullYear()
  const solarMonth = date.getMonth()
  const solarDay = date.getDate()
  
  // 计算与1900年1月31日（农历1900年正月初一）的天数差
  const baseDate = new Date(1900, 0, 31)
  let offset = Math.floor((date.getTime() - baseDate.getTime()) / 86400000)
  
  let lunarYear = LUNAR_START_YEAR
  let daysInYear = 0
  
  // 计算农历年份
  while (lunarYear < LUNAR_END_YEAR && offset > 0) {
    daysInYear = getLunarYearDays(lunarYear)
    if (offset < daysInYear) break
    offset -= daysInYear
    lunarYear++
  }
  
  // 计算农历月份
  const leapMonth = getLeapMonth(lunarYear)
  let isLeap = false
  let lunarMonth = 1
  
  while (lunarMonth < 13 && offset > 0) {
    if (leapMonth > 0 && lunarMonth === leapMonth + 1 && !isLeap) {
      // 闰月
      lunarMonth--
      isLeap = true
      daysInYear = getLeapMonthDays(lunarYear)
    } else {
      daysInYear = getLunarMonthDays(lunarYear, lunarMonth)
    }
    
    if (isLeap && lunarMonth === leapMonth + 1) isLeap = false
    if (offset < daysInYear) break
    offset -= daysInYear
    lunarMonth++
  }
  
  const lunarDay = offset + 1
  
  // 计算年柱天干地支 (以立春为界，这里简化为以正月初一为界)
  // 年干公式: (年份 - 3) % 10
  // 年支公式: (年份 - 3) % 12
  const yearStem = (lunarYear - 3) % 10
  const yearBranch = (lunarYear - 3) % 12
  
  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeap,
    yearStem: yearStem >= 0 ? yearStem : yearStem + 10,
    yearBranch: yearBranch >= 0 ? yearBranch : yearBranch + 12,
    zodiac: ZODIAC_ANIMALS[yearBranch >= 0 ? yearBranch : yearBranch + 12],
    zodiacCn: ZODIAC_ANIMALS_CN[yearBranch >= 0 ? yearBranch : yearBranch + 12],
  }
}

/**
 * 根据出生日期计算年柱（以立春为界的近似算法）
 * 简化版：以农历正月初一为年柱分界
 */
export function getYearPillar(date: Date): { stem: number; branch: number } {
  const lunar = solarToLunar(date)
  return {
    stem: lunar.yearStem,
    branch: lunar.yearBranch,
  }
}

/**
 * 计算月柱
 * 月支: 正月寅月，二月卯月... 十二月丑月
 * 月干: 根据年干推算 (五虎遁)
 * 甲己之年丙作首, 乙庚之年戊为头
 * 丙辛必定寻庚起, 丁壬壬位顺行流
 * 戊癸何方发, 甲寅之上好追求
 */
export function getMonthPillar(date: Date): { stem: number; branch: number } {
  const lunar = solarToLunar(date)
  
  // 月支: 正月=寅(2), 二月=卯(3)... 十二月=丑(1)
  const monthBranch = (lunar.month + 1) % 12
  
  // 月干: 五虎遁
  const yearStem = lunar.yearStem
  let firstMonthStem: number
  
  switch (yearStem % 5) {
    case 0: // 甲己
      firstMonthStem = 2 // 丙
      break
    case 1: // 乙庚
      firstMonthStem = 4 // 戊
      break
    case 2: // 丙辛
      firstMonthStem = 6 // 庚
      break
    case 3: // 丁壬
      firstMonthStem = 8 // 壬
      break
    case 4: // 戊癸
      firstMonthStem = 0 // 甲
      break
    default:
      firstMonthStem = 0
  }
  
  const monthStem = (firstMonthStem + lunar.month - 1) % 10
  
  return {
    stem: monthStem,
    branch: monthBranch,
  }
}

/**
 * 计算日柱
 * 使用基准日推算法
 * 基准: 1900年1月1日是甲戌日 (甲=0, 戌=10) 
 * 实际上需要用已知准确的基准日
 * 已知: 2000年1月1日是戊午日 (戊=4, 午=6)
 */
export function getDayPillar(date: Date): { stem: number; branch: number } {
  // 基准日: 2000年1月1日 = 戊午日 (戊=4, 午=6)
  const baseDate = new Date(2000, 0, 1)
  const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / 86400000)
  
  const dayStem = (4 + diffDays) % 10
  const dayBranch = (6 + diffDays) % 12
  
  return {
    stem: dayStem >= 0 ? dayStem : dayStem + 10,
    branch: dayBranch >= 0 ? dayBranch : dayBranch + 12,
  }
}

/**
 * 计算时柱
 * 时支: 23-1点=子, 1-3点=丑...
 * 时干: 根据日干推算 (五鼠遁)
 * 甲己还加甲, 乙庚丙作初
 * 丙辛从戊起, 丁壬庚子居
 * 戊癸何方发, 壬子是真途
 */
export function getHourPillar(date: Date, dayStem: number): { stem: number; branch: number } {
  const hour = date.getHours()
  
  // 时支计算
  // 23:00-01:00 子(0), 01:00-03:00 丑(1)...
  let hourBranch = Math.floor((hour + 1) / 2) % 12
  
  // 时干: 五鼠遁
  let firstHourStem: number
  
  switch (dayStem % 5) {
    case 0: // 甲己
      firstHourStem = 0 // 甲
      break
    case 1: // 乙庚
      firstHourStem = 2 // 丙
      break
    case 2: // 丙辛
      firstHourStem = 4 // 戊
      break
    case 3: // 丁壬
      firstHourStem = 6 // 庚
      break
    case 4: // 戊癸
      firstHourStem = 8 // 壬
      break
    default:
      firstHourStem = 0
  }
  
  const hourStem = (firstHourStem + hourBranch) % 10
  
  return {
    stem: hourStem,
    branch: hourBranch,
  }
}

/**
 * 根据小时数获取时辰索引
 */
export function getShichenIndex(hour: number): number {
  return Math.floor((hour + 1) / 2) % 12
}

/**
 * 真太阳时计算（简化版）
 * 根据经度调整时间
 * 标准时区: 中国用东八区(120°E)
 * 真太阳时 = 北京时间 + (当地经度 - 120) * 4分钟
 */
export function adjustTrueSolarTime(date: Date, longitude: number): Date {
  // 经度差 * 4分钟/度
  const diffMinutes = (longitude - 120) * 4
  return new Date(date.getTime() + diffMinutes * 60 * 1000)
}
