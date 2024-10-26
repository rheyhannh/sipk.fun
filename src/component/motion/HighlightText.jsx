// #region TYPE DEPEDENCY
import { MotionStyle } from 'framer-motion';
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
 * Fitur `randomStart` memungkinkan untuk memulai animasi tertentu dengan nilai awal acak
 * berdasarkan suatu batasan nilai terkecil dan terendah menggunakan component `mix` pada framer-motion.
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
 * `makeVariant` terlebih dahulu pada pengaturan preset yang digunakan
 * @property {hookOptions} hookOptions
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
    const inViewHook = useHook ? useInView(markRef, hookOptions) : false;

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
                        variantName: presetOptions?.variantName ?? 'highlight_text'
                    }
                }
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
                        variantName: presetOptions?.variantName ?? 'highlight_text'
                    }
                },
                charAnimate: undefined
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
                        variantName: presetOptions?.variantName ?? 'highlight_text'
                    }
                },
                charAnimate: undefined
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
                        variantName: presetOptions?.variantName ?? 'highlight_text'
                    }
                },
                charAnimate: undefined
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
                        randomStart: ['rotateX', 'x', 'y', 'z']
                    }
                },
                charAnimate: undefined
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
                        variantName: presetOptions?.variantName ?? 'highlight_text'
                    }
                }
            }
        }
    }

    let flatCharIndex = 0;

    React.useEffect(() => {
        setUsedPreset(resolvePreset());
    }, [preset, adjustWavingColor, adjustSpringRotate, adjustWavingTranslate, adjustWavingFlyIn, adjustWavingRotation, adjustMixFancyTranslate])

    return (
        <motion.mark
            ref={markRef}
            className={styles.container}
            style={usedPreset?.containerStyle}
        >
            <Wrapper style={usedPreset?.wrapperStyle}>
                {textChars.map((item, index) => (
                    item !== '_spaces_' ? (
                        <Word inViewHook={inViewHook} style={usedPreset?.wordStyle} wordAnimate={usedPreset?.wordAnimate} wordWrapperStyle={usedPreset?.wordWrapperStyle ?? null} flatIndex={index} key={index}>
                            {item.map((char, charIndex) => {
                                const currentFlatCharIndex = flatCharIndex++;
                                return (
                                    <Char inViewHook={inViewHook} charAnimate={usedPreset?.charAnimate} flatIndex={currentFlatCharIndex} key={`${index}-${charIndex}`}>
                                        {char}
                                    </Char>
                                );
                            })}
                        </Word>
                    ) : (<Spaces key={index} />)
                ))}
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
 * @property {flatIndex} flatIndex
 * @property {React.ReactNode} children
 */

/**
 * Component Description
 * @param {WordProps} props Word props
 * @returns {React.ReactElement} Rendered component
 */
const Word = ({ inViewHook, style, wordAnimate, wordWrapperStyle = null, flatIndex, children }) => {
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

    const updatedPresetDelay = !wordAnimate ? {} : {
        ...wordAnimate,
        ...wordAnimateUpdated,
        transition: {
            ...wordAnimate.transition,
            delay: (flatIndex * wordAnimate.transition.delay) + wordAnimate.transition.baseDelay
        }
    };
    const { options, ...wordAnimateWithoutOptions } = updatedPresetDelay;

    const motionWord = (
        <motion.span
            className={styles.word}
            style={style}
            animate={inViewHook ? wordAnimateWithoutOptions : {}}
            variants={options?.makeVariant ? { [options.variantName]: wordAnimateWithoutOptions } : {}}
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
 * @property {charAnimate} charAnimate
 * @property {flatIndex} flatIndex
 * @property {React.ReactNode} children
 */

/**
 * Component Description
 * @param {CharProps} props Char props
 * @returns {React.ReactElement} Rendered component
 */
const Char = ({ inViewHook, charAnimate, flatIndex, children }) => {
    const updatedPresetDelay = !charAnimate ? {} : {
        ...charAnimate,
        transition: {
            ...charAnimate.transition,
            delay: (flatIndex * charAnimate.transition.delay) + charAnimate.transition.baseDelay
        }
    };
    const { options, ...charAnimateWithoutOptions } = updatedPresetDelay;

    return (
        <motion.span
            className={styles.char}
            animate={inViewHook ? charAnimateWithoutOptions : {}}
            variants={options?.makeVariant ? { [options.variantName]: charAnimateWithoutOptions } : {}}
        >
            {children}
        </motion.span>
    )
}

const Spaces = () => (
    <span> </span>
)

const generateRandomScale = () => {
    return parseFloat((Math.random()).toFixed(2));
}

export default HighlightText;