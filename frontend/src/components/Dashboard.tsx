'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import { PredictionOutput } from '@/lib/api'

interface Props {
  result: PredictionOutput | null
}

// Animated radial gauge
function RadialGauge({
  value, max = 100, label, color, size = 160,
}: {
  value: number; max?: number; label: string; color: string; size?: number
}) {
  const [displayed, setDisplayed] = useState(0)
  const pct = Math.min(value / max, 1)
  const r = 58
  const circ = 2 * Math.PI * r
  const stroke = circ * pct * 0.75

  useEffect(() => {
    if (!value) return
    let start: number
    const animate = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / 1200, 1)
      setDisplayed(Math.round(value * progress))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 140 140">
          {/* Track */}
          <circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="10"
            strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
            strokeLinecap="round"
            transform="rotate(135 70 70)"
          />
          {/* Value arc */}
          <motion.circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${stroke} ${circ - stroke}`}
            transform="rotate(135 70 70)"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${stroke} ${circ - stroke}` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
          {/* Glow effect */}
          <circle cx="70" cy="70" r="45" fill="none"
            stroke={color} strokeWidth="0.5" opacity="0.1" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-2xl" style={{ color }}>
            {displayed}
          </span>
          <span className="font-mono text-[9px] text-white/30">{max === 100 ? '%' : ''}</span>
        </div>
      </div>
      <span className="font-mono text-[10px] tracking-widest text-white/40 text-center">{label}</span>
    </div>
  )
}

// Animated counter
function Counter({ value, prefix = '', suffix = '', decimals = 0 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number
}) {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    if (!value) return
    let start: number
    const animate = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / 1000, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(parseFloat((value * eased).toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value, decimals])

  return (
    <span>
      {prefix}{displayed.toFixed(decimals)}{suffix}
    </span>
  )
}

const riskColors = ['#00ff88', '#ffb800', '#ff3366']
const riskLabels = ['LOW RISK', 'MEDIUM RISK', 'HIGH RISK']
const riskBg = [
  'rgba(0,255,136,0.08)',
  'rgba(255,184,0,0.08)',
  'rgba(255,51,102,0.08)',
]

export default function Dashboard({ result }: Props) {
  if (!result) return null

  const color = riskColors[result.risk_level]

  // Radar data from feature contributions
  const radarData = Object.entries(result.feature_contributions).map(([name, value]) => ({
    factor: name.split(' ')[0],
    value: Math.max(0, value),
    fullMark: 30,
  }))

  // Bar chart data
  const barData = Object.entries(result.feature_contributions).map(([name, value]) => ({
    name: name.split(' ').map(w => w.slice(0, 4)).join('.'),
    value: Math.max(0, value),
  }))

  // Line chart – simulated time series
  const lineData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    risk: Math.max(5, result.risk_score - 40 + i * 3.5 + (Math.random() * 8 - 4)),
    efficiency: Math.max(20, result.analytics.cooling_performance_index - 15 + i * 1.2),
  }))

  return (
    <AnimatePresence>
      <motion.section
        id="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-20 px-6 relative"
      >
        <div className="absolute inset-0 grid-overlay opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="font-mono text-[10px] tracking-[0.3em] text-electric-blue/50">ANALYSIS COMPLETE</span>
            <h2 className="font-display font-bold text-4xl mt-4 text-white">
              AI <span className="text-electric-blue">INTELLIGENCE</span> DASHBOARD
            </h2>
          </motion.div>

          {/* RISK SCORE – hero panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-sm border overflow-hidden mb-8"
            style={{ borderColor: `${color}30`, boxShadow: `0 0 40px ${color}10` }}
          >
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
              {/* Big score */}
              <div className="flex-shrink-0 text-center">
                <div className="relative w-48 h-48 mx-auto">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 192">
                    <circle cx="96" cy="96" r="80" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />
                    <motion.circle
                      cx="96" cy="96" r="80"
                      fill="none"
                      stroke={color}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 80 * (result.leak_probability)} ${2 * Math.PI * 80}`}
                      transform="rotate(-90 96 96)"
                      initial={{ strokeDasharray: `0 ${2 * Math.PI * 80}` }}
                      animate={{ strokeDasharray: `${2 * Math.PI * 80 * result.leak_probability} ${2 * Math.PI * 80}` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      style={{ filter: `drop-shadow(0 0 12px ${color})` }}
                    />
                    <circle cx="96" cy="96" r="66" fill="none" stroke={color} strokeWidth="0.5" opacity="0.15" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display font-bold text-5xl" style={{ color }}>
                      <Counter value={result.risk_score} suffix="" />
                    </span>
                    <span className="font-mono text-xs text-white/40">RISK SCORE</span>
                  </div>
                </div>

                <div
                  className="mt-4 inline-block font-mono text-xs tracking-widest px-4 py-2 rounded-sm"
                  style={{ background: riskBg[result.risk_level], border: `1px solid ${color}30`, color }}
                >
                  ● {riskLabels[result.risk_level]}
                </div>
              </div>

              {/* Recommendation */}
              <div className="flex-1">
                <div className="font-mono text-[10px] tracking-widest text-white/30 mb-3">MAINTENANCE RECOMMENDATION</div>
                <div className="glass rounded-sm p-5 border" style={{ borderColor: `${color}20` }}>
                  <p className="font-body text-sm leading-relaxed" style={{ color: `${color}cc` }}>
                    {result.maintenance_recommendation}
                  </p>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {[
                    { label: 'LEAK PROBABILITY', value: `${(result.leak_probability * 100).toFixed(1)}%`, color },
                    { label: 'ENERGY LOSS/MO', value: `${result.analytics.monthly_energy_loss_kwh} kWh`, color: '#ffb800' },
                    { label: 'COST RISK', value: `$${result.analytics.maintenance_cost_risk_usd.toLocaleString()}`, color: '#ff3366' },
                    { label: 'CO₂ IMPACT', value: `${result.analytics.estimated_co2_kg} kg`, color: '#00ff88' },
                    { label: 'LIFESPAN LEFT', value: `${result.analytics.system_lifespan_remaining_years} yrs`, color: '#00d4ff' },
                    { label: 'PRESSURE VAR.', value: `${result.analytics.pressure_variance_estimate} PSI`, color: '#00ffcc' },
                  ].map(s => (
                    <div key={s.label} className="glass rounded-sm p-3 border border-white/5">
                      <div className="font-mono text-[9px] tracking-widest text-white/25 mb-1">{s.label}</div>
                      <div className="font-display font-semibold text-lg" style={{ color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gauges row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-sm p-8 border border-electric-blue/10 flex flex-col items-center"
            >
              <div className="font-mono text-[10px] tracking-widest text-white/30 mb-6">LEAK PROBABILITY</div>
              <RadialGauge
                value={Math.round(result.leak_probability * 100)}
                label="LEAK RISK %"
                color={color}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-sm p-8 border border-electric-blue/10 flex flex-col items-center"
            >
              <div className="font-mono text-[10px] tracking-widest text-white/30 mb-6">COOLING EFFICIENCY</div>
              <RadialGauge
                value={result.analytics.cooling_performance_index}
                label="PERFORMANCE INDEX"
                color="#00d4ff"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-sm p-8 border border-electric-blue/10 flex flex-col items-center"
            >
              <div className="font-mono text-[10px] tracking-widest text-white/30 mb-6">COMPRESSOR HEALTH</div>
              <RadialGauge
                value={result.compressor_health}
                label="HEALTH SCORE"
                color="#00ff88"
              />
            </motion.div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bar chart – feature contributions */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="glass rounded-sm p-6 border border-electric-blue/10"
            >
              <div className="font-mono text-[10px] tracking-widest text-white/30 mb-6">RISK FACTOR CONTRIBUTIONS</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#040c14', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '2px', fontFamily: 'monospace', fontSize: '10px' }}
                    labelStyle={{ color: '#00d4ff' }}
                    itemStyle={{ color: '#00ff88' }}
                  />
                  <Bar dataKey="value" fill="url(#barGrad)" radius={[2, 2, 0, 0]} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Radar chart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-sm p-6 border border-electric-blue/10"
            >
              <div className="font-mono text-[10px] tracking-widest text-white/30 mb-6">RISK FACTOR RADAR</div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(0,212,255,0.1)" />
                  <PolarAngleAxis dataKey="factor" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace' }} />
                  <Radar name="Risk" dataKey="value" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Line chart – time series */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-sm p-6 border border-electric-blue/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="font-mono text-[10px] tracking-widest text-white/30">PREDICTED TREND – 12 MONTHS</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-px bg-danger-red" />
                  <span className="font-mono text-[9px] text-white/30">RISK SCORE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-px bg-electric-blue" />
                  <span className="font-mono text-[9px] text-white/30">EFFICIENCY</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#040c14', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '2px', fontFamily: 'monospace', fontSize: '10px' }}
                  labelStyle={{ color: '#00d4ff' }}
                />
                <Line type="monotone" dataKey="risk" stroke="#ff3366" strokeWidth={1.5} dot={false}
                  style={{ filter: 'drop-shadow(0 0 4px #ff3366)' }} />
                <Line type="monotone" dataKey="efficiency" stroke="#00d4ff" strokeWidth={1.5} dot={false}
                  style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  )
}
