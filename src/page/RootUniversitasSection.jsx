'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
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
import { useScroll, useSpring } from 'framer-motion';
import { AnimatedElement } from './RootComponents';
// #endregion

// #region ICON DEPEDENCY
import { FiExternalLink } from 'react-icons/fi';
// #endregion

const UNIVERSITAS_SECTION_TITLE = 'Untuk Siapa?';
const UNIVERSITAS_SECTION_DESCRIPTION = 'Saat ini, SIPK tersedia untuk mahasiswa dari 10 universitas yang didukung. Apapun jurusan atau program pendidikanmu, selama universitasmu ada dalam daftar, kamu bisa menggunakan SIPK.';
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
        offset: ['end end', '0.7 0.7']
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

    return (
        <div ref={sectionRef} id={'universitas'} className={`${styles.section} ${styles.universitas}`}>
            <div className={styles.text}>
                <AnimatedElement
                    as={'h1'}
                    className={styles.title}
                    timeframe={[0, 0.84]}
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
                    timeframe={[0, 0.87]}
                    animations={{
                        y: [100, 0],
                        opacity: [0, 1]
                    }}
                    scrollProgress={sectionScrollProgress}
                >
                    {UNIVERSITAS_SECTION_DESCRIPTION}
                </AnimatedElement>

                <AnimatedElement
                    as={'a'}
                    className={styles.action}
                    timeframe={[0, 0.9]}
                    animations={{
                        y: [100, 0],
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
                        timeframe={[0, 0.84]}
                        animations={{
                            scale: [1.15, 1],
                            x: [-25, 0],
                            y: [100, 0]
                        }}
                        scrollProgress={sectionScrollProgress}
                    >
                        <LogoUniversitas index={0} />
                    </AnimatedElement>
                </div>
                <div className={styles.icons}>
                    <AnimatedElement
                        className={styles.icon}
                        timeframe={[0, 0.72]}
                        animations={{
                            scale: [1.25, 1],
                            x: [-35, 0],
                            y: [-30, 0]
                        }}
                        scrollProgress={sectionScrollProgress}
                    >
                        <LogoUniversitas index={1} />
                    </AnimatedElement>
                    <AnimatedElement
                        className={styles.icon}
                        timeframe={[0, 0.78]}
                        animations={{
                            y: [150, 0],
                            scale: [0.45, 1]
                        }}
                        scrollProgress={sectionScrollProgress}
                    >
                        <LogoUniversitas index={2} />
                    </AnimatedElement>
                    <AnimatedElement
                        className={styles.icon}
                        timeframe={[0, 0.85]}
                        animations={{
                            scale: [0.15, 1],
                            x: [15, 0],
                            y: [155, 0]
                        }}
                        scrollProgress={sectionScrollProgress}
                    >
                        <LogoUniversitas index={3} />
                    </AnimatedElement>
                </div>
                <div className={styles.icons}>
                    <AnimatedElement
                        className={styles.icon}
                        timeframe={[0, 0.87]}
                        animations={{
                            scale: [1.15, 1],
                            y: [-45, 0]
                        }}
                        scrollProgress={sectionScrollProgress}
                    >
                        <LogoUniversitas index={4} />
                    </AnimatedElement>
                    <AnimatedElement
                        className={styles.icon}
                        timeframe={[0, 0.85]}
                        animations={{
                            y: [150, 0],
                            scale: [0.25, 1]
                        }}
                        scrollProgress={sectionScrollProgress}
                    >
                        <LogoUniversitas index={5} />
                    </AnimatedElement>
                </div>
                <div className={styles.icons}>
                    <AnimatedElement
                        className={styles.icon}
                        timeframe={[0, 0.82]}
                        animations={{
                            scale: [1.1, 1],
                            y: [-55, 0]
                        }}
                        scrollProgress={sectionScrollProgress}
                    >
                        <LogoUniversitas index={6} />
                    </AnimatedElement>
                    <AnimatedElement
                        className={styles.icon}
                        timeframe={[0, 0.68]}
                        animations={{
                            y: [150, 0],
                            scale: [0.5, 1]
                        }}
                        scrollProgress={sectionScrollProgress}
                    >
                        <LogoUniversitas index={7} />
                    </AnimatedElement>
                    <AnimatedElement
                        className={styles.icon}
                        timeframe={[0, 0.75]}
                        animations={{
                            y: [150, 0],
                            scale: [0.1, 1]
                        }}
                        scrollProgress={sectionScrollProgress}
                    >
                        <LogoUniversitas index={8} />
                    </AnimatedElement>
                </div>
                <div className={styles.icons}>
                    <AnimatedElement
                        className={styles.icon}
                        timeframe={[0, 0.89]}
                        animations={{
                            scale: [0.45, 1],
                            y: [150, 0],
                            x: [25, 0]
                        }}
                        scrollProgress={sectionScrollProgress}
                    >
                        <LogoUniversitas index={9} />
                    </AnimatedElement>
                </div>
            </div>
        </div>
    )
}

export default Universitas;