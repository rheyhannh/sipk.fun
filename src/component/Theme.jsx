'use client'

import { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [navActive, setNavActive] = useState(false);
    const [isRichContent, setIsRichContent] = useState(false);
    const [linkActive, setActiveLink] = useState(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1280px)');

        const handleMediaQueryChange = (e) => {
            setNavActive(e.matches);
            setIsRichContent(e.matches);
        }

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        const localTheme = localStorage.getItem('_theme');
        if (localTheme === 'dark') {
            setTheme(localTheme);
            document.body.classList.add('dark-theme');
        }

        handleMediaQueryChange(mediaQuery);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, navActive, setNavActive, isRichContent, linkActive, setActiveLink }}>
            {children}
        </ThemeContext.Provider>
    )
}