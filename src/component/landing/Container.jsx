'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region REACT DEPEDENCY
import { useContext, useEffect } from "react"
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from "@/component/provider/Landing"
import { mutate } from 'swr';
// #endregion

// #region DATA DEPEDENCY
import { useLocalTheme } from '@/data/core';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/landing.module.css'
// #endregion

/**
 * Render landing page container
 * @param {{children}} props React props object
 * @param props.children Component or element children
 * @returns {ReactElement} Element react untuk render landing page container
 */
export function Container({ children }) {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice } = useContext(LandingContext);

    return (
        <main>
            <div className={styles.container}>
                {children}
            </div>
        </main>
    )
}