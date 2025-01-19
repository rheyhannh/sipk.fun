'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { AnimatedElementProps } from '../components';
// #endregion

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
    UNIVERSITAS_SECTION_TITLE,
    UNIVERSITAS_SECTION_DESCRIPTION,
    UNIVERSITAS_ITEMS_LAYOUT,
} from '../config';
// #endregion

// #region NEXT DEPEDENCY
import Link from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useWindowSize from '@/hooks/utils/useWindowSize';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@root_page/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useScroll, useSpring } from 'framer-motion';
import { ContainerWrapper } from '../components';
import ScrollingCarousel from '@/component/motion/ScrollingCarousel';
import AnimatedElement from '@/component/motion/AnimatedElement';
import { scroller } from 'react-scroll';
import { getLogoUniversitasByShort } from '@/loader/StaticImages';
import { ButtonSimpleForwarded } from '@/component/Button';
// #endregion

// #region ICON DEPEDENCY
import { FiArrowRight } from "react-icons/fi";
// #endregion

// #region UTIL DEPEDENCY
import {
    replacePlaceholders,
    generateRandomNumber,
    generateRandomNumberFixedRange,
    generateRandomFloat,
} from '../utils';
// #endregion

/**
 * Props yang digunakan component `ScrollingItem`
 * @typedef {Object} ScrollingItemProps
 * @property {SupabaseTypes.UniversitasData} item
 * @property {boolean} isActive
 * Boolean apakah element aktif atau tidak dimana saat aktif akan mengganti `color`
 */

/**
 * Element pada scrolling container yang menampilkan logo universitas dengan nama universitas
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'> & ScrollingItemProps} props ScrollingItem props
 * @returns {React.ReactElement} Rendered component
 */
const ScrollingItem = ({ item, isActive, ...props }) => (
    <div className={`${styles.item} ${isActive ? styles.active : ''}`} {...props}>
        <div className={styles.logo}>
            {getLogoUniversitasByShort(item.short)}
        </div>
        <h3 className={styles.title_small}>
            {item.nama}
        </h3>
    </div>
)

/**
 * Components
 * @param {{universitas:Array<SupabaseTypes.UniversitasData>}} props Root props
 * @returns {React.ReactElement} Rendered component
 */
const Universitas = ({ universitas }) => {
    /** @type {React.MutableRefObject<HTMLDivElement>} */
    const sectionRef = React.useRef(null);
    const [activeUnivId, setActiveUnivId] = React.useState(0);
    /** @type {ReturnType<typeof React.useState<Array<Pick<AnimatedElementProps, 'timeframe' | 'animations'>>>>} */
    const [iconAnimProps, setIconAnimProps] = React.useState([]);

    const { width: viewportWidth, height: viewportHeight } = useWindowSize();
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end end"]
    });

    const sectionScrollProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const replacedDescription = replacePlaceholders(UNIVERSITAS_SECTION_DESCRIPTION, {
        jumlah_universitas: universitas.length
    })

    const generateIconAnimProps = () => {
        return Array.from({ length: universitas.length }, (_, index) => {
            if (index % 2 === 0) {
                return {
                    timeframe: [0.25, generateRandomFloat(0.8, 0.95)],
                    animations: {
                        z: [generateRandomNumberFixedRange(125, 250), 0],
                        scale: [generateRandomFloat(0.1, 1.25), 1],
                        opacity: [0, 1],
                        rotateX: [generateRandomNumber(-75, -35), 0],
                        rotateY: [generateRandomNumber(-45, 45), 0],
                    }
                }
            } else {
                return {
                    timeframe: [0.25, generateRandomFloat(0.8, 0.95)],
                    animations: {
                        z: [generateRandomNumberFixedRange(125, 250), 0],
                        scale: [generateRandomFloat(0.1, 1.25), 1],
                        opacity: [0, 1],
                        rotateX: [generateRandomNumber(35, 75), 0],
                        rotateY: [generateRandomNumber(-45, 45), 0],
                    }
                }
            }
        })
    }

    /** @param {React.KeyboardEvent} event */
    const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
            if (!event.shiftKey) {
                if (sectionRef.current && sectionRef.current.nextElementSibling) {
                    const focusableElements = Array.from(sectionRef.current.querySelectorAll('[tabIndex="0"]'));
                    const isLastFocusableElement = focusableElements[focusableElements.length - 1] === document.activeElement;
                    if (isLastFocusableElement) {
                        event.preventDefault();
                        scroller.scrollTo(sectionRef.current.nextElementSibling.id, { offset: -75, smooth: true });
                        sectionRef.current.nextElementSibling.focus();
                    }
                }
            }
        }
    }

    React.useEffect(() => {
        setIconAnimProps(generateIconAnimProps());
    }, []);

    let itemFlatIndex = -1;
    let itemIndex = 0;

    return (
        <motion.section
            ref={sectionRef}
            id={'universitas'}
            tabIndex={0}
            className={`${styles.section} ${styles.universitas} ${styles.center_overflow}`}
            whileInView={'inView'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
            onKeyDown={handleKeyDown}
        >
            <ContainerWrapper>
                <div className={styles.layout}>
                    <div className={styles.text}>
                        <AnimatedElement
                            as={'h2'}
                            className={styles.title}
                            timeframe={[0.1, 0.74]}
                            animations={{ y: [-40, 0], opacity: [0, 1] }}
                            scrollProgress={viewportWidth < 1024 ? null : sectionScrollProgress}
                            scrollProgressOptions={{ offset: ['start end', 'start 65%'] }}
                        >
                            {UNIVERSITAS_SECTION_TITLE}
                        </AnimatedElement>

                        <AnimatedElement
                            as={'p'}
                            className={styles.title_description}
                            timeframe={[0.25, 0.77]}
                            animations={{ opacity: [0, 1], y: [30, 0] }}
                            scrollProgress={viewportWidth < 1024 ? null : sectionScrollProgress}
                            scrollProgressOptions={{ offset: ['start end', 'start 65%'] }}
                        >
                            {replacedDescription}
                        </AnimatedElement>

                        <AnimatedElement
                            as={'div'}
                            className={styles.title_cta}
                            timeframe={[0.5, 0.8]}
                            animations={{ opacity: [0, 1], y: [50, 0] }}
                            scrollProgress={viewportWidth < 1024 ? null : sectionScrollProgress}
                            scrollProgressOptions={{ offset: ['start end', 'start 65%'] }}
                        >
                            <Link href={'/faq?tab=universitas'} passHref legacyBehavior>
                                <ButtonSimpleForwarded
                                    id='universitas-cta-sec'
                                    tabIndex={0}
                                    {...BUTTONSIMPLE_SECONDARY_PRESET}
                                >
                                    Pelajari Lebih Lanjut <FiArrowRight className={styles.arrow_right_icon} />
                                </ButtonSimpleForwarded>
                            </Link>

                            <Link href={'/users?action=daftar&utm_source=slp'} passHref legacyBehavior>
                                <ButtonSimpleForwarded
                                    id='universitas-cta-main'
                                    tabIndex={0}
                                    children={'Mulai Sekarang'}
                                    {...BUTTONSIMPLE_MAIN_PRESET}
                                >
                                    Mulai Sekarang <FiArrowRight className={styles.signup_icon} />
                                </ButtonSimpleForwarded>
                            </Link>
                        </AnimatedElement>
                    </div>

                    <div className={styles.content}>
                        {(iconAnimProps.length > 0) && UNIVERSITAS_ITEMS_LAYOUT.map((config, layoutIndex) => {
                            const currentItems = universitas.slice(itemIndex, itemIndex + config.count);
                            itemIndex += config.count;

                            /** @returns {React.CSSProperties} */
                            const resolveConfigStyle = () => {
                                const style = {};
                                if (config?.style && Object.keys(config.style).length > 0) {
                                    Object.entries(config.style).forEach(([key, val]) => {
                                        if (typeof val === 'function') style[key] = val(viewportWidth, viewportHeight);
                                        else style[key] = val;
                                    })
                                }

                                return style;
                            }

                            return (currentItems.length > 0) && (
                                <div key={layoutIndex} className={styles.icons} style={resolveConfigStyle()}>
                                    {currentItems.map((item, index) => {
                                        itemFlatIndex += 1;
                                        return (
                                            <AnimatedElement
                                                key={index}
                                                className={`${styles.icon} ${activeUnivId === item.id ? styles.active : ''}`}
                                                data-univshort={item.short.toLowerCase()}
                                                style={{
                                                    transformOrigin: '100% 200%'
                                                }}
                                                scrollProgress={viewportWidth < 1024 ? null : sectionScrollProgress}
                                                scrollProgressOptions={{ offset: ['start end', 'start 65%'] }}
                                                onClick={() => { setActiveUnivId(item.id) }}
                                                {...iconAnimProps[itemFlatIndex]}
                                            >
                                                {getLogoUniversitasByShort(item.short)}
                                            </AnimatedElement>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </ContainerWrapper>

            <motion.div
                initial={{ opacity: 0 }}
                variants={{
                    inView: { opacity: 1, transition: { duration: 2.5, ease: 'linear' } }
                }}
                className={styles.scrolling}
            >
                <div className={styles.items}>
                    <ScrollingCarousel
                        initialDirection={'left'}
                        useHoverEffect={false}
                        scrollEffectType={'reverse'}
                        contentGap={35}
                        contentRenderOffset={-1}
                        containerProps={{ style: { top: '50%', transform: 'translate(-50%, -50%)' } }}
                    >
                        {universitas.map((item, index) => (
                            <ScrollingItem
                                key={index}
                                item={item}
                                isActive={activeUnivId === item.id}
                                data-univshort={item.short.toLowerCase()}
                            />
                        ))}
                    </ScrollingCarousel>
                </div>

                <div className={styles.items}>
                    <ScrollingCarousel
                        initialDirection={'right'}
                        useHoverEffect={false}
                        scrollEffectType={'reverse'}
                        contentGap={35}
                        contentRenderOffset={-1}
                        containerProps={{ style: { top: '50%', transform: 'translate(-50%, -50%)' } }}
                    >
                        {universitas.map((item, index) => (
                            <ScrollingItem
                                key={index}
                                item={item}
                                isActive={activeUnivId === item.id}
                                data-univshort={item.short.toLowerCase()}
                            />
                        ))}
                    </ScrollingCarousel>
                </div>
            </motion.div>
        </motion.section>
    )
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
        gap: '0.4rem',
        padding: '0.6rem 0.85rem',
        borderRadius: '0.5rem',
        border: 'none',
        fontSize: 'inherit',
        fontWeight: 'inherit',
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
        gap: '0.4rem',
        padding: '0.6rem 0.85rem',
        borderRadius: '0.5rem',
        fontSize: 'inherit',
        fontWeight: 'inherit',
    }
}

export default Universitas;