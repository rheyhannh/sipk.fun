// #region COMPONENTS DEPEDENCY
import PageProvider from '@root_page/provider';
import { Container } from '@root_page/components';
import Header from '@root_page/sections/header';
import Hero from '@root_page/sections/hero';
import KenapaSipk from '@root_page/sections/kenapa_sipk';
import Universitas from '@root_page/sections/universitas';
import Fitur from '@root_page/sections/fitur';
import Testimoni from '@root_page/sections/testimoni';
import MulaiSekarang from '@root_page/sections/mulai_sekarang';
import Footer from '@root_page/sections/footer';
// #endregion

// #region UTIL DEPEDENCY
import { getUniversitasData, getRatingData, getNotifikasiData } from '@/utils/core_data';
// #endregion

export default async function RootPage() {
  const universitasData = await getUniversitasData();
  const ratingData = await getRatingData();
  const notifikasiData = await getNotifikasiData();

  return (
    <PageProvider>
      <Header />
      <Container>
        <Hero />
        <Universitas universitas={universitasData} />
        <KenapaSipk />
        {/* <Fitur /> */}
        <Testimoni rating={ratingData} />
        <MulaiSekarang />
      </Container>
      <Footer />
    </PageProvider>
  )
}