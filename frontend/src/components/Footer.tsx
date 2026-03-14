'use client'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="border-t border-electric-blue/10 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full border border-electric-blue/50 flex items-center justify-center">
            <svg viewBox="0 0 20 20" className="w-4 h-4">
              <polygon points="10,2 18,15 2,15" fill="none" stroke="#00d4ff" strokeWidth="1.2" />
              <circle cx="10" cy="11" r="2" fill="#00d4ff" />
            </svg>
          </div>
          <span className="font-display font-bold text-sm tracking-[0.15em] text-electric-blue/70">CRYOGUARD</span>
        </div>

        <div className="font-mono text-[9px] text-white/20 tracking-widest text-center">
          AI REFRIGERANT LEAK PREDICTION SYSTEM • BUILT FOR CLIMATE TECH HACKATHON
        </div>

        <div className="font-mono text-[9px] text-white/15 tracking-widest">
          © 2025 CRYOGUARD AI
        </div>
      </div>
    </footer>
  )
}
