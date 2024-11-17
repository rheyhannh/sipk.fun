'use client'

// #region TYPE DEPEDENCY
import { NavItem } from '@/constant/client';
// #endregion

// #region NEXT DEPEDENCY
import NextLink from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useWindowSize from '@/hooks/useWindowSize';
import { useLocalTheme } from '@/data/core';
import { useTimeout } from 'ahooks';
// #endregion

// #region COMPONENT DEPEDENCY
import { mutate } from 'swr';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { LogoImage } from '@/component/Main';
import Link from '@/component/Link';
import { animateScroll as scroll } from 'react-scroll';
// #endregion

// #region ICON DEPEDENCY
import {
    FiSun,
    FiMoon,
    FiArrowUpRight
} from 'react-icons/fi';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

/**
 * Array yang berisikan link yang digunakan pada navbar. Gunakan props `elementId` untuk scroll ke section atau element tertentu,
 * gunakan `href` untuk routing ke url tertentu. 
 * 
 * Saat url dibuka pada tab baru, pastikan pass `true` pada props `isOpenNewTab` untuk
 * menambahkan icon dan target `_blank` pada element anchor.
 * 
 * Untuk opsi lanjutan dapat diatur pada props `routingOptions` untuk opsi routing dan `scrollOptions` untuk opsi scroll.
 * @type {Array<Omit<NavItem, 'icon' | 'iconName' | 'iconLib' | 'dropdown'> & {isOpenNewTab:boolean}>}
 */
const headerShorcuts = [
    {
        text: 'Tentang',
        elementId: 'tentang',
        href: null
    },
    {
        text: 'Fitur',
        elementId: 'fitur',
        href: null
    },
    {
        text: 'Testimoni',
        elementId: 'testimoni',
        href: null
    },
    {
        text: 'Panduan',
        elementId: null,
        href: '/panduan',
    },
    {
        text: 'Detail Rilis',
        elementId: null,
        href: 'https://l.loggify.app/sipk/changes',
        isOpenNewTab: true,
    }
]

const ButtonCTA = React.forwardRef(({ text = 'Lorem', onClick, href }, ref) => (
    <motion.a
        ref={ref}
        className={styles.cta}
        onClick={onClick}
        href={href}
        initial={{ color: 'var(--root-header-textColor)' }}
        whileHover={{
            border: '1px solid var(--logo-second-color)',
            color: 'var(--white-color)',
        }}
        transition={{ duration: 0.75, delay: 0.1, ease: 'easeInOut' }}
    >
        {text}
    </motion.a>
))

const Header = () => {
    const [showNavbar, setShowNavbar] = React.useState(false);
    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const { data: theme } = useLocalTheme();
    const { scrollY } = useScroll();

    const handleChangeTheme = (newTheme) => {
        if (theme === newTheme) { return }
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark');
        mutate('localUserTheme');
    }

    useTimeout(() => {
        if (scrollY.get() > windowHeight) {
            setShowNavbar(true);
        }
    }, 100)

    useMotionValueEvent(scrollY, 'change', (x) => {
        if (x > windowHeight) {
            if (!showNavbar) setShowNavbar(true);
        } else {
            if (showNavbar) setShowNavbar(false);
        }
    });

    return (
        <div className={styles.header_outter}>
            <header className={styles.header}>
                <nav className={styles.navbar}>
                    <motion.div
                        initial={{ y: -150, opacity: 0 }}
                        transition={{ duration: 0.5, bounce: 0.2 }}
                        animate={showNavbar ? { y: 0, opacity: 1 } : { y: -150, opacity: 0 }}
                        className={styles.nav}
                    >
                        <div className={styles.logo} onClick={() => { scroll.scrollToTop({ smooth: false, duration: 1 }) }}>
                            <LogoImage src={'/logo_fill.png'} width={24} height={24} />
                        </div>

                        {headerShorcuts.map((item, index) => (
                            <Link
                                key={index}
                                item={{ href: item.href, elementId: item.elementId }}
                                // TODOS offset still static '-75', when comes to mobile or any viewport less than 1280
                                // offset should be corrected
                                scrollOptions={{ offset: -75, ...item?.scrollOptions }}
                                routingOptions={{ ...item?.routingOptions }}
                                className={styles.link}
                                {...(item?.isOpenNewTab || false ? { target: '_blank' } : {})}
                            >
                                {item.text}
                                {item?.isOpenNewTab && (
                                    <FiArrowUpRight className={styles.external} />
                                )}
                            </Link>
                        ))}

                        <NextLink href={'/users?action=daftar'} scroll={false} passHref legacyBehavior>
                            <ButtonCTA text={'Mulai Sekarang'} />
                        </NextLink>

                        <div
                            className={styles.theme}
                            onClick={() => {
                                handleChangeTheme(theme === 'dark' ? 'light' : 'dark')
                            }}
                        >
                            <motion.div
                                className={styles.inner}
                                initial={false}
                                animate={theme === 'dark' ? { y: -37.5 } : { y: 7.5 }}
                            >
                                <FiMoon />
                                <FiSun />
                            </motion.div>
                        </div>
                    </motion.div>
                </nav>
            </header>
        </div>
    )
}

export default Header;