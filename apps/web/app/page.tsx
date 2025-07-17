import { Button } from '@repo/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
      <div className="text-5xl font-bold text-center text-gray-800 mb-4">
        Pen Draw IO
      </div>
      <p className="text-lg text-gray-600 text-center max-w-xl mb-8">
        A real-time collaborative whiteboard tool, inspired by Excalidraw. Draw, sketch, and brainstorm together from anywhere.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/signup">
          <Button variant='default' size='lg'>
            Signup
          </Button>
        </Link>

        <Link href="/signin">
          <Button variant='default' size='lg'>
            Signin
          </Button>
        </Link>
      </div>
    </div>
  )
}
