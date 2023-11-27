import { Suspense } from 'react';
import Header from '@/component/Header';
import Navbar from '@/component/Nav'
import { NavigationEvents } from '@/component/NavigationEvents';
import { GlobalProvider } from '@/component/provider/Global'
import { DashboardProvider } from '@/component/provider/Dashboard';
import { ModalProvider } from '@/component/provider/Modal';

export const metadata = {
  title: 'Dashboard',
  description: 'SIPK Dashboard',
  keywords: 'SIPK, Sistem, Informasi, Prestasi, Kumulatif, Dashboard',
  author: '@SIPK',
}

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