'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers with custom styling
import L from 'leaflet'
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl

// Custom marker icon with modern styling
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="#007AFF" stroke="#ffffff" stroke-width="2" opacity="0.9"/>
      <circle cx="16" cy="16" r="6" fill="#ffffff"/>
      <circle cx="16" cy="16" r="3" fill="#007AFF"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})

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
      
      // Smooth animation to new position
      map.flyTo([newPosition.lat, newPosition.lng], map.getZoom(), {
        duration: 0.5
      })
    },
  })

  useEffect(() => {
    if (selectedLocation) {
      setPosition(selectedLocation)
      map.flyTo([selectedLocation.lat, selectedLocation.lng], map.getZoom(), {
        duration: 1
      })
    }
  }, [selectedLocation, map])

  return position === null ? null : (
    <Marker 
      position={[position.lat, position.lng]} 
      icon={customIcon}
    />
  )
}

export default function LocationPickerClient({ onLocationSelect, selectedLocation }: LocationPickerProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="h-80 glass-card rounded-3xl overflow-hidden border border-white/10 relative">
      {/* Modern overlay for instructions */}
      <div className="absolute top-4 left-4 z-[1000] glass-surface rounded-2xl px-4 py-2 border border-white/10">
        <p className="text-white/80 text-sm font-light flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Tap to select location
        </p>
      </div>

      <MapContainer
        center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [52.5200, 13.4050]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        className="rounded-3xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          className="grayscale contrast-125 brightness-75"
        />
        <LocationMarker onLocationSelect={onLocationSelect} selectedLocation={selectedLocation} />
      </MapContainer>

      {/* Custom zoom controls with glass effect */}
      <style jsx global>{`
        .leaflet-control-zoom {
          border: none !important;
        }
        .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          font-weight: 300 !important;
          border-radius: 12px !important;
          margin: 2px !important;
          transition: all 0.2s ease !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05) !important;
        }
        .leaflet-container {
          background: transparent !important;
        }
      `}</style>
    </div>
  )
}
