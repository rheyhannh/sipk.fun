import './globals.css'

export const metadata = {
  title: 'SIPK Application',
  description: 'Elevate your academic journey',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}