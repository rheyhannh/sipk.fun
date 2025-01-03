'use client'

// #region NEXT DEPEDENCY
import { useRouter, usePathname } from "next/navigation";
import Image from 'next/image';
import error_svg from '/public/bug_fixing.svg';
// #endregion

// #region REACT DEPEDENCY
import { createContext, useEffect, useState } from "react";
// #endregion

// #region HOOKS DEPEDENCY
import { useCookies } from 'next-client-cookies';
// #endregion

// #region COMPONENT DEPEDENCY
import toast from "react-hot-toast";
import { ErrorBoundary } from 'react-error-boundary';
// #endregion

// #region UTIL DEPEDENCY
import Bugsnag, { startBugsnag, handleReactErrorBoundary } from "@/lib/bugsnag";
// #endregion

// #region STYLE DEPEDENCY
import styles from '@dashboard_page/dashboard.module.css';
// #endregion

if (process.env.NODE_ENV === 'production') {
    if (!Bugsnag.isStarted()) {
        startBugsnag();
    }
}

export const DashboardContext = createContext(
    /** @type {import('@/types/context').DashboardContext} */
    ({})
);

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
        <ErrorBoundary
            FallbackComponent={DashboardRootError}
            onError={(error, info) => handleReactErrorBoundary(error, info, cookies, 'DashboardRootError')}
        >
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
        </ErrorBoundary>
    )
}

function DashboardRootError({ error, resetErrorBoundary }) {
    const handleReset = async () => {
        const toastId = toast.loading('Memulai prosedur moveon', { position: 'top-center' });
        const { pathname } = window.location;
        const fromParam = pathname === '/dashboard/matakuliah' ? 'matakuliah' : 'dashboard';

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const resetStorage = async () => {
            toast.loading('Menghapus foto mantan', { id: toastId });
            await delay(2500);
            sessionStorage.clear();
            localStorage.clear();
        };

        const resetCookies = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_SIPK_API_URL || process.env.NEXT_PUBLIC_SIPK_URL;
            const target = new URL('/api/auth/reset', baseUrl)
            target.searchParams.set('envoke_session', 'true');
            toast.loading('Menghapus sesi terindah bersama mantan', { id: toastId });
            await delay(3250);

            try {
                const response = await fetch(target, { method: 'GET' });
                if (response.status > 399) throw new Error('Gagal mereset sesi');
            } catch (error) {
                throw new Error('Gagal mereset sesi');
            }
        };

        await delay(1750);

        try {
            await resetStorage();
            await resetCookies();

            toast.loading('Mengalihkanmu dari mantan', { id: toastId });
            await delay(2500);

            const usersUrl = new URL('/users', process.env.NEXT_PUBLIC_SIPK_URL)
            usersUrl.searchParams.set('from', fromParam);
            window.location.replace(usersUrl);
        } catch (error) {
            toast.loading('Mengalihkanmu dari masa lalu', { id: toastId });
            await delay(2500);

            const target = new URL('/api/auth/reset', process.env.NEXT_PUBLIC_SIPK_URL);
            Object
                .entries({ redirect: 'users', envoke_session: true, from: fromParam })
                .forEach(([key, value]) => { target.searchParams.set(key, value) });

            window.location.replace(target);
        }
    };

    return (
        <div className={styles.root_error_container}>
            <div className={styles.root_error_content}>
                <Image src={error_svg} alt={'Logo SIPK'} />
                <div className={styles.text}>
                    <h1>Terjadi Kesalahan</h1>
                    <p>
                        Sepertinya terjadi kesalahan tak terduga.
                        Kamu bisa coba reset SIPK lalu login ulang dengan klik tombol dibawah.
                        Kalau masalah ini masih muncul setelah login ulang,
                        kayaknya bakal ada yang lembur buat benerin ini 😞
                    </p>
                </div>
                <div className={styles.buttons} onClick={handleReset}>
                    <button>Reset dan Login Ulang</button>
                </div>
            </div>
        </div>
    )
}