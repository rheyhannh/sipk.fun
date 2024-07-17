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
        title,
        renderTestElement = false,
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
    const [swipers, setSwipers] = React.useState({});
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
     * - Jika count angka dan `> maxCount` atau bernilai `<= 0`, maka `count` akan dipilih ulang secara acak.
     * - Jika count array dengan length `>= maxCount` atau `<= 0` atau setiap element array bukan `number` atau setiap element array `>= maximumMatkul`, maka `count` akan dipilih ulang secara acak.
     * @param {number | Array<number>} [count] - Jumlah item yang ingin ditambah dalam number atau array dengan index yang ingin ditambah
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
     * addSome(['0', 2]) // Tambah 'x' item secara acak
     * addSome([0, 3, 2]) // Tambah 3 item pada index 0, 3 dan 2
     * addSome([0, 3, 4, 1, 2]) // Tambah 'x' item secara acak
     * addSome([0, 1, 1, 0]) // Tambah 2 item pada index 0 dan 1
     * ```
     */
    const addSome = (count, delay = 350) => {
        if (!isMatkulReady('add')) return;

        setIsAnimating(true);
        const maxAdd = maximumMatkul - matkul.length;
        const countAdd = (count && count > 0 && count <= maxAdd) ? count : Math.floor((Math.random() * maxAdd) + 1);
        const countArray = (Array.isArray(count) && count.length > 0 && count.length <= maxAdd && count.every((x) => (typeof x === 'number' && x < maximumMatkul))) ? count : undefined;

        const arrIndex = countArray ?? [];
        if (!countArray) {
            while (arrIndex.length < countAdd) {
                const randomIndex = Math.floor(Math.random() * matkul.length);
                arrIndex.push(randomIndex);
            }
        }

        const indexToAdd = new Set(arrIndex);
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
     * - Jika count angka dan `> maxCount` atau bernilai `<= 0`, maka `count` akan dipilih ulang secara acak.
     * - Jika count array dengan length `>= maxCount` atau `<= 0` atau setiap element array bukan `number` atau setiap element array `>= matkul.length`, maka `count` akan dipilih ulang secara acak.
     * @param {number | Array<number>} [count] - Jumlah item yang ingin dihapus dalam number atau array dengan index yang ingin dihapus
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
     * popSome(['0', 2]) // Hapus 'x' item secara acak
     * popSome([0, 3, 2]) // Hapus 3 item pada index 0, 3 dan 2
     * popSome([0, 3, 4, 1, 2]) // Hapus 'x' item secara acak
     * popSome([0, 1, 1, 0]) // Hapus 2 item pada index 0 dan 1
     * ```
     */
    const popSome = (count, delay = 750) => {
        if (!isMatkulReady('pop')) return;

        setIsAnimating(true);
        const maxPop = matkul.length - minimumMatkul;
        const countPop = (count && count > 0 && count <= maxPop) ? count : Math.floor(Math.random() * maxPop) + 1;
        const countArray = (Array.isArray(count) && count.length > 0 && count.length <= maxPop && count.every((x) => (typeof x === 'number' && x < matkul.length))) ? count : undefined;

        const arrIndex = countArray ?? [];
        if (!countArray) {
            while (arrIndex.length < countPop) {
                const randomIndex = Math.floor(Math.random() * matkul.length);
                arrIndex.push(randomIndex);
            }
        }

        const indexToPop = new Set(arrIndex);
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
     * - Jika count angka dan `> maxCount` atau bernilai `<= 0`, maka `count` akan dipilih ulang secara acak.
     * - Jika count array dengan length `>= maxCount` atau `<= 0` atau setiap element array bukan `number` atau setiap element array `>= matkul.length`, maka `count` akan dipilih ulang secara acak.
     * @param {number | Array<number>} [count] - Jumlah item yang ingin diupdate dalam number atau array dengan index yang ingin diupdate
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
     * mixSome(['0', 2]) // Update 'x' item secara acak
     * mixSome([0, 3, 2]) // Update 3 item pada index 0, 3 dan 2
     * mixSome([0, 3, 4, 1, 2]) // Update 'x' item secara acak
     * mixSome([0, 1, 1, 0]) // Update 2 item pada index 0 dan 1
     * ```
     */
    const mixSome = (count, delay = 750) => {
        if (!isMatkulReady('mix')) return;

        setIsAnimating(true);
        const maxMix = matkul.length - minimumMatkul;
        const countMix = (count && count > 0 && count <= maxMix) ? count : Math.floor(Math.random() * maxMix) + 1;
        const countArray = (Array.isArray(count) && count.length > 0 && count.length <= maxMix && count.every((x) => (typeof x === 'number' && x < matkul.length))) ? count : undefined;

        const arrIndex = countArray ?? [];
        if (!countArray) {
            while (arrIndex.length < countMix) {
                const randomIndex = Math.floor(Math.random() * matkul.length);
                arrIndex.push(randomIndex);
            }
        }

        const indexToMix = new Set(arrIndex);
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

    const mixSomeNilai = (count, delay = 300, duration = 1000) => {
        if (!isMatkulReady('mix')) return;

        setIsAnimating(true);
        const maxMix = matkul.length;
        const countMix = (count && count > 0 && count <= maxMix) ? count : Math.floor(Math.random() * maxMix) + 1;
        const countArray = (Array.isArray(count) && count.length > 0 && count.length <= maxMix && count.every((x) => (typeof x === 'number' && x < matkul.length))) ? count : undefined;

        const arrIndex = countArray ?? [];
        if (!countArray) {
            while (arrIndex.length < countMix) {
                const randomIndex = Math.floor(Math.random() * matkul.length);
                arrIndex.push(randomIndex);
            }
        }

        const indexToMix = new Set(arrIndex);

        const mixWithDelay = (indexArray, i) => {
            if (i >= indexArray.length) {
                setTimeout(() => {
                    setIsAnimating(false);
                }, (delay / 2));
                return;
            }

            const item = matkul[indexArray[i]];

            if (swipers[item.id]) {
                const newNilai = generateNilai(item.nilai);
                const newNilaiSlideIndex = nilaiColorEntries.findIndex(([nilai]) => nilai === newNilai);
                if (newNilaiSlideIndex >= 0) {
                    swipers[item.id].slideTo(newNilaiSlideIndex, duration);
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

    const setSwiperSlide = (id, index, speed = 1000) => {
        if (!swipers[id] || swipers[id] === null) return;

        swipers[id].slideTo(index, speed);
    }

    const editNilaiOnScroll = (id, nilai) => {
        setMatkul((prevMatkul) =>
            prevMatkul.map((item) =>
                item.id === id ? { ...item, nilai: nilai ?? generateNilai(item.nilai) } : item
            )
        );
    }

    // Hapus x item pada 'matkul' agar tidak melebihi 'maximumMatkul'
    React.useEffect(() => {
        if (matkul.length > maximumMatkul) {
            popSome(matkul.length - maximumMatkul);
        }
    }, [maximumMatkul])

    // Perbarui 'matkulDetails' setiap ada perubahan pada 'matkul'
    React.useEffect(() => {
        const totalNilai = Math.round((matkul.reduce((acc, x) => acc + (MatkulDummiesNilaiBobot[x.nilai] * x.sks), 0)) * 100 / 100);
        const totalSks = matkul.reduce((acc, x) => acc + x.sks, 0);
        const ip = Math.round(((totalNilai / totalSks)) * 100 / 100);

        setMatkulDetails({ totalNilai, totalSks, ip });
    }, [matkul])

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
            {renderTestElement && <AnimationControllerTest matkul={matkul} reset={reset} addSome={addSome} popSome={popSome} mixSome={mixSome} mixSomeNilai={mixSomeNilai} />}
            {renderTestElement && <AnimationStateTest isAnimating={isAnimating} setIsAnimating={setIsAnimating} setLastItemId={setLastItemId} />}
            {renderTestElement && <MatkulDetailsTest matkulDetails={matkulDetails} />}

            <div className={styles.title}>
                {title}
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
                        onClick={() => { setSwiperSlide(item.id, Math.floor(Math.random() * nilaiColorEntries.length)) }}
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
                            onBeforeInit={(swiper) => setSwipers((prev) => ({ ...prev, [item.id]: swiper }))}
                            onBeforeDestroy={(swiper) => setSwipers((prev) => {
                                const { [item.id]: _, ...updated } = prev;
                                return updated;
                            })}
                            slidesPerView={1}
                            spaceBetween={50}
                            centeredSlides={true}
                            className={styles.swiper}
                            initialSlide={nilaiColorEntries.findIndex(([nilai]) => nilai === item.nilai)}
                            allowTouchMove={false}
                            onSlideChangeTransitionEnd={(swiper) => editNilaiOnScroll(item.id, nilaiColorEntries[swiper.activeIndex]['0'])}
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

// #region Testing Element

const AnimationStateTest = ({ isAnimating, setIsAnimating, setLastItemId, }) => (
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
)

const AnimationControllerTest = ({ matkul, reset, addSome, popSome, mixSome, mixSomeNilai }) => (
    <div
        style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: '1px solid red',
            width: '60%',
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
        <span style={{ marginLeft: '5px', marginBottom: '5px' }} onClick={() => { mixSomeNilai(Array.from({ length: matkul.length }, (_, index) => index)) }}>Mix Some Nilai</span>
    </div>
)

const MatkulDetailsTest = ({ matkulDetails }) => (
    <div
        style={{
            position: 'absolute',
            top: '90%',
            left: '50%',
            transform: 'translate(-50%, -90%)',
            border: '1px solid purple',
            width: '50%',
            height: '25%',
            borderRadius: '.2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99,
        }}
    >
        <h3>Total Nilai: {matkulDetails.totalNilai}</h3>
        <h3>Total SKS: {matkulDetails.totalSks}</h3>
        <h3>IP: {matkulDetails.ip}</h3>
    </div>
)

// #endregion

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