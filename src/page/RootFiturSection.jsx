'use client'

// #region TYPE DEPEDENCY
import { HighlightTextProps, presetOptions } from '@/component/motion/HighlightText';
// #endregion

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
} from './RootConfig';
// #endregion

// #region DATA DEPEDENCY
import { defaultMatakuliah, defaultPenilaian } from './RootData';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import { useInterval } from 'ahooks';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ProgressDummy, DistribusiDummy, GrafikDummy } from '@/component/Card';
import HighlightText from '@/component/motion/HighlightText';
// #endregion

// #region ICON DEPEDENCY
import { TbAtom, TbAntennaBars5 } from "react-icons/tb";
import { IoAnalyticsOutline } from "react-icons/io5";
import { LuShapes } from "react-icons/lu";
// #endregion

// #region UTIL DEPEDENCY
import { shuffleArray, findArrayIndexByString } from './RootUtils';
// #endregion

const FITUR_FITURCARD_CONTENT_PROPS = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.75 }
}

const FITUR_SECTION_CONTENTS = [
    {
        fiturCardProps: {
            title: undefined,
            description: undefined,
            wrapperClassname: 'sebaran_nilai',
            content: (
                <DistribusiDummy
                    useAutoplay={false}
                    matkul={defaultMatakuliah}
                    penilaian={defaultPenilaian}
                    animOptions={{
                        duration: 1500,
                        delay: (FITUR_FITURCARD_CONTENT_PROPS.transition.duration * 1000) / 2,
                    }}
                    {...FITUR_FITURCARD_CONTENT_PROPS}
                />
            )
        }
    },
    {
        fiturCardProps: {
            title: undefined,
            description: undefined,
            wrapperClassname: 'grafik_progress',
            content: (
                <GrafikDummy
                    matkul={defaultMatakuliah}
                    animOptions={{
                        duration: 1500,
                        delay: (FITUR_FITURCARD_CONTENT_PROPS.transition.duration * 1000) / 2,
                    }}
                    {...FITUR_FITURCARD_CONTENT_PROPS}
                />
            )
        }
    },
    {
        fiturCardProps: {
            title: undefined,
            description: undefined,
            wrapperClassname: 'bar_progress',
            content: (
                <ProgressDummy
                    animOptions={{
                        duration: 1500,
                        delay: (FITUR_FITURCARD_CONTENT_PROPS.transition.duration * 1000) / 2,
                    }}
                    {...FITUR_FITURCARD_CONTENT_PROPS}
                />
            )
        }
    },
]

const FITUR_SECTION_LAYOUT_TRANSITION = { duration: 0.75, bounce: 0.1, type: 'spring' }

const FITURCARD_STAGGER_OFFSET = 0.75;

const FiturCard = ({ title, description, wrapperClassname, content, contentIndex = 0, ...props }) => {
    const [contentShowed, setContentShowed] = React.useState(false);

    return (
        <motion.div
            className={styles.card_wrapper}
            style={{ zIndex: (FITUR_SECTION_CONTENTS.length + 1) - contentIndex }}
            whileInView={'inView'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE, amount: 1 }}
        >
            <motion.div
                className={styles.card}
                // TODOS add initial animation
                initial={{}}
                transition={{ duration: 0.5, bounce: 0.1, type: 'spring' }}
                variants={{ inView: {} }}
                onAnimationStart={() => { setContentShowed(false) }}
                onAnimationComplete={(x) => {
                    if (x === 'inView') setContentShowed(true);
                }}
                {...props}
            >
                <div className={wrapperClassname ? `${styles.card_main} ${styles[wrapperClassname]}` : styles.card_main}>
                    <AnimatePresence>
                        {contentShowed && (
                            content
                        )}
                    </AnimatePresence>
                </div>

                <div className={styles.card_secondary}>
                    <h3 className={styles.title}>
                        {title ?? 'Lorem, ipsum dolor.'}
                    </h3>
                    <p className={styles.description}>
                        {description ?? 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia voluptates excepturi sit quis, assumenda ut natus quisquam nam iure magnam.'}
                    </p>
                </div>
            </motion.div>
        </motion.div >
    )
}

const Fitur = () => {
    const sectionRef = React.useRef(null);
    // TODOS setIconSize based viewport / responsive
    const [iconSize, setIconSize] = React.useState(60);
    const [alreadyInView, setAlreadyInView] = React.useState(false);
    const [titleAnimation, setTitleAnimation] = React.useState(null);
    const { scrollYProgress: sectionScrollProgress } = useScroll({ target: sectionRef, smooth: 1 });
    const scrollContent = useTransform(sectionScrollProgress, [0, 1], ['12.5%', '-95%']);
    const iconX = useTransform(sectionScrollProgress, [0.44, 0.66], [0, 100])
    const iconLeft = useTransform(sectionScrollProgress, [0.44, 0.66], [(iconSize * -1), 0])

    const titleDelayOffset = 0.15;
    // TODOS update title text content
    const titleParaghraph = [
        ['Analytics', 'that'],
        ['that', 'helps', 'you'],
        ['shape', 'the', 'future']
    ]

    const calculateBaseDelay = (paraghraphIndex, str, stagger = 0.05) => {
        const index = titleParaghraph[paraghraphIndex].indexOf(str);
        var baseDelay = 0;
        if (index === 0) return baseDelay;

        for (var x = index; x > 0; x--) {
            baseDelay = ((titleParaghraph[paraghraphIndex][x - 1].length) * stagger) + baseDelay;
        }

        return baseDelay;
    }

    /** 
     * Method untuk menghitung jumlah karakter dan kata sebelumnya dari kata yang dipilih.
     * Hanya gunakan method ini untuk menghitung konten `statis`. Berikut adalah format dari array yang digunakan,
     * 
     * ```js
     * const pArray = [
     *      ['Analytics'], // Index 0 sebagai paragraf 1
     *      ['that', 'helps', 'you'], // Index 1 sebagai paragraf 2
     *      ['shape', 'the', 'future'] // Index 2 sebagai paragraf 3
     * ]
     * 
     * // Format pArray[pIndex][wIndex] - paragrafArray[indexParagraf][indexKata]
     * // Sehingga,
     * // pIndex dari 'that' = 1 dan wIndex = 0
     * // pIndex dari 'the' = 2 dan wIndex = 1
     * ```
     * 
     * Return object dengan key `words` sebagai jumlah kata, `chars` sebagai jumlah huruf dan `-1` jika beberapa case berikut terjadi,
     * - Param `pArray` falsy atau bukan merupakan tipe array
     * - Param `str` falsy atau tidak tersedia pada `pArray`
     * - Param `pIndex` dan `wIndex` tidak tersedia pada `pArray`
     * 
     * Jika terdapat kata yang sama, `pIndex` dan `wIndex` harus dipass karna akan menyebabkan kesalahan perhitungan
     * karna kata yang muncul terlebih dahulu akan dianggap sebagai kata yang dipilih. Untuk lebih jelasnya lihat contoh berikut,
     * 
     * ```js
     * const same_words = [
     *      ['lorem', 'ipsum', 'dolor'], 
     *      ['sit', 'lorem', 'ipsum']
     * ]
     * console.log(countPrevCharactersAndWords(same_words, true, 'lorem')); // { previousWords: 0, previousCharacters: 0 }
     * console.log(countPrevCharactersAndWords(same_words, true, 'ipsum')); // { previousWords: 1, previousCharacters: 5 }
     * 
     * // Pada console.log pertama, 'lorem' yang dimaksud adalah pada paragraf kedua namun hasil yang diberikan adalah 'lorem' yang pertama tampil
     * // Pada console.log kedua, 'ipsum' yang dimaksud adalah pada paragraf kedua namun hasil yang diberikan adalah 'ipsum' yang pertama tampil
     * ```
     * @param {Array<Array<string>>} pArray Array yang mendeskripsikan kata dari setiap paragraf
     * @param {boolean} [countDifferentParaghraph] Boolean untuk menghitung jumlah karakter dan kata sebelumnya walaupun berada pada paragraf yang berbeda, default `true`
     * @param {string} str Kata yang dipilih untuk menghitung jumlah karakter dan kata sebelumnya
     * @param {number} [pIndex] Index paragraf dari kata yang digunakan pada param `str`
     * @param {number} [wIndex] Index kata dari kata yang digunakan pada param `str`
     * @returns {{words:number, chars:number} | -1}
    */
    const countPrevCharactersAndWords = (pArray, countDifferentParaghraph = true, str, pIndex = null, wIndex = null) => {
        if (!pArray || !Array.isArray(pArray) || !str) return -1;
        if (!pArray[pIndex] || !pArray[pIndex][wIndex] || pArray[pIndex][wIndex] !== str) return -1;

        let words = 0;
        let chars = 0;

        for (let i = 0; i < pArray.length; i++) {
            for (let j = 0; j < pArray[i].length; j++) {
                if (pIndex !== null && wIndex !== null) {
                    if (i === pIndex && j === wIndex && pArray[i][j] === str) {
                        return { words, chars };
                    }
                } else {
                    if (pArray[i][j] === str) {
                        return { words, chars };
                    }
                }

                if (countDifferentParaghraph) {
                    words += 1;
                    chars += pArray[i][j].length;
                }
                else {
                    if (pIndex === i) {
                        words += 1;
                        chars += pArray[i][j].length;
                    }
                }
            }
        }

        return -1;
    }

    const titleStaggered = shuffleArray(titleParaghraph.flat().map((_, index) => index * titleDelayOffset));

    /** @type {Object<string, presetOptions['customCharVariants']>} */
    const customCharVariantsByText = {
        Analytics: {
            hover: {
                z: [null, -200, 0],
                scale: [null, 0.25, 0.75, 1],
                rotateX: [null, -90, -90, 1],
                opacity: [null, 0, 0, 1],
                transformOrigin: '50% 100%',
                transition: {
                    duration: 1.5
                },
                options: {
                    randomStart: ['scale'],
                    staggerType: 'random',
                    stagger: 0.075
                }
            }
        },
        shape: {
            shape_text: {
                color: [null, '#00d16f', '#5d1470', '#1bbad6', '#71a819', '#ea83d0', '#c6b3ba', 'var(--box-color-success2)'],
                rotateX: [null, 90, 0],
                scale: [null, 1.25, 0.45, 1.35, 1],
                transition: {
                    // repeat: Infinity,
                    // repeatDelay: 5
                },
                options: {
                    randomStart: ['color'],
                    staggerType: 'first',
                    stagger: 0.1
                }
            },
        },
        the: {
            shape_text: {
                color: [null, '#c5e8a4', '#5d1470', '#1bbad6', '#6b7772', '#ea83d0', '#9f48bf', 'var(--dark-color)'],
                rotateX: [null, 90, 0],
                scale: [null, 1.25, 0.35, 1.15, 1],
                transition: {
                    // repeat: Infinity,
                    // repeatDelay: 5,
                },
                options: {
                    randomStart: ['color'],
                    staggerType: 'first',
                    stagger: 0.1,
                    baseDelay: calculateBaseDelay(2, 'the', 0.1),
                }
            },
        },
        future: {
            shape_text: {
                color: [null, '#2b769b', '#5d1470', '#1bbad6', '#328e91', '#ea83d0', '#f9fbfc', 'var(--warning-color-hex)'],
                rotateX: [null, 90, 0],
                scale: [null, 1.25, 0.35, 1.15, 1],
                transition: {
                    // repeat: Infinity,
                    // repeatDelay: 5
                },
                options: {
                    randomStart: ['color'],
                    staggerType: 'first',
                    stagger: 0.1,
                    baseDelay: calculateBaseDelay(2, 'future', 0.1),
                }
            },
        },
    }

    /** @type {Object<string, presetOptions['customWordVariants']>} */
    const customWordVariantsByText = {

    }

    /** 
     * Array yang berisikan string sebagai nama dari custom animasi variant yang dimainkan setelah animasi pertama atau animasi `inView` 
     * @type {Array<string>}
     */
    const customVariantCollections = ['shape_text']

    /**
     * Resolve props yang digunakan pada component `HighlightText`
     * @param {string} text String teks untuk mengatur delay animasi
     * @returns {HighlightTextProps} Props yang sudah diatur
     */
    const resolveTitleProps = (text) => ({
        useHook: false,
        preset: 'wavingFlyIn',
        presetOptions: {
            makeVariant: true,
            variantName: 'loremipsum',
            customCharVariants: customCharVariantsByText[text] ?? {},
            customWordVariants: customWordVariantsByText[text] ?? {},
        },
        adjustWavingFlyIn: {
            baseDelay: titleStaggered[findArrayIndexByString(text, titleParaghraph.flat())],
        }
    })

    useInterval(() => {
        if (alreadyInView) setTitleAnimation('shape_text');
    }, 7500);

    return (
        <div ref={sectionRef} id={'fitur'} className={`${styles.section} ${styles.fitur}`}>
            <div className={styles.fitur_wrapper}>
                <motion.div
                    className={styles.title}
                    initial={{ visibility: 'hidden' }}
                    style={{
                        '--icon-size': `${iconSize}px`,
                        position: 'relative'
                    }}
                    variants={{ loremipsum: { visibility: 'visible' } }}
                    whileInView={'loremipsum'}
                    animate={titleAnimation ?? {}}
                    onAnimationComplete={(x) => {
                        if (typeof x === 'string') {
                            if (customVariantCollections.includes(x)) setTitleAnimation({});
                            if (x === 'loremipsum') setAlreadyInView(true);
                        }
                    }}
                    viewport={{
                        once: GLOBAL_VIEWPORT_ONCE,
                        amount: 1
                    }}
                >
                    <div className={styles.wrap}>
                        <motion.div
                            className={styles.icons}
                            initial={{ scale: 0 }}
                            variants={{ loremipsum: { scale: 1, transition: { type: 'spring', duration: 1.5, bounce: 0, delay: titleStaggered[findArrayIndexByString('Analytics', titleParaghraph.flat())] } } }}
                        >
                            <div className={`${styles.icon} ${styles.alt}`} >
                                <motion.span
                                    initial={{ rotate: 180 }}
                                    style={{ x: iconX }}
                                    variants={{ change: { x: 100 }, loremipsum: { rotate: 0, transition: { type: 'spring', duration: 2, bounce: 0, delay: titleStaggered[findArrayIndexByString('Analytics', titleParaghraph.flat())] } } }}
                                    transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
                                >
                                    <IoAnalyticsOutline fontSize={'0.5em'} />
                                </motion.span>
                                <motion.div
                                    className={styles.icon_bg_wrap}
                                    style={{ left: iconLeft }}
                                    variants={{ change: { left: 0 } }}
                                    transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
                                >
                                    <div className={`${styles.icon_bg} ${styles.warning}`}>
                                        <motion.span
                                            initial={{ rotate: 180 }}
                                            variants={{ loremipsum: { rotate: 0, transition: { type: 'spring', duration: 2, bounce: 0, delay: titleStaggered[findArrayIndexByString('Analytics', titleParaghraph.flat())] } } }}
                                            transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
                                        >
                                            <TbAtom fontSize={'0.5em'} />
                                        </motion.span>
                                    </div>
                                    <div className={`${styles.icon_bg} ${styles.alt}`} />
                                </motion.div>
                            </div>

                            <div className={`${styles.icon}`} >
                                <motion.span
                                    initial={{ rotate: 225 }}
                                    style={{ x: iconX }}
                                    variants={{ change: { x: 100 }, loremipsum: { rotate: 0, transition: { type: 'spring', duration: 3, bounce: 0, delay: titleStaggered[findArrayIndexByString('Analytics', titleParaghraph.flat())] } } }}
                                    transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
                                >
                                    <TbAntennaBars5 fontSize={'0.5em'} />
                                </motion.span>
                                <motion.div
                                    className={styles.icon_bg_wrap}
                                    style={{ left: iconLeft }}
                                    variants={{ change: { left: 0 } }}
                                    transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
                                >
                                    <div className={`${styles.icon_bg} ${styles.alt}`}>
                                        <motion.span
                                            initial={{ rotate: 180 }}
                                            variants={{ loremipsum: { rotate: 0, transition: { type: 'spring', duration: 2, bounce: 0, delay: titleStaggered[findArrayIndexByString('Analytics', titleParaghraph.flat())] } } }}
                                            transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
                                        >
                                            <IoAnalyticsOutline fontSize={'0.5em'} />
                                        </motion.span>
                                    </div>
                                    <div className={`${styles.icon_bg}`} />
                                </motion.div>
                            </div>
                        </motion.div>
                        <HighlightText text={'Analytics'} {...resolveTitleProps('Analytics')} />
                    </div>

                    <h1>
                        <HighlightText text={'that'} {...resolveTitleProps('that')} />

                        <span>
                            <HighlightText text={'helps'} {...resolveTitleProps('helps')} />
                        </span>
                        <HighlightText text={'you'} {...resolveTitleProps('you')} />
                    </h1>

                    <div className={styles.wrap}>
                        <HighlightText text={'shape'} {...resolveTitleProps('shape')} />
                        <motion.div
                            className={`${styles.icon}`}
                            initial={{ scale: 0 }}
                            variants={{ loremipsum: { scale: 1, transition: { type: 'spring', duration: 2, bounce: 0, delay: titleStaggered[findArrayIndexByString('shape', titleParaghraph.flat())] } } }}
                        >
                            <motion.div
                                className={`${styles.icon_bg} ${styles.success}`}
                                initial={{ rotate: 270 }}
                                variants={{ loremipsum: { rotate: 0, transition: { type: 'spring', duration: 2.5, bounce: 0, delay: titleStaggered[findArrayIndexByString('shape', titleParaghraph.flat())] } } }}
                            >
                                <LuShapes fontSize={'0.5em'} />
                            </motion.div>
                        </motion.div>
                        <HighlightText text={'the'} {...resolveTitleProps('the')} />
                        <HighlightText text={'future'} {...resolveTitleProps('future')} />
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            top: '10%',
                            left: '50%',
                            width: '75%',
                            height: 125,
                            border: '1px solid red',
                            transform: 'translate(-50%, -10%)',
                            display: 'flex',
                            gap: '1.25rem',
                            fontWeight: 500,
                            fontSize: '1rem',
                            padding: '1rem',
                        }}
                    >
                        <div style={{ border: '1px solid red', height: 'max-content', padding: '0.25rem', borderRadius: '0.5rem' }} onClick={() => { setTitleAnimation('shape_text') }}>shape_text</div>
                        <div style={{ border: '1px solid red', height: 'max-content', padding: '0.25rem', borderRadius: '0.5rem' }} onClick={() => { setTitleAnimation('translate_text') }}>translate_text</div>
                        <div style={{ border: '1px solid red', height: 'max-content', padding: '0.25rem', borderRadius: '0.5rem' }} onClick={() => { setTitleAnimation('hover') }}>hover</div>
                    </div>
                </motion.div>

                <motion.div className={styles.content} >
                    <motion.div className={styles.content_inner} style={{ y: scrollContent }}>
                        {FITUR_SECTION_CONTENTS.map((item, index) => (
                            <FiturCard key={index} contentIndex={index} {...item.fiturCardProps} />
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Fitur;