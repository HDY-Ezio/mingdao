import type { Metadata } from "next"
import { DiagonalBackground } from "@/components/layout/diagonal-background"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Mingdao.",
}

export default function ContactPage() {
  return (
    <>
      <section className="relative py-20 md:py-28 overflow-hidden">
        <DiagonalBackground className="absolute inset-0" constellationOpacity={0.1} symbolOpacity={0.06} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow text-gold-700 mb-4 block">Contact</span>
          <h1 className="heading-h1 text-ink-900 mb-6">Get in Touch</h1>
          <p className="text-lg text-ink-600 leading-relaxed max-w-2xl mx-auto">
            Have questions about our services? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-paper-warm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-ink-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gold-100/80 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gold-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-900 mb-2">Email Us</h3>
              <p className="text-ink-600 mb-4">We respond within 24 hours.</p>
              <a href="mailto:hello@mingdao.space" className="text-gold-700 hover:text-gold-800 font-medium">hello@mingdao.space</a>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-ink-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gold-100/80 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-gold-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-900 mb-2">Business Hours</h3>
              <p className="text-ink-600 mb-2">Monday - Friday</p>
              <p className="text-ink-900 font-medium">9:00 - 18:00 (UTC+8)</p>
              <p className="text-ink-500 text-sm mt-2">Weekend inquiries answered next business day.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
