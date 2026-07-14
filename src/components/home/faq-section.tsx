'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'What exactly is a destiny reading?',
    answer:
      'A destiny reading is a personal exploration based on ancient Chinese metaphysical systems like Bazi and Purple Star Astrology. Using your birth date, time, and location, we map out the patterns and potentials of your life journey. It\'s not about predicting the future — it\'s about understanding your inherent nature, strengths, and the rhythms that influence your path.',
  },
  {
    question: 'Is this the same as fortune-telling?',
    answer:
      'No. We see these traditions as tools for self-understanding and personal growth, not as fortunetelling. Think of it like a personality assessment rooted in 3,000 years of wisdom — it reveals tendencies, potentials, and patterns, empowering you to make more conscious choices in life.',
  },
  {
    question: 'How accurate are the readings?',
    answer:
      'Our readings combine traditional algorithms with AI-enhanced interpretation. The foundational calculations follow classical texts precisely. The interpretive layer draws from thousands of hours of study by our team of practitioners. Most users find the readings remarkably resonant, but like any guidance system, its value lies in how you reflect on and apply the insights.',
  },
  {
    question: 'What information do I need for a Bazi reading?',
    answer:
      'For the most accurate Bazi reading, you\'ll need your birth date, exact birth time (to the hour, if possible), and birth location. The birth time is especially important as it determines your hour pillar. If you don\'t know your exact birth time, we can still provide a meaningful reading with the three known pillars.',
  },
  {
    question: 'Is my personal data secure?',
    answer:
      'Absolutely. We take privacy very seriously. All personal data, including birth information and readings, is encrypted and protected. We never share your data with third parties, and you can request deletion of your data at any time. Your destiny exploration should be a private, safe journey.',
  },
  {
    question: 'Can I get a reading if I\'m from any culture or background?',
    answer:
      'Yes! The wisdom of these traditions is universal. While they originated in ancient China, the insights about human nature, timing, and personal growth resonate across all cultures. Many of our users come from diverse backgrounds and find deep meaning in these ancient systems.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  return (
    <section id="faq" className="py-20 md:py-32 bg-paper-warm relative">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none ink-texture" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="eyebrow text-gold-700 mb-4 block">FAQ</span>
          <h2 className="heading-h2 text-ink-900 mb-4">
            Questions You May Have
          </h2>
          <p className="text-ink-600 leading-relaxed">
            Everything you need to know before beginning your journey.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                'rounded-xl border bg-white/80 backdrop-blur-sm transition-all duration-300',
                openIndex === index
                  ? 'border-gold-200 shadow-ink'
                  : 'border-ink-200/60 hover:border-ink-300'
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-start justify-between gap-4"
              >
                <span className="font-serif text-ink-900 font-medium text-base">
                  {faq.question}
                </span>
                <svg
                  className={cn(
                    'w-5 h-5 text-ink-400 flex-shrink-0 mt-0.5 transition-transform duration-300',
                    openIndex === index && 'rotate-180 text-gold-500'
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                )}
              >
                <p className="px-6 pb-5 text-ink-600 leading-relaxed text-sm">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA bottom */}
        <div className="mt-16 text-center">
          <p className="text-ink-600 mb-4">Still have questions?</p>
          <a
            href="mailto:hello@mingdao.space"
            className="inline-flex items-center gap-2 text-gold-700 hover:text-gold-600 font-medium transition-colors"
          >
            Contact us
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
