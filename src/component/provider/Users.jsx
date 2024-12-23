'use client'

// #region NEXT DEPEDENCY
import Image from 'next/image';
import error_svg from '/public/bug_fixing.svg';
// #endregion

// #region REACT DEPEDENCY
import { createContext, useEffect, useState } from "react"
// #endregion

// #region HOOKS DEPEDENCY
import { useCookies } from 'next-client-cookies';
// #endregion

// #region COMPONENT DEPEDENCY
import { ErrorBoundary } from 'react-error-boundary';
// #endregion

// #region UTIL DEPEDENCY
import { handleReactErrorBoundary } from '@/lib/bugsnag';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@users_page/users.module.css';
// #endregion

export const UsersContext = createContext(
    /** @type {import('@/types/context').UsersContext} */
    ({})
);
export const UsersProvider = ({ children }) => {
    const cookies = useCookies();

    const [loginMode, setLoginMode] = useState(
        /** @type {import('@/types/context').UsersContext['loginMode']} */
        (null)
    );
    const [isBigContent, setBigContent] = useState(
        /** @type {import('@/types/context').UsersContext['isBigContent']} */
        (0)
    );

    useEffect(() => {
        // Content Init
        const bigMediaQuery = window.matchMedia('(min-width: 870px)');

        const handleBigMediaQueryChange = (e) => {
            setBigContent(e.matches);
        }

        handleBigMediaQueryChange(bigMediaQuery);

        bigMediaQuery.addEventListener('change', handleBigMediaQueryChange);

        return () => {
            bigMediaQuery.removeEventListener('change', handleBigMediaQueryChange);
        }

    }, [])

    return (
        <ErrorBoundary
            FallbackComponent={UsersRootError}
            onError={(error, info) => handleReactErrorBoundary(error, info, cookies, 'UsersRootError')}
        >
            <UsersContext.Provider
                value={{
                    loginMode, setLoginMode,
                    isBigContent, setBigContent,
                }}
            >
                {children}
            </UsersContext.Provider>
        </ErrorBoundary>
    )
}

function UsersRootError() {
    return (
        <div className={styles.root_error_container}>
            <div className={styles.root_error_content}>
                <Image src={error_svg} alt={'Error Ilustration'} />
                <div className={styles.text}>
                    <h1>Terjadi Kesalahan</h1>
                    <p>
                        Sepertinya terjadi kesalahan tak terduga.
                        Kamu bisa coba refresh halaman ini dengan klik tombol dibawah.
                        Kalau masalah ini masih muncul setelah halaman direfresh,
                        kayaknya bakal ada yang lembur buat benerin ini 😞
                    </p>
                </div>
                <div className={styles.buttons} onClick={() => { window.location.reload() }}>
                    <button>Refresh Halaman</button>
                </div>
            </div>
        </div>
    )
}