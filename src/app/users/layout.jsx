import { GlobalProvider } from '@/component/provider/Global'
import { ModalProvider } from '@/component/provider/Modal';
import { UsersProvider } from "@/component/provider/Users"

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
        <UsersProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </UsersProvider>
      </GlobalProvider>
    </>
  )
}