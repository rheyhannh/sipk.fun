// #region PAGE DEPEDENCY
import Faq from '@faq_page/Faq';
// #endregion

// #region UTIL DEPEDENCY
import getFakta from '@/lib/supabase/cached/getFakta';
import getUniversitas from '@/lib/supabase/cached/getUniversitas';
// #endregion

export default async function FaqPage() {
	const fakta = await getFakta();
	const universitas = await getUniversitas();

	return <Faq fakta={fakta} universitas={universitas} />;
}
