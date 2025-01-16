'use client'

// #region REACT DEPEDENCY
import { createContext } from "react";
// #endregion

// #region HOOKS DEPEDENCY
import { useCookies } from 'next-client-cookies';
// #endregion

// #region COMPONENT DEPEDENCY
import Notification from '@/component/loader/Toaster';
import ErrorTemplate from '@/component/Error';
import { ErrorBoundary } from 'react-error-boundary';
// #endregion

// #region UTIL DEPEDENCY
import Bugsnag from '@bugsnag/js';
import { startBugsnag, handleReactErrorBoundary } from '@/lib/bugsnag';
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
        <GlobalContext.Provider value={{}}>
            <Notification />
            <ErrorBoundary
                fallback={
                    <ErrorTemplate
                        title={'Terjadi Kesalahan'}
                        description={'Sepertinya terjadi kesalahan tak terduga. Kamu bisa coba mereset SIPK dengan klik tombol dibawah. Kalau masalah ini masih muncul, kayaknya bakal ada yang lembur buat benerin ini 😞'}
                        button={'Reset SIPK'}
                        reset={{
                            localStorage: true,
                            sessionStorage: true,
                            cookies: false,
                        }}
                        message={{
                            onStart: 'Loading',
                            onResetStorage: 'Mereset pengaturanmu',
                            onRefresh: 'Memuat ulang halaman'
                        }}
                        finish={'refresh'}
                    />
                }
                onError={(error, info) => handleReactErrorBoundary(error, info, cookies, { boundaryLocation: 'GlobalProvider' })}
            >
                {children}
            </ErrorBoundary>
        </GlobalContext.Provider>
    )
}