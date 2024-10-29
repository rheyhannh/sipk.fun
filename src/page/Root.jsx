'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { HTMLMotionProps, MotionStyle, MotionValue } from 'framer-motion';
// #endregion

// #region NEXT DEPEDENCY
import Image from 'next/image';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { SummaryDummy } from '@/component/Card';
import { LogoImage } from '@/component/Main';
import Link from '@/component/Link';
import HighlightText from '@/component/motion/HighlightText';
import ThemeChanger from '@/component/_test/ThemeChanger';
// #endregion

/**
 * Render root page `'/'`
 * @param {{universitas:Array<SupabaseTypes.UniversitasData>, rating:Array<SupabaseTypes.RatingData>, notifikasi:Array<SupabaseTypes.NotifikasiData>}} props Root props
 * @returns {React.ReactElement} Rendered root page
 */
export default function Root({ universitas, rating, notifikasi }) {
    return (
        <div className={styles.container}>
            <Feature />
            <Universitas universitas={universitas} />
            <CaraPakai />
            <MulaiSekarang />
        </div>
    )
}

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

    const [contentShowed, setContentShowed] = React.useState(false);
    const [activeContent, setActiveContent] = React.useState('active_1');

    const layoutTransition = {
        layout: { type: 'spring', duration: 1, bounce: 0.3 }
    }

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
            className={`${styles.section} ${styles.cara_pakai}`}
            style={{
                border: '2.5px solid pink',
                position: 'relative',
            }}
        >
            <div className={styles.title}>
                Lorem, ipsum dolor.
            </div>

            <motion.div
                layout
                initial={{
                    x: '100%',
                    gap: '10rem',
                    opacity: 0,
                }}
                whileInView={{
                    x: '0%',
                    gap: '1rem',
                    opacity: 1,
                }}
                transition={{
                    type: 'spring',
                    ease: 'linear',
                    duration: 2.5,
                    bounce: 0,
                    opacity: { duration: 1 },
                    ...layoutTransition
                }}
                onAnimationStart={() => { setContentShowed(false) }}
                onAnimationComplete={(x) => {
                    if (x?.opacity === 0) {
                        setContentShowed(false);
                    } else if (x?.opacity === 1) {
                        setContentShowed(true);
                    } else {
                        console.log('Unknown State');
                    }
                }}
                className={`${styles.content} ${styles[activeContent]}`}
            >
                {!contentShowed && (
                    <motion.div className={styles.overlay} />
                )}

                <motion.div
                    className={styles.wrapper}
                    layout
                    onTap={() => { handleTap(1) }}
                    onHoverStart={() => { handleHoverStart(1) }}
                    onHoverEnd={handleHoverEnd}
                    transition={{
                        ...layoutTransition
                    }}
                >
                    <motion.div className={`${styles.box} ${styles.x}`} layout transition={{ ...layoutTransition }}>

                    </motion.div>

                    <motion.div
                        className={`${styles.details} ${styles.x}`}
                        layout
                        transition={{
                            ...layoutTransition
                        }}
                    >
                        <Progress text={'1'} active={activeContent.split('_')[1] === '1'} />
                        <Text
                            title={'Susun Rencana Akademikmu'}
                            description={'Mulailah merencanakan perjalanan akademikmu dengan baik! SIPK membantumu memproyeksikan IPK masa depan, sehingga kamu bisa mengambil keputusan yang lebih terarah sejak dini.'}
                            active={activeContent.split('_')[1] === '1'}
                        />
                    </motion.div>
                </motion.div>

                <motion.div
                    className={styles.wrapper}
                    layout
                    onTap={() => { handleTap(2) }}
                    onHoverStart={() => { handleHoverStart(2) }}
                    onHoverEnd={handleHoverEnd}
                    transition={{
                        ...layoutTransition
                    }}
                >
                    <motion.div className={`${styles.box} ${styles.y}`} layout transition={{ ...layoutTransition }}>

                    </motion.div>

                    <motion.div className={`${styles.details} ${styles.y}`} layout transition={{ ...layoutTransition }}>
                        <Progress text={'2'} active={activeContent.split('_')[1] === '2'} />
                        <Text
                            title={'Dapatkan Gambaran IPK yang Jelas'}
                            description={'Tidak perlu lagi bingung dengan hasil IPK saat ingin memperbaiki atau mengulang mata kuliah! SIPK memberikan gambaran yang jelas, memudahkanmu dalam menavigasi setiap langkah akademikmu.'}
                            active={activeContent.split('_')[1] === '2'}
                        />
                    </motion.div>
                </motion.div>

                <motion.div
                    className={styles.wrapper}
                    layout
                    onTap={() => { handleTap(3) }}
                    onHoverStart={() => { handleHoverStart(3) }}
                    onHoverEnd={handleHoverEnd}
                    transition={{
                        ...layoutTransition
                    }}
                >
                    <motion.div className={`${styles.box} ${styles.z}`} layout transition={{ ...layoutTransition }}>

                    </motion.div>

                    <motion.div
                        className={`${styles.details} ${styles.z}`}
                        layout
                        transition={{
                            ...layoutTransition
                        }}
                    >
                        <Progress text={'3'} active={activeContent.split('_')[1] === '3'} />
                        <Text
                            title={'Lacak Perkembangan Akademikmu'}
                            description={'Pantau progres studimu dalam meraih target SKS, menyelesaikan mata kuliah, dan mencapai IPK kelulusan yang diimpikan, semua dalam satu platform yang terorganisir dan mudah diakses.'}
                            active={activeContent.split('_')[1] === '3'}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
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
                // whileHover={'hide'}
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
                // whileHover={'hide'}
                transition={{ type: 'spring', delayChildren: delayAnims[1] }}
            >
                <HighlightText
                    text={title}
                    preset={'wavingTranslate'}
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
                >
                    Daftar
                </motion.a>
            </motion.div>
        </div>
    )
}