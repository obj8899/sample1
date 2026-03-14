import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CryoGuard – AI Refrigerant Leak Prediction System',
  description: 'Next-generation AI climate intelligence platform predicting refrigerant leaks before system failure.',
  keywords: 'refrigerant leak, AI prediction, cooling infrastructure, climate tech',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;700&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-void text-white antialiased">
        {children}
      </body>
    </html>
  )
}
