'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DiagonalBackground } from '@/components/layout/diagonal-background'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.15}
        symbolOpacity={0.08}
        showStars={true}
      >
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-navy-400/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-cinnabar-400/10 blur-3xl" />
      </DiagonalBackground>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-8 animate-fade-in">
            <span className="w-8 h-px bg-navy-400/60" />
            <span className="eyebrow text-navy-600 tracking-widest">
              Ancient Wisdom • Modern Insight
            </span>
            <span className="w-8 h-px bg-navy-400/60" />
          </div>

          {/* Main heading */}
          <h1 className="heading-display text-navy-900 mb-6 text-balance animate-fade-in-up">
            Discover the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-600 via-navy-500 to-cinnabar-500">
              Pattern of Your Destiny
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-navy-700 mb-10 max-w-2xl mx-auto leading-relaxed text-balance animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            Three thousand years of Chinese metaphysical wisdom,
            made accessible for your journey of self-discovery.
            Bazi, Purple Star, and I Ching — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <Link href="/services">
              <Button variant="gold" size="lg" className="w-full sm:w-auto">
                Discover Your Destiny
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Our Story
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-col items-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <p className="text-sm text-ink-500">
              Trusted by seekers worldwide
            </p>
            <div className="flex items-center gap-8 text-ink-400">
              <div className="flex flex-col items-center">
                <span className="font-serif text-2xl font-semibold text-ink-700">10K+</span>
                <span className="text-xs text-ink-500">Readings Done</span>
              </div>
              <div className="w-px h-10 bg-ink-200" />
              <div className="flex flex-col items-center">
                <span className="font-serif text-2xl font-semibold text-ink-700">4.9★</span>
                <span className="text-xs text-ink-500">Average Rating</span>
              </div>
              <div className="w-px h-10 bg-ink-200" />
              <div className="flex flex-col items-center">
                <span className="font-serif text-2xl font-semibold text-ink-700">3000+</span>
                <span className="text-xs text-ink-500">Years of Wisdom</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <span className="text-xs text-ink-400 tracking-wider">SCROLL</span>
          <svg className="w-4 h-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
