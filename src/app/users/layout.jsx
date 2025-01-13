// #region COMPONENT DEPEDENCY
import { ModalProvider } from '@/component/modal/provider';
import { UsersProvider } from "@users_page/provider";
// #endregion

// #region TAG OR METADATA
export const metadata = /** @type {import('next').Metadata} */ ({
  title: 'Login atau Daftar Akun | SIPK',
  description: 'Daftar Akun atau Login untuk menikmati fitur di SIPK secara gratis',
  keywords: [
    'SIPK',
    'Login di SIPK',
    'Daftar Akun di SIPK',
    'Indeks Prestasi Kumulatif',
    'Kalkulator IPK',
    'Kalkulator Nilai',
    'Kalkulator Kuliah',
  ]
})
// #endregion

export default async function UsersLayout({ children }) {
  return (
    <UsersProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </UsersProvider>
  )
}