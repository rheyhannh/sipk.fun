'use client'

import { useContext, useEffect, useState } from 'react'
import { ContentContext } from './provider/Content';
import { RxHamburgerMenu } from 'react-icons/rx';
import { LiaTimesSolid } from 'react-icons/lia';
import styles from './style/header.module.css'

export default function Header() {
    const { isNavbarActive, setNavbarActive, isPhoneContent } = useContext(ContentContext);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [showHeader, setShowHeader] = useState(true);

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
            <div className={`${styles.dashboard} ${!showHeader ? styles.hide : ''}`}>
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