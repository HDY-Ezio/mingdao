/**
 * I Ching (易经) Calculator - 起卦算法
 * 
 * Features:
 * - Three Coins Method (三枚铜钱法)
 * - Time-based Method (时间起卦法)
 * - Changing lines calculation (变爻计算)
 * - Hexagram interpretation generation
 */

import { 
  HEXAGRAMS, 
  getHexagramByNumber, 
  getChangedHexagram,
  type Hexagram,
  type HexagramLine,
  EIGHT_TRIGRAMS,
  getTrigramByBinary,
} from './iching-data'

// ============================================================================
// Types
// ============================================================================

export type CastingMethod = 'coins' | 'time'

export interface IChingInput {
  question: string
  method: CastingMethod
  // For coins method
  coinResults?: number[][]  // 6 throws, each with 3 coins (2=正面/阳, 3=反面/阴)
  // For time method
  castTime?: Date
}

export interface IChingResult {
  question: string
  method: CastingMethod
  castTime: Date
  
  // 本卦
  hexagram: Hexagram
  hexagramLines: number[]  // 6 lines, bottom to top, 1=yang, 0=yin
  
  // 变爻
  changingLines: number[]  // positions 1-6 (bottom to top)
  
  // 变卦
  changedHexagram?: Hexagram
  changedLines?: number[]
  
  // 解读
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

// ============================================================================
// Three Coins Method (三枚铜钱法)
// ============================================================================

/**
 * Simulate three coin toss
 * 三枚铜钱：正面=3(阳), 反面=2(阴)
 * 总和: 6=老阴(变), 7=少阳(不变), 8=少阴(不变), 9=老阳(变)
 */
export function tossThreeCoins(): { coins: number[]; sum: number; line: number; isChanging: boolean } {
  // 每枚硬币: 0=反面(阴, 值2), 1=正面(阳, 值3)
  const coins = [0, 1, 2].map(() => Math.random() < 0.5 ? 2 : 3)
  const sum = coins.reduce((a, b) => a + b, 0)
  
  // 6,8 = 阴; 7,9 = 阳
  const line = sum === 6 || sum === 8 ? 0 : 1
  // 6(老阴) 和 9(老阳) 是变爻
  const isChanging = sum === 6 || sum === 9
  
  return { coins, sum, line, isChanging }
}

/**
 * Cast hexagram using three coins method
 * 三枚铜钱法起卦
 */
export function castWithCoins(question: string): IChingResult {
  const lines: number[] = []
  const changingLines: number[] = []
  
  // 摇6次，从下往上
  for (let i = 0; i < 6; i++) {
    const result = tossThreeCoins()
    lines.push(result.line)
    if (result.isChanging) {
      changingLines.push(i + 1)  // position 1-6
    }
  }
  
  return buildResult(question, 'coins', lines, changingLines, new Date())
}

// ============================================================================
// Time-based Method (时间起卦法)
// ============================================================================

/**
 * Cast hexagram using time method
 * 时间起卦法：年+月+日 得上卦，年+月+日+时 得下卦，动爻
 * 
 * 简化版: 基于当前时间的数字特征起卦
 */
export function castWithTime(question: string, castTime?: Date): IChingResult {
  const time = castTime || new Date()
  
  // 农历时间简化（用阳历数字代替）
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hour = time.getHours()
  
  // 时辰 (0-11: 子-亥)
  const shichen = Math.floor((hour + 1) / 2) % 12
  
  // 上卦: (年+月+日) % 8
  const upperNum = (year + month + day) % 8
  const upperTrigramId = upperNum === 0 ? 7 : upperNum - 1  // 1=乾(7), 2=兑(6)... 8=坤(0)
  
  // 下卦: (年+月+日+时) % 8
  const lowerNum = (year + month + day + shichen + 1) % 8
  const lowerTrigramId = lowerNum === 0 ? 7 : lowerNum - 1
  
  // 动爻: (年+月+日+时) % 6
  const changingLine = (year + month + day + shichen + 1) % 6
  const changingLinePos = changingLine === 0 ? 6 : changingLine
  
  // 构建六爻
  const upperBinary = EIGHT_TRIGRAMS.find(t => t.id === upperTrigramId)?.binary || [1, 1, 1]
  const lowerBinary = EIGHT_TRIGRAMS.find(t => t.id === lowerTrigramId)?.binary || [0, 0, 0]
  
  const lines = [...lowerBinary, ...upperBinary]
  const changingLines = [changingLinePos]
  
  return buildResult(question, 'time', lines, changingLines, time)
}

// ============================================================================
// Build Result
// ============================================================================

function buildResult(
  question: string,
  method: CastingMethod,
  lines: number[],
  changingLines: number[],
  castTime: Date
): IChingResult {
  // 本卦
  const hexagram = HEXAGRAMS.find(h => {
    const upper = EIGHT_TRIGRAMS.find(t => t.id === h.upperTrigram)
    const lower = EIGHT_TRIGRAMS.find(t => t.id === h.lowerTrigram)
    if (!upper || !lower) return false
    const hLines = [...lower.binary, ...upper.binary]
    return hLines.every((l, i) => l === lines[i])
  }) || HEXAGRAMS[0]
  
  // 变卦
  const { hexagram: changedHexagram, changedLines } = getChangedHexagram(lines, changingLines)
  
  // 解读
  const interpretation = generateInterpretation(question, hexagram, changingLines, changedHexagram)
  
  return {
    question,
    method,
    castTime,
    hexagram,
    hexagramLines: lines,
    changingLines,
    changedHexagram,
    changedLines,
    interpretation,
  }
}

// ============================================================================
// Interpretation Generation
// ============================================================================

function generateInterpretation(
  question: string,
  hexagram: Hexagram,
  changingLines: number[],
  changedHexagram?: Hexagram
): IChingResult['interpretation'] {
  // 卦义解读
  const hexagramMeaning = generateHexagramMeaning(hexagram)
  const hexagramMeaningCn = generateHexagramMeaningCn(hexagram)
  
  // 变爻解读
  const linesInterpretation = changingLines.map(pos => {
    const line = hexagram.lines.find(l => l.position === pos) || { text: '', textCn: '' }
    return {
      position: pos,
      text: line.text,
      textCn: line.textCn,
      meaning: generateLineMeaning(pos, line.text, hexagram),
      meaningCn: generateLineMeaningCn(pos, line.textCn, hexagram),
    }
  })
  
  // 变卦解读
  const changedMeaning = changedHexagram 
    ? `The situation is moving from ${hexagram.name} toward ${changedHexagram.name}. This indicates a transition — the current pattern is giving way to a new one.`
    : ''
  const changedMeaningCn = changedHexagram
    ? `局势正从${hexagram.nameCn}向${changedHexagram.nameCn}转变。这是一个过渡时期，当前的格局正在让位于新的格局。`
    : ''
  
  // 整体指引
  const guidance = generateGuidance(question, hexagram, changingLines, changedHexagram)
  const guidanceCn = generateGuidanceCn(question, hexagram, changingLines, changedHexagram)
  
  // 时机
  const timing = generateTiming(hexagram, changingLines)
  const timingCn = generateTimingCn(hexagram, changingLines)
  
  return {
    summary: `Your question resonates with the energy of ${hexagram.name} (${hexagram.nameCn}).`,
    summaryCn: `您的问题与${hexagram.nameCn}（${hexagram.name}）的能量相应。`,
    hexagramMeaning,
    hexagramMeaningCn,
    changingLinesInterpretation: linesInterpretation,
    changedHexagramMeaning: changedMeaning,
    changedHexagramMeaningCn: changedMeaningCn,
    guidance,
    guidanceCn,
    timing,
    timingCn,
  }
}

function generateHexagramMeaning(hexagram: Hexagram): string {
  const upper = EIGHT_TRIGRAMS.find(t => t.id === hexagram.upperTrigram)
  const lower = EIGHT_TRIGRAMS.find(t => t.id === hexagram.lowerTrigram)
  
  return `This hexagram is composed of ${upper?.name || 'Unknown'} above and ${lower?.name || 'Unknown'} below. 
${upper?.nature || ''} energy meets ${lower?.nature || ''} energy, creating the dynamic of ${hexagram.name}.
The image speaks to us through the relationship between these two primary forces:
the ${upper?.element || ''} element of the upper trigram and the ${lower?.element || ''} element of the lower trigram.

The judgment tells us: "${hexagram.judgment}"

This pattern suggests that the fundamental principle at work in your situation is 
the dynamic between ${upper?.nature?.toLowerCase() || 'the creative'} and ${lower?.nature?.toLowerCase() || 'the receptive'}.
Understanding this relationship is the key to navigating your question wisely.`
}

function generateHexagramMeaningCn(hexagram: Hexagram): string {
  const upper = EIGHT_TRIGRAMS.find(t => t.id === hexagram.upperTrigram)
  const lower = EIGHT_TRIGRAMS.find(t => t.id === hexagram.lowerTrigram)
  
  return `此卦由${upper?.nameCn || ''}上${lower?.nameCn || ''}下组成。
${upper?.natureCn || ''}之${upper?.elementCn || ''}与${lower?.natureCn || ''}之${lower?.elementCn || ''}相交，
形成${hexagram.nameCn}之格局。

卦辞曰："${hexagram.judgmentCn}"

此卦所揭示的根本原理，在于${upper?.natureCn || ''}与${lower?.natureCn || ''}之间的相互作用。
理解这一关系，是智慧地应对您所问之事的关键。`
}

function generateLineMeaning(position: number, text: string, hexagram: Hexagram): string {
  const positionMeanings = [
    'The beginning stage — planting seeds, laying foundations. Actions here have ripple effects.',
    'Emerging potential — the first signs of movement. Proper response leads to growth.',
    'The threshold of action — creative tension. Caution combined with boldness succeeds.',
    'A time of transition — the middle way. Neither rushing nor retreating serves best.',
    'Near completion — the fruition of efforts. Grace and generosity mark this stage.',
    'Completion and transformation — the end of one cycle, the seed of the next.',
  ]
  
  return `${text}\n\nThis line speaks to ${positionMeanings[position - 1] || 'the current state of affairs.'}`
}

function generateLineMeaningCn(position: number, text: string, hexagram: Hexagram): string {
  const positionMeanings = [
    '初爻：事物的起始阶段——播种、奠基。此时的行动具有深远影响。',
    '二爻：初显锋芒——生机初现。恰当的回应带来成长。',
    '三爻：行动的门槛——创造性的张力。谨慎与果敢结合方能成功。',
    '四爻：过渡时期——中道而行。不急不躁最为适宜。',
    '五爻：接近完成——努力开花结果。优雅与大度是此阶段的标志。',
    '六爻：完成与转化——一个循环的终结，下一个循环的种子。',
  ]
  
  return `${text}\n\n${positionMeanings[position - 1] || ''}`
}

function generateGuidance(
  question: string,
  hexagram: Hexagram,
  changingLines: number[],
  changedHexagram?: Hexagram
): string {
  const hasChanges = changingLines.length > 0
  
  let guidance = `The I Ching responds to your question: "${question}" with the image of ${hexagram.name}.

The sage advises: 

1. **Understand the pattern**: Before acting, carefully observe the situation as it is. ${hexagram.name} reveals the underlying structure of your question.
2. **Align with the time**: Every hexagram speaks of a particular timing. ${hexagram.image}
3. **Act with integrity**: The most important factor in any divination is the purity of your intention. Ask sincerely, and the answer will be clear.

${hasChanges ? `The changing lines indicate areas where the situation is in flux. Pay special attention to these points of transition — they are where your agency matters most.` : 'Without changing lines, the situation is relatively stable. Focus on deepening your understanding of the core pattern.'}

${changedHexagram ? `Looking ahead, the energy is moving toward ${changedHexagram.name}. This future tendency gives you a glimpse of what is coming if the current trajectory continues.` : ''}

Remember: the I Ching does not dictate fate. It reveals patterns. Your response to the pattern is what shapes your destiny.`

  return guidance
}

function generateGuidanceCn(
  question: string,
  hexagram: Hexagram,
  changingLines: number[],
  changedHexagram?: Hexagram
): string {
  const hasChanges = changingLines.length > 0
  
  return `对于您的问题："${question}"，《易经》以${hexagram.nameCn}之象回应。

圣人告诉我们：

1. **明辨格局**：行动之前，先仔细观察事物的本然状态。${hexagram.nameCn}揭示了您所问之事的内在结构。
2. **与时偕行**：每一卦都有其时。${hexagram.imageCn}
3. **正心诚意**：占卜中最重要的因素是发心之诚。诚心发问，答案自明。

${hasChanges ? '变爻之处，正是局势变化之所在。特别关注这些转折点——您的主观能动性在此最为关键。' : '无变爻，说明局势相对稳定。重点在于深化对核心格局的理解。'}

${changedHexagram ? `展望未来，能量正朝着${changedHexagram.nameCn}的方向移动。这一未来趋势让您窥见：若当前轨迹持续，事情将如何发展。` : ''}

记住：《易经》不决定命运，它揭示规律。您对规律的回应，才是塑造命运的关键。`
}

function generateTiming(hexagram: Hexagram, changingLines: number[]): string {
  const timingMap: Record<string, string> = {
    'Creative Heaven': 'Auspicious — peak energy, great power for action',
    'Receptive Earth': 'Favorable — a time of patient cultivation',
    'Difficulty at the Beginning': 'Caution advised — beginnings are hard',
    'Youthful Folly': 'Learning phase — seek guidance',
    'Waiting': 'Patience is key — timing is not yet right',
    'Conflict': 'Avoid escalation — seek resolution',
  }
  
  return timingMap[hexagram.name] || 'The timing depends on your response to the pattern'
}

function generateTimingCn(hexagram: Hexagram, changingLines: number[]): string {
  const timingMap: Record<string, string> = {
    'Creative Heaven': '吉——能量鼎盛，大有可为',
    'Receptive Earth': '利——耐心培育之时',
    'Difficulty at the Beginning': '慎——万事开头难',
    'Youthful Folly': '学——求学问道之期',
    'Waiting': '待——时机未到，静候为宜',
    'Conflict': '避——避免升级，寻求和解',
  }
  
  return timingMap[hexagram.name] || '时机取决于您对格局的回应'
}

// ============================================================================
// Main Entry Point
// ============================================================================

/**
 * Cast I Ching hexagram
 * 起卦主函数
 */
export function castIChing(input: IChingInput): IChingResult {
  const { question, method } = input
  
  if (method === 'time') {
    return castWithTime(question, input.castTime)
  }
  
  return castWithCoins(question)
}

// Get hexagram by number (utility)
export function getHexagram(number: number): Hexagram | undefined {
  return getHexagramByNumber(number)
}

// Get all hexagrams (utility)
export function getAllHexagrams(): Hexagram[] {
  return HEXAGRAMS
}

// Get trigram info
export function getTrigram(id: number) {
  return EIGHT_TRIGRAMS.find(t => t.id === id)
}

// Export types
export type { Hexagram, HexagramLine }
