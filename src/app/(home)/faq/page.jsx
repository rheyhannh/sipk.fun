// #region PAGE DEPEDENCY
import Faq from '@faq_page/Faq';
// #endregion

// #region UTIL DEPEDENCY
import getFakta from '@/lib/supabase/cached/getFakta';
// #endregion

export default async function RootPage() {
    const fakta = await getFakta();

    return (
        <Faq fakta={fakta} />
    )
}