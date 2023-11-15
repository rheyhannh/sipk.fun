'use client'

import Image from 'next/image';
import { useContext, useEffect, useState } from 'react'
import { ContentContext } from './provider/Content';
import { animateScroll as scroll } from 'react-scroll';
import { RxHamburgerMenu } from 'react-icons/rx';
import { LiaTimesSolid } from 'react-icons/lia';
import toast from 'react-hot-toast';
import { FiSun, FiMoon } from 'react-icons/fi';
import styles from './style/header.module.css'

export default function Header() {
    const { isNavbarActive, setNavbarActive, isPhoneContent, theme, setTheme, isRichContent } = useContext(ContentContext);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [showHeader, setShowHeader] = useState(true);

    // const darkWord = ['Belum bayar listrik', 'Listrik jepret', 'Gelap', 'Humorku', 'Mode Gelap', 'Malam'];
    // const lightWord = ['Abis bayar listrik', 'Listrik hidup', 'Silau', 'Masadepan', 'Mode Terang', 'Siang'];

    // const helloDark = () => toast(darkWord[Math.floor(Math.random() * darkWord.length)], { duration: 2000, icon: <FiMoon size={'17px'} /> });
    // const helloLight = () => toast(lightWord[Math.floor(Math.random() * lightWord.length)], { duration: 2000, icon: <FiSun size={'17px'} /> });

    const helloDark = () => toast('Dark Mode', { duration: 2000, icon: <FiMoon size={'17px'} /> });
    const helloLight = () => toast('Light Mode', { duration: 2000, icon: <FiSun size={'17px'} /> });

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

    const handleChangeTheme = () => {
        setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
        document.body.classList.toggle('dark-theme', theme !== 'dark');
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark')
        if (theme === 'dark') { helloLight() }
        else { helloDark() }
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
            <div className={`${styles.dashboard} ${!showHeader ? styles.hide : ''}`}>
                <div className={styles.dashboard__nav}>
                    {isNavbarActive ?
                        <LiaTimesSolid onClick={handleNavbarClick} size={'24px'} />
                        : <RxHamburgerMenu onClick={handleNavbarClick} size={'24px'} />
                    }
                </div>

                <div onClick={scrollToTop} className={styles.dashboard__logo}>
                    <Image
                        src={'/logo.png'}
                        width={96}
                        height={96}
                        alt={'SIPK Logo'}
                        priority
                    />
                    <h2>
                        <span style={{ color: 'var(--logo-first-color)' }}>SIP</span>
                        <span style={{ color: 'var(--logo-second-color)' }}>K</span>
                    </h2>
                </div>

                <div onClick={handleChangeTheme} className={styles.dashboard__toolkit}>
                    {theme === 'dark' ?
                        <FiSun size={'24px'} />
                        :
                        <FiMoon size={'24px'} />
                    }
                </div>
            </div>
        </>
    )
}