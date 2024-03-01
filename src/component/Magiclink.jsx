'use client'

// ========== NEXT DEPEDENCY ========== //
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';

// ========== REACT DEPEDENCY ========== //
import { useState, useEffect } from 'react';

// ========== VALIDATOR/SANITIZER DEPEDENCY ========== //
import isUUID from 'validator/lib/isUUID';

// ========== COMPONENTS DEPEDENCY ========== //
import { mutate } from 'swr';
import { useCookies } from 'next-client-cookies';
import toast from 'react-hot-toast';
import Countdown from 'react-countdown';

// ========== DATA DEPEDENCY ========== //
import { useLocalTheme } from '@/data/core';

// ========== STYLE DEPEDENCY ========== //
import styles from './style/magiclink.module.css'

// ========== ICONS DEPEDENCY ========== //
import { FaLink, FaCheck, FaExclamation } from "react-icons/fa";
import { FiSun, FiMoon } from 'react-icons/fi';

/*
============================== CODE START HERE ==============================
*/
function Container({ children }) {
    return (
        <div className={styles.container}>
            <div className={styles.backdrop}>
                {children}
            </div>
        </div>
    )
}

function Wrapper() {
    const [states, setStates] = useState({
        loading: false, success: false, error: false
    })
    const { data: theme } = useLocalTheme();
    const type = useSearchParams().get('action');

    const getStates = () => states.loading ? styles.loading : states.success ? styles.success : states.error ? styles.error : '';

    const handleChangeTheme = (newTheme) => {
        if (theme === newTheme) { return }
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark')
        mutate('localUserTheme');
    }

    return (
        <div className={`${styles.wrapper} ${getStates()}`}>
            <div className={styles.border__wrapper}>
                <span className={`${styles.border__top} ${states.success || states.error || !states.loading ? styles.hide : ''}`} />
                <span className={`${styles.border__right} ${states.success || states.error || !states.loading ? styles.hide : ''}`} />
                <span className={`${styles.border__bottom} ${states.success || states.error || !states.loading ? styles.hide : ''}`} />
                <span className={`${styles.border__left} ${states.success || states.error || !states.loading ? styles.hide : ''}`} />
            </div>
            <div className={`${styles.icon__outter} ${getStates()}`} />
            <div className={`${styles.icon__inner} ${getStates()}`}>
                <div className={`${styles.icon} ${styles.loading} ${states.loading ? styles.active : ''} ${states.success || states.error ? styles.hide : ''}`}>
                    <FaLink />
                </div>
                <div className={`${styles.icon} ${styles.success} ${states.success ? styles.active : ''}`}>
                    <FaCheck />
                </div>
                <div className={`${styles.icon} ${styles.error} ${states.error ? styles.active : ''}`}>
                    <FaExclamation />
                </div>
            </div>
            <Content type={type} states={states} setStates={setStates} />
            <div className={`${styles.theme__outter} ${getStates()}`}>
                <div className={styles.theme__inner}>
                    <div className={`${styles.circle} ${theme !== 'dark' ? styles.active : ''}`} onClick={() => { handleChangeTheme('light') }}>
                        <FiSun size={'15px'} />
                    </div>
                    <div className={`${styles.circle} ${theme === 'dark' ? styles.active : ''}`} onClick={() => { handleChangeTheme('dark') }}>
                        <FiMoon size={'15px'} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function Content({ type, states, setStates }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const guestIdCookie = useCookies().get('s_guest_id');
    const isLogin = type === 'login' ? true : false;

    const handleFetch = async () => {
        const tokenHash = searchParams.get('token');

        try {
            if (!guestIdCookie || !isUUID(guestIdCookie)) {
                throw ({
                    shouldRefresh: true,
                    toast: { message: 'Terjadi kesalahan, silahkan coba lagi' },
                    newState: null
                })
            }

            if (!tokenHash) {
                throw ({
                    shouldRefresh: false,
                    toast: { message: 'Token magiclink dibutuhkan!' },
                    newState: null
                })
            }

            setStates({ loading: true, error: false, success: false })

            const response = await fetch(isLogin ?
                `/api/auth/confirm/login?token_hash=${tokenHash}&type=email`
                :
                `/api/auth/confirm/signup?token_hash=${tokenHash}&type=email`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (!response.ok) {
                if (response.status === 429) {
                    throw ({
                        shouldRefresh: false,
                        toast: false,
                        newState: { loading: false, error: true, success: false, code: '429' }
                    })
                } else if (response.status === 403) {
                    throw ({
                        shouldRefresh: false,
                        toast: false,
                        newState: { loading: false, error: true, success: false, code: '403' }
                    })
                } else {
                    throw ({
                        shouldRefresh: false,
                        toast: false,
                        newState: { loading: false, error: true, success: false }
                    })
                }
            } else {
                setStates({ loading: false, error: false, success: true })
            }

        } catch (error) {
            const toastOptions = { duration: 3000, position: 'top-center' };
            if (error.toast) { toast.error(error.toast.message, toastOptions); }
            if (error.shouldRefresh) { router.refresh() }
            if (error.newState) { setStates(error.newState) }
        }
    }

    if (!states.loading && !states.error && !states.success) {
        return <Default isLogin={isLogin} state={states} handleFetch={handleFetch} />
    }
    else if (states.loading) {
        return <Loading isLogin={isLogin} state={states} handleFetch={handleFetch} />
    }
    else if (states.success) {
        return <Success isLogin={isLogin} state={states} handleFetch={handleFetch} />
    }
    else if (states.error) {
        return <Error isLogin={isLogin} state={states} handleFetch={handleFetch} />
    }
}

function Default({ isLogin, state, handleFetch }) {
    return (
        <div className={styles.content}>
            <h2 className={styles.content__title}>
                {isLogin ? 'Magiclink Login' : 'Magiclink Confirm'}
            </h2>
            <div className={styles.content__text}>
                {isLogin ? 'Login pakai magiclink dengan klik tombol dibawah.' : 'Konfirmasi akunmu dengan klik tombol dibawah.'}
            </div>
            <div className={styles.content__action} onClick={handleFetch}>
                <div className={`${styles.btn}`}>
                    <h3>{isLogin ? 'Login' : 'Konfirmasi Akun'}</h3>
                </div>
            </div>
        </div>
    )
}

function Loading({ isLogin, state, handleFetch }) {
    return (
        <div className={`${styles.content} ${styles.no_action}`}>
            <h2 className={styles.content__title}>
                Memproses Magiclink
            </h2>
            <div className={styles.content__text}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium nihil nemo rerum alias ratione modi?
            </div>
        </div>
    )
}

function Success({ isLogin, state, handleFetch }) {
    const router = useRouter();

    return (
        <div className={styles.content}>
            <h2 className={styles.content__title}>
                Magiclink Valid
            </h2>
            {isLogin ?
                <Countdown
                    date={Date.now() + 3000}
                    onComplete={() => router.replace('/dashboard')}
                    renderer={props => {
                        return (
                            <>
                                <div className={styles.content__text}>
                                    Login berhasil. Kamu akan dialihkan ke dashboard dalam <span style={{ fontWeight: '700' }}>{props.seconds} detik</span>
                                </div>
                                <div className={styles.content__action}>
                                    <Link className={`${styles.btn} ${styles.success}`} href={'/dashboard'} prefetch={false} replace>
                                        <h3>Menuju Dashboard ({props.seconds})</h3>
                                    </Link>
                                </div>
                            </>
                        )
                    }}
                />
                :
                <>
                    <div className={styles.content__text}>
                        Akun berhasil dikonfirmasi. Mulai pakai SIPK sekarang dengan klik tombol dibawah.
                    </div>
                    <div className={styles.content__action}>
                        <Link className={`${styles.btn} ${styles.success}`} href={'/dashboard'} prefetch={false} replace>
                            <h3>Mulai Sekarang</h3>
                        </Link>
                    </div>
                </>
            }
        </div>
    )
}

function Error({ isLogin, state, handleFetch }) {
    const getContent = () => {
        if (state?.code === '429') {
            return {
                title: 'Too Many Request',
                text: 'Silahkan refresh halaman ini dan coba lagi dalam 1 menit.',
                action: null
            }
        } else if (state?.code === '403') {
            return {
                title: 'Magiclink Invalid',
                text: `Magiclink tidak sesuai atau sudah expired. Kamu perlu ${isLogin ? 'login ulang' : 'daftar ulang'} untuk mendapatkan magiclink baru.`,
                action: isLogin ?
                    <Link className={`${styles.btn} ${styles.error}`} href={'/users?action=login&type=email'} prefetch={false} replace>
                        <h3>Login Ulang</h3>
                    </Link>
                    :
                    <Link className={`${styles.btn} ${styles.error}`} href={'/users?action=daftar'} prefetch={false} replace>
                        <h3>Daftar Ulang</h3>
                    </Link>
            }
        } else {
            return {
                title: 'Terjadi Kesalahan',
                text: `Silahkan refresh halaman ini dan coba lagi, atau ${isLogin ? 'login ulang' : 'daftar ulang'} untuk mendapatkan magiclink baru.`,
                action: isLogin ?
                    <Link className={`${styles.btn} ${styles.error}`} href={'/users?action=login&type=email'} prefetch={false} replace>
                        <h3>Login Ulang</h3>
                    </Link>
                    :
                    <Link className={`${styles.btn} ${styles.error}`} href={'/users?action=daftar'} prefetch={false} replace>
                        <h3>Daftar Ulang</h3>
                    </Link>
            }
        }
    }

    return (
        <div className={`${styles.content} ${getContent().action ? '' : styles.no_action}`}>
            <h2 className={styles.content__title}>
                {getContent().title}
            </h2>

            <div className={styles.content__text}>
                {getContent().text}
            </div>

            {getContent().action && (
                <div className={styles.content__action}>
                    {getContent().action}
                </div>
            )}
        </div>
    )
}

export function Main() {
    return (
        <Container>
            <Wrapper />
        </Container>
    )
}