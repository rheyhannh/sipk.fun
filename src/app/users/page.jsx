// #region PAGE DEPEDENCY
import Users from '@users_page/Users';
// #endregion

// #region UTIL DEPEDENCY
import getUniversitas from '@/lib/supabase/cached/getUniversitas';
// #endregion

export default async function UsersPage() {
    const universitas = await getUniversitas();

    return (
        <Users universitasData={universitas} />
    )
}