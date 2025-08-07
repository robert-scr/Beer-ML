'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      icon: "👤",
      title: "Profile Setup",
      description: "Provide demographics and select your location with our interactive map interface",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: "🎯", 
      title: "Taste Preferences",
      description: "Answer curated questions about your culinary preferences using our intelligent system",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: "⭐",
      title: "Rate Beers",
      description: "Experience our premium rating interface across multiple beer categories",
      gradient: "from-amber-500/20 to-orange-500/20"
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-7xl md:text-8xl font-extralight mb-6 tracking-tight">
              <span className="text-shimmer">Beer</span>
              <br />
              <span className="font-medium bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Preference
              </span>
              <br />
              <span className="text-white/80">Study</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed">
              A revolutionary approach to understanding taste preferences through 
              <span className="text-white/80 font-medium"> advanced sensory analysis</span> and 
              <span className="text-white/80 font-medium"> machine learning</span>
            </p>
          </div>

          {/* Premium CTA */}
          <div className="mb-20">
            <button
              onClick={() => router.push('/profile')}
              className="group glass-button text-white text-lg font-medium py-6 px-12 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              <span className="flex items-center gap-3">
                Begin Experience
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
        </div>

        {/* Process Steps */}
        <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`glass-card rounded-3xl p-8 transition-all duration-500 hover:scale-105 cursor-pointer ${
                  activeStep === index ? 'ring-2 ring-blue-500/50' : ''
                }`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 transition-all duration-300`}>
                  <span className="text-3xl">{step.icon}</span>
                </div>
                
                <h3 className="text-2xl font-medium text-white mb-4">
                  {step.title}
                </h3>
                
                <p className="text-white/60 leading-relaxed">
                  {step.description}
                </p>

                <div className="mt-6 flex items-center text-blue-400 font-medium">
                  <span className="text-sm">Step {index + 1}</span>
                  <div className="ml-auto w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-xs">{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Details */}
        <div className={`transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-medium text-white mb-4">Study Specifications</h2>
              <p className="text-white/60 text-lg">Designed for precision and participant comfort</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Duration</h4>
                    <p className="text-white/60 text-sm">10-15 minutes of focused interaction</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Flexibility</h4>
                    <p className="text-white/60 text-sm">Complete at your own pace, resume anytime</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Privacy</h4>
                    <p className="text-white/60 text-sm">Completely anonymous data collection</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Format</h4>
                    <p className="text-white/60 text-sm">Individual pages for each beer variety</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Purpose</h4>
                    <p className="text-white/60 text-sm">Academic research on consumer preferences</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Control</h4>
                    <p className="text-white/60 text-sm">Stop and resume participation at will</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-white/40 text-sm font-light">
            Voluntary participation • Anonymous data • Research ethics approved
          </p>
        </div>
      </div>
    </div>
  )
}
