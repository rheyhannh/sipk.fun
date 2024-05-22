'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

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
 * Landing page context provider. Use this wrapper to use any `LandingContext` config
 * @param {{children:any, serverData:{universitas:Array<SupabaseTypes.UniversitasData>, rating: Array<SupabaseTypes.RatingData>, notifikasi: Array<SupabaseTypes.NotifikasiData>}}} props React props object
 * @param props.children Component or element children
 * @param props.serverData Data depedency from SSR
 * @returns {ReactElement} Landing page context provider wrapper
 */
export const LandingProvider = ({ children, serverData }) => {
    // #region Hooks
    const cookies = useCookies();
    const [isRichContent, setRichContent] = useState(0);
    const [isTouchDevice, setTouchDevice] = useState(false);
    const [isAccessTokenExist, setAccessTokenExist] = useState(false);
    const [data, setData] = useState(serverData);

    useEffect(() => {
        // Content Init
        const richMediaQuery = window.matchMedia('(min-width: 820px)');
        const touchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
        const accessTokenCookie = cookies.get('s_access_token');

        setRichContent(richMediaQuery.matches);
        if (touchDevice) { setTouchDevice(true); }
        if (accessTokenCookie) { setAccessTokenExist(true); }

        richMediaQuery.addEventListener('change', (e) => { setRichContent(e.matches) });
        window.addEventListener('touchstart', () => { if (!isTouchDevice) { setTouchDevice(true); } })
        window.addEventListener('mouseover', () => { if (isTouchDevice) { setTouchDevice(false); } })
        window.addEventListener('focus', handleOnFocusWindow);

        return () => {
            richMediaQuery.removeEventListener('change', (e) => { setRichContent(e.matches) });
            window.removeEventListener('touchstart', () => { });
            window.removeEventListener('mouseover', () => { });
            window.removeEventListener('focus', () => { });
        }
    }, [])
    // #endregion

    // #region Methods, Helpers, Etc
    const handleOnFocusWindow = () => {
        const accessTokenCookie = cookies.get('s_access_token');
        setAccessTokenExist(accessTokenCookie ? true : false);
    }
    // #endregion

    return (
        <LandingContext.Provider
            value={{
                isRichContent, setRichContent,
                isTouchDevice, setTouchDevice,
                isAccessTokenExist, setAccessTokenExist,
                data, setData
            }}
        >
            {children}
        </LandingContext.Provider>
    )
}

/*
============================== CODE END HERE ==============================
*/