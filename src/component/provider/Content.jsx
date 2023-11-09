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
    const [isRichContent, setRichContent] = useState(false);

    useEffect(() => {
        // Theme Init
        const localTheme = localStorage.getItem('_theme');
        if (localTheme === 'dark') { setTheme(localTheme); document.body.classList.add('dark-theme'); }
        else { localStorage.setItem('_theme', 'light') }

        // Content Init
        const richMediaQuery = window.matchMedia('(min-width: 1280px)');
        const handleMediaQueryChange = (e) => {
            setNavbarActive(e.matches);
            setRichContent(e.matches);
        }

        handleMediaQueryChange(richMediaQuery);
        richMediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => {
            richMediaQuery.removeEventListener('change', handleMediaQueryChange);
        }

    }, []);

    return (
        <ContentContext.Provider
            value={{
                theme, setTheme,
                isNavbarActive, setNavbarActive,
                activeLink, setActiveLink,
                isRichContent, setRichContent
            }}
        >
            {children}
        </ContentContext.Provider>
    )
}