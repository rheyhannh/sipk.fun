'use client'

// ========== COMPONENT DEPEDENCY ========== //
import { LandingProvider } from '@/component/provider/Landing'

/*
============================== CODE START HERE ==============================
*/

export default function LandingPage() {
  return (
    <LandingProvider>
      <main className={`landing`}>
        <h1>Root Page</h1>
      </main>
    </LandingProvider>
  )
}

/*
============================== CODE END HERE ==============================
*/