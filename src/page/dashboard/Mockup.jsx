'use client'

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useLocalTheme from '@/hooks/swr/useLocalTheme';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, AnimatePresence } from 'framer-motion';
import { SummaryDummy, HistoryDummy, NotificationDummy } from '@/component/Card';
import { Logo } from '@/component/Main';
// #endregion

// #region ICON DEPEDENCY
import { PiUserCircleLight } from 'react-icons/pi';
import { RiUserSettingsLine } from 'react-icons/ri';
import { GoInfo } from 'react-icons/go';
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { AiOutlineStar, AiOutlineAppstore } from 'react-icons/ai';
import { BsJournalBookmark } from 'react-icons/bs';
import { IoAddOutline } from "react-icons/io5";
// #endregion

// #region STYLE DEPEDENCY
import nav_styles from '@/component/style/nav.module.css';
import header_styles from '@/component/style/header.module.css';
import layout_styles from '@dashboard_page/dashboard.module.css';
import card_styles from '@/component/style/card.module.css';
// #endregion

const DEFAULT_ANIMATION = /** @type {Pick<import('framer-motion').MotionProps, 'initial' | 'variants' | 'transition'>} */ ({
    initial: {
        opacity: 0, y: 25, x: 75, z: 750, transformStyle: 'preserve-3d'
    },
    variants: {
        inView: {
            opacity: 1, y: 0, x: 0, z: 0
        },
        exit: {
            opacity: 0, y: -25, x: -75, z: -750
        }
    },
    transition: {
        duration: 1.5,
        type: 'spring',
        bounce: 0.2
    }
})

const DEFAULT_ANIMATION_DELAYS = [2.5, 2.85, 3.1];

/**
 * Props yang digunakan component `Mockup`
 * @typedef {Object} MockupProps
 * @property {Object} [user]
 * Nama lengkap dan nickname user untuk ditampilkan pada mockup
 * 
 * - Default : 
 * 
 * ```js
 * { fullname: 'John Doe', nickname: 'John' }
 * ```
 * @property {string} [user.fullname]
 * Nama lengkap user untuk ditampilkan pada mockup
 * 
 * - Default : `John Doe`
 * @property {string} [user.nickname]
 * Nickname user untuk ditampilkan pada mockup
 * 
 * - Default : `John`
 * @property {Array<Parameters<typeof SummaryDummy>[0]>} [summary]
 * Render card {@link SummaryDummy} dimana setiap entry merupakan props dari card tersebut.
 * Gunakan empty array jika tidak ingin merender card.
 * 
 * - Default : `[]`
 * @property {Array<import('@/types/supabase').NotifikasiData>} [notifikasi]
 * Array yang berisikan notifikasi
 * 
 * - Default : `[]`
 * @property {Array<Pick<Parameters<typeof HistoryDummy>[0], 'item' | 'semester' | 'color'>>} [history]
 * Render card {@link HistoryDummy} dimana setiap entry merupakan props dari card tersebut.
 * Gunakan empty array jika tidak ingin merender card.
 * 
 * - Default : `[]`
 * @property {boolean} [isNavbarActive]
 * Boolean untuk menggunakan mockup dengan navbar yang aktif
 * 
 * - Default : `true`
 * @property {boolean} [isRichContent]
 * Boolean untuk menggunakan mockup dengan layout rich content.
 * Untuk saat ini hanya support `true`, menggunakan `false` pada props ini akan tetap menggunakan layout rich content.
 * 
 * Jika suatu saat ingin menggunakan mockup yang sesuai dengan viewport client, dapat memperbarui render yang dilakukan
 * component {@link Nav}.
 * 
 * @property {typeof DEFAULT_ANIMATION} [animation]
 * 
 * Animasi yang digunakan untuk setiap component pada mockup dengan `initial` sebagai kondisi awal sebelum dianimasikan
 * dan buat variant `inView` untuk animasi masuk yang digunakan, `exit` untuk animasi exit yang digunakan,
 * 
 * ```js
 * const animation = {
 *      initial: { opacity: 0, y: 25, x: 75, z: 500 },
 *      variants: {
 *              inView: { opacity: 1, y: 0, x: 0, z: 0 },
 *              exit: { opacity: 0, y: -25, x: -75, z: -500 },
 *      }
 * }
 * ```
 * 
 * Default menggunakan preset animasi {@link DEFAULT_ANIMATION berikut} dengan {@link DEFAULT_ANIMATION_DELAYS delay}
 * 
 */

/**
 * Mockup halaman `Dashboard` dengan data user, card dan animasi masuk dan keluar yang dapat diatur. 
 * Untuk saat ini mockup diatur untuk menggunakan rich content atau layout desktop.
 * @param {MockupProps} props Mockup props
 * @returns {React.ReactElement} Rendered component
 */
function Mockup({
    user = { fullname: 'John Doe', nickname: 'John' },
    summary = [],
    notifikasi = [],
    history = [],
    isRichContent = true,
    isNavbarActive = true,
    animation = DEFAULT_ANIMATION
}) {
    user = { fullname: user?.fullname ?? 'John Doe', nickname: user?.nickname ?? 'John' }

    return (
        <>
            <Header user={user} isNavbarActive={isNavbarActive} animation={animation} />
            <main className='dashboard' style={{ margin: '0', width: '98%' }}>
                <Nav user={user} isRichContent={isRichContent} isNavbarActive={isNavbarActive} animation={animation}>
                    <Content summary={summary} notifikasi={notifikasi} history={history} animation={animation} />
                </Nav>
            </main>
        </>
    )
}

/**
 * @param {React.HTMLProps<HTMLDivElement> & Pick<MockupProps, 'user' | 'isNavbarActive' | 'animation'>} props Header props
 * @returns {React.ReactElement} Rendered component
 */
function Header({ user, isNavbarActive, animation, ...props }) {
    return (
        <motion.div
            className={header_styles.dashboard}
            style={{
                '--header-height': '4.5rem',
                position: 'relative',
                zIndex: 'inherit',
                background: 'var(--root-hero-mockupBgContrastColor)',
                padding: '1rem 1.5rem',
                borderTopLeftRadius: 'inherit',
                borderTopRightRadius: 'inherit',
                perspective: 4000,
            }}
            {...props}
        >
            <motion.div
                initial={{ ...animation?.initial, z: 25 }}
                variants={{
                    inView: { ...animation?.variants?.inView, },
                    exit: { ...animation?.variants?.exit, z: -25 }
                }}
                transition={{ ...animation?.transition, delay: DEFAULT_ANIMATION_DELAYS[0] }}
            >
                <div className={`${header_styles.hamburger} ${isNavbarActive ? header_styles.active : undefined}`}>
                    <div className={header_styles.hamburger__box}>
                        <div className={header_styles.hamburger__inner} />
                    </div>
                </div>
            </motion.div>

            <motion.div
                style={{
                    position: 'absolute',
                    left: '50%',
                }}
                {...animation}
                transition={{ ...animation?.transition, delay: DEFAULT_ANIMATION_DELAYS[1] }}
            >
                <Logo
                    containerProps={{
                        className: header_styles.dashboard__logo,
                        style: { position: 'relative', left: 0 }
                    }}
                    image={{ imageProps: { priority: true } }}
                />
            </motion.div>

            <motion.div
                className={header_styles.dashboard__right}
                {...animation}
                transition={{ ...animation?.transition, delay: DEFAULT_ANIMATION_DELAYS[2] }}
            >
                <ThemeChanger />
                <Profile user={user} />
            </motion.div>
        </motion.div>
    )
}

/**
 * @param {Pick<MockupProps, 'user'>} props Profile props
 * @returns {React.ReactElement} Rendered component
 */
function Profile({ user }) {
    return (
        <div
            className={header_styles.dashboard__profile}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                textAlign: 'right',
            }}
        >
            <div className={`${header_styles.dashboard__profile_info}`}>
                <p>
                    <b>
                        {user.fullname}
                    </b>
                </p>
                <small>
                    {user.nickname}
                </small>
            </div>
            <div className={`${header_styles.dashboard__profile_avatar}`} />
        </div>
    )
}

/**
 * @returns {React.ReactElement} Rendered component
 */
function ThemeChanger() {
    const { data: theme } = useLocalTheme();

    return (
        <div className={header_styles.dashboard__theme}>
            <span className={theme === 'light' ? header_styles.active : undefined}>
                <FiSun size={'15px'} />
            </span>
            <span className={theme === 'dark' ? header_styles.active : undefined}>
                <FiMoon size={'15px'} />
            </span>
        </div>
    )
}

/**
 * @param {React.HTMLProps<HTMLDivElement> & Pick<MockupProps, 'user' | 'isRichContent' | 'isNavbarActive' | 'animation'>} props Nav props
 * @returns {React.ReactElement} Rendered component
 */
function Nav({ user, isRichContent = true, isNavbarActive = true, animation, children, ...props }) {
    return (
        <div
            className={nav_styles.content}
            style={{
                display: 'grid',
                gridGap: '1.8rem',
                gap: '1.8rem',
                padding: '0',
                gridTemplateColumns: '185px 1fr'
            }}
        >
            <aside className='dashboard'>
                <div
                    className={`${nav_styles.aside} ${isNavbarActive ? nav_styles.active : ''}`}
                    style={{
                        position: 'relative',
                        paddingTop: 0,
                        background: 'var(--root-hero-mockupBgContrastColor)',
                        zIndex: 'inherit',
                        overflow: 'visible',
                    }}
                    {...props}
                >
                    <Sidebar user={user} animation={animation} />
                </div>
            </aside>
            <div className={nav_styles.container}>
                {children}
            </div>
        </div>
    )
}

/**
 * @param {Pick<MockupProps, 'user' | 'animation'>} props Sidebar props
 * @returns {React.ReactElement} Rendered component
 */
function Sidebar({ user, animation }) {
    return (
        <div
            className={nav_styles.sidebar}
            style={{
                overflow: 'visible',
                paddingTop: '1rem'
            }}
        >
            <motion.div style={{ perspective: 4000 }}>
                <ProfilAside user={user} animation={animation} />
                <LinkAside icon={<RiUserSettingsLine size={'24px'} />} text={'Akun'} animation={animation} />
                <LinkAside icon={<AiOutlineAppstore size={'24px'} />} text={'Dashboard'} active={true} animation={animation} />
                <LinkAside icon={<BsJournalBookmark size={'24px'} />} text={'Matakuliah'} animation={animation} />
                <LinkAside icon={<AiOutlineStar size={'24px'} />} text={'Rating'} animation={animation} />
                <LinkAside icon={<GoInfo size={'24px'} />} text={'Tentang'} animation={animation} />
                <LinkAside icon={<FiLogOut size={'24px'} />} text={'Keluar'} animation={animation} />
            </motion.div>
        </div>
    )
}

/**
 * @param {Pick<MockupProps, 'user' | 'animation'>} props ProfilAside props
 * @returns {React.ReactElement} Rendered component
 */
function ProfilAside({ user, animation }) {
    return (
        <motion.div
            className={nav_styles.profile}
            {...animation}
            transition={{ ...animation?.transition, delay: DEFAULT_ANIMATION_DELAYS[0] }}
        >
            <span className={nav_styles.profile__icon}>
                <PiUserCircleLight size={'24px'} />
            </span>
            <h4 className={nav_styles.profile__text}>
                {user.nickname}
            </h4>
        </motion.div>
    )
}

/**
 * @param {React.HTMLProps<HTMLSpanElement> & Pick<MockupProps, 'animation'> & {icon:React.ReactNode, text:string, active:boolean}} props LinkAside props
 * @returns {React.ReactElement} Rendered component
 */
function LinkAside({ icon, text, active, animation, ...props }) {
    return (
        <motion.span
            className={`${nav_styles.link} ${active ? nav_styles.active : ''}`}
            {...animation}
            transition={{ ...animation?.transition, delay: DEFAULT_ANIMATION_DELAYS[0] }}
            {...props}
        >
            <span className={nav_styles.link__icon}>
                {icon}
            </span>

            <h4 className={nav_styles.link__text} >
                {text}
            </h4>
        </motion.span>
    )
}

/**
 * @param {React.HTMLProps<HTMLDivElement> & Pick<MockupProps, 'summary' | 'notifikasi' | 'history' | 'animation'>} props Content props
 * @returns {React.ReactElement} Rendered component
 */
function Content({ summary = [], notifikasi = [], history = [], animation, ...props }) {
    return (
        <div
            className={layout_styles.wrapper}
            style={{
                display: 'grid',
                padding: '0',
                gridTemplateColumns: 'auto 23rem',
                gridGap: '2rem',
                gap: '2rem',
                marginTop: '1rem'
            }}
            {...props}
        >
            <motion.div className={layout_styles.primary} style={{ perspective: 4000 }}>
                <motion.h1
                    className={layout_styles.wrapper__title}
                    initial={{ ...animation?.initial, z: 25 }}
                    variants={{
                        inView: { ...animation?.variants?.inView, },
                        exit: { ...animation?.variants?.exit, z: -25 }
                    }}
                    transition={{ ...animation?.transition, delay: DEFAULT_ANIMATION_DELAYS[1] }}
                >
                    Dashboard
                </motion.h1>
                <motion.div
                    className={layout_styles.insight}
                    style={{ display: 'grid', gridTemplateColumns: '1fr', gridGap: '0', gap: '0', transformStyle: 'preserve-3d' }}
                >
                    {summary.map((props, index) => (
                        <motion.div
                            key={index}
                            {...animation}
                            transition={{ ...animation?.transition, delay: DEFAULT_ANIMATION_DELAYS[1] }}
                        >
                            <SummaryDummy {...props} />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
            <div className={layout_styles.secondary}>
                <motion.div
                    className={layout_styles.history}
                    style={{ perspective: 4000 }}
                >
                    <motion.h2
                        className={layout_styles.wrapper__title}
                        initial={{ ...animation?.initial, z: 25 }}
                        variants={{
                            inView: { ...animation?.variants?.inView, },
                            exit: { ...animation?.variants?.exit, z: -25 }
                        }}
                        transition={{ ...animation?.transition, delay: DEFAULT_ANIMATION_DELAYS[2] }}
                    >
                        Riwayat Matakuliah
                    </motion.h2>
                    {history.map((props, index) => (
                        <HistoryDummy
                            key={index}
                            style={{ transition: 'none' }}
                            {...animation}
                            transition={{ ...animation?.transition, delay: DEFAULT_ANIMATION_DELAYS[2] }}
                            {...props}
                        />
                    ))}
                    <motion.div
                        className={`${card_styles.history} ${card_styles.tambah}`}
                        style={{ cursor: 'auto', transition: 'none' }}
                        {...animation}
                        transition={{ ...animation?.transition, delay: DEFAULT_ANIMATION_DELAYS[2] }}
                    >
                        <div className={card_styles.content}>
                            <IoAddOutline size={'24px'} />
                            <h3>Tambah Matakuliah</h3>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div style={{ perspective: 4000 }} >
                    <motion.h2
                        className={layout_styles.wrapper__title}
                        initial={{ ...animation?.initial, z: 25 }}
                        variants={{
                            inView: { ...animation?.variants?.inView, },
                            exit: { ...animation?.variants?.exit, z: -25 }
                        }}
                        transition={{ ...animation?.transition, delay: DEFAULT_ANIMATION_DELAYS[2] }}
                    >
                        Pemberitahuan
                    </motion.h2>
                    <motion.div
                        {...animation}
                        transition={{ ...animation?.transition, delay: DEFAULT_ANIMATION_DELAYS[2] }}
                    >
                        <NotificationDummy data={notifikasi} />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Mockup;