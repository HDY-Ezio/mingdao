import type { Metadata } from 'next'
import Link from 'next/link'
import { DiagonalBackground } from '@/components/layout/diagonal-background'

export const metadata: Metadata = {
  title: 'Wisdom Journal',
  description:
    'Explore articles on Bazi, Purple Star Astrology, I Ching, and Eastern philosophy. Insights from ancient wisdom traditions for modern life.',
}

const posts = [
  {
    slug: 'understanding-bazi-four-pillars',
    title: 'Understanding the Four Pillars: A Beginner\'s Guide to Bazi',
    excerpt:
      'Discover what Bazi (八字) really is, how the four pillars are calculated, and why your day master says about your nature and life path.',
    category: 'Bazi',
    date: 'December 15, 2024',
    readTime: '8 min read',
    featured: true,
  },
  {
    slug: 'purple-star-vs-bazi',
    title: 'Purple Star vs. Bazi: Which Astrology System is Right for You?',
    excerpt:
      'Both are profound systems reveal your destiny, but through different lenses. Learn which one to start with, and how they complement each other.',
    category: 'Purple Star',
    date: 'December 10, 2024',
    readTime: '6 min read',
  },
  {
    slug: 'i-ching-how-to-ask',
    title: 'How to Ask the I Ching: The Art of Formulating Your Question',
    excerpt:
      'The quality of your reading depends on the quality of your question. Here\'s how to ask the ancient oracle in a way that brings true clarity.',
    category: 'I Ching',
    date: 'December 5, 2024',
    readTime: '5 min read',
  },
  {
    slug: 'five-elements-balance',
    title: 'The Five Elements: Finding Balance in Your Life',
    excerpt:
      'Wood, Fire, Earth, Metal, Water — the five elements that shape everything. Learn how understanding them can bring harmony to your daily life.',
    category: 'Philosophy',
    date: 'November 28, 2024',
    readTime: '7 min read',
  },
  {
    slug: 'yin-yang-modern-life',
    title: 'Yin and Yang in Modern Life: Beyond the Symbol',
    excerpt:
      'Yin and Yang is more than a symbol — it\'s a way of seeing the world. How this ancient concept can help you navigate modern challenges.',
    category: 'Philosophy',
    date: 'November 20, 2024',
    readTime: '6 min read',
  },
  {
    slug: 'twenty-eight-mansions',
    title: 'The Twenty-Eight Mansions: Stars of the Chinese Sky',
    excerpt:
      'Long before Western constellations, Chinese astronomers mapped the sky into twenty-eight mansions. Discover how they shape destiny.',
    category: 'Astrology',
    date: 'November 12, 2024',
    readTime: '9 min read',
  },
]

const categories = ['All', 'Bazi', 'Purple Star', 'I Ching', 'Philosophy', 'Astrology']

export default function BlogPage() {
  const featuredPost = posts.find(p => p.featured)
  const otherPosts = posts.filter(p => !p.featured)

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <DiagonalBackground
          className="absolute inset-0"
          constellationOpacity={0.1}
          symbolOpacity={0.06}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow text-gold-700 mb-4 block">Wisdom Journal</span>
          <h1 className="heading-h1 text-ink-900 mb-6">
            Insights from Ancient Wisdom
          </h1>
          <p className="text-lg text-ink-600 leading-relaxed max-w-2xl mx-auto">
            Reflections on Bazi, astrology, philosophy, and the art of living in
            alignment with the patterns of heaven and earth.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-y border-ink-200/60 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat, index) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  index === 0
                    ? 'bg-ink-900 text-white'
                    : 'text-ink-600 hover:bg-ink-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Image placeholder */}
                <div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-ink-800 to-ink-900 relative overflow-hidden group-hover:shadow-ink-xl transition-shadow">
                  <div className="absolute inset-0 constellation-pattern opacity-30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="seal-stamp mx-auto mb-3">
                        易
                      </div>
                      <p className="font-serif text-white/60 text-sm">Featured Article</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:pl-8">
                  <span className="eyebrow text-gold-700 mb-3 block">
                    {featuredPost.category}
                  </span>
                  <h2 className="heading-h2 text-ink-900 mb-4 group-hover:text-gold-700 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-ink-600 leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-ink-500">
                    <span>{featuredPost.date}</span>
                    <span>·</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Post Grid */}
      <section className="pb-20 md:pb-28 bg-paper-warm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white/80 rounded-2xl border border-ink-100 overflow-hidden hover:shadow-ink-lg transition-all hover:-translate-y-1"
              >
                {/* Image placeholder */}
                <div className="aspect-[16/9] bg-gradient-to-br from-ink-100 to-ink-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center">
                      <span className="font-serif text-ink-500 text-lg">
                        {post.category.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <span className="eyebrow text-gold-700 mb-2 block">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-ink-900 mb-3 group-hover:text-gold-700 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-ink-600 leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-ink-500">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load more */}
          <div className="mt-12 text-center">
            <button className="px-8 py-3 rounded-full border border-ink-300 text-ink-700 hover:bg-ink-50 transition-colors text-sm font-medium">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 md:py-24 bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 constellation-pattern opacity-15" />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-h2 mb-4">
            Weekly Wisdom
          </h2>
          <p className="text-ink-300 mb-8 leading-relaxed">
            Receive a weekly dose of Eastern wisdom, delivered to your inbox. Insights from the I Ching,
            astrological guidance, and practices for living in alignment.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg bg-ink-800 border border-ink-700 text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-500 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 text-white font-medium hover:from-gold-400 hover:to-gold-500 transition-all"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-ink-500 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  )
}
