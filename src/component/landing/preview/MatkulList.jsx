// #region TYPE DEPEDENCY
import { MatkulDummiesProps, MatkulDummiesNilai } from '../variables/MatkulDummies';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
// #endregion

// #region UTIL DEPEDENCY
import { getCommonAnimationVariants } from '@/component/motion/_helper';
// #endregion

// #region DATA DEPEDENCY
import { MatkulDummies, MatkulDummiesNilaiBobot, MatkulDummiesNilaiColorPreset } from '../variables/MatkulDummies';
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/matkul_list.module.css';
// #endregion

const MatkulList = (
    {
        dummiesRange = [0, 15],
        maximumMatkul = 5,
        minimumMatkul = 1,
    }
) => {
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [matkul, setMatkul] = React.useState(MatkulDummies.slice(dummiesRange[0], dummiesRange[1]).slice(0, maximumMatkul));
    const [lastItemId, setLastItemId] = React.useState(null);
    const nilaiColorEntries = Object.entries(MatkulDummiesNilaiColorPreset);

    // #region Refactorable Variables
    const baseAnimDelay = 0.3;
    const containerAnimDuration = 0.4;
    // #endregion

    const isMatkulReady = () => {
        if (isAnimating) { console.warn('Animation still playing!'); return false; }
        if (matkul.length <= minimumMatkul) { console.warn('Matkul reach minimum length!'); return false; }

        return true;
    }

    const pop = (targetIndex = Math.floor(Math.random() * matkul.length)) => {
        // Pop one item in matkul with specific index 'targetIndex'. 
        // If targetIndex not provided, index will picked randomly
        // Return when matkul.length <= 1 (to make sure matkul not empty)
        // Return when targetIndex >= matkul.length or targetIndex < 0
        if (isAnimating) {
            console.warn('Animation still playing');
            return;
        }
        if (matkul.length <= minimumMatkul) {
            console.warn('Cant pop matkul item, matkul length reach minimum length');
            return;
        }
        if (targetIndex >= matkul.length || targetIndex < 0) {
            console.warn('Target index cant be negative or more than equal matkul length');
            return;
        }

        setIsAnimating(true);
        const clone = [...matkul];
        clone.splice(targetIndex, 1);
        setMatkul(clone);
        setIsAnimating(false);
    }

    /**
     * Hapus beberapa item matakuliah dari state `matkul` secara acak dengan batas tertentu,
     * ```js
     * const maxCount = matkul.length - minimumMatkul;
     * ```
     * Jika `count` melebihi batas atau bernilai `<= 0`, maka `count` akan dipilih ulang secara acak.
     * @param {number} [count] - Jumlah item yang ingin dihapus
     * @example 
     * ```js
     * const maxCount = 4;
     * popSome() // Hapus 'x' item secara acak
     * popSome(4) // Hapus 4 item secara acak 
     * popSome(5) // Hapus 'x' item secara acak
     * popSome(3) // Hapus 3 item secara acak 
     * popSome(0) // Hapus 'x' item secara acak
     * popSome(-2) // Hapus 'x' item secara acak
     * ```
     */
    const popSome = (count) => {
        if (!isMatkulReady()) return;

        setIsAnimating(true);
        const maxPop = matkul.length - minimumMatkul;
        const countPop = (count && count > 0 && count <= maxPop) ? count : Math.floor(Math.random() * (maxPop - 1 + 1)) + 1;

        const indexToPop = new Set();
        while (indexToPop.size < countPop) {
            const randomIndex = Math.floor(Math.random() * matkul.length);
            indexToPop.add(randomIndex);
        }

        const clone = [...matkul];
        const delay = 750;

        const popWithDelay = (indexArray, i) => {
            if (i >= indexArray.length) {
                setTimeout(() => {
                    setIsAnimating(false);
                }, (delay / 2));
                return;
            }

            const x = indexArray[i];

            clone.splice(x, 1, undefined);
            setMatkul([...clone].filter(item => typeof item === 'object'));

            setTimeout(() => {
                popWithDelay(indexArray, i + 1);
            }, delay);
        }

        popWithDelay([...indexToPop], 0);
    }

    const reset = () => {
        if (isAnimating) {
            console.warn('Animation still playing');
            return;
        }
        if (matkul.length >= maximumMatkul) return;

        setIsAnimating(true);
        const reset = MatkulDummies.slice(dummiesRange[0], dummiesRange[1]).slice(0, maximumMatkul);
        setMatkul(reset);
        setIsAnimating(false);
    }

    const mix = (targetIndex = Math.floor(Math.random() * matkul.length)) => {
        // Mix (pop & add new unique one) item in matkul with specific index 'targetIndex'. 
        // If targetIndex not provided, index will picked randomly
        // Return when matkul.length <= 1 (to make sure matkul not empty)
        // Return when targetIndex >= matkul.length or targetIndex < 0
        if (isAnimating) {
            console.warn('Animation still playing');
            return;
        }
        if (matkul.length <= minimumMatkul) {
            console.warn('Cant mix matkul item, matkul length reach minimum length');
            return;
        }
        if (targetIndex >= matkul.length || targetIndex < 0) {
            console.warn('Target index cant be negative or more than equal matkul length');
            return;
        }

        setIsAnimating(true);
        const clone = [...matkul];
        const available = MatkulDummies.slice(dummiesRange[0], dummiesRange[1]).filter(x =>
            !matkul.some(y => y.id === x.id)
        );
        const newItem = available[Math.floor(Math.random() * (available.length - 1))];
        clone.splice(targetIndex, 1, newItem)
        setLastItemId(newItem.id);
        setMatkul(clone);
    }

    /**
     * Update beberapa item matakuliah dari state `matkul` secara acak dengan batas tertentu,
     * ```js
     * const maxCount = matkul.length - minimumMatkul;
     * ```
     * Jika `count` melebihi batas atau bernilai `<= 0`, maka `count` akan dipilih ulang secara acak.
     * @param {number} [count] - Jumlah item yang ingin diupdate
     * @example 
     * ```js
     * const maxCount = 4;
     * mixSome() // Update 'x' item secara acak
     * mixSome(4) // Update 4 item secara acak 
     * mixSome(5) // Update 'x' item secara acak
     * mixSome(3) // Update 3 item secara acak 
     * mixSome(0) // Update 'x' item secara acak
     * mixSome(-2) // Update 'x' item secara acak
     * ```
     */
    const mixSome = (count) => {
        if (!isMatkulReady()) return;

        setIsAnimating(true);
        const maxMix = matkul.length - minimumMatkul;
        const countMix = (count && count > 0 && count <= maxMix) ? count : Math.floor(Math.random() * (maxMix - 1 + 1)) + 1;

        const indexToMix = new Set();
        while (indexToMix.size < countMix) {
            const randomIndex = Math.floor(Math.random() * matkul.length);
            indexToMix.add(randomIndex);
        }

        const available = MatkulDummies.slice(dummiesRange[0], dummiesRange[1]).filter(x =>
            !matkul.some(y => y.id === x.id)
        );

        const clone = [...matkul];
        const delay = 750;

        const mixWithDelay = (indexArray, i) => {
            if (i >= indexArray.length) return;

            const x = indexArray[i];

            if (available.length) {
                const indexNewItem = Math.floor(Math.random() * available.length);
                const newItem = available[indexNewItem];
                available.splice(indexNewItem, 1); // Remove picked item in available array to ensure matkul always unique
                clone.splice(x, 1, newItem); // Update clone array
                setMatkul([...clone]); // setMatkul

                if (i + 1 >= indexArray.length) {
                    setLastItemId(newItem.id);
                }
            }

            setTimeout(() => {
                mixWithDelay(indexArray, i + 1);
            }, delay);
        };

        mixWithDelay([...indexToMix], 0);
    }

    const editNilaiClick = (id) => {
        setMatkul((prevMatkul) =>
            prevMatkul.map((item) =>
                item.id === id ? { ...item, nilai: generateNilai(item.nilai) } : item
            )
        );
    }

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
                delay: baseAnimDelay,
                duration: containerAnimDuration,
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: '1px solid red',
                    width: '50%',
                    height: '25%',
                    borderRadius: '.2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    zIndex: 99,
                }}
            >
                <span style={{ marginLeft: '5px', marginBottom: '5px' }} onClick={() => { reset() }}>Reset</span>
                <span style={{ marginLeft: '5px', marginBottom: '5px' }} onClick={() => { pop() }}>Pop</span>
                <span style={{ marginLeft: '5px', marginBottom: '5px' }} onClick={() => { mix() }}>Mix</span>
                <span style={{ marginLeft: '5px', marginBottom: '5px' }} onClick={() => { popSome() }}>Pop Some</span>
                <span style={{ marginLeft: '5px', marginBottom: '5px' }} onClick={() => { mixSome() }}>Mix Some</span>
            </div>
            <div
                style={{
                    position: 'absolute',
                    top: '15%',
                    left: '90%',
                    transform: 'translate(-90%, -15%)',
                    display: 'flex',
                    width: '50%',
                    border: 'none',
                    gap: '.5rem',
                    zIndex: 99
                }}
            >
                <span>{isAnimating ? 'Loading' : 'Shuffle'}</span>
                <span
                    onClick={() => {
                        setIsAnimating(false);
                        setLastItemId(null);
                    }}
                >
                    Reset State
                </span>
            </div>
            <div className={styles.title}>
                Semester 1
            </div>
            <AnimatePresence>
                {matkul.map((item, index) => (
                    <motion.div
                        key={`aserehe-${item.id}`}
                        className={styles.matkul}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                            transition: {
                                delay: baseAnimDelay + containerAnimDuration + ((index + 1) * 0.1)
                            }
                        }}
                        viewport={{ once: true }}
                        exit={{
                            opacity: 0,
                            scale: 0,
                            transition: {
                                duration: baseAnimDelay
                            }
                        }}
                        onClick={() => { editNilaiClick(item.id); }}
                        onAnimationComplete={() => {
                            if (lastItemId && lastItemId === item.id) {
                                setIsAnimating(false);
                                setLastItemId(null);
                            }
                        }}
                        layout
                    >
                        <div className={styles.nama}>
                            <div className={styles.text}>
                                {item.nama}
                            </div>
                        </div>

                        <div className={styles.sks}>
                            {`${item.sks} SKS`}
                        </div>

                        <Swiper
                            slidesPerView={1}
                            spaceBetween={50}
                            centeredSlides={true}
                            className={styles.swiper}
                            initialSlide={nilaiColorEntries.findIndex(([nilai]) => nilai === item.nilai)}
                        >
                            {nilaiColorEntries.map(([key, value]) => (
                                <SwiperSlide
                                    key={`SwiperSlideNilai-${item.id}-${key}`}
                                    style={{ position: 'relative' }}
                                >
                                    <div className={`${styles.nilai} ${styles[value]}`}>
                                        {key}
                                    </div>
                                </SwiperSlide>
                            ))}

                        </Swiper>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    )
}

// #region Utils

/**
 * Method untuk generate random nilai
 * @param {Array<MatkulDummiesNilai> | MatkulDummiesNilai} exclude 
 * Nilai terkecuali dalam array atau string
 * @example 
 * ```js
 * // generate nilai random selain 'A', 'B+' dan 'E'
 * console.log(generateNilai(['A', 'B+', 'E']))
 * // generate nilai random selain 'C'
 * console.log(generateNilai('C'))
 * ```
 * @returns {MatkulDummiesNilai} Nilai random atau acak dalam string
 */
const generateNilai = (exclude) => {
    const nilai = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];
    const refArray = typeof exclude === 'string' ? [exclude] : exclude;
    const filteredNilai = Array.isArray(refArray) ? nilai.filter(n => !refArray.includes(n)) : nilai;
    return filteredNilai[Math.floor(Math.random() * filteredNilai.length)];
}

// #endregion

export default MatkulList;