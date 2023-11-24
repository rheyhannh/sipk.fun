'use client'

import Link from 'next/link';
import { useContext, useEffect } from 'react'
import { DashboardContext } from './provider/Dashboard';
import { Icon } from './loader/ReactIcons';
import styles from './style/nav.module.css'

export default function Nav({ children }) {
    const {
        isNavbarActive,
        setNavbarActive,
        isRichContent,
        activeLink
    } = useContext(DashboardContext);

    const navList = [
        { text: 'Dashboard', href: '/dashboard', icon: 'AiOutlineAppstore', lib: 'ai' },
        { text: 'Profil', href: '/dashboard/profil', icon: 'AiOutlineIdcard', lib: 'ai' },
        { text: 'Matakuliah', href: '/dashboard/matkul', icon: 'BsJournalBookmark', lib: 'bs' },
        { text: 'Keluar', href: '/api/logout', icon: 'FiLogOut', lib: 'fi' },
    ]

    useEffect(() => {
        const handleClickOutside = (e) => {
            const aside = document.getElementById('aside');
            if (isNavbarActive && aside && !isRichContent && !aside.contains(e.target)) {
                document.body.classList.remove('disable_scroll');
                setNavbarActive(false);
            }
        }

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);

        }
    }, [isNavbarActive])

    return (
        <>
            {isRichContent === true ?
                <>
                    <div className={styles.content}>
                        <aside className='dashboard'>
                            <div className={`${styles.aside} ${isNavbarActive ? styles.active : ''}`} id='aside'>
                                <div className={styles.sidebar}>
                                    {navList.map((item, index) => (
                                        <Link
                                            href={item.href}
                                            className={`${styles.link} ${activeLink === item.href ? styles.active : ''}`}
                                            prefetch={false}
                                            key={crypto.randomUUID()}
                                        >
                                            <span className={styles.link__icon}>
                                                <Icon name={item.icon} lib={item.lib} props={{ size: '24px' }} />
                                            </span>

                                            <h4 className={styles.link__text} >
                                                {item.text}
                                            </h4>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {children}
                    </div>
                </>
                : isRichContent === false ?
                    <>
                        <div className={`${styles.aside} ${isNavbarActive ? styles.active : ''}`} id='aside'>
                            <div className={styles.sidebar}>
                                {navList.map((item, index) => (
                                    <Link
                                        href={item.href}
                                        className={`${styles.link} ${activeLink === item.href ? styles.active : ''}`}
                                        prefetch={false}
                                        key={crypto.randomUUID()}
                                    >
                                        <span className={styles.link__icon}>
                                            <Icon name={item.icon} lib={item.lib} props={{ size: '24px' }} />
                                        </span>

                                        <span className={styles.link__text} >
                                            {item.text}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className={styles.content}>
                            {children}
                        </div>
                    </>
                    : <></>
            }
        </>
    )
}