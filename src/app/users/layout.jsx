// #region COMPONENT DEPEDENCY
import { ModalProvider } from '@/component/provider/Modal';
import { UsersProvider } from "@/component/provider/Users";
// #endregion

// #region UTIL DEPEDENCY
import { getUniversitasData } from '@/utils/core_data';
// #endregion

// #region TAG OR METADATA
export const metadata = {
  title: 'SIPK | Users',
  description: 'Daftar dan Login SIPK',
  keywords: 'sipk, sistem indeks prestasi kumulatif, kalkulator ipk, kalkulator nilai, kalkulator kuliah, ipk, indeks prestasi kumulatif, kuliah, sipk website, sipk daftar, sipk login, daftar akun sipk, login akun sipk, daftar, login',
}
// #endregion

export default async function UsersLayout({ children }) {
  const universitas = await getUniversitasData();

  return (
    <UsersProvider data={{ universitas }}>
      <ModalProvider>
        {children}
      </ModalProvider>
    </UsersProvider>
  )
}