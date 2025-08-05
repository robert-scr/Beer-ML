'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBeerRatingStore } from '@/store/beerRatingStore'
import LocationPicker from '@/components/LocationPicker'

export default function ProfilePage() {
  const router = useRouter()
  const { profile, setProfile } = useBeerRatingStore()
  
  const [formData, setFormData] = useState({
    age: profile.age?.toString() || '',
    gender: profile.gender || '',
    latitude: profile.latitude,
    longitude: profile.longitude,
  })

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Setup</h1>
          <p className="text-gray-600 mb-8">
            Please provide some basic information about yourself and select your location on the map.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300  text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your age"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home location
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Click on the map to select the location where you are based. This helps us understand regional preferences.
              </p>
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation}
              />
              {selectedLocation && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continue to Taste Preferences
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
