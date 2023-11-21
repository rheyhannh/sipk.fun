import { GlobalProvider } from '@/component/provider/Global'

export const metadata = {
  title: 'SIPK',
  description: 'Daftar dan Login SIPK',
  keywords: 'SIPK, Sistem, Informasi, Prestasi, Kumulatif, Daftar, Masuk, Signin, Signup',
  author: '@SIPK',
}

export default function UsersLayout({
  children,
}) {
  return (
    <>
      <GlobalProvider>
        {children}
      </GlobalProvider>
    </>
  )
}