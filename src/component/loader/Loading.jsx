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

/**
 * Render spinning ball untuk feedback loading display dengan atau tanpa backdrop.
 * @param {{active:boolean, backdrop:'none'|'transparent'|{cssCustomProps}, hideBall?:boolean|false}} props React props object.
 * @param props.active Aktif atau tidaknya component. Apply `display:flex` saat aktif, apply `display:none` saat nonaktif.
 * @param props.backdrop Gunakan `'none'` untuk render spinning ball tanpa backdrop, `'transparent'` untuk backdrop transparan atau `{...cssCustomProps}` untuk custom CSS styling.
 * @param props.hideBall Sembunyikan atau tampilkan spinning ball. Saat disembunyikan, spinning ball tidak dirender bukan dihide dari CSS.
 * @returns {ReactElement} Element react untuk render spinning ball dengan atau tanpa backdrop.
 */
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

/*
============================== CODE END HERE ==============================
*/