'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBeerRatingStore } from '@/store/beerRatingStore'
import { TASTE_PREFERENCES, BEER_FREQUENCY_OPTIONS } from '@/lib/constants'

export default function PreferencesPage() {
  const router = useRouter()
  const { profile, preferences, setPreferences } = useBeerRatingStore()
  
  const [formData, setFormData] = useState(preferences)

  // Redirect if profile is not complete
  useEffect(() => {
    if (!profile.age || !profile.gender || !profile.latitude || !profile.longitude) {
      router.push('/profile')
    }
  }, [profile, router])

  // Don't render if profile is incomplete
  if (!profile.age || !profile.gender || !profile.latitude || !profile.longitude) {
    return null
  }

  const handleSliderChange = (key: keyof typeof preferences, value: number) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSelectChange = (key: keyof typeof preferences, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleCheckboxChange = (key: keyof typeof preferences, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [key]: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPreferences(formData)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Taste Preferences</h1>
          <p className="text-gray-600 mb-8">
            Please indicate your preferences on the following scales. After this, you&apos;ll be able to rate beers individually at your own pace.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Slider-based preferences */}
            {TASTE_PREFERENCES.map((preference, index) => (
              <div key={preference.key} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {index + 1}. {preference.label}
                  </h3>
                  <span className="text-sm font-medium text-gray-500">
                    {formData[preference.key] as number}/10
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{preference.leftLabel}</span>
                    <span>{preference.rightLabel}</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData[preference.key] as number}
                      onChange={(e) => handleSliderChange(preference.key, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      {Array.from({ length: 11 }, (_, i) => (
                        <span key={i}>{i}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Beer frequency dropdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                10. How often do you drink beer?
              </h3>
              <select
                value={formData.beer_frequency}
                onChange={(e) => handleSelectChange('beer_frequency', e.target.value)}
                className="w-full p-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {BEER_FREQUENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Alcohol consumption checkbox */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                11. Alcohol Consumption
              </h3>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="drinks_alcohol"
                  checked={formData.drinks_alcohol}
                  onChange={(e) => handleCheckboxChange('drinks_alcohol', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="drinks_alcohol" className="text-gray-700">
                  I drink alcohol
                </label>
              </div>
            </div>

            <div className="pt-6">
                          <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continue to Beer Dashboard
            </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 0 2px 0 #555;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
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
