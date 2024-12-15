'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '../types/context.js'
// #endregion

// #region REACT DEPEDENCY
import { useContext, useEffect, useState } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { mutate } from 'swr';
import { useCookies } from 'next-client-cookies';
import Skeleton from "react-loading-skeleton";
import toast from 'react-hot-toast';
import { animateScroll as scroll } from 'react-scroll';
import { DashboardContext } from './provider/Dashboard';
import { ModalContext } from './provider/Modal';
import { Spinner } from "./loader/Loading";
import { Logo } from './Main.jsx';
// #endregion

// #region HOOKS DEPEDENCY
import useUser from '@/hooks/swr/useUser';
import useLocalTheme from '@/hooks/swr/useLocalTheme';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/header.module.css'
// #endregion

// #region ICON DEPEDENCY
import { FiSun, FiMoon } from 'react-icons/fi';
// #endregion

/*
============================== CODE START HERE ==============================
*/

function Right() {
    const { data, error, isLoading, isValidating } = useUser();
    const { data: theme } = useLocalTheme();
    /** @type {ContextTypes.ModalContext} */
    const {
        setModal,
        setActive,
        setData
    } = useContext(ModalContext);

    const userIdCookie = useCookies().get('s_user_id');

    const helloDark = () => toast('Dark Mode', { duration: 2000, icon: <FiMoon size={'17px'} /> });
    const helloLight = () => toast('Light Mode', { duration: 2000, icon: <FiSun size={'17px'} /> });

    const handleRetry = () => {
        mutate(['/api/me', userIdCookie])
    }

    const handleChangeTheme = (newTheme) => {
        if (theme === newTheme) { return }
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark')
        mutate('localUserTheme');
        if (theme === 'dark') { helloLight() }
        else { helloDark() }
    }

    const handleProfilModal = () => {
        if (!data || data.length === 0 || error) { return; }
        setData(data);
        setModal('profil');
        setTimeout(() => {
            setActive(true);
        }, 50)
    }

    if (error) {
        return (
            <>
                <div className={styles.dashboard__theme}>
                    <span className={theme === 'light' ? styles.active : ''} onClick={() => { handleChangeTheme('light') }}>
                        <FiSun size={'15px'} />
                    </span>
                    <span className={theme === 'dark' ? styles.active : ''} onClick={() => { handleChangeTheme('dark') }}>
                        <FiMoon size={'15px'} />
                    </span>
                </div>

                <div className={`${styles.dashboard__profile} ${styles.error}`} onClick={handleRetry}>
                    <h5>Gagal mengambil data</h5>
                    <h2>&#x21bb;</h2>
                </div>
            </>
        )
    }

    if (isLoading) {
        return (
            <>
                <div style={{ visibility: 'hidden', opacity: '0' }} className={styles.dashboard__theme}>
                    <span className={theme === 'light' ? styles.active : ''} onClick={() => { handleChangeTheme('light') }}>
                        <FiSun size={'15px'} />
                    </span>
                    <span className={theme === 'dark' ? styles.active : ''} onClick={() => { handleChangeTheme('dark') }}>
                        <FiMoon size={'15px'} />
                    </span>
                </div>

                <div className={styles.dashboard__profile}>
                    <div className={`${styles.dashboard__profile_info} ${styles.skeleton}`}>
                        <Skeleton width={"100%"} height={"100%"} baseColor="var(--skeleton-base)" highlightColor="var(--skeleton-highlight)" />
                        <Skeleton width={"50%"} height={"100%"} baseColor="var(--skeleton-base)" highlightColor="var(--skeleton-highlight)" />
                    </div>
                    <div className={`${styles.dashboard__profile_avatar} ${styles.skeleton}`}>
                        <Skeleton borderRadius={'50%'} width={"100%"} height={"100%"} baseColor="var(--skeleton-base)" highlightColor="var(--skeleton-highlight)" />
                    </div>
                </div>
            </>
        )
    }

    if (isValidating) {
        return (
            <>
                <div style={{ visibility: 'hidden', opacity: '0' }} className={styles.dashboard__theme}>
                    <span className={theme === 'light' ? styles.active : ''} onClick={() => { handleChangeTheme('light') }}>
                        <FiSun size={'15px'} />
                    </span>
                    <span className={theme === 'dark' ? styles.active : ''} onClick={() => { handleChangeTheme('dark') }}>
                        <FiMoon size={'15px'} />
                    </span>
                </div>

                <div className={`${styles.dashboard__profile} ${styles.validating}`}>
                    <Spinner size={'20px'} color={'var(--logo-second-color)'} />
                </div>
            </>
        )
    }

    if (data.length === 0) {
        return (
            <>
                <div className={styles.dashboard__theme}>
                    <span className={theme === 'light' ? styles.active : ''} onClick={() => { handleChangeTheme('light') }}>
                        <FiSun size={'15px'} />
                    </span>
                    <span className={theme === 'dark' ? styles.active : ''} onClick={() => { handleChangeTheme('dark') }}>
                        <FiMoon size={'15px'} />
                    </span>
                </div>

                <div className={`${styles.dashboard__profile} ${styles.empty}`} />
            </>
        )
    }

    return (
        <>
            <div className={styles.dashboard__theme}>
                <span className={theme === 'light' ? styles.active : ''} onClick={() => { handleChangeTheme('light') }}>
                    <FiSun size={'15px'} />
                </span>
                <span className={theme === 'dark' ? styles.active : ''} onClick={() => { handleChangeTheme('dark') }}>
                    <FiMoon size={'15px'} />
                </span>
            </div>

            <div className={styles.dashboard__profile} onClick={() => { handleProfilModal() }}>
                <div className={`${styles.dashboard__profile_info}`}>
                    <p>
                        <b data-cy={'header_profile_fullname'}>
                            {data[0].fullname}
                        </b>
                    </p>
                    <small data-cy={'header_profile_nickname'}>
                        {data[0].nickname}
                    </small>
                </div>
                <div className={`${styles.dashboard__profile_avatar}`} />
            </div>
        </>

    )
}

export default function Header() {
    /** @type {ContextTypes.DashboardContext} */
    const {
        isNavbarActive,
        setNavbarActive,
        isPhoneContent,
        isRichContent
    } = useContext(DashboardContext);

    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [showHeader, setShowHeader] = useState(true);

    const scrollToTop = () => {
        scroll.scrollToTop({
            duration: 500,
            smooth: 'easeInOutQuart'
        })
    }

    const handleNavbarClick = () => {
        if (!isRichContent) {
            if (isNavbarActive) { document.body.classList.remove('disable_scroll'); }
            else { document.body.classList.add('disable_scroll'); }
        }
        setNavbarActive((current) => (current === true ? false : true))
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY || window.pageYOffset;
            const isScrollingDown = currentScrollPos > prevScrollPos;
            const isScrollingUp = currentScrollPos < prevScrollPos;
            setPrevScrollPos(currentScrollPos);

            if (isScrollingDown && window.scrollY >= 360 && isPhoneContent && !isNavbarActive) {
                setShowHeader(false);
            }

            if (isScrollingUp) {
                setShowHeader(true);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos])

    return (
        <>
            <div className={`${styles.dashboard} ${!showHeader ? styles.hide : ''}`} id='header'>
                <div onClick={handleNavbarClick} className={`${styles.hamburger} ${isNavbarActive ? styles.active : ''}`}>
                    <div className={styles.hamburger__box}>
                        <div className={styles.hamburger__inner} />
                    </div>
                </div>

                <Logo
                    containerProps={{
                        onClick: scrollToTop,
                        className: styles.dashboard__logo
                    }}
                    image={{
                        imageProps: {
                            priority: true,
                        }
                    }}
                />

                <div className={styles.dashboard__right}>
                    <Right />
                </div>
            </div>
        </>
    )
}

/*
============================== CODE END HERE ==============================
*/