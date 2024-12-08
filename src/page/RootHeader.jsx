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
import useScrollingEvent from '@/hooks/useScrollingEvent';
import { useLocalTheme } from '@/data/core';
import { useClickAway, useUnmount } from 'ahooks';
// #endregion

// #region COMPONENT DEPEDENCY
import { mutate } from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoSipkFill } from '@/loader/StaticImages';
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

/**
 * Animated hamburger button untuk toggle {@link NavbarOverlay navbar overlay} pada small devices
 * @param {Pick<RootContextProps, 'showNavbarOverlay' | 'setShowNavbarOverlay'>} props HamburgerButton props
 * @returns {React.ReactElement} Rendered component
 */
const HamburgerButton = ({ showNavbarOverlay, setShowNavbarOverlay }) => (
    <div
        className={`${styles.hamburger} ${showNavbarOverlay ? styles.active : ''}`}
        onClick={() => {
            if (showNavbarOverlay) document.body.classList.remove('disable_scroll');
            else document.body.classList.add('disable_scroll');
            setShowNavbarOverlay(x => !x);
        }}
    >
        <div className={styles.hamburger_box}>
            <div className={styles.hamburger_inner} />
        </div>
    </div>
)

const LogoWithWrapper = () => (
    <div className={styles.logo} onClick={() => { scroll.scrollToTop({ smooth: false, duration: 1 }) }}>
        <LogoSipkFill />
    </div>
)

const ThemeChanger = () => {
    const { data: theme } = useLocalTheme();

    const handleChangeTheme = (newTheme) => {
        if (theme === newTheme) { return }
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark');
        mutate('localUserTheme');
    }

    return (
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
}

const Wrapper = ({ children }) => {
    const { showNavbarOverlay, setShowNavbarOverlay } = React.useContext(RootContext);
    const outerRef = React.useRef(null);

    useClickAway(() => {
        if (showNavbarOverlay) {
            setShowNavbarOverlay(false);
            document.body.classList.remove('disable_scroll');
        }
    }, outerRef);

    return (
        <div ref={outerRef} className={styles.header_outter}>
            <header id={'header'} className={styles.header}>
                <nav className={styles.navbar}>
                    {children}
                </nav>
            </header>
        </div>
    )
}

const Navbar = ({ showNavbar, children }) => {
    /** @type {React.MutableRefObject<HTMLDivElement>} */
    const navRef = React.useRef(null);
    const { showNavbarOverlay } = React.useContext(RootContext);

    return (
        <motion.div
            ref={navRef}
            className={styles.nav}
            transition={{ duration: 0.5, bounce: 0.2 }}
            variants={{
                hide: {
                    y: -125,
                    backgroundColor: showNavbarOverlay ? 'var(--root-navbar-bgColorStrong)' : 'var(--root-navbar-bgColor)',
                    backdropFilter: showNavbarOverlay ? 'none' : 'blur(7.5px) saturate(50%)',
                },
                show: {
                    y: 0,
                    backgroundColor: showNavbarOverlay ? 'var(--root-navbar-bgColorStrong)' : 'var(--root-navbar-bgColor)',
                    backdropFilter: showNavbarOverlay ? 'none' : 'blur(7.5px) saturate(50%)',
                }
            }}
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
            {children}
        </motion.div>
    )
}

const NavbarOverlay = () => {
    const { width: windowWidth } = useWindowSize();
    const { showNavbarOverlay, setShowNavbarOverlay } = React.useContext(RootContext);

    /*
        Make sure body doesnt have disable_scroll when user do client navigation. 
        Actualy we handle this using onExitComplete props on AnimatePresence below, but those props only fired
        'after' animation.

        This could breaking some features when we want disable scroll after user do client navigation
        from navbar overlay.
    */
    useUnmount(() => {
        document.body.classList.remove('disable_scroll');
    })

    return (
        <AnimatePresence
            onExitComplete={() => {
                if (showNavbarOverlay) {
                    setShowNavbarOverlay(false);
                    document.body.classList.remove('disable_scroll');
                }
            }}
        >
            {windowWidth < 600 && (
                <motion.div
                    className={styles.overlay}
                    variants={{
                        hide: { scaleY: 0, transition: { when: 'afterChildren' } },
                        show: { scaleY: 1, transition: { when: 'beforeChildren' } }
                    }}
                    initial={'hide'}
                    exit={'hide'}
                    animate={showNavbarOverlay ? 'show' : 'hide'}
                >
                    <motion.div
                        variants={{ hide: { opacity: 0 }, show: { opacity: 1 } }}
                        className={styles.layout}
                    >
                        <div className={styles.inner}>
                            <LogoWithWrapper />
                            <LinkItems />
                            <NextLink href={'/users?action=daftar'} scroll={false} passHref legacyBehavior>
                                <ButtonCTA id={'navbar-cta'} text={'Mulai Sekarang'} />
                            </NextLink>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

const NavbarLeftContent = () => {
    const { showNavbarOverlay, setShowNavbarOverlay } = React.useContext(RootContext);
    const { width: windowWidth } = useWindowSize();

    if (windowWidth < 600) {
        return (
            <div className={`${styles.wrap} ${styles.left}`}>
                <HamburgerButton
                    showNavbarOverlay={showNavbarOverlay}
                    setShowNavbarOverlay={setShowNavbarOverlay}
                />
                <LogoWithWrapper />
            </div>
        )
    } else {
        return <LogoWithWrapper />
    }
}

const NavbarCenterContent = () => {
    const { width: windowWidth } = useWindowSize();

    if (windowWidth < 768) {
        return (
            <div className={`${styles.wrap} ${styles.center}`}>
                <LinkItems />
            </div>
        )
    } else {
        return (
            <>
                <LinkItems />
                <NextLink href={'/users?action=daftar'} scroll={false} passHref legacyBehavior>
                    <ButtonCTA id={'navbar-cta'} text={'Mulai Sekarang'} />
                </NextLink>
            </>
        )
    }
}

const NavbarRightContent = () => {
    const { width: windowWidth } = useWindowSize();

    if (windowWidth < 768) {
        return (
            <div className={`${styles.wrap} ${styles.right}`}>
                <NextLink href={'/users?action=daftar'} scroll={false} passHref legacyBehavior>
                    <ButtonCTA id={'navbar-cta'} text={'Mulai Sekarang'} />
                </NextLink>

                <ThemeChanger />
            </div>
        )
    } else {
        return <ThemeChanger />
    }
}

const Header = () => {
    const [showNavbar, setShowNavbar] = React.useState(true);
    const { showNavbarOverlay } = React.useContext(RootContext);
    const { width: viewportWidth, height: viewportHeight } = useWindowSize();

    const scrollFrames = React.useRef(0);

    const handleScrollUp = () => {
        scrollFrames.current = 0;
        if (!showNavbar && viewportWidth < 768) setShowNavbar(true);
    }

    const handleScrollDown = () => {
        scrollFrames.current += 1;
        if (!showNavbarOverlay && scrollFrames.current > 5 && viewportWidth < 768) setShowNavbar(false);
    }

    const scrollingType = useScrollingEvent(handleScrollUp, handleScrollDown, null, {
        minimumScrollPosition: viewportHeight,
        timeoutDuration: 500,
    });

    return (
        <Wrapper>
            <Navbar showNavbar={showNavbar}>
                <NavbarLeftContent />
                <NavbarCenterContent />
                <NavbarRightContent />
                <NavbarOverlay />
            </Navbar>
        </Wrapper>
    )
}

export default Header;