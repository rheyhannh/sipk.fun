'use client'

// #region NEXT DEPEDENCY
import { useSearchParams } from 'next/navigation';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@magiclink_page/magiclink.module.css';
// #endregion

/**
 * Context value untuk halaman magiclink `/magiclink`
 * @ContextProvider Lihat {@link MagiclinkProvider disini}
 */
export const MagiclinkContext = React.createContext(/** @type {import('@/types/context').MagiclinkContext} */({}));

/**
 * Context provider untuk halaman magiclink `/magiclink`
 * @ContextValue Lihat {@link MagiclinkContext disini}
 */
const MagiclinkProvider = ({ children }) => {
    const isLogin = useSearchParams().get('action') === 'login';
    const [states, setStates] = React.useState(
        /** @type {import('@/types/context').MagiclinkContext['states']} */
        ({ loading: false, success: false, error: false, code: null })
    );

    const getClassnameByState = () => states.loading ? styles.loading : states.success ? styles.success : states.error ? styles.error : '';

    return (
        <MagiclinkContext.Provider
            value={{ isLogin, states, setStates, getClassnameByState }}
        >
            {children}
        </MagiclinkContext.Provider>
    )
}

export default MagiclinkProvider;