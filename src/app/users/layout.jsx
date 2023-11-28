// ========== COMPONENT DEPEDENCY ========== //
import { GlobalProvider } from '@/component/provider/Global'
import { ModalProvider } from '@/component/provider/Modal';
import { UsersProvider } from "@/component/provider/Users"

// ========== TAG / METADATA ========== //
export const metadata = {
  title: 'SIPK',
  description: 'Daftar dan Login SIPK',
  keywords: 'SIPK, Sistem, Informasi, Prestasi, Kumulatif, Daftar, Masuk, Signin, Signup',
  author: '@SIPK',
}

/*
============================== CODE START HERE ==============================
*/
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