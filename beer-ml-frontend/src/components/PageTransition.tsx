'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    if (children !== displayChildren) {
      setIsTransitioning(true)
      
      const timer = setTimeout(() => {
        setDisplayChildren(children)
        setIsTransitioning(false)
      }, 300)
      
      return () => clearTimeout(timer)
    }
  }, [children, displayChildren])

  return (
    <div className="relative">
      {/* Premium page transition overlay */}
      <div className={`fixed inset-0 z-50 pointer-events-none transition-all duration-500 ${
        isTransitioning 
          ? 'opacity-100' 
          : 'opacity-0'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-black/95 to-blue-900/90 backdrop-blur-sm">
          {/* Ultra-premium loading animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-card rounded-3xl p-8">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full border-2 border-purple-500/30"></div>
                <div className="absolute inset-0 rounded-full border-2 border-t-purple-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border border-blue-400/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
              </div>
            </div>
          </div>
          
          {/* Liquid morphing background */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse loading-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-2xl animate-pulse loading-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Page content with transition effects */}
      <div className={`transition-all duration-500 ${
        isTransitioning 
          ? 'opacity-0 scale-95 blur-sm' 
          : 'opacity-100 scale-100 blur-0'
      }`}>
        {displayChildren}
      </div>
    </div>
  )
}
