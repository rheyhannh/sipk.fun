// #region TYPE DEPEDENCY
import { MotionStyle, UseInViewOptions, Variant } from 'framer-motion';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, mix, useInView } from 'framer-motion';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/highlight_text.module.css'
// #endregion

/** 
 * Ref dari element `mark` yang digunakan sebagai `Container` 
 * @typedef {React.RefObject<HTMLElement>} markRef
 */

/** 
 * Hook `useInView` yang digunakan. 
 * Saat `useHook` false, variable ini akan selalu bernilai false
 * @typedef {boolean} inViewHook
 */

/** 
 * Array yang berisikan setiap kata dari `text` yang digunakan.
 * Setiap spasi akan diubah menjadi `'_spaces_'`
 * 
 * ```js
 * const text = 'Contoh text'
 * const textWords = ['Contoh', '_spaces_', 'text']
 * ```
 * @typedef {Array<string>} textWords
 */

/** 
 * Array yang berisikan array setiap huruf dari `text` yang digunakan.
 * Setiap spasi tetap berbentuk `'_spaces_'`
 * 
 * ```js
 * const text = 'Contoh text'
 * const textWords = ['Contoh', '_spaces_', 'text']
 * const textChars = [
 *      ['C', 'o', 'n', 't', 'o', 'h'], 
 *      '_spaces_',
 *      ['t', 'e', 'x', 't']
 * ]
 * ```
 * @typedef {Array<Array<string> | string>} textChars
 */

/** 
 * Style yang digunakan element mark sebagai `Container`
 * @typedef {React.CSSProperties} containerStyle
 */

/** 
 * Style yang digunakan component `Wrapper`
 * @typedef {React.CSSProperties} wrapperStyle
 */

/** 
 * Style yang digunakan component `Word`
 * @typedef {MotionStyle} wordStyle
 */

/** 
 * Style atau animasi yang digunakan component `Word`
 * @typedef {MotionStyle} wordAnimate
 */

/** 
 * Style atau animasi yang digunakan component `Char`
 * @typedef {MotionStyle} charAnimate
 */

/** 
 * Indeks relatif sebuah huruf atau kata yang dihitung tanpa adanya item `'_spaces_'`
 * 
 * ```js
 * // Example Word
 * const x = ['Word', '_spaces_', 'Word2']; 
 * // flatIndex 'Word2' === 1
 * 
 * // Example Character
 * const y = [
 *      ['A', 'b', 'c'], 
 *      '_spaces_', 
 *      ['X', 'y', 'z']
 * ]; 
 * // flatIndex ['X', 'y', 'z'] === 1
 * ```
 * 
 * Digunakan untuk menghitung perhitungan delay atau efek stagger kata maupun huruf tanpa menghitung adanya spasi
 * 
 * @typedef {number} flatIndex
 */

/** 
 * Opsi yang digunakan pada custom variant yang dibuat untuk mengatur efek stagger setiap kata atau huruf
 * @typedef {Object} customVariantOptions
 * @property {'first' | 'last' | 'random'} staggerType
 * Jenis stagger effect yang digunakan.
 * - Default : `'first'`
 * 
 * Penjelasan lengkap untuk tipe stagger efek per-kata dapat dilihat {@link presetOptions.wordStagger},
 * sedangkan untuk efek per-huruf dapat dilihat {@link presetOptions.charStagger}
 * @property {number} baseDelay
 * Base delay yang digunakan
 * - Default : `0`
 * @property {number} stagger
 * Offset stagger yang digunakan
 * - Default : `0.05`
 * @property {presetOptions['randomStart']} randomStart
 * Array yang berisikan atribut css yang dianimasikan dengan menggunakan `randomStart`.
 * 
 * Fitur `randomStart` memungkinkan untuk memulai animasi tertentu dengan nilai awal atau nilai target secara acak
 * berdasarkan suatu batasan nilai terkecil dan terendah menggunakan component `mix` pada framer-motion.
 * 
 * Syarat menggunakan fitur ini adalah sebagai berikut,
 * - Atribut yg ingin menggunakan fitur ini harus bernilai array pada variant
 * - Nilai pada array pertama dapat bernilai `null` dimana ini menandakan animasi akan mulai dari current state
 * - Array harus memiliki panjang `>= 3`
 * - Saat format array lebih dari 3, maka panjang array harus `genap`
 * - Format array dengan panjang 3 `[min, max, target]`
 * - Format array dengan panjang 4 `[initial, min, max, target]`
 * - Format array dengan panjang 6 `[initial, min_1, max_1, min_2, max_2, target]`
 * - Dan seterusnya dimana dapat menampung lebih banyak lagi
 * 
 * Untuk contoh case penggunaan fitur ini dapat dilihat sebagai berikut,
 * ```js
 * // Case saat arr.length === 3
 * const randomStart = ['x'];
 * const variants = {
 *      my_variant: {
 *          x: [-45, 90, 0] // contoh output: [25, 0]
 *      }
 * }
 * // Output 25 diatas merupakan contoh hasil generasi angka acak dengan jarak -45 sampai 90
 * // Konfigurasi diatas akan menganimasikan 'x' dari 25 -> 0
 * 
 * // Case saat arr.length 4
 * const randomStart = ['x'];
 * const variants = {
 *      my_variant: {
 *          x: [null, -25, 45, 0] // contoh output: [null, 35, 0]
 *      }
 * }
 * // Output 35 diatas merupakan contoh hasil generasi angka acak dengan jarak -25 sampai 45
 * // Konfigurasi diatas akan menganimasikan 'x' dari (awal posisi) -> 35 -> 0
 * 
 * // Case saat arr.length 6
 * const randomStart = ['x'];
 * const variants = {
 *      my_variant: {
 *          x: [10, -25, 45, 90, 180, 0] // contoh output: [10, 15, 125, 0]
 *      }
 * }
 * // Output 15 diatas merupakan contoh hasil generasi angka acak dengan jarak -25 sampai 45
 * // Output 125 diatas merupakan contoh hasil generasi angka acak dengan jarak 90 sampai 180
 * // Konfigurasi diatas akan menganimasikan 'x' dari 10 -> 15 -> 125 -> 0
 * ```
 * 
 * Array dapat berjumlah lebih dari 6 dan sebanyak-banyaknya asalkan genap dan memenuhi syarat lainnya.
 * Jika tidak memenuhi syarat, maka perhitungan tidak akan dilakukan dan array tidak akan dimodifikasi,
 * sehingga animasi berjalan sesuai dengan apa yang ditulis
 */

/** 
 * @typedef {Object} presetOptions
 * @property {boolean} makeVariant
 * Buat animasi dalam variant sehingga dapat dimainkan melalui `motion` parent element
 * - Default : `false`
 * @property {string} variantName
 * Nama variant yang digunakan
 * - Default : `'highlight_text'` 
 * @property {Array<keyof MotionStyle>} randomStart
 * Array yang berisikan atribut css yang dianimasikan dengan menggunakan `randomStart`.
 * 
 * Props ini hanya digunakan untuk kebutuhan `internal` untuk disesuaikan dengan preset yang sudah tersedia
 * 
 * @property {'first' | 'last' | 'random'} wordStagger
 * Jenis stagger effect yang digunakan. 
 * 
 * Saat menggunakan `'first'` maka animasi dimulai berurutan dari kata pertama,
 * jika `'last'` maka animasi dimulai berurutan dari kata terakhir sedangkan jika `'random'`
 * animasi dimulai dari kata yang dipilih secara acak dengan urutan yang acak.
 * 
 * - Note : Props ini hanya memberikan efek pada preset yang menggunakan animasi per-kata
 * - Default : `'first'`
 * @property {'first' | 'last' | 'random'} charStagger
 * Jenis stagger effect yang digunakan. 
 * 
 * Saat menggunakan `'first'` maka animasi dimulai berurutan dari huruf pertama,
 * jika `'last'` maka animasi dimulai berurutan dari huruf terakhir sedangkan jika `'random'`
 * animasi dimulai dari huruf yang dipilih secara acak dengan urutan yang acak.
 * 
 * - Note : Props ini hanya memberikan efek pada preset yang menggunakan animasi per-huruf
 * - Default : `'first'`
 * @property {Object<string, Variant & {options:customVariantOptions}>} customCharVariants
 * Tambah motion custom `variants` untuk setiap character dengan stagger efek yang sudah diatur secara internal
 * @property {Object<string, Variant & {options:customVariantOptions}>} customWordVariants
 * Tambah motion custom `variants` untuk setiap kata dengan stagger efek yang sudah diatur secara internal
 */

/** 
 * @typedef {Object} resolvedPreset
 * @property {containerStyle} containerStyle
 * Style yang digunakan element mark sebagai `Container`, dapat bernilai `undefined`
 * @property {wrapperStyle} wrapperStyle
 * Style yang digunakan component `Wrapper`, dapat bernilai `undefined`
 * @property {wordStyle} wordStyle
 * Style yang digunakan component `Word`, dapat bernilai `undefined`
 * @property {React.CSSProperties} wordWrapperStyle
 * Style yang digunakan element wrapper untuk component `Word`, dapat bernilai `undefined`
 * @property {wordAnimate & {options:presetOptions}} wordAnimate
 * Variant animasi yang digunakan component `Word`, dapat bernilai `undefined`
 * @property {charAnimate & {options:presetOptions}} charAnimate
 * Variant animasi yang digunakan component `Char` dan opsi preset yang digunakan, dapat bernilai `undefined`
 * @property {Object<string, Variant & {options:customVariantOptions}>} customCharVariants
 * Custom `variants` untuk setiap character dengan stagger efek yang sudah diatur secara internal.
 * @property {Object<string, Variant & {options:customVariantOptions}>} customWordVariants
 * Custom `variants` untuk setiap kata dengan stagger efek yang sudah diatur secara internal
 */

/** Opsi atau atribut yang dapat dicustom saat menggunakan preset `wavingColor`
 * @typedef {Object} adjustWavingColor
 * @property {[number, number, number]} scale
 * Animasikan `scale` dalam keyframe tertentu. Keyframe pertama dapat bernilai `null` untuk menggunakan current scale value
 * - Default : `[null, 1.45, 1]`
 * @property {[string, string, string]} color 
 * Animasikan `color` dalam keyframe tertentu. Keyframe pertama dapat bernilai `null` untuk menggunakan current color value.
 * Setiap keyframe dapat menggunakan warna dalam `hex` maupun `rgb`
 * - Default : `[null, '#556b9d', '#FF6341']`
 * @property {number} duration 
 * Durasi animasi untuk setiap huruf dalam satuan `detik`
 * - Default : `0.3`
 * @property {number} baseDelay
 * Delay animasi untuk setiap huruf dalam satuan `detik`
 * - Default : `0`
 * @property {number} stagger 
 * Stagger animasi untuk setiap huruf dalam satuan `detik`
 * - Default : `0.05`
 * @property {number} repeat 
 * Jumlah pengulangan animasi
 * - Default : `0`
 * @property {number} repeatDelay
 * Delay pengulangan animasi dalam satuan `detik` 
 * - Default : `0.1`
 */

/** Opsi atau atribut yang dapat dicustom saat menggunakan preset `wavingTranslate`
 * @typedef {Object} adjustWavingTranslate
 * @property {number} perspective
 * Perspective yang digunakan untuk memberikan efek 3d
 * - Default : `500`
 * @property {[number, number]} z
 * Animasikan `z` dalam keyframe tertentu. Keyframe pertama dapat bernilai `null` untuk menggunakan current z value
 * - Default : `[300, 0]`
 * @property {[number, number]} rotateX 
 * Animasikan `rotateX` dalam keyframe tertentu. Keyframe pertama dapat bernilai `null` untuk menggunakan current rotateX value
 * - Default : `[-45, 0]`
 * @property {[number, number]} opacity 
 * Animasikan `opacity` dalam keyframe tertentu. Keyframe pertama dapat bernilai `null` untuk menggunakan current opacity value
 * - Default : `[0, 1]`
 * @property {number} duration 
 * Durasi animasi untuk setiap huruf dalam satuan `detik`
 * - Default : `0.8`
 * @property {number} baseDelay
 * Delay animasi untuk setiap huruf dalam satuan `detik`
 * - Default : `0`
 * @property {number} stagger 
 * Stagger animasi untuk setiap huruf dalam satuan `detik`
 * - Default : `0.04`
 * @property {number} repeat 
 * Jumlah pengulangan animasi
 * - Default : `0`
 * @property {number} repeatDelay 
 * Delay pengulangan animasi dalam satuan `detik` 
 * - Default : `0.1`
 */

/** Opsi atau atribut yang dapat dicustom saat menggunakan preset `springRotate`
 * @typedef {Object} adjustSpringRotate
 * @property {string} transformOrigin
 * Transform origin yang digunakan
 * - Default : `'0% 50%'`
 * @property {[number, number]} rotateZ
 * Animasikan `rotateZ` dalam keyframe tertentu. Keyframe pertama dapat bernilai `null` untuk menggunakan current rotateZ value
 * - Default : `[-30, 0]`
 * @property {[number, number]} opacity 
 * Animasikan `opacity` dalam keyframe tertentu. Keyframe pertama dapat bernilai `null` untuk menggunakan current opacity value
 * - Default : `[0, 1]`
 * @property {number} duration 
 * Durasi animasi untuk setiap kata dalam satuan `detik`
 * - Default : `1.2`
 * @property {number} baseDelay
 * Delay animasi untuk setiap kata dalam satuan `detik`
 * - Default : `0`
 * @property {number} stagger 
 * Stagger animasi untuk setiap kata dalam satuan `detik`
 * - Default : `0.2`
 * @property {number} repeat 
 * Jumlah pengulangan animasi
 * - Default : `0`
 * @property {number} bounce
 * Efek `bounce` yang digunakan dalam skala `0` hingga `1`.
 * Semakin besar maka efek bounce akan semakin besar
 * - Default : `0.5`
 * @property {number} repeatDelay 
 * Delay pengulangan animasi dalam satuan `detik` 
 * - Default : `0.1`
 */

/** Opsi atau atribut yang dapat dicustom saat menggunakan preset `wavingFlyIn`
 * @typedef {Object} adjustWavingFlyIn
 * @property {string} transformOrigin
 * Transform origin yang digunakan
 * - Default : `'0% 50%'`
 * @property {[number, number]} y
 * Animasikan `y` dalam keyframe tertentu. Keyframe pertama dapat bernilai `null` untuk menggunakan current y value
 * - Default : `[125, 0]`
 * @property {[number, number]} rotate 
 * Animasikan `rotate` dalam keyframe tertentu. Keyframe pertama dapat bernilai `null` untuk menggunakan current rotate value
 * - Default : `[-3, 0]`
 * @property {number} duration 
 * Durasi animasi untuk setiap kata dalam satuan `detik`
 * - Default : `1.2`
 * @property {number} baseDelay
 * Delay animasi untuk setiap kata dalam satuan `detik`
 * - Default : `0`
 * @property {number} stagger 
 * Stagger animasi untuk setiap kata dalam satuan `detik`
 * - Default : `0.025`
 * @property {number} repeat 
 * Jumlah pengulangan animasi
 * - Default : `0`
 * @property {number} bounce
 * Efek `bounce` yang digunakan dalam skala `0` hingga `1`.
 * Semakin besar maka efek bounce akan semakin besar
 * - Default : `0.25`
 * @property {number} repeatDelay 
 * Delay pengulangan animasi dalam satuan `detik` 
 * - Default : `0.1`
 */

/** Opsi atau atribut yang dapat dicustom saat menggunakan preset `wavingRotation`
 * @typedef {Object} adjustWavingRotation
 * @property {number} perspective
 * Perspective yang digunakan untuk memberikan efek 3d
 * - Default : `800`
 * @property {string} transformOrigin
 * Transform origin yang digunakan
 * - Default : `'50% 100%'`
 * @property {[number, number]} opacity
 * Animasikan `opacity` dalam keyframe tertentu. Keyframe pertama dapat bernilai `null` untuk menggunakan current opacity value
 * - Default : `[0, 1]`
 * @property {[number, number]} rotateX 
 * Animasikan `rotateX` dalam keyframe tertentu. Keyframe pertama dapat bernilai `null` untuk menggunakan current rotateX value
 * - Default : `[90, 0]`
 * @property {number} duration 
 * Durasi animasi untuk setiap kata dalam satuan `detik`
 * - Default : `1.2`
 * @property {number} baseDelay
 * Delay animasi untuk setiap kata dalam satuan `detik`
 * - Default : `0`
 * @property {number} stagger 
 * Stagger animasi untuk setiap kata dalam satuan `detik`
 * - Default : `0.03`
 * @property {number} repeat 
 * Jumlah pengulangan animasi
 * - Default : `0`
 * @property {number} bounce
 * Efek `bounce` yang digunakan dalam skala `0` hingga `1`.
 * Semakin besar maka efek bounce akan semakin besar
 * - Default : `0.25`
 * @property {number} repeatDelay 
 * Delay pengulangan animasi dalam satuan `detik` 
 * - Default : `0.1`
 */

/** Opsi atau atribut yang dapat dicustom saat menggunakan preset `mixFancyTranslate`
 * @typedef {Object} adjustMixFancyTranslate
 * @property {number} perspective
 * Perspective yang digunakan untuk memberikan efek 3d
 * - Default : `1000`
 * @property {[number, number]} opacity
 * Animasikan `opacity` dalam keyframe tertentu. Keyframe pertama dapat bernilai `null` untuk menggunakan current opacity value
 * - Default : `[0, 1]`
 * @property {[number, number, number]} rotateX 
 * Animasikan `rotateX` dengan nilai awal acak beserta dengan nilai target seperti array berikut,
 * ```js
 * [x, y, z]
 * ```
 * Pada array tersebut `x` adalah batas bawah dan `y` adalah batas atas untuk menentukan nilai awal secara acak.
 * ```js
 * [25, 90, 0]
 * ```
 * Dengan pengaturan diatas maka nilai awal akan berada pada kisaran `25` dan `90`.
 * Lalu untuk variabel `z` adalah target akhir dari animasi, sehingga pengaturan diatas akan memainkan
 * animasi `rotateX` dari nilai acak yang dibuat dari kisaran `25` dan `90` menjadi `0`.
 * 
 * - Misc : Variabel pada array hanya dapat berupa `number`
 * - Default : `[-90, 90, 0]`
 * @property {[number|string, number|string, number|string]} x 
 * Animasikan `x` dengan nilai awal acak beserta dengan nilai target seperti array berikut,
 * ```js
 * [a, b, c]
 * ```
 * Pada array tersebut `a` adalah batas bawah dan `b` adalah batas atas untuk menentukan nilai awal secara acak.
 * ```js
 * [25, 90, 0]
 * ```
 * Dengan pengaturan diatas maka nilai awal akan berada pada kisaran `25` dan `90`.
 * Lalu untuk variabel `c` adalah target akhir dari animasi, sehingga pengaturan diatas akan memainkan
 * animasi `x` dari nilai acak yang dibuat dari kisaran `25` dan `90` menjadi `0`.
 * 
 * - Misc : Variabel pada array dapat berupa `number` atau angka dengan persentase `'25%'`
 * - Default : `['-50%', '50%', '0%']`
 * @property {[number|string, number|string, number|string]} y 
 * Animasikan `y` dengan nilai awal acak beserta dengan nilai target seperti array berikut,
 * ```js
 * [a, b, c]
 * ```
 * Pada array tersebut `a` adalah batas bawah dan `b` adalah batas atas untuk menentukan nilai awal secara acak.
 * ```js
 * [25, 90, 0]
 * ```
 * Dengan pengaturan diatas maka nilai awal akan berada pada kisaran `25` dan `90`.
 * Lalu untuk variabel `c` adalah target akhir dari animasi, sehingga pengaturan diatas akan memainkan
 * animasi `y` dari nilai acak yang dibuat dari kisaran `25` dan `90` menjadi `0`.
 * 
 * - Misc : Variabel pada array dapat berupa `number` atau angka dengan persentase `'25%'`
 * - Default : `['-10%', '10%', '0%']`
 * @property {[number, number, number]} z 
 * Animasikan `z` dengan nilai awal acak beserta dengan nilai target seperti array berikut,
 * ```js
 * [a, b, c]
 * ```
 * Pada array tersebut `a` adalah batas bawah dan `b` adalah batas atas untuk menentukan nilai awal secara acak.
 * ```js
 * [25, 90, 0]
 * ```
 * Dengan pengaturan diatas maka nilai awal akan berada pada kisaran `25` dan `90`.
 * Lalu untuk variabel `c` adalah target akhir dari animasi, sehingga pengaturan diatas akan memainkan
 * animasi `z` dari nilai acak yang dibuat dari kisaran `25` dan `90` menjadi `0`.
 * 
 * - Misc : Variabel pada array hanya dapat berupa `number`
 * - Default : `[400, 700, 0]`
 * @property {number} duration 
 * Durasi animasi untuk setiap kata dalam satuan `detik`
 * - Default : `1.5`
 * @property {number} baseDelay
 * Delay animasi untuk setiap kata dalam satuan `detik`
 * - Default : `0`
 * @property {number} stagger 
 * Stagger animasi untuk setiap kata dalam satuan `detik`
 * - Default : `0.004`
 * @property {number} repeat 
 * Jumlah pengulangan animasi
 * - Default : `0`
 * @property {number} bounce
 * Efek `bounce` yang digunakan dalam skala `0` hingga `1`.
 * Semakin besar maka efek bounce akan semakin besar
 * - Default : `0`
 * @property {number} repeatDelay 
 * Delay pengulangan animasi dalam satuan `detik` 
 * - Default : `0.1`
 */

/**
 * @typedef {Object} hookOptions
 * @property {boolean} [once]
 * Boolean untuk trigger animasi saat masuk viewport sekali saja
 * - Default : `false`
 * @property {number} [amount]
 * Persentase untuk trigger animasi dalam skala `0` hingga `1`.
 * Semakin besar maka semakin besar element harus masuk viewport untuk trigger animasi
 * - Default : `0`
 * @property {React.RefObject<HTMLElement>} [ref]
 * Ref dari container atau element lain untuk mentrigger animasi. Default menggunakan ref dari element `HighlightText` sendiri
 */

/** Props yang digunakan component `HighlightText`
 * @typedef {Object} HighlightTextProps
 * @property {string} [text]
 * Teks yang digunakan 
 * - Default : `'highlighted text'`
 * @property {boolean} [useHook]
 * Boolean untuk menggunakan hook `'useInView'` atau tidak. 
 * - Default : `true`
 * - Tips : Jika tidak menggunakan hook, dapat trigger animasi melalui variant dengan mengaktifkan
 * `makeVariant` terlebih dahulu pada `presetOptions`
 * @property {hookOptions & Omit<UseInViewOptions, 'once' | 'amount'>} hookOptions
 * Opsi yang dapat digunakan untuk hook `'useInView'` yang digunakan
 * @property {'wavingColor'|'wavingTranslate'|'springRotate'|'wavingFlyIn'|'wavingRotation'|'mixFancyTranslate'} [preset]
 * Preset animasi yang digunakan
 * - Default : `'wavingColor'`
 * @property {Omit<presetOptions, 'randomStart'>} presetOptions
 * Opsi preset yang dapat digunakan
 * @property {adjustWavingColor} adjustWavingColor
 * Opsi atribut animasi yang digunakan dan pengaturan lainnya yang dapat diadjust pada preset `'wavingColor'`
 * @property {adjustWavingTranslate} adjustWavingTranslate
 * Opsi atribut animasi yang digunakan dan pengaturan lainnya yang dapat diadjust pada preset `'wavingTranslate'`
 * @property {adjustSpringRotate} adjustSpringRotate
 * Opsi atribut animasi yang digunakan dan pengaturan lainnya yang dapat diadjust pada preset `'springRotate'`
 * @property {adjustWavingFlyIn} adjustWavingFlyIn
 * Opsi atribut animasi yang digunakan dan pengaturan lainnya yang dapat diadjust pada preset `'wavingFlyIn'`
 * @property {adjustWavingRotation} adjustWavingRotation
 * Opsi atribut animasi yang digunakan dan pengaturan lainnya yang dapat diadjust pada preset `'wavingRotation'`
 * @property {adjustMixFancyTranslate} adjustMixFancyTranslate
 * Opsi atribut animasi yang digunakan dan pengaturan lainnya yang dapat diadjust pada preset `'mixFancyTranslate'`
 */

/**
 * Component untuk highlight suatu teks dengan preset animasi tertentu yang dapat diadjust
 * @param {HighlightTextProps} props HighlightText props
 * @returns {React.ReactElement} Rendered component
 */
const HighlightText = (
    {
        text = 'highlighted text',
        useHook = true,
        hookOptions,
        preset,
        presetOptions,
        adjustWavingColor,
        adjustWavingTranslate,
        adjustSpringRotate,
        adjustWavingFlyIn,
        adjustWavingRotation,
        adjustMixFancyTranslate,
    }
) => {
    /** @type {ReturnType<typeof React.useState<resolvedPreset>>} */
    const [usedPreset, setUsedPreset] = React.useState(null);
    /** @type {markRef} */
    const markRef = React.useRef(null);
    /** @type {inViewHook} */
    const inViewHook = useHook ? useInView(hookOptions?.ref ?? markRef, hookOptions) : false;

    /** @type {textWords} */
    const textWords = text.split(' ').flatMap((word, index, arr) => index < arr.length - 1 ? [word, '_spaces_'] : [word]);
    /** @type {textChars} */
    const textChars = textWords.map(word => word === '_spaces_' ? word : word.split(''));

    /**
     * Method untuk resolve preset, opsi atribut, assign default value
     * @returns {resolvedPreset} Resolved preset
     */
    const resolvePreset = () => {
        if (preset === 'wavingTranslate') {
            return {
                containerStyle: { perspective: adjustWavingTranslate?.perspective ?? 500 },
                wrapperStyle: { transformStyle: 'preserve-3d' },
                wordStyle: { transformStyle: 'inherit' },
                wordAnimate: undefined,
                charAnimate: {
                    z: adjustWavingTranslate?.z ?? [300, 0],
                    rotateX: adjustWavingTranslate?.rotateX ?? [-45, 0],
                    opacity: adjustWavingTranslate?.opacity ?? [0, 1],
                    transition: {
                        duration: adjustWavingTranslate?.duration ?? 0.8,
                        baseDelay: adjustWavingTranslate?.baseDelay ?? 0,
                        delay: adjustWavingTranslate?.stagger ?? 0.04,
                        repeat: adjustWavingTranslate?.repeat ?? 0,
                        repeatDelay: adjustWavingTranslate?.repeatDelay ?? 0.1,
                    },
                    options: {
                        makeVariant: presetOptions?.makeVariant ?? false,
                        variantName: presetOptions?.variantName ?? 'highlight_text',
                        charStagger: presetOptions?.charStagger ?? 'first',
                    },
                    _initial: {
                        z: adjustWavingTranslate?.z ? adjustWavingTranslate.z.slice().reverse() : [null, 300],
                        rotateX: adjustWavingTranslate?.rotateX ? adjustWavingTranslate.rotateX.slice().reverse() : [null, -45],
                        opacity: adjustWavingTranslate?.opacity ? adjustWavingTranslate.opacity.slice().reverse() : [null, 0],
                    }
                },
                customCharVariants: presetOptions?.customCharVariants,
                customWordVariants: presetOptions?.customWordVariants,
            }
        } else if (preset === 'springRotate') {
            return {
                containerStyle: undefined,
                wrapperStyle: undefined,
                wordStyle: { transformOrigin: adjustSpringRotate?.transformOrigin ?? '0% 50%' },
                wordAnimate: {
                    rotateZ: adjustSpringRotate?.rotateZ ?? [-30, 0],
                    opacity: adjustSpringRotate?.opacity ?? [0, 1],
                    transition: {
                        duration: adjustSpringRotate?.duration ?? 1.2,
                        baseDelay: adjustSpringRotate?.baseDelay ?? 0,
                        delay: adjustSpringRotate?.stagger ?? 0.2,
                        repeat: adjustSpringRotate?.repeat ?? 0,
                        type: 'spring',
                        bounce: adjustSpringRotate?.bounce ?? 0.5,
                        repeatDelay: adjustSpringRotate?.repeatDelay ?? 0.1,
                    },
                    options: {
                        makeVariant: presetOptions?.makeVariant ?? false,
                        variantName: presetOptions?.variantName ?? 'highlight_text',
                        wordStagger: presetOptions?.wordStagger ?? 'first',
                    },
                    _initial: {
                        rotateZ: adjustSpringRotate?.rotateZ ? adjustSpringRotate.rotateZ.slice().reverse() : [null, -30],
                        opacity: adjustSpringRotate?.opacity ? adjustSpringRotate.opacity.slice().reverse() : [null, 0],
                    }
                },
                charAnimate: undefined,
                customCharVariants: presetOptions?.customCharVariants,
                customWordVariants: presetOptions?.customWordVariants,
            }
        } else if (preset === 'wavingFlyIn') {
            return {
                containerStyle: undefined,
                wrapperStyle: undefined,
                wordStyle: {
                    transformOrigin: adjustWavingFlyIn?.transformOrigin ?? '0% 50%',
                    willChange: 'transform',
                },
                wordWrapperStyle: {
                    overflow: 'hidden'
                },
                wordAnimate: {
                    y: adjustWavingFlyIn?.y ?? [125, 0],
                    rotate: adjustWavingFlyIn?.rotate ?? [-3, 0],
                    transition: {
                        duration: adjustWavingFlyIn?.duration ?? 1.2,
                        baseDelay: adjustWavingFlyIn?.baseDelay ?? 0,
                        delay: adjustWavingFlyIn?.stagger ?? 0.025,
                        repeat: adjustWavingFlyIn?.repeat ?? 0,
                        type: 'spring',
                        bounce: adjustWavingFlyIn?.bounce ?? 0.25,
                        repeatDelay: adjustWavingFlyIn?.repeatDelay ?? 0.1,
                    },
                    options: {
                        makeVariant: presetOptions?.makeVariant ?? false,
                        variantName: presetOptions?.variantName ?? 'highlight_text',
                        wordStagger: presetOptions?.wordStagger ?? 'first',
                    },
                    _initial: {
                        y: adjustWavingFlyIn?.y ? adjustWavingFlyIn.y.slice().reverse() : [null, 125],
                        rotate: adjustWavingFlyIn?.rotate ? adjustWavingFlyIn.rotate.slice().reverse() : [null, -3],
                    }
                },
                charAnimate: undefined,
                customCharVariants: presetOptions?.customCharVariants,
                customWordVariants: presetOptions?.customWordVariants,
            }
        } else if (preset === 'wavingRotation') {
            return {
                containerStyle: { perspective: adjustWavingRotation?.perspective ?? 800 },
                wrapperStyle: { transformStyle: 'preserve-3d' },
                wordStyle: {
                    transformOrigin: adjustWavingRotation?.transformOrigin ?? '50% 100%',
                    willChange: 'transform, opacity',
                },
                wordAnimate: {
                    opacity: adjustWavingRotation?.opacity ?? [0, 1],
                    rotateX: adjustWavingRotation?.rotateX ?? [90, 0],
                    transition: {
                        duration: adjustWavingRotation?.duration ?? 1.2,
                        baseDelay: adjustWavingRotation?.baseDelay ?? 0,
                        delay: adjustWavingRotation?.stagger ?? 0.03,
                        repeat: adjustWavingRotation?.repeat ?? 0,
                        type: 'spring',
                        bounce: adjustWavingRotation?.bounce ?? 0.25,
                        repeatDelay: adjustWavingRotation?.repeatDelay ?? 0.1,
                    },
                    options: {
                        makeVariant: presetOptions?.makeVariant ?? false,
                        variantName: presetOptions?.variantName ?? 'highlight_text',
                        wordStagger: presetOptions?.wordStagger ?? 'first',
                    },
                    _initial: {
                        opacity: adjustWavingRotation?.opacity ? adjustWavingRotation.opacity.slice().reverse() : [null, 0],
                        rotateX: adjustWavingRotation?.rotateX ? adjustWavingRotation.rotateX.slice().reverse() : [null, 90],
                    }
                },
                charAnimate: undefined,
                customCharVariants: presetOptions?.customCharVariants,
                customWordVariants: presetOptions?.customWordVariants,
            }
        } else if (preset === 'mixFancyTranslate') {
            return {
                containerStyle: { perspective: adjustMixFancyTranslate?.perspective ?? 1000 },
                wrapperStyle: { transformStyle: 'preserve-3d' },
                wordStyle: {
                    willChange: 'transform, opacity',
                },
                wordAnimate: {
                    opacity: adjustMixFancyTranslate?.opacity ?? [0, 1],
                    rotateX: adjustMixFancyTranslate?.rotateX ?? [-90, 90, 0],
                    x: adjustMixFancyTranslate?.x ?? ['-50%', '50%', '0%'],
                    y: adjustMixFancyTranslate?.y ?? ['-10%', '10%', '0%'],
                    z: adjustMixFancyTranslate?.z ?? [400, 700, 0],
                    transition: {
                        duration: adjustMixFancyTranslate?.duration ?? 1.5,
                        baseDelay: adjustMixFancyTranslate?.baseDelay ?? 0,
                        delay: adjustMixFancyTranslate?.stagger ?? 0.004,
                        repeat: adjustMixFancyTranslate?.repeat ?? 0,
                        type: 'spring',
                        bounce: adjustMixFancyTranslate?.bounce ?? 0,
                        repeatDelay: adjustMixFancyTranslate?.repeatDelay ?? 0.1,
                    },
                    options: {
                        makeVariant: presetOptions?.makeVariant ?? false,
                        variantName: presetOptions?.variantName ?? 'highlight_text',
                        randomStart: ['rotateX', 'x', 'y', 'z'],
                        wordStagger: presetOptions?.wordStagger ?? 'first',
                    },
                    _initial: {
                        opacity: adjustMixFancyTranslate?.opacity ? adjustMixFancyTranslate.opacity.slice().reverse() : [null, 0],
                    }
                },
                charAnimate: undefined,
                customCharVariants: presetOptions?.customCharVariants,
                customWordVariants: presetOptions?.customWordVariants,
            }
        } else {
            return {
                containerStyle: undefined,
                wrapperStyle: undefined,
                wordStyle: undefined,
                wordAnimate: undefined,
                charAnimate: {
                    scale: adjustWavingColor?.scale ?? [null, 1.45, 1],
                    color: adjustWavingColor?.color ?? [null, '#556b9d', '#FF6341'],
                    transition: {
                        duration: adjustWavingColor?.duration ?? 0.3,
                        baseDelay: adjustWavingColor?.baseDelay ?? 0,
                        delay: adjustWavingColor?.stagger ?? 0.05,
                        repeat: adjustWavingColor?.repeat ?? 0,
                        repeatDelay: adjustWavingColor?.repeatDelay ?? 0.1,
                    },
                    options: {
                        makeVariant: presetOptions?.makeVariant ?? false,
                        variantName: presetOptions?.variantName ?? 'highlight_text',
                        charStagger: presetOptions?.charStagger ?? 'first'
                    },
                    _initial: {
                        scale: adjustWavingColor?.scale ? adjustWavingColor.scale.slice().reverse() : [1, 1.45, 1],
                        color: adjustWavingColor?.color ? adjustWavingColor.color.slice().reverse() : ['#FF6341', '#556b9d', null],
                    }
                },
                customCharVariants: presetOptions?.customCharVariants,
                customWordVariants: presetOptions?.customWordVariants,
            }
        }
    }

    let flatWordIndex = 0;
    let flatCharIndex = 0;
    const flatWordRandomIndex = generateRandomFlatIndex(textWords.filter((item) => item !== '_spaces_').length);
    const flatCharRandomIndex = generateRandomFlatIndex(textChars.filter((item) => item !== '_spaces_').flat().length)

    React.useEffect(() => {
        setUsedPreset(resolvePreset());
    }, [preset, presetOptions, adjustWavingColor, adjustSpringRotate, adjustWavingTranslate, adjustWavingFlyIn, adjustWavingRotation, adjustMixFancyTranslate])

    return (
        <motion.mark
            ref={markRef}
            className={styles.container}
            style={usedPreset?.containerStyle}
        >
            <Wrapper style={usedPreset?.wrapperStyle}>
                {textChars.map((item, index) => {
                    const currentFlatWordIndex = item !== '_spaces_' ? flatWordIndex++ : flatWordIndex;

                    return item !== '_spaces_' ? (
                        <Word
                            inViewHook={inViewHook}
                            style={usedPreset?.wordStyle}
                            wordAnimate={usedPreset?.wordAnimate}
                            wordWrapperStyle={usedPreset?.wordWrapperStyle ?? null}
                            wordRandomStagger={flatWordRandomIndex[currentFlatWordIndex]}
                            wordLength={textWords.length}
                            flatIndex={currentFlatWordIndex}
                            customVariants={usedPreset?.customWordVariants}
                            key={index}
                        >
                            {item.map((char, charIndex) => {
                                const currentFlatCharIndex = flatCharIndex++;
                                return (
                                    <Char
                                        inViewHook={inViewHook}
                                        charAnimate={usedPreset?.charAnimate}
                                        charRandomStagger={flatCharRandomIndex[currentFlatCharIndex]}
                                        charLength={textChars.filter((item) => item !== '_spaces_').flat().length}
                                        flatIndex={currentFlatCharIndex}
                                        key={`${index}-${charIndex}`}
                                        customVariants={usedPreset?.customCharVariants}
                                    >
                                        {char}
                                    </Char>
                                );
                            })}
                        </Word>
                    ) : (<Spaces key={index} />)
                })}
            </Wrapper>
        </motion.mark>
    )
}

/**
 * Component Description
 * @param {Pick<React.HTMLProps<HTMLSpanElement>, 'children' | 'style'>}
 * @returns {React.ReactElement} Rendered component
 */
const Wrapper = ({ style, children }) => (
    <span
        className={styles.wrapper}
        style={style}
    >
        {children}
    </span>
)

/**
 * Props yang digunakan component `Word`
 * @typedef {Object} WordProps
 * @property {inViewHook} inViewHook
 * @property {MotionStyle} style
 * @property {wordAnimate & {options:presetOptions}} wordAnimate
 * @property {React.CSSProperties} wordWrapperStyle
 * Style yang digunakan pada element wrapper untuk setiap `Word` atau kata yang digunakan. 
 * 
 * Saat props ini `truthy` atau ada style yang digunakan, maka setiap element kata akan dibungkus dengan
 * element wrapper.
 * 
 * - Default : `null`
 * @property {number} wordRandomStagger
 * Stagger random yang diperoleh menggunakan `generateRandomFlatIndex`
 * @property {number} wordLength
 * Total jumlah kata yang digunakan
 * @property {flatIndex} flatIndex
 * @property {Object<string, Variant & {options:customVariantOptions}>} customVariants
 * Custom word `variants`
 * @property {React.ReactNode} children
 */

/**
 * Component Description
 * @param {WordProps} props Word props
 * @returns {React.ReactElement} Rendered component
 */
const Word = ({ inViewHook, style, wordAnimate, wordWrapperStyle = null, wordRandomStagger, wordLength, flatIndex, customVariants, children }) => {
    const useWrapper = !!wordWrapperStyle;
    const useRandomStart = wordAnimate && Array.isArray(wordAnimate?.options?.randomStart);

    const wordAnimateUpdated = {};

    if (useRandomStart) {
        const { options: { randomStart } } = wordAnimate;
        randomStart.forEach((attr, _) => {
            const [min, max, target] = [wordAnimate[attr][0], wordAnimate[attr][1], wordAnimate[attr][2]]
            const mixer = mix(min, max);
            wordAnimateUpdated[attr] = [mixer(generateRandomScale()), target]
        })
    }

    /**
     * Method untuk menghitung delay agar menciptakan animasi efek stagger per-kata berdasarkan tipe stagger yang digunakan
     * @returns {number} Delay yang sudah dihitung
     */
    const countDelay = () => {
        const staggerType = wordAnimate ? wordAnimate?.options?.wordStagger ?? 'first' : 'first';
        const { delay = 0.1, baseDelay = 0 } = wordAnimate?.transition;

        if (staggerType === 'random') {
            return (wordRandomStagger * delay) + baseDelay
        } else if (staggerType === 'last') {
            return (Math.abs(flatIndex - (wordLength - 1)) * delay) + baseDelay
        } else {
            return (flatIndex * delay) + baseDelay
        }
    }

    const updatedPresetDelay = !wordAnimate ? {} : {
        ...wordAnimate,
        ...wordAnimateUpdated,
        transition: {
            ...wordAnimate.transition,
            delay: countDelay()
        }
    };
    const { options, _initial, transition, ...wordAnimateFiltered } = updatedPresetDelay;

    const initialUpdated = Object.keys(wordAnimateUpdated).reduce((acc, key) => {
        acc[key] = wordAnimateUpdated[key].slice().reverse();
        return acc;
    }, {});

    const initialAnimate = { ..._initial, ...initialUpdated };

    const fixedCustomVariants = !customVariants ? {} : Object.keys(customVariants).reduce((variants, key) => {
        const { options = {}, transition: framerTransition = {}, ...animation } = customVariants[key];
        const {
            staggerType = 'first',
            baseDelay = 0,
            stagger = 0.05,
            randomStart = [],
        } = options;

        const animationRandomStart = {};

        if (randomStart.length) {
            randomStart.forEach((attr) => {
                if (animation[attr] && Array.isArray(animation[attr]) && animation[attr].length >= 3) {
                    const animArray = animation[attr];

                    if (animArray.length === 3) {
                        const [min, max, target] = [animArray[0], animArray[1], animArray[2]]
                        const mixer = mix(min, max);
                        animationRandomStart[attr] = [mixer(generateRandomScale()), target]
                    } else {
                        if (animArray.length % 2 === 0 && animArray.slice(1).some(val => val !== null)) {
                            const result = [animArray[0]];

                            for (let i = 1; i < animArray.length - 1; i += 2) {
                                const min = animArray[i];
                                const max = animArray[i + 1];
                                const mixer = mix(min, max);
                                result.push(mixer(generateRandomScale()));
                            }

                            result.push(animArray[animArray.length - 1]);
                            animationRandomStart[attr] = result;
                        }
                    }
                }
            })
        }

        const delay =
            staggerType === 'random' ? (wordRandomStagger * stagger) + baseDelay :
                staggerType === 'last' ? (Math.abs(flatIndex - (wordLength - 1)) * stagger) + baseDelay :
                    (flatIndex * stagger) + baseDelay
            ;

        variants[key] = { ...animation, ...animationRandomStart, transition: { ...framerTransition, delay } };

        return variants;
    }, {})

    const motionWord = (
        <motion.span
            className={styles.word}
            style={style}
            animate={inViewHook ? { ...wordAnimateFiltered, transition } : { ...initialAnimate, transition }}
            variants={options?.makeVariant ? { [options.variantName]: { ...wordAnimateFiltered, transition }, ...fixedCustomVariants } : fixedCustomVariants}
        >
            {children}
        </motion.span>
    )

    return useWrapper ? (
        <span className={styles.word_wrapper} style={wordWrapperStyle}>
            {motionWord}
        </span>
    ) : (motionWord);
}

/**
 * Props yang digunakan component `Char`
 * @typedef {Object} CharProps
 * @property {inViewHook} inViewHook
 * @property {charAnimate & {options:presetOptions}} charAnimate
 * @property {number} charRandomStagger
 * @property {number} charLength
 * @property {flatIndex} flatIndex
 * @property {Object<string, Variant & {options:customVariantOptions}>} customVariants
 * Custom character `variants`
 * @property {React.ReactNode} children
 */

/**
 * Component Description
 * @param {CharProps} props Char props
 * @returns {React.ReactElement} Rendered component
 */
const Char = ({ inViewHook, charAnimate, charRandomStagger, charLength, flatIndex, customVariants, children }) => {
    /**
     * Method untuk menghitung delay agar menciptakan animasi efek stagger per-huruf berdasarkan tipe stagger yang digunakan
     * @returns {number} Delay yang sudah dihitung
     */
    const countDelay = () => {
        const staggerType = charAnimate ? charAnimate?.options?.charStagger ?? 'first' : 'first';
        const { delay = 0.1, baseDelay = 0 } = charAnimate?.transition;

        if (staggerType === 'random') {
            return (charRandomStagger * delay) + baseDelay
        } else if (staggerType === 'last') {
            return (Math.abs(flatIndex - (charLength - 1)) * delay) + baseDelay
        } else {
            return (flatIndex * delay) + baseDelay
        }
    }

    const updatedPresetDelay = !charAnimate ? {} : {
        ...charAnimate,
        transition: {
            ...charAnimate.transition,
            delay: countDelay()
        }
    };
    const { options, _initial, transition, ...charAnimateFiltered } = updatedPresetDelay;

    const fixedCustomVariants = !customVariants ? {} : Object.keys(customVariants).reduce((variants, key) => {
        const { options = {}, transition: framerTransition = {}, ...animation } = customVariants[key];
        const {
            staggerType = 'first',
            baseDelay = 0,
            stagger = 0.05,
            randomStart = [],
        } = options;

        const animationRandomStart = {};

        if (randomStart.length) {
            randomStart.forEach((attr) => {
                if (animation[attr] && Array.isArray(animation[attr]) && animation[attr].length >= 3) {
                    const animArray = animation[attr];

                    if (animArray.length === 3) {
                        const [min, max, target] = [animArray[0], animArray[1], animArray[2]]
                        const mixer = mix(min, max);
                        animationRandomStart[attr] = [mixer(generateRandomScale()), target]
                    } else {
                        if (animArray.length % 2 === 0 && animArray.slice(1).some(val => val !== null)) {
                            const result = [animArray[0]];

                            for (let i = 1; i < animArray.length - 1; i += 2) {
                                const min = animArray[i];
                                const max = animArray[i + 1];
                                const mixer = mix(min, max);
                                result.push(mixer(generateRandomScale()));
                            }

                            result.push(animArray[animArray.length - 1]);
                            animationRandomStart[attr] = result;
                        }
                    }
                }
            })
        }

        const delay =
            staggerType === 'random' ? (charRandomStagger * stagger) + baseDelay :
                staggerType === 'last' ? (Math.abs(flatIndex - (charLength - 1)) * stagger) + baseDelay :
                    (flatIndex * stagger) + baseDelay
            ;

        variants[key] = { ...animation, ...animationRandomStart, transition: { ...framerTransition, delay } };

        return variants;
    }, {})

    return (
        <motion.span
            className={styles.char}
            animate={inViewHook ? { ...charAnimateFiltered, transition } : { ..._initial, transition }}
            variants={options?.makeVariant ? { [options.variantName]: { ...charAnimateFiltered, transition }, ...fixedCustomVariants } : fixedCustomVariants}
        >
            {children}
        </motion.span>
    )
}

const Spaces = () => (
    <span> </span>
)

/**
 * Method untuk generate angka acak diantara `0` sampai `1` dengan pembulatan 2 decimal 
 * @returns {number} Angka acak
 * @example 
 * ```js
 * console.log(generateRandomScale()) // 0.37
 * console.log(generateRandomScale()) // 0.78
 * console.log(generateRandomScale()) // 0.52
 * ```
 */
const generateRandomScale = () => {
    return parseFloat((Math.random()).toFixed(2));
}

/**
 * Method untuk generate array dengan length `max` yang berisikan angka `0` sampai `max - 1` dengan urutan acak
 * @param {number} [max=5] Length array, default `5`
 * @returns {Array<number>} Array yang berisikan angka
 * @example 
 * ```js
 * console.log(generateRandomFlatIndex(7)); // [3, 5, 2, 1, 4, 6, 0]
 * console.log(generateRandomFlatIndex(3)); // [2, 0, 1]
 * console.log(generateRandomFlatIndex(5)); // [4, 1, 0, 3, 2]
 * ```
 */
const generateRandomFlatIndex = (max = 5) => {
    const arr = Array.from({ length: max }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export default HighlightText;