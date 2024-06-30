'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region REACT DEPEDENCY
import { useContext } from "react"
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from "@/component/provider/Landing"
import ThemeChanger from '../_test/ThemeChanger';
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
                <ThemeChanger
                    options={{
                        position: {
                            type: 'fixed',
                            preset: 'top-left',
                            offsetY: 92,
                            offsetX: 42
                        }
                    }}
                />
                {children}
            </div>
        </main>
    )
}