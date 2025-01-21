// #region PAGE DEPEDENCY
import DashboardMatakuliah from '@dashboard-matakuliah_page/DashboardMatakuliah';
// #endregion

// #region UTIL DEPEDENCY
import getUniversitas from '@/lib/supabase/cached/getUniversitas';
// #endregion

export default async function DashboardMatakuliahPage() {
	const universitas = await getUniversitas();

	return <DashboardMatakuliah universitas={universitas} />;
}
