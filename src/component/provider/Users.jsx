'use client'

// ========== REACT DEPEDENCY ========== //
import { createContext, useEffect, useState } from "react"

/*
============================== CODE START HERE ==============================
*/

export const UsersContext = createContext();
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
                isBigContent, setBigContent
            }}
        >
            {children}
        </UsersContext.Provider>
    )
}

/*
============================== CODE END HERE ==============================
*/