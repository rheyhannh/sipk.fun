'use client'

// ========== REACT DEPEDENCY ========== //
import { createContext, useEffect, useState } from "react"

/*
============================== CODE START HERE ==============================
*/
export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
    /*
    ========== States ==========
    */
    // Theme 
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Theme Init
        const localTheme = localStorage.getItem('_theme');
        if (localTheme === 'dark') { setTheme(localTheme); document.body.classList.add('dark-theme'); }
        else { localStorage.setItem('_theme', 'light') }
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                theme, setTheme,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}