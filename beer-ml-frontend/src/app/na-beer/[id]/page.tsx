'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useBeerRatingStore } from '@/store/beerRatingStore'
import { NON_ALCOHOLIC_BEER_LIST } from '@/lib/constants'
import { submitBeerRating, BeerRatingPayload } from '@/lib/api'

export default function NonAlcoholicBeerPage() {
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

  // Parse beer ID from URL (A-J format)
  const beerIdParam = params.id as string
  const beerLetter = beerIdParam.toUpperCase()
  const beerIndex = beerLetter.charCodeAt(0) - 65 // Convert A=0, B=1, etc.

  // Validate beer ID
  const isValidBeer = beerIndex >= 0 && beerIndex < NON_ALCOHOLIC_BEER_LIST.length
  const currentBeer = isValidBeer ? NON_ALCOHOLIC_BEER_LIST[beerIndex] : null

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
              <h1 className="text-2xl font-bold text-red-600 mb-4">Non-Alcoholic Beer Not Found</h1>
              <p className="text-gray-600 mb-6">
                The non-alcoholic beer you&apos;re looking for doesn&apos;t exist.
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
        beer_name: `Beer ${beerLetter}`,
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
              <span>Non-Alcoholic Beer {beerLetter} of {NON_ALCOHOLIC_BEER_LIST.length}</span>
              {isCompleted && (
                <span className="text-green-600 font-medium">✓ Completed</span>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hasSubmitted || isCompleted ? 'Rating Submitted' : 'Rate This Non-Alcoholic Beer'}
          </h1>
          <p className="text-gray-600 mb-8">
            {hasSubmitted || isCompleted 
              ? 'Thank you for rating this non-alcoholic beer. You can update your rating below if needed.'
              : 'Please rate how much you would like this type of non-alcoholic beer on a scale from 1 to 10.'
            }
          </p>

          {/* Beer Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-900">
                Non-Alcoholic Beer {beerLetter}
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
            
            <div className="text-blue-700">
              <p className="mb-2">
                <strong>Type:</strong> Non-Alcoholic Beer
              </p>
              <p>
                This is a simulation - please rate how much you think you would enjoy this type of non-alcoholic beer.
              </p>
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                How much would you like this non-alcoholic beer?
              </label>
              
              <div className="space-y-4">
                {/* Current Rating Display */}
                <div className="text-center">
                  <span className="text-3xl font-bold text-blue-600">{rating}</span>
                  <span className="text-lg text-gray-500 ml-2">/ 10</span>
                </div>

                {/* Rating Slider */}
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>1 - Strongly Dislike</span>
                    <span>10 - Strongly Like</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <span key={i + 1}>{i + 1}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                onClick={handleSubmitRating}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : hasSubmitted || isCompleted
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : hasSubmitted || isCompleted ? (
                  'Update Rating'
                ) : (
                  'Submit Rating'
                )}
              </button>
            </div>
          </div>

          {/* Success Message */}
          {(hasSubmitted || isCompleted) && !error && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Rating Submitted Successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Thank you for rating Non-Alcoholic Beer {beerLetter}. Continue with the remaining non-alcoholic beers or return to the dashboard.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
          box-shadow: 0 0 2px 0 #555;
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 2px 0 #555;
        }
      `}</style>
    </div>
  )
}
