import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getProduct, getAllProducts, DEEP_QUESTIONS_PRICE } from '@/lib/products'
import { 
  Sparkles, Crown, ChevronRight, Zap, 
  Star, Shield, Clock, MessageCircle,
  Check
} from 'lucide-react'

export async function generateStaticParams() {
  return getAllProducts().map(p => ({ productId: p.id }))
}

export function generateMetadata({ params }: { params: { productId: string } }) {
  const product = getProduct(params.productId)
  if (!product) return { title: 'Report Not Found' }
  
  return {
    title: `${product.name} | Mingdao`,
    description: product.description,
  }
}

export default function ReportProductPage({ params }: { params: { productId: string } }) {
  const product = getProduct(params.productId)
  
  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.05}
        symbolOpacity={0.03}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-50 border border-gold-200/50 rounded-full text-gold-700 text-sm mb-4">
            <Star className="w-4 h-4" />
            <span>{product.nameCn}</span>
          </div>
          <h1 className="heading-h1 text-ink-900 mb-4">
            {product.name}
          </h1>
          <p className="text-lg text-ink-500 max-w-2xl mx-auto">
            {product.description}
          </p>
        </div>

        {/* Price & CTA */}
        <div className="flex flex-col items-center gap-4 mb-16">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-serif font-bold text-ink-900">
              ${product.price}
            </span>
            <span className="text-ink-500">one-time</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-ink-500">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-gold-500" />
              <span>{product.baseQuestions} AI questions included</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-jade-500" />
              <span>Instant delivery</span>
            </div>
          </div>
          <Link href={`/reports/${product.id}/input`}>
            <Button variant="gold" size="lg" className="h-14 px-10 text-base">
              Start Your Reading
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* What You Get */}
        <section className="mb-16">
          <h2 className="heading-h2 text-ink-900 text-center mb-10">
            What You'll Discover
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {product.features.map((feature, i) => (
              <Card key={i} variant="paper" className="p-4">
                <CardContent className="p-2 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-gold-600" />
                  </div>
                  <span className="text-ink-700 text-sm leading-relaxed pt-1">
                    {feature}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="heading-h2 text-ink-900 text-center mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Enter Your Info',
                titleCn: '输入信息',
                desc: 'Provide your birth details — date, time, and place for accurate calculation.',
                icon: <Sparkles className="w-6 h-6" />,
              },
              {
                step: '02',
                title: 'Report Generated',
                titleCn: '生成报告',
                desc: 'Our system calculates your chart and generates a comprehensive reading instantly.',
                icon: <Crown className="w-6 h-6" />,
              },
              {
                step: '03',
                title: 'Ask the Master',
                titleCn: '问道解惑',
                desc: 'Chat with Master Qingfeng about your report — get personalized guidance.',
                icon: <MessageCircle className="w-6 h-6" />,
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200/50 flex items-center justify-center mx-auto mb-4 text-gold-600">
                  {item.icon}
                </div>
                <div className="text-gold-500 text-sm font-medium mb-1">Step {item.step}</div>
                <h3 className="font-serif text-lg font-semibold text-ink-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gold-600 mb-2" style={{ fontFamily: 'var(--font-kaishu), serif' }}>
                  {item.titleCn}
                </p>
                <p className="text-sm text-ink-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Deep Questions */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 rounded-2xl p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-gold-400" />
                  <span className="text-gold-400 text-sm font-medium tracking-wider uppercase">
                    Deep Questions Upgrade
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-3">
                  Go Deeper with 七七四十九问
                </h3>
                <p className="text-ink-300 text-sm leading-relaxed">
                  Upgrade your report with 49 deep questions to explore every detail of your chart.
                  Perfect for those who want truly comprehensive guidance from Master Qingfeng.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-serif font-bold text-gold-400">
                  +${DEEP_QUESTIONS_PRICE}
                </div>
                <div className="text-xs text-ink-400 mt-1">per report</div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-8 text-ink-400 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>100% Private & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Based on 3000+ Years of Wisdom</span>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link href={`/reports/${product.id}/input`}>
            <Button variant="gold" size="lg" className="h-14 px-12 text-base">
              Begin Your {product.nameCn} Reading
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <p className="text-sm text-ink-400 mt-4">
            Takes about 2 minutes · No account required to preview
          </p>
        </div>
      </div>
    </div>
  )
}
