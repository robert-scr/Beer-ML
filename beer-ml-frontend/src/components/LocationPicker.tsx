'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers
import L from 'leaflet'
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
  selectedLocation?: { lat: number; lng: number } | null
}

function LocationMarker({ onLocationSelect, selectedLocation }: LocationPickerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    selectedLocation || null
  )

  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      const newPosition = { lat: e.latlng.lat, lng: e.latlng.lng }
      setPosition(newPosition)
      onLocationSelect(newPosition.lat, newPosition.lng)
    },
  })

  useEffect(() => {
    if (selectedLocation) {
      setPosition(selectedLocation)
      map.setView([selectedLocation.lat, selectedLocation.lng], map.getZoom())
    }
  }, [selectedLocation, map])

  return position === null ? null : <Marker position={[position.lat, position.lng]} />
}

// Create dynamic component for LocationPicker to avoid SSR issues
const DynamicLocationPicker = dynamic(() => Promise.resolve(LocationPickerComponent), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
})

function LocationPickerComponent({ onLocationSelect, selectedLocation }: LocationPickerProps) {
  return (
    <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [52.5200, 13.4050]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} selectedLocation={selectedLocation} />
      </MapContainer>
    </div>
  )
}

export default DynamicLocationPicker
