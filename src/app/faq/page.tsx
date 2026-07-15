import type { Metadata } from "next"
import { DiagonalBackground } from "@/components/layout/diagonal-background"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Mingdao and our services.",
}

const faqs = [
  {
    question: "What is Bazi (Eight Characters)?",
    answer: "Bazi, or Four Pillars of Destiny, is a Chinese metaphysical system that analyzes a person&apos;s birth date and time to understand their character, life path, strengths, and challenges.",
  },
  {
    question: "How accurate are the readings?",
    answer: "Our readings provide a framework for self-understanding and reflection rather than deterministic predictions. Think of it as a weather forecast for your life — it shows patterns and tendencies, but your choices shape the outcome.",
  },
  {
    question: "Do I need an exact birth time?",
    answer: "An exact birth time (within 30 minutes) gives the most accurate reading. If you don&apos;t know your exact birth time, we can still generate a reading based on the day, but some details may be less precise.",
  },
  {
    question: "Is Mingdao a religion?",
    answer: "No. Mingdao is a platform for exploring Eastern wisdom and self-understanding. Daoist metaphysics is a philosophical and cultural tradition, not a religion.",
  },
  {
    question: "Can I get a refund?",
    answer: "Yes, we offer a 7-day satisfaction guarantee. If your reading doesn&apos;t resonate with you, contact us within 7 days and we&apos;ll process a full refund.",
  },
  {
    question: "Is my personal data secure?",
    answer: "Absolutely. Your birth data and personal information are encrypted and stored securely. We never share your data with third parties.",
  },
  {
    question: "How is Mingdao different from other astrology apps?",
    answer: "Our system is built with guidance from 32nd generation Wudang Daoist practitioners, following classical calculation methods. We focus on depth and accuracy over entertainment value.",
  },
  {
    question: "Do you offer live consultations?",
    answer: "Yes, our Premium and Ultimate plans include live consultation sessions with our Daoist practitioners via video call.",
  },
]

export default function FAQPage() {
  return (
    <>
      <section className="relative py-20 md:py-28 overflow-hidden">
        <DiagonalBackground className="absolute inset-0" constellationOpacity={0.1} symbolOpacity={0.06} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow text-gold-700 mb-4 block">FAQ</span>
          <h1 className="heading-h1 text-ink-900 mb-6">Frequently Asked Questions</h1>
          <p className="text-lg text-ink-600 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about Mingdao.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-paper-warm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 md:p-8 border border-ink-100 shadow-sm">
                <h3 className="font-serif text-lg font-semibold text-ink-900 mb-3">{faq.question}</h3>
                <p className="text-ink-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
