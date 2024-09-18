'use client'

// #region REACT DEPEDENCY
import { createContext, useEffect, useState } from "react"
// #endregion

export const UsersContext = createContext();
/**
 * Users page context provider. Use this wrapper to use any `UsersContext` config.
 * @param {Object} props UsersProvider props
 * @param {any} props.children Component or element children.
 * @returns {ReactElement} Users page context provider wrapper.
 */
export const UsersProvider = ({ children }) => {
    /*
    ========== States ==========
    */
    // Mode (Login or Register)
    const [loginMode, setLoginMode] = useState(null);

    // Big Content (min-width: 870px)
    const [isBigContent, setBigContent] = useState(0);

    /*
    ========== Use Effect Hook ==========
    */
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