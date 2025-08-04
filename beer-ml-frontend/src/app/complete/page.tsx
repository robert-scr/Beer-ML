'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBeerRatingStore } from '@/store/beerRatingStore'

export default function CompletePage() {
  const router = useRouter()
  const { reset, surveyEndedEarly, getCompletionStatus } = useBeerRatingStore()

  // Reset the store when the component mounts
  useEffect(() => {
    reset()
  }, [reset])

  const { completed, total } = getCompletionStatus()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {surveyEndedEarly ? 'Survey Ended Early' : 'Study Complete!'}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            {surveyEndedEarly 
              ? `Thank you for participating in our beer preference study! You completed ${completed} out of ${total} beer ratings. Even partial data is valuable for our research and will help us understand taste preferences across different demographics.`
              : 'Thank you for participating in our beer preference study. Your responses have been successfully recorded and will help us understand taste preferences across different demographics.'
            }
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-800">
              <strong>What happens next?</strong><br />
              Your data will be anonymized and used for research purposes only. The results may be published in academic papers or used to improve product recommendations.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Dashboard
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Return to Home
            </button>
            
            <button
              onClick={() => router.push('/profile')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Start New Session
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
