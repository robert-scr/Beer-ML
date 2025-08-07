'use client'

import dynamic from 'next/dynamic'

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
  selectedLocation?: { lat: number; lng: number } | null
}

// Create dynamic component for LocationPicker to avoid SSR issues
const DynamicLocationPicker = dynamic(
  () => import('./LocationPickerClient'),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 glass-card rounded-3xl flex items-center justify-center border border-white/10">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v3m6.364.636l-2.121 2.121M21 12h-3M18.364 18.364l-2.121-2.121M12 21v-3M5.636 18.364l2.121-2.121M3 12h3M5.636 5.636l2.121 2.121" />
            </svg>
          </div>
          <p className="text-white/60 font-light">Initializing interactive map...</p>
        </div>
      </div>
    )
  }
) as React.ComponentType<LocationPickerProps>

export default function LocationPicker(props: LocationPickerProps) {
  return <DynamicLocationPicker {...props} />
}
