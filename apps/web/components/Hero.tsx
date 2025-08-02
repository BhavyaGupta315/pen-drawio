import {Button} from '@repo/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Create & Draw
              <span className="block bg-gradient-to-r from-gray-300 to-gray-900 bg-clip-text text-transparent">
                Without Limits
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl">
              Transform your ideas into beautiful drawings and diagrams with our drawing tool. Perfect for designers, developers, and creative minds.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/signup">
                    <Button variant="default" size="lg" className="group">
                        Get Started
                        <ArrowRight className='group-hover:translate-x-1 transition-transform'/>
                    </Button>
                </Link>
                <Link href='/dashboard'>
                    <Button variant="outline" size="lg">
                        Dashboard
                    </Button>
                </Link>
                <Link href='signin'>
                    <Button variant="ghost" size="lg">
                        Sign In
                    </Button>
                </Link>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                Free to use
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                No downloads
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-black rounded-full mr-2"></div>
                Real-time sync
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-gray-500 to-gray-900 rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-square bg-black rounded-xl p-6 relative overflow-hidden">
                <div className="absolute inset-4">
                  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                    <path d="M20 50 Q 50 20, 80 50 T 140 50" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <path d="M30 100 L 170 100 L 150 130 L 50 130 Z" stroke="white"/>
                    <circle cx="60" cy="160" r="15" stroke="white"/>
                    <circle cx="100" cy="160" r="15" stroke="gray"/>
                    <circle cx="140" cy="160" r="15" stroke="#F1F0E4"/>
                    <path d="M20 180 Q 100 150, 180 180" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                </div>
                
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 flex space-x-2">
                  <div className="w-6 h-6 bg-purple-500 rounded"></div>
                  <div className="w-6 h-6 bg-orange-500 rounded"></div>
                  <div className="w-6 h-6 bg-green-500 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}