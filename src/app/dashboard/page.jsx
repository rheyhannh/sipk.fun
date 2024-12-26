// #region PAGE DEPEDENCY
import Dashboard from '@dashboard_page/Dashboard';
// #endregion

// #region UTIL DEPEDENCY
import getUniversitas from '@/lib/supabase/cached/getUniversitas';
import getNotifikasi from '@/lib/supabase/cached/getNotifikasi';
// #endregion

export default async function DashboardPage() {
    const universitas = await getUniversitas();
    const notifikasi = await getNotifikasi();

    return (
        <Dashboard universitas={universitas} notifikasi={notifikasi} />
    )
}