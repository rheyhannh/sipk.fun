// #region PAGE DEPEDENCY
import Dashboard from '@/page/Dashboard';
// #endregion

// #region UTIL DEPEDENCY
import { getUniversitasData, getNotifikasiData } from '@/utils/core_data';
// #endregion

// #region VARIABLES
const revalidateUniversitasData = 86400; // Revalidate every 24 hours
const revalidateNotifikasiData = 3600; // Revalidate every 1 hours
// #endregion

export default async function DashboardPage() {
    const universitas = await getUniversitasData(revalidateUniversitasData);
    const notifikasi = await getNotifikasiData(revalidateNotifikasiData);

    return (
        <Dashboard universitas={universitas} notifikasi={notifikasi} />
    )
}