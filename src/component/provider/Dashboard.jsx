'use client'

// #region NEXT DEPEDENCY
import { useRouter, usePathname } from "next/navigation";
// #endregion

// #region REACT DEPEDENCY
import { createContext, useEffect, useState } from "react";
// #endregion

// #region COMPONENT DEPEDENCY
import { useCookies } from 'next-client-cookies';
// #endregion

// #region UTIL DEPEDENCY
import Bugsnag, { startBugsnag } from "@/lib/bugsnag";
// #endregion

if (process.env.NODE_ENV === 'production') {
    if (!Bugsnag.isStarted()) {
        startBugsnag();
    }
}

export const DashboardContext = createContext(/** @type {import('@/types/context').DashboardContext} */({}));
export const DashboardProvider = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const cookies = useCookies();

    const [isNavbarActive, setNavbarActive] = useState(
        /** @type {import('@/types/context').DashboardContext['isNavbarActive']} */
        (false)
    );
    const [activeLink, setActiveLink] = useState(
        /** @type {import('@/types/context').DashboardContext['activeLink']} */
        (null)
    );
    const [isRichContent, setRichContent] = useState(
        /** @type {import('@/types/context').DashboardContext['isRichContent']} */
        (0)
    );
    const [isPhoneContent, setPhoneContent] = useState(
        /** @type {import('@/types/context').DashboardContext['isPhoneContent']} */
        (false)
    );
    const [isTouchDevice, setTouchDevice] = useState(
        /** @type {import('@/types/context').DashboardContext['isTouchDevice']} */
        (false)
    );

    useEffect(() => {
        // Content Init
        const richMediaQuery = window.matchMedia('(min-width: 1280px)');
        const phoneMediaQuery = window.matchMedia('(max-width: 767px)');
        const touchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;

        const handleRichMediaQueryChange = (e) => {
            setNavbarActive(e.matches);
            setRichContent(e.matches);
        }

        const handlePhoneMediaQueryChange = (e) => {
            setPhoneContent(e.matches);
        }

        handleRichMediaQueryChange(richMediaQuery);
        handlePhoneMediaQueryChange(phoneMediaQuery);
        if (touchDevice) { setTouchDevice(true); }

        richMediaQuery.addEventListener('change', handleRichMediaQueryChange);
        phoneMediaQuery.addEventListener('change', handlePhoneMediaQueryChange);
        window.addEventListener('touchstart', () => {
            if (!isTouchDevice) {
                setTouchDevice(true);
            }
        })
        window.addEventListener('mouseover', () => {
            if (isTouchDevice) {
                setTouchDevice(false);
            }
        })

        return () => {
            richMediaQuery.removeEventListener('change', handleRichMediaQueryChange);
            phoneMediaQuery.removeEventListener('change', handlePhoneMediaQueryChange);
            window.removeEventListener('touchstart', () => { });
            window.removeEventListener('mouseover', () => { });
        }
    }, [])

    useEffect(() => {
        window.addEventListener('focus', handleAuthCheck);

        return () => {
            window.removeEventListener('focus', handleAuthCheck);
        }
    }, [])

    const handleAuthCheck = async () => {
        if (cookies.get('s_access_token')) {
            return;
        }

        let redirectPath = '/users?action=login&error=esession';
        if (pathname === '/dashboard') {
            redirectPath += '&from=dashboard';
        } else if (pathname === '/dashboard/matakuliah') {
            redirectPath += '&from=matakuliah';
        }

        router.replace(redirectPath, { scroll: false });
    }

    return (
        <DashboardContext.Provider
            value={{
                isNavbarActive, setNavbarActive,
                activeLink, setActiveLink,
                isRichContent, setRichContent,
                isPhoneContent, setPhoneContent,
                isTouchDevice, setTouchDevice,
            }}
        >
            {children}
        </DashboardContext.Provider>
    )
}