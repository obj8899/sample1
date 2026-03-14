'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Particles
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? '#00d4ff' : '#00ff88',
      })
    }

    // City skyline buildings
    const buildings: { x: number; w: number; h: number; windows: { x: number; y: number; on: boolean }[] }[] = []
    let bx = 0
    while (bx < 2000) {
      const w = 40 + Math.random() * 80
      const h = 80 + Math.random() * 300
      const wins: { x: number; y: number; on: boolean }[] = []
      for (let wy = 10; wy < h - 10; wy += 20) {
        for (let wx = 8; wx < w - 8; wx += 15) {
          wins.push({ x: wx, y: wy, on: Math.random() > 0.3 })
        }
      }
      buildings.push({ x: bx, w, h, windows: wins })
      bx += w + 5
    }

    let t = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.005

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height)
      sky.addColorStop(0, '#020408')
      sky.addColorStop(0.6, '#040c14')
      sky.addColorStop(1, '#071828')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid
      ctx.strokeStyle = 'rgba(0,212,255,0.04)'
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
      }

      // Horizon glow
      const glow = ctx.createRadialGradient(canvas.width / 2, canvas.height * 0.75, 0, canvas.width / 2, canvas.height * 0.75, canvas.width * 0.6)
      glow.addColorStop(0, 'rgba(0,212,255,0.08)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // City silhouette
      const groundY = canvas.height * 0.75
      const offset = (Date.now() * 0.01) % canvas.width

      const drawBuildings = (scrollX: number, alpha: number, scale: number) => {
        ctx.save()
        ctx.globalAlpha = alpha
        buildings.forEach(b => {
          const bx = ((b.x - scrollX % canvas.width + canvas.width * 2) % (canvas.width * 2)) - 200
          if (bx > canvas.width + 100) return

          const bh = b.h * scale
          const by = groundY - bh
          const bw = b.w * scale

          // Building body
          const buildingGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh)
          buildingGrad.addColorStop(0, 'rgba(7,24,40,0.95)')
          buildingGrad.addColorStop(1, 'rgba(4,12,20,0.98)')
          ctx.fillStyle = buildingGrad
          ctx.fillRect(bx, by, bw, bh)

          // Border glow
          ctx.strokeStyle = 'rgba(0,212,255,0.08)'
          ctx.lineWidth = 0.5
          ctx.strokeRect(bx, by, bw, bh)

          // Windows
          b.windows.forEach(w => {
            if (!w.on) return
            const wx = bx + w.x * scale
            const wy = by + w.y * scale
            const ww = 8 * scale
            const wh = 12 * scale
            const flicker = Math.sin(t * 3 + w.x * 0.1) > 0.95 ? 0 : 1
            if (flicker === 0) return
            ctx.fillStyle = Math.random() > 0.99
              ? 'rgba(255,184,0,0.8)'
              : 'rgba(0,212,255,0.6)'
            ctx.fillRect(wx, wy, ww, wh)
            ctx.shadowColor = 'rgba(0,212,255,0.3)'
            ctx.shadowBlur = 4
          })
          ctx.shadowBlur = 0
        })
        ctx.restore()
      }

      drawBuildings(offset * 0.3, 0.5, 0.7)
      drawBuildings(offset * 0.6, 0.7, 0.9)
      drawBuildings(offset, 0.9, 1.0)

      // Ground
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, canvas.height)
      groundGrad.addColorStop(0, 'rgba(0,212,255,0.1)')
      groundGrad.addColorStop(0.2, 'rgba(7,24,40,0.95)')
      groundGrad.addColorStop(1, '#020408')
      ctx.fillStyle = groundGrad
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY)

      // Particles
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -10) { p.y = canvas.height; p.x = Math.random() * canvas.width }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha * (0.5 + 0.5 * Math.sin(t + p.x))
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      })

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.8, duration: 0.6 }}
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-neon-green/70 border border-neon-green/20 px-4 py-2 rounded-full mb-8 glass"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          AI SYSTEM ONLINE • 40 BUILDINGS MONITORED • REAL-TIME PREDICTION
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.0, duration: 0.8 }}
          className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6 leading-none"
        >
          <span className="text-white">PREDICTING </span>
          <span className="text-electric-blue text-glow-blue">REFRIGERANT</span>
          <br />
          <span className="text-white">LEAKS </span>
          <span className="text-neon-green text-glow-green">BEFORE</span>
          <br />
          <span className="text-white/60">SYSTEM FAILURE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.3, duration: 0.6 }}
          className="text-white/40 text-lg max-w-2xl mx-auto mb-12 font-body leading-relaxed"
        >
          CryoGuard uses advanced machine learning to analyze 7 critical parameters
          of cooling infrastructure and predict refrigerant leakage risk with
          precision before it becomes a catastrophic failure.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => document.getElementById('prediction')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative font-display font-semibold text-sm tracking-[0.2em] px-8 py-4 bg-electric-blue text-void rounded-sm overflow-hidden transition-all duration-300 hover:shadow-neon-blue hover:scale-105"
          >
            <span className="relative z-10">⚡ RUN AI ANALYSIS</span>
            <div className="absolute inset-0 bg-gradient-to-r from-electric-blue to-cyber-teal translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          </button>
          <button
            onClick={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-mono text-xs tracking-widest px-8 py-4 border border-electric-blue/30 text-electric-blue/70 hover:border-electric-blue hover:text-electric-blue transition-all duration-300 rounded-sm"
          >
            VIEW CITY RISK MAP
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.8, duration: 0.6 }}
          className="mt-20 flex items-center justify-center gap-12 flex-wrap"
        >
          {[
            { value: '94.8%', label: 'Detection Accuracy' },
            { value: '72hrs', label: 'Advance Warning' },
            { value: '$2.4M', label: 'Avg Cost Saved' },
            { value: '40+', label: 'Buildings Monitored' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display font-bold text-2xl text-electric-blue text-glow-blue">{value}</div>
              <div className="font-mono text-[10px] tracking-widest text-white/30 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.0 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] tracking-widest text-white/20">SCROLL TO EXPLORE</span>
        <div className="w-px h-12 bg-gradient-to-b from-electric-blue/40 to-transparent" />
      </motion.div>
    </section>
  )
}
