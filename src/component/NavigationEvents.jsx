'use client'

import { useContext, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { ContentContext } from './provider/Content';

export function NavigationEvents() {
    const { setActiveLink } = useContext(ContentContext);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setActiveLink(pathname);
    }, [pathname, searchParams])

    return null
}