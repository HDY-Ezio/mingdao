import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DiagonalBackground } from '@/components/layout/diagonal-background'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meet the Daoist practitioners behind Mingdao. Rooted in Wudang tradition, bringing ancient wisdom to the modern world.',
}

const values = [
  {
    title: 'Authenticity',
    description:
      'We honor the traditions that have been passed down for millennia. Every calculation follows classical methods.',
    icon: 'authenticity',
  },
  {
    title: 'Clarity',
    description:
      'Ancient wisdom should be accessible. We translate complex metaphysics into meaningful, practical guidance.',
    icon: 'clarity',
  },
  {
    title: 'Reverence',
    description:
      'We approach these arts with deep respect. This is not entertainment — it is a tool for self-understanding and growth.',
    icon: 'reverence',
  },
]

const timeline = [
  {
    year: '2018',
    title: 'The Beginning',
    description:
      'Master Chen leaves Wudang Mountain with a mission — to make Eastern wisdom accessible to seekers worldwide.',
  },
  {
    year: '2020',
    title: 'Digital Teachings',
    description:
      'Online courses and readings reach thousands of students across 40+ countries.',
  },
  {
    year: '2022',
    title: 'Mingdao Academy',
    description:
      'A small team of practitioners and technologists comes together to build the Mingdao platform.',
  },
  {
    year: '2024',
    title: 'The Vision',
    description:
      'Mingdao launches — bridging 3,000 years of tradition with modern AI, bringing destiny guidance to everyone.',
  },
]

export default function AboutPage() {
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
          <span className="eyebrow text-gold-700 mb-4 block">About Mingdao</span>
          <h1 className="heading-h1 text-ink-900 mb-6">
            Bridging Ancient Wisdom and Modern Life
          </h1>
          <p className="text-lg text-ink-600 leading-relaxed max-w-2xl mx-auto">
            We are a small team of Daoist practitioners, scholars, and technologists
            dedicated to making the profound wisdom of Chinese metaphysics accessible,
            meaningful, and relevant for today\'s world.
          </p>
        </div>
      </section>

      {/* Founder / Daoist Master Section */}
      <section className="py-16 md:py-24 bg-paper-warm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Portrait placeholder */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-ink-200 to-ink-100 relative overflow-hidden">
                {/* Decorative frame */}
                <div className="absolute inset-4 border border-gold-300/30 rounded-xl" />
                <div className="absolute inset-8 border border-gold-300/20 rounded-lg" />
                
                {/* Silhouette / placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-ink-300/40 flex items-center justify-center mb-4">
                    <svg className="w-16 h-16 text-ink-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="seal-stamp text-sm">
                    道
                  </div>
                </div>

                {/* Mountain silhouette at bottom */}
                <svg
                  className="absolute bottom-0 left-0 right-0 w-full h-24 text-ink-400/20"
                  viewBox="0 0 400 100"
                  preserveAspectRatio="none"
                  fill="currentColor"
                >
                  <path d="M0,100 L0,70 L50,40 L80,60 L120,20 L160,50 L200,30 L240,55 L280,25 L320,45 L360,35 L400,65 L400,100 Z" />
                </svg>
              </div>

              {/* Floating info card */}
              <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 bg-white rounded-xl shadow-ink-lg p-5 border border-ink-100 max-w-[200px]">
                <p className="text-xs text-gold-700 font-medium mb-1">Wudang Mountain</p>
                <p className="font-serif text-ink-900">Hubei, China</p>
                <p className="text-xs text-ink-500 mt-1">Birthplace of Tai Chi</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="eyebrow text-gold-700 mb-4 block">Our Founder</span>
              <h2 className="heading-h2 text-ink-900 mb-2">
                Master Chen Qingxuan
              </h2>
              <p className="text-lg text-ink-500 font-serif italic mb-6">
                陈清玄 · 32nd Generation Wudang Daoist
              </p>
              
              <div className="space-y-4 text-ink-600 leading-relaxed">
                <p>
                  Born at the foothills of Wudang Mountain, Master Chen grew up immersed in
                  Daoist tradition. At 12, he formally entered the Wudang Daoist Monastery,
                  studying under the 31st generation lineage of the Dragon Gate sect.
                </p>
                <p>
                  For over fifteen years, he trained in Bazi, Purple Star Astrology,
                  I Ching divination, Feng Shui, and traditional Daoist medicine. But he
                  also witnessed how these profound arts remained hidden from the modern world.
                </p>
                <p>
                  Mingdao is his vision — to bring the wisdom of the ancients to seekers
                  everywhere, with respect for tradition and clarity for today\'s world.
                  "The Dao is everywhere," he often says. "It just needs to be spoken in
                  a language people can understand."
                </p>
              </div>

              <div className="mt-8 flex items-center gap-6">
                <div>
                  <p className="font-serif text-2xl font-semibold text-ink-900">15+</p>
                  <p className="text-sm text-ink-500">Years of Practice</p>
                </div>
                <div className="w-px h-12 bg-ink-200" />
                <div>
                  <p className="font-serif text-2xl font-semibold text-ink-900">32nd</p>
                  <p className="text-sm text-ink-500">Generation</p>
                </div>
                <div className="w-px h-12 bg-ink-200" />
                <div>
                  <p className="font-serif text-2xl font-semibold text-ink-900">50K+</p>
                  <p className="text-sm text-ink-500">Students Worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="eyebrow text-gold-700 mb-4 block">Our Values</span>
            <h2 className="heading-h2 text-ink-900 mb-4">
              What Guides Us
            </h2>
            <p className="text-ink-600 leading-relaxed">
              Three principles shape everything we do at Mingdao.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="text-center p-8 rounded-2xl bg-white/60 border border-ink-100 hover:shadow-ink transition-shadow"
              >
                <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-gold-100/80 flex items-center justify-center">
                  <ValueIcon name={value.icon} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-ink-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-ink-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 constellation-pattern opacity-10" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="eyebrow text-gold-400 mb-4 block">Our Journey</span>
            <h2 className="heading-h2">From Mountain to the World</h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-ink-700" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gold-500 border-4 border-ink-900 z-10" />
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                    index % 2 === 0 ? 'md:text-right' : 'md:text-left md:ml-auto'
                  }`}>
                    <span className="font-serif text-gold-400 text-sm tracking-wider">
                      {item.year}
                    </span>
                    <h3 className="font-serif text-xl font-semibold mt-1 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-ink-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-paper-warm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-h2 text-ink-900 mb-6">
            Begin Your Journey
          </h2>
          <p className="text-ink-600 mb-10 leading-relaxed">
            Whether you\'re curious about your life path or seeking guidance for a
            specific question, we\'re here to help you find clarity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/services">
              <Button variant="gold" size="lg">
                Explore Services
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" size="lg">
                Read the Journal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function ValueIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    authenticity: (
      <svg className="w-7 h-7 text-gold-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    clarity: (
      <svg className="w-7 h-7 text-gold-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    reverence: (
      <svg className="w-7 h-7 text-gold-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  }
  return icons[name] || icons.authenticity
}
