"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import type { GPSPoint } from "@/lib/mock-data"

function FitBounds({ points }: { points: GPSPoint[] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, points])
  return null
}

export default function MapView({ points }: { points: GPSPoint[] }) {
  const ref = useRef<L.Map | null>(null)
  const path: [number, number][] = points.map((p) => [p.latitude, p.longitude])
  const center: [number, number] =
    points.length > 0 ? [points[0].latitude, points[0].longitude] : [40.7128, -74.006]

  return (
    <MapContainer
      ref={ref}
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Polyline
        positions={path}
        pathOptions={{
          color: "oklch(0.78 0.16 70)",
          weight: 2.5,
          opacity: 0.85,
          dashArray: "4 4",
        }}
      />
      {points.map((p, idx) => {
        const isAnomaly = p.speed === 0 && idx > 0 && idx < points.length - 1
        return (
          <CircleMarker
            key={p.id}
            center={[p.latitude, p.longitude]}
            radius={6}
            pathOptions={{
              color: isAnomaly ? "oklch(0.65 0.22 25)" : "oklch(0.78 0.16 70)",
              fillColor: isAnomaly ? "oklch(0.65 0.22 25)" : "oklch(0.78 0.16 70)",
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <div className="font-mono text-[10px]">
                <div className="font-semibold">#{idx + 1} · {p.timestamp}</div>
                <div>
                  {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                </div>
                <div>{p.speed} km/h · ±{p.accuracy}m</div>
              </div>
            </Tooltip>
          </CircleMarker>
        )
      })}
      <FitBounds points={points} />
    </MapContainer>
  )
}
