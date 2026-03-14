'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const problems = [
  {
    icon: '💧',
    title: 'REFRIGERANT LEAKS',
    stat: '30%',
    desc: 'of HVAC systems have undetected refrigerant leaks at any given time',
    color: '#00d4ff',
  },
  {
    icon: '⚡',
    title: 'PRESSURE DROPS',
    stat: '45%',
    desc: 'more energy consumed when refrigerant charge drops below optimal levels',
    color: '#ffb800',
  },
  {
    icon: '🌡️',
    title: 'TEMPERATURE SPIKES',
    stat: '8°C',
    desc: 'average discharge temperature increase before manual detection',
    color: '#ff3366',
  },
  {
    icon: '💸',
    title: 'ENERGY WASTE',
    stat: '$850B',
    desc: 'global annual cost from refrigerant-related inefficiencies',
    color: '#00ff88',
  },
]

export default function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-50" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-electric-blue/50">THE PROBLEM</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-4 text-white">
            COOLING SYSTEMS ARE FAILING<br />
            <span className="text-electric-blue">SILENTLY</span>
          </h2>
          <p className="text-white/30 mt-4 max-w-xl mx-auto font-body">
            Traditional maintenance is reactive. By the time a leak is detected, 
            the damage is already done — and the costs are catastrophic.
          </p>
        </motion.div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="glass glass-hover rounded-sm p-6 relative overflow-hidden group"
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${p.color}40, transparent)` }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${p.color}60, transparent)` }}
              />

              <div className="text-3xl mb-4">{p.icon}</div>

              <div
                className="font-display font-bold text-4xl mb-2"
                style={{ color: p.color, textShadow: `0 0 20px ${p.color}60` }}
              >
                {p.stat}
              </div>

              <div className="font-mono text-xs tracking-widest text-white/50 mb-3">{p.title}</div>
              <p className="font-body text-sm text-white/30 leading-relaxed">{p.desc}</p>

              {/* Corner accent */}
              <div
                className="absolute bottom-0 right-0 w-8 h-8 opacity-20"
                style={{
                  background: `linear-gradient(135deg, transparent 50%, ${p.color})`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* AI pipeline visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <span className="font-mono text-[10px] tracking-[0.3em] text-neon-green/50">THE SOLUTION</span>
            <h3 className="font-display font-bold text-3xl mt-4 text-white">
              HOW THE <span className="text-neon-green">AI ENGINE</span> WORKS
            </h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-0">
            {[
              { step: '01', label: 'INPUT DATA', desc: '7 sensor parameters', color: '#00d4ff' },
              { step: '02', label: 'AI PROCESSING', desc: 'Random Forest Model', color: '#00ffcc' },
              { step: '03', label: 'PROBABILITY SCORE', desc: 'Leak risk 0-100%', color: '#00ff88' },
              { step: '04', label: 'ALERTS SENT', desc: 'Maintenance dispatched', color: '#ffb800' },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.8 + i * 0.15 }}
                  className="glass rounded-sm p-6 text-center w-44 group hover:scale-105 transition-transform"
                >
                  <div className="font-mono text-[10px] tracking-widest text-white/20 mb-2">STEP {s.step}</div>
                  <div className="font-display font-bold text-sm tracking-wider mb-1" style={{ color: s.color }}>
                    {s.label}
                  </div>
                  <div className="font-mono text-[10px] text-white/30">{s.desc}</div>
                </motion.div>

                {i < 3 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ delay: 1.0 + i * 0.15, duration: 0.4 }}
                    className="hidden md:flex flex-col items-center px-2"
                  >
                    <div className="w-12 h-px bg-gradient-to-r from-electric-blue/40 to-neon-green/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green/60 mt-[-3px]" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
