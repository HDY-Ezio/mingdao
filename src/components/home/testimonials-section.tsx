import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    id: 1,
    quote:
      "My Bazi reading was incredibly insightful. It helped me understand patterns in my career that I'd been struggling with for years. The guidance felt deeply personal and true.",
    author: 'Sarah M.',
    role: 'Marketing Director',
    location: 'New York',
    rating: 5,
    service: 'Bazi Reading',
  },
  {
    id: 2,
    quote:
      "I've tried many astrology services, but Mingdao's Purple Star reading is on another level. The depth and accuracy of the palace analysis genuinely surprised me.",
    author: 'James L.',
    role: 'Software Engineer',
    location: 'San Francisco',
    rating: 5,
    service: 'Purple Star Astrology',
  },
  {
    id: 3,
    quote:
      "The I Ching readings have become my weekly ritual. When I'm facing a difficult decision, the guidance always brings clarity. It's like having a wise mentor always available.",
    author: 'Elena R.',
    role: 'Yoga Instructor',
    location: 'London',
    rating: 5,
    service: 'I Ching Divination',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-ink-900 text-ink-100 relative overflow-hidden">
      {/* Star pattern background */}
      <div className="absolute inset-0 constellation-pattern opacity-20" aria-hidden="true" />
      
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-ink-900 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink-900 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow text-gold-400 mb-4 block">Testimonials</span>
          <h2 className="heading-h2 text-white mb-4">
            Voices from Our Community
          </h2>
          <p className="text-ink-400 leading-relaxed">
            Thousands of seekers have found clarity and direction through our readings.
            Here's what some of them share.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-ink-800/50 border-ink-700/50 backdrop-blur-sm hover:bg-ink-800/70 transition-colors"
            >
              <CardContent className="pt-8">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-gold-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-ink-200 leading-relaxed mb-6 text-sm">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-serif text-white font-medium text-sm">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-ink-500">
                      {testimonial.role} · {testimonial.location}
                    </p>
                  </div>
                  <span className="text-xs text-gold-400/70 bg-gold-400/10 px-2 py-1 rounded">
                    {testimonial.service}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
