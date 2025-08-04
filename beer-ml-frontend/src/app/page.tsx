'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🍺 Beer Preference Study
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us understand taste preferences by rating different types of beer. 
            Your participation contributes to research on consumer preferences and demographics.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Do</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Profile Setup</h3>
              <p className="text-gray-600 text-sm">
                Provide basic demographics and select your location on a map
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Taste Preferences</h3>
              <p className="text-gray-600 text-sm">
                Answer 10 questions about your food and drink preferences
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Rate Beers</h3>
              <p className="text-gray-600 text-sm">
                Access individual beer pages to rate each of the 10 beer types
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Study Details</h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>• Takes approximately 10-15 minutes to complete</li>
              <li>• Complete beers in any order at your own pace</li>
              <li>• Each beer has its own dedicated page (e.g., /beer_1, /beer_2)</li>
              <li>• All data is collected anonymously</li>
              <li>• Results are used for research purposes only</li>
              <li>• You can stop at any time and resume later</li>
            </ul>
          </div>

          <button
            onClick={() => router.push('/profile')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-4 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start the Study
          </button>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>This study is conducted for research purposes. Your participation is voluntary and anonymous.</p>
        </div>
      </div>
    </div>
  )
}
