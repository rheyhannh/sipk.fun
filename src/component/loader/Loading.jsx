// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/loading.module.css';
// #endregion

/**
 * Props yang digunakan component `Spinner`
 * @typedef {Object} SpinnerProps
 * @property {React.CSSProperties['width'] | React.CSSProperties['height']} [size]
 * Ukuran spinner yang digunakan untuk width dan height element pada attribute `style`
 * - Default : `'24px'`
 * @property {React.CSSProperties['borderColor']} color
 * Warna spinner yang digunakan untuk border color element pada attribute `style`
 * - Default : `'var(--infoDark-color)'`
 */

/**
 * Render spinner untuk feedback loading dengan `className` tertentu.
 * @param {Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> & SpinnerProps} props Spinner props
 * @returns {React.ReactElement<Omit<React.HTMLAttributes<HTMLSpanElement>, 'className'> & SpinnerProps, HTMLSpanElement>} Rendered component
 */
export function Spinner({ size, color, ...props }) {
    return (
        <span
            style={{
                width: size ? size : '24px',
                height: size ? size : '24px',
                borderTop: color ? `3px solid ${color}` : '3px solid var(--infoDark-color)'
            }}
            className={styles.spinner}
            {...props}
        >
        </span>
    )
}

/**
 * Props yang digunakan component `Ball`
 * @typedef {Object} BallProps
 * @property {boolean} active
 * Boolean sebagai aktif atau tidaknya element
 * @property {'none' | 'transparent' | React.CSSProperties} backdrop
 * Tipe backdrop atau overlay yang digunakan dengan penjelasan berikut,
 * - `'none'` : Tanpa menggunakan overlay, hanya spinning ball
 * - `'transparent'` : Untuk overlay yang transparan
 * - `{}` : Atau sebuah object yang berisikan style yang digunakan
 * @property {boolean} hideBall
 * Sembunyikan spinning ball, saat truthy ini membuat element spinning ball tidak dirender
 * - Default : `false`
 */

/**
 * Render spinning ball untuk feedback loading dengan `className` dan `style` tertentu.
 * @param {Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> & BallProps} props Ball props
 * @returns {React.ReactElement<Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'> & BallProps, HTMLDivElement>} Rendered component
 */
export function Ball({ active, backdrop, hideBall = false, ...props }) {
    if (backdrop === 'none') { return hideBall ? null : <span className={styles.ball} /> }
    else if (backdrop === 'transparent') {
        return (
            <div className={`${styles.backdrop} ${styles.transparent}`} style={{ display: active ? 'flex' : 'none' }} {...props}>
                {hideBall ? null : <span className={styles.ball} />}
            </div>
        )
    } else if (typeof backdrop === 'object') {
        return (
            <div className={styles.backdrop} style={{ display: active ? 'flex' : 'none', ...backdrop }} {...props}>
                {hideBall ? null : <span className={styles.ball} />}
            </div>
        )
    } else {
        return (
            <div className={styles.backdrop} style={{ display: active ? 'flex' : 'none' }} {...props}>
                {hideBall ? null : <span className={styles.ball} />}
            </div>
        )
    }
}