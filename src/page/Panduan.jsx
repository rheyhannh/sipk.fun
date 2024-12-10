'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { TextFitContainer } from './RootComponents';
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
    const containerRef = React.useRef(/** @type {HTMLDivElement} */(null));

    return (
        <div ref={containerRef} className={styles.container}>
            <TextFitContainer
                containerRef={containerRef}
                as={'h1'}
                maxSize={55}
                style={{ whiteSpace: 'normal' }}
            >
                Under Construction
            </TextFitContainer>
        </div>
    )
}