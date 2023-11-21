import { ContentProvider } from '@/component/provider/Content'

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
      <ContentProvider>
        {children}
      </ContentProvider>
    </>
  )
}