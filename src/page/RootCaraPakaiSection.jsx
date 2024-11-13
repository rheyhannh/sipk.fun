'use client'

// #region TYPE DEPEDENCY
import { HTMLMotionProps } from 'framer-motion';
import { MatkulDummiesProps } from '@/component/landing/variables/MatkulDummies';
// #endregion

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
} from './RootConfig';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, AnimatePresence } from 'framer-motion';
import { SummaryDummy, HistoryDummy, ProgressDummy } from '@/component/Card';
import HighlightText from '@/component/motion/HighlightText';
import {
    MatkulDummies,
    MatkulDummiesNilaiBobot,
    MatkulDummiesNilaiColorPreset
} from '@/component/landing/variables/MatkulDummies';
// #endregion

// #region UTIL DEPEDENCY
import { calculatePercentage, generateRandomNumber, generateRandomFloat } from './RootUtils';
// #endregion

const layoutTransition = {
    layout: { type: 'spring', duration: 1, bounce: 0.3 }
}

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

const CaraPakai = ({ contents = ['x', 'y', 'z'], useAutoplay = false, autoplayOptions = { countdown: 5, pollingRate: 0.1 } }) => {
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

export default CaraPakai;