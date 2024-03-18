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
import { useLocalTheme, useFakta } from '@/data/core';
import { getDefaultFakta } from '@/utils/client_side';

// ========== STYLE DEPEDENCY ========== //
import styles from './style/magiclink.module.css'

// ========== ICONS DEPEDENCY ========== //
import { FaLink, FaCheck, FaExclamation } from "react-icons/fa";
import { FiSun, FiMoon } from 'react-icons/fi';

/*
============================== CODE START HERE ==============================
*/

/**
 * Render magiclink container.
 * @param {{children:any}} props React props object
 * @param props.children Component or element children.
 * @returns {ReactElement} Element react untuk render magiclink container.
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

/**
 * Render magiclink wrapper sesuai dengan state nya `loading|error|success|default`.
 * @param {{children:any, states:{loading:boolean, success:boolean, error:boolean, code?:string|null}, getClassnameByState:() => string}} props React props object
 * @param props.children Component or element children.
 * @param props.states Magiclink state
 * @param props.getClassnameByState  Method untuk mendapatkan css class berdasarkan current states `loading|error|success|default`.
 * @returns {ReactElement} Element react untuk render magiclink wrapper.
 */
function Wrapper({ children, states, getClassnameByState }) {
    return (
        <div className={`${styles.wrapper} ${getClassnameByState()}`}>
            <div className={styles.border__wrapper}>
                <span className={`${styles.border__top} ${states.success || states.error || !states.loading ? styles.hide : ''}`} />
                <span className={`${styles.border__right} ${states.success || states.error || !states.loading ? styles.hide : ''}`} />
                <span className={`${styles.border__bottom} ${states.success || states.error || !states.loading ? styles.hide : ''}`} />
                <span className={`${styles.border__left} ${states.success || states.error || !states.loading ? styles.hide : ''}`} />
            </div>
            <div className={`${styles.icon__outter} ${getClassnameByState()}`} />
            <div className={`${styles.icon__inner} ${getClassnameByState()}`}>
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
            {children}
        </div>
    )
}

/**
 * Render theme changer sesuai dengan state nya `loading|error|success|default`.
 * @param {{getClassnameByState:() => string}} props React props object
 * @param props.getClassnameByState  Method untuk mendapatkan css class berdasarkan current states `loading|error|success|default`.
 * @returns {ReactElement} Element react untuk render theme changer.
 */
function ThemeChanger({ getClassnameByState }) {
    const { data: theme } = useLocalTheme();
    const handleChangeTheme = (newTheme) => {
        if (theme === newTheme) { return }
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark')
        mutate('localUserTheme');
    }

    return (
        <div className={`${styles.theme__outter} ${getClassnameByState()}`}>
            <div className={styles.theme__inner}>
                <div className={`${styles.circle} ${theme !== 'dark' ? styles.active : ''}`} onClick={() => { handleChangeTheme('light') }}>
                    <FiSun size={'15px'} />
                </div>
                <div className={`${styles.circle} ${theme === 'dark' ? styles.active : ''}`} onClick={() => { handleChangeTheme('dark') }}>
                    <FiMoon size={'15px'} />
                </div>
            </div>
        </div>
    )
}

/**
 * Render magiclink content `login|confirm` sesuai dengan state nya `loading|error|success|default`.
 * @param {{states:{loading:boolean, success:boolean, error:boolean, code?:string|null}, setStates:(states:{loading:boolean, success:boolean, error:boolean}) => void}} props React props object
 * @param props.states Magiclink state
 * @param props.setStates Method untuk set magiclink state
 * @returns {ReactElement} Element react untuk render magiclink content
 */
function Content({ states, setStates }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const guestIdCookie = useCookies().get('s_guest_id');
    const { data: fakta } = useFakta();
    const isLogin = searchParams.get('action') === 'login' ? true : false;

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

    if (states.loading) {
        return <Loading fakta={fakta} />
    }
    else if (states.success) {
        return <Success isLogin={isLogin} />
    }
    else if (states.error) {
        return <Error isLogin={isLogin} state={states} />
    }
    else {
        return <Default isLogin={isLogin} handleFetch={handleFetch} />
    }
}

/**
 * Render magiclink content `login|confirm` dengan state `default`.
 * @param {{isLogin:boolean, handleFetch:() => void}} props React props object
 * @param props.isLogin Apakah login content atau bukan
 * @param props.handleFetch Method fetch untuk verifikasi magiclink
 * @returns {ReactElement} Element react untuk render magiclink content dengan state default.
 */
function Default({ isLogin, handleFetch }) {
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

/**
 * Render magiclink content `login|confirm` dengan state `loading`.
 * @param {{fakta:Array<string>}} props React props object
 * @param props.fakta Content fakta tentang SIPK
 * @returns {ReactElement} Element react untuk render magiclink content dengan state loading.
 */
function Loading({ fakta }) {
    const [mounted, setMounted] = useState(false);
    const [usedFakta, setUsedFakta] = useState('');

    useEffect(() => {
        if (!mounted) {
            if (fakta && fakta.length > 0) {
                const randomIndex = Math.floor(Math.random() * fakta.length);
                const selectedFakta = fakta[randomIndex].text ?? '';
                setUsedFakta(selectedFakta);
            }
            else { setUsedFakta(getDefaultFakta()[0]) }
        }

        setMounted(true);
    }, [fakta])

    return (
        <div className={`${styles.content} ${styles.no_action}`}>
            <h2 className={styles.content__title}>
                Memproses Magiclink
            </h2>
            <div className={`${styles.content__text} ${styles.intermezzo}`}>
                {usedFakta}
            </div>
        </div>
    )
}

/**
 * Render magiclink content `login|confirm` dengan state `success`.
 * @param {{isLogin:boolean}} props React props object
 * @param props.isLogin Apakah login content atau bukan
 * @returns {ReactElement} Element react untuk render magiclink content dengan state success.
 */
function Success({ isLogin }) {
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

/**
 * Render magiclink content `login|confirm` dengan state `error`.
 * @param {{isLogin:boolean, state:{loading:boolean, success:boolean, error:boolean, code?:string|null}}} props React props object
 * @param props.isLogin Apakah login content atau bukan
 * @param props.states Magiclink state
 * @returns {ReactElement} Element react untuk render magiclink content dengan state error.
 */
function Error({ isLogin, state }) {
    const getContent = () => {
        if (state?.code === '429') {
            return {
                title: 'Too Many Request',
                text: 'Terlalu banyak request. Silahkan refresh dan coba lagi dalam 1 menit.',
                action: null
            }
        } else if (state?.code === '403') {
            return {
                title: 'Magiclink Invalid',
                text: `Magiclink tidak sesuai atau sudah expired. Silahkan ${isLogin ? 'login ulang' : 'daftar ulang'} agar dapat magiclink baru.`,
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
                text: `Ada yang salah. Silahkan coba lagi atau ${isLogin ? 'login ulang' : 'daftar ulang'} untuk mendapatkan magiclink baru.`,
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
    const [states, setStates] = useState({
        loading: false, success: false, error: false
    })

    const getClassnameByState = () => states.loading ? styles.loading : states.success ? styles.success : states.error ? styles.error : '';

    return (
        <Container>
            <Wrapper states={states} getClassnameByState={getClassnameByState}>
                <Content states={states} setStates={setStates} />
                <ThemeChanger getClassnameByState={getClassnameByState} />
            </Wrapper>
        </Container>
    )
}