'use client'

// #region STYLE DEPEDENCY
import styles from './style/landing.module.css'
// #endregion

export function Wrapper({ children }) {
    return (
        <div className={styles.wrapper}>
            {children}
        </div>
    )
}