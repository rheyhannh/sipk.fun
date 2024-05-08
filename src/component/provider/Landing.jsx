'use client'

// ========== REACT DEPEDENCY ========== //
import { createContext, useEffect, useState } from "react";

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
    /*
    ========== States ==========
    */
    // Rich (min-width: 820px)
    const [isRichContent, setRichContent] = useState(0);

    // Touch Devices
    const [isTouchDevice, setTouchDevice] = useState(false);

    /*
    ========== Use Effect Hook ==========
    */
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