'use client'

// #region NEXT DEPEDENCY
import Link from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from 'framer-motion';
import { ButtonTranslateForwarded, ButtonSimple, ButtonSimpleForwarded } from '@/component/Button';
import {
    ContainerWrapper,
    VisibilityWrapper,
} from '@root_page/components';
import HighlightText from '@/component/motion/HighlightText';
import DashboardMockup from '@/page/dashboard/Mockup';
// #endregion

// #region ICON DEPEDENCY
import { FiArrowUpRight, FiArrowRight, FiArrowDown } from "react-icons/fi";
// #endregion

// #region STYLE DEPEDENCY
import styles from '@root_page/root.module.css';
// #endregion

// #region UTIL DEPEDENCY
import { scroller } from 'react-scroll';
import { shuffleArray, findArrayIndexByString, countPrevCharactersAndWords } from '@root_page/utils';
import { MatkulDummies, MatkulDummiesNilaiColorPreset } from '@/constant/matkul_dummies';
// #endregion

/**
 * Resolve props yang digunakan pada component `HighlightText`
 * @param {string} text String teks untuk mengatur delay animasi
 * @returns {import('@/component/motion/HighlightText').HighlightTextProps} Props yang sudah diatur
 */
const resolveTitleProps = (text) => ({
    useHook: false,
    preset: 'wavingFlyIn',
    presetOptions: {
        makeVariant: true,
        variantName: 'inView',
        customCharVariants: HERO_CUSTOM_CHAR_VARIANTS[text] ?? {},
        customWordVariants: HERO_CUSTOM_WORD_VARIANTS[text] ?? { exit: { opacity: 0 } },
    },
    adjustWavingFlyIn: {
        baseDelay: HERO_TITLE_STAGGERED[findArrayIndexByString(text, HERO_TITLE_PARAGRAPH.flat())],
        y: [-125, 0],
        duration: 1.75
    }
})

const HERO_TITLE_DELAY_OFFSET = 0.175;
const HERO_TITLE_PARAGRAPH = [
    ['Perencanaan', 'Dinamis'],
    ['untuk', 'IPK', 'yang', 'Lebih', 'Baik']
]
const HERO_TITLE_STAGGERED = shuffleArray(HERO_TITLE_PARAGRAPH.flat().map((_, index) => index * HERO_TITLE_DELAY_OFFSET));

const HERO_CUSTOM_CHAR_VARIANTS = {

}

const HERO_CUSTOM_WORD_VARIANTS = {

}

const HERO_CUSTOM_VARIANT_COLLECTIONS = [

]

const ABC = [
    {
        "id": "18d26406-4bfd-414d-bb63-b3c9a6346a85",
        "title": "Titik Baru",
        "description": "Memulai perjalanan pada Desember 2023, sekarang pengguna SIPK sudah mencapai 3000 lebih👪. Baca selengkapnya disini👼",
        "href": "/update/21112023/sipk-meraih-3000-member",
        "icon": {
            "lib": "fa",
            "name": "FaRegStar"
        },
        "color": "var(--success-color)",
        "date_created_at": "2023-11-22T07:14:45.630278+00:00",
        "unix_created_at": 1700637275
    },
    {
        "id": "1149c5e1-ca79-436c-a51a-19dfd0272727",
        "title": "Maintenance",
        "description": "Mohon maaf atas ketidaknyamanannya🙏, SIPK akan melakukan perawatan sistem pada 22 November 2023 jam 19:30 WIB🌙",
        "href": "/update/22112023/maintenance-untuk-pemeliharan-jaringan",
        "icon": {
            "lib": "fa",
            "name": "FaTools"
        },
        "color": "var(--warning-color)",
        "date_created_at": "2023-11-22T06:19:57.158438+00:00",
        "unix_created_at": 1700620147
    },
    {
        "id": "bedf2609-e510-462a-8087-22919f2fba92",
        "title": "Announcement",
        "description": "Admin SIPK tidak pernah meminta password maupun data pribadi kamu❗ Dan email resmi SIPK hanya sipk.official.0@gmail.com ❗",
        "href": "/update/21112023/admin-sipk-tidak-pernah-meminta-password",
        "icon": {
            "lib": "ri",
            "name": "RiLockPasswordLine"
        },
        "color": "var(--danger-color)",
        "date_created_at": "2023-11-22T06:21:26.929915+00:00",
        "unix_created_at": 1700508547
    },
    {
        "id": "a3405053-ce4a-48f2-931f-1023724c4c68",
        "title": "Fitur Baru",
        "description": "Share pengalaman akademik, organisasi, sertifikasi maupun portfolio kamu difitur 'Journey'🚀. Yuk cek disini detailnya🏃",
        "href": "/update/20112023/fitur-baru-journey",
        "icon": {
            "lib": "fa",
            "name": "FaRocket"
        },
        "color": "var(--primary-color)",
        "date_created_at": "2023-11-22T06:22:33.95118+00:00",
        "unix_created_at": 1700422147
    }
]

/**
 * Component Description
 * @param {{notifikasi:Array<import('@/types/supabase').NotifikasiData>}} props Hero props
 * @returns {React.ReactElement} Rendered component
 */
const Hero = ({ notifikasi }) => {
    const sectionRef = React.useRef(
        /** @type {HTMLElement} */
        (null)
    )
    const [alreadyInView, setAlreadyInView] = React.useState(false);

    return (
        <motion.section
            id={'home'}
            ref={sectionRef}
            className={`${styles.section} ${styles.hero}`}
            whileInView={'inView'}
            viewport={{ once: true }}
        >
            <ContainerWrapper style={{ position: 'relative', zIndex: 2 }}>
                <VisibilityWrapper>
                    <motion.div
                        className={styles.banner}
                        initial={{ opacity: 0, y: -40 }}
                        variants={{
                            inView: { opacity: 1, y: 0, transition: { duration: 2.25, delay: 0.375, type: 'spring', bounce: 0.3 } }
                        }}
                    >
                        <Link
                            href={'https://chatgpt.com/c/67713a78-705c-800a-88b8-1573aef74f32'}
                            passHref
                            legacyBehavior
                        >
                            <ButtonTranslateForwarded id={'hero-cta-banner'}
                                textColor={{
                                    unhover: 'var(--dark-color)',
                                    hover: 'var(--alwaysWhite-color)'
                                }}
                                bgColor={{
                                    unhover: 'var(--body-color)',
                                    hover: 'var(--users-btn-alt)'
                                }}
                                borderColor={{
                                    unhover: 'var(--users-btn-alt)',
                                    hover: 'var(--users-btn-alt)'
                                }}
                                style={{
                                    borderRadius: '0.5rem',
                                    gap: '0.6rem',
                                    padding: '0.35rem 0.7rem',
                                }}
                                shape='oval'
                                animationDirection='top_left'
                            >
                                <span>Cek fitur baru yang menarik di SIPK!</span>
                                <span className={styles.icon}>
                                    <FiArrowUpRight />
                                </span>
                            </ButtonTranslateForwarded>
                        </Link>
                    </motion.div>
                </VisibilityWrapper>

                <VisibilityWrapper
                    as='h1'
                    id={'hero-title'}
                    className={styles.title}
                    onAnimationComplete={(x) => {
                        if (typeof x === 'string') {
                            if (x === 'inView') setAlreadyInView(true);
                        }
                    }}
                    aria-label={'SIPK Introduction'}
                >
                    {HERO_TITLE_PARAGRAPH.flat().map((text, index) => (
                        <HighlightText
                            key={index}
                            text={text}
                            {...resolveTitleProps(text)}

                        />
                    ))}
                </VisibilityWrapper>

                <VisibilityWrapper
                    id={'hero-description'}
                    className={styles.title_description}
                >
                    <HighlightText
                        useHook={false}
                        preset={'wavingFlyIn'}
                        presetOptions={{
                            makeVariant: true,
                            variantName: 'inView',
                            wordStagger: 'random'
                        }}
                        adjustWavingFlyIn={{
                            baseDelay: 0.5,
                            stagger: 0.03,
                            duration: 1.75
                        }}
                        text={'SIPK memungkinkan kalian menyimpan seluruh matakuliah dengan SKS dan nilai yang kalian tentukan sendiri untuk memvisualisasikan perolehan IPK secara lebih fleksibel dan proaktif.'}
                    />
                </VisibilityWrapper>

                <VisibilityWrapper>
                    <motion.div
                        className={styles.buttons}
                        initial={{ opacity: 0, y: 40 }}
                        variants={{ inView: { opacity: 1, y: 0, transition: { duration: 2.25, delay: 0.75, type: 'spring', bounce: 0.3 } } }}
                    >
                        <Link
                            href={'/users?action=daftar'}
                            passHref
                            legacyBehavior
                        >
                            <ButtonSimpleForwarded id={'hero-cta-main'}
                                bgColor={{
                                    unhover: 'var(--users-btn-alt)',
                                    hover: 'var(--users-btn-hov)',
                                }}
                                textColor={{
                                    unhover: 'var(--white-color)',
                                    hover: 'var(--white-color)',
                                }}
                                style={{
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    padding: '0.7rem 0.9rem',
                                    gap: '0.25rem'
                                }}
                            >
                                <span>
                                    Mulai Sekarang
                                </span>
                                <span className={styles.icon}>
                                    <FiArrowRight />
                                </span>
                            </ButtonSimpleForwarded>
                        </Link>

                        <ButtonSimple id={'hero-cta-secondary'}
                            bgColor={{
                                unhover: 'var(--white-color)',
                                hover: 'var(--accordion-bg-color)',
                            }}
                            textColor={{
                                unhover: 'var(--dark-color)',
                                hover: 'var(--dark-color)',
                            }}
                            borderColor={{
                                unhover: 'var(--accordion-bg2-color)',
                                hover: 'var(--accordion-bg2-color)',
                            }}
                            style={{
                                borderRadius: '0.75rem',
                                padding: '0.7rem 0.9rem',
                                gap: '0.25rem'
                            }}
                            onClick={(event) => {
                                scroller.scrollTo('universitas', { smooth: true, offset: -75 })
                                event.currentTarget.blur();
                            }}
                        >
                            <span>
                                Lihat Detailnya
                            </span>
                            <span className={styles.icon}>
                                <FiArrowDown />
                            </span>
                        </ButtonSimple>
                    </motion.div>
                </VisibilityWrapper>
            </ContainerWrapper>

            <div className={styles.mockup_container} >
                <div className={styles.mockup_perspective}>
                    <div className={styles.mockup_3d}>
                        <DashboardMockup
                            user={{
                                fullname: 'Reyhan Naufal Hayyan',
                                nickname: 'Hayyan'
                            }}
                            summary={[
                                { icon: { name: 'FaRegStar', lib: 'fa' }, title: 'IPK', color: 'var(--success-color)', data: { value: 3.09, percentage: 82, keterangan: 'Targetmu 3.75' } },
                                { icon: { name: 'IoBookOutline', lib: 'io5' }, title: 'Matakuliah', color: 'var(--warning-color)', data: { value: 33, percentage: 66, keterangan: 'Targetmu 50' } },
                                { icon: { name: 'MdOutlineConfirmationNumber', lib: 'md' }, title: 'SKS', color: 'var(--danger-color)', data: { value: 56, percentage: 88, keterangan: 'Targetmu 144' } },
                            ]}
                            notifikasi={ABC}
                            history={[
                                { item: MatkulDummies[1], color: MatkulDummiesNilaiColorPreset[MatkulDummies[1].nilai] },
                                { item: MatkulDummies[0], color: MatkulDummiesNilaiColorPreset[MatkulDummies[0].nilai] },
                                { item: MatkulDummies[4], color: MatkulDummiesNilaiColorPreset[MatkulDummies[4].nilai] },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

export default Hero;