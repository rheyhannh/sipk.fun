// #region COMPONENT DEPEDENCY
import Notification from '@/component/loader/Toaster';
import { CookiesProvider } from 'next-client-cookies/server';
// #endregion

// #region STYLE DEPEDENCY
import './globals.css'
import { poppins } from '@/fonts/fonts';
// #endregion

// #region TAG OR METADATA
export const metadata = {
  title: 'SIPK | Root',
  description: 'Selamat datang di SIPK',
  keywords: 'sipk, sistem indeks prestasi kumulatif, kalkulator ipk, kalkulator nilai, kalkulator kuliah, ipk, indeks prestasi kumulatif, kuliah, sipk website',
}
// #endregion

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