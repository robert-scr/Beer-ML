'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'

// Import Leaflet CSS - this is crucial for proper map display
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Next.js
import L from 'leaflet'

// Fix marker icons issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Create a custom premium marker icon
const createCustomIcon = () => new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="#ffffff" stroke-width="3" opacity="0.9"/>
      <circle cx="16" cy="16" r="8" fill="#ffffff"/>
      <circle cx="16" cy="16" r="4" fill="#3B82F6"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
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
      icon={createCustomIcon()}
    />
  )
}

export default function LocationPickerClient({ onLocationSelect, selectedLocation }: LocationPickerProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Ensure map loads properly with a small delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return (
      <div className="h-80 glass-card rounded-3xl flex items-center justify-center border border-white/10">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center loading-pulse">
            <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v3m6.364.636l-2.121 2.121M21 12h-3M18.364 18.364l-2.121-2.121M12 21v-3M5.636 18.364l2.121-2.121M3 12h3M5.636 5.636l2.121 2.121" />
            </svg>
          </div>
          <p className="text-white/60 font-light">Loading interactive map...</p>
        </div>
      </div>
    )
  }

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
        style={{ 
          height: '100%', 
          width: '100%',
          borderRadius: '1.5rem'
        }}
        zoomControl={true}
        className="map-container"
      >
        {/* Primary OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
          maxZoom={19}
          minZoom={3}
        />
        
        {/* Alternative dark tiles as fallback */}
        {/* 
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          className="map-tiles-dark"
        />
        */}
        <LocationMarker onLocationSelect={onLocationSelect} selectedLocation={selectedLocation} />
      </MapContainer>

      {/* Enhanced styling for premium map appearance */}
      <style jsx global>{`
        /* Map container styling */
        .map-container {
          border-radius: 1.5rem !important;
          overflow: hidden !important;
        }
        
        /* Ensure map tiles load properly */
        .leaflet-container {
          background: #1f2937 !important;
          font-family: inherit !important;
          border-radius: 1.5rem !important;
        }
        
        /* Dark theme map tiles */
        .map-tiles {
          filter: invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.2) !important;
        }
        
        /* Zoom controls with glassmorphism */
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          backdrop-filter: blur(10px) !important;
          background: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        }
        
        .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          font-weight: 300 !important;
          text-decoration: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 40px !important;
          height: 40px !important;
          line-height: 1 !important;
          font-size: 18px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border-radius: 0 !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
        }
        
        .leaflet-control-zoom-in {
          border-top-left-radius: 12px !important;
          border-top-right-radius: 12px !important;
          margin-bottom: 1px !important;
        }
        
        .leaflet-control-zoom-out {
          border-bottom-left-radius: 12px !important;
          border-bottom-right-radius: 12px !important;
        }
        
        /* Attribution styling */
        .leaflet-control-attribution {
          background: rgba(0, 0, 0, 0.3) !important;
          color: rgba(255, 255, 255, 0.7) !important;
          font-size: 11px !important;
          backdrop-filter: blur(10px) !important;
          border-radius: 8px !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          padding: 4px 8px !important;
        }
        
        .leaflet-control-attribution a {
          color: rgba(147, 197, 253, 0.8) !important;
        }
        
        /* Marker styling */
        .leaflet-marker-icon {
          filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.4)) !important;
        }
        
        /* Ensure map loads properly */
        .leaflet-container img {
          max-width: none !important;
        }
        
        .leaflet-tile-container {
          pointer-events: auto !important;
        }
        
        .leaflet-tile {
          border-radius: 0 !important;
        }
      `}</style>
    </div>
  )
}
