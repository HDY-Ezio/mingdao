// Report generation utilities
// 报告生成工具

import type { BaziResult, ReportType, FreeReading } from '@/types'
import { generateFreeReading } from './bazi-calculator'
import { calculateZiwei } from './ziwei-calculator'
import { castIChing } from './iching-calculator'
import type { ZiweiResult, IChingReading } from '@/types'

// 生成完整八字报告
export function generateBaziReport(reading: BaziResult): Record<string, any> {
  const freeReading = generateFreeReading(reading)
  
  return {
    basic: {
      name: reading.name,
      gender: reading.gender,
      birthDate: reading.birthDate,
      birthPlace: reading.birthPlace,
      lunarDate: reading.lunarDate,
      naYin: reading.naYinYear,
      naYinCn: reading.naYinYearCn,
    },
    chart: {
      yearPillar: reading.yearPillar,
      monthPillar: reading.monthPillar,
      dayPillar: reading.dayPillar,
      hourPillar: reading.hourPillar,
    },
    analysis: {
      dayMaster: reading.dayMasterElement,
      dayMasterStrength: reading.dayMasterStrength,
      dayMasterStrengthScore: reading.dayMasterStrengthScore,
      favorableElements: reading.favorableElements,
      favorableElementsCn: reading.favorableElementsCn,
      unfavorableElements: reading.unfavorableElements,
      unfavorableElementsCn: reading.unfavorableElementsCn,
      fiveElements: reading.fiveElements,
    },
    freeReading: freeReading,
    // 付费内容
    premium: {
      greatFortunes: reading.greatFortunes,
      yearlyForecast: generateYearlyForecast(reading),
      careerDeep: generateCareerDeep(reading),
      relationshipDeep: generateRelationshipDeep(reading),
      wealthDeep: generateWealthDeep(reading),
      healthDeep: generateHealthDeep(reading),
      favorable: generateFavorableInfo(reading),
    },
  }
}

// 生成流年预测
function generateYearlyForecast(reading: BaziResult) {
  const currentYear = new Date().getFullYear()
  const years = []
  
  for (let i = 0; i < 10; i++) {
    const year = currentYear + i
    const yearStemIndex = (year - 4) % 10
    const yearBranchIndex = (year - 4) % 12
    
    const stems = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui']
    const stemsCn = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
    const branches = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']
    const branchesCn = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    
    const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water']
    const isFavorable = reading.favorableElements.some(e => 
      elements[yearStemIndex].toLowerCase().includes(e.toLowerCase())
    )
    
    years.push({
      year,
      yearStem: stems[yearStemIndex],
      yearStemCn: stemsCn[yearStemIndex],
      yearBranch: branches[yearBranchIndex],
      yearBranchCn: branches[yearBranchIndex],
      element: elements[yearStemIndex],
      isFavorable,
      outlook: isFavorable ? 'auspicious' : 'challenging',
      summary: isFavorable 
        ? `The year of ${branches[yearBranchIndex]} brings favorable energy. Opportunities in career and personal growth.`
        : `The year of ${branches[yearBranchIndex]} presents challenges. Focus on stability and careful decision-making.`,
    })
  }
  
  return years
}

function generateCareerDeep(reading: BaziResult) {
  const dayElement = reading.dayMasterElement
  const strength = reading.dayMasterStrength
  
  return {
    idealIndustries: getIdealIndustries(dayElement, strength),
    careerPath: `Your career path is shaped by your ${dayElement.toLowerCase()} day master nature. Those with a ${dayElement} day master often excel in fields that align with their elemental strengths.`,
    bestTiming: 'Your most favorable career periods align with your great fortune cycles. Pay attention to years where favorable elements dominate.',
    strengths: [
      `Natural talent in ${dayElement.toLowerCase()}-related fields`,
      strong === 'strong' ? 'Strong leadership and initiative' : 'Adaptable and cooperative nature',
      'Strategic thinking and long-term vision',
    ],
    challenges: [
      'Balancing ambition with personal life',
      'Knowing when to act vs. when to wait',
      'Building sustainable success rather than quick wins',
    ],
    advice: 'Focus on industries and roles that align with your favorable elements. Your career will thrive when you work in harmony with your natural strengths rather than against them.',
  }
}

function generateRelationshipDeep(reading: BaziResult) {
  const dayElement = reading.dayMasterElement
  
  return {
    partnerType: getPartnerType(dayElement, reading.gender),
    bestMatch: getBestMatchElement(dayElement),
    peachBlossom: 'Your peach blossom direction and timing reveal periods of heightened romantic energy. Pay attention to Rat, Rabbit, Horse, and Rooster years.',
    marriageOutlook: 'Your chart indicates a marriage path shaped by your day master element and spouse star. The spouse palace in your day branch provides deep insights into your partner nature.',
    relationshipPatterns: [
      'You tend to attract partners who complement your elemental nature',
      'Your relationship style combines your day master traits with your month pillar influence',
      'Deepest connections form with those who share your favorable elements',
    ],
    advice: 'Seek relationships where there is elemental balance. The most harmonious partnerships are those where strengths complement rather than compete.',
  }
}

function generateWealthDeep(reading: BaziResult) {
  return {
    wealthPattern: getWealthPattern(reading),
    accumulationStyle: 'Your wealth accumulation style is determined by your day master strength and wealth star prominence. Strong day masters can hold and grow wealth more easily.',
    bestPeriods: 'Your most prosperous financial periods occur during fortune cycles where wealth stars are strong and active.',
    investmentAdvice: [
      'Invest in industries aligned with your favorable elements',
      'Avoid speculative ventures during weak wealth periods',
      'Build multiple income streams for stability',
      'Save during prosperous years to prepare for leaner times',
    ],
    luckyDirections: getLuckyDirections(reading.dayMasterElement),
    advice: 'Wealth comes most easily when you follow your natural path. Focus on creating value in your area of elemental strength, and abundance will follow.',
  }
}

function generateHealthDeep(reading: BaziResult) {
  const weakElement = getWeakestElement(reading.fiveElements)
  
  return {
    vitality: reading.dayMasterStrength === 'strong' ? 'Strong vitality and resilience' : reading.dayMasterStrength === 'balanced' ? 'Balanced health with steady energy' : 'Need to nurture vitality and build strength',
    weakOrganSystem: getOrganSystem(weakElement),
    weakElement,
    prevention: [
      `Pay special attention to your ${getOrganSystem(weakElement).toLowerCase()} system`,
      'Maintain regular sleep patterns aligned with your element',
      'Practice exercises that strengthen your weakest element',
      'Seasonal changes are times to be especially mindful',
    ],
    seasonalCare: {
      spring: 'Spring is Wood season — good for liver detox and new beginnings',
      summer: 'Summer is Fire season — protect heart energy, stay cool',
      autumn: 'Autumn is Metal season — strengthen lungs, let go of what no longer serves',
      winter: 'Winter is Water season — conserve kidney energy, rest deeply',
    },
    advice: 'Health in Chinese medicine is about balance. When your five elements are in harmony, your body naturally heals and thrives. Focus on nurturing your weakest element first.',
  }
}

function generateFavorableInfo(reading: BaziResult) {
  return {
    colors: getFavorableColors(reading.favorableElements),
    directions: getLuckyDirections(reading.dayMasterElement),
    numbers: getLuckyNumbers(reading.dayMasterElement),
    bestSeasons: reading.favorableElements.map(e => capitalize(e)),
    gemstones: getGemstones(reading.favorableElements),
    foods: getBeneficialFoods(reading.favorableElements),
  }
}

// Helper functions
function getIdealIndustries(element: string, strength: string): string[] {
  const industries: Record<string, string[]> = {
    Wood: ['Education', 'Publishing', 'Healthcare', 'Textiles', 'Agriculture', 'Design', 'Counseling'],
    Fire: ['Technology', 'Entertainment', 'Hospitality', 'Marketing', 'Energy', 'Restaurants', 'Arts'],
    Earth: ['Real Estate', 'Construction', 'Agriculture', 'Consulting', 'Banking', 'Insurance', 'Retail'],
    Metal: ['Finance', 'Law', 'Engineering', 'Jewelry', 'Automotive', 'Manufacturing', 'Military'],
    Water: ['Travel', 'Trading', 'Media', 'Psychology', 'Research', 'Shipping', 'Wellness'],
  }
  return industries[element] || ['Consulting', 'Education']
}

function getPartnerType(dayElement: string, gender: string) {
  if (gender === 'male') {
    const wealthElement = getControllingElement(dayElement)
    return `You are attracted to partners with strong ${wealthElement} element qualities — practical, grounded, and resourceful.`
  } else {
    const powerElement = getControllingElement(dayElement)
    return `You are drawn to partners with strong ${powerElement} element qualities — decisive, ambitious, and protective.`
  }
}

function getBestMatchElement(dayElement: string): string {
  const matches: Record<string, string> = {
    Wood: 'Water nourishes Wood — Water signs bring growth',
    Fire: 'Wood fuels Fire — Wood signs bring passion',
    Earth: 'Fire creates Earth — Fire signs bring warmth',
    Metal: 'Earth produces Metal — Earth signs bring stability',
    Water: 'Metal generates Water — Metal signs bring clarity',
  }
  return matches[dayElement] || 'Balanced elements create harmony'
}

function getWealthPattern(reading: BaziResult): string {
  const wealthElement = getControllingElement(reading.dayMasterElement)
  const wealthScore = reading.fiveElements[wealthElement.toLowerCase() as keyof typeof reading.fiveElements] || 0
  
  if (wealthScore > 30) {
    return 'Strong wealth pattern — abundant opportunities for financial growth'
  } else if (wealthScore > 15) {
    return 'Moderate wealth pattern — steady accumulation through consistent effort'
  } else {
    return 'Developing wealth pattern — wealth comes through knowledge and skill building'
  }
}

function getWeakestElement(elements: Record<string, number>): string {
  let weakest = 'wood'
  let min = Infinity
  
  for (const [element, score] of Object.entries(elements)) {
    if (score < min) {
      min = score
      weakest = element
    }
  }
  
  return capitalize(weakest)
}

function getOrganSystem(element: string): string {
  const organs: Record<string, string> = {
    Wood: 'Liver & Gallbladder',
    Fire: 'Heart & Small Intestine',
    Earth: 'Spleen & Stomach',
    Metal: 'Lungs & Large Intestine',
    Water: 'Kidneys & Bladder',
  }
  return organs[element] || 'Overall vitality'
}

function getFavorableColors(elements: string[]): string[] {
  const colors: Record<string, string[]> = {
    Wood: ['Green', 'Brown', 'Teal', 'Olive'],
    Fire: ['Red', 'Orange', 'Purple', 'Pink'],
    Earth: ['Yellow', 'Beige', 'Tan', 'Brown'],
    Metal: ['White', 'Silver', 'Gold', 'Gray'],
    Water: ['Black', 'Navy', 'Blue', 'Deep Purple'],
  }
  
  return elements.flatMap(e => colors[capitalize(e)] || [])
}

function getLuckyDirections(element: string): string[] {
  const directions: Record<string, string[]> = {
    Wood: ['East', 'Southeast'],
    Fire: ['South'],
    Earth: ['Northeast', 'Southwest', 'Center'],
    Metal: ['West', 'Northwest'],
    Water: ['North'],
  }
  return directions[element] || ['All directions']
}

function getLuckyNumbers(element: string): number[] {
  const numbers: Record<string, number[]> = {
    Wood: [1, 3, 4, 8],
    Fire: [2, 3, 7, 9],
    Earth: [5, 6, 8, 9],
    Metal: [4, 9, 6, 7],
    Water: [1, 6, 9, 0],
  }
  return numbers[element] || [1, 6, 8]
}

function getGemstones(elements: string[]): string[] {
  const stones: Record<string, string[]> = {
    Wood: ['Jade', 'Emerald', 'Peridot', 'Green Aventurine'],
    Fire: ['Ruby', 'Carnelian', 'Red Jasper', 'Garnet'],
    Earth: ['Citrine', 'Tiger Eye', 'Yellow Jasper', 'Amber'],
    Metal: ['Clear Quartz', 'White Jade', 'Silver', 'Moonstone'],
    Water: ['Lapis Lazuli', 'Sapphire', 'Black Onyx', 'Aquamarine'],
  }
  
  return elements.flatMap(e => stones[capitalize(e)] || [])
}

function getBeneficialFoods(elements: string[]): string[] {
  const foods: Record<string, string[]> = {
    Wood: ['Leafy greens', 'Sprouts', 'Green tea', 'Sour foods'],
    Fire: ['Red foods', 'Spices', 'Bitter greens', 'Lamb'],
    Earth: ['Root vegetables', 'Grains', 'Sweet foods', 'Legumes'],
    Metal: ['White vegetables', 'Pungent foods', 'Onion', 'Garlic'],
    Water: ['Sea vegetables', 'Black beans', 'Salty foods', 'Fish'],
  }
  
  return elements.flatMap(e => foods[capitalize(e)] || [])
}

function getControllingElement(element: string): string {
  const controlling: Record<string, string> = {
    Wood: 'Earth',
    Earth: 'Water',
    Water: 'Fire',
    Fire: 'Metal',
    Metal: 'Wood',
  }
  return controlling[element] || 'Earth'
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// 紫微斗数完整报告
export function generateZiweiReport(input: Record<string, any>): Record<string, any> {
  const birthDate = new Date(input.birthDate || '1990-01-15')
  const timeStr = input.birthTime || '12:00'
  const [hours, minutes] = timeStr.split(':').map(Number)
  birthDate.setHours(hours, minutes)
  
  const ziweiResult = calculateZiwei({
    name: input.name || '',
    gender: input.gender || 'male',
    birthDate,
    birthPlace: input.birthPlace || '',
  }) as ZiweiResult
  
  return {
    basic: {
      name: ziweiResult.name,
      gender: ziweiResult.gender,
      birthDate: ziweiResult.birthDate,
      birthPlace: ziweiResult.birthPlace,
    },
    ziwei: {
      lifePalaceBranchCn: ziweiResult.lifePalaceBranchCn,
      lifePalaceStemCn: ziweiResult.lifePalaceStemCn,
      bodyPalace: ziweiResult.bodyPalace,
      bodyPalaceCn: ziweiResult.bodyPalaceCn,
      lifePalaceStars: ziweiResult.lifePalaceStars,
      lifePalaceStarsCn: ziweiResult.lifePalaceStarsCn,
      fiveElementBureau: ziweiResult.fiveElementBureau,
      fiveElementBureauCn: ziweiResult.fiveElementBureauCn,
      pattern: ziweiResult.pattern,
      patternCn: ziweiResult.patternCn,
      palaces: ziweiResult.palaces,
      overallReading: ziweiResult.overallReading,
    },
    freeReading: {
      personality: ziweiResult.overallReading.personality,
      career: generateZiweiCareerSummary(ziweiResult),
      relationships: generateZiweiRelationshipSummary(ziweiResult),
      wealth: generateZiweiWealthSummary(ziweiResult),
      health: generateZiweiHealthSummary(ziweiResult),
    },
    premium: {
      twelvePalaces: ziweiResult.palaces,
      greatFortunes: generateZiweiGreatFortunes(ziweiResult),
      deepAnalysis: generateZiweiDeepAnalysis(ziweiResult),
      favorable: {
        colors: ['Gold', 'Purple', 'White'],
        directions: ['Southeast', 'South', 'Northwest'],
        numbers: [1, 5, 6, 9],
        gemstones: ['Amethyst', 'Citrine', 'Clear Quartz'],
      },
    },
  }
}

function generateZiweiCareerSummary(ziwei: ZiweiResult): string {
  const careerPalace = ziwei.palaces.find(p => p.id === 'career')
  const lifeStars = ziwei.lifePalaceStarsCn.join('')
  
  return `Your career path is shaped by the stars in your Career Palace and your Life Palace pattern (${lifeStars}命). ${careerPalace?.interpretation.summary || 'You have natural talent for leadership and strategic planning. Career advancement comes through steady effort and building strong relationships with colleagues and superiors.'}

Your most favorable career periods align with your great fortune cycles. Pay special attention to years where your Career Palace is activated by transiting stars — these are times of opportunity and advancement.`
}

function generateZiweiRelationshipSummary(ziwei: ZiweiResult): string {
  const spousePalace = ziwei.palaces.find(p => p.id === 'spouse')
  
  return `Your relationship destiny is revealed by your Spouse Palace. ${spousePalace?.interpretation.summary || 'You seek deep emotional connection and mutual respect in partnerships.'}

The stars in your Spouse Palace describe the nature of your partner and your relationship patterns. Pay attention to periods where major stars transit your Spouse Palace — these are times of significant relationship developments.`
}

function generateZiweiWealthSummary(ziwei: ZiweiResult): string {
  const wealthPalace = ziwei.palaces.find(p => p.id === 'wealth')
  
  return `Your financial destiny is shown by the stars in your Wealth Palace. ${wealthPalace?.interpretation.summary || 'Wealth comes through consistent effort and wise management.'}

Your Wealth Palace reveals both your earning potential and your relationship with money. Understanding this pattern helps you make wiser financial decisions and recognize opportunities when they arise.`
}

function generateZiweiHealthSummary(ziwei: ZiweiResult): string {
  const healthPalace = ziwei.palaces.find(p => p.id === 'health')
  
  return `Your health constitution is reflected in your Health Palace. ${healthPalace?.interpretation.summary || 'Your vitality is generally strong, but you should pay attention to specific systems based on your chart.'}

By understanding your Health Palace, you can take preventive measures and nurture your weakest areas. Regular attention to your health during challenging periods pays long-term dividends.`
}

function generateZiweiGreatFortunes(ziwei: ZiweiResult) {
  const fortunes = []
  const startAge = 10
  
  for (let i = 0; i < 8; i++) {
    const age = startAge + i * 10
    const palaceIndex = i % 12
    const palace = ziwei.palaces[palaceIndex]
    
    fortunes.push({
      ageStart: age,
      ageEnd: age + 9,
      palaceName: palace?.name || '',
      palaceNameCn: palace?.nameCn || '',
      majorStars: palace?.majorStars.map(s => s.nameCn).join('') || '',
      outlook: i % 3 === 0 ? 'favorable' : i % 3 === 1 ? 'moderate' : 'challenging',
      summary: `${palace?.nameCn}大运：${palace?.interpretation.summary.slice(0, 80) || ''}...`,
    })
  }
  
  return fortunes
}

function generateZiweiDeepAnalysis(ziwei: ZiweiResult) {
  return {
    lifePurpose: `Your Life Palace pattern of ${ziwei.patternCn} reveals your core life purpose and the primary lessons you are here to learn.`,
    hiddenTalents: ziwei.overallReading.strengths.map(s => `Your ${s.toLowerCase()} is a hidden talent that, when developed, brings great success.`),
    karmicPatterns: [
      'Your chart shows patterns that repeat across lifetimes — these are your karmic lessons.',
      'The position of Hua Ji (transforming star) in your chart shows where you face the greatest challenges.',
      'Working with these patterns consciously is the path to true freedom.',
    ],
    spiritualPath: 'Your spiritual path is illuminated by the stars in your Fortune Palace and Life Palace combination. Meditation, self-reflection, and service to others accelerate your growth.',
  }
}

// 易经深度报告
export function generateIChingReport(question: string, method: 'time' | 'coins' = 'time'): Record<string, any> {
  // 使用指定方法起卦
  const ichingResult = castIChing({
    question,
    method,
  }) as IChingReading
  
  return {
    basic: {
      question,
      method: ichingResult.method,
      castTime: ichingResult.castTime,
    },
    iching: {
      hexagram: ichingResult.hexagram,
      hexagramLines: ichingResult.hexagramLines,
      changingLines: ichingResult.changingLines,
      changedHexagram: ichingResult.changedHexagram,
      changedLines: ichingResult.changedLines,
      interpretation: ichingResult.interpretation,
    },
    freeReading: {
      personality: [
        `The hexagram ${ichingResult.hexagram.nameCn} reveals the current pattern of your situation.`,
        ichingResult.interpretation.summary,
      ],
      career: ichingResult.interpretation.guidance,
      relationships: ichingResult.hexagram.judgment,
      wealth: ichingResult.interpretation.timing,
      health: ichingResult.interpretation.changedHexagramMeaning || 'Maintain balance and awareness.',
    },
    premium: {
      fullInterpretation: ichingResult.interpretation,
      trigramAnalysis: generateTrigramAnalysis(ichingResult),
      lineByLine: ichingResult.hexagram.lines.map((line: any) => ({
        position: line.position,
        text: line.text,
        textCn: line.textCn,
        meaning: generateLineMeaning(line.position, ichingResult.hexagram),
      })),
      practicalAdvice: generateIChingPracticalAdvice(ichingResult),
      timingGuidance: generateIChingTiming(ichingResult),
    },
  }
}

function generateTrigramAnalysis(iching: IChingReading) {
  const upper = getTrigramById(iching.hexagram.upperTrigram)
  const lower = getTrigramById(iching.hexagram.lowerTrigram)
  
  return {
    upperTrigram: {
      name: upper?.name || '',
      nameCn: upper?.nameCn || '',
      element: upper?.element || '',
      nature: upper?.nature || '',
    },
    lowerTrigram: {
      name: lower?.name || '',
      nameCn: lower?.nameCn || '',
      element: lower?.element || '',
      nature: lower?.nature || '',
    },
    relationship: `The interaction between the ${lower?.name || ''} trigram (inner, representing the self) and the ${upper?.name || ''} trigram (outer, representing the situation) creates the dynamic of this hexagram.`,
  }
}

function getTrigramById(id: number) {
  const trigrams = [
    { id: 0, name: 'Earth', nameCn: '坤', element: 'Earth', nature: 'Receptive' },
    { id: 1, name: 'Mountain', nameCn: '艮', element: 'Earth', nature: 'Still' },
    { id: 2, name: 'Water', nameCn: '坎', element: 'Water', nature: 'Abysmal' },
    { id: 3, name: 'Wind', nameCn: '巽', element: 'Wood', nature: 'Gentle' },
    { id: 4, name: 'Thunder', nameCn: '震', element: 'Wood', nature: 'Arousing' },
    { id: 5, name: 'Fire', nameCn: '离', element: 'Fire', nature: 'Clinging' },
    { id: 6, name: 'Lake', nameCn: '兑', element: 'Metal', nature: 'Joyous' },
    { id: 7, name: 'Heaven', nameCn: '乾', element: 'Metal', nature: 'Creative' },
  ]
  return trigrams.find(t => t.id === id)
}

function generateLineMeaning(position: number, hexagram: any): string {
  const meanings = [
    'This line represents the beginning of the situation. What you do now sets the tone for everything that follows.',
    'The second line speaks of proper response and inner alignment. This is where your character is tested.',
    'The third line is the threshold of action. Tension exists between preparation and execution.',
    'The fourth line represents the outer situation. How you respond to external forces matters greatly.',
    'The fifth line is the place of leadership and fruition. This is where your efforts bear fruit.',
    'The top line represents completion and transformation. What has reached its peak must change.',
  ]
  return meanings[position - 1] || 'This line carries significant meaning for your question.'
}

function generateIChingPracticalAdvice(iching: IChingReading): string[] {
  return [
    'Reflect on the core message of this hexagram and how it applies to your specific situation.',
    'Pay attention to the changing lines — they indicate where the situation is most in flux.',
    'If the hexagram is favorable, take aligned action. If challenging, exercise patience and caution.',
    'The I Ching reveals patterns — your response to the pattern is what shapes the outcome.',
    'Return to this reading after some time and see how its wisdom has unfolded in your life.',
  ]
}

function generateIChingTiming(iching: IChingReading): {
  bestTime: string
  cautionPeriod: string
  favorableDirections: string[]
} {
  return {
    bestTime: 'The next 3-7 days are significant for this question — watch for signs and opportunities.',
    cautionPeriod: 'Be especially mindful during periods of transition — these are when mistakes are most likely.',
    favorableDirections: ['Southeast', 'South', 'East'],
  }
}

// 感情专项报告
export function generateRelationshipReport(reading: BaziResult): Record<string, any> {
  const base = generateBaziReport(reading)
  return {
    ...base,
    focus: 'relationship',
    relationship: {
      ...base.premium.relationshipDeep,
      loveTiming: generateLoveTiming(reading),
      compatibilityScores: generateCompatibilityScores(),
      karmicPatterns: [
        'You carry forward relationship patterns from past lives',
        'Your current path is about learning balance in partnership',
        'The greatest growth comes through intimate connections',
      ],
    },
  }
}

function generateLoveTiming(reading: BaziResult) {
  const currentYear = new Date().getFullYear()
  return [
    { year: currentYear, period: 'Spring', energy: 'High', note: 'Spring brings new romantic possibilities' },
    { year: currentYear + 1, period: 'Summer', energy: 'Very High', note: 'Peak romantic energy — significant meeting possible' },
    { year: currentYear + 2, period: 'Autumn', energy: 'Medium', note: 'Relationship deepening and commitment period' },
  ]
}

function generateCompatibilityScores() {
  return [
    { element: 'Wood', score: 85, description: 'Harmonious and growing partnership' },
    { element: 'Fire', score: 72, description: 'Passionate but needs balance' },
    { element: 'Earth', score: 90, description: 'Stable and supportive connection' },
    { element: 'Metal', score: 68, description: 'Challenging but growth-oriented' },
    { element: 'Water', score: 78, description: 'Deep emotional understanding' },
  ]
}

// 事业财运专项报告
export function generateCareerWealthReport(reading: BaziResult): Record<string, any> {
  const base = generateBaziReport(reading)
  return {
    ...base,
    focus: 'career_wealth',
    career: {
      ...base.premium.careerDeep,
      wealthCycles: generateWealthCycles(reading),
      careerMilestones: generateCareerMilestones(reading),
      successElements: generateSuccessElements(reading),
    },
  }
}

function generateWealthCycles(reading: BaziResult) {
  return [
    { age: '25-35', phase: 'Foundation', note: 'Building skills and resources' },
    { age: '35-45', phase: 'Growth', note: 'Career expansion and increasing income' },
    { age: '45-55', phase: 'Peak', note: 'Maximum earning potential' },
    { age: '55+', phase: 'Harvest', note: 'Wealth preservation and legacy' },
  ]
}

function generateCareerMilestones(reading: BaziResult) {
  const currentYear = new Date().getFullYear()
  return [
    { year: currentYear + 1, type: 'Opportunity', description: 'New career opening or promotion possibility' },
    { year: currentYear + 3, type: 'Transition', description: 'Career shift or major project milestone' },
    { year: currentYear + 5, type: 'Recognition', description: 'Public recognition or leadership role' },
  ]
}

function generateSuccessElements(reading: BaziResult) {
  return {
    primary: reading.dayMasterElement,
    supporting: reading.favorableElements,
    toAvoid: reading.unfavorableElements,
  }
}

// 双人合盘报告
export function generateCoupleReport(reading1: BaziResult, reading2: BaziResult): Record<string, any> {
  const compatibilityScore = calculateCompatibility(reading1, reading2)
  
  return {
    personA: {
      name: reading1.name || 'Person A',
      chart: {
        yearPillar: reading1.yearPillar,
        monthPillar: reading1.monthPillar,
        dayPillar: reading1.dayPillar,
        hourPillar: reading1.hourPillar,
      },
      dayMaster: reading1.dayMasterElement,
    },
    personB: {
      name: reading2.name || 'Person B',
      chart: {
        yearPillar: reading2.yearPillar,
        monthPillar: reading2.monthPillar,
        dayPillar: reading2.dayPillar,
        hourPillar: reading2.hourPillar,
      },
      dayMaster: reading2.dayMasterElement,
    },
    overallCompatibility: compatibilityScore,
    fiveElementsHarmony: calculateFiveElementsHarmony(reading1, reading2),
    relationshipDynamics: generateRelationshipDynamics(reading1, reading2),
    strengths: [
      'Shared values and life direction',
      'Complementary elemental profiles',
      'Mutual respect and support',
    ],
    challenges: [
      'Communication style differences',
      'Balancing individual needs with partnership',
      'Managing expectations during challenging periods',
    ],
    timing: {
      favorablePeriods: ['Spring and summer seasons', 'Years ending in 4, 5, 9'],
      challengingPeriods: ['Transitions between seasons', 'Years ending in 0, 1'],
    },
    advice: 'The most harmonious relationships are built on understanding and mutual respect for each other nature. Work with your differences rather than against them.',
  }
}

function calculateCompatibility(reading1: BaziResult, reading2: BaziResult): number {
  // 简化的合婚计算
  let score = 75 // 基础分
  
  // 五行互补加分
  const e1 = reading1.fiveElements
  const e2 = reading2.fiveElements
  
  const elementKeys = ['wood', 'fire', 'earth', 'metal', 'water'] as const
  for (const el of elementKeys) {
    const diff = Math.abs(e1[el] - e2[el])
    if (diff > 10) score += 2 // 互补
    if (diff < 3) score += 1  // 共鸣
  }
  
  return Math.min(Math.round(score), 98)
}

function calculateFiveElementsHarmony(reading1: BaziResult, reading2: BaziResult) {
  const combined = {
    wood: reading1.fiveElements.wood + reading2.fiveElements.wood,
    fire: reading1.fiveElements.fire + reading2.fiveElements.fire,
    earth: reading1.fiveElements.earth + reading2.fiveElements.earth,
    metal: reading1.fiveElements.metal + reading2.fiveElements.metal,
    water: reading1.fiveElements.water + reading2.fiveElements.water,
  }
  
  const total = Object.values(combined).reduce((a, b) => a + b, 0)
  const balanced = total / 5
  const variance = Object.values(combined).reduce((sum, val) => sum + Math.pow(val - balanced, 2), 0) / 5
  const harmonyScore = Math.round(100 - Math.sqrt(variance) * 2)
  
  return {
    combined,
    harmonyScore: Math.max(50, Math.min(100, harmonyScore)),
    verdict: harmonyScore > 80 ? 'Highly Harmonious' : harmonyScore > 65 ? 'Generally Harmonious' : 'Needs Work',
  }
}

function generateRelationshipDynamics(reading1: BaziResult, reading2: BaziResult) {
  return {
    energyPattern: `${reading1.dayMasterElement} meets ${reading2.dayMasterElement} — a dance of complementary energies.`,
    communicationStyle: 'You communicate through different channels but can learn each other languages.',
    emotionalConnection: 'Deep emotional understanding grows over time as trust builds.',
    growthAreas: 'Your relationship challenges each of you to grow in ways you would not alone.',
  }
}

// 通用报告生成入口
export function generateReport(
  reportType: ReportType,
  inputData: Record<string, any>,
  baziResult?: BaziResult
): Record<string, any> {
  switch (reportType) {
    case 'bazi':
      return generateBaziReport(baziResult || inputData.reading)
    case 'ziwei':
      return generateZiweiReport(inputData)
    case 'iching':
      return generateIChingReport(inputData.question, inputData.method || 'time')
    case 'relationship':
      return generateRelationshipReport(baziResult || inputData.reading)
    case 'career':
      return generateCareerWealthReport(baziResult || inputData.reading)
    case 'compatibility':
      return generateCoupleReport(inputData.reading1, inputData.reading2)
    default:
      return generateBaziReport(baziResult || inputData.reading)
  }
}
