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

// #region Types 

/**
 * State apakah animasi sedang berjalan atau tidak. Gunakan state ini agar tidak ada konflik saat melakukan perubahan pada state `matkul`
 * @typedef {boolean} isAnimating
 */

/**
 * State id item matakuliah terakhir saat animasi berakhir atau saat perubahan `matkul` selesai. 
 * Item dengan id ini akan mengupdate state `isAnimating` yang menandakan animasi atau perubahan telah selesai
 * @typedef {string} LastItemId
 */

/**
 * State dengan array yang berisikan `MatkulDummies` digunakan untuk preview.
 * Kontrol jumlah dan range index yang digunakan melalui component props `dummiesRange`, jumlah maksimal
 * dan minimal matakuliah yang tampil pada props `maximumMatkul` dan `minimumMatkul`.
 * 
 * ```js
 * // Menggunakan 15 item dari 'MatkulDummies' dengan index 0 - 14
 * const dummiesRange = [0, 15]; 
 * // Maksimal matakuliah yang tampil berjumlah 5
 * const maximumMatkul = 5; 
 * // Minimum matakuliah yang tampil berjumlah 1
 * const minimumMatkul = 1;
 * ```
 * @typedef {Array<MatkulDummiesProps>} Matkul 
 */

/**
 * State dengan object yang berisikan detail dari matkul yang digunakan dengan key `totalNilai`, `totalSks` dan `ip`
 * @typedef {Object} MatkulDetails 
 * @property {number} totalNilai Total nilai dari matkul yang digunakan
 * @property {number} totalSks Total sks dari matkul yang digunakan
 * @property {number} ip Indeks prestasi dari `(totalNilai / totalSks)`
 */

// #endregion

const MatkulList = (
    {
        dummiesRange = [0, 15],
        maximumMatkul = 5,
        minimumMatkul = 1,
    }
) => {
    /** @type {ReturnType<typeof React.useState<isAnimating>>} */
    const [isAnimating, setIsAnimating] = React.useState(false);
    /** @type {ReturnType<typeof React.useState<Matkul>>} */
    const [matkul, setMatkul] = React.useState(MatkulDummies.slice(dummiesRange[0], dummiesRange[1]).slice(0, maximumMatkul));
    /** @type {ReturnType<typeof React.useState<LastItemId>>} */
    const [lastItemId, setLastItemId] = React.useState(null);
    /** @type {ReturnType<typeof React.useState<MatkulDetails>>} */
    const [matkulDetails, setMatkulDetails] = React.useState({ totalNilai: 0, totalSks: 0, ip: 0 });
    const nilaiColorEntries = Object.entries(MatkulDummiesNilaiColorPreset);

    // #region Refactorable Variables
    const baseAnimDelay = 0.3;
    const containerAnimDuration = 0.4;
    // #endregion

    /**
     * Cek apakah perubahan pada state `matkul` dapat dilakukan. 
     * Selalu gunakan method ini jika ingin melakukan perubahan pada state `matkul` untuk menghindari konflik
     * perubahan state atau animasi yang tidak biasa.
     * @param {'mix' | 'pop' | 'add' | 'reset'} type Tipe operasi yang dilakukan
     */
    const isMatkulReady = (type) => {
        if (isAnimating) { console.warn('Animation still playing!'); return false; }
        if ((type === 'mix' || type === 'pop') && matkul.length <= minimumMatkul) { console.warn('Matkul reach minimum length!'); return false; }
        if ((type === 'add' || type === 'reset') && matkul.length >= maximumMatkul) { console.warn('Matkul reach maximum length!'); return false; }

        return true;
    }

    /**
     * Tambah beberapa item matakuliah dari state `matkul` secara acak dengan batas tertentu,
     * ```js
     * const maxCount = maximumMatkul - matkul.length;
     * ```
     * Jika `count` melebihi batas atau bernilai `<= 0`, maka `count` akan dipilih ulang secara acak.
     * @param {number} [count] - Jumlah item yang ingin ditambah
     * @param {number} [delay] - Delay animasi dalam `ms`, default : `350`
     * @example 
     * ```js
     * const maxCount = 4;
     * addSome() // Tambah 'x' item secara acak
     * addSome(4) // Tambah 4 item secara acak 
     * addSome(5) // Tambah 'x' item secara acak
     * addSome(3) // Tambah 3 item secara acak 
     * addSome(0) // Tambah 'x' item secara acak
     * addSome(-2) // Tambah 'x' item secara acak
     * ```
     */
    const addSome = (count, delay = 350) => {
        if (!isMatkulReady('add')) return;

        setIsAnimating(true);
        const maxAdd = maximumMatkul - matkul.length;
        const countAdd = (count && count > 0 && count <= maxAdd) ? count : Math.floor(Math.random() * (maxAdd - 1 + 1) + 1);

        const indexToAdd = new Set();
        while (indexToAdd.size < countAdd) {
            const randomIndex = Math.floor(Math.random() * matkul.length);
            indexToAdd.add(randomIndex);
        }

        const available = MatkulDummies.slice(dummiesRange[0], dummiesRange[1]).filter(x =>
            !matkul.some(y => y.id === x.id)
        );

        const clone = [...matkul];

        const addWithDelay = (indexArray, i) => {
            if (i >= indexArray.length) return;

            const x = indexArray[i];

            if (available.length) {
                const indexNewItem = Math.floor(Math.random() * available.length);
                const newItem = available[indexNewItem];
                available.splice(indexNewItem, 1); // Remove picked item in available array to ensure matkul always unique
                clone.splice(x, 0, newItem); // Update clone array
                setMatkul([...clone]); // setMatkul

                if (i + 1 >= indexArray.length) {
                    setLastItemId(newItem.id);
                }
            }

            setTimeout(() => {
                addWithDelay(indexArray, i + 1);
            }, delay);
        }

        addWithDelay([...indexToAdd], 0);
    }

    /**
     * Hapus beberapa item matakuliah dari state `matkul` secara acak dengan batas tertentu,
     * ```js
     * const maxCount = matkul.length - minimumMatkul;
     * ```
     * Jika `count` melebihi batas atau bernilai `<= 0`, maka `count` akan dipilih ulang secara acak.
     * @param {number} [count] - Jumlah item yang ingin dihapus
     * @param {number} [delay] - Delay animasi dalam `ms`, default : `750`
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
    const popSome = (count, delay = 750) => {
        if (!isMatkulReady('pop')) return;

        setIsAnimating(true);
        const maxPop = matkul.length - minimumMatkul;
        const countPop = (count && count > 0 && count <= maxPop) ? count : Math.floor(Math.random() * (maxPop - 1 + 1)) + 1;

        const indexToPop = new Set();
        while (indexToPop.size < countPop) {
            const randomIndex = Math.floor(Math.random() * matkul.length);
            indexToPop.add(randomIndex);
        }

        const clone = [...matkul];

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

    /**
     * Update beberapa item matakuliah dari state `matkul` secara acak dengan batas tertentu,
     * ```js
     * const maxCount = matkul.length - minimumMatkul;
     * ```
     * Jika `count` melebihi batas atau bernilai `<= 0`, maka `count` akan dipilih ulang secara acak.
     * @param {number} [count] - Jumlah item yang ingin diupdate
     * @param {number} [delay] - Delay animasi dalam `ms`, default : `750`
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
    const mixSome = (count, delay = 750) => {
        if (!isMatkulReady('mix')) return;

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

    const reset = () => {
        if (!isMatkulReady('reset')) return;

        setIsAnimating(true);
        const reset = MatkulDummies.slice(dummiesRange[0], dummiesRange[1]).slice(0, maximumMatkul);
        setMatkul(reset);
        setIsAnimating(false);
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
                <span style={{ marginLeft: '5px', marginBottom: '5px' }} onClick={() => { addSome() }}>Add Some</span>
                <span style={{ marginLeft: '5px', marginBottom: '5px' }} onClick={() => { popSome() }}>Pop Some</span>
                <span style={{ marginLeft: '5px', marginBottom: '5px' }} onClick={() => { mixSome() }}>Mix Some</span>
                <span style={{ marginLeft: '5px', marginBottom: '5px' }} onClick={() => { matkul.forEach((item) => console.log(`${item.nama} : ${item.nilai}`)) }}>Log Nilai</span>
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
                        key={`MatkulListItem-${item.id}`}
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