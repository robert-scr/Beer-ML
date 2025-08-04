'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBeerRatingStore } from '@/store/beerRatingStore'
import { BEER_LIST } from '@/lib/constants'

export default function DashboardPage() {
  const router = useRouter()
  const { profile, completedBeers, getCompletionStatus, setSurveyEndedEarly } = useBeerRatingStore()

  // Redirect if profile or preferences are not complete
  useEffect(() => {
    if (!profile.age || !profile.gender || !profile.latitude || !profile.longitude) {
      router.push('/profile')
    }
  }, [profile, router])

  // Don't render if profile is incomplete
  if (!profile.age || !profile.gender || !profile.latitude || !profile.longitude) {
    return null
  }

  const { completed, total } = getCompletionStatus()
  const progressPercentage = (completed / total) * 100

  const handleEndSurveyEarly = () => {
    if (completed === 0) {
      alert('Please rate at least one beer before ending the survey.')
      return
    }
    
    const confirmed = window.confirm(
      `Are you sure you want to end the survey early? You have only completed ${completed} out of ${total} beer ratings. Your partial data will still be valuable for our research.`
    )
    
    if (confirmed) {
      setSurveyEndedEarly(true)
      router.push('/complete')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Beer Rating Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Rate each beer type below. You can complete them in any order and return to this page anytime.
          </p>

          {/* Progress Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-900">Progress Overview</h2>
              <span className="text-lg font-bold text-blue-700">
                {completed}/{total} Complete
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-blue-700 text-sm">
              {completed === total 
                ? '🎉 All beers completed! Thank you for your participation.' 
                : `${total - completed} beer${total - completed !== 1 ? 's' : ''} remaining`
              }
            </p>
            
            {/* End Survey Early Button */}
            {completed > 0 && completed < total && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-blue-600 text-sm mb-2">
                  Don't want to rate all beers? You can end the survey early.
                </p>
                <button
                  onClick={handleEndSurveyEarly}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  End Survey Early
                </button>
              </div>
            )}
          </div>

          {/* Beer Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BEER_LIST.map((beer, index) => {
              const isCompleted = completedBeers[index]
              const beerNumber = index + 1

              return (
                <div
                  key={beer}
                  className={`border rounded-lg p-6 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Beer {beerNumber}
                    </h3>
                    {isCompleted && (
                      <div className="flex items-center text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 font-medium mb-4">{beer}</p>
                  
                  <Link
                    href={`/beer/${beerNumber}`}
                    className={`inline-block w-full text-center py-2 px-4 rounded-md font-medium transition duration-200 ${
                      isCompleted
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isCompleted ? 'Review Rating' : 'Rate This Beer'}
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Completion Actions */}
          {completed === total && (
            <div className="mt-8 text-center">
              <Link
                href="/complete"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
              >
                View Study Summary
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
