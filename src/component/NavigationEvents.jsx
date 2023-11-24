'use client'

import { useContext, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { DashboardContext } from './provider/Dashboard';

export function NavigationEvents() {
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