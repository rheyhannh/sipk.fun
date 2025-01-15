'use client'

// #region NEXT DEPEDENCY
import Image from 'next/image';
import error_svg from '/public/bug_fixing.svg';
// #endregion

// #region REACT DEPEDENCY
import { createContext } from "react";
// #endregion

// #region HOOKS DEPEDENCY
import { useCookies } from 'next-client-cookies';
// #endregion

// #region COMPONENT DEPEDENCY
import { ErrorBoundary } from 'react-error-boundary';
// #endregion

// #region UTIL DEPEDENCY
import Bugsnag from '@bugsnag/js';
import { startBugsnag, handleReactErrorBoundary } from '@/lib/bugsnag';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/app/error.module.css';
// #endregion

if (process.env.NODE_ENV === 'production') {
    if (!Bugsnag.isStarted()) {
        startBugsnag();
    }
}

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
    const cookies = useCookies();

    return (
        <ErrorBoundary
            FallbackComponent={GlobalRootError}
            onError={(error, info) => handleReactErrorBoundary(error, info, cookies, 'GlobalRootError')}
        >
            <GlobalContext.Provider value={{}}>
                {children}
            </GlobalContext.Provider>
        </ErrorBoundary>
    )
}

function GlobalRootError({ error, resetErrorBoundary }) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Image src={error_svg} alt={'Error Ilustration'} />
                <div className={styles.text}>
                    <h1>Terjadi Kesalahan</h1>
                    <p>
                        Sepertinya terjadi kesalahan tak terduga.
                        Kamu bisa coba refresh halaman ini dengan klik tombol dibawah.
                        Kalau masalah ini masih muncul, kayaknya bakal ada yang lembur buat benerin ini 😞
                    </p>
                </div>
                <div className={styles.buttons} onClick={() => { window.location.reload() }}>
                    <button>Refresh Halaman</button>
                </div>
            </div>
        </div>
    )
}