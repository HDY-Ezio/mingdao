import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DiagonalBackground } from '@/components/layout/diagonal-background'
import { getBlogPost, getAllPosts } from '@/lib/blog-posts'
import { Calendar, Clock, User, ArrowLeft, ChevronRight } from 'lucide-react'

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  
  if (!post) {
    return { title: 'Article Not Found' }
  }
  
  return {
    title: `${post.title} | Mingdao Wisdom Journal`,
    description: post.excerpt,
    keywords: [post.category, 'Mingdao', 'Bazi', 'Chinese Astrology'],
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }

  // Parse markdown-style content (basic)
  const renderContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let listItems: string[] = []
    let paragraphLines: string[] = []
    
    const flushParagraph = (key: number) => {
      if (paragraphLines.length > 0) {
        elements.push(
          <p key={`p-${key}`} className="text-ink-700 leading-relaxed mb-6 text-[17px]">
            {paragraphLines.join(' ')}
          </p>
        )
        paragraphLines = []
      }
    }
    
    const flushList = (key: number, ordered: boolean) => {
      if (listItems.length > 0) {
        const ListTag = ordered ? 'ol' : 'ul'
        elements.push(
          <ListTag key={`list-${key}`} className={`text-ink-700 mb-6 ml-6 space-y-2 ${ordered ? 'list-decimal' : 'list-disc'}`}>
            {listItems.map((item, i) => (
              <li key={i} className="leading-relaxed">{item}</li>
            ))}
          </ListTag>
        )
        listItems = []
      }
    }
    
    let key = 0
    let inTable = false
    let tableRows: string[][] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Skip empty lines
      if (!line) {
        flushParagraph(key++)
        flushList(key++, false)
        flushList(key++, true)
        continue
      }
      
      // Table detection
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          flushParagraph(key++)
          inTable = true
          tableRows = []
        }
        const cells = line.split('|').filter(c => c.trim() !== '').map(c => c.trim())
        // Skip separator rows
        if (!cells.every(c => /^[-:]+$/.test(c))) {
          tableRows.push(cells)
        }
        continue
      } else if (inTable) {
        // Render table
        if (tableRows.length > 0) {
          const [headers, ...rows] = tableRows
          elements.push(
            <div key={`table-${key++}`} className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-ink-200 rounded-lg overflow-hidden text-sm">
                <thead className="bg-ink-50">
                  <tr>
                    {headers.map((h, hi) => (
                      <th key={hi} className="px-4 py-3 text-left font-semibold text-ink-800 border-b border-ink-200">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-ink-100 last:border-b-0">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-3 text-ink-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        inTable = false
        tableRows = []
      }
      
      // Headings
      if (line.startsWith('## ')) {
        flushParagraph(key++)
        flushList(key++, false)
        elements.push(
          <h2 key={`h2-${key++}`} className="text-2xl font-serif font-semibold text-ink-900 mt-10 mb-4">
            {line.replace('## ', '')}
          </h2>
        )
        continue
      }
      
      if (line.startsWith('### ')) {
        flushParagraph(key++)
        flushList(key++, false)
        elements.push(
          <h3 key={`h3-${key++}`} className="text-xl font-serif font-semibold text-ink-900 mt-8 mb-3">
            {line.replace('### ', '')}
          </h3>
        )
        continue
      }
      
      // Unordered list items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        flushParagraph(key++)
        listItems.push(line.substring(2))
        continue
      }
      
      // Ordered list items
      if (/^\d+\.\s/.test(line)) {
        flushParagraph(key++)
        listItems.push(line.replace(/^\d+\.\s/, ''))
        continue
      }
      
      // Blockquote
      if (line.startsWith('> ')) {
        flushParagraph(key++)
        flushList(key++, false)
        elements.push(
          <blockquote key={`q-${key++}`} className="border-l-4 border-gold-500 pl-6 py-2 my-6 italic text-ink-600 bg-gold-50/30 rounded-r-lg">
            {line.replace('> ', '')}
          </blockquote>
        )
        continue
      }
      
      // Bold text
      const formattedLine = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code class="bg-ink-100 px-1 py-0.5 rounded text-sm">$1</code>')
      
      paragraphLines.push(formattedLine)
    }
    
    flushParagraph(key++)
    flushList(key++, false)
    
    // Handle remaining table
    if (inTable && tableRows.length > 0) {
      const [headers, ...rows] = tableRows
      elements.push(
        <div key={`table-end`} className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-ink-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-ink-50">
              <tr>
                {headers.map((h, hi) => (
                  <th key={hi} className="px-4 py-3 text-left font-semibold text-ink-800 border-b border-ink-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-ink-100 last:border-b-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-ink-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    
    return elements
  }

  return (
    <article className="min-h-[calc(100vh-5rem)]">
      {/* Hero */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <DiagonalBackground className="absolute inset-0" constellationOpacity={0.08} symbolOpacity={0.04} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-ink-500 hover:text-ink-700 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
            Back to Wisdom Journal
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-800">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-ink-900 leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-ink-500 text-sm">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1.5" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5" />
              {post.date}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              {post.readTime}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </div>
        </div>
      </section>

      {/* Related / CTA */}
      <section className="py-16 bg-paper-warm border-t border-ink-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-serif text-2xl font-semibold text-ink-900 mb-3">
            Explore Your Own Chart
          </h3>
          <p className="text-ink-600 mb-6 max-w-xl mx-auto">
            Ready to discover what your birth chart reveals about your path? 
            Generate your free Bazi reading in seconds.
          </p>
          <Link
            href="/bazi"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-700 text-white font-medium hover:from-gold-700 hover:to-gold-800 transition-all shadow-lg shadow-gold-600/20"
          >
            Generate Your Free Chart
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>
    </article>
  )
}
