// ========== REACT DEPEDENCY ========== //
import { Suspense } from 'react';
import Header from '@/component/Header';
import Navbar from '@/component/Nav'

// ========== COMPONENT DEPEDENCY ========== //
import { NavigationEvents } from '@/component/NavigationEvents';
import { GlobalProvider } from '@/component/provider/Global'
import { DashboardProvider } from '@/component/provider/Dashboard';
import { ModalProvider } from '@/component/provider/Modal';


// ========== TAG / METADATA ========== //
export const metadata = {
  title: 'SIPK | Dashboard',
  description: 'SIPK Dashboard',
  keywords: 'sipk, sistem indeks prestasi kumulatif, kalkulator ipk, kalkulator nilai, kalkulator kuliah, ipk, indeks prestasi kumulatif, kuliah, sipk website, sipk dashboard, dashboard',
}

/*
============================== CODE START HERE ==============================
*/
export default function DashboardLayout({
  children,
}) {
  return (
    <>
      <GlobalProvider>
        <DashboardProvider>
          <ModalProvider>
            <Header />
            <main className={`dashboard`}>
              <Navbar>
                {children}
              </Navbar>
              <Suspense fallback={null}>
                <NavigationEvents />
              </Suspense>
            </main>
          </ModalProvider>
        </DashboardProvider>
      </GlobalProvider>
    </>
  )
}