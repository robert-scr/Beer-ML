'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AnimatedText from '@/components/AnimatedText'
import MagneticButton from '@/components/MagneticButton'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    const handleScroll = () => setScrollY(window.scrollY)
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ultra-premium hero section */}
      <div className="max-w-6xl mx-auto text-center relative z-20">
        
        {/* Dynamic floating logo with parallax */}
        <div 
          className={`mb-12 transition-all duration-2000 ease-out ${
            isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'
          }`}
          style={{
            transform: `translateX(${mousePosition.x * 0.5}px) translateY(${mousePosition.y * 0.5 + scrollY * 0.1}px) scale(${isVisible ? 1 : 0.95})`
          }}
        >
          <div className="glass-card rounded-3xl p-8 mx-auto w-fit loading-pulse magnetic-hover">
            <div className="text-7xl md:text-8xl font-extralight mb-4 filter drop-shadow-2xl">
              🍺
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
          </div>
        </div>

        {/* Ultra-dynamic main heading with staggered animation */}
        <div className="mb-8 relative">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight tracking-tight leading-none mb-6 relative z-10">
            <div style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
              <AnimatedText className="text-shimmer block" delay={500} staggerDelay={0.2}>
                Beer
              </AnimatedText>
            </div>
            <div style={{ transform: `translateY(${scrollY * -0.03}px)` }}>
              <AnimatedText className="text-gradient block" delay={1000} staggerDelay={0.15}>
                Preference
              </AnimatedText>
            </div>
            <div style={{ transform: `translateY(${scrollY * 0.02}px)` }}>
              <AnimatedText className="text-white/80 block" delay={1500} staggerDelay={0.1}>
                Study
              </AnimatedText>
            </div>
          </h1>
          
          {/* Premium subtitle with liquid effect */}
          <div className={`transition-all duration-1500 delay-2000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/70 font-light leading-relaxed max-w-4xl mx-auto relative">
              Experience the future of taste research with 
              <span className="text-shimmer font-medium relative mx-2">
                AI-powered predictions
                <div className="absolute inset-0 bg-purple-500/30 blur-lg rounded-full opacity-30 animate-pulse"></div>
              </span>
              and ultra-premium design
            </p>
          </div>
        </div>

        {/* Ultra-premium floating features with magnetic effects */}
        <div className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1500 delay-2500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          {[
            { icon: '🤖', title: 'AI Predictions', desc: 'Advanced similarity algorithms', gradient: 'from-blue-500/20 to-cyan-500/20' },
            { icon: '✨', title: 'Premium Design', desc: 'Ultra-modern glassmorphism', gradient: 'from-purple-500/20 to-pink-500/20' },
            { icon: '⚡', title: 'Real-time', desc: 'Instant recommendation engine', gradient: 'from-amber-500/20 to-orange-500/20' }
          ].map((feature, index) => (
            <div 
              key={index}
              className="glass-card rounded-2xl p-8 magnetic-hover relative overflow-hidden group"
              style={{
                transform: `translateY(${mousePosition.y * (0.1 + index * 0.05)}px) translateX(${mousePosition.x * 0.05}px)`,
                animationDelay: `${index * 0.3}s`
              }}
            >
              {/* Dynamic gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
              
              <div className="relative z-10">
                <div className="text-4xl mb-4 filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-white mb-2 group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ultra-premium call-to-action with magnetic interaction */}
        <div className={`transition-all duration-1500 delay-3000 ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}>
          <Link href="/profile" className="inline-block">
            <MagneticButton className="glass-button text-white text-xl font-medium py-6 px-12 rounded-full transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-500/50 group relative overflow-hidden">
              {/* Premium inner glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              <span className="flex items-center gap-4 relative z-10">
                <span className="relative">
                  Begin Your Journey
                  <span className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </span>
                <svg 
                  className="w-6 h-6 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500 filter drop-shadow-md" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </MagneticButton>
          </Link>
        </div>

        {/* Ultra-subtle floating status indicators */}
        <div className={`mt-12 text-white/40 text-sm transition-all duration-2000 delay-3500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse loading-pulse"></div>
              <span className="font-light">AI Engine Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse loading-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span className="font-light">Premium Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse loading-pulse" style={{ animationDelay: '1s' }}></div>
              <span className="font-light">Real-time Processing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-premium ambient lighting with mouse tracking */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 0.1}% ${50 + mousePosition.y * 0.1}%, 
                      rgba(147, 51, 234, 0.15) 0%, 
                      rgba(79, 70, 229, 0.08) 40%, 
                      rgba(59, 130, 246, 0.05) 70%,
                      transparent 90%)`
        }}
      />

      {/* Premium floating orbs with enhanced effects */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse loading-pulse" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-2xl animate-pulse loading-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-20 w-20 h-20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse loading-pulse" style={{ animationDelay: '4s' }}></div>
    </div>
  )
}
