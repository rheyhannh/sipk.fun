'use client'

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
    HERO_SECTION_ID,
    HERO_BANNER_ID,
    HERO_TITLE_DELAY_OFFSET,
    HERO_TITLE_PARAGRAPH,
    HERO_TITLE_PROPS,
    HERO_DESCRIPTION_TEXT,
    HERO_BUTTONS,
    HERO_NOTIFIKASI_DUMMY_DATA
} from '@root_page/config';
// #endregion

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

// #region HOOKS DEPEDENCY
import useWindowSize from '@/hooks/utils/useWindowSize';
// #endregion

// #region ICON DEPEDENCY
import { FiArrowUpRight, FiArrowRight, FiArrowDown } from "react-icons/fi";
// #endregion

// #region STYLE DEPEDENCY
import styles from '@root_page/root.module.css';
// #endregion

// #region UTIL DEPEDENCY
import { shuffleArray, findArrayIndexByString } from '@root_page/utils';
import { MatkulDummies, MatkulDummiesNilaiColorPreset } from '@/constant/matkul_dummies';
// #endregion

const HERO_TITLE_STAGGERED = shuffleArray(HERO_TITLE_PARAGRAPH.flat().map((_, index) => index * HERO_TITLE_DELAY_OFFSET));

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

    return (
        <motion.section
            id={HERO_SECTION_ID}
            ref={sectionRef}
            className={`${styles.section} ${styles.hero} ${styles.center_overflow}`}
            whileInView={'inView'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
        >
            <ContainerWrapper style={{ position: 'relative', zIndex: 2 }}>
                <Banner
                    id={HERO_BANNER_ID}
                    title='Cek fitur baru yang menarik di SIPK!'
                    href={notifikasi[3].href}
                />
                <Title {...HERO_TITLE_PROPS} />
                <Description text={HERO_DESCRIPTION_TEXT} />
                <Buttons item={HERO_BUTTONS} />
            </ContainerWrapper>

            <MockupContainer>
                <MockupPerspective>
                    <Mockup3D>
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
                            notifikasi={HERO_NOTIFIKASI_DUMMY_DATA}
                            history={[
                                { item: MatkulDummies[1], color: MatkulDummiesNilaiColorPreset[MatkulDummies[1].nilai] },
                                { item: MatkulDummies[0], color: MatkulDummiesNilaiColorPreset[MatkulDummies[0].nilai] },
                                { item: MatkulDummies[4], color: MatkulDummiesNilaiColorPreset[MatkulDummies[4].nilai] },
                            ]}
                        />
                    </Mockup3D>
                </MockupPerspective>
            </MockupContainer>
        </motion.section>
    )
}

/**
 * Props yang digunakan component `Banner`
 * @typedef {Object} BannerProps
 * @property {string} [id]
 * Element `id` atribute
 * 
 * - Default : `banner`
 * @property {string} [title]
 * Judul banner
 * 
 * - Default : `Lorem ipsum dolor`
 * @property {string} [href]
 * Target banner berupa sebuah URL, pathname atau element id dimana akan dihandle component {@link Link}.
 * Jika element id, pastikan diikuti dengan tanda pagar `#`
 * 
 * - Default : `https://www.google.com/`
 */

/**
 * @param {BannerProps} props Banner props
 * @returns {React.ReactElement} Rendered component
 */
function Banner({
    id = 'banner',
    title = 'Lorem ipsum dolor',
    href = 'https://www.google.com/'
}) {
    return (
        <VisibilityWrapper>
            <motion.div
                className={styles.banner}
                initial={{ opacity: 0, y: -40 }}
                variants={{
                    inView: { opacity: 1, y: 0, transition: { duration: 2.25, delay: 0.375, type: 'spring', bounce: 0.3 } }
                }}
            >
                <Link
                    href={href}
                    passHref
                    legacyBehavior
                >
                    <ButtonTranslateForwarded id={id}
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
                        target={'_blank'}
                    >
                        <span>
                            {title}
                        </span>
                        <span className={styles.icon}>
                            <FiArrowUpRight />
                        </span>
                    </ButtonTranslateForwarded>
                </Link>
            </motion.div>
        </VisibilityWrapper>
    )
}

/**
 * Props yang digunakan component `Title`
 * @typedef {Object} TitleProps
 * @property {string} [id]
 * Element `id` atribute
 * 
 * - Default : `title`
 * @property {string} [label]
 * Element `aria-label` atribute
 * 
 * - Default : `Awesome Title`
 */

/**
 * @param {TitleProps} props Title props
 * @returns {React.ReactElement} Rendered component
 */
function Title({
    id = 'title',
    label = 'Awesome Title'
}) {
    return (
        <VisibilityWrapper
            as='h1'
            id={id}
            className={styles.title}
            aria-label={label}
        >
            {HERO_TITLE_PARAGRAPH.flat().map((text, index) => (
                <HighlightText
                    key={index}
                    text={text}
                    {...resolveTitleProps(text)}
                />
            ))}
        </VisibilityWrapper>
    )
}

/**
 * Props yang digunakan component `Description`
 * @typedef {Object} DescriptionProps
 * @property {string} text
 * Description text
 */

/**
 * @param {DescriptionProps} props Description props
 * @returns {React.ReactElement} Rendered component
 */
function Description({ text }) {
    return (
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
                text={text}
            />
        </VisibilityWrapper>
    )
}

/**
 * Props yang digunakan component `Buttons`
 * @typedef {Object} ButtonItemProps
 * @property {string} [id]
 * Element `id` atribute
 * 
 * - Default : `button`
 * @property {string} [text]
 * Button text 
 * 
 * - Default : `Click Me`
 * @property {string} [href]
 * Target button berupa sebuah URL, pathname atau element id dimana akan dihandle component {@link Link}.
 * Jika element id, pastikan diikuti dengan tanda pagar `#`
 * 
 * - Default : `https://www.google.com/`
 */

/**
 * @param {{item:Array<ButtonItemProps>}} props Buttons props
 * @returns {React.ReactElement} Rendered component
 */
function Buttons({
    item = [
        { id: 'button', text: 'Click Me', href: 'https://www.google.com/' },
        { id: 'button', text: 'Click Me', href: 'https://www.google.com/' },
    ]
}) {
    const { width: vw, height: vh } = useWindowSize();

    return (
        <VisibilityWrapper>
            <motion.div
                className={styles.buttons}
                initial={{ opacity: 0, y: 40 }}
                variants={{ inView: { opacity: 1, y: 0, transition: { duration: 2.25, delay: 0.75, type: 'spring', bounce: 0.3 } } }}
            >
                <Link
                    href={item[0]?.href || 'https://www.google.com/'}
                    scroll={false}
                    passHref
                    legacyBehavior
                >
                    <ButtonSimpleForwarded
                        id={item[0]?.id || 'button'}
                        {...BUTTONSIMPLE_MAIN_PRESET}
                    >
                        <span>
                            {item[0]?.text || 'Click Me'}
                        </span>
                        <span className={styles.icon}>
                            <FiArrowRight />
                        </span>
                    </ButtonSimpleForwarded>
                </Link>

                <ButtonSimple
                    id={item[1]?.id || 'button'}
                    {...BUTTONSIMPLE_SECONDARY_PRESET}
                    onClickCapture={(event) => {
                        event.currentTarget.blur();
                    }}
                    onClick={(event) => {
                        const target = item[1]?.href || 'https://www.google.com/';
                        if (target.startsWith('#')) {
                            const id = target.split('#')[1];
                            const element = document.getElementById(id);
                            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }}
                >
                    <span>
                        {item[1]?.text || 'Click Me'}
                    </span>
                    <span className={styles.icon}>
                        <FiArrowDown />
                    </span>
                </ButtonSimple>
            </motion.div>
        </VisibilityWrapper>
    )
}

/**
 * @param {React.HTMLProps<HTMLDivElement>} props MockupContainer props
 * @returns {React.ReactElement} Rendered component
 */
function MockupContainer({ children }) {
    return (
        <div className={styles.mockup_container} >
            {children}
        </div>
    )
}

/**
 * @param {React.HTMLProps<HTMLDivElement>} props MockupPerspective props
 * @returns {React.ReactElement} Rendered component
 */
function MockupPerspective({ children }) {
    return (
        <div className={styles.mockup_perspective}>
            {children}
        </div>
    )
}

/**
 * @param {React.HTMLProps<HTMLDivElement>} props Mockup3D props
 * @returns {React.ReactElement} Rendered component
 */
function Mockup3D({ children }) {
    return (
        <div className={styles.mockup_3d}>
            {children}
        </div>
    )
}

/**
 * Resolve props yang digunakan pada component `HighlightText`
 * @param {string} text String teks untuk mengatur delay animasi
 * @returns {import('@/component/motion/HighlightText').HighlightTextProps} Props yang sudah diatur
 */
function resolveTitleProps(text) {
    return {
        useHook: false,
        preset: 'wavingFlyIn',
        presetOptions: {
            makeVariant: true,
            variantName: 'inView',
            customCharVariants: {},
            customWordVariants: {},
        },
        adjustWavingFlyIn: {
            baseDelay: HERO_TITLE_STAGGERED[findArrayIndexByString(text, HERO_TITLE_PARAGRAPH.flat())],
            y: [-125, 0],
            duration: 1.75
        }
    }
}

export const BUTTONSIMPLE_MAIN_PRESET = {
    textColor: {
        unhover: 'var(--white-color)',
        hover: 'var(--white-color)'
    },
    bgColor: {
        unhover: 'var(--users-btn-alt)',
        hover: 'var(--users-btn-hov)'
    },
    style: {
        border: 'none',
        borderRadius: '0.75rem',
        padding: '0.7rem 0.9rem',
        gap: '0.25rem',
        fontWeight: 600,
    }
}

export const BUTTONSIMPLE_SECONDARY_PRESET = {
    textColor: {
        unhover: 'var(--dark-color)',
        hover: 'var(--dark-color)'
    },
    bgColor: {
        unhover: 'var(--white-color)',
        hover: 'var(--accordion-bg-color)'
    },
    borderColor: {
        unhover: 'var(--accordion-bg2-color)',
        hover: 'var(--accordion-bg2-color)'
    },
    style: {
        borderRadius: '0.75rem',
        padding: '0.7rem 0.9rem',
        gap: '0.25rem'
    }
}

export default Hero;