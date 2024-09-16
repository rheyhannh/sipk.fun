// #region PAGES DEPEDENCY
import Users from '@/pages/Users';
// #endregion

// #region UTIL DEPEDENCY
import { getUniversitasData } from '@/utils/core_data';
// #endregion

// #region VARIABLES
const revalidateUniversitasData = 86400; // Revalidate every 24 hours
// #endregion

export default async function UsersPage() {
    const universitas = await getUniversitasData(revalidateUniversitasData);

    return (
        <Users universitasData={universitas} />
    )
}