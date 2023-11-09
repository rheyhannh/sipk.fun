'use client'

import { useContext } from 'react'
import { ContentContext } from './provider/Content';
import { RxHamburgerMenu } from 'react-icons/rx';
import { LiaTimesSolid } from 'react-icons/lia';
import styles from './style/header.module.css'

export default function Header() {
    const { isNavbarActive, setNavbarActive } = useContext(ContentContext);

    return (
        <>
            <div className={styles.dashboard}>
                <div className={styles.corner}>
                    <div className={styles.hamburger}>
                        {isNavbarActive ?
                            <LiaTimesSolid onClick={() => { setNavbarActive((current) => (current === true ? false : true)) }} size={'24px'} />
                            : <RxHamburgerMenu onClick={() => { setNavbarActive((current) => (current === true ? false : true)) }} size={'24px'} />
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