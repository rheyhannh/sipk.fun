'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@root_page/root.module.css';
// #endregion

const Hero = ({ universitas }) => {

    return (
        <section
            id={'home'}
            className={`${styles.section} ${styles.hero}`}
            style={{
                border: '1px solid pink'
            }}
        >

        </section>
    )
}

export default Hero;