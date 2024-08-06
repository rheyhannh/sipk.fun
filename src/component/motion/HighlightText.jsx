// #region TYPE DEPEDENCY
import { MotionStyle } from 'framer-motion';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useInView } from 'framer-motion';
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
 * @typedef {Object} resolvedPreset
 * @property {containerStyle} containerStyle
 * Style yang digunakan element mark sebagai `Container`, dapat bernilai `undefined`
 * @property {wrapperStyle} wrapperStyle
 * Style yang digunakan component `Wrapper`, dapat bernilai `undefined`
 * @property {wordStyle} wordStyle
 * Style yang digunakan component `Word`, dapat bernilai `undefined`
 * @property {wordAnimate} wordAnimate
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
 * @property {Object} options
 * Opsi tambahan yang dapat digunakan
 * @property {boolean} options.makeVariant
 * Buat animasi dalam variant sehingga dapat dimainkan melalui `motion` parent element
 * - Default : `false`
 * @property {string} options.variantName
 * Nama variant yang digunakan
 * - Default : `'wavingColor'`
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
 * @property {Object} options
 * Opsi tambahan yang dapat digunakan
 * @property {boolean} options.makeVariant
 * Buat animasi dalam variant sehingga dapat dimainkan melalui `motion` parent element
 * - Default : `false`
 * @property {string} options.variantName
 * Nama variant yang digunakan
 * - Default : `'wavingTranslate'`
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
 * @property {Object} options
 * Opsi tambahan yang dapat digunakan
 * @property {boolean} options.makeVariant
 * Buat animasi dalam variant sehingga dapat dimainkan melalui `motion` parent element
 * - Default : `false`
 * @property {string} options.variantName
 * Nama variant yang digunakan
 * - Default : `'springRotate'`
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

/** Props yang digunakan component `TextWavingColor`
 * @typedef {Object} TextWavingColorProps
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
 * @property {'wavingColor'|'wavingTranslate'|'springRotate'} [preset]
 * Preset animasi yang digunakan
 * - Default : `'wavingColor'`
 * @property {adjustWavingColor} adjustWavingColor
 * Opsi atribut animasi yang digunakan dan pengaturan lainnya yang dapat diadjust pada preset `'wavingColor'`
 * @property {adjustWavingTranslate} adjustWavingTranslate
 * Opsi atribut animasi yang digunakan dan pengaturan lainnya yang dapat diadjust pada preset `'wavingTranslate'`
 * @property {adjustSpringRotate} adjustSpringRotate
 * Opsi atribut animasi yang digunakan dan pengaturan lainnya yang dapat diadjust pada preset `'springRotate'`
 */

/**
 * Component untuk highlight suatu teks dengan preset animasi tertentu yang dapat diadjust
 * @param {TextWavingColorProps} props TextWavingColor props
 * @returns {React.ReactElement} Rendered component
 */
const HighlightText = (
    {
        text = 'highlighted text',
        useHook = true,
        hookOptions,
        preset,
        adjustWavingColor,
        adjustWavingTranslate,
        adjustSpringRotate
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
                        makeVariant: adjustWavingTranslate?.options?.makeVariant ?? false,
                        variantName: adjustWavingTranslate?.options?.variantName ?? 'wavingTranslate'
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
                        makeVariant: adjustSpringRotate?.options?.makeVariant ?? false,
                        variantName: adjustSpringRotate?.options?.variantName ?? 'springRotate'
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
                        makeVariant: adjustWavingColor?.options?.makeVariant ?? false,
                        variantName: adjustWavingColor?.options?.variantName ?? 'wavingColor'
                    }
                }
            }
        }
    }

    let flatCharIndex = 0;

    React.useEffect(() => {
        setUsedPreset(resolvePreset());
    }, [preset, adjustWavingColor, adjustSpringRotate, adjustWavingTranslate])

    return (
        <motion.mark
            ref={markRef}
            className={styles.container}
            style={usedPreset?.containerStyle}
        >
            <Wrapper style={usedPreset?.wrapperStyle}>
                {textChars.map((item, index) => (
                    item !== '_spaces_' ? (
                        <Word inViewHook={inViewHook} style={usedPreset?.wordStyle} wordAnimate={usedPreset?.wordAnimate} flatIndex={index} key={index}>
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

const Wrapper = ({ style, children }) => (
    <span
        className={styles.wrapper}
        style={style}
    >
        {children}
    </span>
)

const Word = ({ inViewHook, style, wordAnimate, flatIndex, children }) => {
    const updatedPresetDelay = !wordAnimate ? {} : {
        ...wordAnimate,
        transition: {
            ...wordAnimate.transition,
            delay: (flatIndex * wordAnimate.transition.delay) + wordAnimate.transition.baseDelay
        }
    };
    const { options, ...wordAnimateWithoutOptions } = updatedPresetDelay;

    return (
        <motion.span
            className={styles.word}
            style={style}
            animate={inViewHook ? wordAnimateWithoutOptions : {}}
            variants={options?.makeVariant ? { [options.variantName]: wordAnimateWithoutOptions } : {}}
        >
            {children}
        </motion.span>
    )
}

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

export default HighlightText;