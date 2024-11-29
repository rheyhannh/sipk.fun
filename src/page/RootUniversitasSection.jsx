'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { AnimatedElementProps } from './RootComponents';
// #endregion

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
    UNIVERSITAS_SECTION_TITLE,
    UNIVERSITAS_SECTION_DESCRIPTION,
    UNIVERSITAS_SECTION_BUTTON,
    UNIVERSITAS_ITEMS_LAYOUT,
} from './RootConfig';
// #endregion

// #region NEXT DEPEDENCY
import Image from 'next/image';
import Link, { LinkProps } from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useScroll, useSpring } from 'framer-motion';
import { AnimatedElement, ScrollingCarousel } from './RootComponents';
import { scroller } from 'react-scroll';
// #endregion

// #region ICON DEPEDENCY
import { FiExternalLink } from 'react-icons/fi';
// #endregion

// #region UTIL DEPEDENCY
import {
    replacePlaceholders,
    generateRandomNumber,
    generateRandomNumberFixedRange,
    generateRandomFloat,
} from './RootUtils';
// #endregion

/**
 * Props yang digunakan component `ButtonLink`
 * @typedef {Object} ButtonLinkProps
 * @property {React.ReactNode} [text]
 * Teks button
 * - Default `'Lorem'`
 * @property {'default' | 'secondary'} [type]
 * Tipe button yang digunakan
 * - Default : `'default'`
 * @property {boolean} [isOpenNewTab]
 * Boolean yang menyatakan apakah link dibuka di tab baru atau tidak.
 * Saat `true` akan menggunakan atribut target dengan nilai `_blank` dan menambahkan icon disamping teks
 * - Default : `false`
 */

/**
 * Button yang menggunakan component Link pada `next/link`
 * @param {Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps & ButtonLinkProps} props ButtonLink props
 * @returns {React.ReactElement} Rendered component
 */
const ButtonLink = ({ text = 'Lorem', type = 'default', isOpenNewTab, ...props }) => (
    <Link
        className={`${styles.btn} ${type === 'secondary' ? styles.secondary : ''}`}
        onClickCapture={(event) => { event.target.blur() }}
        {...(isOpenNewTab || false ? { target: '_blank' } : {})}
        {...props}
    >
        {text}
        {isOpenNewTab && (
            <FiExternalLink className={styles.external} />
        )}
    </Link>
)

/**
 * Components
 * @param {{universitas:Array<SupabaseTypes.UniversitasData>}} props Root props
 * @returns {React.ReactElement} Rendered component
 */
const Universitas = ({ universitas }) => {
    /** @type {React.MutableRefObject<HTMLDivElement>} */
    const sectionRef = React.useRef(null);
    const [iconAnimProps, setIconAnimProps] = React.useState([]);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end end"]
    });

    const sectionScrollProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const LogoUniversitas = ({ index = 0 }) => (
        <Image
            src={`/universitas/${universitas[index]?.assets?.logo ?? universitas[0]?.assets?.logo}`}
            alt={`Logo ${universitas[index]?.nama ?? universitas[0]?.nama}`}
            width={96}
            height={96}
        />
    )

    const ScrollingItem = ({ index }) => (
        <div className={styles.item}>
            <div className={styles.logo}>
                <Image
                    src={`/universitas/${universitas[index]?.assets?.logo ?? universitas[0]?.assets?.logo}`}
                    alt={`Logo ${universitas[index]?.nama ?? universitas[0]?.nama}`}
                    width={30}
                    height={30}
                />
            </div>
            <h3 className={styles.title_small}>
                {universitas[index]?.nama ?? universitas[0]?.nama}
            </h3>
        </div>
    )

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
        <section
            ref={sectionRef}
            id={'universitas'}
            tabIndex={0}
            className={`${styles.section} ${styles.universitas}`}
            onKeyDown={handleKeyDown}
        >
            <div className={styles.inner}>
                <div className={styles.layout}>
                    <div className={styles.text}>
                        <AnimatedElement
                            as={'h2'}
                            className={styles.title}
                            style={{ transformOrigin: '-25% -100%' }}
                            timeframe={[0.1, 0.74]}
                            animations={{
                                rotateX: [-65, 0],
                                rotateY: [35, 0],
                                opacity: [0, 1]
                            }}
                            scrollProgress={sectionScrollProgress}
                        >
                            {UNIVERSITAS_SECTION_TITLE}
                        </AnimatedElement>

                        <AnimatedElement
                            as={'p'}
                            className={styles.title_description}
                            timeframe={[0.25, 0.77]}
                            animations={{ opacity: [0, 1], y: [30, 0] }}
                            scrollProgress={sectionScrollProgress}
                        >
                            {replacedDescription}
                        </AnimatedElement>

                        <AnimatedElement
                            as={'div'}
                            className={styles.title_cta}
                            timeframe={[0.5, 0.8]}
                            animations={{ opacity: [0, 1], y: [50, 0] }}
                            scrollProgress={sectionScrollProgress}
                        >
                            {UNIVERSITAS_SECTION_BUTTON.map((props, index) => (
                                <ButtonLink key={index} {...props} />
                            ))}
                        </AnimatedElement>
                    </div>

                    <div className={styles.content}>
                        {(iconAnimProps.length > 0) && UNIVERSITAS_ITEMS_LAYOUT.map((config, layoutIndex) => {
                            const currentItems = universitas.slice(itemIndex, itemIndex + config.count);
                            itemIndex += config.count;

                            return (currentItems.length > 0) && (
                                <div key={layoutIndex} className={styles.icons} style={config.style}>
                                    {currentItems.map((_, index) => {
                                        itemFlatIndex += 1;
                                        return (
                                            <AnimatedElement
                                                key={index}
                                                className={styles.icon}
                                                style={{
                                                    transformOrigin: '100% 200%'
                                                }}
                                                scrollProgress={sectionScrollProgress}
                                                {...iconAnimProps[itemFlatIndex]}
                                            >
                                                <LogoUniversitas index={itemFlatIndex} />
                                            </AnimatedElement>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2.5, ease: 'linear' }}
                viewport={{
                    once: GLOBAL_VIEWPORT_ONCE,
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
                        {universitas.map((_, index) => (
                            <ScrollingItem key={index} index={index} />
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
                        {universitas.map((_, index) => (
                            <ScrollingItem key={index} index={index} />
                        ))}
                    </ScrollingCarousel>
                </div>
            </motion.div>

        </section>
    )
}

export default Universitas;