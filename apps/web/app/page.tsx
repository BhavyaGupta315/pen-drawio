import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-400">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </main>
  )
}