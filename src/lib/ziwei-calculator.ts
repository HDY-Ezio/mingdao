/**
 * Zi Wei Dou Shu Calculator - 紫微斗数排盘（MVP简化版）
 * Purple Star Astrology - Simplified MVP Implementation
 * 
 * Features:
 * - 12 Palaces calculation (十二宫)
 * - 14 Major Stars simplified mapping (十四主星简化映射)
 * - Life Palace calculation (命宫算法)
 * - Basic palace interpretation
 * 
 * Note: This is a simplified MVP version. The full algorithm with precise
 * star placement will be implemented in a later phase.
 */

import { HEAVENLY_STEMS, EARTHLY_BRANCHES, HEAVENLY_STEMS_PINYIN, EARTHLY_BRANCHES_PINYIN } from './lunar-calendar'

// ============================================================================
// 14 Major Stars (十四主星)
// ============================================================================

export const FOURTEEN_MAJOR_STARS = [
  { id: 'ziwei', name: 'Zi Wei', nameCn: '紫微', element: 'Earth', nature: 'Emperor' },
  { id: 'tianji', name: 'Tian Ji', nameCn: '天机', element: 'Wood', nature: 'Wisdom' },
  { id: 'taiyang', name: 'Tai Yang', nameCn: '太阳', element: 'Fire', nature: 'Sun' },
  { id: 'wuqu', name: 'Wu Qu', nameCn: '武曲', element: 'Metal', nature: 'Wealth' },
  { id: 'tianfu', name: 'Tian Fu', nameCn: '天府', element: 'Earth', nature: 'Treasury' },
  { id: 'taiyin', name: 'Tai Yin', nameCn: '太阴', element: 'Water', nature: 'Moon' },
  { id: 'tanlang', name: 'Tan Lang', nameCn: '贪狼', element: 'Wood', nature: 'Desire' },
  { id: 'jumen', name: 'Ju Men', nameCn: '巨门', element: 'Earth', nature: 'Speech' },
  { id: 'tianxiang', name: 'Tian Xiang', nameCn: '天相', element: 'Water', nature: 'Minister' },
  { id: 'tianliang', name: 'Tian Liang', nameCn: '天梁', element: 'Earth', nature: 'Blessing' },
  { id: 'qisha', name: 'Qi Sha', nameCn: '七杀', element: 'Metal', nature: 'Power' },
  { id: 'pojun', name: 'Po Jun', nameCn: '破军', element: 'Water', nature: 'Rebellion' },
  { id: 'lianzhen', name: 'Lian Zhen', nameCn: '廉贞', element: 'Fire', nature: 'Purity' },
  { id: 'tiantong', name: 'Tian Tong', nameCn: '天同', element: 'Water', nature: 'Blessing' },
] as const

// ============================================================================
// 12 Palaces (十二宫)
// ============================================================================

export const TWELVE_PALACES = [
  { id: 'life', name: 'Life Palace', nameCn: '命宫', position: 0 },
  { id: 'siblings', name: 'Siblings Palace', nameCn: '兄弟宫', position: 1 },
  { id: 'spouse', name: 'Spouse Palace', nameCn: '夫妻宫', position: 2 },
  { id: 'children', name: 'Children Palace', nameCn: '子女宫', position: 3 },
  { id: 'wealth', name: 'Wealth Palace', nameCn: '财帛宫', position: 4 },
  { id: 'health', name: 'Health Palace', nameCn: '疾厄宫', position: 5 },
  { id: 'travel', name: 'Travel Palace', nameCn: '迁移宫', position: 6 },
  { id: 'friends', name: 'Friends Palace', nameCn: '交友宫', position: 7 },
  { id: 'career', name: 'Career Palace', nameCn: '官禄宫', position: 8 },
  { id: 'property', name: 'Property Palace', nameCn: '田宅宫', position: 9 },
  { id: 'fortune', name: 'Fortune Palace', nameCn: '福德宫', position: 10 },
  { id: 'parents', name: 'Parents Palace', nameCn: '父母宫', position: 11 },
] as const

// ============================================================================
// Palace Interpretations (宫位解读模板)
// ============================================================================

const PALACE_INTERPRETATIONS: Record<string, { title: string; titleCn: string; description: string; descriptionCn: string }[]> = {
  life: [
    { title: 'Natural Leader', titleCn: '天生领袖', description: 'You have natural leadership qualities and a regal bearing. People look to you for guidance and direction.', descriptionCn: '你天生具有领导气质，仪态尊贵，众人皆向你寻求指引。' },
    { title: 'Wise Strategist', titleCn: '智慧谋略', description: 'Your mind is sharp and strategic. You excel at planning and finding the optimal path through complexity.', descriptionCn: '你思维敏锐，善于谋略，能在复杂局面中找到最佳路径。' },
    { title: 'Creative Spirit', titleCn: '创意灵动', description: 'Creative and expressive, you bring fresh perspectives to everything you touch. Artistic talents may be prominent.', descriptionCn: '创意丰富，表达力强，总能带来新鲜视角，艺术天赋突出。' },
    { title: 'Steadfast Builder', titleCn: '稳健开拓', description: 'You are a builder who creates lasting structures. Patient and methodical, you achieve through consistent effort.', descriptionCn: '你是稳健的建设者，耐心有序，通过持续努力成就事业。' },
  ],
  wealth: [
    { title: 'Steady Accumulation', titleCn: '稳扎稳打', description: 'Wealth comes through steady work and careful management. You build resources gradually but securely.', descriptionCn: '财运稳扎稳打，通过踏实工作和谨慎理财逐步积累。' },
    { title: 'Opportunistic Gains', titleCn: '把握机遇', description: 'You have a knack for spotting financial opportunities. Quick action leads to unexpected windfalls.', descriptionCn: '善于发现财务机遇，果断行动常带来意外收获。' },
    { title: 'Multiple Streams', titleCn: '多路进财', description: 'Multiple income sources come naturally to you. Diversification is your path to financial security.', descriptionCn: '天生有多路进财的机会，多元化是你财务安全的路径。' },
    { title: 'Investment Acumen', titleCn: '投资眼光', description: 'You have good judgment about investments. Trust your analytical instincts for financial decisions.', descriptionCn: '投资眼光独到，相信自己的分析直觉做财务决策。' },
  ],
  career: [
    { title: 'Ambitious Climber', titleCn: '事业心强', description: 'Career is central to your life path. You have high ambitions and the drive to achieve them.', descriptionCn: '事业是你人生的重心，志向高远，行动力强。' },
    { title: 'Creative Professions', titleCn: '创意行业', description: 'Creative fields suit you best. Expressive work brings both success and fulfillment.', descriptionCn: '最适合创意行业，表达性工作带来成功与满足。' },
    { title: 'Authority & Power', titleCn: '掌权得势', description: 'You naturally rise to positions of authority. Leadership roles come easily to you.', descriptionCn: '你容易获得权力地位，领导角色得心应手。' },
    { title: 'Service & Helping', titleCn: '服务助人', description: 'Your career thrives when helping others. Service professions bring deep satisfaction.', descriptionCn: '助人的事业最适合你，服务行业带来深层满足。' },
  ],
  spouse: [
    { title: 'Devoted Partner', titleCn: '深情专一', description: 'You seek deep emotional connection in relationships. Loyalty and devotion matter most to you.', descriptionCn: '追求深度情感连接，忠诚专一最重要。' },
    { title: 'Dynamic Union', titleCn: '激情互动', description: 'Your relationships are passionate and dynamic. You thrive on excitement and growth together.', descriptionCn: '感情充满激情与活力，共同成长是关键。' },
    { title: 'Supportive Match', titleCn: '贤良助力', description: 'Your partner is supportive and helpful. They contribute significantly to your success.', descriptionCn: '伴侣贤良有助，能在事业生活中给予重要支持。' },
    { title: 'Independent Souls', titleCn: '各自精彩', description: 'You and your partner both need space and independence. Love grows through mutual respect.', descriptionCn: '双方都需要独立空间，感情因尊重而深厚。' },
  ],
  health: [
    { title: 'Strong Constitution', titleCn: '体质强健', description: 'Your physical vitality is strong. Recovery from illness tends to be quick.', descriptionCn: '体质强健，生病恢复速度快。' },
    { title: 'Sensitive Digestion', titleCn: '脾胃注意', description: 'Pay attention to digestive health. Regular meals and warm foods benefit you greatly.', descriptionCn: '注意消化系统健康，规律饮食和温热食物很重要。' },
    { title: 'Mental-Physical Link', titleCn: '身心相关', description: 'Your emotional state strongly affects your physical health. Stress management is key.', descriptionCn: '情绪状态对身体健康影响很大，压力管理是关键。' },
    { title: 'Energy Cycles', titleCn: '精力周期', description: 'Your energy follows natural cycles. Learn to work with your rhythm rather than against it.', descriptionCn: '精力有自然周期，学会顺应节律而非对抗。' },
  ],
}

// Default interpretation template for palaces without specific templates
const DEFAULT_PALACE_INTERPRETATIONS = [
  { title: 'Balanced Energy', titleCn: '能量平衡', description: 'This area of life shows balanced energy. Neither excessively strong nor weak — harmony is the key.', descriptionCn: '此领域能量平衡，不强不弱，和谐为要。' },
  { title: 'Growth Potential', titleCn: '成长潜力', description: 'There is significant potential for growth in this area. Effort invested here yields lasting returns.', descriptionCn: '此领域有显著成长潜力，投入努力会有持久回报。' },
]

// ============================================================================
// Ziwei Input & Result Types
// ============================================================================

export interface ZiweiInput {
  name?: string
  gender: 'male' | 'female'
  birthDate: Date
  birthPlace?: string
  longitude?: number
}

export interface PalaceData {
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
  
  // 命宫信息
  lifePalaceBranch: number
  lifePalaceBranchCn: string
  lifePalaceStem: number
  lifePalaceStemCn: string
  
  // 身宫
  bodyPalace: string
  bodyPalaceCn: string
  
  // 命宫主星
  lifePalaceStars: string[]
  lifePalaceStarsCn: string[]
  
  // 十二宫完整数据
  palaces: PalaceData[]
  
  // 五行局
  fiveElementBureau: string
  fiveElementBureauCn: string
  
  // 格局
  pattern: string
  patternCn: string
  
  // 整体解读
  overallReading: {
    personality: string[]
    personalityCn: string[]
    strengths: string[]
    strengthsCn: string[]
    areasToWork: string[]
    areasToWorkCn: string[]
  }
}

// ============================================================================
// Core Calculation Functions
// ============================================================================

/**
 * Calculate Life Palace branch (命宫地支)
 * 从寅宫起正月，逆数至生月
 * 再从生月宫起子时，顺数至生时
 */
function calculateLifePalaceBranch(birthDate: Date): number {
  const month = birthDate.getMonth() + 1 // 1-12
  const hour = birthDate.getHours()
  
  // 时辰地支: 23-1=子, 1-3=丑, 3-5=寅, ... 21-23=亥
  const hourBranch = Math.floor((hour + 1) / 2) % 12
  
  // 命宫计算: 寅(2)宫起正月，逆数生月，再顺数生时
  // 简化版: 基于月份和时辰计算
  const startBranch = 2 // 寅
  const monthOffset = (month - 1) % 12
  const baseBranch = (startBranch - monthOffset + 12) % 12 // 逆数生月
  const lifeBranch = (baseBranch + hourBranch) % 12 // 顺数生时
  
  return lifeBranch
}

/**
 * Calculate Life Palace stem (命宫天干)
 * 五虎遁：甲己之年丙作首，乙庚之年戊为头...
 */
function calculateLifePalaceStem(birthYear: number, branchIndex: number): number {
  const yearStemIndex = (birthYear - 4) % 10
  
  // 五虎遁口诀
  const monthStemStart = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0] // 丙戊庚壬甲丙戊庚壬甲
  // 甲己年->丙寅月起, 乙庚年->戊寅月起, 丙辛年->庚寅月起, 丁壬年->壬寅月起, 戊癸年->甲寅月起
  
  // 寅(2)是正月起点
  const stemAtYin = monthStemStart[yearStemIndex]
  
  // 计算命宫地支对应的天干
  const offset = (branchIndex - 2 + 12) % 12
  const stemIndex = (stemAtYin + offset) % 10
  
  return stemIndex
}

/**
 * Determine Body Palace (身宫)
 * 身宫与命宫的关系：身宫从生月起，顺数至生时
 */
function calculateBodyPalace(birthDate: Date): number {
  const month = birthDate.getMonth() + 1
  const hour = birthDate.getHours()
  const hourBranch = Math.floor((hour + 1) / 2) % 12
  
  // 身宫: 从生月宫起子时，逆数至生时
  const startBranch = 2 // 寅(正月起点)
  const monthOffset = (month - 1) % 12
  const baseBranch = (startBranch - monthOffset + 12) % 12
  const bodyBranch = (baseBranch - hourBranch + 12) % 12 // 逆数生时
  
  return bodyBranch
}

/**
 * Simplified star placement algorithm (MVP版)
 * 简化的主星分布算法
 * 
 * 真实紫微斗数需要复杂的安星诀，MVP期使用简化映射：
 * 基于命宫位置和五行局，将14主星分布到12宫中
 */
function placeMajorStars(lifePalaceBranch: number, birthYear: number, gender: string): Map<number, typeof FOURTEEN_MAJOR_STEMS[number][]> {
  const palaceStars = new Map<number, typeof FOURTEEN_MAJOR_STEMS[number][]>()
  
  // 初始化12宫
  for (let i = 0; i < 12; i++) {
    palaceStars.set(i, [])
  }
  
  const yearStemIndex = (birthYear - 4) % 10
  
  // 紫微星系 (6颗): 紫微、天机、太阳、武曲、天同、廉贞
  const ziweiGroup = [0, 1, 2, 3, 13, 12] // 紫微、天机、太阳、武曲、天同、廉贞
  
  // 天府星系 (8颗): 天府、太阴、贪狼、巨门、天相、天梁、七杀、破军
  const tianfuGroup = [4, 5, 6, 7, 8, 9, 10, 11]
  
  // 简化版紫微定位: 基于生年和命宫计算
  // 真实算法需要农历日期等，这里用简化映射
  const ziweiOffset = (yearStemIndex + lifePalaceBranch) % 12
  const ziweiPosition = (lifePalaceBranch + ziweiOffset) % 12
  
  // 安紫微星系 (顺时针)
  // 紫微在某宫，然后逆布: 紫微、天机(+1)、太阳(+3)、武曲(+4)、天同(+6)、廉贞(+8)
  // 这里用简化版本
  const ziweiOffsets = [0, 1, 3, 4, 6, 8] // 各星相对于紫微的偏移
  ziweiGroup.forEach((starIndex, i) => {
    const pos = (ziweiPosition + ziweiOffsets[i]) % 12
    const stars = palaceStars.get(pos) || []
    stars.push(FOURTEEN_MAJOR_STARS[starIndex])
    palaceStars.set(pos, stars)
  })
  
  // 天府星系位置 (对宫关系简化)
  const tianfuPosition = (12 - ziweiPosition + 7) % 12
  
  // 安天府星系
  // 天府、太阴(+1逆)、贪狼(+2)、巨门(+3)、天相(+4)、天梁(+5)、七杀(+6)、破军(+7)
  const tianfuOffsets = [0, 1, 2, 3, 4, 5, 6, 7]
  tianfuGroup.forEach((starIndex, i) => {
    const pos = (tianfuPosition - tianfuOffsets[i] + 12) % 12 // 逆时针
    const stars = palaceStars.get(pos) || []
    stars.push(FOURTEEN_MAJOR_STEMS[starIndex])
    palaceStars.set(pos, stars)
  })
  
  return palaceStars
}

/**
 * Five Element Bureau (五行局)
 * 简化版：基于命宫干支纳音
 */
function getFiveElementBureau(stemIndex: number, branchIndex: number): { name: string; nameCn: string } {
  // 简化的五行局判断
  const stemElementIndex = Math.floor(stemIndex / 2) // 0=木, 1=火, 2=土, 3=金, 4=水
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water']
  const elementsCn = ['木', '火', '土', '金', '水']
  const bureaus = ['Water', 'Wood', 'Metal', 'Earth', 'Fire']
  const bureausCn = ['水二局', '木三局', '金四局', '土五局', '火六局']
  
  // 简化: 基于命宫天干五行
  const index = stemElementIndex % 5
  return {
    name: `${bureaus[index]} Bureau`,
    nameCn: bureausCn[index],
  }
}

/**
 * Generate palace interpretation
 */
function generatePalaceInterpretation(
  palaceId: string,
  stars: typeof FOURTEEN_MAJOR_STEMS[number][],
  gender: string
): PalaceData['interpretation'] {
  const templates = PALACE_INTERPRETATIONS[palaceId] || DEFAULT_PALACE_INTERPRETATIONS
  
  // 根据主星选择解读模板
  const templateIndex = stars.length > 0 
    ? (stars[0].id.charCodeAt(0) + stars.length) % templates.length 
    : 0
  
  const template = templates[templateIndex]
  
  // 生成亮点和挑战
  const starNames = stars.map(s => s.name)
  
  const highlights = stars.slice(0, 3).map(star => 
    `${star.name} (${star.nameCn}) brings ${star.nature.toLowerCase()} energy to this area.`
  )
  
  const highlightsCn = stars.slice(0, 3).map(star => 
    `${star.nameCn}星主${star.nature.toLowerCase()}，为此宫带来相应能量。`
  )
  
  const challenges = [
    'Balancing the different star energies in this palace requires awareness.',
    'Transit periods can activate or challenge these natal tendencies.',
  ]
  
  const challengesCn = [
    '此宫各星能量的平衡需要觉察与智慧。',
    '大运流年可激活或挑战这些本命特质。',
  ]
  
  return {
    summary: template.description,
    summaryCn: template.descriptionCn,
    highlights: highlights.length > 0 ? highlights : ['Balanced energy in this area.'],
    highlightsCn: highlightsCn.length > 0 ? highlightsCn : ['此领域能量平衡。'],
    challenges,
    challengesCn,
  }
}

/**
 * Main Zi Wei Dou Shu calculation function
 * 紫微斗数排盘主函数（MVP简化版）
 */
export function calculateZiwei(params: ZiweiInput): ZiweiResult {
  const {
    name = '',
    gender,
    birthDate,
    birthPlace = '',
  } = params
  
  const birthYear = birthDate.getFullYear()
  
  // 1. 计算命宫地支
  const lifeBranchIndex = calculateLifePalaceBranch(birthDate)
  
  // 2. 计算命宫天干
  const lifeStemIndex = calculateLifePalaceStem(birthYear, lifeBranchIndex)
  
  // 3. 计算身宫
  const bodyBranchIndex = calculateBodyPalace(birthDate)
  const bodyPalaceName = TWELVE_PALACES[bodyBranchIndex] || TWELVE_PALACES[0]
  
  // 4. 排布14主星
  const palaceStarsMap = placeMajorStars(lifeBranchIndex, birthYear, gender)
  
  // 5. 五行局
  const fiveElementBureau = getFiveElementBureau(lifeStemIndex, lifeBranchIndex)
  
  // 6. 构建12宫完整数据
  const palaces: PalaceData[] = TWELVE_PALACES.map((palace, index) => {
    // 宫位对应的地支（命宫在第0位，顺时针排）
    const branchIndex = (lifeBranchIndex + index) % 12
    const stars = palaceStars.get(branchIndex) || []
    const interpretation = generatePalaceInterpretation(palace.id, stars, gender)
    
    return {
      id: palace.id,
      name: palace.name,
      nameCn: palace.nameCn,
      position: index,
      branch: EARTHLY_BRANCHES[branchIndex],
      branchCn: EARTHLY_BRANCHES[branchIndex],
      branchPinyin: EARTHLY_BRANCHES_PINYIN[branchIndex],
      majorStars: stars,
      auxiliaryStars: getAuxiliaryStars(palace.id, index),
      interpretation,
    }
  })
  
  // 7. 命宫主星
  const lifePalaceData = palaces[0] // 命宫始终在数组第0位
  const lifeStars = lifePalaceData.majorStars
  
  // 8. 整体格局
  const pattern = determinePattern(lifeStars, fiveElementBureau.nameCn)
  
  // 9. 整体解读
  const overallReading = generateOverallReading(lifeStars, gender, fiveElementBureau.name)
  
  return {
    name,
    gender,
    birthDate,
    birthPlace,
    lifePalaceBranch: lifeBranchIndex,
    lifePalaceBranchCn: EARTHLY_BRANCHES[lifeBranchIndex],
    lifePalaceStem: lifeStemIndex,
    lifePalaceStemCn: HEAVENLY_STEMS[lifeStemIndex],
    bodyPalace: bodyPalaceName.name,
    bodyPalaceCn: bodyPalaceName.nameCn,
    lifePalaceStars: lifeStars.map(s => s.name),
    lifePalaceStarsCn: lifeStars.map(s => s.nameCn),
    palaces,
    fiveElementBureau: fiveElementBureau.name,
    fiveElementBureauCn: fiveElementBureau.nameCn,
    pattern: pattern.en,
    patternCn: pattern.cn,
    overallReading,
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function getAuxiliaryStars(palaceId: string, position: number): string[] {
  // 简化版辅星
  const allAuxiliary = [
    ['左辅', '右弼'],
    ['文昌', '文曲'],
    ['天魁', '天钺'],
    ['禄存', '天马'],
    ['擎羊', '陀罗'],
    ['火星', '铃星'],
  ]
  
  return allAuxiliary[position % allAuxiliary.length]
}

function determinePattern(stars: typeof FOURTEEN_MAJOR_STEMS[number], bureauCn: string): { en: string; cn: string } {
  if (stars.length === 0) {
    return { en: 'Empty Life Palace', cn: '命宫无主星' }
  }
  
  const starNames = stars.map(s => s.nameCn).join('')
  
  const patterns: Record<string, { en: string; cn: string }> = {
    '紫微': { en: 'Zi Wei Solo', cn: '紫微独坐' },
    '紫微天机': { en: 'Zi Wei & Tian Ji', cn: '紫机同宫' },
    '紫微天相': { en: 'Zi Wei & Tian Xiang', cn: '紫相同宫' },
    '紫微贪狼': { en: 'Zi Wei & Tan Lang', cn: '紫贪同宫' },
    '天机': { en: 'Tian Ji Solo', cn: '天机独坐' },
    '太阳': { en: 'Tai Yang Solo', cn: '太阳独坐' },
    '武曲': { en: 'Wu Qu Solo', cn: '武曲独坐' },
    '天同': { en: 'Tian Tong Solo', cn: '天同独坐' },
    '廉贞': { en: 'Lian Zhen Solo', cn: '廉贞独坐' },
    '天府': { en: 'Tian Fu Solo', cn: '天府独坐' },
    '太阴': { en: 'Tai Yin Solo', cn: '太阴独坐' },
    '贪狼': { en: 'Tan Lang Solo', cn: '贪狼独坐' },
    '巨门': { en: 'Ju Men Solo', cn: '巨门独坐' },
    '天相': { en: 'Tian Xiang Solo', cn: '天相独坐' },
    '天梁': { en: 'Tian Liang Solo', cn: '天梁独坐' },
    '七杀': { en: 'Qi Sha Solo', cn: '七杀独坐' },
    '破军': { en: 'Po Jun Solo', cn: '破军独坐' },
  }
  
  return patterns[starNames] || { en: `${stars[0].name} Pattern`, cn: `${starNames}格` }
}

function generateOverallReading(
  lifeStars: typeof FOURTEEN_MAJOR_STEMS[number][],
  gender: string,
  bureau: string
) {
  const hasZiwei = lifeStars.some(s => s.id === 'ziwei')
  const hasTianfu = lifeStars.some(s => s.id === 'tianfu')
  const hasTanlang = lifeStars.some(s => s.id === 'tanlang')
  const hasQisha = lifeStars.some(s => s.id === 'qisha')
  const hasPojun = lifeStars.some(s => s.id === 'pojun')
  
  let personality: string[]
  let personalityCn: string[]
  let strengths: string[]
  let strengthsCn: string[]
  let areasToWork: string[]
  let areasToWorkCn: string[]
  
  if (hasZiwei) {
    personality = [
      'You carry a natural dignity and authority that draws respect from others.',
      'Leadership comes naturally — you have the bearing of someone born to guide.',
      'You have high standards for yourself and those around you.',
      'Independence is important — you prefer doing things your own way.',
    ]
    personalityCn = [
      '你天生具有尊贵气质，令人敬重。',
      '领导力与生俱来，有天生的指导者风范。',
      '对自己和他人都有很高的标准。',
      '重视独立，喜欢按照自己的方式做事。',
    ]
    strengths = ['Natural leadership', 'Dignified presence', 'High standards', 'Strategic thinking']
    strengthsCn = ['天生领导力', '仪态尊贵', '高标准', '战略思维']
    areasToWork = ['Pride and stubbornness', 'Isolation from others', 'Impatience with imperfection']
    areasToWorkCn = ['骄傲固执', '容易孤立', '对不完美缺乏耐心']
  } else if (hasTanlang || hasPojun || hasQisha) {
    personality = [
      'Dynamic and energetic — you thrive on change and new experiences.',
      'Strong will and determination — once you set your mind, you go all in.',
      'Charismatic and attractive to others — people are drawn to your energy.',
      'You value freedom and resist being constrained by routine.',
    ]
    personalityCn = [
      '充满活力和能量，喜欢变化和新体验。',
      '意志坚定，一旦下定决心就全力以赴。',
      '富有魅力，人们容易被你的能量吸引。',
      '重视自由，抗拒被常规束缚。',
    ]
    strengths = ['Dynamic energy', 'Strong willpower', 'Charisma', 'Adaptability']
    strengthsCn = ['精力充沛', '意志坚强', '个人魅力', '适应力强']
    areasToWork = ['Impulsiveness', 'Restlessness', 'Difficulty with routine']
    areasToWorkCn = ['冲动', '不安定', '难以安于常规']
  } else if (hasTianfu) {
    personality = [
      'Generous and nurturing — you naturally provide for those around you.',
      'Practical and grounded — you have a talent for managing resources.',
      'People feel safe and secure in your presence.',
      'You appreciate comfort and quality in all things.',
    ]
    personalityCn = [
      '慷慨包容，天生善于照顾身边的人。',
      '务实踏实，有管理资源的天赋。',
      '你在身边让人感到安全可靠。',
      '欣赏舒适和品质，追求美好生活。',
    ]
    strengths = ['Generosity', 'Practical wisdom', 'Reliability', 'Resource management']
    strengthsCn = ['慷慨大方', '务实智慧', '可靠', '资源管理']
    areasToWork = ['Over-caution', 'Resistance to change', 'Self-indulgence tendencies']
    areasToWorkCn = ['过度谨慎', '抗拒变化', '容易自我放纵']
  } else {
    personality = [
      'Thoughtful and perceptive — you notice things that others miss.',
      'Your mind is your greatest asset — analytical, creative, or both.',
      'You approach life with curiosity and a desire to understand.',
      'Inner depth is your hallmark — there is more to you than meets the eye.',
    ]
    personalityCn = [
      '心思细腻，观察力强，能注意到别人忽略的细节。',
      '思维是你最大的资产——分析力、创造力兼具。',
      '以好奇心和求知欲面对生活。',
      '内心深邃，表面之下有丰富的内涵。',
    ]
    strengths = ['Analytical mind', 'Perceptiveness', 'Inner depth', 'Adaptability']
    strengthsCn = ['分析力强', '观察力敏锐', '内心深邃', '适应力强']
    areasToWork = ['Overthinking', 'Self-doubt', 'Taking things too seriously']
    areasToWorkCn = ['思虑过多', '自我怀疑', '过于认真']
  }
  
  return {
    personality,
    personalityCn,
    strengths,
    strengthsCn,
    areasToWork,
    areasToWorkCn,
  }
}
