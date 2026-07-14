import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { PRODUCTS, SUBSCRIPTION_PLANS, DEEP_QUESTIONS_PRICE } from '@/lib/products'
import { Check, Sparkles, Crown, Zap, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Pricing',
  description: 'Choose the perfect plan for your destiny guidance journey. From free Bazi readings to premium reports and AI Daoist consultations.',
}

export default function PricingPage() {
  const plans = Object.values(SUBSCRIPTION_PLANS).sort((a, b) => a.sortOrder - b.sortOrder)
  const reports = Object.values(PRODUCTS).sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.04}
        symbolOpacity={0.02}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-50 border border-gold-200/50 rounded-full text-gold-700 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Simple, transparent pricing</span>
          </div>
          <h1 className="heading-h1 text-ink-900 mb-4">
            Choose Your Path
          </h1>
          <p className="text-lg text-ink-500 max-w-2xl mx-auto">
            From free insights to deep wisdom — find the guidance you need on your journey.
            <br />
            从免费洞察到深层智慧，找到属于你的指引之道。
          </p>
        </div>

        {/* 会员订阅 */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="heading-h2 text-ink-900 mb-2">
              Membership Plans
              <span className="text-ink-400 text-xl ml-2">会员方案</span>
            </h2>
            <p className="text-ink-500">
              Unlimited guidance, amazing value
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden ${
                  index === 1
                    ? 'border-gold-300 shadow-gold'
                    : ''
                }`}
                variant="paper"
              >
                {index === 1 && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      index === 1
                        ? 'bg-gradient-to-br from-gold-400 to-gold-600'
                        : 'bg-ink-100'
                    }`}>
                      {index === 1 ? (
                        <Crown className="w-6 h-6 text-white" />
                      ) : (
                        <Star className="w-6 h-6 text-ink-600" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <p className="text-sm text-gold-600" style={{ fontFamily: 'var(--font-kaishu), serif' }}>
                        {plan.nameCn}
                      </p>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-serif font-bold text-ink-900">
                      ${plan.priceMonthly}
                    </span>
                    <span className="text-ink-500 ml-1">/ month</span>
                    <p className="text-sm text-gold-600 mt-1">
                      or ${plan.priceYearly}/year (save {Math.round((1 - plan.priceYearly / (plan.priceMonthly * 12)) * 100)}%)
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-jade-500 flex-shrink-0 mt-0.5" />
                        <span className="text-ink-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    variant={index === 1 ? 'gold' : 'outline'}
                    size="lg"
                    className="w-full"
                  >
                    {index === 1 ? 'Start Your Journey' : 'Choose Plan'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* 单次报告 */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="heading-h2 text-ink-900 mb-2">
              Single Reports
              <span className="text-ink-400 text-xl ml-2">单项报告</span>
            </h2>
            <p className="text-ink-500">
              Pay for what you need, no commitment required
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((product) => (
              <Card key={product.id} variant="paper" className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {product.name}
                  </CardTitle>
                  <p className="text-sm text-gold-600" style={{ fontFamily: 'var(--font-kaishu), serif' }}>
                    {product.nameCn}
                  </p>
                  <CardDescription className="mt-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="mb-4">
                    <span className="text-3xl font-serif font-bold text-ink-900">
                      ${product.price}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {product.features.slice(0, 5).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                        <ChevronRight className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-4 border-t border-ink-100">
                    <div className="flex items-center gap-2 text-sm text-ink-500">
                      <Zap className="w-4 h-4 text-gold-500" />
                      <span>{product.baseQuestions} AI questions included</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={`/reports/${product.id}`} className="w-full">
                    <Button variant="outline" size="md" className="w-full">
                      Learn More
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* 深度问道加购 */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-jade-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-gold-400" />
                <span className="text-gold-400 text-sm font-medium tracking-wider uppercase">
                  Deep Questions Upgrade
                </span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                Unlock 七七四十九问 — 49 Deep Questions
              </h3>
              <p className="text-ink-300 mb-6">
                Go deeper with your report. Upgrade from basic questions to a full 49-question
                deep dive conversation with Master Qingfeng.
                <br />
                <span className="text-gold-300/80">
                  与清风道长进行深度对话，探寻命盘的每一个细节
                </span>
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-left">
                  <div className="text-3xl font-serif font-bold text-gold-400">
                    ${DEEP_QUESTIONS_PRICE}
                  </div>
                  <div className="text-xs text-ink-400">per report</div>
                </div>
                <div className="w-px h-12 bg-ink-700" />
                <div className="text-left">
                  <div className="text-lg font-semibold text-white">
                    49 questions
                  </div>
                  <div className="text-xs text-ink-400">七七四十九</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto">
          <h2 className="heading-h2 text-ink-900 text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'How accurate are the readings?',
                a: 'Our readings are based on traditional Chinese metaphysics systems that have been refined over thousands of years. While they provide valuable insights and patterns, they are tools for self-reflection and guidance, not absolute predictions.',
              },
              {
                q: 'Can I get a refund?',
                a: 'Since our reports are digital and generated instantly, we do not offer refunds. However, if you experience any issues or are unsatisfied, please contact us and we will make it right.',
              },
              {
                q: 'What is "Ask the Master"?',
                a: '"Ask the Master" (问道) is our AI chat feature with Master Qingfeng, a Daoist monk persona. You can ask follow-up questions about your report for personalized guidance. Each report includes a set number of questions.',
              },
              {
                q: 'Is my data private?',
                a: 'Absolutely. Your birth data and personal information are encrypted and stored securely. We never share your data with third parties. Your readings are private and only visible to you.',
              },
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel your subscription at any time. You will continue to have access until the end of your billing period.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl border border-ink-200/60 p-5">
                <h4 className="font-serif text-lg font-semibold text-ink-900 mb-2">
                  {faq.q}
                </h4>
                <p className="text-ink-600 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
