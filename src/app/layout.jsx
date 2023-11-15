import Notification from '@/component/loader/Toaster';
import { Poppins } from 'next/font/google';
import './globals.css'
export const metadata = {
  title: 'SIPK Application',
  description: 'Elevate your academic journey',
}

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--poppins-font',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <Notification/>
        {children}
      </body>
    </html>
  )
}