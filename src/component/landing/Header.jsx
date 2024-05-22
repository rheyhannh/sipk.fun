'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region REACT DEPEDENCY
import { useContext } from "react"
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from "@/component/provider/Landing";
import { Nav } from './Nav';
import { Logo } from "@/component/Main";
import { animateScroll as scroll } from 'react-scroll';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/landing.module.css'
// #endregion

export function Header() {
    const { isRichContent, isTouchDevice } = useContext(LandingContext);

    return (
        <header className={styles.header}>
            <Logo
                containerProps={{
                    onClick: scroll.scrollToTop,
                    className: styles.logo
                }}
            />
            <Nav />
            <Actions />
        </header>
    )
}

const Actions = () => {
    const { isAccessTokenExist } = useContext(LandingContext);

    return (
        <div className={`${styles.actions} ${isAccessTokenExist ? styles.logged_in : ''}`}>
            <a className={styles.main} href={isAccessTokenExist ? '/dashboard' : '/users?action=daftar'} target={'_blank'}>
                <h3>{isAccessTokenExist ? 'Dashboard' : 'Daftar'}</h3>
            </a>
            <a className={styles.secondary} href={isAccessTokenExist ? '/panduan' : '/users?action=login'} target={'_blank'}>
                <h3>{isAccessTokenExist ? 'Panduan' : 'Login'}</h3>
            </a>
        </div>
    )
}