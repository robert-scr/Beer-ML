'use client'

import { useEffect, useRef } from 'react'

interface GlowCursorProps {
  color?: string
}

export default function GlowCursor({ color = 'rgba(147, 51, 234, 0.6)' }: GlowCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY

      // Move main cursor
      cursor.style.left = `${x}px`
      cursor.style.top = `${y}px`

      // Create trail effect
      trailRefs.current.forEach((trail, index) => {
        if (trail) {
          setTimeout(() => {
            trail.style.left = `${x}px`
            trail.style.top = `${y}px`
          }, index * 20)
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed w-6 h-6 pointer-events-none z-50 mix-blend-difference"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(1px)'
        }}
      />
      
      {/* Trail elements */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailRefs.current[i] = el
          }}
          className="fixed pointer-events-none z-40 mix-blend-difference"
          style={{
            width: `${20 - i * 2}px`,
            height: `${20 - i * 2}px`,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.7 - i * 0.1,
            filter: `blur(${i + 1}px)`
          }}
        />
      ))}
    </>
  )
}
