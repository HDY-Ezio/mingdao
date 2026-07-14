import type { Metadata } from 'next'
import Link from 'next/link'
import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { Button } from '@/components/ui/button'
import { FOUR_SYMBOLS, TWENTY_EIGHT_MANSIONS, getDailyMansion } from '@/lib/star-calendar'
import { Star, Sparkles, Sun, Moon, Compass, Eye, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Celestial Observatory · 观星台',
  description:
    'Explore the 28 Lunar Mansions (二十八星宿), Seven Governors (七政), and Four Remainders (四余) of Chinese astronomy. Discover how celestial patterns shape destiny readings.',
  keywords: [
    '28 lunar mansions',
    '二十八星宿',
    'seven governors',
    '七政四余',
    'Chinese astrology',
    'celestial observation',
    'Zi Wei Dou Shu',
    '紫微斗数',
  ],
}

// 七政四余详细数据
const SEVEN_GOVERNORS = [
  {
    name: 'Sun',
    nameCn: '日',
    planet: 'Sun',
    element: 'Fire',
    elementCn: '火',
    nature: 'Yang',
    natureCn: '阳',
    governs: 'Essence & Vitality',
    governsCn: '主精华',
    description: 'The Sun is the sovereign of the heavens, representing consciousness, willpower, and life force.',
    descriptionCn: '太阳为众星之主，主精华、权贵、显达，象征人的意志与生命力。',
    color: '#e6a23c',
  },
  {
    name: 'Moon',
    nameCn: '月',
    planet: 'Moon',
    element: 'Water',
    elementCn: '水',
    nature: 'Yin',
    natureCn: '阴',
    governs: 'Spirit & Emotions',
    governsCn: '主精神',
    description: 'The Moon governs the inner world — emotions, intuition, dreams, and the subconscious mind.',
    descriptionCn: '太阴为身主，主精神、情绪、感受，象征人的内心世界与直觉。',
    color: '#b8a87a',
  },
  {
    name: 'Mercury',
    nameCn: '水星',
    planet: 'Mercury',
    element: 'Water',
    elementCn: '水',
    nature: 'Yang',
    natureCn: '阳',
    governs: 'Intelligence & Communication',
    governsCn: '主智慧',
    description: 'Mercury governs intellect, eloquence, adaptability, and the power of expression.',
    descriptionCn: '水星主智慧、口才、机变，象征人的思维能力与沟通表达。',
    color: '#6b9bd1',
  },
  {
    name: 'Venus',
    nameCn: '金星',
    planet: 'Venus',
    element: 'Metal',
    elementCn: '金',
    nature: 'Yin',
    natureCn: '阴',
    governs: 'Beauty & Relationships',
    governsCn: '主美色',
    description: 'Venus governs love, beauty, art, harmony, and all matters of the heart.',
    descriptionCn: '金星主美色、爱情、艺术、和谐，象征人的审美与感情世界。',
    color: '#d4a5b4',
  },
  {
    name: 'Mars',
    nameCn: '火星',
    planet: 'Mars',
    element: 'Fire',
    elementCn: '火',
    nature: 'Yang',
    natureCn: '阳',
    governs: 'Courage & Action',
    governsCn: '主勇猛',
    description: 'Mars governs courage, energy, ambition, and the drive to take action.',
    descriptionCn: '火星主勇猛、行动力、野心，象征人的勇气与进取精神。',
    color: '#c45a3c',
  },
  {
    name: 'Jupiter',
    nameCn: '木星',
    planet: 'Jupiter',
    element: 'Wood',
    elementCn: '木',
    nature: 'Yang',
    natureCn: '阳',
    governs: 'Growth & Expansion',
    governsCn: '主生长',
    description: 'Jupiter is the planet of expansion, wisdom, benevolence, and spiritual growth.',
    descriptionCn: '木星主生长、扩张、仁慈、智慧，象征人的成长与福气。',
    color: '#7aa86b',
  },
  {
    name: 'Saturn',
    nameCn: '土星',
    planet: 'Saturn',
    element: 'Earth',
    elementCn: '土',
    nature: 'Yin',
    natureCn: '阴',
    governs: 'Discipline & Structure',
    governsCn: '主稳重',
    description: 'Saturn governs discipline, responsibility, structure, and the lessons of time.',
    descriptionCn: '土星主稳重、责任、结构、考验，象征人的定力与人生课题。',
    color: '#a08b5c',
  },
]

const FOUR_REMAINDERS = [
  {
    name: 'Rahu',
    nameCn: '罗睺',
    nature: 'Malefic Yang',
    natureCn: '阳煞',
    meaning: 'North Node of the Moon — sudden changes, obsession, hidden forces',
    meaningCn: '月之北交，主突变、执念、暗昧之力',
    color: '#6b4a7a',
  },
  {
    name: 'Ketu',
    nameCn: '计都',
    nature: 'Malefic Yin',
    natureCn: '阴煞',
    meaning: 'South Node of the Moon — endings, spirituality, karmic patterns',
    meaningCn: '月之南交，主终结、灵性、业力模式',
    color: '#4a5a6b',
  },
  {
    name: 'Uranus',
    nameCn: '紫气',
    nature: 'Benefic Yin',
    natureCn: '阴德',
    meaning: 'Purple Qi — hidden virtues, spiritual protection, unexpected blessings',
    meaningCn: '紫气，主阴德、贵气、意外之福',
    color: '#8b7cc4',
  },
  {
    name: 'Neptune',
    nameCn: '月孛',
    nature: 'Malefic Neutral',
    natureCn: '中性煞',
    meaning: 'Comet tail — confusion, illusion, but also artistic inspiration',
    meaningCn: '月孛，主迷惑、幻觉，亦主艺术灵感',
    color: '#7ca8c4',
  },
]

// 获取今日值日星宿
const todayMansion = getDailyMansion()

export default function ObservatoryPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <DiagonalBackground
          className="absolute inset-0"
          constellationOpacity={0.2}
          symbolOpacity={0.08}
          showStars={true}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow text-gold-700 mb-4 block">Celestial Observatory</span>
          <h1 className="heading-h1 text-ink-900 mb-4">
            观星台
          </h1>
          <p className="text-sm text-ink-500 tracking-widest uppercase mb-6">
            The Heavens Reveal the Way
          </p>
          <p className="text-lg text-ink-600 leading-relaxed max-w-2xl mx-auto">
            For thousands of years, Chinese astronomers and metaphysicians have mapped the
            celestial sphere, observing how the movements of stars and planets echo patterns
            in human life. Welcome to the observatory.
          </p>
        </div>
      </section>

      {/* Today's Mansion */}
      <section className="relative py-16 bg-ink-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(230, 162, 60, 0.15) 0%, transparent 50%),
                              radial-gradient(circle at 80% 70%, rgba(107, 155, 209, 0.1) 0%, transparent 50%)`,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-gold-500/40 flex items-center justify-center relative">
                <div className="absolute inset-2 rounded-full border border-gold-500/20" />
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-serif text-gold-400 mb-1">
                    {todayMansion.chinese}
                  </div>
                  <div className="text-xs text-gold-300/70 tracking-widest uppercase">
                    {todayMansion.name}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/20 rounded-full text-gold-300 text-xs mb-3">
                <Star className="w-3.5 h-3.5" />
                Today's Mansion · 今日值日
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-3">
                {todayMansion.name} Mansion — 第{todayMansion.number}宿
              </h2>
              <p className="text-ink-300 leading-relaxed mb-4">
                The <strong className="text-gold-300">{todayMansion.name}</strong> mansion governs today's celestial energy.
                In traditional Chinese astrology, each of the 28 mansions carries a unique
                quality that influences events, decisions, and the flow of qi on its day.
              </p>
              <p className="text-sm text-ink-400 font-serif italic">
                "The stars move in their courses; all things come to pass." — <span className="text-gold-300">Book of Changes</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 28 Mansions Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow text-jade-700 mb-3 block">28 Lunar Mansions</span>
            <h2 className="heading-h2 text-ink-900 mb-4">
              二十八星宿
            </h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              The 28 mansions are the constellations along the ecliptic, divided into four groups
              — each governed by one of the Four Celestial Animals. They serve as the celestial
              coordinate system for Chinese astronomy and astrology.
            </p>
          </div>

          {/* Four Symbols Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {Object.entries(FOUR_SYMBOLS).map(([key, symbol]) => (
              <div
                key={key}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/60 shadow-ink-sm p-6 md:p-8 hover:shadow-ink-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${symbol.color}15` }}
                  >
                    <Compass
                      className="w-7 h-7"
                      style={{ color: symbol.color }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-serif font-semibold text-ink-900">
                        {symbol.chineseName}
                      </h3>
                      <span className="text-sm text-ink-500">{symbol.name}</span>
                    </div>
                    <p className="text-sm text-ink-500">
                      {symbol.direction} · {symbol.season}
                    </p>
                  </div>
                </div>

                {/* 7 Mansions */}
                <div className="grid grid-cols-7 gap-2">
                  {symbol.mansions.map((mansionName, i) => {
                    const mansion = TWENTY_EIGHT_MANSIONS.find(m => m.name === mansionName)
                    return mansion ? (
                      <div
                        key={mansion.name}
                        className="text-center group cursor-pointer"
                        title={`${mansion.name} - ${mansion.meaning}`}
                      >
                        <div
                          className="w-full aspect-square rounded-lg flex items-center justify-center text-lg font-serif mb-1 transition-all group-hover:scale-110"
                          style={{
                            backgroundColor: `${symbol.color}10`,
                            color: symbol.color,
                          }}
                        >
                          {mansion.chinese}
                        </div>
                        <div className="text-[10px] text-ink-400 truncate">
                          {mansion.name}
                        </div>
                      </div>
                    ) : null
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-ink-100">
                  <p className="text-sm text-ink-600 leading-relaxed">
                    The {symbol.name} presides over the {symbol.direction.toLowerCase()} sky and
                    governs the {symbol.season.toLowerCase()} season. Its seven mansions
                    together form a complete celestial palace.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Full Mansion List */}
          <div className="bg-paper/50 rounded-2xl border border-ink-200/60 p-6 md:p-8">
            <h3 className="text-lg font-serif font-semibold text-ink-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold-500" />
              All 28 Mansions · 二十八宿详解
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {TWENTY_EIGHT_MANSIONS.map((mansion) => {
                const symbolKey = mansion.symbol as keyof typeof FOUR_SYMBOLS
                const symbol = FOUR_SYMBOLS[symbolKey]
                return (
                  <div
                    key={mansion.name}
                    className="group bg-white rounded-xl border border-ink-200/60 p-3 text-center hover:border-gold-300 hover:shadow-sm transition-all"
                  >
                    <div
                      className="text-2xl font-serif mb-1"
                      style={{ color: symbol.color }}
                    >
                      {mansion.chinese}
                    </div>
                    <div className="text-[11px] font-medium text-ink-700 mb-0.5">
                      {mansion.name}
                    </div>
                    <div className="text-[10px] text-ink-400">
                      #{mansion.number}
                    </div>
                    <div className="text-[10px] text-ink-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {mansion.meaning}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Seven Governors Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-paper to-ink-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow text-cinnabar-700 mb-3 block">Seven Governors</span>
            <h2 className="heading-h2 text-ink-900 mb-4">
              七政四余
            </h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              The Seven Governors (七政) are the classical planets of Chinese astronomy —
              Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn.
              The Four Remainders (四余) are the shadow planets and invisible forces that
              complete the celestial picture.
            </p>
          </div>

          {/* Seven Governors */}
          <div className="mb-16">
            <h3 className="text-lg font-serif font-semibold text-ink-900 mb-6 flex items-center gap-2">
              <Sun className="w-5 h-5 text-gold-500" />
              The Seven Governors · 七政
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SEVEN_GOVERNORS.map((gov) => (
                <div
                  key={gov.name}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-ink-200/60 p-5 hover:shadow-ink-md transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${gov.color}20` }}
                  >
                    {gov.name === 'Sun' ? (
                      <Sun className="w-6 h-6" style={{ color: gov.color }} />
                    ) : gov.name === 'Moon' ? (
                      <Moon className="w-6 h-6" style={{ color: gov.color }} />
                    ) : (
                      <Star className="w-6 h-6" style={{ color: gov.color }} />
                    )}
                  </div>
                  <div className="mb-2">
                    <span className="text-xl font-serif text-ink-900 mr-2">
                      {gov.nameCn}
                    </span>
                    <span className="text-sm text-ink-500">{gov.name}</span>
                  </div>
                  <div className="text-xs text-ink-400 mb-3 space-x-2">
                    <span>· {gov.elementCn} {gov.element}</span>
                    <span>· {gov.natureCn}</span>
                  </div>
                  <p className="text-sm text-ink-600 leading-relaxed mb-3">
                    {gov.description}
                  </p>
                  <div className="pt-3 border-t border-ink-100">
                    <p className="text-xs text-ink-500">
                      <span className="text-gold-600 font-medium">Governs:</span>{' '}
                      {gov.governs}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Four Remainders */}
          <div>
            <h3 className="text-lg font-serif font-semibold text-ink-900 mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-jade-600" />
              The Four Remainders · 四余
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FOUR_REMAINDERS.map((rem) => (
                <div
                  key={rem.name}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl border border-ink-200/60 p-5 hover:shadow-ink-md transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${rem.color}20` }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: rem.color }} />
                  </div>
                  <div className="mb-2">
                    <span className="text-lg font-serif text-ink-900 mr-2">
                      {rem.nameCn}
                    </span>
                    <span className="text-sm text-ink-500">{rem.name}</span>
                  </div>
                  <div className="text-xs text-ink-400 mb-2">
                    {rem.natureCn} · {rem.nature}
                  </div>
                  <p className="text-sm text-ink-600 leading-relaxed">
                    {rem.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-ink-900 to-ink-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  radial-gradient(2px 2px at 20px 30px, #e6a23c, transparent),
                  radial-gradient(2px 2px at 40px 70px, #6b9bd1, transparent),
                  radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                  radial-gradient(2px 2px at 160px 120px, #b8942f, transparent),
                  radial-gradient(1px 1px at 200px 90px, #fff, transparent),
                  radial-gradient(2px 2px at 250px 50px, #d4a5b4, transparent)
                `,
                backgroundSize: '300px 200px',
              }}
            />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-center">
                The Art of Celestial Reading
              </h2>
              <div className="space-y-4 text-ink-200 leading-relaxed">
                <p>
                  Chinese celestial observation is far more than astronomy — it is a complete
                  system of correspondence between heaven and humanity. As above, so below.
                  The movements of the stars reflect the currents of destiny.
                </p>
                <p>
                  In <strong className="text-gold-300">Zi Wei Dou Shu</strong> (紫微斗数),
                  the Purple Star system, an entire destiny chart is mapped across twelve
                  palaces, each containing stars and planets that reveal different facets
                  of a person's life path — from career and wealth to relationships and
                  spiritual growth.
                </p>
                <p className="text-gold-200/90 font-serif italic text-center pt-4">
                  "Heaven's net is vast; though its meshes are wide, nothing slips through."
                </p>
                <p className="text-center text-ink-400 text-sm">
                  — Laozi, Dao De Jing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-h2 text-ink-900 mb-4">
            Discover Your Celestial Blueprint
          </h2>
          <p className="text-ink-600 mb-8 max-w-xl mx-auto">
            Generate your complete Zi Wei Dou Shu chart and discover how the stars
            were arranged at the moment of your birth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reports/ziwei_full">
              <Button variant="gold" size="lg">
                Generate Zi Wei Chart
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/reports/iching_deep">
              <Button variant="outline" size="lg">
                Consult the I Ching
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
