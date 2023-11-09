'use client'

import { useContext } from 'react'
import { ThemeContext } from './Theme';
import { RxHamburgerMenu } from 'react-icons/rx';
import { LiaTimesSolid } from 'react-icons/lia';
import styles from './style/header.module.css'

export default function Header() {
    const { navActive, setNavActive } = useContext(ThemeContext);

    const handleActiveNav = () => {
        setNavActive((current) => (current === true ? false : true))
    }
    return (
        <>
            <div className={styles.dashboard}>
                <div className={styles.corner}>
                    <div className={styles.hamburger}>
                        {navActive ?
                            <LiaTimesSolid onClick={handleActiveNav} size={'24px'} />
                            : <RxHamburgerMenu onClick={handleActiveNav} size={'24px'} />
                        }
                    </div>
                    <div className={styles.logo}>
                        <h2>SIPK</h2>
                    </div>

                </div>

                <div className={styles.profile}>
                    Profile
                </div>
            </div>
        </>
    )
}