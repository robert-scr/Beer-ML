'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBeerRatingStore } from '@/store/beerRatingStore'
import { BEER_LIST, NON_ALCOHOLIC_BEER_LIST } from '@/lib/constants'

export default function DashboardPage() {
  const router = useRouter()
  const { profile, preferences, completedBeers, getCompletionStatus, setSurveyEndedEarly } = useBeerRatingStore()
  const [isVisible, setIsVisible] = useState(false)

  // Redirect if profile or preferences are not complete
  useEffect(() => {
    if (!profile.age || !profile.gender || !profile.latitude || !profile.longitude) {
      router.push('/profile')
    } else if (!preferences.beer_frequency || preferences.drinks_alcohol === undefined) {
      router.push('/preferences')
    } else {
      setIsVisible(true)
    }
  }, [profile, preferences, router])

  // Don't render if profile or preferences are incomplete
  if (!profile.age || !profile.gender || !profile.latitude || !profile.longitude || !preferences.beer_frequency || preferences.drinks_alcohol === undefined) {
    return null
  }

  const { completed, total } = getCompletionStatus()
  const progressPercentage = (completed / total) * 100

  // Determine which beer list and routing to use based on alcohol preference
  const drinksAlcohol = preferences.drinks_alcohol
  const beerList = drinksAlcohol ? BEER_LIST : NON_ALCOHOLIC_BEER_LIST
  const beerRoutePrefix = drinksAlcohol ? '/beer/' : '/na-beer/'

  const handleEndSurveyEarly = () => {
    if (completed === 0) {
      alert(`Please rate at least one ${drinksAlcohol ? 'beer' : 'non-alcoholic beer'} before ending the survey.`)
      return
    }
    
    const confirmed = window.confirm(
      `Are you sure you want to end the survey early? You have only completed ${completed} out of ${total} ${drinksAlcohol ? 'beer' : 'non-alcoholic beer'} ratings. Your partial data will still be valuable for our research.`
    )
    
    if (confirmed) {
      setSurveyEndedEarly(true)
      router.push('/complete')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Progress indicator */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="glass-surface rounded-full px-6 py-3 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-white/80 text-sm font-light">Step 3 of 3</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extralight mb-6 tracking-tight">
              <span className="text-shimmer">{drinksAlcohol ? 'Beer' : 'Non-Alcoholic'}</span>
              <br />
              <span className="text-white/60">Evaluation Center</span>
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed">
              Rate each {drinksAlcohol ? 'beer' : 'non-alcoholic beer'} variety to complete your taste profile research
            </p>
          </div>

          {/* Progress Overview */}
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-light text-white mb-2">Progress Overview</h2>
                <p className="text-white/60">Track your evaluation journey</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="glass-surface px-6 py-3 rounded-2xl border border-white/10">
                  <span className="text-2xl font-light text-blue-400">
                    {completed}
                  </span>
                  <span className="text-white/40 mx-2">/</span>
                  <span className="text-white/60">
                    {total}
                  </span>
                  <span className="text-white/40 ml-2 text-sm">complete</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-4">
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-white/60 text-sm">
                  {completed === total 
                    ? `🎉 All evaluations completed!` 
                    : `${total - completed} ${drinksAlcohol ? 'beer' : 'non-alcoholic beer'}${total - completed !== 1 ? 's' : ''} remaining`
                  }
                </p>
                <span className="text-blue-400 text-sm font-medium">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
            
            {/* End Survey Early Option */}
            {completed > 0 && completed < total && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-white/80 mb-2">
                      Want to conclude early?
                    </p>
                    <p className="text-white/60 text-sm leading-relaxed">
                      Your partial data is valuable for our research and will be included in the analysis.
                    </p>
                  </div>
                  <button
                    onClick={handleEndSurveyEarly}
                    className="glass-button-secondary text-orange-400 border-orange-400/30 hover:border-orange-400/50 py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    End Survey Early
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Beer Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beerList.map((beer, index) => {
              const isCompleted = completedBeers[index]
              const beerLabel = drinksAlcohol ? `Beer ${index + 1}` : `Beer ${String.fromCharCode(65 + index)}`

              return (
                <div
                  key={beer}
                  className={`group glass-card rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] ${
                    isCompleted
                      ? 'border-green-400/30'
                      : 'hover:border-blue-400/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-light text-white">
                      {beerLabel}
                    </h3>
                    {isCompleted && (
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-400/30">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center mb-8">
                    <div className="text-4xl mb-4 opacity-60">🍺</div>
                    <p className="text-white/60 text-sm font-light">
                      {isCompleted ? 'Evaluation completed' : 'Ready for evaluation'}
                    </p>
                  </div>
                  
                  <Link
                    href={`${beerRoutePrefix}${drinksAlcohol ? index + 1 : String.fromCharCode(65 + index)}`}
                    className={`block w-full text-center py-4 px-6 rounded-2xl font-medium transition-all duration-300 ${
                      isCompleted
                        ? 'glass-button-secondary text-green-400 border-green-400/30 hover:border-green-400/50'
                        : 'glass-button text-white hover:scale-105'
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
            <div className="text-center mt-16">
              <div className="glass-card rounded-3xl p-12 inline-block">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-2xl font-light text-white mb-4">Study Complete!</h3>
                <p className="text-white/60 mb-8 max-w-md">
                  Thank you for completing all evaluations. Your data contributes to valuable taste preference research.
                </p>
                <Link
                  href="/complete"
                  className="glass-button text-white text-lg font-medium py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  View Study Summary
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
