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

/**
 * Fetch data dari supabase untuk universitas yang tersedia.
 * @returns {Promise<Array<SupabaseTypes.UniversitasData>>} Array of universitas data.
 */
async function getUniversitasData() {
  return await (await fetch('http://localhost:3000/api/universitas?type=public&id=all', { next: { revalidate: 10 } })).json();
}

/**
 * Fetch data dari supabase untuk user rating yang tersedia.
 * @returns {Promise<Array<SupabaseTypes.RatingData>>} Array of users rating data.
 */
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