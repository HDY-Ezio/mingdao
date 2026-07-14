/**
 * Bazi Calculator - 八字排盘核心算法
 * Four Pillars of Destiny Calculation
 * 
 * Features:
 * - Four Pillars (Year/Month/Day/Hour)
 * - Heavenly Stems & Earthly Branches
 * - Five Elements distribution
 * - Ten Gods (十神)
 * - Hidden Stems (藏干)
 * - Na Yin (纳音)
 * - Day Master strength analysis
 * - Great Fortune (大运)
 */

import {
  HEAVENLY_STEMS,
  HEAVENLY_STEMS_PINYIN,
  EARTHLY_BRANCHES,
  EARTHLY_BRANCHES_PINYIN,
  ZODIAC_ANIMALS,
  ZODIAC_ANIMALS_CN,
  FIVE_ELEMENTS,
  FIVE_ELEMENTS_CN,
  STEM_ELEMENTS,
  STEM_ELEMENTS_CN,
  BRANCH_ELEMENTS,
  BRANCH_ELEMENTS_CN,
  BRANCH_HIDDEN_STEMS,
  NA_YIN,
  NA_YIN_CN,
  SHICHEN_TIME_RANGES,
  solarToLunar,
  getYearPillar,
  getMonthPillar,
  getDayPillar,
  getHourPillar,
  adjustTrueSolarTime,
  type LunarDate,
} from './lunar-calendar'

// 十神
// 以日干为"我"，与其他天干地支的关系
export const TEN_GODS = [
  'Direct Resource',      // 正印
  'Indirect Resource',    // 偏印
  'Companion',            // 比肩
  'Rob Wealth',           // 劫财
  'Eating God',           // 食神
  'Hurting Officer',      // 伤官
  'Direct Wealth',        // 正财
  'Indirect Wealth',      // 偏财
  'Direct Officer',       // 正官
  'Seven Killings',       // 七杀
] as const

export const TEN_GODS_CN = [
  '正印', '偏印', '比肩', '劫财',
  '食神', '伤官', '正财', '偏财',
  '正官', '七杀',
] as const

// 五行相生相克关系
// 相生: 木生火, 火生土, 土生金, 金生水, 水生木
// 相克: 木克土, 土克水, 水克火, 火克金, 金克木

const ELEMENT_CYCLE = [0, 1, 2, 3, 4] // Wood, Fire, Earth, Metal, Water

// 我生 (食神/伤官): 我 -> 生 -> 他
// 生我 (正印/偏印): 他 -> 生 -> 我
// 我克 (正财/偏财): 我 -> 克 -> 他
// 克我 (正官/七杀): 他 -> 克 -> 我
// 同我 (比肩/劫财): 同五行

/**
 * 计算天干相对于日主的十神
 * @param dayStemIndex 日干索引
 * @param otherStemIndex 其他天干索引
 * @returns 十神索引
 */
function getStemTenGod(dayStemIndex: number, otherStemIndex: number): number {
  const dayElement = STEM_ELEMENTS[dayStemIndex] // 我
  const otherElement = STEM_ELEMENTS[otherStemIndex] // 他
  const dayYinYang = dayStemIndex % 2 // 0=阳, 1=阴
  const otherYinYang = otherStemIndex % 2
  
  const dayElementIndex = FIVE_ELEMENTS.indexOf(dayElement)
  const otherElementIndex = FIVE_ELEMENTS.indexOf(otherElement)
  
  // 同我 - 比劫
  if (dayElementIndex === otherElementIndex) {
    return dayYinYang === otherYinYang ? 2 : 3 // 比肩 : 劫财
  }
  
  // 生我 - 印星
  // 生我者: 他的元素生我的元素
  // 木生火: 木=0, 火=1 => (0+1)%5=1 ✓
  const generatesMe = (otherElementIndex + 1) % 5 === dayElementIndex
  if (generatesMe) {
    return dayYinYang === otherYinYang ? 1 : 0 // 偏印 : 正印
  }
  
  // 我生 - 食伤
  const iGenerate = (dayElementIndex + 1) % 5 === otherElementIndex
  if (iGenerate) {
    return dayYinYang === otherYinYang ? 4 : 5 // 食神 : 伤官
  }
  
  // 克我 - 官杀
  // 克我者: 他的元素克我的元素
  // 木克土: 木=0, 土=2 => (0+2)%5=2 ✓
  const controlsMe = (otherElementIndex + 2) % 5 === dayElementIndex
  if (controlsMe) {
    return dayYinYang === otherYinYang ? 9 : 8 // 七杀 : 正官
  }
  
  // 我克 - 财星
  const iControl = (dayElementIndex + 2) % 5 === otherElementIndex
  if (iControl) {
    return dayYinYang === otherYinYang ? 7 : 6 // 偏财 : 正财
  }
  
  return 2 // 默认比肩（不应该到这里）
}

/**
 * 计算地支相对于日主的十神（基于本气）
 */
function getBranchTenGod(dayStemIndex: number, branchIndex: number): number {
  const mainStem = BRANCH_HIDDEN_STEMS[branchIndex][0] // 本气
  return getStemTenGod(dayStemIndex, mainStem)
}

/**
 * 五行计数
 */
export interface ElementCount {
  element: string
  elementCn: string
  count: number
  percentage: number
}

/**
 * 单柱信息
 */
export interface Pillar {
  position: 'year' | 'month' | 'day' | 'hour'
  positionName: string
  positionNameCn: string
  stem: number
  stemCn: string
  stemPinyin: string
  stemElement: string
  stemElementCn: string
  stemTenGod?: string
  stemTenGodCn?: string
  branch: number
  branchCn: string
  branchPinyin: string
  branchElement: string
  branchElementCn: string
  branchTenGod?: string
  branchTenGodCn?: string
  zodiac: string
  zodiacCn: string
  hiddenStems: number[]
  hiddenStemsCn: string[]
  hiddenStemsPinyin: string[]
  hiddenStemsTenGods: string[]
  hiddenStemsTenGodsCn: string[]
  naYin: string
  naYinCn: string
}

/**
 * 完整八字排盘结果
 */
export interface BaziReading {
  // 基本信息
  name: string
  gender: 'male' | 'female'
  birthDate: Date
  birthPlace: string
  longitude: number
  
  // 农历信息
  lunarDate: LunarDate
  
  // 四柱
  yearPillar: Pillar
  monthPillar: Pillar
  dayPillar: Pillar
  hourPillar: Pillar
  
  // 日主
  dayMaster: string
  dayMasterCn: string
  dayMasterElement: string
  dayMasterElementCn: string
  
  // 五行分布
  fiveElements: ElementCount[]
  totalElements: number
  
  // 日主强弱
  dayMasterStrength: 'strong' | 'balanced' | 'weak'
  dayMasterStrengthScore: number
  
  // 喜用神（简化版）
  favorableElements: string[]
  favorableElementsCn: string[]
  unfavorableElements: string[]
  unfavorableElementsCn: string[]
  
  // 纳音
  naYinYear: string
  naYinYearCn: string
  
  // 大运
  greatFortunes: GreatFortune[]
  
  // 时辰信息
  shichen: string
  shichenPinyin: string
  shichenRange: string
}

/**
 * 大运
 */
export interface GreatFortune {
  index: number
  age: number
  year: number
  stem: number
  stemCn: string
  stemPinyin: string
  branch: number
  branchCn: string
  branchPinyin: string
  stemTenGod: string
  stemTenGodCn: string
  branchTenGod: string
  branchTenGodCn: string
}

/**
 * 计算五行数量（含藏干）
 */
function calculateElementCounts(pillars: Pillar[]): { elements: Map<string, number>; total: number } {
  const counts = new Map<string, number>()
  
  // 初始化
  FIVE_ELEMENTS.forEach(e => counts.set(e, 0))
  
  // 天干: 1.0权重
  pillars.forEach(pillar => {
    const elem = pillar.stemElement
    counts.set(elem, (counts.get(elem) || 0) + 1.0)
  })
  
  // 地支本气: 1.0权重
  pillars.forEach(pillar => {
    const elem = pillar.branchElement
    counts.set(elem, (counts.get(elem) || 0) + 1.0)
  })
  
  // 地支藏干中气: 0.5权重
  pillars.forEach(pillar => {
    if (pillar.hiddenStems.length > 1) {
      const stemIndex = pillar.hiddenStems[1]
      const elem = STEM_ELEMENTS[stemIndex]
      counts.set(elem, (counts.get(elem) || 0) + 0.5)
    }
  })
  
  // 地支藏干余气: 0.3权重
  pillars.forEach(pillar => {
    if (pillar.hiddenStems.length > 2) {
      const stemIndex = pillar.hiddenStems[2]
      const elem = STEM_ELEMENTS[stemIndex]
      counts.set(elem, (counts.get(elem) || 0) + 0.3)
    }
  })
  
  let total = 0
  counts.forEach(v => total += v)
  
  return { elements: counts, total }
}

/**
 * 计算日主强弱（简化版）
 * 基于得令、得地、得势
 */
function calculateDayMasterStrength(
  dayStemIndex: number,
  pillars: Pillar[],
  elementCounts: Map<string, number>
): { strength: 'strong' | 'balanced' | 'weak'; score: number } {
  const dayElement = STEM_ELEMENTS[dayStemIndex]
  
  // 得令: 月支是否生助日主
  const monthBranchElement = pillars[1].branchElement
  const dayElementIndex = FIVE_ELEMENTS.indexOf(dayElement)
  const monthElementIndex = FIVE_ELEMENTS.indexOf(monthBranchElement)
  
  let seasonScore = 0
  if (monthElementIndex === dayElementIndex) {
    seasonScore = 2.0 // 同令，最强
  } else if ((monthElementIndex + 1) % 5 === dayElementIndex) {
    seasonScore = 1.0 // 生我
  } else if ((dayElementIndex + 2) % 5 === monthElementIndex) {
    seasonScore = -1.0 // 我克，耗气
  } else if ((monthElementIndex + 2) % 5 === dayElementIndex) {
    seasonScore = -2.0 // 克我
  }
  
  // 得地: 地支中有没有根（同五行）
  let rootScore = 0
  pillars.forEach((pillar, i) => {
    if (i === 2) return // skip day branch
    if (pillar.branchElement === dayElement) {
      rootScore += 1.5 // 有根
    }
    // 检查藏干
    pillar.hiddenStems.forEach((stemIdx, j) => {
      if (STEM_ELEMENTS[stemIdx] === dayElement) {
        rootScore += j === 0 ? 0.5 : j === 1 ? 0.3 : 0.1
      }
    })
  })
  
  // 得势: 天干中有没有比劫印星
  let powerScore = 0
  pillars.forEach((pillar, i) => {
    if (i === 2) return // skip day stem
    const tenGod = pillar.stemTenGod
    if (tenGod === 'Companion' || tenGod === 'Rob Wealth') {
      powerScore += 1.0
    } else if (tenGod === 'Direct Resource' || tenGod === 'Indirect Resource') {
      powerScore += 0.8
    } else if (tenGod === 'Direct Officer' || tenGod === 'Seven Killings') {
      powerScore -= 0.8
    } else if (tenGod === 'Direct Wealth' || tenGod === 'Indirect Wealth') {
      powerScore -= 0.6
    }
  })
  
  const totalScore = seasonScore + rootScore + powerScore
  
  let strength: 'strong' | 'balanced' | 'weak'
  if (totalScore > 2) {
    strength = 'strong'
  } else if (totalScore < -2) {
    strength = 'weak'
  } else {
    strength = 'balanced'
  }
  
  return { strength, score: Math.round(totalScore * 10) / 10 }
}

/**
 * 计算喜用神（简化版）
 */
function calculateFavorableElements(
  dayElement: string,
  strength: 'strong' | 'balanced' | 'weak'
): { favorable: string[]; favorableCn: string[]; unfavorable: string[]; unfavorableCn: string[] } {
  const dayElementIndex = FIVE_ELEMENTS.indexOf(dayElement)
  
  let favorable: string[] = []
  let unfavorable: string[] = []
  
  if (strength === 'strong') {
    // 身强: 喜克、泄、耗 (官杀、食伤、财星)
    // 克我者 (官杀): (我+2)%5
    const officerElement = (dayElementIndex + 2) % 5
    // 我生者 (食伤): (我+1)%5
    const outputElement = (dayElementIndex + 1) % 5
    // 我克者 (财星): (我+3)%5 = 我克
    const wealthElement = (dayElementIndex + 3) % 5
    
    favorable = [
      FIVE_ELEMENTS[officerElement],
      FIVE_ELEMENTS[outputElement],
      FIVE_ELEMENTS[wealthElement],
    ]
    
    // 忌生我、同我 (印星、比劫)
    const resourceElement = (dayElementIndex + 4) % 5 // 生我
    unfavorable = [dayElement, FIVE_ELEMENTS[resourceElement]]
  } else if (strength === 'weak') {
    // 身弱: 喜生我、同我 (印星、比劫)
    const resourceElement = (dayElementIndex + 4) % 5
    favorable = [dayElement, FIVE_ELEMENTS[resourceElement]]
    
    // 忌克我、我生、我克 (官杀、食伤、财星)
    const officerElement = (dayElementIndex + 2) % 5
    const outputElement = (dayElementIndex + 1) % 5
    const wealthElement = (dayElementIndex + 3) % 5
    unfavorable = [
      FIVE_ELEMENTS[officerElement],
      FIVE_ELEMENTS[outputElement],
      FIVE_ELEMENTS[wealthElement],
    ]
  } else {
    // 中和: 喜财官
    const officerElement = (dayElementIndex + 2) % 5
    const wealthElement = (dayElementIndex + 3) % 5
    favorable = [FIVE_ELEMENTS[officerElement], FIVE_ELEMENTS[wealthElement]]
    unfavorable = []
  }
  
  return {
    favorable,
    favorableCn: favorable.map(e => FIVE_ELEMENTS_CN[FIVE_ELEMENTS.indexOf(e as typeof FIVE_ELEMENTS[number])]),
    unfavorable,
    unfavorableCn: unfavorable.map(e => FIVE_ELEMENTS_CN[FIVE_ELEMENTS.indexOf(e as typeof FIVE_ELEMENTS[number])]),
  }
}

/**
 * 计算大运
 * 阳男阴女顺行，阴男阳女逆行
 * 大运每10年一变
 */
function calculateGreatFortunes(
  dayStemIndex: number,
  gender: 'male' | 'female',
  monthPillar: { stem: number; branch: number },
  birthYear: number
): GreatFortune[] {
  const isYang = dayStemIndex % 2 === 0 // 0=阳干
  const isForward = (isYang && gender === 'male') || (!isYang && gender === 'female')
  
  const fortunes: GreatFortune[] = []
  
  // 从月柱开始排大运
  let currentStem = monthPillar.stem
  let currentBranch = monthPillar.branch
  
  // 起运年龄简化为约8岁（实际需要精确计算，这里简化）
  const startAge = 8
  
  for (let i = 0; i < 10; i++) {
    if (isForward) {
      currentStem = (currentStem + 1) % 10
      currentBranch = (currentBranch + 1) % 12
    } else {
      currentStem = (currentStem - 1 + 10) % 10
      currentBranch = (currentBranch - 1 + 12) % 12
    }
    
    const age = startAge + i * 10
    const year = birthYear + age
    
    const stemTenGodIndex = getStemTenGod(dayStemIndex, currentStem)
    const branchTenGodIndex = getBranchTenGod(dayStemIndex, currentBranch)
    
    fortunes.push({
      index: i,
      age,
      year,
      stem: currentStem,
      stemCn: HEAVENLY_STEMS[currentStem],
      stemPinyin: HEAVENLY_STEMS_PINYIN[currentStem],
      branch: currentBranch,
      branchCn: EARTHLY_BRANCHES[currentBranch],
      branchPinyin: EARTHLY_BRANCHES_PINYIN[currentBranch],
      stemTenGod: TEN_GODS[stemTenGodIndex],
      stemTenGodCn: TEN_GODS_CN[stemTenGodIndex],
      branchTenGod: TEN_GODS[branchTenGodIndex],
      branchTenGodCn: TEN_GODS_CN[branchTenGodIndex],
    })
  }
  
  return fortunes
}

/**
 * 创建柱信息
 */
function createPillar(
  position: 'year' | 'month' | 'day' | 'hour',
  stem: number,
  branch: number,
  dayStemIndex: number
): Pillar {
  const positionMap = {
    year: { name: 'Year', nameCn: '年柱' },
    month: { name: 'Month', nameCn: '月柱' },
    day: { name: 'Day', nameCn: '日柱' },
    hour: { name: 'Hour', nameCn: '时柱' },
  }
  
  const hiddenStems = BRANCH_HIDDEN_STEMS[branch]
  const hiddenStemsTenGods = hiddenStems.map(s => TEN_GODS[getStemTenGod(dayStemIndex, s)])
  const hiddenStemsTenGodsCn = hiddenStems.map(s => TEN_GODS_CN[getStemTenGod(dayStemIndex, s)])
  
  // 纳音索引: 天干*6 + 地支*... 实际是60甲子顺序
  // 60甲子的纳音顺序
  const naYinIndex = getGanZhiIndex(stem, branch)
  
  return {
    position,
    positionName: positionMap[position].name,
    positionNameCn: positionMap[position].nameCn,
    stem,
    stemCn: HEAVENLY_STEMS[stem],
    stemPinyin: HEAVENLY_STEMS_PINYIN[stem],
    stemElement: STEM_ELEMENTS[stem],
    stemElementCn: STEM_ELEMENTS_CN[stem],
    stemTenGod: position !== 'day' ? TEN_GODS[getStemTenGod(dayStemIndex, stem)] : undefined,
    stemTenGodCn: position !== 'day' ? TEN_GODS_CN[getStemTenGod(dayStemIndex, stem)] : undefined,
    branch,
    branchCn: EARTHLY_BRANCHES[branch],
    branchPinyin: EARTHLY_BRANCHES_PINYIN[branch],
    branchElement: BRANCH_ELEMENTS[branch],
    branchElementCn: BRANCH_ELEMENTS_CN[branch],
    branchTenGod: TEN_GODS[getBranchTenGod(dayStemIndex, branch)],
    branchTenGodCn: TEN_GODS_CN[getBranchTenGod(dayStemIndex, branch)],
    zodiac: ZODIAC_ANIMALS[branch],
    zodiacCn: ZODIAC_ANIMALS_CN[branch],
    hiddenStems,
    hiddenStemsCn: hiddenStems.map(s => HEAVENLY_STEMS[s]),
    hiddenStemsPinyin: hiddenStems.map(s => HEAVENLY_STEMS_PINYIN[s]),
    hiddenStemsTenGods,
    hiddenStemsTenGodsCn,
    naYin: NA_YIN[naYinIndex],
    naYinCn: NA_YIN_CN[naYinIndex],
  }
}

/**
 * 获取甲子循环中的索引 (0-59)
 */
function getGanZhiIndex(stem: number, branch: number): number {
  // 寻找第一个匹配的位置
  for (let i = 0; i < 60; i++) {
    if (i % 10 === stem && i % 12 === branch) {
      return i
    }
  }
  return 0
}

/**
 * 八字排盘主函数
 */
export function calculateBazi(params: {
  name?: string
  gender: 'male' | 'female'
  birthDate: Date
  birthPlace?: string
  longitude?: number
}): BaziReading {
  const {
    name = '',
    gender,
    birthDate,
    birthPlace = '',
    longitude = 120, // 默认北京经度
  } = params
  
  // 真太阳时调整
  const adjustedDate = adjustTrueSolarTime(birthDate, longitude)
  
  // 农历转换
  const lunarDate = solarToLunar(adjustedDate)
  
  // 计算四柱
  const yearPillarData = getYearPillar(adjustedDate)
  const monthPillarData = getMonthPillar(adjustedDate)
  const dayPillarData = getDayPillar(adjustedDate)
  const dayStemIndex = dayPillarData.stem
  const hourPillarData = getHourPillar(adjustedDate, dayStemIndex)
  
  // 构建四柱信息（含十神）
  const yearPillar = createPillar('year', yearPillarData.stem, yearPillarData.branch, dayStemIndex)
  const monthPillar = createPillar('month', monthPillarData.stem, monthPillarData.branch, dayStemIndex)
  const dayPillar = createPillar('day', dayPillarData.stem, dayPillarData.branch, dayStemIndex)
  const hourPillar = createPillar('hour', hourPillarData.stem, hourPillarData.branch, dayStemIndex)
  
  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar]
  
  // 五行分布
  const { elements, total } = calculateElementCounts(pillars)
  const fiveElements: ElementCount[] = FIVE_ELEMENTS.map((elem, i) => ({
    element: elem,
    elementCn: FIVE_ELEMENTS_CN[i],
    count: Math.round((elements.get(elem) || 0) * 10) / 10,
    percentage: Math.round(((elements.get(elem) || 0) / total) * 100),
  }))
  
  // 日主强弱
  const { strength, score } = calculateDayMasterStrength(dayStemIndex, pillars, elements)
  
  // 喜用神
  const dayElement = STEM_ELEMENTS[dayStemIndex]
  const { favorable, favorableCn, unfavorable, unfavorableCn } = calculateFavorableElements(dayElement, strength)
  
  // 大运
  const greatFortunes = calculateGreatFortunes(
    dayStemIndex,
    gender,
    monthPillarData,
    birthDate.getFullYear()
  )
  
  // 时辰信息
  const shichenIndex = Math.floor((adjustedDate.getHours() + 1) / 2) % 12
  const shichen = SHICHEN_TIME_RANGES[shichenIndex]
  
  return {
    name,
    gender,
    birthDate,
    birthPlace,
    longitude,
    lunarDate,
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster: dayElement,
    dayMasterCn: STEM_ELEMENTS_CN[dayStemIndex],
    dayMasterElement: dayElement,
    dayMasterElementCn: STEM_ELEMENTS_CN[FIVE_ELEMENTS.indexOf(dayElement as typeof FIVE_ELEMENTS[number])],
    fiveElements,
    totalElements: total,
    dayMasterStrength: strength,
    dayMasterStrengthScore: score,
    favorableElements: favorable,
    favorableElementsCn: favorableCn,
    unfavorableElements: unfavorable,
    unfavorableElementsCn: unfavorableCn,
    naYinYear: yearPillar.naYin,
    naYinYearCn: yearPillar.naYinCn,
    greatFortunes,
    shichen: shichen.name,
    shichenPinyin: shichen.pinyin,
    shichenRange: `${shichen.start} - ${shichen.end}`,
  }
}

/**
 * 模板化解读内容生成
 */
export function generateFreeReading(bazi: BaziReading): {
  personality: string[]
  career: string
  relationships: string
  wealth: string
  health: string
} {
  const dayMaster = bazi.dayMaster
  const strength = bazi.dayMasterStrength
  
  // 基于日主五行和强弱的模板化解读
  const personalityTemplates: Record<string, string[]> = {
    Wood: [
      'You have a natural drive for growth and expansion, like a tree reaching toward the sky.',
      'Strong sense of justice and fairness — you naturally stand up for what you believe in.',
      'Creative and flexible thinking, with an innate ability to find new solutions.',
      'You value kindness and compassion, and tend to put others before yourself.',
    ],
    Fire: [
      'Passionate and energetic — you bring warmth and enthusiasm wherever you go.',
      'Natural leadership qualities, with the ability to inspire and motivate others.',
      'Quick mind and sharp intuition — you often know things before others explain them.',
      'You have a strong creative spark and thrive in dynamic environments.',
    ],
    Earth: [
      'Grounded and reliable — people know they can count on you.',
      'Strong sense of responsibility and commitment to long-term goals.',
      'Practical and methodical approach to problems — you build things to last.',
      'You value stability and create a sense of security for those around you.',
    ],
    Metal: [
      'Disciplined and principled — you have a strong internal code of conduct.',
      'Clear thinking and good judgment — you see through complexity to the core issue.',
      'Natural attention to detail and high standards for quality.',
      'You have a quiet strength and resilience — like metal forged in fire.',
    ],
    Water: [
      'Adaptable and flowing — you navigate change with grace and intelligence.',
      'Deep emotional intelligence and intuitive understanding of people.',
      'Natural communicator, with the ability to connect with diverse personalities.',
      'You have a reflective, thoughtful nature — wisdom comes naturally to you.',
    ],
  }
  
  const careerTemplates: Record<string, string> = {
    Wood: `Your Wood element gives you natural growth-oriented thinking. You thrive in roles that involve strategy, planning, and building something new. Fields like education, publishing, design, and healthcare resonate with your nature. ${strength === 'strong' ? 'Your strong Wood suggests leadership potential — you have the drive to build something significant.' : strength === 'weak' ? 'Your gentle Wood nature makes you a supportive collaborator who helps teams grow together.' : 'Your balanced Wood gives you both vision and follow-through — a rare combination.'}`,
    Fire: `Your Fire element fuels natural leadership and creative expression. You excel in roles that require passion, communication, and inspiration. Fields like media, entertainment, marketing, and technology suit your dynamic energy. ${strength === 'strong' ? 'Your strong Fire gives you powerful presence — you can light up any room and lead with conviction.' : strength === 'weak' ? 'Your warm Fire makes you a creative problem-solver who brings innovative ideas quietly to life.' : 'Your balanced Fire gives you both passion and patience — the ability to inspire without overwhelming.'}`,
    Earth: `Your Earth element makes you naturally reliable and methodical. You excel in roles that require patience, planning, and long-term commitment. Fields like finance, real estate, agriculture, and project management align with your grounded nature. ${strength === 'strong' ? 'Your strong Earth gives you incredible stamina and follow-through — you build things that last.' : strength === 'weak' ? 'Your gentle Earth nature makes you a supportive team member who creates stability for others.' : 'Your balanced Earth gives you both practicality and flexibility — you adapt while staying grounded.'}`,
    Metal: `Your Metal element gives you natural precision and analytical thinking. You thrive in roles that require attention to detail, quality standards, and clear structure. Fields like engineering, finance, law, and healthcare suit your disciplined approach. ${strength === 'strong' ? 'Your strong Metal gives you unwavering principles and high standards — you excel at quality work.' : strength === 'weak' ? 'Your refined Metal nature makes you perceptive and detail-oriented in supportive roles.' : 'Your balanced Metal gives you both rigor and flexibility — you maintain standards without being rigid.'}`,
    Water: `Your Water element gives you natural intelligence and adaptability. You excel in roles that require understanding people, strategic thinking, and navigating complexity. Fields like consulting, research, psychology, and international business resonate with your depth. ${strength === 'strong' ? 'Your strong Water gives you powerful intuition and the ability to navigate complex situations effortlessly.' : strength === 'weak' ? 'Your gentle Water nature makes you empathetic and insightful — you understand people deeply.' : 'Your balanced Water gives you both depth and flow — you\'re wise and adaptable.'}`,
  }
  
  const relationshipTemplates: Record<string, string> = {
    Wood: 'In relationships, you bring growth and support. You naturally encourage your partner to develop and reach their potential. You value honesty and direct communication, and you thrive when both people are growing together. Sometimes your drive for improvement can feel like pressure — remember to appreciate the present moment.',
    Fire: 'In relationships, you bring passion and warmth. You\'re generous with your affection and love to make your partner feel special. You value excitement and shared adventures. Your natural optimism helps you overcome challenges together. Be mindful of your tendency to jump to conclusions — patience is your relationship\'s friend.',
    Earth: 'In relationships, you bring stability and reliability. You\'re the rock that your partner can always count on. You value commitment and build relationships slowly but deeply. Your nurturing nature creates a safe and comfortable home environment. Remember to share your feelings openly — others may not always read your quiet care.',
    Metal: 'In relationships, you bring loyalty and integrity. You take commitments seriously and expect the same in return. You value honesty and have a low tolerance for games or manipulation. Your standards are high, but you\'re incredibly devoted when you find the right person. Practice flexibility — perfection isn\'t required for a good relationship.',
    Water: 'In relationships, you bring emotional depth and understanding. You intuitively sense your partner\'s needs and feelings. You value deep emotional connection and meaningful conversation. Your adaptability helps you navigate conflicts with grace. Be careful not to absorb others\' emotions too much — maintain your own boundaries.',
  }
  
  const wealthTemplates: Record<string, string> = {
    Wood: 'Your wealth comes through growth and expansion. You generate resources by building things — businesses, relationships, knowledge. Multiple streams of income come naturally as you plant seeds in different areas. Focus on long-term growth rather than quick gains. Your wealth grows steadily, like a tree — it takes time but becomes strong and enduring.',
    Fire: 'Your wealth comes through your passion and personal brand. When you put your energy into what you love, money follows naturally. You have a knack for creating value that people want to pay for. Your reputation and network are your most valuable assets. Invest in developing your skills and presence — they\'re the fuel for your financial growth.',
    Earth: 'Your wealth comes through steady accumulation and smart planning. You\'re naturally careful with resources and good at long-term financial planning. Real estate, savings, and stable investments suit your style. You build wealth slowly but surely, and you rarely take unnecessary risks. Your patience is your greatest financial asset.',
    Metal: 'Your wealth comes through precision and quality. You have a knack for identifying value and making smart investments. Your analytical skills help you spot opportunities others miss. You excel at managing resources and optimizing systems. Focus on quality over quantity — your wealth grows through careful, strategic moves rather than speculation.',
    Water: 'Your wealth flows in through connections and insight. You have a natural sense of where the market is going and can adapt quickly. Your network is your net worth — you build wealth through relationships and information flows. Multiple sources of income come naturally to you. Trust your intuition about financial opportunities — it\'s usually right.',
  }
  
  const healthTemplates: Record<string, string> = {
    Wood: 'With Wood as your Day Master, pay attention to liver and gallbladder health. Stress and anger can particularly affect you. Regular exercise — especially outdoor activities like hiking or yoga — helps keep your Wood energy flowing smoothly. Sour foods in moderation, and getting enough sleep are important. Your growth energy needs proper outlets — find healthy ways to channel your drive.',
    Fire: 'With Fire as your Day Master, pay attention to heart and small intestine health. Your passionate nature can lead to burnout if you don\'t pace yourself. Cooling foods, adequate rest, and stress management are important. Meditation and quiet time help balance your fire energy. Remember to take breaks — your energy is powerful but needs to recharge.',
    Earth: 'With Earth as your Day Master, pay attention to digestive health — spleen and stomach. You tend to worry and overthink, which can affect digestion. Regular meal times, warm cooked foods, and gentle exercise like walking benefit you. Grounding practices help balance your energy. Remember to let go of worries — not everything needs to be planned for.',
    Metal: 'With Metal as your Day Master, pay attention to lung and large intestine health. Your respiratory system may be more sensitive. Breathing exercises, spending time in nature, and keeping your living space clean and fresh are beneficial. You may be prone to seasonal allergies. Your disciplined nature helps you maintain healthy routines — use this strength for regular exercise and sleep.',
    Water: 'With Water as your Day Master, pay attention to kidney and bladder health. Your tendency to overthink can drain your Water energy. Adequate hydration, proper rest, and avoiding excessive stress are important. Gentle exercise like swimming or tai chi suit your nature. Your deep emotional nature needs outlets — make time for reflection and creative expression.',
  }
  
  return {
    personality: personalityTemplates[dayMaster as keyof typeof personalityTemplates] || personalityTemplates.Wood,
    career: careerTemplates[dayMaster as keyof typeof careerTemplates] || careerTemplates.Wood,
    relationships: relationshipTemplates[dayMaster as keyof typeof relationshipTemplates] || relationshipTemplates.Wood,
    wealth: wealthTemplates[dayMaster as keyof typeof wealthTemplates] || wealthTemplates.Wood,
    health: healthTemplates[dayMaster as keyof typeof healthTemplates] || healthTemplates.Wood,
  }
}
