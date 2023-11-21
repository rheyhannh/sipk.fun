'use client'

import { useContext, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { DashboardContext } from './provider/Dashboard';

export function NavigationEvents() {
    const { setActiveLink } = useContext(DashboardContext);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setActiveLink(pathname);
    }, [pathname, searchParams])

    return null
}