import type { Metadata } from 'next'
import { DiagonalBackground } from '@/components/layout/diagonal-background'

export const metadata: Metadata = {
  title: 'Terms of Service | Mingdao',
  description: 'Terms of Service for Mingdao — by using our services, you agree to these terms.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-[calc(100vh-5rem)]">
      {/* Hero */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <DiagonalBackground className="absolute inset-0" constellationOpacity={0.08} symbolOpacity={0.04} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow text-gold-700 mb-4 block">Legal</span>
          <h1 className="heading-h1 text-ink-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-ink-600 max-w-2xl mx-auto">
            Last updated: July 15, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20 bg-paper-warm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-ink-100 shadow-sm">
            <div className="prose prose-lg max-w-none text-ink-700">
              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-0 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="mb-6 leading-relaxed">
                Welcome to Mingdao ("we," "our," or "us"). By accessing or using our website, 
                applications, and services (collectively, the "Services"), you agree to be bound 
                by these Terms of Service ("Terms"). If you do not agree to these Terms, please 
                do not use our Services.
              </p>
              <p className="mb-8 leading-relaxed">
                We may update these Terms from time to time. We will notify you of significant 
                changes by posting the updated Terms on our website with a revised "Last updated" date. 
                Your continued use of the Services after the changes become effective constitutes 
                your acceptance of the revised Terms.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-10 mb-4">
                2. Nature of Our Services
              </h2>
              <p className="mb-6 leading-relaxed">
                Mingdao provides astrological and divination services, including but not limited to 
                Bazi (Four Pillars of Destiny), Zi Wei Dou Shu (Purple Star Astrology), and 
                I Ching readings. These services are intended for <strong>entertainment and 
                self-reflection purposes only</strong>.
              </p>
              <p className="mb-6 leading-relaxed">
                Our readings and analyses are based on traditional Chinese metaphysical systems 
                and should not be considered as financial, legal, medical, or professional advice. 
                You are solely responsible for any decisions you make based on information 
                obtained through our Services.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg my-8">
                <p className="text-amber-900 m-0 font-medium">
                  Important: Astrological readings are for personal insight and entertainment only. 
                  They are not a substitute for professional advice. Always consult qualified 
                  professionals for financial, legal, health, or other important matters.
                </p>
              </div>

              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-10 mb-4">
                3. User Accounts
              </h2>
              <p className="mb-4 leading-relaxed">
                To access certain features of our Services, you may need to create an account. 
                You agree to:
              </p>
              <ul className="list-disc ml-6 mb-8 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be responsible for all activities that occur under your account</li>
              </ul>
              <p className="mb-8 leading-relaxed">
                We reserve the right to suspend or terminate your account at our discretion, 
                including for violations of these Terms.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-10 mb-4">
                4. Payments and Refunds
              </h2>
              <h3 className="font-serif text-xl font-semibold text-ink-800 mt-6 mb-3">
                4.1 Pricing
              </h3>
              <p className="mb-6 leading-relaxed">
                All prices are listed in USD unless otherwise specified. We reserve the right 
                to modify our pricing at any time. Any price changes will not affect purchases 
                already made.
              </p>
              <h3 className="font-serif text-xl font-semibold text-ink-800 mt-6 mb-3">
                4.2 Payments
              </h3>
              <p className="mb-6 leading-relaxed">
                By providing payment information, you represent and warrant that you have 
                the legal right to use the payment method. You agree to pay all charges 
                incurred through your account at the prices in effect when the charges are incurred.
              </p>
              <h3 className="font-serif text-xl font-semibold text-ink-800 mt-6 mb-3">
                4.3 Refunds
              </h3>
              <p className="mb-8 leading-relaxed">
                Due to the digital nature of our services, refunds are generally not provided 
                after a reading or report has been generated and delivered. However, we want 
                you to be satisfied with our services. If you are unhappy with your purchase, 
                please contact us within 7 days of purchase, and we will evaluate your refund 
                request on a case-by-case basis.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-10 mb-4">
                5. Subscription Terms
              </h2>
              <p className="mb-4 leading-relaxed">
                For subscription-based services:
              </p>
              <ul className="list-disc ml-6 mb-8 space-y-2">
                <li><strong>Billing cycle:</strong> Subscriptions are billed monthly or annually, 
                  depending on the plan you select.</li>
                <li><strong>Auto-renewal:</strong> Subscriptions auto-renew unless canceled 
                  before the renewal date.</li>
                <li><strong>Cancellation:</strong> You may cancel your subscription at any time. 
                  The cancellation will take effect at the end of the current billing period. 
                  No partial refunds are provided.</li>
                <li><strong>Plan changes:</strong> Upgrades take effect immediately with a 
                  prorated charge. Downgrades take effect at the next billing cycle.</li>
              </ul>

              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-10 mb-4">
                6. User Conduct
              </h2>
              <p className="mb-4 leading-relaxed">
                When using our Services, you agree not to:
              </p>
              <ul className="list-disc ml-6 mb-8 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Use the Services for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the security or functionality of the Services</li>
                <li>Attempt to gain unauthorized access to any part of the Services</li>
                <li>Use the Services to harass, abuse, or harm others</li>
                <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the 
                  Services without express written permission from us</li>
                <li>Use automated systems or bots to access or scrape the Services</li>
              </ul>

              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-10 mb-4">
                7. Intellectual Property
              </h2>
              <p className="mb-6 leading-relaxed">
                All content and materials available through our Services — including but not 
                limited to text, graphics, logos, images, software, and the unique design, 
                selection, and arrangement of content — are the property of Mingdao or our 
                licensors and are protected by copyright, trademark, and other intellectual 
                property laws.
              </p>
              <p className="mb-8 leading-relaxed">
                You may access and use our Services for your personal, non-commercial use only. 
                You may not reproduce, distribute, modify, create derivative works of, publicly 
                display, or otherwise use our content without our prior written consent.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-10 mb-4">
                8. Disclaimer of Warranties
              </h2>
              <p className="mb-6 leading-relaxed">
                Our Services are provided on an "AS IS" and "AS AVAILABLE" basis without 
                warranties of any kind, either express or implied. To the fullest extent 
                permitted by applicable law, we disclaim all warranties, express or implied, 
                including but not limited to implied warranties of merchantability, fitness 
                for a particular purpose, and non-infringement.
              </p>
              <p className="mb-8 leading-relaxed">
                We do not guarantee that our Services will be uninterrupted, secure, or 
                error-free, or that defects will be corrected. We make no warranty regarding 
                the accuracy, reliability, or completeness of any content or information 
                provided through our Services.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-10 mb-4">
                9. Limitation of Liability
              </h2>
              <p className="mb-6 leading-relaxed">
                To the fullest extent permitted by applicable law, Mingdao and its directors, 
                officers, employees, agents, and affiliates shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages, including 
                but not limited to loss of profits, data, use, or goodwill, arising out of 
                or in connection with your use of or inability to use our Services.
              </p>
              <p className="mb-8 leading-relaxed">
                In no event shall our total liability to you for all claims arising from or 
                related to your use of the Services exceed the amount you paid to us in the 
                twelve (12) months preceding the date the claim arose.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-10 mb-4">
                10. Privacy
              </h2>
              <p className="mb-8 leading-relaxed">
                Your privacy is important to us. Our <a href="/privacy" className="text-gold-700 hover:text-gold-800 underline">Privacy Policy</a> explains how we 
                collect, use, and protect your personal information. By using our Services, 
                you agree to the terms of our Privacy Policy.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-10 mb-4">
                11. Termination
              </h2>
              <p className="mb-8 leading-relaxed">
                We reserve the right, at our sole discretion, to suspend or terminate your 
                access to our Services at any time, without notice, for conduct that we 
                believe violates these Terms or is harmful to other users, us, or third 
                parties, or for any other reason.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-10 mb-4">
                12. Governing Law
              </h2>
              <p className="mb-8 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws 
                of the jurisdiction in which Mingdao operates, without regard to its conflict 
                of law provisions.
              </p>

              <h2 className="font-serif text-2xl font-semibold text-ink-900 mt-10 mb-4">
                13. Contact Us
              </h2>
              <p className="mb-4 leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mb-8 leading-relaxed">
                <a href="mailto:hello@mingdao.online" className="text-gold-700 hover:text-gold-800">
                  hello@mingdao.online
                </a>
              </p>

              <div className="border-t border-ink-100 pt-6 mt-10 text-center text-ink-500 text-sm">
                Thank you for using Mingdao. We are honored to be part of your journey 
                of self-discovery.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
