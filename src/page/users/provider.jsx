'use client'

// #region REACT DEPEDENCY
import { createContext, useEffect, useState } from "react"
// #endregion

export const UsersContext = createContext(
    /** @type {import('@/types/context').UsersContext} */
    ({})
);
export const UsersProvider = ({ children }) => {
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
        <UsersContext.Provider
            value={{
                loginMode, setLoginMode,
                isBigContent, setBigContent,
            }}
        >
            {children}
        </UsersContext.Provider>
    )
}