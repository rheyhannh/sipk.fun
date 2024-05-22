'use client'

// #region STYLE DEPEDENCY
import styles from './style/landing.module.css'
// #endregion

/**
 * Render landing page wrapper
 * @param {{children}} props React props object
 * @param props.children Component or element children
 * @returns {ReactElement} Element react untuk render landing page wrapper
 */
export function Wrapper({ children }) {
    return (
        <div className={styles.wrapper}>
            {children}
        </div>
    )
}