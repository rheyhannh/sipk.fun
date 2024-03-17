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

export function Ball({ active, backdrop, backdropStyle = {}, hideBall = false }) {
    if (backdrop) {
        return (
            <div className={styles.backdrop} style={{ display: active ? 'flex' : 'none', ...backdropStyle }}>
                {hideBall ? null : <span className={styles.ball} />}
            </div>
        )
    } else {
        return (
            <>
                {hideBall ? null : <span className={styles.ball} />}
            </>
        )
    }
}