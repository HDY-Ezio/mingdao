'use client'

import * as React from 'react'
import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Mail, Check, X, Bell, Calendar, Sparkles, Settings } from 'lucide-react'

export default function SubscriptionSettingsPage() {
  const [email, setEmail] = React.useState('')
  const [isSubscribed, setIsSubscribed] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [messageType, setMessageType] = React.useState<'success' | 'error'>('success')
  
  const [preferences, setPreferences] = React.useState({
    dailyFortune: true,
    weeklyForecast: true,
    specialOccasions: true,
    productUpdates: false,
  })

  const handleSubscribe = async () => {
    if (!email) {
      setMessage('Please enter your email address')
      setMessageType('error')
      return
    }
    
    setIsLoading(true)
    setMessage('')
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preferences }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        setIsSubscribed(true)
        setMessage(data.message)
        setMessageType('success')
      } else {
        setMessage(data.error || 'Subscription failed')
        setMessageType('error')
      }
    } catch (e) {
      setMessage('Something went wrong. Please try again.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] relative">
      <DiagonalBackground
        className="absolute inset-0"
        constellationOpacity={0.05}
        symbolOpacity={0.03}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-50 border border-gold-200/50 rounded-full text-gold-700 text-sm mb-4">
            <Mail className="w-4 h-4" />
            <span>邮件订阅</span>
          </div>
          <h1 className="heading-h1 text-ink-900 mb-3">
            Email Preferences
          </h1>
          <p className="text-ink-500 max-w-lg mx-auto">
            Customize what you receive from us. Get personalized daily fortunes, 
            weekly forecasts, and special guidance delivered to your inbox.
          </p>
        </div>

        {/* Email Input */}
        {!isSubscribed ? (
          <Card variant="paper" className="mb-8">
            <CardHeader>
              <CardTitle>Subscribe to Daily Fortune</CardTitle>
              <CardDescription>
                Enter your email to receive personalized daily guidance
                based on your destiny chart.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-ink-700 mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full h-12 px-4 rounded-xl border border-ink-200 bg-white text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
                  />
                </div>

                {message && (
                  <div className={cn(
                    'p-3 rounded-lg text-sm',
                    messageType === 'success' 
                      ? 'bg-jade-50 text-jade-700 border border-jade-200/50' 
                      : 'bg-cinnabar-50 text-cinnabar-700 border border-cinnabar-200/50'
                  )}>
                    {message}
                  </div>
                )}

                <Button
                  variant="gold"
                  size="lg"
                  className="w-full h-12"
                  onClick={handleSubscribe}
                  disabled={isLoading}
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe Now'}
                  {!isLoading && <Bell className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card variant="paper" className="mb-8 border-jade-300/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-jade-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-jade-600" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-ink-900">
                    Subscribed Successfully!
                  </h3>
                  <p className="text-sm text-ink-500">
                    {email} — check your inbox for a welcome message
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preferences */}
        <Card variant="paper" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gold-500" />
              Email Preferences
            </CardTitle>
            <CardDescription>
              Choose what kinds of emails you'd like to receive.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  key: 'dailyFortune' as const,
                  icon: <Sparkles className="w-5 h-5" />,
                  title: 'Daily Fortune Email',
                  titleCn: '每日运势',
                  description: 'Personalized daily guidance based on your chart and the day\'s energy.',
                  recommended: true,
                },
                {
                  key: 'weeklyForecast' as const,
                  icon: <Calendar className="w-5 h-5" />,
                  title: 'Weekly Forecast',
                  titleCn: '周运预报',
                  description: 'Weekly overview of opportunities and challenges ahead.',
                  recommended: true,
                },
                {
                  key: 'specialOccasions' as const,
                  icon: <Mail className="w-5 h-5" />,
                  title: 'Special Occasions',
                  titleCn: '重要节气',
                  description: 'Guidance for solar terms, festivals, and astrological events.',
                  recommended: true,
                },
                {
                  key: 'productUpdates' as const,
                  icon: <Bell className="w-5 h-5" />,
                  title: 'Product Updates',
                  titleCn: '产品更新',
                  description: 'New features, reports, and improvements to Mingdao.',
                  recommended: false,
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-ink-50/50 cursor-pointer transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => handlePreferenceChange(item.key, !preferences[item.key])}
                    className={cn(
                      'w-5 h-5 rounded-md border-2 mt-0.5 flex-shrink-0 flex items-center justify-center transition-colors',
                      preferences[item.key]
                        ? 'bg-gold-500 border-gold-500'
                        : 'border-ink-300 hover:border-ink-400'
                    )}
                  >
                    {preferences[item.key] && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-ink-800 font-medium">{item.title}</span>
                      <span 
                        className="text-ink-500 text-sm"
                        style={{ fontFamily: 'var(--font-kaishu), serif' }}
                      >
                        {item.titleCn}
                      </span>
                      {item.recommended && (
                        <span className="text-xs px-2 py-0.5 bg-gold-100 text-gold-700 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink-500 mt-1">{item.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* What You Get */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: '☀️',
              title: 'Daily Guidance',
              desc: 'Personalized fortune each morning based on your unique chart.',
            },
            {
              icon: '📅',
              title: 'Weekly Overview',
              desc: 'See the themes and opportunities for the week ahead.',
            },
            {
              icon: '🎐',
              title: 'Seasonal Wisdom',
              desc: 'Timely guidance aligned with solar terms and celestial events.',
            },
          ].map((item, i) => (
            <div key={i} className="p-5 bg-white/70 backdrop-blur-sm rounded-xl border border-ink-200/40">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h4 className="font-serif font-semibold text-ink-900 mb-1">{item.title}</h4>
              <p className="text-sm text-ink-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Unsubscribe link */}
        <div className="text-center">
          <p className="text-sm text-ink-400">
            You can unsubscribe at any time. 
            <span className="text-ink-500 hover:text-ink-700 cursor-pointer underline ml-1">
              Manage all email preferences
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Local helper to avoid import complexity
function cn(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(' ')
}
