'use client'

import { createContext, useEffect, useState } from "react"

export const ContentContext = createContext();
export const ContentProvider = ({ children }) => {
    // Theme 
    const [theme, setTheme] = useState('light');
    // Nav
    const [isNavbarActive, setNavbarActive] = useState(false);
    const [activeLink, setActiveLink] = useState(null);
    // Content
    const [isRichContent, setRichContent] = useState(0);
    const [isPhoneContent, setPhoneContent] = useState(false);

    useEffect(() => {
        // Theme Init
        const localTheme = localStorage.getItem('_theme');
        if (localTheme === 'dark') { setTheme(localTheme); document.body.classList.add('dark-theme'); }
        else { localStorage.setItem('_theme', 'light') }

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

    }, []);

    return (
        <ContentContext.Provider
            value={{
                theme, setTheme,
                isNavbarActive, setNavbarActive,
                activeLink, setActiveLink,
                isRichContent, setRichContent,
                isPhoneContent, setPhoneContent
            }}
        >
            {children}
        </ContentContext.Provider>
    )
}