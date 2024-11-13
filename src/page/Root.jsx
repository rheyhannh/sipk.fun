'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { HTMLMotionProps, MotionStyle, MotionValue } from 'framer-motion';
import { MatkulDummiesProps } from '@/component/landing/variables/MatkulDummies';
import { HighlightTextProps } from '@/component/motion/HighlightText';
// #endregion

// #region DATA DEPEDENCY
import { defaultMatakuliah, defaultPenilaian } from './RootData';
// #endregion

// #region NEXT DEPEDENCY
import Image from 'next/image';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import { useLocalTheme } from '@/data/core';
import useWindowSize from '@/hooks/useWindowSize';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { SummaryDummy, HistoryDummy, ProgressDummy, DistribusiDummy, GrafikDummy } from '@/component/Card';
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
import { TbAtom, TbAntennaBars5 } from "react-icons/tb";
import { IoAnalyticsOutline } from "react-icons/io5";
import { LuShapes } from "react-icons/lu";
// #endregion

/**
 * Render root page `'/'`
 * @param {{universitas:Array<SupabaseTypes.UniversitasData>, rating:Array<SupabaseTypes.RatingData>, notifikasi:Array<SupabaseTypes.NotifikasiData>}} props Root props
 * @returns {React.ReactElement} Rendered root page
 */
export default function Root({ universitas, rating, notifikasi }) {
    return (
        <>
            <Header />
            <Container>
                <CaraPakai />
                <Universitas universitas={universitas} />
                <Fitur />
                <MulaiSekarang />
            </Container>
            <MainFooter />
        </>
    )
}

const GLOBAL_VIEWPORT_ONCE = true;

const Header = ({ children, ...props }) => (
    <header className={styles.header} {...props}>
        {children}
    </header>
)

const Container = ({ children }) => (
    <div className={styles.container}>
        {children}
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

const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomFloat = (min, max) => {
    const randomFloat = Math.random() * (max - min) + min;
    return Math.round(randomFloat * 100) / 100;
};

const calculatePercentage = (value, target) => {
    const percentage = Math.round((value / target) * 100);
    return Math.min(percentage, 100);
};

const shuffleArray = (array) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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
        >
            <div className={styles.title}>
                <HighlightText
                    text={'Kenapa harus pakai SIPK'}
                    preset={'wavingFlyIn'}
                    presetOptions={{
                        wordStagger: 'first'
                    }}
                    hookOptions={{
                        once: GLOBAL_VIEWPORT_ONCE,
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
                viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
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

/**
 * Props yang digunakan component `TextFitContainer`
 * @typedef {Object} TextFitContainerProps
 * @property {React.RefObject<HTMLElement>} containerRef
 * Ref dari container yang digunakan, props ini dibutuhkan untuk perhitungan ukuran teks. Jika tidak tersedia, maka ukuran teks tidak akan berubah
 * @property {keyof motion} as
 * Tipe element yang digunakan dan tersedia pada component `motion`
 * - Default : `'span'`
 */

/**
 * Component untuk membuat teks dengan ukuran yang fit terhadap sebuah container.
 * Pastikan ref dari element container dipass melalui props `containerRef`, karna jika tidak maka ukuran teks tidak akan berubah.
 * 
 * Perhitungan dan perubahan ukuran teks ditrigger saat,
 * - Component mount
 * - Perubahan width pada container 
 * - Perubahan width dan height pada viewport
 * 
 * Style dapat diatur melalui props `style` walaupun secara default menggunakan `className` yang menerapkan style berikut,
 * ```js
 * { margin: '0 auto',  whiteSpace: 'nowrap', textAlign: 'center' }
 * ```
 * @param {Omit<HTMLMotionProps<any>, 'className'> & TextFitContainerProps} props TextFitContainer props
 * @returns {React.ReactElement} Rendered component
 */
const TextFitContainer = ({ containerRef, as = 'span', children, ...props }) => {
    const { width, height } = useWindowSize();
    const textRef = React.useRef(null);
    const TextElement = motion[as] ?? motion['span'];

    const resizeText = () => {
        if (!containerRef) return;

        const container = containerRef.current;
        const text = textRef.current;

        if (!container || !text) return;

        const containerWidth = container.offsetWidth;
        let min = 1;
        let max = 2500;

        while (min <= max) {
            const mid = Math.floor((min + max) / 2);
            text.style.fontSize = mid + "px";

            if (text.offsetWidth <= containerWidth) {
                min = mid + 1;
            } else {
                max = mid - 1;
            }
        }

        text.style.fontSize = max + "px";
    }

    React.useEffect(() => {
        if (containerRef?.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    if (entry.contentRect.width) {
                        resizeText();
                    }
                }
            })

            resizeObserver.observe(containerRef.current);

            return () => {
                resizeObserver.unobserve(containerRef.current);
            }
        }
    }, [containerRef, resizeText]);

    React.useEffect(() => {
        resizeText();
    }, [width, height]);

    return (
        <TextElement
            style={{
                margin: "0 auto",
                whiteSpace: "nowrap",
                textAlign: "center",
            }}
            ref={textRef}
        >
            {children}
        </TextElement>
    )
}

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
    const { scrollYProgress: sectionScrollProgress } = useScroll({ target: sectionRef, smooth: 1 });
    const scrollContent = useTransform(sectionScrollProgress, [0, 1], ['12.5%', '-95%']);
    const iconX = useTransform(sectionScrollProgress, [0.44, 0.66], [0, 100])
    const iconLeft = useTransform(sectionScrollProgress, [0.44, 0.66], [(iconSize * -1), 0])

    const titleDelayOffset = 0.15;
    // TODOS update title text content
    const titleParaghraph = [
        ['Analytics'],
        ['that', 'helps', 'you'],
        ['shape', 'the', 'future']
    ]

    const findArrayIndexByString = (str, arr) => {
        if (!arr | !Array.isArray(arr)) return 0;
        const index = arr.indexOf(str);
        return index === -1 ? 0 : index;
    };

    const titleStaggered = shuffleArray(titleParaghraph.flat().map((_, index) => index * titleDelayOffset));

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
        },
        adjustWavingFlyIn: {
            baseDelay: titleStaggered[findArrayIndexByString(text, titleParaghraph.flat())],
        }
    })

    return (
        <div ref={sectionRef} id={'fitur'} className={`${styles.section} ${styles.fitur}`}>
            <div className={styles.fitur_wrapper}>
                <motion.div
                    className={styles.title}
                    style={{ '--icon-size': `${iconSize}px` }}
                    whileInView={'loremipsum'}
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
                viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
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
                viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
                transition={{ type: 'spring', delayChildren: delayAnims[1] }}
            >
                <HighlightText
                    text={title}
                    preset={'wavingTranslate'}
                    hookOptions={{
                        once: GLOBAL_VIEWPORT_ONCE
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
                viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
                transition={{ type: 'spring', delayChildren: delayAnims[2] }}
            >
                <motion.span
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
                            once: GLOBAL_VIEWPORT_ONCE
                        }}
                        adjustWavingColor={{
                            color: ['var(--logo-second-color)', 'var(--infoDark-color)', 'var(--logo-second-color)'],
                            scale: [1, 1.3, 1],
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
                    viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
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
                    viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
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
    { text: 'Features', target: 'fitur' },
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
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
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
                            smooth: true,
                            // TODOS offset only work when header height staticly 75px
                            offset: -75,
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
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
            {...getFooterTransition(false, 1, true)}
        />

        <motion.div
            className={styles.secondary}
            whileInView={'show'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
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