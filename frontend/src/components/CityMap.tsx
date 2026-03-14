'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { getBuildings, mockBuildings, Building } from '@/lib/api'

const riskColors = ['#00ff88', '#ffb800', '#ff3366']
const riskLabels = ['LOW RISK', 'MEDIUM RISK', 'HIGH RISK']

export default function CityMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [buildings, setBuildings] = useState<Building[]>([])
  const [selected, setSelected] = useState<Building | null>(null)
  const [stats, setStats] = useState({ low: 0, medium: 0, high: 0 })
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    // Load buildings
    const load = async () => {
      try {
        const data = await getBuildings()
        setBuildings(data.buildings)
      } catch {
        setBuildings(mockBuildings())
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!buildings.length) return
    const low = buildings.filter(b => b.risk_level === 0).length
    const medium = buildings.filter(b => b.risk_level === 1).length
    const high = buildings.filter(b => b.risk_level === 2).length
    setStats({ low, medium, high })
  }, [buildings])

  useEffect(() => {
    if (!buildings.length || !mapRef.current) return

    // Dynamic import of Leaflet to avoid SSR issues
    import('leaflet').then(L => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }

      const map = L.map(mapRef.current!, {
        center: [19.076, 72.877],
        zoom: 13,
        zoomControl: false,
        attributionControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      buildings.forEach(b => {
        const color = riskColors[b.risk_level]
        const radius = 8 + b.risk_score * 0.15

        const marker = L.circleMarker([b.lat, b.lng], {
          radius,
          fillColor: color,
          color: color,
          weight: 1,
          opacity: 0.9,
          fillOpacity: 0.6,
        }).addTo(map)

        // Pulse ring for high risk
        if (b.risk_level === 2) {
          L.circleMarker([b.lat, b.lng], {
            radius: radius + 8,
            fillColor: 'transparent',
            color,
            weight: 1,
            opacity: 0.3,
            fillOpacity: 0,
          }).addTo(map)
        }

        marker.on('click', () => setSelected(b))
        marker.bindTooltip(
          `<div style="font-family:monospace;font-size:10px;background:#040c14;border:1px solid ${color}40;padding:6px 10px;color:${color}">
            <div style="font-weight:bold;margin-bottom:4px">${b.id}</div>
            <div style="color:rgba(255,255,255,0.5)">${b.name}</div>
            <div style="margin-top:4px">Risk: ${b.risk_score}%</div>
          </div>`,
          { permanent: false, sticky: true, className: 'dark-tooltip' }
        )
      })

      mapInstance.current = map
    })

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [buildings])

  return (
    <section id="map" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-electric-blue/50">REAL-TIME MONITORING</span>
          <h2 className="font-display font-bold text-4xl mt-4 text-white">
            CITY COOLING <span className="text-electric-blue">RISK MAP</span>
          </h2>
          <p className="text-white/30 mt-3 font-body">
            Live infrastructure monitoring across {buildings.length} buildings
          </p>
        </motion.div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
          {[
            { label: 'LOW RISK', count: stats.low, color: '#00ff88' },
            { label: 'MEDIUM RISK', count: stats.medium, color: '#ffb800' },
            { label: 'HIGH RISK', count: stats.high, color: '#ff3366' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3 glass rounded-sm px-5 py-3 border border-white/5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
              <span className="font-mono text-xs tracking-widest" style={{ color: s.color }}>{s.count}</span>
              <span className="font-mono text-[9px] text-white/30">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 relative glass rounded-sm overflow-hidden border border-electric-blue/15"
            style={{ height: 520 }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-electric-blue/40 z-10" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-electric-blue/40 z-10" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-electric-blue/40 z-10" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-electric-blue/40 z-10" />

            <div ref={mapRef} className="w-full h-full" />

            {/* Legend */}
            <div className="absolute bottom-8 left-4 z-[1000] glass rounded-sm px-4 py-3 border border-electric-blue/15 space-y-2">
              {riskLabels.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: riskColors[i], boxShadow: `0 0 6px ${riskColors[i]}` }} />
                  <span className="font-mono text-[9px] text-white/40">{label}</span>
                </div>
              ))}
            </div>

            {/* Status badge */}
            <div className="absolute top-4 right-4 z-[1000] glass rounded-sm px-3 py-2 border border-neon-green/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              <span className="font-mono text-[9px] tracking-widest text-neon-green/70">LIVE</span>
            </div>
          </motion.div>

          {/* Building detail panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-72 flex flex-col gap-4"
          >
            {selected ? (
              <div className="glass rounded-sm border overflow-hidden"
                style={{ borderColor: `${riskColors[selected.risk_level]}30` }}>
                <div className="border-b px-5 py-4 flex items-center justify-between"
                  style={{ borderColor: `${riskColors[selected.risk_level]}20` }}>
                  <div>
                    <div className="font-mono text-xs tracking-widest text-white/40">{selected.id}</div>
                    <div className="font-display font-semibold text-sm mt-0.5">{selected.name}</div>
                  </div>
                  <div className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: riskColors[selected.risk_level], boxShadow: `0 0 8px ${riskColors[selected.risk_level]}` }} />
                </div>

                <div className="p-5 space-y-4">
                  {/* Risk score */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[9px] text-white/30">LEAK RISK SCORE</span>
                      <span className="font-display font-bold text-lg" style={{ color: riskColors[selected.risk_level] }}>
                        {selected.risk_score}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: riskColors[selected.risk_level] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${selected.risk_score}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>

                  {[
                    { label: 'Equipment Age', value: `${selected.equipment_age} yrs` },
                    { label: 'Cooling Efficiency', value: `${selected.cooling_efficiency}%` },
                    { label: 'Compressor Runtime', value: `${selected.compressor_runtime}%` },
                    { label: 'Last Maintenance', value: `${selected.last_maintenance} mo ago` },
                    { label: 'Building Floors', value: selected.floors },
                    { label: 'Risk Category', value: riskLabels[selected.risk_level] },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center border-b border-white/4 pb-2">
                      <span className="font-mono text-[9px] text-white/25">{row.label.toUpperCase()}</span>
                      <span className="font-mono text-[10px]" style={{ color: row.label === 'Risk Category' ? riskColors[selected.risk_level] : 'rgba(255,255,255,0.6)' }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass rounded-sm border border-electric-blue/10 p-8 flex flex-col items-center justify-center text-center h-64">
                <div className="text-3xl mb-4">🗺️</div>
                <div className="font-mono text-xs text-white/30 tracking-widest">CLICK A BUILDING</div>
                <div className="font-mono text-[9px] text-white/15 mt-2">to view detailed risk analysis</div>
              </div>
            )}

            {/* Building list */}
            <div className="glass rounded-sm border border-electric-blue/10 overflow-hidden flex-1">
              <div className="border-b border-electric-blue/10 px-4 py-3">
                <span className="font-mono text-[9px] tracking-widest text-white/30">HIGH RISK BUILDINGS</span>
              </div>
              <div className="divide-y divide-white/4 max-h-48 overflow-y-auto">
                {buildings
                  .filter(b => b.risk_level === 2)
                  .sort((a, b) => b.risk_score - a.risk_score)
                  .slice(0, 6)
                  .map(b => (
                    <button
                      key={b.id}
                      onClick={() => setSelected(b)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/3 transition-colors text-left"
                    >
                      <div>
                        <div className="font-mono text-[9px] text-white/30">{b.id}</div>
                        <div className="font-mono text-[10px] text-white/60">{b.name.slice(0, 20)}</div>
                      </div>
                      <div className="font-display font-bold text-sm text-danger-red">{b.risk_score}%</div>
                    </button>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
