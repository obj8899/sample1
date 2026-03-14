'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const messages = [
    'INITIALIZING CRYOGUARD AI ENGINE...',
    'LOADING PREDICTIVE INFRASTRUCTURE MODEL...',
    'CALIBRATING LEAK DETECTION ALGORITHMS...',
    'SYNCHRONIZING CITY COOLING NETWORK...',
    'SYSTEM READY',
  ]

  useEffect(() => {
    // Animate progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + Math.random() * 3 + 0.5
      })
    }, 50)

    // Cycle messages
    const msgInterval = setInterval(() => {
      setPhase(p => Math.min(p + 1, messages.length - 1))
    }, 700)

    const timer = setTimeout(() => {
      clearInterval(interval)
      clearInterval(msgInterval)
      onComplete()
    }, 3500)

    return () => { clearInterval(interval); clearInterval(msgInterval); clearTimeout(timer) }
  }, [onComplete])

  // Canvas grid animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const nodes: { x: number; y: number; vx: number; vy: number; risk: number }[] = []
    for (let i = 0; i < 30; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        risk: Math.random(),
      })
    }

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.3
            const color = a.risk > 0.7 ? `rgba(255,51,102,${alpha})` : `rgba(0,212,255,${alpha})`
            ctx.beginPath()
            ctx.strokeStyle = color
            ctx.lineWidth = 0.5
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        })

        // Draw node
        const r = a.risk > 0.7 ? '#ff3366' : a.risk > 0.4 ? '#ffb800' : '#00d4ff'
        ctx.beginPath()
        ctx.arc(a.x, a.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = r
        ctx.shadowBlur = 10
        ctx.shadowColor = r
        ctx.fill()
        ctx.shadowBlur = 0

        a.x += a.vx
        a.y += a.vy
        if (a.x < 0 || a.x > canvas.width) a.vx *= -1
        if (a.y < 0 || a.y > canvas.height) a.vy *= -1
      })

      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[999] bg-void flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full border-2 border-electric-blue/30 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-2 border-electric-blue/20 animate-ping" />
            <div className="w-16 h-16 rounded-full border border-electric-blue/60 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <polygon points="20,4 36,30 4,30" fill="none" stroke="#00d4ff" strokeWidth="1.5" />
                <circle cx="20" cy="22" r="4" fill="#00d4ff" />
                <line x1="20" y1="14" x2="20" y2="18" stroke="#00ff88" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-bold tracking-[0.2em] text-electric-blue text-glow-blue">
            CRYOGUARD
          </h1>
          <p className="font-mono text-xs tracking-[0.3em] text-electric-blue/50 mt-2">
            AI REFRIGERANT LEAK PREDICTION SYSTEM
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="w-80 space-y-3">
          <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-electric-blue to-neon-green"
              style={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ type: 'spring', damping: 20 }}
            />
          </div>
          <div className="flex justify-between font-mono text-xs text-electric-blue/40">
            <span>LOADING</span>
            <span>{Math.min(Math.floor(progress), 100)}%</span>
          </div>
        </div>

        {/* Status message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="font-mono text-xs tracking-widest text-neon-green/70"
          >
            {messages[phase]}
          </motion.p>
        </AnimatePresence>

        {/* Scan line */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent"
          style={{ animation: 'scanline 3s linear infinite' }} />
      </div>
    </motion.div>
  )
}
