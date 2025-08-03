import { Button } from '@repo/ui/button'
import { Pencil } from 'lucide-react'
import Link from 'next/link'


export default function Header() {
  return (
    <header className="relative z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-black to-black rounded-lg flex items-center justify-center">
              <Pencil className='text-white w-5'/>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r bg-clip-text">
              pen-drawio
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-500 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-gray-500 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="#contact" className="text-gray-500 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href={"/signin"}>
                <Button variant="ghost" size="sm">
                Sign In
                </Button>
            </Link>
            <Link href={"/signup"}>
                <Button variant="default" size="sm">
                Sign Up
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}