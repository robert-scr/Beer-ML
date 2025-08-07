'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = []
      
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 10 + 8,
          delay: Math.random() * 8
        })
      }
      
      setParticles(newParticles)
    }

    generateParticles()
  }, [])

  return (
    <div className="floating-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      
      {/* Morphing background blobs */}
      <div 
        className="morphing-background"
        style={{
          top: '10%',
          left: '15%',
          animationDelay: '0s'
        }}
      />
      <div 
        className="morphing-background"
        style={{
          bottom: '10%',
          right: '15%',
          animationDelay: '7s'
        }}
      />
      <div 
        className="morphing-background"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animationDelay: '14s'
        }}
      />
    </div>
  )
}
