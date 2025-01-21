// #region COMPONENTS DEPEDENCY
import { Container } from '@root_page/components';
import Hero from '@root_page/sections/hero';
import KenapaSipk from '@root_page/sections/kenapa_sipk';
import Universitas from '@root_page/sections/universitas';
import Fitur from '@root_page/sections/fitur';
import MulaiSekarang from '@root_page/sections/mulai_sekarang';
// #endregion

// #region UTIL DEPEDENCY
import getUniversitas from '@/lib/supabase/cached/getUniversitas';
import getRating from '@/lib/supabase/cached/getRating';
import getNotifikasi from '@/lib/supabase/cached/getNotifikasi';
// #endregion

export default async function HomePage() {
	const universitasData = await getUniversitas();
	const ratingData = await getRating();
	const notifikasiData = await getNotifikasi();

	return (
		<Container>
			<Hero notifikasi={notifikasiData} />
			<Universitas universitas={universitasData} />
			<KenapaSipk />
			<Fitur />
			{/* <Testimoni rating={ratingData} /> */}
			<MulaiSekarang />
		</Container>
	);
}
