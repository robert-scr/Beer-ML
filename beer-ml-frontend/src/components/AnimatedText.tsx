'use client'

import { useEffect, useState } from 'react'

interface AnimatedTextProps {
  children: string
  className?: string
  delay?: number
  staggerDelay?: number
}

export default function AnimatedText({ 
  children, 
  className = '',
  delay = 0,
  staggerDelay = 0.1 
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const words = children.split(' ')

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-1000 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionDelay: `${index * staggerDelay}s`
          }}
        >
          {word}
          {index < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  )
}
