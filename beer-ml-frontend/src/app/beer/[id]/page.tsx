'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useBeerRatingStore } from '@/store/beerRatingStore'
import { BEER_LIST } from '@/lib/constants'
import { submitBeerRating, BeerRatingPayload } from '@/lib/api'

export default function BeerPage() {
  const router = useRouter()
  const params = useParams()
  const {
    userId,
    profile,
    preferences,
    completedBeers,
    isSubmitting,
    setBeerCompleted,
    setIsSubmitting,
    getCompletionStatus,
  } = useBeerRatingStore()

  const [rating, setRating] = useState(5)
  const [error, setError] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Parse beer ID from URL
  const beerIdParam = params.id as string
  const beerNumber = parseInt(beerIdParam)
  const beerIndex = beerNumber - 1

  // Validate beer ID
  const isValidBeer = beerNumber >= 1 && beerNumber <= BEER_LIST.length
  const currentBeer = isValidBeer ? BEER_LIST[beerIndex] : null

  // Redirect if profile or preferences are not complete
  useEffect(() => {
    if (!profile.age || !profile.gender || !profile.latitude || !profile.longitude) {
      router.push('/profile')
    } else if (!preferences.beer_frequency || preferences.drinks_alcohol === undefined) {
      router.push('/preferences')
    }
  }, [profile, preferences, router])

  // Don't render if profile or preferences are incomplete or invalid beer
  if (!profile.age || !profile.gender || !profile.latitude || !profile.longitude || !preferences.beer_frequency || preferences.drinks_alcohol === undefined || !isValidBeer || !currentBeer) {
    if (!isValidBeer) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Beer Not Found</h1>
              <p className="text-gray-600 mb-6">
                The beer you&apos;re looking for doesn&apos;t exist.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const isCompleted = completedBeers[beerIndex]
  const { completed, total } = getCompletionStatus()

  const handleSubmitRating = async () => {
    if (!profile.age || !profile.latitude || !profile.longitude) {
      setError('Profile information is incomplete')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const payload: BeerRatingPayload = {
        user_id: userId,
        beer_name: `Beer ${beerNumber}`,
        rating,
        age: profile.age,
        gender: profile.gender,
        latitude: profile.latitude,
        longitude: profile.longitude,
        dark_white_chocolate: preferences.dark_white_chocolate,
        curry_cucumber: preferences.curry_cucumber,
        vanilla_lemon: preferences.vanilla_lemon,
        caramel_wasabi: preferences.caramel_wasabi,
        blue_mozzarella: preferences.blue_mozzarella,
        sparkling_sweet: preferences.sparkling_sweet,
        barbecue_ketchup: preferences.barbecue_ketchup,
        tropical_winter: preferences.tropical_winter,
        early_night: preferences.early_night,
        beer_frequency: preferences.beer_frequency,
        drinks_alcohol: preferences.drinks_alcohol,
      }

      await submitBeerRating(payload)
      setBeerCompleted(beerIndex)
      setHasSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/dashboard"
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <div className="text-sm text-gray-500">
              {completed}/{total} Completed
            </div>
          </div>

          {/* Progress for this specific beer */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Beer {beerNumber} of {BEER_LIST.length}</span>
              {isCompleted && (
                <span className="text-green-600 font-medium">✓ Completed</span>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hasSubmitted || isCompleted ? 'Rating Submitted' : 'Rate This Beer'}
          </h1>
          <p className="text-gray-600 mb-8">
            {hasSubmitted || isCompleted 
              ? 'Thank you for rating this beer. You can update your rating below if needed.'
              : 'Please rate how much you would like this type of beer on a scale from 1 to 10.'
            }
          </p>

          {/* Beer Information */}
          <div className="text-center mb-8">
                      {/* Beer Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-900">
                Beer {beerNumber}
              </h2>
              {isCompleted && (
                <div className="flex items-center text-green-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="text-blue-700 text-center">
              <div className="text-4xl mb-3">🍺</div>
              <p className="text-lg font-medium mb-2">Beer {beerNumber}</p>
              <p>Please rate how much you would like this type of beer.</p>
            </div>
          </div>
          </div>

          {/* Success Message */}
          {(hasSubmitted || isCompleted) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p className="text-green-800">
                  Your rating for {currentBeer} has been recorded successfully!
                </p>
              </div>
            </div>
          )}

          {/* Rating Slider */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Your Rating</h3>
                <span className="text-2xl font-bold text-blue-600">{rating}/10</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Dislike</span>
                  <span>Love it</span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                
                <div className="flex justify-between text-xs text-gray-400">
                  {Array.from({ length: 10 }, (_, i) => (
                    <span key={i + 1}>{i + 1}</span>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSubmitRating}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : hasSubmitted || isCompleted ? (
                  'Update Rating'
                ) : (
                  'Submit Rating'
                )}
              </button>
              
              {(hasSubmitted || isCompleted) && (
                <Link
                  href="/dashboard"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md text-center transition duration-200"
                >
                  Back to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 0 4px 0 #555;
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 4px 0 #555;
        }
      `}</style>
    </div>
  )
}
