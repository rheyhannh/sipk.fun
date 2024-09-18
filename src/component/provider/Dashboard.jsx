'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region NEXT DEPEDENCY
import { useRouter, usePathname } from "next/navigation";
// #endregion

// #region REACT DEPEDENCY
import { createContext, useEffect, useState } from "react";
// #endregion

// #region COMPONENT DEPEDENCY
import { useCookies } from 'next-client-cookies';
// #endregion

export const DashboardContext = createContext();
/**
 * Dashboard page context provider. Use this wrapper to use any `DashboardContext` config.
 * @param {Object} props React props object
 * @param {ContextTypes.DashboardContext['data']} props.data
 * @param {any} props.children Component or element children.
 * @returns {ReactElement} Dashboard page context provider wrapper.
 */
export const DashboardProvider = ({ data, children }) => {
    /* ========== Next Hooks ========== */
    const router = useRouter();
    const pathname = usePathname();

    /*
    ========== States ==========
    */
    // Nav 
    const [isNavbarActive, setNavbarActive] = useState(false);
    const [activeLink, setActiveLink] = useState(null);

    // Rich (min-width: 1280px), Phone (max-width: 768px)
    const [isRichContent, setRichContent] = useState(0);
    const [isPhoneContent, setPhoneContent] = useState(false);

    // Touch Devices
    const [isTouchDevice, setTouchDevice] = useState(false);

    /* ========== Cookies ========== */
    const cookies = useCookies();

    /*
    ========== Use Effect Hook ==========
    */
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

    /* ========== Methods, Functions, Helpers ========== */
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
                data,
            }}
        >
            {children}
        </DashboardContext.Provider>
    )
}