import styles from '../style/loading.module.css'

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

export function Ball({ backdrop, active }) {
    if (backdrop) {
        return (
            <div className={styles.backdrop} style={{ display: active ? 'flex' : 'none' }}>
                <span className={styles.ball}/>
            </div>
        )
    } else {
        return (
            <span className={styles.ball}/>
        )
    }
}