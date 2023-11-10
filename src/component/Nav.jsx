'use client'

import Link from 'next/link';
import { useContext, useEffect } from 'react'
import { ContentContext } from './provider/Content';
import { Icon } from './loader/ReactIcons';
import styles from './style/nav.module.css'

export default function Nav({ children }) {
    const { isNavbarActive, setNavbarActive, isRichContent, activeLink } = useContext(ContentContext);

    const navList = [
        { text: 'Dashboard', href: '/dashboard', icon: 'AiOutlineAppstore', lib: 'ai' },
        { text: 'Profil', href: '/dashboard/profil', icon: 'AiOutlineIdcard', lib: 'ai' },
        { text: 'Akun', href: '/dashboard/akun', icon: 'MdOutlineManageAccounts', lib: 'md' },
        { text: 'Matakuliah', href: '/dashboard/matkul', icon: 'BsJournalBookmark', lib: 'bs' },
        { text: 'Statistik', href: '/dashboard/statistik', icon: 'MdOutlineQueryStats', lib: 'md' },
        { text: 'Pesan', href: '/dashboard/pesan', icon: 'BsEnvelope', lib: 'bs' },
        { text: 'Laporkan', href: '/dashboard/laporkan', icon: 'GoReport', lib: 'go' },
        { text: 'Tentang', href: '/dashboard/tentang', icon: 'AiOutlineInfoCircle', lib: 'ai' },
        { text: 'Keluar', href: '/users/logout', icon: 'FiLogOut', lib: 'fi' },
    ]

    useEffect(() => {
        const handleClickOutside = (e) => {
            const aside = document.getElementById('aside');
            if (isNavbarActive && aside && !isRichContent && !aside.contains(e.target)) {
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
            {isRichContent ?
                <>
                    <div className={styles.content}>
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

                        {children}
                    </div>
                </>
                :
                <>
                    <div className={`${styles.aside} ${isNavbarActive ? styles.active : ''}`} id='aside'>
                        <div className={styles.sidebar}>
                            {navList.map((item, index) => (
                                <Link
                                    href={item.href}
                                    className={`${styles.link} ${activeLink === item.href ? styles.active : ''}`}
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
            }
        </>
    )
}