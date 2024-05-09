// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingProvider } from '@/component/provider/Landing';
import { Container } from '@/component/landing/Container';
import { Wrapper } from '@/component/landing/Wrapper';
// #endregion

/*
============================== CODE START HERE ==============================
*/

async function getUniversitasData() {
  return await (await fetch('http://localhost:3000/api/universitas?type=public&id=all', { next: { revalidate: 10 } })).json();
}

async function getRatingData() {
  return ['abc', 'cde', 'fgh'];
}

export default async function LandingPage() {
  return (
    <LandingProvider>
      <Container>
        <Wrapper>
        </Wrapper>
      </Container>
    </LandingProvider>
  )
}

/*
============================== CODE END HERE ==============================
*/