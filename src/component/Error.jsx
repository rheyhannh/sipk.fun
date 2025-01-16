'use client'

// #region NEXT DEPEDENCY
import Image from 'next/image';
import error_svg from '/public/bug_fixing.svg';
// #endregion

// #region REACT DEPEDENCY
import React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import toast from "react-hot-toast";
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/style/error.module.css';
// #endregion

/**
 * Props yang digunakan component `Error`
 * @typedef {Object} ErrorProps
 * @property {React.ReactNode} [title]
 * Judul yang digunakan, dapat berupa string atau element yang dapat dirender react.
 * 
 * - Default : `Terjadi Kesalahan`
 * @property {React.ReactNode} description
 * Deskripsi yang digunakan, dapat berupa string atau element yang dapat dirender react.
 * @property {React.ReactNode} button
 * Teks button yang digunakan, dapat berupa string atau element yang dapat dirender react.
 * @property {Object} [reset]
 * Object untuk mendeskripsikan bagaimana reset dilakukan
 * @property {boolean} [reset.localStorage]
 * Boolean untuk reset local storage
 * 
 * - Default : `true`
 * @property {boolean} [reset.sessionStorage]
 * Boolean untuk reset session storage
 * 
 * - Default : `true`
 * @property {boolean} [reset.cookies]
 * Boolean untuk reset cookies, saat `true` pastikan menggunakan `redirect` pada props {@link ErrorProps.finish finish}
 * 
 * - Default : `false`
 * @property {Object} [message]
 * Toast message untuk memberikan feedback UI saat proses tertentu
 * @property {string} [message.onStart]
 * Toast message saat memulai proses reset, saat falsy akan menggunakan default value.
 * 
 * - Default : `Mereset SIPK`
 * @property {string} [message.onResetStorage]
 * Toast message saat memulai reset storage, saat falsy akan menggunakan default value.
 * 
 * - Default : `Mereset storage`
 * @property {string} [message.onResetCookies]
 * Toast message saat memulai reset cookies, saat falsy akan menggunakan default value.
 * 
 * - Default : `Mereset sesi`
 * @property {string} [message.onRedirecting]
 * Toast message saat redirect, saat falsy akan menggunakan default value.
 * 
 * - Default : `Mengalihkanmu`
 * @property {string} [message.onRefresh]
 * Toast message saat refresh, saat falsy akan menggunakan default value.
 * 
 * - Default : `Memulai ulang`
 * @property {'refresh' | 'redirect'} [finish]
 * Dapat menggunakan opsi berikut, 
 * - `refresh` : Akan merefresh halaman dengan window location reload setelah proses reset selesai
 * - `redirect` : Akan meredirect ke `/users` setelah proses reset selesai, ini umum dilakukan saat error terjadi didalam `/dashboard`
 * 
 * Jika mereset cookies dan proses fetch gagal, user akan tetap diredirect walaupun menggunakan `refresh`
 * 
 * - Default : `refresh`
 * @property {() => void} [onClick]
 * Override default behaviour dengan menyediakan callback saat button diclick
 * @property {import('react-hot-toast').ToastOptions} [toastOptions]
 * Opsi toast message yang digunakan
 * 
 * ```js
 * // Default
 * { position: 'top-center' }
 * ```
 * @property {React.CSSProperties} [style]
 * Custom style yang digunakan
 * 
 * - Default : `{}`
 */

/**
 * Lorem ipsum dolor
 * @param {ErrorProps} props Error props
 * @returns {React.ReactElement} Rendered component
 */
export default function Error({
    title = 'Terjadi Kesalahan',
    description,
    button,
    reset = {
        localStorage: true,
        sessionStorage: true,
        cookies: true,
    },
    message = {
        onStart: 'Mereset SIPK',
        onResetStorage: 'Mereset storage',
        onResetCookies: 'Mereset sesi',
        onRedirecting: 'Mengalihkanmu',
        onRefresh: 'Memulai ulang',
    },
    finish = 'refresh',
    onClick,
    toastOptions = { position: 'top-center' },
    style = {}
}) {
    reset = {
        localStorage: reset?.localStorage ?? true,
        sessionStorage: reset?.sessionStorage ?? true,
        cookies: reset?.cookies ?? false,
    }
    message = {
        onStart: message?.onStart || 'Mereset SIPK',
        onResetStorage: message?.onResetStorage || 'Mereset storage',
        onResetCookies: message?.onResetCookies || 'Mereset sesi',
        onRedirecting: message?.onRedirecting || 'Mengalihkanmu',
        onRefresh: message?.onRefresh || 'Memulai ulang',
    }

    const handleReset = async () => {
        const toastId = toast.loading(message.onStart, { ...toastOptions });
        const { pathname } = window.location;
        const fromParam = pathname === '/dashboard/matakuliah' ? 'matakuliah' : 'dashboard';

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const resetStorage = async () => {
            toast.loading(message.onResetStorage, { id: toastId });
            await delay(2500);
            if (reset?.localStorage) localStorage.clear();
            if (reset?.sessionStorage) sessionStorage.clear();
        };

        const resetCookies = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_SIPK_API_URL || process.env.NEXT_PUBLIC_SIPK_URL;
            const target = new URL('/api/auth/reset', baseUrl)
            target.searchParams.set('envoke_session', 'true');
            toast.loading(message.onResetCookies, { id: toastId });
            await delay(3250);

            try {
                const response = await fetch(target, { method: 'GET' });
                if (response.status > 399) throw new Error('Gagal mereset sesi');
            } catch (error) {
                throw new Error('Gagal mereset sesi');
            }
        };

        const refreshPage = async () => {
            toast.loading(message.onRefresh, { id: toastId });
            await delay(2500);
            window.location.reload();
        }

        const redirectToUsers = async () => {
            toast.loading(message.onRedirecting, { id: toastId });
            await delay(2500);
            const usersUrl = new URL('/users', process.env.NEXT_PUBLIC_SIPK_URL)
            usersUrl.searchParams.set('from', fromParam);
            window.location.replace(usersUrl);
        }

        await delay(1750);

        try {
            if (reset?.localStorage || reset?.sessionStorage) await resetStorage();
            if (reset?.cookies) await resetCookies();
            if (finish === 'redirect') await redirectToUsers();
            else await refreshPage();
        } catch (error) {
            toast.loading(message.onRedirecting, { id: toastId });
            await delay(2500);

            const target = new URL('/api/auth/reset', process.env.NEXT_PUBLIC_SIPK_URL);
            Object
                .entries({ redirect: 'users', envoke_session: true, from: fromParam })
                .forEach(([key, value]) => { target.searchParams.set(key, value) });

            window.location.replace(target);
        }
    }

    return (
        <div className={styles.container} style={style}>
            <div className={styles.content}>
                <Image src={error_svg} alt={'Error Ilustration'} />
                <div className={styles.text}>
                    <h1>
                        {title}
                    </h1>
                    <p>
                        {description}
                    </p>
                </div>
                <div className={styles.buttons}>
                    <button onClick={onClick ?? handleReset}>
                        {button}
                    </button>
                </div>
            </div>
        </div>
    )
}