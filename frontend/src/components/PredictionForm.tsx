'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { runPrediction, mockPrediction, PredictionInput, PredictionOutput } from '@/lib/api'

const fields = [
  { key: 'equipment_age', label: 'Equipment Age', unit: 'years', min: 0, max: 25, step: 0.5, default: 8, icon: '🏭' },
  { key: 'compressor_runtime', label: 'Compressor Runtime', unit: '%', min: 0, max: 100, step: 1, default: 72, icon: '⚙️' },
  { key: 'power_consumption', label: 'Power Consumption', unit: 'kWh', min: 0.5, max: 20, step: 0.1, default: 6.5, icon: '⚡' },
  { key: 'cooling_efficiency', label: 'Cooling Efficiency', unit: '%', min: 10, max: 100, step: 1, default: 68, icon: '❄️' },
  { key: 'ambient_temp', label: 'Ambient Temperature', unit: '°C', min: -10, max: 55, step: 0.5, default: 28, icon: '🌡️' },
  { key: 'maintenance_interval', label: 'Maintenance Interval', unit: 'months', min: 1, max: 30, step: 1, default: 8, icon: '🔧' },
  { key: 'discharge_temp', label: 'Discharge Temperature', unit: '°C', min: 30, max: 130, step: 0.5, default: 72, icon: '🔥' },
]

interface Props {
  onResult: (result: PredictionOutput) => void
}

export default function PredictionForm({ onResult }: Props) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(fields.map(f => [f.key, f.default]))
  )
  const [loading, setLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState(0)

  const loadingMessages = [
    'UPLOADING SENSOR DATA...',
    'PREPROCESSING FEATURES...',
    'RUNNING RANDOM FOREST MODEL...',
    'COMPUTING LEAK PROBABILITY...',
    'GENERATING RECOMMENDATIONS...',
  ]

  const handleSubmit = async () => {
    setLoading(true)
    setLoadingPhase(0)

    const phaseInterval = setInterval(() => {
      setLoadingPhase(p => Math.min(p + 1, loadingMessages.length - 1))
    }, 400)

    try {
     const input = values as unknown as PredictionInput
      let result: PredictionOutput
      try {
        result = await runPrediction(input)
      } catch {
        // Fallback to client-side mock if backend unavailable
        await new Promise(r => setTimeout(r, 2000))
        result = mockPrediction(input)
      }
      clearInterval(phaseInterval)
      setLoading(false)
      onResult(result)
      setTimeout(() => {
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } catch (err) {
      clearInterval(phaseInterval)
      setLoading(false)
    }
  }

  return (
    <section id="prediction" className="py-32 px-6 relative">
      <div className="absolute inset-0 grid-overlay opacity-30" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-electric-blue/50">CONTROL CENTER</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-4 text-white">
            AI LEAK <span className="text-electric-blue">PREDICTION</span>
          </h2>
          <p className="text-white/30 mt-4 font-body">
            Input your refrigeration system parameters and run the AI analysis
          </p>
        </motion.div>

        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass rounded-sm border border-electric-blue/15 overflow-hidden relative"
        >
          {/* Panel header */}
          <div className="border-b border-electric-blue/10 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="font-mono text-xs tracking-widest text-electric-blue/60">PARAMETER INPUT MATRIX</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-danger-red/60" />
              <div className="w-2 h-2 rounded-full bg-warning-amber/60" />
              <div className="w-2 h-2 rounded-full bg-neon-green/60" />
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field, i) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{field.icon}</span>
                      <label className="font-mono text-xs tracking-widest text-white/50 group-focus-within:text-electric-blue transition-colors">
                        {field.label.toUpperCase()}
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={values[field.key]}
                        onChange={e => setValues(v => ({ ...v, [field.key]: parseFloat(e.target.value) || 0 }))}
                        className="w-20 bg-white/5 border border-electric-blue/20 rounded-sm px-2 py-1 font-mono text-xs text-electric-blue text-right focus:outline-none focus:border-electric-blue/60"
                      />
                      <span className="font-mono text-[10px] text-white/20 w-12">{field.unit}</span>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="relative">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-150"
                        style={{
                          width: `${((values[field.key] - field.min) / (field.max - field.min)) * 100}%`,
                          background: 'linear-gradient(90deg, #00d4ff, #00ff88)',
                        }}
                      />
                    </div>
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={values[field.key]}
                      onChange={e => setValues(v => ({ ...v, [field.key]: parseFloat(e.target.value) }))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-4 -top-1.5"
                      style={{ WebkitAppearance: 'none' }}
                    />
                  </div>

                  <div className="flex justify-between mt-1">
                    <span className="font-mono text-[9px] text-white/15">{field.min}</span>
                    <span className="font-mono text-[9px] text-white/15">{field.max}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Submit */}
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="relative group font-display font-bold tracking-[0.2em] text-sm px-16 py-5 overflow-hidden rounded-sm transition-all duration-300 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff20, #00ff8820)',
                  border: '1px solid rgba(0,212,255,0.4)',
                  boxShadow: loading ? 'none' : '0 0 30px rgba(0,212,255,0.2)',
                }}
              >
                <span className="relative z-10 text-electric-blue">
                  {loading ? '⚡ ANALYZING...' : '⚡ RUN AI PREDICTION'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 to-neon-green/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-400" />
                {!loading && (
                  <div className="absolute inset-0 rounded-sm neon-border" />
                )}
              </button>
            </div>
          </div>

          {/* Scan line decoration */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent" />
        </motion.div>

        {/* Loading overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-void/90 backdrop-blur-sm flex flex-col items-center justify-center"
            >
              <div className="relative w-40 h-40 mb-8">
                {/* Outer ring */}
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="1" />
                  <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="1"
                    strokeDasharray="50 390" strokeLinecap="round" />
                </svg>
                {/* Inner ring */}
                <svg className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)]" style={{ animation: 'spin 2s linear infinite reverse' }} viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="55" fill="none" stroke="rgba(0,255,136,0.2)" strokeWidth="1" />
                  <circle cx="64" cy="64" r="55" fill="none" stroke="rgba(0,255,136,0.8)" strokeWidth="1.5"
                    strokeDasharray="80 265" strokeLinecap="round" />
                </svg>
                {/* Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="font-display text-2xl font-bold text-electric-blue text-glow-blue">AI</div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingPhase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="font-mono text-xs tracking-widest text-neon-green/70"
                >
                  {loadingMessages[loadingPhase]}
                </motion.p>
              </AnimatePresence>

              <div className="mt-6 w-64">
                <div className="h-px bg-white/5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-electric-blue to-neon-green"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.2, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
