'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
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
// #endregion

// #region ICON DEPEDENCY
import { FiExternalLink } from 'react-icons/fi';
// #endregion

// #region UTIL DEPEDENCY
import { replacePlaceholders } from './RootUtils';
// #endregion

/**
 * Judul atau headline yang digunakan pada section `Universitas`
 * @type {string}
 */
const UNIVERSITAS_SECTION_TITLE = 'Untuk Siapa?';

/**
 * Deskripsi yang digunakan pada section `Universitas`. Dapat menggunakan placeholder berikut,
 * - `{jumlah_universitas}` : Jumlah universitas yang tersedia
 * @type {string}
 */

/**
 * Button yang ditampilkan pada section `Universitas`
 * @type {Array<Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps & ButtonLinkProps>}
 */
const UNIVERSITAS_SECTION_BUTTON = [
    { text: 'Pelajari Lebih Lanjut', type: 'secondary', href: 'https://medium.com', isOpenNewTab: true },
    { text: 'Mulai Sekarang', href: '/users?action=daftar', scroll: false }
]

const ButtonLink = ({ text = 'Lorem', type = 'default', isOpenNewTab, ...props }) => (
    <Link
        className={`${styles.btn} ${type === 'secondary' ? styles.secondary : ''}`}
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
    const sectionRef = React.useRef(null);
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
            <h2 className={styles.subtitle}>
                {universitas[index]?.nama ?? universitas[0]?.nama}
            </h2>
        </div>
    )

    return (
        <div ref={sectionRef} id={'universitas'} className={`${styles.section} ${styles.universitas}`}>
            <div className={styles.inner}>
                <div className={styles.layout}>
                    <div className={styles.text}>
                        <AnimatedElement
                            as={'h1'}
                            className={styles.title}
                            timeframe={[0.1, 0.74]}
                            animations={{
                                y: [-50, 0],
                                opacity: [0, 1]
                            }}
                            scrollProgress={sectionScrollProgress}
                        >
                            {UNIVERSITAS_SECTION_TITLE}
                        </AnimatedElement>

                        <AnimatedElement
                            as={'span'}
                            className={styles.description}
                            timeframe={[0.1, 0.77]}
                            animations={{
                                y: [50, 0],
                                opacity: [0, 1]
                            }}
                            scrollProgress={sectionScrollProgress}
                        >
                            {UNIVERSITAS_SECTION_DESCRIPTION}
                        </AnimatedElement>

                        <AnimatedElement
                            as={'div'}
                            className={styles.action}
                            timeframe={[0.1, 0.8]}
                            animations={{
                                y: [50, 0],
                                opacity: [0, 1]
                            }}
                            scrollProgress={sectionScrollProgress}
                        >
                            {UNIVERSITAS_SECTION_BUTTON.map((props, index) => (
                                <ButtonLink key={index} {...props} />
                            ))}
                        </AnimatedElement>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.icons}>
                            <AnimatedElement
                                className={styles.icon}
                                timeframe={[0.1, 0.74]}
                                animations={{
                                    scale: [1.15, 1],
                                    x: [-25, 0],
                                    y: [100, 0],
                                    opacity: [0, 1]
                                }}
                                scrollProgress={sectionScrollProgress}
                            >
                                <LogoUniversitas index={0} />
                            </AnimatedElement>
                        </div>
                        <div className={styles.icons}>
                            <AnimatedElement
                                className={styles.icon}
                                timeframe={[0.1, 0.62]}
                                animations={{
                                    scale: [1.25, 1],
                                    x: [-35, 0],
                                    y: [-30, 0],
                                    opacity: [0, 1]
                                }}
                                scrollProgress={sectionScrollProgress}
                            >
                                <LogoUniversitas index={1} />
                            </AnimatedElement>
                            <AnimatedElement
                                className={styles.icon}
                                timeframe={[0.1, 0.68]}
                                animations={{
                                    y: [150, 0],
                                    scale: [0.45, 1],
                                    opacity: [0, 1]
                                }}
                                scrollProgress={sectionScrollProgress}
                            >
                                <LogoUniversitas index={2} />
                            </AnimatedElement>
                            <AnimatedElement
                                className={styles.icon}
                                timeframe={[0.1, 0.75]}
                                animations={{
                                    scale: [0.15, 1],
                                    x: [15, 0],
                                    y: [155, 0],
                                    opacity: [0, 1]
                                }}
                                scrollProgress={sectionScrollProgress}
                            >
                                <LogoUniversitas index={3} />
                            </AnimatedElement>
                        </div>
                        <div className={styles.icons}>
                            <AnimatedElement
                                className={styles.icon}
                                timeframe={[0.1, 0.77]}
                                animations={{
                                    scale: [1.15, 1],
                                    y: [-45, 0],
                                    opacity: [0, 1]
                                }}
                                scrollProgress={sectionScrollProgress}
                            >
                                <LogoUniversitas index={4} />
                            </AnimatedElement>
                            <AnimatedElement
                                className={styles.icon}
                                timeframe={[0.1, 0.75]}
                                animations={{
                                    y: [150, 0],
                                    scale: [0.25, 1],
                                    opacity: [0, 1]
                                }}
                                scrollProgress={sectionScrollProgress}
                            >
                                <LogoUniversitas index={5} />
                            </AnimatedElement>
                        </div>
                        <div className={styles.icons}>
                            <AnimatedElement
                                className={styles.icon}
                                timeframe={[0.1, 0.72]}
                                animations={{
                                    scale: [1.1, 1],
                                    y: [-55, 0],
                                    opacity: [0, 1]
                                }}
                                scrollProgress={sectionScrollProgress}
                            >
                                <LogoUniversitas index={6} />
                            </AnimatedElement>
                            <AnimatedElement
                                className={styles.icon}
                                timeframe={[0.1, 0.58]}
                                animations={{
                                    y: [150, 0],
                                    scale: [0.5, 1],
                                    opacity: [0, 1]
                                }}
                                scrollProgress={sectionScrollProgress}
                            >
                                <LogoUniversitas index={7} />
                            </AnimatedElement>
                            <AnimatedElement
                                className={styles.icon}
                                timeframe={[0.1, 0.65]}
                                animations={{
                                    y: [150, 0],
                                    scale: [0.1, 1],
                                    opacity: [0, 1]
                                }}
                                scrollProgress={sectionScrollProgress}
                            >
                                <LogoUniversitas index={8} />
                            </AnimatedElement>
                        </div>
                        <div className={styles.icons}>
                            <AnimatedElement
                                className={styles.icon}
                                timeframe={[0.1, 0.79]}
                                animations={{
                                    scale: [0.45, 1],
                                    y: [150, 0],
                                    x: [25, 0],
                                    opacity: [0, 1]
                                }}
                                scrollProgress={sectionScrollProgress}
                            >
                                <LogoUniversitas index={9} />
                            </AnimatedElement>
                        </div>
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

        </div>
    )
}

export default Universitas;