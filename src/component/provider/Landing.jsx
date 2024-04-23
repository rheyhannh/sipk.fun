'use client'

// ========== REACT DEPEDENCY ========== //
import { createContext, useEffect, useState } from "react";

/*
============================== CODE START HERE ==============================
*/

export const LandingContext = createContext();
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

        const handleRichMediaQueryChange = (e) => {
            setRichContent(e.matches);
        }

        handleRichMediaQueryChange(richMediaQuery);
        if (touchDevice) { setTouchDevice(true); }

        richMediaQuery.addEventListener('change', handleRichMediaQueryChange);
        window.addEventListener('touchstart', () => {
            if (!isTouchDevice) { setTouchDevice(true); }
        })
        window.addEventListener('mouseover', () => {
            if (isTouchDevice) { setTouchDevice(false); }
        })

        return () => {
            richMediaQuery.removeEventListener('change', handleRichMediaQueryChange);
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