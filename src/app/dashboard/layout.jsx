import { Suspense } from 'react';
import { Poppins } from 'next/font/google';
import Navbar from '@/component/Nav'
import { NavigationEvents } from '@/component/NavigationEvents';
import { ThemeProvider } from '@/component/Theme'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--poppins-font',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

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
      <main className={`${poppins.variable} dashboard`}>
        <ThemeProvider>
          <Navbar>
            {children}
          </Navbar>
          <Suspense fallback={null}>
            <NavigationEvents />
          </Suspense>
        </ThemeProvider>
      </main>
    </>
  )
}