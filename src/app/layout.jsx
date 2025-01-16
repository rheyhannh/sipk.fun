// #region COMPONENT DEPEDENCY
import { CookiesProvider } from 'next-client-cookies/server';
import { GlobalProvider } from '@/app/provider';
// #endregion

// #region STYLE DEPEDENCY
import './globals.css'
import { poppins } from '@/fonts/fonts';
// #endregion

// #region TAG OR METADATA
export const metadata = /** @type {import('next').Metadata} */ ({
  title: 'Cara Baru Menghitung IPK secara Cepat dan Akurat | SIPK',
  description: 'Hitung IPK Sedini Mungkin secara Akurat dengan Matakuliah yang Dinamis',
  keywords: [
    'SIPK',
    'Indeks Prestasi Kumulatif',
    'Kalkulator IPK',
    'Kalkulator Nilai',
    'Kalkulator Kuliah',
  ]
})
// #endregion

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <CookiesProvider>
          <GlobalProvider>
            {children}
          </GlobalProvider>
        </CookiesProvider>
      </body>
    </html>
  )
}