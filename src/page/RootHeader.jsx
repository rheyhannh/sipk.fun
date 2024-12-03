'use client'

// #region TYPE DEPEDENCY
import { RootContextProps } from '@/component/provider/Root';
// #endregion

// #region CONFIG DEPEDENCY
import {
    HEADER_NAVIGATION_SHORCUTS,
} from './RootConfig';
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
// #endregion

// #region COMPONENT DEPEDENCY
import { mutate } from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoImage } from '@/component/Main';
import Link from '@/component/Link';
import { animateScroll as scroll, scroller } from 'react-scroll';
import { RootContext } from '@/component/provider/Root';
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

const ButtonCTA = React.forwardRef(({ text = 'Lorem', onClick, href, ...props }, ref) => (
    <motion.a
        ref={ref}
        className={styles.cta}
        onClick={onClick}
        href={href}
        initial={{ color: 'var(--root-header-textColor)' }}
        variants={{
            hover: {
                border: '1px solid var(--logo-second-color)',
                color: 'var(--white-color)',
            },
            focus: {
                border: '1px solid var(--logo-second-color)',
            }
        }}
        whileHover={'hover'}
        whileFocus={'focus'}
        transition={{ duration: 0.75, delay: 0.1, ease: 'easeInOut' }}
        {...props}
    >
        {text}
    </motion.a>
))

const LinkItems = () => (
    <>
        {HEADER_NAVIGATION_SHORCUTS.map((item, index) => (
            <Link
                key={index}
                item={{ href: item.href, elementId: item.elementId }}
                // TODOS offset still static '-75', when comes to mobile or any viewport less than 1280
                // offset should be corrected
                scrollOptions={{ offset: -75, ...item?.scrollOptions }}
                routingOptions={{ ...item?.routingOptions }}
                className={styles.link}
                {...(item?.isOpenNewTab || false ? { target: '_blank' } : {})}
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' && item?.elementId) scroller.scrollTo(item.elementId, { offset: -75 });
                }}
                onClickCapture={(event) => {
                    event.target.blur();
                    if (item?.elementId) {
                        const target = document.getElementById(item.elementId);
                        if (target) target.focus();
                    }
                }}
            >
                {item.text}
                {item?.isOpenNewTab && (
                    <FiArrowUpRight className={styles.external} />
                )}
            </Link>
        ))}
    </>
)

const HamburgerButton = ({ showNavbarOverlay, setShowNavbarOverlay }) => (
    <div
        className={`${styles.hamburger} ${showNavbarOverlay ? styles.active : ''}`}
        onClick={() => { setShowNavbarOverlay(x => !x) }}
    >
        <div className={styles.hamburger_box}>
            <div className={styles.hamburger_inner} />
        </div>
    </div>
)

const LogoWithWrapper = () => (
    <div className={styles.logo} onClick={() => { scroll.scrollToTop({ smooth: false, duration: 1 }) }}>
        <LogoImage src={'/logo_fill.png'} width={24} height={24} />
    </div>
)

const ThemeChanger = ({ theme, handleChangeTheme }) => (
    <div
        id={'navbar-theme'}
        className={styles.theme}
        role={'button'}
        tabIndex={0}
        onKeyDown={(event) => {
            if (event.key === 'Enter') {
                handleChangeTheme(theme === 'dark' ? 'light' : 'dark')
            }
        }}
        onClick={(event) => {
            event.currentTarget.blur();
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
)

const Header = () => {
    /** @type {React.MutableRefObject<HTMLDivElement>} */
    const navRef = React.useRef(null);
    const [showNavbar, setShowNavbar] = React.useState(true);
    const { showNavbarOverlay, setShowNavbarOverlay } = React.useContext(RootContext);
    const { width: windowWidth } = useWindowSize();
    const { data: theme } = useLocalTheme();

    const handleChangeTheme = (newTheme) => {
        if (theme === newTheme) { return }
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark');
        mutate('localUserTheme');
    }

    return (
        <div className={styles.header_outter}>
            <header id={'header'} className={styles.header}>
                <nav className={styles.navbar}>
                    <motion.div
                        ref={navRef}
                        className={styles.nav}
                        transition={{ duration: 0.5, bounce: 0.2 }}
                        variants={{ hide: { y: -125 }, show: { y: 0 } }}
                        initial={'hide'}
                        animate={showNavbar ? 'show' : 'hide'}
                        onKeyDown={(event) => {
                            if (event.key === 'Tab') {
                                if (!event.shiftKey) {
                                    if (navRef.current && navRef.current.lastChild === document.activeElement) {
                                        const sections = document.getElementsByTagName('section');
                                        // TODOS should scroll to first section not second
                                        scroller.scrollTo(sections[1].id, { offset: -75, smooth: true, duration: (x) => Math.abs(x) > 1500 ? 0 : 500 });
                                    }
                                }
                            }
                        }}
                    >
                        {windowWidth < 600 ?
                            <div className={`${styles.wrap} ${styles.left}`}>
                                <HamburgerButton
                                    showNavbarOverlay={showNavbarOverlay}
                                    setShowNavbarOverlay={setShowNavbarOverlay}
                                />
                                <LogoWithWrapper />
                            </div>
                            :
                            <LogoWithWrapper />
                        }

                        {windowWidth < 768 ?
                            <div className={`${styles.wrap} ${styles.center}`}>
                                <LinkItems />
                            </div>
                            :
                            <>
                                <LinkItems />
                                <NextLink href={'/users?action=daftar'} scroll={false} passHref legacyBehavior>
                                    <ButtonCTA id={'navbar-cta'} text={'Mulai Sekarang'} />
                                </NextLink>
                            </>
                        }

                        {windowWidth < 768 ?
                            <div className={`${styles.wrap} ${styles.right}`}>
                                <NextLink href={'/users?action=daftar'} scroll={false} passHref legacyBehavior>
                                    <ButtonCTA id={'navbar-cta'} text={'Mulai Sekarang'} />
                                </NextLink>

                                <ThemeChanger theme={theme} handleChangeTheme={handleChangeTheme} />
                            </div>
                            :
                            <ThemeChanger theme={theme} handleChangeTheme={handleChangeTheme} />
                        }
                    </motion.div>
                </nav>
            </header>
        </div >
    )
}

export default Header;