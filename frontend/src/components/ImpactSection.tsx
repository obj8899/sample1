'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function AnimatedCounter({
  target, prefix = '', suffix = '', duration = 2000,
}: {
  target: number; prefix?: string; suffix?: string; duration?: number
}) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start = Math.min(start + step, target)
      setValue(Math.floor(start))
      if (start >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return (
    <span ref={ref}>
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  )
}

const impactStats = [
  { value: 2400000, prefix: '$', suffix: '', label: 'Average Cost Saved Per Facility', color: '#00ff88', icon: '💰' },
  { value: 847, suffix: ' kWh', label: 'Monthly Energy Recovered Per System', color: '#00d4ff', icon: '⚡' },
  { value: 12400, suffix: ' kg', label: 'CO₂ Emissions Prevented Annually', color: '#00ffcc', icon: '🌱' },
  { value: 94, suffix: '%', label: 'Prediction Accuracy Rate', color: '#ffb800', icon: '🎯' },
  { value: 72, suffix: 'hrs', label: 'Average Advance Warning Time', color: '#ff3366', icon: '⏱️' },
  { value: 3200, prefix: '', suffix: '+', label: 'Cooling Systems Monitored', color: '#a855f7', icon: '🏭' },
]

export default function ImpactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="impact" ref={ref} className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-electric-blue/50">GLOBAL IMPACT</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-4 text-white">
            REAL RESULTS, <span className="text-neon-green">REAL NUMBERS</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-xl mx-auto font-body">
            CryoGuard deployments across commercial and industrial facilities have demonstrated
            measurable reductions in energy waste and maintenance costs.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass rounded-sm p-8 border border-white/5 relative overflow-hidden group glass-hover"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${stat.color}40, transparent)` }} />

              {/* BG glow */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ background: stat.color, filter: 'blur(40px)' }} />

              <div className="text-3xl mb-4">{stat.icon}</div>

              <div className="font-display font-bold text-4xl md:text-5xl mb-3"
                style={{ color: stat.color, textShadow: `0 0 30px ${stat.color}40` }}>
                <AnimatedCounter
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>

              <p className="font-body text-sm text-white/30 leading-relaxed">{stat.label}</p>

              {/* Progress bar decoration */}
              <div className="mt-4 h-px bg-white/5">
                <motion.div
                  className="h-full"
                  style={{ background: stat.color }}
                  initial={{ width: '0%' }}
                  animate={isInView ? { width: '100%' } : {}}
                  transition={{ duration: 1.5, delay: i * 0.1 + 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="glass rounded-sm border border-electric-blue/15 p-12 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.05) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <h3 className="font-display font-bold text-3xl text-white mb-4">
                READY TO PROTECT YOUR<br />
                <span className="text-electric-blue">COOLING INFRASTRUCTURE?</span>
              </h3>
              <p className="font-body text-white/30 mb-8">
                Run your first AI prediction now and discover hidden risks
                in your refrigeration systems before they become costly failures.
              </p>
              <button
                onClick={() => document.getElementById('prediction')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative font-display font-bold tracking-[0.2em] text-sm px-12 py-4 overflow-hidden rounded-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,255,136,0.2))',
                  border: '1px solid rgba(0,212,255,0.4)',
                  boxShadow: '0 0 30px rgba(0,212,255,0.2)',
                  color: '#00d4ff',
                }}
              >
                ⚡ ANALYZE YOUR SYSTEM
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
