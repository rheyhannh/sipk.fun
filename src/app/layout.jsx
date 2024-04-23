// ========== NEXT DEPEDENCY ========== //
import { Poppins } from 'next/font/google';

// ========== COMPONENT DEPEDENCY ========== //
import Notification from '@/component/loader/Toaster';
import { CookiesProvider } from 'next-client-cookies/server';

// ========== STYLE DEPEDENCY ========== //
import './globals.css'
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--poppins-font',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

// ========== TAG / METADATA ========== //
export const metadata = {
  title: 'SIPK Application',
  description: 'Elevate your academic journey',
}

/*
============================== CODE START HERE ==============================
*/

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <CookiesProvider>
          <Notification />
          {children}
        </CookiesProvider>
      </body>
    </html>
  )
}

/*
============================== CODE END HERE ==============================
*/