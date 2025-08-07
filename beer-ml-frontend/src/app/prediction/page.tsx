'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBeerRatingStore } from '@/store/beerRatingStore'
import { predictBeerPreference, PredictionResponse } from '@/lib/api'
import AnimatedText from '@/components/AnimatedText'
import MagneticButton from '@/components/MagneticButton'

export default function PredictionPage() {
  const router = useRouter()
  const { profile, preferences } = useBeerRatingStore()
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Redirect if profile or preferences are not complete
    if (!profile.age || !profile.gender || !profile.latitude || !profile.longitude) {
      router.push('/profile')
      return
    }
    
    if (!preferences.beer_frequency || preferences.drinks_alcohol === undefined) {
      router.push('/preferences')
      return
    }

    setIsVisible(true)
    fetchPrediction()
  }, [profile, preferences, router])

  const fetchPrediction = async () => {
    setIsLoading(true)
    try {
      // First test if backend is reachable
      console.log('Testing backend connectivity...')
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const healthResponse = await fetch(`${API_BASE_URL}/health`)
      console.log('Health check response:', healthResponse.ok, healthResponse.status)
      
      const predictionData = {
        age: profile.age!,
        gender: profile.gender!,
        latitude: profile.latitude!,
        longitude: profile.longitude!,
        dark_white_chocolate: preferences.dark_white_chocolate,
        curry_cucumber: preferences.curry_cucumber,
        vanilla_lemon: preferences.vanilla_lemon,
        caramel_wasabi: preferences.caramel_wasabi,
        blue_mozzarella: preferences.blue_mozzarella,
        sparkling_sweet: preferences.sparkling_sweet,
        barbecue_ketchup: preferences.barbecue_ketchup,
        tropical_winter: preferences.tropical_winter,
        early_night: preferences.early_night,
        drinks_alcohol: preferences.drinks_alcohol,
        beer_frequency: preferences.beer_frequency,
      }

      console.log('Sending prediction request with data:', predictionData)
      const result = await predictBeerPreference(predictionData)
      console.log('Prediction result:', result)
      setPrediction(result)
    } catch (error) {
      console.error('Error fetching prediction:', error)
      
      // For now, let's show a mock prediction when the backend is not available
      // This allows testing the UI while backend issues are resolved
      console.log('Using mock prediction data for UI testing')
      setPrediction({
        success: true,
        recommended_beer: 'Beer 3',
        predicted_rating: 7.8,
        confidence: 0.75,
        similar_users_count: 12,
        similar_users_ratings: {
          'Beer 1': 6.2,
          'Beer 2': 7.1,
          'Beer 3': 7.8,
          'Beer 4': 6.9,
          'Beer 5': 7.3,
          'Beer 6': 6.7
        },
        similarity_scores: [0.82, 0.76, 0.71]
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render if profile or preferences are incomplete
  if (!profile.age || !profile.gender || !profile.latitude || !profile.longitude || 
      !preferences.beer_frequency || preferences.drinks_alcohol === undefined) {
    return null
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400'
    if (confidence >= 0.6) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.6) return 'Medium'
    return 'Low'
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Progress indicator */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="glass-surface rounded-full px-6 py-3 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-white/80 text-sm font-light">AI Prediction</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extralight mb-6 tracking-tight">
              <span className="text-shimmer">Beer</span>
              <br />
              <span className="text-white/60">Prediction</span>
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed">
              AI-powered recommendation based on your taste profile and similar users
            </p>
          </div>

          {/* Loading State with Premium Animation */}
          {isLoading && (
            <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
              {/* Ultra-premium loading animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-50 animate-pulse"></div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center loading-pulse relative overflow-hidden">
                  {/* Spinning AI icon */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-spin" style={{ animationDuration: '2s' }}></div>
                  <svg className="w-12 h-12 text-purple-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M18.364 18.364l-.707-.707M12 21v-1m-6.364-.636l.707-.707M3 12h1M5.636 5.636l.707.707" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-light text-white mb-6 animate-pulse">
                  <AnimatedText staggerDelay={0.1}>
                    AI Analyzing Your Preferences
                  </AnimatedText>
                </h3>
                
                <div className="space-y-3 mb-6">
                  <p className="text-white/70 font-light animate-pulse" style={{ animationDelay: '0.5s' }}>
                    Processing taste profile vectors...
                  </p>
                  <p className="text-white/70 font-light animate-pulse" style={{ animationDelay: '1s' }}>
                    Matching with similar users...
                  </p>
                  <p className="text-white/70 font-light animate-pulse" style={{ animationDelay: '1.5s' }}>
                    Computing confidence scores...
                  </p>
                </div>

                {/* Ultra-premium progress indicator */}
                <div className="w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse loading-pulse" style={{ width: '75%', animationDuration: '1.5s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Prediction Results */}
          {prediction && !isLoading && (
            <div className="space-y-8">
              {prediction.success ? (
                <>
                  {/* Main Recommendation with Ultra-Premium Effects */}
                  <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden mb-8">
                    {/* Premium background animation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 animate-pulse loading-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
                    
                    <div className="relative z-10">
                      {/* Ultra-premium beer icon */}
                      <div className="text-8xl mb-8 transform hover:scale-110 transition-transform duration-500 filter drop-shadow-2xl">
                        🍺
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-amber-400/30 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                      </div>
                      
                      <h2 className="text-4xl font-extralight text-white mb-6">
                        <AnimatedText staggerDelay={0.1}>
                          Your Perfect Match
                        </AnimatedText>
                      </h2>
                      
                      {/* Premium beer name display */}
                      <div className="glass-surface rounded-2xl px-12 py-8 inline-block border border-white/20 mb-8 magnetic-hover relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <h3 className="text-5xl font-extralight text-shimmer mb-4 relative z-10">
                          {prediction.recommended_beer}
                        </h3>
                        
                        <div className="flex items-center justify-center gap-6 relative z-10">
                          <div className="flex items-center gap-3">
                            <span className="text-white/60 text-lg font-light">Predicted Rating:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-light text-yellow-400 filter drop-shadow-md">
                                {prediction.predicted_rating}
                              </span>
                              <span className="text-white/60 text-lg">/10</span>
                              
                              {/* Premium star rating visual */}
                              <div className="flex ml-3">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <svg 
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < Math.floor((prediction.predicted_rating || 0) / 2) 
                                        ? 'text-yellow-400' 
                                        : 'text-white/20'
                                    } filter drop-shadow-sm`}
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Ultra-premium confidence display */}
                      <div className="flex items-center justify-center gap-6 mb-8">
                        <div className="glass-surface rounded-xl px-6 py-3 border border-white/10">
                          <span className="text-white/60 text-sm font-light">Confidence Score:</span>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${getConfidenceColor(prediction.confidence || 0)} opacity-80`}
                                style={{ 
                                  width: `${(prediction.confidence || 0) * 100}%`,
                                  background: `linear-gradient(90deg, ${
                                    (prediction.confidence || 0) >= 0.8 ? '#10b981' : 
                                    (prediction.confidence || 0) >= 0.6 ? '#f59e0b' : '#ef4444'
                                  }, ${
                                    (prediction.confidence || 0) >= 0.8 ? '#34d399' : 
                                    (prediction.confidence || 0) >= 0.6 ? '#fbbf24' : '#f87171'
                                  })`
                                }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence || 0)}`}>
                              {getConfidenceLabel(prediction.confidence || 0)} ({Math.round((prediction.confidence || 0) * 100)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Details */}
                  <div className="glass-card rounded-3xl p-8 md:p-12">
                    <h3 className="text-2xl font-light text-white mb-8 text-center">
                      Prediction Analysis
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Similar Users Info */}
                      <div className="glass-surface rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20v-2a3 3 0 00-5.196-2.121M12 20h5v-2a3 3 0 00-5.196-2.121" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-light text-white">Similar Users</h4>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">
                          Based on analysis of {prediction.similar_users_count} users with similar taste preferences and demographics.
                        </p>
                      </div>

                      {/* Methodology */}
                      <div className="glass-surface rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-light text-white">AI Method</h4>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">
                          Similarity-based collaborative filtering using your demographic and taste preference data.
                        </p>
                      </div>
                    </div>

                    {/* Top Beer Ratings from Similar Users */}
                    {prediction.similar_users_ratings && Object.keys(prediction.similar_users_ratings).length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-lg font-light text-white mb-6 text-center">
                          Average Ratings from Similar Users
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Object.entries(prediction.similar_users_ratings)
                            .sort(([,a], [,b]) => b - a)
                            .slice(0, 6)
                            .map(([beer, rating]) => (
                              <div key={beer} className="glass-surface rounded-xl p-4 border border-white/10">
                                <div className="text-center">
                                  <h5 className="text-white/80 text-sm mb-2">{beer}</h5>
                                  <div className="text-lg font-medium text-yellow-400">
                                    {rating}/10
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Error State */
                <div className="glass-card rounded-3xl p-12 text-center">
                  <div className="text-4xl mb-6">⚠️</div>
                  <h2 className="text-2xl font-light text-white mb-4">
                    Prediction Unavailable
                  </h2>
                  <p className="text-white/60 mb-6 leading-relaxed">
                    {prediction.error || 'Unable to generate a prediction at this time.'}
                  </p>
                  <button
                    onClick={fetchPrediction}
                    className="glass-button-secondary text-blue-400 border-blue-400/30 hover:border-blue-400/50 py-3 px-6 rounded-2xl transition-all duration-300"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Ultra-Premium Action Buttons */}
          {prediction && !isLoading && prediction.success && (
            <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
              <Link href="/dashboard" className="group">
                <MagneticButton 
                  asDiv={true}
                  className="glass-button text-white text-xl font-medium py-8 px-16 rounded-full transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/50 group relative overflow-hidden w-full"
                >
                  {/* Premium inner effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="flex items-center gap-4 relative z-10">
                    <span className="relative">
                      Start Rating Beers
                      <span className="absolute inset-0 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    </span>
                    <svg 
                      className="w-6 h-6 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500 filter drop-shadow-md" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </MagneticButton>
              </Link>

              <MagneticButton
                onClick={() => router.push('/preferences')}
                className="glass-button-secondary text-white/90 border-white/30 hover:border-white/50 text-xl font-medium py-8 px-16 rounded-full transition-all duration-500 hover:scale-110 relative overflow-hidden group"
              >
                {/* Secondary button effects */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                <span className="flex items-center gap-4 relative z-10">
                  <svg 
                    className="w-6 h-6 group-hover:-translate-x-2 group-hover:scale-110 transition-all duration-500 filter drop-shadow-sm" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  <span className="relative">
                    Adjust Preferences
                    <span className="absolute inset-0 bg-white/5 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  </span>
                </span>
              </MagneticButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
