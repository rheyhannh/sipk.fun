'use client'

// ========== COMPONENT DEPEDENCY ========== //
import { LandingProvider } from '@/component/provider/Landing'

// ========== STYLE DEPEDENCY ========== //
import styles from './page.module.css'

/*
============================== CODE START HERE ==============================
*/

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Root Page</h1>
    </main>
  )
}

/*
============================== CODE END HERE ==============================
*/