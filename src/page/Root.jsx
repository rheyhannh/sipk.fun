'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENTS DEPEDENCY
import { Container } from './RootComponents';
import Header from './RootHeader';
import Hero from './RootHero';
import CaraPakai from './RootCaraPakaiSection';
import Universitas from './RootUniversitasSection';
import Fitur from './RootFiturSection';
import Testimoni from './RootTestimoniSection';
import MulaiSekarang from './RootMulaiSekarangSection';
import Footer from './RootFooter';
// #endregion

/**
 * Render root page `'/'`
 * @param {{universitas:Array<SupabaseTypes.UniversitasData>, rating:Array<SupabaseTypes.RatingData>, notifikasi:Array<SupabaseTypes.NotifikasiData>}} props Root props
 * @returns {React.ReactElement} Rendered root page
 */
export default function Root({ universitas, rating, notifikasi }) {
    return (
        <>
            <Header />
            <Container>
                <Hero/>
                <Universitas universitas={universitas} />
                <CaraPakai />
                <Fitur />
                <Testimoni rating={rating} />
                <MulaiSekarang />
            </Container>
            <Footer />
        </>
    )
}