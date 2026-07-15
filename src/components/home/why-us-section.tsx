import { DiagonalBackground } from '@/components/layout/diagonal-background'

const reasons = [
  {
    icon: 'wisdom',
    title: 'Ancient Wisdom, Authentic',
    description:
      'Our readings are rooted in classical texts and traditional lineages, preserved and passed down through generations of practitioners.',
  },
  {
    icon: 'ai',
    title: 'AI-Enhanced Insight',
    description:
      'We combine traditional calculations with modern AI to deliver readings that are both deeply accurate and personally meaningful.',
  },
  {
    icon: 'privacy',
    title: 'Your Privacy Matters',
    description:
      'Your birth data and personal readings are encrypted and protected. We believe destiny exploration should be safe and private.',
  },
]

export function WhyUsSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.08}
        symbolOpacity={0.05}
        showStars={true}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Visual / decorative */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto relative">
              {/* Decorative circle with seal */}
              <div className="absolute inset-0 rounded-full border border-gold-200/50" />
              <div className="absolute inset-8 rounded-full border border-gold-300/30" />
              <div className="absolute inset-16 rounded-full border border-gold-400/20" />
              
              {/* Center seal */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="seal-stamp mx-auto mb-4">
                    <img src="/mingdao-seal.png" alt="明道印章" className="w-full h-full object-contain" />
                  </div>
                  <p className="font-serif text-2xl text-ink-800 tracking-widest">
                    MINGDAO
                  </p>
                  <p className="text-sm text-ink-500 mt-1 tracking-wider">
                    Light Your Path
                  </p>
                </div>
              </div>

              {/* Four symbols at cardinal directions */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                <span className="text-xs text-ink-400 font-serif">朱雀</span>
                <p className="text-[10px] text-ink-400">Phoenix</p>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                <span className="text-xs text-ink-400 font-serif">玄武</span>
                <p className="text-[10px] text-ink-400">Tortoise</p>
              </div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-center">
                <span className="text-xs text-ink-400 font-serif">青龙</span>
                <p className="text-[10px] text-ink-400">Dragon</p>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-center">
                <span className="text-xs text-ink-400 font-serif">白虎</span>
                <p className="text-[10px] text-ink-400">Tiger</p>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <span className="eyebrow text-gold-700 mb-4 block">Why Mingdao</span>
            <h2 className="heading-h2 text-ink-900 mb-6">
              Tradition Meets Tomorrow
            </h2>
            <p className="text-ink-600 leading-relaxed mb-10">
              We bridge three thousand years of Eastern wisdom with the clarity of modern
              technology. Every reading honors the tradition while speaking to your life today.
            </p>

            <div className="space-y-8">
              {reasons.map((reason, index) => (
                <div key={reason.title} className="flex gap-5">
                  <div className="flex-shrink-0">
                    <ReasonIcon name={reason.icon} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-ink-900 mb-1.5">
                      {reason.title}
                    </h3>
                    <p className="text-sm text-ink-600 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ReasonIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    wisdom: (
      <div className="w-12 h-12 rounded-lg bg-gold-100/80 flex items-center justify-center">
        <svg className="w-6 h-6 text-gold-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
    ),
    ai: (
      <div className="w-12 h-12 rounded-lg bg-jade-100/80 flex items-center justify-center">
        <svg className="w-6 h-6 text-jade-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </div>
    ),
    privacy: (
      <div className="w-12 h-12 rounded-lg bg-ink-100/80 flex items-center justify-center">
        <svg className="w-6 h-6 text-ink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
    ),
  }

  return icons[name] || icons.wisdom
}
