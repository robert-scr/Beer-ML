'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBeerRatingStore } from '@/store/beerRatingStore'
import LocationPicker from '@/components/LocationPicker'

export default function ProfilePage() {
  const router = useRouter()
  const { profile, setProfile } = useBeerRatingStore()
  const [isVisible, setIsVisible] = useState(false)
  
  const [formData, setFormData] = useState({
    age: profile.age?.toString() || '',
    gender: profile.gender || '',
    latitude: profile.latitude,
    longitude: profile.longitude,
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.age || !formData.gender || !formData.latitude || !formData.longitude) {
      alert('Please fill in all fields and select a location on the map.')
      return
    }

    setProfile({
      age: parseInt(formData.age),
      gender: formData.gender,
      latitude: formData.latitude,
      longitude: formData.longitude,
    })

    router.push('/preferences')
  }

  const selectedLocation = formData.latitude && formData.longitude 
    ? { lat: formData.latitude, lng: formData.longitude }
    : null

  const genderOptions = [
    { value: '', label: 'Select your gender identity', disabled: true },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Progress indicator */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="glass-surface rounded-full px-6 py-3 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-white/80 text-sm font-light">Step 1 of 3</span>
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extralight mb-6 tracking-tight">
              <span className="text-shimmer">Profile</span>
              <br />
              <span className="text-white/60">Setup</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
              Share your essential details to personalize your research experience
            </p>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="glass-card rounded-3xl p-8 md:p-12">
              {/* Age Input */}
              <div className="mb-8">
                <label htmlFor="age" className="block text-lg font-light text-white mb-4">
                  Age
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="age"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-white/40 backdrop-blur-sm transition-all duration-300"
                    placeholder="Enter your age"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Gender Select */}
              <div className="mb-8">
                <label htmlFor="gender" className="block text-lg font-light text-white mb-4">
                  Gender Identity
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 appearance-none"
                    required
                  >
                    {genderOptions.map((option) => (
                      <option 
                        key={option.value} 
                        value={option.value}
                        disabled={option.disabled}
                        className="bg-gray-900 text-white"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Location Section */}
              <div>
                <label className="block text-lg font-light text-white mb-4">
                  Home Location
                </label>
                <p className="text-white/60 mb-6 leading-relaxed">
                  Select your location to help us understand regional taste preferences and cultural influences on beer enjoyment.
                </p>
                
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                />
                
                {selectedLocation && (
                  <div className="mt-6 glass-surface rounded-2xl px-6 py-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white/80 text-sm font-light">
                        Location confirmed: {selectedLocation.lat.toFixed(4)}°, {selectedLocation.lng.toFixed(4)}°
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="group glass-button text-white text-lg font-medium py-6 px-12 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                <span className="flex items-center gap-3">
                  Continue to Preferences
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
    </div>
  )
}
