'use client'

// ========== TYPE DEPEDENCY ========== //
import * as ContextTypes from '../types/context.js'

// ========== NEXT DEPEDENCY ========== //
import { usePathname, useSearchParams } from 'next/navigation'

// ========== REACT DEPEDENCY ========== //
import { useContext, useEffect } from 'react'

// ========== COMPONENT DEPEDENCY ========== //
import { DashboardContext } from './provider/Dashboard';

/*
============================== CODE START HERE ==============================
*/

export function NavigationEvents() {
    /** @type {ContextTypes.DashboardContext} */
    const { setActiveLink, setNavbarActive, isRichContent } = useContext(DashboardContext);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setActiveLink(pathname);
        if (!isRichContent) {
            setNavbarActive(false);
            document.body.classList.remove('disable_scroll');
        }
    }, [pathname, searchParams])

    return null
}

/*
============================== CODE END HERE ==============================
*/