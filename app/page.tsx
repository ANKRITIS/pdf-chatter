import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

export default function Home() {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
      <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
        <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        ⚡ AI-Powered Study Platform • Now Live
        </p>
      </div>
      
      <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
      Transform PDFs into <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">Interactive Learning</span>
      </h1>
      
      <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
      Upload any document and unlock instant AI-powered insights. 
      <span className="font-semibold text-purple-600">Ask questions, generate flashcards, study smarter.</span>
      </p>

      <Link href="/dashboard">
        <Button size="lg" className="mt-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
        Start Learning Free <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>

      {/* Feature Cards */}
      <div className="mx-auto mt-32 max-w-5xl sm:mt-40">
        <div className="grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-bold text-gray-900">⚡ Lightning-Fast Answers</h3>
            <p className="mt-2 text-base text-gray-500">
              Get answers from your PDFs instantly using AI
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-bold text-gray-900">🧠 Smart Study Cards</h3>
            <p className="mt-2 text-base text-gray-500">
              Create study flashcards from your documents automatically
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-bold text-gray-900">🔒 Private & Security</h3>
            <p className="mt-2 text-base text-gray-500">
              Your documents are encrypted and only accessible to you
            </p>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}