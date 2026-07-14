import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const services = [
  {
    id: 'bazi',
    name: 'Bazi Reading',
    nameChinese: '八字',
    tagline: 'The Four Pillars of Destiny',
    description:
      'Uncover the blueprint of your life through your birth date and time. Bazi reveals your elemental composition, strengths, challenges, and the patterns that shape your journey.',
    features: [
      'Personalized life chart analysis',
      'Five elements balance assessment',
      'Ten-year luck cycles',
      'Career & relationship insights',
    ],
    icon: 'bazi',
    accent: 'from-gold-500 to-gold-600',
    bgAccent: 'bg-gold-50',
    borderAccent: 'border-gold-200/50',
  },
  {
    id: 'purple-star',
    name: 'Purple Star Astrology',
    nameChinese: '紫微斗数',
    tagline: 'Zi Wei Dou Shu',
    description:
      'Explore the cosmic map of your destiny. Purple Star Astrology maps your life across twelve palaces, offering profound insights into personality, fortune, and life events.',
    features: [
      'Complete twelve-palace chart',
      'Star combinations & interactions',
      'Major life periods analysis',
      'Annual fortune forecasting',
    ],
    icon: 'star',
    accent: 'from-cinnabar-500 to-cinnabar-600',
    bgAccent: 'bg-cinnabar-50',
    borderAccent: 'border-cinnabar-200/50',
  },
  {
    id: 'i-ching',
    name: 'I Ching Divination',
    nameChinese: '易经',
    tagline: 'The Book of Changes',
    description:
      'Seek guidance from the ancient oracle. Ask a question, cast your hexagram, and receive timeless wisdom from the 64 hexagrams of the I Ching.',
    features: [
      'Interactive coin method casting',
      'Full hexagram interpretation',
      'Changing lines analysis',
      'Practical guidance for decisions',
    ],
    icon: 'hexagram',
    accent: 'from-jade-500 to-jade-600',
    bgAccent: 'bg-jade-50',
    borderAccent: 'border-jade-200/50',
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-32 bg-paper-warm relative">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none ink-texture" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow text-gold-700 mb-4 block">Our Services</span>
          <h2 className="heading-h2 text-ink-900 mb-4">
            Three Paths to Self-Discovery
          </h2>
          <p className="text-ink-600 leading-relaxed">
            Each tradition offers a unique lens through which to understand your life.
            Begin with one, or explore all three for a complete picture of your destiny.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card
              key={service.id}
              variant="paper"
              className={`group hover:shadow-ink-xl transition-all duration-300 hover:-translate-y-1 ${service.borderAccent}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-8">
                {/* Icon */}
                <div className="mb-6">
                  <ServiceIcon name={service.icon} accent={service.accent} />
                </div>

                {/* Title */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-3 mb-1">
                    <h3 className="heading-h3 text-ink-900">{service.name}</h3>
                    <span className="text-lg font-serif text-ink-400">{service.nameChinese}</span>
                  </div>
                  <p className="text-sm text-gold-700 font-medium">{service.tagline}</p>
                </div>

                {/* Description */}
                <p className="text-ink-600 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-ink-600">
                      <svg className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={`/services#${service.id}`}>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-ink-900 group-hover:text-white group-hover:border-ink-900 transition-all">
                    Learn More
                    <svg className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceIcon({ name, accent }: { name: string; accent: string }) {
  const icons: Record<string, React.ReactNode> = {
    bazi: (
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-ink`}>
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="8" height="8" rx="1" />
          <rect x="13" y="3" width="8" height="8" rx="1" />
          <rect x="3" y="13" width="8" height="8" rx="1" />
          <rect x="13" y="13" width="8" height="8" rx="1" />
        </svg>
      </div>
    ),
    star: (
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-ink`}>
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    ),
    hexagram: (
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-ink`}>
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="16" height="2" rx="1" />
          <rect x="4" y="8" width="7" height="2" rx="1" />
          <rect x="13" y="8" width="7" height="2" rx="1" />
          <rect x="4" y="12" width="16" height="2" rx="1" />
          <rect x="4" y="16" width="7" height="2" rx="1" />
          <rect x="13" y="16" width="7" height="2" rx="1" />
          <rect x="4" y="20" width="16" height="2" rx="1" />
        </svg>
      </div>
    ),
  }

  return icons[name] || icons.bazi
}
