'use client'

// #region TYPE DEPEDENCY
import { NavItem } from '@/constant/client';
import { RootContextProps } from '@/component/provider/Root';
import { HTMLMotionProps } from 'framer-motion';
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
import { RootContext } from '@/component/provider/Root';
import { mutate } from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoImage } from '@/component/Main';
import Link from '@/component/Link';
import { animateScroll as scroll, scroller } from 'react-scroll';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

/**
 * Component Description
 * @param {Pick<RootContextProps, 'showNavbarOverlay' | 'setShowNavbarOverlay'> & Omit<HTMLMotionProps<'div'>, 'className' | 'initial' | 'animate' | 'transition' | 'onClick' | 'exit'>} props NavbarButton props
 * @returns {React.ReactElement} Rendered component
 */
const NavbarButton = ({ showNavbarOverlay, setShowNavbarOverlay, ...props }) => (
    <motion.div
        className={styles.navbar_btn}
        initial={{ '--hamburger-color': 'var(--white-color)', y: -125 }}
        animate={showNavbarOverlay ? {
            backgroundColor: 'var(--white-color)',
            '--hamburger-color': 'var(--logo-second-color)',
            y: 0,
            transition: { delay: 0, duration: 0.3, ease: 'easeInOut' }
        } : { y: 0, transition: { delay: 0, duration: 0.3, ease: 'easeInOut' } }}
        transition={{ delay: 0.5, duration: 0.3, ease: 'easeInOut' }}
        onClick={() => {
            if (showNavbarOverlay) { document.body.classList.remove('disable_scroll'); }
            else { document.body.classList.add('disable_scroll'); }
            setShowNavbarOverlay(x => !x);
        }}
        exit={{ y: -125, transition: { delay: 0, duration: 0.3, ease: 'easeInOut' } }}
        {...props}
    >
        <div className={`${styles.hamburger} ${showNavbarOverlay ? styles.active : ''}`}>
            <div className={styles.hamburger__box}>
                <div className={styles.hamburger__inner} />
            </div>
        </div>
    </motion.div>
)

/**
 * Component Description
 * @param {Pick<RootContextProps, 'showNavbarOverlay'> & Omit<HTMLMotionProps<'nav'>, 'className' | 'variants' | 'transition' | 'initial' | 'animate' | 'exit'>} props NavbarOverlay props
 * @returns {React.ReactElement} Rendered component
 */
const NavbarOverlay = ({ showNavbarOverlay, children, ...props }) => (
    <motion.nav
        className={styles.navbar_overlay}
        variants={{ hide: { y: '-100%' }, show: { y: '0%' } }}
        transition={{ duration: 0.75, ease: 'easeInOut' }}
        initial={'hide'}
        animate={showNavbarOverlay ? 'show' : 'hide'}
        exit={'hide'}
        {...props}
    >
        {children}
    </motion.nav>
)

const Navbar = () => {
    const { showNavbarOverlay, setShowNavbarOverlay } = React.useContext(RootContext);
    const { width: viewportWidth } = useWindowSize();

    return (
        <AnimatePresence
            onExitComplete={() => {
                if (showNavbarOverlay) {
                    setShowNavbarOverlay(false);
                    document.body.classList.remove('disable_scroll');
                }
            }}
        >
            {viewportWidth < 768 && (
                <>
                    <NavbarButton
                        key={'navbar_button'}
                        showNavbarOverlay={showNavbarOverlay}
                        setShowNavbarOverlay={setShowNavbarOverlay}
                    />
                    <NavbarOverlay
                        key={'navbar_overlay'}
                        showNavbarOverlay={showNavbarOverlay}
                    >

                    </NavbarOverlay>
                </>
            )}
        </AnimatePresence>
    )
}

export default Navbar;