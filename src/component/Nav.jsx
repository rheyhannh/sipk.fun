'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js';
// #endregion

// #region NEXT DEPEDENCY
import Link from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import { useContext, useEffect } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { DashboardContext } from '@/component/provider/Dashboard';
import { ModalContext } from '@/component/provider/Modal';
import { Icon } from '@/component/loader/ReactIcons';
// #endregion

// #region HOOKS DEPEDENCY
import { useUser } from '@/data/core';
// #endregion

// #region VARIABLE DEPEDENCY
import { dashboardNavItem } from '@/constant/client';
// #endregion

// #region ICON DEPEDENCY
import { PiUserCircleLight } from "react-icons/pi";
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/nav.module.css';
// #endregion

export default function Nav({ children }) {
    const { data, error } = useUser();

    /** @type {ContextTypes.DashboardContext} */
    const {
        isNavbarActive,
        setNavbarActive,
        isRichContent,
        activeLink
    } = useContext(DashboardContext);

    /** @type {ContextTypes.ModalContext} */
    const {
        setModal,
        setActive,
        setData
    } = useContext(ModalContext);

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

    const handleRatingModal = () => {
        if (!isRichContent) { setNavbarActive(false); }
        setData(null);
        setModal('rating');
        setTimeout(() => {
            setActive(true);
        }, 50)
    }

    const handleAkunModal = () => {
        if (!data || data.length === 0 || error) { return; }
        if (!isRichContent) { setNavbarActive(false); }
        setData(data);
        setModal('akun');
        setTimeout(() => {
            setActive(true);
        }, 50)
    }

    const handleTentangModal = () => {
        if (!isRichContent) { setNavbarActive(false); }
        setData(null);
        setModal('tentang');
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
                                            onClick={handleAkunModal}
                                        >
                                            <span className={styles.link__icon}>
                                                <Icon name={'RiUserSettingsLine'} lib={'ri'} props={{ size: '24px' }} />
                                            </span>

                                            <h4 className={styles.link__text} >
                                                {'Akun'}
                                            </h4>
                                        </span>

                                        {dashboardNavItem.map((item, index) => (
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
                                            onClick={handleRatingModal}
                                        >
                                            <span className={styles.link__icon}>
                                                <Icon name={'AiOutlineStar'} lib={'ai'} props={{ size: '24px' }} />
                                            </span>

                                            <h4 className={styles.link__text} >
                                                {'Rating'}
                                            </h4>
                                        </span>

                                        <span
                                            className={styles.link}
                                            onClick={handleTentangModal}
                                        >
                                            <span className={styles.link__icon}>
                                                <Icon name={'GoInfo'} lib={'go'} props={{ size: '24px' }} />
                                            </span>

                                            <h4 className={styles.link__text} >
                                                {'Tentang'}
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
                                        onClick={handleAkunModal}
                                    >
                                        <span className={styles.link__icon}>
                                            <Icon name={'RiUserSettingsLine'} lib={'ri'} props={{ size: '24px' }} />
                                        </span>

                                        <h4 className={styles.link__text} >
                                            {'Akun'}
                                        </h4>
                                    </span>

                                    {dashboardNavItem.map((item, index) => (
                                        <Link
                                            href={item.href}
                                            className={`${styles.link} ${activeLink === item.href ? styles.active : ''}`}
                                            prefetch={false}
                                            key={crypto.randomUUID()}
                                        >
                                            <span className={styles.link__icon}>
                                                <Icon name={item.iconName} lib={item.iconLib} props={{ size: '24px' }} />
                                            </span>

                                            <h4 className={styles.link__text} >
                                                {item.text}
                                            </h4>
                                        </Link>
                                    ))}

                                    <span
                                        className={styles.link}
                                        onClick={handleRatingModal}
                                    >
                                        <span className={styles.link__icon}>
                                            <Icon name={'AiOutlineStar'} lib={'ai'} props={{ size: '24px' }} />
                                        </span>

                                        <h4 className={styles.link__text} >
                                            {'Rating'}
                                        </h4>
                                    </span>

                                    <span
                                        className={styles.link}
                                        onClick={handleTentangModal}
                                    >
                                        <span className={styles.link__icon}>
                                            <Icon name={'GoInfo'} lib={'go'} props={{ size: '24px' }} />
                                        </span>

                                        <h4 className={styles.link__text} >
                                            {'Tentang'}
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