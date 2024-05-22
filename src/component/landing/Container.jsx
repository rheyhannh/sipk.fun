'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region REACT DEPEDENCY
import { useContext } from "react"
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from "@/component/provider/Landing"
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/landing.module.css'
// #endregion

/**
 * Render landing page container
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