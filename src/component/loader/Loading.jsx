// ========== STYLE DEPEDENCY ========== //
import styles from '../style/loading.module.css'

/*
============================== CODE START HERE ==============================
*/
export function Spinner({ size, color }) {
    return (
        <span
            style={{
                width: size ? size : '24px',
                height: size ? size : '24px',
                borderTop: color ? `3px solid ${color}` : '3px solid var(--infoDark-color)'
            }}
            className={styles.spinner}
        >
        </span>
    )
}

export function Ball({ active, backdrop, hideBall = false }) {
    if (backdrop === 'none') { return hideBall ? null : <span className={styles.ball} /> }
    else if (backdrop === 'transparent') {
        return (
            <div className={`${styles.backdrop} ${styles.transparent}`} style={{ display: active ? 'flex' : 'none' }}>
                {hideBall ? null : <span className={styles.ball} />}
            </div>
        )
    } else if (typeof backdrop === 'object') {
        return (
            <div className={styles.backdrop} style={{ display: active ? 'flex' : 'none', ...backdrop }}>
                {hideBall ? null : <span className={styles.ball} />}
            </div>
        )
    } else {
        return (
            <div className={styles.backdrop} style={{ display: active ? 'flex' : 'none' }}>
                {hideBall ? null : <span className={styles.ball} />}
            </div>
        )
    }
}