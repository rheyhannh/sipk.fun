// #region PAGES DEPEDENCY
import DashboardMatakuliah from '@/pages/DashboardMatakuliah';
// #endregion

// #region UTIL DEPEDENCY
import { getUniversitasData } from '@/utils/core_data';
// #endregion

// #region VARIABLES
const revalidateUniversitasData = 86400; // Revalidate every 24 hours
// #endregion

export default async function MatakuliahPage() {
    const universitas = await getUniversitasData(revalidateUniversitasData);

    return (
        <DashboardMatakuliah universitas={universitas} />
    )
}