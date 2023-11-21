'use client'

// ========== REACT DEPEDENCY ========== //
import { createContext, useEffect, useState } from "react"

/*
============================== CODE START HERE ==============================
*/
export const DashboardContext = createContext();
export const DashboardProvider = ({ children }) => {
    /*
    ========== States ==========
    */
    // Nav 
    const [isNavbarActive, setNavbarActive] = useState(false);
    const [activeLink, setActiveLink] = useState(null);

    // Rich (min-width: 1280px), Phone (max-width: 768px)
    const [isRichContent, setRichContent] = useState(0);
    const [isPhoneContent, setPhoneContent] = useState(false);

    /*
    ========== Use Effect Hook ==========
    */
    useEffect(() => {
        // Content Init
        const richMediaQuery = window.matchMedia('(min-width: 1280px)');
        const phoneMediaQuery = window.matchMedia('(max-width: 767px)');

        const handleRichMediaQueryChange = (e) => {
            setNavbarActive(e.matches);
            setRichContent(e.matches);
        }

        const handlePhoneMediaQueryChange = (e) => {
            setPhoneContent(e.matches);
        }

        handleRichMediaQueryChange(richMediaQuery);
        handlePhoneMediaQueryChange(phoneMediaQuery);

        richMediaQuery.addEventListener('change', handleRichMediaQueryChange);
        phoneMediaQuery.addEventListener('change', handlePhoneMediaQueryChange);

        return () => {
            richMediaQuery.removeEventListener('change', handleRichMediaQueryChange);
            phoneMediaQuery.removeEventListener('change', handlePhoneMediaQueryChange);
        }
    }, [])

    return (
        <DashboardContext.Provider
            value={{
                isNavbarActive, setNavbarActive,
                activeLink, setActiveLink,
                isRichContent, setRichContent,
                isPhoneContent, setPhoneContent,
            }}
        >
            {children}
        </DashboardContext.Provider>
    )
}