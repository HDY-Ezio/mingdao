import { HeroSection } from '@/components/home/hero-section'
import { ServicesSection } from '@/components/home/services-section'
import { WhyUsSection } from '@/components/home/why-us-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { FaqSection } from '@/components/home/faq-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  )
}
