'use client'

// ========== NEXT DEPEDENCY ========== //
import Link from 'next/link';

// ========== REACT DEPEDENCY ========== //
import { useContext, useEffect } from 'react'

// ========== COMPONENT DEPEDENCY ========== //
import { DashboardContext } from './provider/Dashboard';
import { ModalContext } from './provider/Modal';
import { Icon } from './loader/ReactIcons';
import { PiUserCircleLight } from "react-icons/pi";

// ========== DATA DEPEDENCY ========== //
import { useUser } from '@/data/core';

// ========== STYLE DEPEDENCY ========== //
import styles from './style/nav.module.css'

/*
============================== CODE START HERE ==============================
*/
export default function Nav({ children }) {
    const { data, error } = useUser();
    const {
        isNavbarActive,
        setNavbarActive,
        isRichContent,
        activeLink
    } = useContext(DashboardContext);
    const {
        setModal,
        setActive,
        setData
    } = useContext(ModalContext);

    const navList = [
        { text: 'Dashboard', href: '/dashboard', icon: 'AiOutlineAppstore', lib: 'ai' },
        { text: 'Matakuliah', href: '/dashboard/matakuliah', icon: 'BsJournalBookmark', lib: 'bs' },
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

    const handleLogoutModal = () => {
        if (!isRichContent) { setNavbarActive(false); }
        setData(null);
        setModal('logout');
        setTimeout(() => {
            setActive(true);
        }, 50)
    }

    const handleProfilModal = () => {
        if (!data || data.length === 0 || error) { return; }
        if (!isRichContent) { setNavbarActive(false); }
        setData(data);
        setModal('profil');
        setTimeout(() => {
            setActive(true);
        }, 50)
    }

    return (
        <>
            {isRichContent === true ?
                <>
                    <div className={styles.content}>
                        <aside className='dashboard'>
                            <div className={`${styles.aside} ${isNavbarActive ? styles.active : ''}`} id='aside'>
                                <div className={styles.sidebar}>
                                    <div>
                                        {data && data.length !== 0 && !error &&
                                            <div
                                                onClick={handleProfilModal}
                                                className={styles.profile}
                                            >
                                                <span className={styles.profile__icon}>
                                                    <PiUserCircleLight size={'24px'} />
                                                </span>
                                                <h4 className={styles.profile__text}>
                                                    {data[0].nickname}
                                                </h4>

                                            </div>
                                        }

                                        <span
                                            className={styles.link}
                                            onClick={() => { console.log('Show Modal Ganti Email dan Password') }}
                                        >
                                            <span className={styles.link__icon}>
                                                <Icon name={'RiUserSettingsLine'} lib={'ri'} props={{ size: '24px' }} />
                                            </span>

                                            <h4 className={styles.link__text} >
                                                {'Akun'}
                                            </h4>
                                        </span>

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

                                        <span
                                            className={styles.link}
                                            onClick={() => { console.log('Show Modal Feedback') }}
                                        >
                                            <span className={styles.link__icon}>
                                                <Icon name={'GoReport'} lib={'go'} props={{ size: '24px' }} />
                                            </span>

                                            <h4 className={styles.link__text} >
                                                {'Feedback'}
                                            </h4>
                                        </span>

                                        <span
                                            className={styles.link}
                                            onClick={() => { console.log('Show Modal Informasi') }}
                                        >
                                            <span className={styles.link__icon}>
                                                <Icon name={'AiOutlineInfoCircle'} lib={'ai'} props={{ size: '24px' }} />
                                            </span>

                                            <h4 className={styles.link__text} >
                                                {'Informasi'}
                                            </h4>
                                        </span>

                                        <span
                                            className={styles.link}
                                            onClick={() => { handleLogoutModal() }}
                                        >
                                            <span className={styles.link__icon}>
                                                <Icon name={'FiLogOut'} lib={'fi'} props={{ size: '24px' }} />
                                            </span>

                                            <h4 className={styles.link__text} >
                                                {'Keluar'}
                                            </h4>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                        <div className={styles.container}>
                            {children}
                        </div>
                    </div>
                </>
                : isRichContent === false ?
                    <>
                        <div className={`${styles.aside} ${isNavbarActive ? styles.active : ''}`} id='aside'>
                            <div className={styles.sidebar}>
                                <div>
                                    {data && data.length !== 0 && !error &&
                                        <div
                                            onClick={handleProfilModal}
                                            className={styles.profile}
                                        >
                                            <span className={styles.profile__icon}>
                                                <PiUserCircleLight size={'24px'} />
                                            </span>
                                            <h4 className={styles.profile__text}>
                                                {data[0].nickname}
                                            </h4>

                                        </div>
                                    }

                                    <span
                                        className={styles.link}
                                        onClick={() => { console.log('Show Modal Ganti Email dan Password') }}
                                    >
                                        <span className={styles.link__icon}>
                                            <Icon name={'RiUserSettingsLine'} lib={'ri'} props={{ size: '24px' }} />
                                        </span>

                                        <h4 className={styles.link__text} >
                                            {'Akun'}
                                        </h4>
                                    </span>

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

                                    <span
                                        className={styles.link}
                                        onClick={() => { console.log('Show Modal Feedback') }}
                                    >
                                        <span className={styles.link__icon}>
                                            <Icon name={'GoReport'} lib={'go'} props={{ size: '24px' }} />
                                        </span>

                                        <h4 className={styles.link__text} >
                                            {'Feedback'}
                                        </h4>
                                    </span>

                                    <span
                                        className={styles.link}
                                        onClick={() => { console.log('Show Modal Informasi') }}
                                    >
                                        <span className={styles.link__icon}>
                                            <Icon name={'AiOutlineInfoCircle'} lib={'ai'} props={{ size: '24px' }} />
                                        </span>

                                        <h4 className={styles.link__text} >
                                            {'Informasi'}
                                        </h4>
                                    </span>

                                    <span
                                        className={styles.link}
                                        onClick={() => { handleLogoutModal() }}
                                    >
                                        <span className={styles.link__icon}>
                                            <Icon name={'FiLogOut'} lib={'fi'} props={{ size: '24px' }} />
                                        </span>

                                        <h4 className={styles.link__text} >
                                            {'Keluar'}
                                        </h4>
                                    </span>
                                </div>
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