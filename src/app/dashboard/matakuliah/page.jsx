// #region PAGE DEPEDENCY
import DashboardMatakuliah from '@/page/DashboardMatakuliah';
// #endregion

// #region UTIL DEPEDENCY
import { getUniversitasData } from '@/utils/core_data';
// #endregion

export default async function DashboardMatakuliahPage() {
    const universitas = await getUniversitasData();

    return (
        <DashboardMatakuliah universitas={universitas} />
    )
}