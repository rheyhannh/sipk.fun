// #region REACT DEPEDENCY
import { Suspense } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { NavigationEvents } from '@/component/NavigationEvents';
import { DashboardProvider } from '@/component/provider/Dashboard';
import { ModalProvider } from '@/component/provider/Modal';
import Header from '@/component/Header';
import Navbar from '@/component/Nav';
// #endregion

// #region TAG OR METADATA
export const metadata = {
  title: 'SIPK | Dashboard',
  description: 'SIPK Dashboard',
  keywords: 'sipk, sistem indeks prestasi kumulatif, kalkulator ipk, kalkulator nilai, kalkulator kuliah, ipk, indeks prestasi kumulatif, kuliah, sipk website, sipk dashboard, dashboard',
}
// #endregion

export default function DashboardLayout({
  children,
}) {
  return (
    <>
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
    </>
  )
}