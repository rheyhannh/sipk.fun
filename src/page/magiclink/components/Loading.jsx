'use client'

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@magiclink_page/magiclink.module.css';
// #endregion

/**
 * Magiclink content saat state `loading` dengan classname yang sudah ditentukan
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'> & {fakta:Array<import('@/types/supabase').FaktaData>}} props Loading props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLDivElement>, 'className'>, HTMLDivElement>} Rendered content loading
 */
function Loading({ fakta, ...props }) {
    const [usedFakta, setUsedFakta] = React.useState('');
    const defaultFakta = 'Email Login adalah fitur untuk kamu yang mau login tanpa menggunakan password.';

    React.useEffect(() => {
        if (fakta && fakta.length > 0) {
            const randomIndex = Math.floor(Math.random() * fakta.length);
            const selectedFakta = fakta[randomIndex]?.text ?? defaultFakta;
            setUsedFakta(selectedFakta);
        }
        else { setUsedFakta(defaultFakta) }
    }, [fakta])

    return (
        <div className={`${styles.content} ${styles.no_action}`} {...props}>
            <h2 className={styles.content__title}>
                Memproses Magiclink
            </h2>
            <div className={`${styles.content__text} ${styles.intermezzo}`}>
                {usedFakta}
            </div>
        </div>
    )
}

export default Loading