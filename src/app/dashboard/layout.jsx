import Navbar from '@/component/Nav'

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
      <Navbar>
        {children}
      </Navbar>
    </>
  )
}