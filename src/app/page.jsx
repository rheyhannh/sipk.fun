// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingProvider } from '@/component/provider/Landing';
import { Container } from '@/component/landing/Container';
import { Wrapper } from '@/component/landing/Wrapper';
import { Landing } from '@/component/landing/sections/Landing';
import { Feature } from '@/component/landing/sections/Feature';
import { Context } from '@/component/landing/sections/Context';
import { Nav } from '@/component/landing/Nav';
// #endregion

/*
============================== CODE START HERE ==============================
*/

/**
 * Fetch data untuk universitas yang tersedia menggunakan headers `x-api-key` (supabase service role key).
 * @returns {Promise<Array<SupabaseTypes.UniversitasData>>} Array of universitas data.
 */
async function getUniversitasData() {
  const response = await fetch('http://localhost:3000/api/universitas', {
    headers: {
      'x-api-key': process.env.SUPABASE_SERVICE_KEY
    },
    next: { revalidate: 10 }
  });
  return await response.json();
}

/**
 * Fetch data untuk user rating yang tersedia menggunakan headers `x-api-key` (supabase service role key).
 * @returns {Promise<Array<SupabaseTypes.RatingData>>} Array of users rating data.
 */
async function getRatingData() {
  const response = await fetch('http://localhost:3000/api/rating', {
    headers: {
      'x-api-key': process.env.SUPABASE_SERVICE_KEY
    },
    next: { revalidate: 10 }
  });
  return await response.json();
}

async function getNotifikasiData() {
  const response = await fetch('http://localhost:3000/api/notifikasi', {
    headers: {
      'x-api-key': process.env.SUPABASE_SERVICE_KEY
    },
    next: { revalidate: 10 }
  });
  return await response.json();
}

export default async function LandingPage() {
  return (
    <LandingProvider>
      <Container>
        <Nav />
        <Wrapper>
          <Landing/>
          <Feature />
          <Context />
        </Wrapper>
      </Container>
    </LandingProvider>
  )
}

/*
============================== CODE END HERE ==============================
*/