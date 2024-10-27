'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/panduan.module.css'
// #endregion

/**
 * Render panduan page `'/panduan'`
 * @param {{fakta:Array<SupabaseTypes.FaktaData>}} props Panduan props
 * @returns {React.ReactElement} Rendered panduan page
 */
export default function Panduan({ fakta }) {
    return (
        <div className={styles.container}>
            <span onClick={() => { console.log(fakta) }} >
                Under Construction
            </span>
        </div>
    )
}