'use client'

// #region REACT DEPEDENCY
import { createContext, useEffect, useState } from "react";
// #endregion

// #region COMPONENT DEPEDENCY
import { useCookies } from 'next-client-cookies';
// #endregion

/*
============================== CODE START HERE ==============================
*/

export const LandingContext = createContext();
/**
 * Landing page context provider. Use this wrapper to use any `LandingContext` config.
 * @param {{children:any}} props React props object
 * @param props.children Component or element children.
 * @returns {ReactElement} Landing page context provider wrapper.
 */
export const LandingProvider = ({ children }) => {
    // #region Hooks
    const cookies = useCookies();
    const [isRichContent, setRichContent] = useState(0);
    const [isTouchDevice, setTouchDevice] = useState(false);
    useEffect(() => {
        // Content Init
        const richMediaQuery = window.matchMedia('(min-width: 820px)');
        const touchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;

        setRichContent(richMediaQuery.matches);
        if (touchDevice) { setTouchDevice(true); }

        richMediaQuery.addEventListener('change', (e) => { setRichContent(e.matches) });
        window.addEventListener('touchstart', () => { if (!isTouchDevice) { setTouchDevice(true); } })
        window.addEventListener('mouseover', () => { if (isTouchDevice) { setTouchDevice(false); } })

        return () => {
            richMediaQuery.removeEventListener('change', (e) => { setRichContent(e.matches) });
            window.removeEventListener('touchstart', () => { });
            window.removeEventListener('mouseover', () => { });
        }
    }, [])
    // #endregion

    // #region Methods, Helpers, Etc
    
    // #endregion

    return (
        <LandingContext.Provider
            value={{
                isRichContent, setRichContent,
                isTouchDevice, setTouchDevice
            }}
        >
            {children}
        </LandingContext.Provider>
    )
}

/*
============================== CODE END HERE ==============================
*/