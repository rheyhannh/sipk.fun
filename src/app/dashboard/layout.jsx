// #region REACT DEPEDENCY
import { Suspense } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { NavigationEvents } from '@/component/NavigationEvents';
import { DashboardProvider } from '@dashboard_page/provider';
import { ModalProvider } from '@/component/modal/provider';
import Header from '@/component/Header';
import Navbar from '@/component/Nav';
// #endregion

// #region TAG OR METADATA
export const metadata = /** @type {import('next').Metadata} */ ({
  title: 'Dashboard | SIPK',
})
// #endregion

export default async function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <ModalProvider>
        <Header />
        <Navbar>
          {children}
        </Navbar>
        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
      </ModalProvider>
    </DashboardProvider>
  )
}