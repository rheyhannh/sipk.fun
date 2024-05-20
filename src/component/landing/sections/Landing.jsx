'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js'
// #endregion

// #region REACT DEPEDENCY
import { useContext, useRef, useEffect, useState } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing'
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/landing.module.css'
// #endregion

export function Landing() {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist } = useContext(LandingContext);

    return (
        <section className={`${styles.section} ${styles.landing}`} id={'landing'}>
            <div className={styles.section__name}>
                <h1>Landing</h1>
            </div>
        </section>
    )
}