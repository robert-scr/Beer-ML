'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBeerRatingStore } from '@/store/beerRatingStore'
import { TASTE_PREFERENCES, BEER_FREQUENCY_OPTIONS } from '@/lib/constants'

export default function PreferencesPage() {
  const router = useRouter()
  const { profile, preferences, setPreferences } = useBeerRatingStore()
  const [isVisible, setIsVisible] = useState(false)
  
  const [formData, setFormData] = useState(preferences)

  // Redirect if profile is not complete
  useEffect(() => {
    if (!profile.age || !profile.gender || !profile.latitude || !profile.longitude) {
      router.push('/profile')
    } else {
      setIsVisible(true)
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Progress indicator */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="glass-surface rounded-full px-6 py-3 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-white/80 text-sm font-light">Step 2 of 3</span>
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extralight mb-6 tracking-tight">
              <span className="text-shimmer">Taste</span>
              <br />
              <span className="text-white/60">Preferences</span>
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed">
              Help us understand your palate by setting your taste preferences and drinking habits
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Slider-based preferences */}
            <div className="glass-card rounded-3xl p-8 md:p-12 space-y-12">
              {TASTE_PREFERENCES.map((preference, index) => (
                <div 
                  key={preference.key} 
                  className={`space-y-6 transition-all duration-500 delay-${index * 100}`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-light text-white">
                      <span className="text-white/40 mr-3">{String(index + 1).padStart(2, '0')}</span>
                      {preference.label}
                    </h3>
                    <div className="glass-surface px-4 py-2 rounded-full border border-white/10">
                      <span className="text-blue-400 font-medium">
                        {formData[preference.key] as number}
                      </span>
                      <span className="text-white/40 text-sm ml-1">/10</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-white/60 font-light">
                      <span>{preference.leftLabel}</span>
                      <span>{preference.rightLabel}</span>
                    </div>
                    
                    <div className="relative group">
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={formData[preference.key] as number}
                          onChange={(e) => handleSliderChange(preference.key, parseInt(e.target.value))}
                          className="premium-slider w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer backdrop-blur-sm border border-white/5"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      <div className="flex justify-between text-xs text-white/30 mt-2">
                        {Array.from({ length: 11 }, (_, i) => (
                          <span 
                            key={i}
                            className={`transition-colors duration-200 ${
                              (formData[preference.key] as number) === i ? 'text-blue-400' : ''
                            }`}
                          >
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional preferences */}
            <div className="glass-card rounded-3xl p-8 md:p-12 space-y-8">
              {/* Beer frequency dropdown */}
              <div className="space-y-6">
                <h3 className="text-xl font-light text-white">
                  <span className="text-white/40 mr-3">10</span>
                  How often do you drink beer?
                </h3>
                <div className="relative">
                  <select
                    value={formData.beer_frequency}
                    onChange={(e) => handleSelectChange('beer_frequency', e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 appearance-none"
                  >
                    {BEER_FREQUENCY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-gray-900 text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Alcohol consumption checkbox */}
              <div className="space-y-6">
                <h3 className="text-xl font-light text-white">
                  <span className="text-white/40 mr-3">11</span>
                  Alcohol Consumption
                </h3>
                <label className="flex items-center space-x-4 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="drinks_alcohol"
                      checked={formData.drinks_alcohol}
                      onChange={(e) => handleCheckboxChange('drinks_alcohol', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 ${
                      formData.drinks_alcohol 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'bg-white/5 border-white/20 group-hover:border-white/40'
                    }`}>
                      {formData.drinks_alcohol && (
                        <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-white/80 font-light">I consume alcoholic beverages</span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
              <button
                type="button"
                onClick={() => {
                  setPreferences(formData)
                  router.push('/prediction')
                }}
                className="group glass-button-secondary text-blue-400 border-blue-400/30 hover:border-blue-400/50 text-lg font-medium py-6 px-12 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <span className="flex items-center gap-3">
                  <svg 
                    className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M18.364 18.364l-.707-.707M12 21v-1m-6.364-.636l.707-.707M3 12h1M5.636 5.636l.707.707" />
                  </svg>
                  Get Beer Prediction
                </span>
              </button>
              
              <button
                type="submit"
                className="group glass-button text-white text-lg font-medium py-6 px-12 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                <span className="flex items-center gap-3">
                  Start Beer Evaluation
                  <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .premium-slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
          transition: all 0.2s ease;
        }

        .premium-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(59, 130, 246, 0.5);
        }

        .premium-slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
          transition: all 0.2s ease;
        }

        .premium-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(59, 130, 246, 0.5);
        }

        .premium-slider::-webkit-slider-track {
          background: linear-gradient(
            to right,
            rgba(59, 130, 246, 0.3) 0%,
            rgba(59, 130, 246, 0.3) calc(var(--value, 5) * 10%),
            rgba(255, 255, 255, 0.1) calc(var(--value, 5) * 10%),
            rgba(255, 255, 255, 0.1) 100%
          );
        }
      `}</style>
    </div>
  )
}
