'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js'
// #endregion

// #region NEXT DEPEDENCY
import { usePathname, useSearchParams } from 'next/navigation'
// #endregion

// #region REACT DEPEDENCY
import { useContext, useEffect } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { DashboardContext } from '@dashboard_page/provider';
// #endregion

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