// ========== COMPONENT DEPEDENCY ========== //
import { ModalProvider } from '@/component/provider/Modal';
import { UsersProvider } from "@/component/provider/Users"

// ========== TAG / METADATA ========== //
export const metadata = {
  title: 'SIPK | Users',
  description: 'Daftar dan Login SIPK',
  keywords: 'sipk, sistem indeks prestasi kumulatif, kalkulator ipk, kalkulator nilai, kalkulator kuliah, ipk, indeks prestasi kumulatif, kuliah, sipk website, sipk daftar, sipk login, daftar akun sipk, login akun sipk, daftar, login',
}

/*
============================== CODE START HERE ==============================
*/

export default function UsersLayout({
  children,
}) {
  return (
    <>
      <UsersProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </UsersProvider>
    </>
  )
}

/*
============================== CODE END HERE ==============================
*/