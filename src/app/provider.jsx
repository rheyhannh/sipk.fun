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

if (process.env.NODE_ENV === 'production') {
    if (!Bugsnag.isStarted()) {
        startBugsnag();
    }
}

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
    const cookies = useCookies();

    return (
        <GlobalContext.Provider>
            {children}
        </GlobalContext.Provider>
    )
}