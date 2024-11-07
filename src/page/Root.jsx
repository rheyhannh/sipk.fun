'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { HTMLMotionProps, MotionStyle, MotionValue } from 'framer-motion';
import { MatkulDummiesProps } from '@/component/landing/variables/MatkulDummies';
// #endregion

// #region NEXT DEPEDENCY
import Image from 'next/image';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import { useLocalTheme } from '@/data/core';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { SummaryDummy, HistoryDummy, ProgressDummy } from '@/component/Card';
import { LogoImage } from '@/component/Main';
import Link from '@/component/Link';
import HighlightText from '@/component/motion/HighlightText';
import ThemeChanger from '@/component/_test/ThemeChanger';
import {
    MatkulDummies,
    MatkulDummiesNilaiBobot,
    MatkulDummiesNilaiColorPreset
} from '@/component/landing/variables/MatkulDummies';
// #endregion

// #region ICON DEPEDENCY
import { FaTelegram, FaLinkedin, FaTiktok } from 'react-icons/fa';
// #endregion

/**
 * Render root page `'/'`
 * @param {{universitas:Array<SupabaseTypes.UniversitasData>, rating:Array<SupabaseTypes.RatingData>, notifikasi:Array<SupabaseTypes.NotifikasiData>}} props Root props
 * @returns {React.ReactElement} Rendered root page
 */
export default function Root({ universitas, rating, notifikasi }) {
    return (
        <>
            <Container>
                <Feature />
                <Tentang />
                <CaraPakai />
                <Universitas universitas={universitas} />
                <MulaiSekarang />
            </Container>
            <MainFooter />
        </>
    )
}

const Container = ({ children }) => (
    <div className={styles.container}>
        {children}
    </div>
)

const Feature = () => {
    const scrollRef = React.useRef(null);
    const { scrollXProgress: scrollProgress } = useScroll({ container: scrollRef });

    return (
        <div
            className={`${styles.section} ${styles.features}`}
            style={{
                border: '2.5px solid pink'
            }}
        >
            <div
                className={styles.title}
                style={{
                    border: '1px solid red',
                }}
            >
                Connect. Learn. Earn
            </div>

            <div
                className={styles.description}
                style={{
                    border: '1px solid green',
                }}
            >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat aliquam quasi deleniti tempore eum fuga atque, modi quisquam aliquid corrupti!
            </div>

            <ScrollableElement scrollRef={scrollRef} />

            <div
                className={styles.content}
                style={{ position: 'relative' }}
            >
                <div className={styles.cards} style={{ perspective: '750px' }}>
                    <AnimatedElement
                        style={{ transformStyle: 'preserve-3d' }}
                        timeframe={[0.25, 0.5, 0.75, 1]}
                        animations={{
                            rotateX: ['25deg', '0deg', '0deg', '-25deg'],
                            rotateY: ['-10deg', '0deg', '0deg', '10deg'],
                            translateZ: ['15px', '0px', '0px', '-15px'],
                            scale: [0.75, 1, 1, 0.75],
                            opacity: [0, 1, 1, 0],
                            x: [-50, 0, 0, -50],
                            y: [75, 0, 0, -75]
                        }}
                        scrollProgress={scrollProgress}
                        variants={{
                            onHover: {
                                rotateX: '25deg',
                                rotateY: '-10deg',
                                translateX: '-5px',
                                translateY: '15px',
                                translateZ: '15px',
                                transition: {
                                    type: 'spring', duration: 0.75
                                }
                            },
                        }}
                    // whileHover={'onHover'}
                    >
                        <SummaryDummy
                            title={'SKS'}
                            color='var(--danger-color)'
                            icon={{ name: 'MdOutlineConfirmationNumber', lib: 'md' }}
                            data={{ value: 76, percentage: 52, keterangan: 'Targetmu 144' }}
                            style={{ marginTop: '0', boxShadow: 'none', transition: 'none' }}
                        />
                    </AnimatedElement>

                    <AnimatedElement
                        style={{ transformStyle: 'preserve-3d' }}
                        timeframe={[0, 0.25, 0.5, 0.75]}
                        animations={{
                            rotateX: ['30deg', '0deg', '0deg', '-30deg'],
                            translateZ: ['25px', '0px', '0px', '-25px'],
                            scale: [0.75, 1, 1, 0.75],
                            y: [75, 0, 0, -75],
                            opacity: [0, 1, 1, 0]
                        }}
                        scrollProgress={scrollProgress}
                        variants={{
                            onHover: {
                                rotateX: '30deg',
                                translateY: '15px',
                                translateZ: '25px',
                                transition: {
                                    type: 'spring', duration: 0.75
                                }
                            },
                        }}
                    // whileHover={'onHover'}
                    >
                        <SummaryDummy
                            title={'Matakuliah'}
                            color='var(--warning-color)'
                            icon={{ name: 'IoBookOutline', lib: 'io5' }}
                            data={{ value: 31, percentage: 62, keterangan: 'Targetmu 50' }}
                            style={{ marginTop: '0', boxShadow: 'none' }}
                        />
                    </AnimatedElement>

                    <AnimatedElement
                        style={{ transformStyle: 'preserve-3d' }}
                        timeframe={[0.25, 0.5, 0.75, 1]}
                        animations={{
                            rotateX: ['25deg', '0deg', '0deg', '-25deg'],
                            rotateY: ['10deg', '0deg', '0deg', '-10deg'],
                            translateZ: ['15px', '0px', '0px', '-15px'],
                            scale: [0.75, 1, 1, 0.75],
                            opacity: [0, 1, 1, 0],
                            x: [50, 0, 0, 50],
                            y: [75, 0, 0, -75]
                        }}
                        scrollProgress={scrollProgress}
                        variants={{
                            onHover: {
                                rotateX: '25deg',
                                rotateY: '10deg',
                                translateX: '5px',
                                translateY: '15px',
                                translateZ: '15px',
                                transition: {
                                    type: 'spring', duration: 0.75
                                }
                            },
                        }}
                    // whileHover={'onHover'}
                    >
                        <SummaryDummy
                            title={'IPK'}
                            color='var(--success-color)'
                            icon={{ name: 'FaRegStar', lib: 'fa' }}
                            data={{ value: 3.27, percentage: 87, keterangan: 'Targetmu 3.75' }}
                            style={{ marginTop: '0', boxShadow: 'none' }}
                        />
                    </AnimatedElement>
                </div>
            </div>
        </div>
    )
}

const ScrollableElement = ({ scrollRef }) => (
    <div
        ref={scrollRef}
        className={styles.nav}
        style={{
            border: '1px solid purple',
            overflowX: 'scroll',
            padding: '1rem 2rem',
        }}
    >
        <div
            style={{
                width: '3000px',
                height: '30px',
                border: '1px solid aqua',
            }}
        />
    </div>
)

/**
 * Props yang digunakan component `AnimatedElement`
 * @typedef {Object} AnimatedElementProps
 * @property {keyof motion} [as]
 * Tag element motion yang digunakan
 * - Default : `'div'`
 * @property {Array<number>} timeframe
 * Array yang mendeskripsikan sebuah titik kapan animasi tertentu harus sampai mencapai nilai sekian pada timeframe tersebut.
 * 
 * Jumlah array harus sama seperti setiap nilai dari setiap atribut pada props `animations`. Lihat contoh berikut,
 * 
 * ```js
 * const timeframe = [0, 0.5, 1]
 * const animations = {
 *      x : [-150, 0, 250],
 *      y : [-100, 25, 100],
 * }
 * ```
 * @property {boolean} invertTimeframe
 * Lorem
 * - Default : `false`
 * @property {MotionStyle} animations
 * Object yang mendeskripsikan animasi yang digunakan dimana key sebagai css atribut yang ingin dianimasikan bernilai dengan
 * array yang mengambarkan bagaimana animasi dimainkan. 
 * 
 * Jumlah array harus sama seperti jumlah array yang digunakan pada props `timeframe`. Lihat contoh berikut,
 * 
 * ```js
 * const timeframe = [0, 0.5, 1]
 * const animations = {
 *      x : [-150, 0, 250],
 *      y : [-100, 25, 100],
 * }
 * ```
 * @property {MotionValue<number>} scrollProgress
 * Scroll progress dari sebuah element atau container yang diresolve menggunakan hook `useScroll`
 * 
 * ```js
 * const { scrollXProgress: scrollProgress } = useScroll({ container: scrollRef });
 * ```
 */

/**
 * Component wrapper untuk memberikan animasi pada timeframe tertentu berdasarkan scroll progress dari sebuah element atau container
 * @template [T='div']
 * @param {{as:T} & HTMLMotionProps<T> & AnimatedElementProps} props AnimatedElement props
 * @returns {React.ReactElement} Rendered component
 */
const AnimatedElement = ({
    as: Tag = 'div',
    timeframe,
    animations,
    scrollProgress,
    style,
    children,
    ...props
}) => {
    const MotionTag = motion[Tag] ?? motion.div;
    const animationsHook = {};

    Object.entries(animations).forEach(([key, value]) => {
        animationsHook[key] = useTransform(scrollProgress, timeframe, value);
    })

    return (
        <MotionTag
            {...props}
            style={{
                ...style,
                ...animationsHook
            }}
        >
            {children}
        </MotionTag>
    )
}

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
        <div
            ref={sectionRef}
            id={'universitas'}
            className={`${styles.section} ${styles.universitas}`}
            style={{
                border: '2.5px solid pink'
            }}
        >
            <div className={styles.text}>
                <h1 className={styles.title}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </h1>

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
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad earum suscipit cumque consequuntur consequatur incidunt sit ducimus dicta quo voluptatum.
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
                    Lorem, ipsum dolor.
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

const layoutTransition = {
    layout: { type: 'spring', duration: 1, bounce: 0.3 }
}

const defaultMatakuliah = [
    {
        "id": "f3333a6c-e739-4039-9be0-3ed06c28aed5",
        "nama": "Etika Profesi",
        "semester": 7,
        "sks": 2,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 8
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696032,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "b21fcfb6-028c-4e66-8838-d50e667482b4",
        "nama": "Gerbang Logika Terprogram",
        "semester": 5,
        "sks": 3,
        "nilai": {
            "indeks": "B",
            "bobot": 3,
            "akhir": 9
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696048,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "14443651-1c0c-4143-b591-bccbd362b072",
        "nama": "Jaringan Komputer",
        "semester": 3,
        "sks": 4,
        "nilai": {
            "indeks": "B",
            "bobot": 3,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696056,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "b6993d1f-7dbe-4578-b308-37399692b53e",
        "nama": "Keamanan Komputer",
        "semester": 3,
        "sks": 3,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696064,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "6531b7a9-e260-4a49-90c0-44b16b2add67",
        "nama": "Kewirausahaan",
        "semester": 2,
        "sks": 2,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 8
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696072,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "84684e05-a397-4e28-925d-3fdef6a44c62",
        "nama": "Komputasi Citra Digital",
        "semester": 4,
        "sks": 3,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696080,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "b37c15e3-cf4d-4372-931f-1e942bb1d306",
        "nama": "Matematika Komputasi",
        "semester": 7,
        "sks": 3,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696096,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "e18df55f-079b-4ef5-8c4f-71760bcd0c4f",
        "nama": "Matematika Komputasi Lanjut",
        "semester": 5,
        "sks": 4,
        "nilai": {
            "indeks": "B",
            "bobot": 3,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696104,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "66c14754-c52b-4702-b828-408b236272c7",
        "nama": "Metode Numerik",
        "semester": 8,
        "sks": 3,
        "nilai": {
            "indeks": "B+",
            "bobot": 3.5,
            "akhir": 10.5
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696113,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "46a8b683-c253-4f75-be55-a466dddf6488",
        "nama": "Metodologi Penelitian dan Penulisan Ilmiah",
        "semester": 7,
        "sks": 3,
        "nilai": {
            "indeks": "D+",
            "bobot": 1.5,
            "akhir": 4.5
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696121,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "d91031bc-746c-406f-a744-046fee5a8c44",
        "nama": "Pancasila",
        "semester": 3,
        "sks": 2,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 8
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696129,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "c872e89a-63ab-4383-b61e-13964cdef39e",
        "nama": "Pemrograman Dasar",
        "semester": 1,
        "sks": 5,
        "nilai": {
            "indeks": "B",
            "bobot": 3,
            "akhir": 15
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "B",
            "bobot": 3
        },
        "created_at": 1723696137,
        "updated_at": 1725350257,
        "deleted_at": null
    },
    {
        "id": "c586ce67-b2ff-46ac-942f-89c683eef49a",
        "nama": "Pemrograman Lanjut",
        "semester": 1,
        "sks": 5,
        "nilai": {
            "indeks": "C+",
            "bobot": 2.5,
            "akhir": 12.5
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "C+",
            "bobot": 2.5
        },
        "created_at": 1723696145,
        "updated_at": 1725350295,
        "deleted_at": null
    },
    {
        "id": "53a8ccf0-6651-4fd3-b0a2-da67e67d3a9a",
        "nama": "Pemrosesan Sinyal",
        "semester": 4,
        "sks": 3,
        "nilai": {
            "indeks": "B+",
            "bobot": 3.5,
            "akhir": 10.5
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696153,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "d2be1dac-f318-45cd-be94-8bdc5850d52a",
        "nama": "Pemrosesan Suara",
        "semester": 8,
        "sks": 3,
        "nilai": {
            "indeks": "B+",
            "bobot": 3.5,
            "akhir": 10.5
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696161,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "af123916-4a96-461b-9333-8030c2a283c8",
        "nama": "Pendidikan Agama Islam",
        "semester": 6,
        "sks": 2,
        "nilai": {
            "indeks": "B",
            "bobot": 3,
            "akhir": 6
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696169,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "2657539f-6663-400b-ae91-efed1159b811",
        "nama": "Pendidikan Kewarganegaraan",
        "semester": 7,
        "sks": 2,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 8
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696177,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "d407b9e7-33c6-45a9-a41d-66459455e58d",
        "nama": "Pengantar Ilmu Komputer",
        "semester": 6,
        "sks": 3,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696185,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "111174a6-2fec-4dd5-a33c-2f156c85040b",
        "nama": "Perangkat Bergerak",
        "semester": 1,
        "sks": 2,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 8
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696193,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "a965ea2e-c4d3-4be6-bbe1-03f8631b8a05",
        "nama": "Praktik Kerja Lapangan",
        "semester": 8,
        "sks": 4,
        "nilai": {
            "indeks": "B+",
            "bobot": 3.5,
            "akhir": 14
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696201,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "f1f3c6af-6855-4813-aec3-e396e8d9b2d8",
        "nama": "Rangkaian dan Elektronika",
        "semester": 3,
        "sks": 3,
        "nilai": {
            "indeks": "C+",
            "bobot": 2.5,
            "akhir": 7.5
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696213,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "680d00ec-0d5f-47d8-8226-f2c921c6b46a",
        "nama": "Rangkaian dan Elektronika Lanjut",
        "semester": 8,
        "sks": 4,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 16
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696221,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "b45aaa44-2edf-48e1-a11b-711761743693",
        "nama": "Rekayasa Sistem Komputer",
        "semester": 1,
        "sks": 3,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696229,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "1588de9f-dcd5-4240-a89f-0736b52863cc",
        "nama": "Sensor dan Aktuator",
        "semester": 2,
        "sks": 3,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696237,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "7c2468a8-9ba1-46fa-8235-1eaf9239f62d",
        "nama": "Sistem Cerdas",
        "semester": 8,
        "sks": 3,
        "nilai": {
            "indeks": "B+",
            "bobot": 3.5,
            "akhir": 10.5
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696245,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "b25a71e1-6d2d-4c7a-89b7-be35f84cf5ac",
        "nama": "Sistem Digital",
        "semester": 5,
        "sks": 4,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 16
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696253,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "2c5594a3-c598-433a-b769-c0066f7d182f",
        "nama": "Sistem Kendali",
        "semester": 6,
        "sks": 3,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696261,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "480b7d7f-5d5a-4573-b605-f4c03500497b",
        "nama": "Sistem Linier",
        "semester": 5,
        "sks": 3,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696277,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "42d7d50e-59aa-4fd2-83b2-9e87a2a52301",
        "nama": "Sistem Medis Berbasis Komputer",
        "semester": 5,
        "sks": 3,
        "nilai": {
            "indeks": "B+",
            "bobot": 3.5,
            "akhir": 10.5
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696285,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "c701d4d2-a3ef-4ac2-9592-d08ee021dc46",
        "nama": "Sistem Mikrokontroller",
        "semester": 6,
        "sks": 4,
        "nilai": {
            "indeks": "B+",
            "bobot": 3.5,
            "akhir": 14
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696293,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "3b698857-db9d-4b5f-a6bc-7a125d85494f",
        "nama": "Sistem Operasi",
        "semester": 8,
        "sks": 4,
        "nilai": {
            "indeks": "C+",
            "bobot": 2.5,
            "akhir": 10
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696301,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "10427f7b-d78a-4b2d-8bac-438e3d80ce79",
        "nama": "Sistem Pengenalan Pola",
        "semester": 8,
        "sks": 3,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696309,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "27fb96d9-dace-4ad9-8485-8ebc823badf6",
        "nama": "Statistika",
        "semester": 3,
        "sks": 3,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1723696317,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "2391b986-7663-4079-bcb6-0a6dbad4d702",
        "nama": "Administrasi Jaringan",
        "semester": 2,
        "sks": 3,
        "nilai": {
            "indeks": "C",
            "bobot": 2,
            "akhir": 6
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "D+",
            "bobot": 1.5
        },
        "created_at": 1724992926,
        "updated_at": 1725350361,
        "deleted_at": null
    },
    {
        "id": "545477f6-b72b-4c05-ac80-df2b6659c05e",
        "nama": "Algoritma dan Struktur Data",
        "semester": 2,
        "sks": 4,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 16
        },
        "dapat_diulang": false,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1725072654,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "20ba8487-5fae-4805-8e37-0b040cd4340e",
        "nama": "Analisis Sistem Komputer dan Jaringan",
        "semester": 6,
        "sks": 3,
        "nilai": {
            "indeks": "B",
            "bobot": 3,
            "akhir": 9
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1725073929,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "d965bd8f-156b-4bec-8056-b399d0d24f89",
        "nama": "Arsitektur dan Organisasi Komputer",
        "semester": 2,
        "sks": 3,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1725074018,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "f65923e2-e3e6-4d33-b2f9-8104df45b52e",
        "nama": "Arsitektur dan Organisasi Komputer Lanjut",
        "semester": 6,
        "sks": 4,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 16
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1725074098,
        "updated_at": 1725074110,
        "deleted_at": null
    },
    {
        "id": "ed02fd1c-9d2a-457a-a71a-ecaa393cbf52",
        "nama": "Bahasa Indonesia",
        "semester": 8,
        "sks": 2,
        "nilai": {
            "indeks": "A",
            "bobot": 4,
            "akhir": 8
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1725135363,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "7978128a-d7fe-4931-af08-1b796d97d6f0",
        "nama": "Bahasa Inggris",
        "semester": 2,
        "sks": 2,
        "nilai": {
            "indeks": "B+",
            "bobot": 3.5,
            "akhir": 7
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1725135480,
        "updated_at": 1726067337,
        "deleted_at": null
    },
    {
        "id": "6d8f2f4b-ac53-4dfa-a60f-17171d8d5fef",
        "nama": "Basis Data Terapan",
        "semester": 6,
        "sks": 3,
        "nilai": {
            "indeks": "C+",
            "bobot": 2.5,
            "akhir": 7.5
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1726054167,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "d3da0e24-5675-45b0-a272-2c6c1642cea9",
        "nama": "Komunikasi Data",
        "semester": 6,
        "sks": 3,
        "nilai": {
            "indeks": "B",
            "bobot": 3,
            "akhir": 9
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1726326844,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "c86de07b-8790-401e-bef8-b8fc7c089f21",
        "nama": "Embedded System",
        "semester": 7,
        "sks": 4,
        "nilai": {
            "indeks": "B",
            "bobot": 3,
            "akhir": 12
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "A",
            "bobot": 4
        },
        "created_at": 1730598280,
        "updated_at": null,
        "deleted_at": null
    },
    {
        "id": "5fbd3551-9b02-43ba-811f-af6cda382fec",
        "nama": "Wireless Sensor Network",
        "semester": 1,
        "sks": 3,
        "nilai": {
            "indeks": "B+",
            "bobot": 3.5,
            "akhir": 10.5
        },
        "dapat_diulang": true,
        "owned_by": "e2b6a96a-c9c6-4cb8-a8c1-8ec27fc0c12c",
        "target_nilai": {
            "indeks": "B",
            "bobot": 3
        },
        "created_at": 1730598450,
        "updated_at": null,
        "deleted_at": null
    }
]

const defaultPenilaian = {
    "A": {
        "cat": "Sangat baik",
        "style": "success",
        "weight": 4
    },
    "B+": {
        "cat": "Antara sangat baik dan baik",
        "style": "success",
        "weight": 3.5
    },
    "B": {
        "cat": "Baik",
        "style": "warning",
        "weight": 3
    },
    "C+": {
        "cat": "Antara baik dan cukup",
        "style": "warning",
        "weight": 2.5
    },
    "C": {
        "cat": "Cukup",
        "style": "danger",
        "weight": 2
    },
    "D+": {
        "cat": "Antara cukup dan kurang",
        "style": "danger",
        "weight": 1.5
    },
    "D": {
        "cat": "Kurang",
        "style": "crimson",
        "weight": 1
    },
    "E": {
        "cat": "Sangat kurang",
        "style": "crimson",
        "weight": 0
    }
}

const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomFloat = (min, max) => {
    const randomFloat = Math.random() * (max - min) + min;
    return Math.round(randomFloat * 100) / 100;
};

const calculatePercentage = (value, target) => {
    const percentage = Math.round((value / target) * 100);
    return Math.min(percentage, 100);
};

/**
 * Props yang digunakan component `Content`
 * @typedef {Object} ContentProps
 * @property {string} activeContent
 * Nomor content yang sedang aktif dalam string dengan format seperti contoh berikut,
 * - Contoh : `'active_1'`, `'active_4'`
 */

/**
 * Component sebagai layout untuk menampilkan content
 * @param {HTMLMotionProps<'div'> & ContentProps} props Content props
 * @returns {React.ReactElement} Rendered component
 */
const Content = ({ activeContent, children, ...props }) => {
    const transition = {
        type: 'spring',
        ease: 'linear',
        duration: 2.5,
        bounce: 0,
        opacity: { duration: 1 },
        ...layoutTransition
    }

    return (
        <motion.div
            className={`${styles.content} ${styles[activeContent]}`}
            layout
            initial={{ x: '100%', opacity: 0 }}
            whileInView={{ x: '0%', opacity: 1, transition: { ...transition, delay: 0.25 } }}
            transition={transition}
            {...props}
        >
            {children}
        </motion.div>
    )
}

const Wrapper = ({ children, ...props }) => (
    <motion.div className={styles.wrapper} layout transition={{ ...layoutTransition }} {...props}>
        {children}
    </motion.div>
)

const Box = ({ type = 'x', children }) => (
    <motion.div className={`${styles.box} ${styles[type]}`} layout transition={{ ...layoutTransition }}>
        {children}
    </motion.div>
)

/**
 * Props yang digunakan component `BoxContentX`
 * @typedef {Object} BoxContentXProps
 * @property {Array<MatkulDummiesProps>} [data]
 * @property {Object} penilaian
 * @property {typeof MatkulDummiesNilaiColorPreset} penilaian.style
 * @property {typeof MatkulDummiesNilaiBobot} penilaian.bobot
 * @property {number} [maxSemester]
 * Jumlah maksimum semester untuk perulangan animasi
 * - Default : `8`
 */

/**
 * Component yang dibungkus dengan `forwardRef` untuk menampilkan content yang tampil pada `Box` dengan type `x`
 * @type {React.FC<HTMLMotionProps<'div'> & BoxContentXProps>}
 */
const BoxContentX = React.forwardRef(({
    data = MatkulDummies,
    penilaian = { style: MatkulDummiesNilaiColorPreset, bobot: MatkulDummiesNilaiBobot },
    maxSemester = 8,
    ...props
}, ref) => {
    /** @type {ReturnType<typeof React.useState<Array<Array<MatkulDummiesProps>>>>} */
    const [matkul, setMatkul] = React.useState(Array.from({ length: maxSemester }, () => []));
    /** @type {ReturnType<typeof React.useState<Array<MatkulDummiesProps>>>} */
    const [addedMatkul, setAddedMatkul] = React.useState([]);
    const [activeMatkulIndex, setActiveMatkulIndex] = React.useState(0);
    const [total, setTotal] = React.useState({ ipk: 0, sks: 0, matkul: 0 });

    const generateMatkulSections = (sourceArr = [...data], maxSections = maxSemester, random = { min: 2, max: 4 }) => {
        const { min, max } = random;

        for (let i = sourceArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sourceArr[i], sourceArr[j]] = [sourceArr[j], sourceArr[i]];
        }

        const result = [];
        let index = 0;

        while (index < sourceArr.length && result.length < maxSections) {
            const randomLength = Math.floor(Math.random() * (max - min + 1)) + min;
            result.push(sourceArr.slice(index, index + randomLength));
            index += randomLength;
        }

        while (result.length < maxSections) {
            result.push([]);
        }

        return result;
    }

    const calculateTotal = () => {
        const totalMatkul = addedMatkul.length;
        const { totalSks } = addedMatkul.reduce((sum, current) => {
            return {
                totalSks: sum.totalSks + current.sks,
            };
        }, { totalSks: 0 }
        );
        const { totalNilaiAkhir } = addedMatkul.reduce((sum, current) => {
            const { nama, sks, nilai: indeksNilai } = current;
            const bobot = penilaian.bobot[indeksNilai];
            return {
                totalNilaiAkhir: sum.totalNilaiAkhir + (sks * bobot),
            };
        }, { totalNilaiAkhir: 0 }
        );

        const totalIpk = Math.round((totalNilaiAkhir / totalSks) * 100) / 100;

        setTotal({ sks: totalSks, matkul: totalMatkul, ipk: totalIpk });
    }

    React.useEffect(() => {
        calculateTotal();
    }, [addedMatkul]);

    React.useEffect(() => {
        const initialTimeout = setTimeout(() => {
            setActiveMatkulIndex(x => x + 1);

            const interval = setInterval(() => {
                setActiveMatkulIndex((prevIndex) => {
                    if (prevIndex >= maxSemester) {
                        clearInterval(interval);
                    }
                    return prevIndex + 1;
                })
            }, 5000);

            return () => clearInterval(interval);
        }, 3000);

        return () => clearTimeout(initialTimeout);

    }, [maxSemester]);

    React.useEffect(() => {
        setMatkul(generateMatkulSections());
    }, []);

    return (
        <motion.div
            ref={ref}
            className={styles.inner}
            layout
            exit={{ opacity: 0, x: -250 }}
            transition={{ ...layoutTransition }}
            {...props}
        >
            <motion.div className={styles.matkul}>
                <AnimatePresence mode={'wait'}>
                    {matkul.map((section, sectionIndex) => {
                        return sectionIndex === activeMatkulIndex ? (
                            <motion.div
                                key={sectionIndex}
                                className={styles.matkul_anim}
                                variants={{
                                    initial: {
                                        x: -325,
                                        opacity: 0,
                                        scale: 0.5
                                    },
                                    view: {
                                        x: 0,
                                        opacity: 1,
                                        scale: 1
                                    },
                                    exit: {
                                        x: 325,
                                        opacity: 0,
                                        scale: 0.4
                                    }
                                }}
                                initial={'initial'}
                                animate={'view'}
                                exit={'exit'}
                                transition={{
                                    type: 'spring',
                                    duration: 1,
                                    delay: 0.25
                                }}
                                onAnimationComplete={x => {
                                    if (x === 'exit') {
                                        setAddedMatkul(x => [...x, ...matkul[sectionIndex]])
                                    }
                                }}
                            >
                                {section.map((item, itemIndex) => (
                                    <HistoryDummy
                                        key={item.id}
                                        item={item}
                                        color={penilaian.style[item.nilai]}
                                        semester={activeMatkulIndex + 1}
                                        style={{ boxShadow: 'none', borderRadius: '1rem', marginBottom: '0' }}
                                    />
                                ))}
                            </motion.div>
                        ) : null
                    })}
                </AnimatePresence>
            </motion.div>

            <motion.div
                className={styles.progress_anim}
                initial={{ opacity: 0, rotateY: -30, rotateX: 30, y: 100, x: 75 }}
                animate={{ opacity: 1, rotateY: 0, rotateX: 0, y: 0, x: 0 }}
                transition={{
                    type: 'spring',
                    duration: 1,
                    delay: 0.15,
                }}
            >
                <ProgressDummy
                    value={{ sks: total.sks, matkul: total.matkul, ipk: total.ipk }}
                    animOptions={{
                        duration: 2500,
                        delay: 0,
                    }}
                    style={{ boxShadow: 'none', borderRadius: '1rem', transformOrigin: 'top right' }}
                />
            </motion.div>

        </motion.div>
    )
});

/**
 * Props yang digunakan component `BoxContentZ`
 * @typedef {Object} BoxContentZProps
 * @property {Object} value
 * Initial value untuk atribut yang tersedia
 * @property {number} value.sks
 * Initial value `sks` dengan format angka bulat
 * - Default : `76`
 * @property {number} value.matkul
 * Initial value `matkul` dengan format angka bulat
 * - Default : `31`
 * @property {number} value.ipk
 * Initial value `ipk` dengan format angka decimal disertai dua angka dibelakang koma
 * - Default : `3.27`
 * @property {Object} target
 * Nilai target untuk atribut yang tersedia
 * @property {number} target.sks
 * Nilai target `sks` dengan format angka bulat
 * - Default : `144`
 * @property {number} target.matkul
 * Nilai target `matkul` dengan format angka bulat
 * - Default : `50`
 * @property {number} target.ipk
 * Nilai target `ipk` dengan format angka decimal disertai dua angka dibelakang koma
 * - Default : `3.75`
 * @property {boolean} generateNewNumber
 * Saat `true` maka akan generate angka acak baru untuk setiap atribut dengan interval yang diatur pada `newNumberInterval`
 * - Default : `false`
 * @property {Object} newNumberRange
 * @property {[number, number|'target']} newNumberRange.sks
 * Jarak angka acak yang dibuat untuk atribut `sks`, dimana index pertama sebagai nilai minimum dan index kedua sebagai nilai maksimum.
 * 
 * Kedua index berformat angka bulat.
 * Index kedua dapat bernilai `'target'` dimana ini match dengan target sks yang digunakan pada props `target`.
 * - Default : `[50, 144]`
 * @property {[number, number|'target']} newNumberRange.matkul
 * Jarak angka acak yang dibuat untuk atribut `matkul`, dimana index pertama sebagai nilai minimum dan index kedua sebagai nilai maksimum.
 * 
 * Kedua index berformat angka bulat.
 * Index kedua dapat bernilai `'target'` dimana ini match dengan target matkul yang digunakan pada props `target`.
 * - Default : `[32, 'target']`
 * @property {[number, number|'target']} newNumberRange.ipk
 * Jarak angka acak yang dibuat untuk atribut `ipk`, dimana index pertama sebagai nilai minimum dan index kedua sebagai nilai maksimum.
 * 
 * Kedua index berformat angka decimal disertai dua angka dibelakang koma.
 * Index kedua dapat bernilai `'target'` dimana ini match dengan target ipk yang digunakan pada props `target`.
 * - Default : `[1.25, 4.00]`
 * @property {number} newNumberInterval
 * Interval untuk generate angka acak baru dalam `ms`
 */

/**
 * Component yang dibungkus dengan `forwardRef` untuk menampilkan content yang tampil pada `Box` dengan type `z`
 * @type {React.FC<HTMLMotionProps<'div'> & BoxContentZProps>}
 */
const BoxContentZ = React.forwardRef(({
    value = { sks: 76, matkul: 31, ipk: 3.27 },
    target = { sks: 144, matkul: 50, ipk: 3.75 },
    generateNewNumber = false,
    newNumberRange = { sks: [50, 144], matkul: [32, 'target'], ipk: [1.25, 4.00] },
    newNumberInterval = 5000,
    ...props
}, ref) => {
    const [values, setValues] = React.useState(() => ({
        sks: { current: value.sks, target: target.sks, percentage: calculatePercentage(value.sks, target.sks) },
        matkul: { current: value.matkul, target: target.matkul, percentage: calculatePercentage(value.matkul, target.matkul) },
        ipk: { current: value.ipk, target: target.ipk, percentage: calculatePercentage(value.ipk, target.ipk) },
    }));

    const handleGenerateNewNumber = () => {
        const { sks: sksTarget, matkul: matkulTarget, ipk: ipkTarget } = target;
        const { sks: sksRange, matkul: matkulRange, ipk: ipkRange } = {
            sks: [newNumberRange.sks[0] ?? 50, newNumberRange.sks[1] === 'target' ? sksTarget : newNumberRange.sks[1] ?? 144],
            matkul: [newNumberRange.matkul[0] ?? 10, newNumberRange.matkul[1] === 'target' ? matkulTarget : newNumberRange.matkul[1] ?? 50],
            ipk: [newNumberRange.ipk[0] ?? 1.00, newNumberRange.ipk[1] === 'target' ? ipkTarget : newNumberRange.ipk[1] ?? 4.00]
        };

        const newValues = {
            sks: { current: generateRandomNumber(...sksRange), target: sksTarget },
            matkul: { current: generateRandomNumber(...matkulRange), target: matkulTarget },
            ipk: { current: generateRandomFloat(...ipkRange), target: ipkTarget }
        };

        setValues({
            sks: { ...newValues.sks, percentage: calculatePercentage(newValues.sks.current, sksTarget) },
            matkul: { ...newValues.matkul, percentage: calculatePercentage(newValues.matkul.current, matkulTarget) },
            ipk: { ...newValues.ipk, percentage: calculatePercentage(newValues.ipk.current, ipkTarget) }
        });
    };

    React.useEffect(() => {
        if (generateNewNumber) {
            const interval = setInterval(handleGenerateNewNumber, newNumberInterval);
            return () => clearInterval(interval);
        }
    }, [generateNewNumber, newNumberInterval]);

    return (
        <motion.div
            ref={ref}
            className={styles.inner}
            layout
            transition={{ ...layoutTransition }}
            {...props}
        >
            <motion.div
                initial={{ opacity: 0, x: 500 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 250 }}
                transition={{ duration: 1, type: 'spring', bounce: 0.2 }}
            >
                <SummaryDummy
                    title={'SKS'}
                    color='var(--danger-color)'
                    icon={{ name: 'MdOutlineConfirmationNumber', lib: 'md' }}
                    data={{ value: values.sks.current, percentage: values.sks.percentage, keterangan: `Targetmu ${values.sks.target}` }}
                    style={{ marginTop: '0', boxShadow: 'none', transition: 'none', borderRadius: '1rem' }}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 500 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 250 }}
                transition={{ duration: 1, type: 'spring', bounce: 0.2 }}
            >
                <SummaryDummy
                    title={'IPK'}
                    color='var(--success-color)'
                    icon={{ name: 'FaRegStar', lib: 'fa' }}
                    data={{ value: values.ipk.current, percentage: values.ipk.percentage, keterangan: `Targetmu ${values.ipk.target}` }}
                    style={{ marginTop: '0', boxShadow: 'none', borderRadius: '1rem' }}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 500 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 250 }}
                transition={{ duration: 1, type: 'spring', bounce: 0.2 }}
            >
                <SummaryDummy
                    title={'Matakuliah'}
                    color='var(--warning-color)'
                    icon={{ name: 'IoBookOutline', lib: 'io5' }}
                    data={{ value: values.matkul.current, percentage: values.matkul.percentage, keterangan: `Targetmu ${values.matkul.target}` }}
                    style={{ marginTop: '0', boxShadow: 'none', borderRadius: '1rem' }}
                />
            </motion.div>
        </motion.div>
    )
});

const Details = ({ type = 'x', children }) => (
    <motion.div className={`${styles.details} ${styles[type]}`} layout transition={{ ...layoutTransition }}>
        {children}
    </motion.div>
)

const Text = ({ title = 'Lorem, ipsum dolor.', description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus nesciunt exercitationem vitae laborum quisquam laudantium ex blanditiis est cupiditate, iusto, rem omnis explicabo eius hic!', active = false }) => (
    <motion.div
        className={styles.text}
        layout
        transition={{ duration: 0.5 }}
        variants={{
            hide: {
                opacity: [1, 0],
                y: [0, -75],
            },
            show: {
                opacity: [0, 1],
                y: [75, 0],
            }
        }}
        animate={active ? 'show' : 'hide'}
    >
        <motion.h1 className={styles.title}
        >
            {title}
        </motion.h1>

        <motion.span className={styles.description}>
            {description}
        </motion.span>
    </motion.div>
)

const Progress = ({ text = '1', active = false }) => (
    <motion.div className={`${styles.progress} ${active ? styles.active : ''}`} layout>
        {text}
    </motion.div>
)

const CaraPakai = ({ contents = ['x', 'y', 'z'], useAutoplay = true, autoplayOptions = { countdown: 5, pollingRate: 0.1 } }) => {
    const { countdown = 10, pollingRate = 0.1 } = autoplayOptions;
    const [autoplayCountdown, setAutoplayCountdown] = React.useState(countdown);
    const [isSleeping, setIsSleeping] = React.useState(false);

    const autoplayRef = React.useRef(null);
    const sectionRef = React.useRef(null);

    const [contentShowed, setContentShowed] = React.useState(false);
    const [activeContent, setActiveContent] = React.useState('active_1');

    const startAutoplay = () => {
        autoplayRef.current = setInterval(() => {
            setAutoplayCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    return countdown;
                }
                return prevCountdown - pollingRate;
            });
        }, 1000 * pollingRate);
    };

    const handleSlideNextContent = () => {
        if (useAutoplay) {
            setIsSleeping(true);
            clearInterval(autoplayRef.current);
        }
        setActiveContent((prevState) => {
            const prevNumber = parseInt(prevState.split('_')[1]);
            const nextNumber = prevNumber + 1;
            if (nextNumber > contents.length) {
                return 'active_1'
            }
            return `active_${nextNumber}`
        })

        setTimeout(() => {
            if (useAutoplay) {
                setIsSleeping(false);
            }
        }, 1000)
    }

    const handleTap = (contentNumber) => {
        if (activeContent !== `active_${contentNumber}`) {
            setActiveContent(`active_${contentNumber}`);
        }
        if (useAutoplay) {
            setIsSleeping(true);
            clearInterval(autoplayRef.current);
        }
    }

    const handleHoverStart = (contentNumber) => {
        if (activeContent !== `active_${contentNumber}`) {
            setActiveContent(`active_${contentNumber}`);
        }
        if (useAutoplay) {
            setIsSleeping(true);
            clearInterval(autoplayRef.current);
        }
    };

    const handleHoverEnd = () => {
        if (useAutoplay) {
            setIsSleeping(false);
        }
    };

    React.useEffect(() => {
        if (useAutoplay && !isSleeping && contentShowed) {
            startAutoplay();
        }

        return () => {
            clearInterval(autoplayRef.current);
        };
    }, [useAutoplay, isSleeping, countdown, contentShowed]);

    React.useEffect(() => {
        if (autoplayCountdown <= 1) {
            handleSlideNextContent()
        }
    }, [autoplayCountdown])

    return (
        <div
            ref={sectionRef}
            id={'kenapa_sipk'}
            className={`${styles.section} ${styles.cara_pakai}`}
            style={{
                border: '2.5px solid pink',
                position: 'relative',
            }}
        >
            <div className={styles.title}>
                <HighlightText
                    text={'Kenapa harus pakai SIPK'}
                    preset={'wavingFlyIn'}
                    presetOptions={{
                        wordStagger: 'first'
                    }}
                    hookOptions={{
                        once: true,
                        ref: sectionRef,
                    }}
                    adjustWavingFlyIn={{
                        y: [-225, 0],
                        bounce: 0.15,
                        delay: 0.25
                    }}
                />
            </div>

            <Content
                activeContent={activeContent}
                onAnimationStart={() => { setContentShowed(false) }}
                onAnimationComplete={(x) => {
                    if (x?.opacity === 0) setContentShowed(false);
                    // [Important] When !viewport.once, below code should be writted
                    // if (x?.opacity === 1) setContentShowed(true);
                }}
                // [Important] When !viewport.once, 'onUpdate' handler should not writted
                onUpdate={(x) => {
                    if (x?.opacity > 0.75) setContentShowed(true);
                }}
                viewport={{ once: true }}
            >
                {!contentShowed && (<motion.div className={styles.overlay} />)}

                <Wrapper onTap={() => { handleTap(1) }} onHoverStart={() => { handleHoverStart(1) }} onHoverEnd={handleHoverEnd}>
                    <Box type={'x'}>
                        <AnimatePresence mode={'popLayout'}>
                            {activeContent.split('_')[1] === '1' && contentShowed && (
                                <BoxContentX />
                            )}
                        </AnimatePresence>
                    </Box>

                    <Details type={'x'}>
                        <Progress text={'1'} active={activeContent.split('_')[1] === '1'} />
                        <Text
                            title={'Susun Rencana Akademikmu'}
                            description={'Mulailah merencanakan perjalanan akademikmu dengan baik! SIPK membantumu memproyeksikan IPK berdasarkan mata kuliah yang dimasukkan, sehingga kamu bisa mengambil keputusan yang lebih terarah sejak dini.'}
                            active={activeContent.split('_')[1] === '1'}
                        />
                    </Details>
                </Wrapper>

                <Wrapper onTap={() => { handleTap(2) }} onHoverStart={() => { handleHoverStart(2) }} onHoverEnd={handleHoverEnd}>
                    <Box type={'y'}>

                    </Box>

                    <Details type={'y'}>
                        <Progress text={'2'} active={activeContent.split('_')[1] === '2'} />
                        <Text
                            title={'Dapatkan Gambaran IPK yang Jelas'}
                            description={'Engga perlu lagi bingung dengan hasil IPK saat ingin memperbaiki atau mengulang mata kuliah! SIPK memberikan gambaran yang jelas, memudahkanmu dalam menavigasi setiap langkah akademikmu.'}
                            active={activeContent.split('_')[1] === '2'}
                        />
                    </Details>
                </Wrapper>

                <Wrapper onTap={() => { handleTap(3) }} onHoverStart={() => { handleHoverStart(3) }} onHoverEnd={handleHoverEnd}>
                    <Box type={'z'}>
                        <AnimatePresence mode={'popLayout'}>
                            {activeContent.split('_')[1] === '3' && contentShowed && (
                                <BoxContentZ generateNewNumber={true} />
                            )}
                        </AnimatePresence>
                    </Box>

                    <Details type={'z'}>
                        <Progress text={'3'} active={activeContent.split('_')[1] === '3'} />
                        <Text
                            title={'Lacak Perkembangan Akademikmu'}
                            description={'Pantau progres studimu dalam meraih target SKS, jumlah mata kuliah, dan mencapai IPK kelulusan yang diimpikan, semua dalam satu platform yang terorganisir dan mudah diakses.'}
                            active={activeContent.split('_')[1] === '3'}
                        />
                    </Details>
                </Wrapper>
            </Content>
        </div>
    )
}

const MulaiSekarang = () => {
    const title = 'Mulai Sekarang';
    const description = 'Akses semua fitur secara gratis! Daftar sekarang atau login jika sudah punya akun. Jangan lewatkan,'
    const descriptionWords = description.split(' ');

    // Describe animation delay (after element inView)
    // with an array [logo, title, description, button, description highlight]
    const delayAnims = [0.125, 0.25, 0.85, 0.975, 1.175];

    return (
        <div
            className={`${styles.section} ${styles.mulai_sekarang}`}
            style={{
                border: '2.5px solid pink'
            }}
        >
            <ThemeChanger
                options={{
                    position: {
                        type: 'absolute',
                        preset: 'top-left',
                        offsetX: 25,
                        offsetY: 25
                    }
                }}
            />

            <motion.div
                initial={{ scale: 1.5, opacity: 0 }}
                variants={{ show: { scale: 1, opacity: 1 }, hide: { scale: 1.5, opacity: 0 } }}
                whileInView={'show'}
                viewport={{ once: true }}
                transition={{ type: 'spring', duration: 0.75, delay: delayAnims[0] }}
                className={styles.logo}
            >
                <LogoImage
                    src={'/logo_fill.png'}
                    width={128}
                    height={128}
                />
            </motion.div>

            <motion.div
                className={styles.title}
                whileInView={'show'}
                viewport={{ once: true }}
                transition={{ type: 'spring', delayChildren: delayAnims[1] }}
            >
                <HighlightText
                    text={title}
                    preset={'wavingTranslate'}
                    hookOptions={{
                        once: true
                    }}
                    adjustWavingTranslate={{
                        perspective: 500,
                        duration: 0.75,
                        baseDelay: delayAnims[1]
                    }}
                />
            </motion.div>

            <motion.div
                className={styles.description}
                whileInView={'show'}
                viewport={{ once: true }}
                transition={{ type: 'spring', delayChildren: delayAnims[2] }}
            >
                <motion.span
                    style={{ transformOrigin: '0% 50%', willChange: 'transform' }}
                    initial={{ y: 25, opacity: 0 }}
                    variants={{ show: { y: 0, opacity: 1 }, hide: { y: 25, opacity: 0 } }}
                >
                    {descriptionWords.map((word, wordIndex) => (
                        <span key={`word-${wordIndex}`} className={styles.word}>
                            {word}
                        </span>
                    ))}

                    <HighlightText
                        text={'kuota pendaftaran terbatas!'}
                        hookOptions={{
                            once: true
                        }}
                        adjustWavingColor={{
                            color: [null, 'var(--infoDark-color)', 'var(--logo-second-color)'],
                            scale: [null, 1.3, 1],
                            baseDelay: delayAnims[4],
                            repeat: Infinity,
                            repeatDelay: 10
                        }}
                    />
                </motion.span>
            </motion.div>

            <motion.div
                className={styles.buttons}
            >
                <motion.a
                    className={`${styles.btn} ${styles.secondary}`}
                    href={'/users?action=login'}
                    initial={{ scale: 0 }}
                    variants={{
                        show: { scale: 1, transition: { delay: delayAnims[3], type: 'spring', bounce: 0.2 } },
                        hide: { scale: 0 },
                    }}
                    whileInView={'show'}
                    viewport={{ once: true }}
                >
                    Masuk
                </motion.a>

                <motion.a
                    className={`${styles.btn} ${styles.main}`}
                    href={'/users?action=daftar'}
                    initial={{ scale: 0 }}
                    variants={{
                        show: { scale: 1, transition: { delay: delayAnims[3], type: 'spring', bounce: 0.2 } },
                        hide: { scale: 0 },
                    }}
                    whileInView={'show'}
                    viewport={{ once: true }}
                >
                    Daftar
                </motion.a>
            </motion.div>
        </div>
    )
}

const footerShorcuts = [
    { text: 'About', target: 'tentang' },
    { text: 'Why Us', target: 'kenapa_sipk' },
    { text: 'University', target: 'universitas' },
    { text: 'Features', target: 'features' },
    { text: 'Testimonies', target: 'contacts' }
]

const footerSocials = [
    { icon: <FaLinkedin size={'100%'} />, target: 'https://www.linkedin.com/' },
    { icon: <FaTiktok size={'100%'} />, target: 'https://www.tiktok.com/' },
    { icon: <FaTelegram size={'100%'} />, target: 'https://web.telegram.org/' },
]

const footerSublinks = [
    { text: 'Guides', target: 'https://www.linkedin.com/' },
    { text: 'Changelog', target: 'https://www.linkedin.com/' }
]

const footerDelayAnims = [0.125, 0.25, 0.375];

const getFooterTransition = (isText = true, delayIndex = 0, isLine = false) => ({
    initial: {
        opacity: isText ? 0 : 1,
        scale: isText ? 1 : 0,
        y: isText ? delayIndex === 2 ? 50 : 75 : 0,
    },
    variants: {
        show: {
            opacity: 1,
            scale: 1,
            y: 0,
        }
    },
    transition: {
        duration: 1.25,
        bounce: (isLine || isText) ? 0 : 0.25,
        type: 'spring',
        delay: footerDelayAnims[delayIndex]
    }
})

const FooterOutter = ({ children }) => (
    <div className={styles.footer_outter}>
        {children}
    </div>
)

const FooterWrapper = ({ children }) => (
    <div className={styles.footer_wrapper}>
        {children}
    </div>
)

const Footer = () => (
    <footer className={styles.footer}>
        <motion.div
            className={styles.primary}
            whileInView={'show'}
            viewport={{ once: true }}
        >
            <motion.div className={styles.brand} {...getFooterTransition(false, 0)}
            >
                <LogoImage src={'/logo_fill_contrast.png'} width={60} height={60} />
            </motion.div>

            <div className={styles.shorcut}>
                {footerShorcuts.map((item, index) => (
                    <Link
                        key={index}
                        item={{
                            elementId: item.target
                        }}
                        scrollOptions={{
                            smooth: true
                        }}
                    >
                        <motion.span {...getFooterTransition(true, 0)}>
                            {item.text}
                        </motion.span>
                    </Link>
                ))}
            </div>

            <div className={styles.socials}>
                {footerSocials.map((item, index) => (
                    <motion.a key={index} className={styles.box} href={item.target} target={'_blank'} {...getFooterTransition(false, 0)}>
                        {item.icon}
                    </motion.a>
                ))}
            </div>
        </motion.div>

        <motion.div
            className={styles.line}
            whileInView={'show'}
            viewport={{ once: true }}
            {...getFooterTransition(false, 1, true)}
        />

        <motion.div
            className={styles.secondary}
            whileInView={'show'}
            viewport={{ once: true }}
        >
            <motion.span initial={{ y: 75, opacity: 0 }} {...getFooterTransition(true, 2)}>
                2024 All Rights Reserved.
            </motion.span>
            <div className={styles.sublinks}>
                {footerSublinks.map((item, index) => (
                    <motion.a key={index} href={item.target} target={'_blank'}{...getFooterTransition(true, 2)}>
                        {item.text}
                    </motion.a>
                ))}
            </div>
        </motion.div>
    </footer>
)

const MainFooter = () => (
    <FooterOutter>
        <FooterWrapper>
            <Footer />
        </FooterWrapper>
    </FooterOutter>
)

