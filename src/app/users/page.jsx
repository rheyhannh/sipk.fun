// #region PAGE DEPEDENCY
import Users from '@/page/Users';
// #endregion

// #region UTIL DEPEDENCY
import { getUniversitasData } from '@/utils/core_data';
// #endregion

export default async function UsersPage() {
    const universitas = await getUniversitasData();

    return (
        <Users universitasData={universitas} />
    )
}