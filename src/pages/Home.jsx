import { useEffect } from 'react'
import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import ValuesBar from '../components/ValuesBar.jsx'
import Categories from '../components/Categories.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import StorySection from '../components/StorySection.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Newsletter from '../components/Newsletter.jsx'
import InstagramGrid from '../components/InstagramGrid.jsx'
import Footer from '../components/Footer.jsx'

export default function Home() {
  // Reveal on scroll — se activa después de que React renderiza el DOM
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ValuesBar />
        <Categories />
        <ProductGrid />
        <StorySection />
        <Testimonials />
        <Newsletter />
        <InstagramGrid />
      </main>
      <Footer />
    </>
  )
}
