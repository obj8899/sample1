/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#020408',
        abyss: '#040c14',
        deep: '#071828',
        'electric-blue': '#00d4ff',
        'neon-green': '#00ff88',
        'cyber-teal': '#00ffcc',
        'warning-amber': '#ffb800',
        'danger-red': '#ff3366',
        'glass-white': 'rgba(255,255,255,0.06)',
        'glass-border': 'rgba(0,212,255,0.15)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Rajdhani', 'Orbitron', 'sans-serif'],
        body: ['DM Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)`,
        'radial-glow': 'radial-gradient(ellipse at center, rgba(0,212,255,0.12) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 3s linear infinite',
        'particle': 'particle 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff' },
          '100%': { boxShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 60px #00d4ff' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: 0 },
        },
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.2)',
        'neon-green': '0 0 20px rgba(0,255,136,0.5), 0 0 40px rgba(0,255,136,0.2)',
        'neon-red': '0 0 20px rgba(255,51,102,0.5), 0 0 40px rgba(255,51,102,0.2)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
}
