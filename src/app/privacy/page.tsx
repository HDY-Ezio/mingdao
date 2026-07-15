import type { Metadata } from "next"
import { DiagonalBackground } from "@/components/layout/diagonal-background"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Mingdao collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <>
      <section className="relative py-20 md:py-28 overflow-hidden">
        <DiagonalBackground className="absolute inset-0" constellationOpacity={0.1} symbolOpacity={0.06} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow text-gold-700 mb-4 block">Legal</span>
          <h1 className="heading-h1 text-ink-900 mb-6">Privacy Policy</h1>
          <p className="text-lg text-ink-600 leading-relaxed max-w-2xl mx-auto">Last updated: July 2026</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-paper-warm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-ink-100 shadow-sm space-y-8 text-ink-600 leading-relaxed">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-4">1. Introduction</h2>
              <p>Mingdao respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-4">2. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and email address (account registration)</li>
                <li>Birth date, time, and location (for Bazi calculations)</li>
                <li>Payment information (processed by our payment providers)</li>
                <li>Device information and usage data</li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To generate your personalized Bazi readings</li>
                <li>To process payments and manage subscriptions</li>
                <li>To communicate with you about your account</li>
                <li>To improve our website and services</li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-4">4. Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal data. Your birth data and personal information are encrypted both in transit and at rest.</p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-4">5. Your Rights</h2>
              <p>You have the right to access, correct, delete, and export your personal data. To exercise these rights, contact us at hello@mingdao.space.</p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink-900 mb-4">6. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, contact us at hello@mingdao.space.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
