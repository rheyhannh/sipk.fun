// #region COMPONENT DEPEDENCY
import { LandingProvider } from '@/component/provider/Landing';
import { Container } from '@/component/landing/Container';
import { Wrapper } from '@/component/landing/Wrapper';
import { Introduction } from '@/component/landing/sections/Introduction';
import TambahHapus from '@/component/landing/sections/TambahHapus';
import Universitas from '@/component/landing/sections/Universitas';
import { How } from '@/component/landing/sections/How';
import { Context } from '@/component/landing/sections/Context';
import { Header } from '@/component/landing/Header';
// #endregion

// #region UTIL DEPEDENCY
import { getUniversitasData, getRatingData, getNotifikasiData } from '@/utils/core_data';
// #endregion

export default async function LandingPage() {
  const universitasData = await getUniversitasData();
  const ratingData = await getRatingData();
  const notifikasiData = await getNotifikasiData();

  return (
    <LandingProvider
      serverData={{
        universitas: universitasData, rating: ratingData, notifikasi: notifikasiData
      }}
    >
      <Header />
      <Container>
        <Wrapper>
          <Context sectionProps={{ id: 'context-1' }} />
          <Introduction />
          <How />
          <TambahHapus />
          <Universitas />
          <Context sectionProps={{ id: 'context-2' }} />
        </Wrapper>
      </Container>
    </LandingProvider>
  )
}