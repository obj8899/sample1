'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-electric-blue/10' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 3.6, duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-full border border-electric-blue/60 flex items-center justify-center">
            <svg viewBox="0 0 20 20" className="w-5 h-5">
              <polygon points="10,2 18,15 2,15" fill="none" stroke="#00d4ff" strokeWidth="1.2" />
              <circle cx="10" cy="11" r="2" fill="#00d4ff" />
            </svg>
          </div>
          <span className="font-display font-bold text-lg tracking-[0.15em] text-electric-blue">CRYOGUARD</span>
          <span className="hidden sm:block font-mono text-[10px] text-electric-blue/30 tracking-widest border border-electric-blue/20 px-2 py-0.5 rounded">
            AI v2.1
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'AI Analysis', id: 'prediction' },
            { label: 'Dashboard', id: 'dashboard' },
            { label: 'City Map', id: 'map' },
            { label: 'Impact', id: 'impact' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="font-mono text-xs tracking-widest text-white/40 hover:text-electric-blue transition-colors duration-200"
            >
              {label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollTo('prediction')}
          className="relative font-mono text-xs tracking-widest px-5 py-2 border border-electric-blue/50 text-electric-blue hover:bg-electric-blue/10 transition-all duration-300 rounded-sm group overflow-hidden"
        >
          <span className="relative z-10">RUN ANALYSIS</span>
          <div className="absolute inset-0 bg-electric-blue/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
        </button>
      </div>
    </motion.nav>
  )
}
