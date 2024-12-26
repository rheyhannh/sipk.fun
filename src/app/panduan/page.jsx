// #region PAGE DEPEDENCY
import Panduan from '@panduan_page/Panduan';
// #endregion

// #region UTIL DEPEDENCY
import getFakta from '@/lib/supabase/cached/getFakta';
// #endregion

export default async function RootPage() {
    const fakta = await getFakta();

    return (
        <Panduan fakta={fakta} />
    )
}