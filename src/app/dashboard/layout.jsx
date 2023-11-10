import { Suspense } from 'react';
import Header from '@/component/Header';
import Navbar from '@/component/Nav'
import { NavigationEvents } from '@/component/NavigationEvents';
import { ContentProvider } from '@/component/provider/Content'

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
      <ContentProvider>
        <Header />
        <main className={`dashboard`}>
          <Navbar>
            {children}
          </Navbar>
          <Suspense fallback={null}>
            <NavigationEvents />
          </Suspense>

        </main>
      </ContentProvider>
    </>
  )
}