'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENTS DEPEDENCY
import { RootProvider } from '@/component/provider/Root';
import { Container } from './RootComponents';
import Header from './RootHeader';
import Navbar from './RootNavbar';
import Hero from './RootHero';
import KenapaSipk from './RootKenapaSipkSection';
import Universitas from './RootUniversitasSection';
import Fitur from './RootFiturSection';
import Testimoni from './RootTestimoniSection';
import MulaiSekarang from './RootMulaiSekarangSection';
import Footer from './RootFooter';
// #endregion

/**
 * Props yang digunakan component `Root`
 * @typedef {Object} RootProps
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 * @property {Array<SupabaseTypes.RatingData>} rating
 * @property {Array<SupabaseTypes.NotifikasiData>} notifikasi
 */

/**
 * Render root page `'/'`
 * @param {RootProps} props Root props
 * @returns {React.ReactElement} Rendered root page
 */
export default function Root({ universitas, rating, notifikasi }) {
    return (
        <RootProvider>
            <Header />
            <Navbar/>
            <Container>
                <Hero />
                <Universitas universitas={universitas} />
                <KenapaSipk />
                <Fitur />
                <Testimoni rating={rating} />
                <MulaiSekarang />
            </Container>
            <Footer />
        </RootProvider>
    )
}