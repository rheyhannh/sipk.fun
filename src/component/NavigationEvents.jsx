'use client'

import { useContext, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { ThemeContext } from './Theme';

export function NavigationEvents() {
    const { linkActive, setActiveLink } = useContext(ThemeContext);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setActiveLink(pathname);
    }, [pathname, searchParams])

    return null
}