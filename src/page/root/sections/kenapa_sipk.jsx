'use client'

// #region TYPE DEPEDENCY
import { HTMLMotionProps } from 'framer-motion';
import { MatkulDummiesProps } from '@/constant/matkul_dummies';
// #endregion

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
} from '../config';
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
import { motion, AnimatePresence } from 'framer-motion';
import { SummaryDummy, HistoryDummy, ProgressDummy } from '@/component/Card';
import HighlightText from '@/component/motion/HighlightText';
import {
    MatkulDummies,
    MatkulDummiesNilaiBobot,
    MatkulDummiesNilaiColorPreset
} from '@/constant/matkul_dummies';
import { scroller } from 'react-scroll';
import { useInterval } from 'ahooks';
// #endregion

// #region UTIL DEPEDENCY
import { calculatePercentage, generateRandomNumber, generateRandomFloat, shuffleArray } from '../utils';
// #endregion

const layoutTransition = {
    layout: { type: 'spring', duration: 1, bounce: 0.3 }
}

/** @type {'hover' | 'tap' | 'both' | 'none'} */
const KENAPASIPK_ACTIVING_CONTENT_EVENT_TYPE = 'tap';

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
            initial={{ x: '100%', opacity: 0 }}
            whileInView={{ x: '0%', opacity: 1, transition: { ...transition, delay: 0.25 } }}
            transition={transition}
            {...props}
        >
            {children}
        </motion.div>
    )
}

/**
 * Component Description
 * @param {Omit<HTMLMotionProps<'div'>, 'className' | 'layout' | 'transition'>} props Wrapper props
 * @returns {React.ReactElement} Rendered component
 */
const Wrapper = ({ children, ...props }) => (
    <motion.div
        className={`${styles.wrapper} ${KENAPASIPK_ACTIVING_CONTENT_EVENT_TYPE === 'none' ? styles.without_action : ''}`}
        layout
        transition={{ ...layoutTransition }} {...props}
    >
        {children}
    </motion.div>
)

const Box = ({ contentNumber, type = 'x', setActiveContent, children }) => {
    const { width: viewportWidth } = useWindowSize();

    return (
        <motion.div
            className={`${styles.box} ${styles[type]}`}
            layout
            transition={{ ...layoutTransition }}
            viewport={{ amount: 1 }}
            onViewportEnter={() => {
                /*
                    While viewport < 1080, we render Box vertical instead horizontal and each box 
                    are expanded without being 'activated', so we need to control 'activeContent' while 
                    some Box fully enter viewport.
                */
                if (contentNumber && viewportWidth < 1080) setActiveContent(`active_${contentNumber}`);
            }}
        >
            {children}
        </motion.div>
    )
}

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
 * @type {ReturnType<typeof React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'> & BoxContentXProps>>}
 */
const BoxContentX = React.forwardRef(({
    data = MatkulDummies,
    penilaian = { style: MatkulDummiesNilaiColorPreset, bobot: MatkulDummiesNilaiBobot },
    maxSemester = 8,
    ...props
}, forwardedRef) => {
    const [matkul, setMatkul] = React.useState(/** @type {Array<Array<MatkulDummiesProps>>} */(Array.from({ length: maxSemester }, () => [])));
    const [addedMatkul, setAddedMatkul] = React.useState(/** @type {Array<MatkulDummiesProps>} */([]));
    const [activeMatkulIndex, setActiveMatkulIndex] = React.useState(0);
    const [total, setTotal] = React.useState({ ipk: 0, sks: 0, matkul: 0 });
    const [iteration, setIteration] = React.useState(0);

    /** 
     * Method untuk menghitung jumlah minimal dan maksimal card matakuliah yang dapat dibuat dengan menghitung 
     * height yang tersedia pada parent element dibagi dengan height yang dibutuhkan card. 
     * 
     * @returns {{min:number, max:number}} Jumlah `min` dan `max` card matakuliah yang dapat dibuat
    */
    const getMatkulMinMax = () => {
        if (forwardedRef.current) {
            const innerHeight = forwardedRef.current.getBoundingClientRect().height;
            const cardStyles = getComputedStyle(forwardedRef.current);
            const cardHeight = parseFloat(cardStyles.getPropertyValue('--matkul-card-height').trim().split('px')[0]);
            const cardGap = parseFloat(cardStyles.getPropertyValue('--matkul-card-gap').trim().split('rem')[0]) * 14;
            const max = Math.floor(innerHeight / (cardHeight + cardGap + 50)); // 50px (40px reserved space + 10px rounding error)
            const min = max - 2 > 0 ? max - 2 : 1;
            return { min, max };
        }

        return { min: 1, max: 1 };
    }

    /** 
     * Method untuk mengambil matakuliah secara acak dari `sourceArr` untuk jumlah semester yang ditentukan pada `maxSections` dengan jumlah minimal dan maksimal
     * matakuliah setiap semester yang diatur pada `random`.
     * 
     * @param {Object} [random] Jumlah minimal dan maksimal matakuliah setiap semester
     * @param {number} random.min Jumlah minimal matakuliah setiap semester, default : `2`
     * @param {number} random.max Jumlah maksimal matakuliah setiap semester, default : `4`
     * @param {Array<MatkulDummiesProps>} [sourceArr] Sumber data matakuliah, default : {@link data}
     * @param {number} [maxSections] Jumlah semester, default : {@link maxSemester}
     * @returns Return array dengan panjang jumlah semester dan setiap entry berisikan array yang berisikan matakuliah yang dipilih secara acak.
    */
    const generateMatkulSections = (random = { min: 2, max: 4 }, sourceArr = [...data], maxSections = maxSemester) => {
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

    /** 
     * Method untuk menghitung {@link total} jumlah sks, matakuliah dan perolehan IPK dari matakuliah yang tersedia pada state {@link addedMatkul}.
     * Hasil perhitungan akan digunakan untuk memperbarui nilai state {@link total} yang baru.
     * 
     * Saat `reset` bernilai true, method ini tidak akan menghitung dan memperbarui state {@link total} melainkan mereset state tersebut ke initial value.
     * 
     * @param {boolean} [reset] Boolean untuk reset state {@link total} ke initial value atau tidak, default : `false`
    */
    const calculateTotal = (reset = false) => {
        if (reset) {
            setTotal({ sks: 0, matkul: 0, ipk: 0 });
            return;
        }

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

    /** 
     * Method untuk memulai ulang animasi matakuliah dari awal dengan jeda yang ditentukan dengan melakukan hal berikut,
     * 
     * 1. Reset state {@link addedMatkul} dan {@link total}
     * 2. Mengambil matakuliah secara acak lagi dengan {@link generateMatkulSections}
     * 3. Buat jeda dengan `delay` untuk memulai animasi lagi
     * 
     * @param {number} [delay] Jeda dalam `ms`, default : `1250`
    */
    const resetAll = (delay = 1250) => {
        setAddedMatkul([]);
        setMatkul(generateMatkulSections(getMatkulMinMax()));
        setTimeout(() => {
            setActiveMatkulIndex(0);
            setIteration(x => x + 1);
        }, delay);
    }

    React.useEffect(() => { calculateTotal(!addedMatkul.length) }, [addedMatkul]);

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

    }, [maxSemester, iteration]);

    React.useEffect(() => { setMatkul(generateMatkulSections(getMatkulMinMax())) }, []);

    return (
        <motion.div
            ref={forwardedRef}
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
                        duration: 2.5,
                        delay: 0,
                    }}
                    style={{ boxShadow: 'none', borderRadius: '1rem', transformOrigin: 'top right' }}
                />
            </motion.div>

        </motion.div>
    )
});

const BoxContentY = React.forwardRef(({
    initialMatkulCount = 10,
    penilaian = { style: MatkulDummiesNilaiColorPreset, bobot: MatkulDummiesNilaiBobot },
    ...props
}, forwardedRef) => {
    const [matkul, setMatkul] = React.useState(
        /** @type {Array<MatkulDummiesProps>} */
        ([])
    )
    const [editableMatkul, setEditableMatkul] = React.useState(
        /** @type {Array<MatkulDummiesProps>} */
        ([MatkulDummies[0], MatkulDummies[2], MatkulDummies[3]])
    )
    const [total, setTotal] = React.useState({ ipk: 0, sks: 0, matkul: 0 });

    const getEditableMatkulMax = () => {
        if (forwardedRef.current) {
            const innerHeight = forwardedRef.current.getBoundingClientRect().height;
            const cardStyles = getComputedStyle(forwardedRef.current);
            const cardHeight = parseFloat(cardStyles.getPropertyValue('--matkul-card-height').trim().split('px')[0]);
            const cardGap = parseFloat(cardStyles.getPropertyValue('--matkul-card-gap').trim().split('rem')[0]) * 14;
            const max = Math.floor(innerHeight / (cardHeight + cardGap + 25)); // (25px reserved space)
            return max;
        }

        return 1;
    }

    const calculateTotal = () => {
        const totalMatkul = matkul.length + editableMatkul.length;
        const { totalSks } = [...matkul, ...editableMatkul].reduce((sum, current) => {
            return {
                totalSks: sum.totalSks + current.sks
            }
        }, { totalSks: 0 }
        );
        const { totalNilaiAkhir } = [...matkul, ...editableMatkul].reduce((sum, current) => {
            const { nama, sks, nilai: indeksNilai } = current;
            const bobot = penilaian.bobot[indeksNilai];
            return {
                totalNilaiAkhir: sum.totalNilaiAkhir + (sks * bobot)
            };
        }, { totalNilaiAkhir: 0 }
        );

        const totalIpk = Math.round((totalNilaiAkhir / totalSks) * 100) / 100;

        setTotal({ sks: totalSks, matkul: totalMatkul, ipk: totalIpk });
    }

    React.useEffect(() => {
        calculateTotal();
    }, [matkul, editableMatkul])

    useInterval(() => {
        var newMatkul = [];
        const matkuls = [...editableMatkul];
        const nilaiArr = Object.keys(MatkulDummiesNilaiBobot);

        matkuls.forEach((item) => {
            const sks = generateRandomNumber(1, 6);
            const randomIndex = generateRandomNumber(0, nilaiArr.length - 1);
            const nilai = nilaiArr[randomIndex];
            const newItem = { ...item, sks, nilai };
            newMatkul.push(newItem);
        })

        setEditableMatkul(newMatkul);
    }, 5000);

    React.useEffect(() => {
        const shuffledDummies = shuffleArray(MatkulDummies);
        setMatkul(shuffledDummies.slice(0, initialMatkulCount));
        setEditableMatkul(shuffledDummies.slice(0, getEditableMatkulMax()));
    }, [initialMatkulCount])

    return (
        <motion.div
            ref={forwardedRef}
            className={styles.inner}
            layout
            exit={{ opacity: 0 }}
            transition={{ ...layoutTransition }}
            {...props}
        >
            <motion.div
                className={styles.summary_anim}
                initial={{ opacity: 0, y: 150 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: 'spring',
                    duration: 1,
                    delay: 0.15,
                }}
            >
                <SummaryDummy
                    title={'IPK'}
                    color='var(--success-color)'
                    icon={{ name: 'FaRegStar', lib: 'fa' }}
                    data={{ value: total.ipk, percentage: calculatePercentage(total.ipk, 3.66), keterangan: `Targetmu 3.66` }}
                    style={{ marginTop: '0', boxShadow: 'none', borderRadius: '1rem' }}
                />
            </motion.div>

            <motion.div className={styles.matkul}>
                <motion.div
                    className={styles.matkul_anim}
                    initial={{ opacity: 0, y: -150 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        type: 'spring',
                        duration: 1,
                        delay: 0.15,
                    }}
                >
                    {editableMatkul.map((item, itemIndex) => (
                        <HistoryDummy
                            key={item.id}
                            item={item}
                            color={penilaian.style[item.nilai]}
                            style={{ boxShadow: 'none', borderRadius: '1rem', marginBottom: '0' }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
    )
})

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
 * @type {ReturnType<typeof React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'> & BoxContentZProps>>}
 */
const BoxContentZ = React.forwardRef(({
    value = { sks: 76, matkul: 31, ipk: 3.27 },
    target = { sks: 144, matkul: 50, ipk: 3.75 },
    generateNewNumber = false,
    newNumberRange = { sks: [50, 144], matkul: [32, 'target'], ipk: [1.25, 4.00] },
    newNumberInterval = 5000,
    ...props
}, forwardedRef) => {
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
            ref={forwardedRef}
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
        <motion.h3 className={styles.title_small}
        >
            {title}
        </motion.h3>

        <motion.p className={styles.title_small_description}>
            {description}
        </motion.p>
    </motion.div>
)

const Progress = ({ text = '1', active = false }) => (
    <motion.div className={`${styles.progress} ${active ? styles.active : ''}`} layout>
        {text}
    </motion.div>
)

const KenapaSipk = ({ contents = ['x', 'y', 'z'], useAutoplay = false, autoplayOptions = { countdown: 5, pollingRate: 0.1 } }) => {
    const { countdown = 10, pollingRate = 0.1 } = autoplayOptions;
    const [autoplayCountdown, setAutoplayCountdown] = React.useState(countdown);
    const [isSleeping, setIsSleeping] = React.useState(false);

    const autoplayRef = React.useRef(null);
    /** @type {React.MutableRefObject<HTMLDivElement>} */
    const sectionRef = React.useRef(null);

    const [contentShowed, setContentShowed] = React.useState(false);
    const [activeContent, setActiveContent] = React.useState('active_1');

    const { width: viewportWidth } = useWindowSize();

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

    /** 
     * @param {boolean} [cycle]
     * @param {boolean} [sectionSlide]
     */
    const handleSlideNextContent = (cycle = true, sectionSlide = false) => {
        const currentContentNumber = parseInt(activeContent.split('_')[1]);
        const nextContentNumber = currentContentNumber + 1;
        const isCorner = nextContentNumber > contents.length;

        if (isCorner && !cycle && !sectionSlide) return;
        if (isCorner && sectionSlide && !cycle) {
            if (sectionRef.current && sectionRef.current.nextElementSibling) {
                scroller.scrollTo(sectionRef.current.nextElementSibling.id, { offset: -75, smooth: true });
                sectionRef.current.nextElementSibling.focus();
            }
            return;
        }
        if (useAutoplay) { setIsSleeping(true); clearInterval(autoplayRef.current); }

        if (viewportWidth < 1080) {
            if (!isCorner) scroller.scrollTo(`why-ct-${nextContentNumber}`, { offset: -75, smooth: true });
            else scroller.scrollTo('kenapa_sipk', { offset: -75, duration: 0 });
        } else {
            setActiveContent(isCorner ? 'active_1' : `active_${nextContentNumber}`)
        }

        setTimeout(() => {
            if (useAutoplay) {
                setIsSleeping(false);
            }
        }, 1000)
    }

    /** 
     * @param {boolean} [cycle]
     * @param {boolean} [sectionSlide] 
     */
    const handleSlidePrevContent = (cycle = true, sectionSlide = false) => {
        const currentContentNumber = parseInt(activeContent.split('_')[1]);
        const prevContentNumber = currentContentNumber - 1;
        const isCorner = prevContentNumber <= 0;

        if (isCorner && !cycle && !sectionSlide) return;
        if (isCorner && sectionSlide && !cycle) {
            if (sectionRef.current && sectionRef.current.previousElementSibling) {
                scroller.scrollTo(sectionRef.current.previousElementSibling.id, { offset: -75, smooth: true });

                const focusableElements = sectionRef.current.previousElementSibling.querySelectorAll('[tabIndex="0"]');
                const lastFocusableElement = focusableElements[focusableElements.length - 1];

                if (lastFocusableElement) lastFocusableElement.focus();
                else sectionRef.current.previousElementSibling.focus();
            }
            return;
        }
        if (useAutoplay) { setIsSleeping(true); clearInterval(autoplayRef.current); }

        if (viewportWidth < 1080) {
            if (!isCorner) {
                if (prevContentNumber === 1) scroller.scrollTo('kenapa_sipk', { offset: -75, smooth: true });
                else scroller.scrollTo(`why-ct-${prevContentNumber}`, { offset: -75, smooth: true });
            }
            else scroller.scrollTo(`why-ct-${3}`, { offset: -75, duration: 0 });
        } else {
            setActiveContent(isCorner ? 'active_3' : `active_${prevContentNumber}`);
        }

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

    /** @param {React.KeyboardEvent} event */
    const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
            if (event.shiftKey) {
                event.preventDefault();
                handleSlidePrevContent(false, true);
            }
            else {
                event.preventDefault();
                handleSlideNextContent(false, true)
            }
        } else {
            if (event.key === 'ArrowLeft') { event.preventDefault(); handleSlidePrevContent(true, false); }
            if (event.key === 'ArrowRight') { event.preventDefault(); handleSlideNextContent(true, false); }
        }
    }

    const resolveActionProps = (contentNumber) => {
        const x = KENAPASIPK_ACTIVING_CONTENT_EVENT_TYPE;
        if (x === 'hover') return ({ onHoverStart: () => { handleHoverStart(contentNumber) }, onHoverEnd: handleHoverEnd })
        else if (x === 'tap') return ({ onTap: () => { handleTap(contentNumber) } })
        else if (x === 'both') ({ onTap: () => { handleTap(contentNumber) }, onHoverStart: () => { handleHoverStart(contentNumber) }, onHoverEnd: handleHoverEnd })
        else return {};
    }

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
            handleSlideNextContent();
        }
    }, [autoplayCountdown])

    return (
        <section
            ref={sectionRef}
            id={'kenapa_sipk'}
            tabIndex={viewportWidth < 1080 ? -1 : 0}
            className={`${styles.section} ${styles.kenapa_sipk}`}
            onKeyDown={handleKeyDown}
        >
            <motion.h2
                className={styles.title}
                initial={{ visibility: 'hidden' }}
                variants={{ inView: { visibility: 'visible' } }}
                whileInView={'inView'}
                viewport={{
                    once: GLOBAL_VIEWPORT_ONCE,
                    amount: 1
                }}
            >
                <HighlightText
                    useHook={false}
                    text={'Kenapa Harus Pakai SIPK?'}
                    preset={'wavingFlyIn'}
                    presetOptions={{
                        wordStagger: 'first',
                        makeVariant: true,
                        variantName: 'inView'
                    }}
                    adjustWavingFlyIn={{
                        y: [-225, 0],
                        bounce: 0.15,
                        delay: 0.25,
                        wordWrapperStyle: { overflow: 'auto' }
                    }}
                />
            </motion.h2>

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


                <Wrapper
                    id={'why-ct-1'}
                    aria-label={'Hitung IPK dengan Mudah menggunakan SIPK'}
                    {...resolveActionProps(1)}
                    tabIndex={viewportWidth < 1080 ? 0 : -1}
                >
                    <Box contentNumber={1} type={'x'} setActiveContent={setActiveContent}>
                        <AnimatePresence mode={'popLayout'}>
                            {activeContent.split('_')[1] === '1' && contentShowed && (
                                <BoxContentX />
                            )}
                        </AnimatePresence>
                    </Box>

                    <Details type={'x'}>
                        <Progress text={'1'} active={activeContent.split('_')[1] === '1'} />
                        <Text
                            title={'Hitung IPK dengan Mudah'}
                            description={'Dengan SIPK kalian dapat mengetahui perolehan IPK sedini mungkin bahkan dengan matakuliah yang belum kalian tempuh dan tentu saja dengan semua skenario nilai yang kalian atur sendiri.'}
                            active={activeContent.split('_')[1] === '1'}
                        />
                    </Details>
                </Wrapper>

                <Wrapper
                    id={'why-ct-2'}
                    aria-label={'Perubahan IPK Secara Cepat menggunakan SIPK'}
                    {...resolveActionProps(2)}
                    tabIndex={viewportWidth < 1080 ? 0 : -1}
                >
                    <Box contentNumber={2} type={'y'} setActiveContent={setActiveContent}>
                        <AnimatePresence mode={'popLayout'}>
                            {activeContent.split('_')[1] === '2' && contentShowed && (
                                <BoxContentY />
                            )}
                        </AnimatePresence>
                    </Box>

                    <Details type={'y'}>
                        <Progress text={'2'} active={activeContent.split('_')[1] === '2'} />
                        <Text
                            title={'Perubahan IPK Secara Cepat'}
                            description={'Kalian bisa mengubah atribut matakuliah seperti nama, semester, bahkan SKS dan nilai kapan saja. Setiap perubahan langsung dihitung ulang sehingga IPK terbaru langsung dihitung secara instan.'}
                            active={activeContent.split('_')[1] === '2'}
                        />
                    </Details>
                </Wrapper>

                <Wrapper
                    id={'why-ct-3'}
                    aria-label={'Lacak Target dan Progress menggunakan SIPK'}
                    {...resolveActionProps(3)}
                    tabIndex={viewportWidth < 1080 ? 0 : -1}
                >
                    <Box contentNumber={3} type={'z'} setActiveContent={setActiveContent}>
                        <AnimatePresence mode={'popLayout'}>
                            {activeContent.split('_')[1] === '3' && contentShowed && (
                                <BoxContentZ generateNewNumber={true} />
                            )}
                        </AnimatePresence>
                    </Box>

                    <Details type={'z'}>
                        <Progress text={'3'} active={activeContent.split('_')[1] === '3'} />
                        <Text
                            title={'Lacak Target dan Progress'}
                            description={'Raih target akademik kalian dengan SIPK! Atur target IPK, SKS, dan jumlah matakuliah untuk kelulusan kalian. Kalian juga dapat menambahkan target nilai untuk setiap matakuliah saat menambahkan matakuliah.'}
                            active={activeContent.split('_')[1] === '3'}
                        />
                    </Details>
                </Wrapper>
            </Content>
        </section>
    )
}

export default KenapaSipk;