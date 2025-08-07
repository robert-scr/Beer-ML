'use client'

import { useEffect, useState } from 'react'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  asDiv?: boolean // New prop to render as div instead of button
}

export default function MagneticButton({ 
  children, 
  className = '', 
  onClick,
  disabled = false,
  type = 'button',
  asDiv = false
}: MagneticButtonProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    setMousePosition({ x: x * 0.3, y: y * 0.3 })
  }

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
  }

  const commonProps = {
    className: `magnetic-hover ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: onClick,
    style: {
      transform: isHovered && !disabled
        ? `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)`
        : 'translate(0px, 0px) scale(1)'
    }
  }

  if (asDiv) {
    return (
      <div {...commonProps}>
        {children}
      </div>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      {...commonProps}
    >
      {children}
    </button>
  )
}
