'use client'

import { LandingProvider } from '@/component/provider/Landing';
import { Container } from '@/component/landing/Container';
import { Wrapper } from '@/component/landing/Wrapper';

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