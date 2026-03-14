'use client'
import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import Preloader from '@/components/Preloader'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import ProblemSection from '@/components/ProblemSection'
import PredictionForm from '@/components/PredictionForm'
import Dashboard from '@/components/Dashboard'
import CityMap from '@/components/CityMap'
import ImpactSection from '@/components/ImpactSection'
import Footer from '@/components/Footer'
import { PredictionOutput } from '@/lib/api'

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [result, setResult] = useState<PredictionOutput | null>(null)

  const handleLoaded = useCallback(() => setLoaded(true), [])
  const handleResult = useCallback((r: PredictionOutput) => setResult(r), [])

  return (
    <main className="relative">
      <AnimatePresence>
        {!loaded && <Preloader onComplete={handleLoaded} />}
      </AnimatePresence>

      {loaded && (
        <>
          <Nav />
          <Hero />
          <ProblemSection />
          <PredictionForm onResult={handleResult} />
          {result && <Dashboard result={result} />}
          <CityMap />
          <ImpactSection />
          <Footer />
        </>
      )}
    </main>
  )
}
