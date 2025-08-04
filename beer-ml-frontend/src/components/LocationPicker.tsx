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
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }
) as React.ComponentType<LocationPickerProps>

export default function LocationPicker(props: LocationPickerProps) {
  return <DynamicLocationPicker {...props} />
}
