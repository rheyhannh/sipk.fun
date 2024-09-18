// #region PAGE DEPEDENCY
import Dashboard from '@/page/Dashboard';
// #endregion

// #region UTIL DEPEDENCY
import { getUniversitasData, getNotifikasiData } from '@/utils/core_data';
// #endregion

export default async function DashboardPage() {
    const universitas = await getUniversitasData();
    const notifikasi = await getNotifikasiData();

    return (
        <Dashboard universitas={universitas} notifikasi={notifikasi} />
    )
}