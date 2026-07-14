/**
 * 八字排盘算法测试
 * 运行: npx tsx src/lib/bazi-calculator.test.ts
 */

import { calculateBazi, generateFreeReading } from './bazi-calculator'
import { solarToLunar, getYearPillar, getMonthPillar, getDayPillar, getHourPillar } from './lunar-calendar'

console.log('=== 八字排盘算法测试 ===\n')

// 测试1: 农历转换
console.log('1. 农历转换测试:')
const testDate = new Date(1990, 0, 15, 12, 30) // 1990年1月15日 12:30
const lunar = solarToLunar(testDate)
console.log(`   阳历: 1990-01-15`)
console.log(`   农历: ${lunar.year}年${lunar.month}月${lunar.day}日 ${lunar.isLeap ? '(闰)' : ''}`)
console.log(`   生肖: ${lunar.zodiacCn} (${lunar.zodiac})`)
console.log(`   年柱: ${lunar.yearStem} ${lunar.yearBranch}`)

// 测试2: 日柱计算
console.log('\n2. 日柱测试 (基准验证):')
const baseDate = new Date(2000, 0, 1) // 2000年1月1日 = 戊午日
const dayPillar = getDayPillar(baseDate)
console.log(`   2000-01-01 日柱: ${dayPillar.stem} ${dayPillar.branch} (应为: 4 6 = 戊午)`)

// 测试3: 完整八字排盘
console.log('\n3. 完整八字排盘测试:')
const bazi = calculateBazi({
  name: '测试',
  gender: 'male',
  birthDate: new Date(1990, 0, 15, 12, 30),
  birthPlace: 'Beijing',
  longitude: 116.4,
})

console.log(`   年柱: ${bazi.yearPillar.stemCn}${bazi.yearPillar.branchCn} (${bazi.yearPillar.stemPinyin} ${bazi.yearPillar.branchPinyin})`)
console.log(`   月柱: ${bazi.monthPillar.stemCn}${bazi.monthPillar.branchCn} (${bazi.monthPillar.stemPinyin} ${bazi.monthPillar.branchPinyin})`)
console.log(`   日柱: ${bazi.dayPillar.stemCn}${bazi.dayPillar.branchCn} (${bazi.dayPillar.stemPinyin} ${bazi.dayPillar.branchPinyin}) - 日主`)
console.log(`   时柱: ${bazi.hourPillar.stemCn}${bazi.hourPillar.branchCn} (${bazi.hourPillar.stemPinyin} ${bazi.hourPillar.branchPinyin})`)

console.log(`\n   日主五行: ${bazi.dayMasterCn} (${bazi.dayMasterElement})`)
console.log(`   日主强弱: ${bazi.dayMasterStrength} (score: ${bazi.dayMasterStrengthScore})`)
console.log(`   喜用神: ${bazi.favorableElementsCn.join('、')} (${bazi.favorableElements.join(', ')})`)
console.log(`   忌神: ${bazi.unfavorableElementsCn.join('、')} (${bazi.unfavorableElements.join(', ')})`)
console.log(`   年命纳音: ${bazi.naYinYearCn} (${bazi.naYinYear})`)
console.log(`   时辰: ${bazi.shichen} (${bazi.shichenPinyin}) ${bazi.shichenRange}`)

// 测试4: 五行分布
console.log('\n4. 五行分布:')
bazi.fiveElements.forEach(e => {
  console.log(`   ${e.elementCn} ${e.element}: ${e.count} (${e.percentage}%)`)
})

// 测试5: 十神
console.log('\n5. 十神:')
console.log(`   年干十神: ${bazi.yearPillar.stemTenGodCn} (${bazi.yearPillar.stemTenGod})`)
console.log(`   月干十神: ${bazi.monthPillar.stemTenGodCn} (${bazi.monthPillar.stemTenGod})`)
console.log(`   时干十神: ${bazi.hourPillar.stemTenGodCn} (${bazi.hourPillar.stemTenGod})`)

// 测试6: 藏干
console.log('\n6. 藏干:')
console.log(`   月支藏干: ${bazi.monthPillar.hiddenStemsCn.join('、')}`)
console.log(`   日支藏干: ${bazi.dayPillar.hiddenStemsCn.join('、')}`)

// 测试7: 大运
console.log('\n7. 大运 (前5步):')
bazi.greatFortunes.slice(0, 5).forEach(f => {
  console.log(`   ${f.age}岁 (${f.year}年): ${f.stemCn}${f.branchCn} - ${f.stemTenGodCn}/${f.branchTenGodCn}`)
})

// 测试8: 免费解读
console.log('\n8. 免费解读 (性格特点):')
const reading = generateFreeReading(bazi)
reading.personality.forEach((t, i) => {
  console.log(`   ${i + 1}. ${t}`)
})

console.log('\n=== 测试完成 ===')
