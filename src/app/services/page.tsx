import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DiagonalBackground } from '@/components/layout/diagonal-background'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore our destiny reading services — Bazi, Purple Star Astrology, and I Ching divination.',
}

const services = [
  {
    id: 'bazi',
    name: 'Bazi Reading',
    nameChinese: '八字',
    tagline: 'The Four Pillars of Destiny',
    description:
      'Your birth date and time reveal a unique blueprint of your life. Bazi (八字) maps the five elements and ten heavenly stems across four pillars — year, month, day, and hour — to uncover your inherent nature, strengths, challenges, and life patterns.',
    features: [
      'Complete four-pillar chart calculation',
      'Five elements balance assessment',
      'Ten-year major luck cycles analysis',
      'Career, relationship, and health insights',
      'Favorable elements and directions',
    ],
    price: '$29',
    duration: '~15 min reading',
    accent: 'gold',
  },
  {
    id: 'purple-star',
    name: 'Purple Star Astrology',
    nameChinese: '紫微斗数',
    tagline: 'Zi Wei Dou Shu',
    description:
      'Often called the "emperor\'s astrology," Purple Star Astrology maps your destiny across twelve life palaces. From career and wealth to relationships and spiritual growth, each palace reveals a dimension of your life\'s journey.',
    features: [
      'Full twelve-palace birth chart',
      'Major and auxiliary star combinations',
      'Ten-year and annual fortune periods',
      'Palace-by-palace detailed analysis',
      'Life direction and potential insights',
    ],
    price: '$39',
    duration: '~20 min reading',
    accent: 'cinnabar',
  },
  {
    id: 'i-ching',
    name: 'I Ching Divination',
    nameChinese: '易经',
    tagline: 'The Book of Changes',
    description:
      'The oldest of the Chinese classics, the I Ching offers guidance through the 64 hexagrams. Ask a question, cast your reading, and receive timeless wisdom that speaks to your current situation and the path ahead.',
    features: [
      'Interactive coin-method casting',
      'Full hexagram interpretation',
      'Changing lines analysis',
      'Practical guidance and reflection prompts',
      'Unlimited readings with account',
    ],
    price: '$19',
    duration: 'Instant',
    accent: 'jade',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <DiagonalBackground
          className="absolute inset-0"
          constellationOpacity={0.1}
          symbolOpacity={0.06}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow text-gold-700 mb-4 block">Our Services</span>
          <h1 className="heading-h1 text-ink-900 mb-6">
            Three Paths, One Journey
          </h1>
          <p className="text-lg text-ink-600 leading-relaxed max-w-2xl mx-auto">
            Each tradition offers a unique perspective on your life.
            Begin with one that calls to you, or combine all three for the fullest picture.
          </p>
        </div>
      </section>

      {/* Services detail */}
      <section className="py-16 md:py-24 bg-paper-warm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              {/* Visual */}
              <div className="relative">
                <ServiceVisual service={service} index={index} />
              </div>

              {/* Content */}
              <div>
                <span className={`eyebrow text-${service.accent}-700 mb-3 block`}>
                  {service.tagline}
                </span>
                <div className="flex items-baseline gap-3 mb-4">
                  <h2 className="heading-h2 text-ink-900">{service.name}</h2>
                  <span className="text-2xl font-serif text-ink-400">{service.nameChinese}</span>
                </div>
                <p className="text-ink-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                <ul className="space-y-2.5 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-ink-700">
                      <svg
                        className={`w-5 h-5 text-${service.accent}-500 mt-0.5 flex-shrink-0`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="font-serif text-3xl font-semibold text-ink-900">
                      {service.price}
                    </span>
                    <span className="text-sm text-ink-500 ml-2">{service.duration}</span>
                  </div>
                  <Link href="/register">
                    <Button variant={service.accent === 'gold' ? 'gold' : 'ink'} size="md">
                      Begin Reading
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 constellation-pattern opacity-15" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-h2 mb-6">
            Not sure where to begin?
          </h2>
          <p className="text-ink-300 mb-10 leading-relaxed">
            Start with a Bazi reading — it\'s the most foundational and provides
            the clearest picture of your overall life pattern.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="gold" size="lg">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="border-ink-600 text-ink-200 hover:bg-ink-800 hover:border-ink-500">
                Learn Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function ServiceVisual({ service, index }: { service: typeof services[number]; index: number }) {
  const accentColors: Record<string, { from: string; to: string; light: string }> = {
    gold: { from: 'from-gold-500', to: 'to-gold-700', light: 'bg-gold-50' },
    cinnabar: { from: 'from-cinnabar-500', to: 'to-cinnabar-700', light: 'bg-cinnabar-50' },
    jade: { from: 'from-jade-500', to: 'to-jade-700', light: 'bg-jade-50' },
  }
  const colors = accentColors[service.accent]

  return (
    <div className={`relative aspect-[4/3] rounded-2xl ${colors.light} overflow-hidden`}>
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br ${colors.from} ${colors.to} opacity-10`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-br ${colors.from} ${colors.to} opacity-15`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br ${colors.from} ${colors.to} opacity-20`} />
      </div>

      {/* Center icon / chart placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center shadow-lg`}>
            <ServiceIcon name={service.id} />
          </div>
          <p className="font-serif text-2xl text-ink-800">{service.nameChinese}</p>
          <p className="text-sm text-ink-500 mt-1">{service.tagline}</p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-current opacity-20" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-current opacity-20" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-current opacity-20" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-current opacity-20" />
    </div>
  )
}

function ServiceIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    bazi: (
      <svg className="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="6" y="6" width="16" height="16" rx="2" />
        <rect x="26" y="6" width="16" height="16" rx="2" />
        <rect x="6" y="26" width="16" height="16" rx="2" />
        <rect x="26" y="26" width="16" height="16" rx="2" />
      </svg>
    ),
    'purple-star': (
      <svg className="w-12 h-12 text-white" viewBox="0 0 48 48" fill="currentColor">
        <path d="M24 4l4.5 12.5H42l-10.5 7 4 13L24 29.5 12.5 36.5l4-13L6 16.5h13.5L24 4z" />
      </svg>
    ),
    'i-ching': (
      <svg className="w-12 h-12 text-white" viewBox="0 0 48 48" fill="currentColor">
        <rect x="8" y="6" width="32" height="4" rx="2" />
        <rect x="8" y="14" width="14" height="4" rx="2" />
        <rect x="26" y="14" width="14" height="4" rx="2" />
        <rect x="8" y="22" width="32" height="4" rx="2" />
        <rect x="8" y="30" width="14" height="4" rx="2" />
        <rect x="26" y="30" width="14" height="4" rx="2" />
        <rect x="8" y="38" width="32" height="4" rx="2" />
      </svg>
    ),
  }
  return icons[name] || icons.bazi
}
