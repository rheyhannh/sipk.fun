// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useInView } from 'framer-motion';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/highlight_text.module.css'
// #endregion

/** Opsi atau atribut yang dapat dicustom saat menggunakan preset `wavingColor`
 * @typedef {Object} adjustWavingColor
 * @property {[number, number, number]} scale
 * Lorem
 * - Default : `[null, 1.45, 1]`
 * @property {[string, string, string]} color 
 * Lorem
 * - Default : `[null, '#556b9d', '#FF6341']`
 * @property {number} duration 
 * Lorem
 * - Default : `0.3`
 * @property {number} stagger 
 * Lorem
 * - Default : `0.05`
 * @property {number} repeat 
 * Lorem
 * - Default : `0`
 * @property {number} repeatDelay 
 * Lorem
 * - Default : `0.1`
 */

/** Opsi atau atribut yang dapat dicustom saat menggunakan preset `wavingTranslate`
 * @typedef {Object} adjustWavingTranslate
 * @property {number} perspective
 * Lorem
 * - Default : `500`
 * @property {[number, number]} z
 * Lorem
 * - Default : `[300, 0]`
 * @property {[number, number]} rotateX 
 * Lorem
 * - Default : `[-45, 0]`
 * @property {[number, number]} opacity 
 * Lorem
 * - Default : `[0, 1]`
 * @property {number} duration 
 * Lorem
 * - Default : `0.8`
 * @property {number} stagger 
 * Lorem
 * - Default : `0.04`
 * @property {number} repeat 
 * Lorem
 * - Default : `0`
 * @property {number} repeatDelay 
 * Lorem
 * - Default : `0.1`
 */

/** Opsi atau atribut yang dapat dicustom saat menggunakan preset `springRotate`
 * @typedef {Object} adjustSpringRotate
 * @property {string} transformOrigin
 * Lorem
 * - Default : `'0% 50%'`
 * @property {[number, number]} rotateZ
 * Lorem
 * - Default : `[-30, 0]`
 * @property {[number, number]} opacity 
 * Lorem
 * - Default : `[0, 1]`
 * @property {number} duration 
 * Lorem
 * - Default : `1.2`
 * @property {number} stagger 
 * Lorem
 * - Default : `0.2`
 * @property {number} repeat 
 * Lorem
 * - Default : `0`
 * @property {number} bounce
 * Lorem
 * - Default : `0.5`
 * @property {number} repeatDelay 
 * Lorem
 * - Default : `0.1`
 */

/** Opsi yang dapat digunakan untuk hook `'useInView'` yang digunakan
 * @typedef {Object} hookOptions
 * @property {boolean} [once]
 * Boolean untuk trigger animasi saat masuk viewport sekali saja
 * - Tag : `optional`
 * - Default : `false`
 * @property {number} [amount]
 * Persentase untuk trigger animasi dalam skala `0` hingga `1`.
 * Semakin besar maka semakin besar element harus masuk viewport untuk trigger animasi
 * - Tag : `optional`
 * - Default : `0`
 */

/** Props yang digunakan component `TextWavingColor`
 * @typedef {Object} TextWavingColorProps
 * @property {string} [text]
 * Teks yang digunakan 
 * - Tag : `optional`
 * - Default : `'highlighted text'`
 * @property {hookOptions} hookOptions
 * @property {'wavingColor'|'wavingTranslate'|'springRotate'} [preset]
 * Preset animasi yang digunakan
 * - Default : `'wavingColor'`
 * @property {adjustWavingColor} adjustWavingColor
 * @property {adjustWavingTranslate} adjustWavingTranslate
 * @property {adjustSpringRotate} adjustSpringRotate
 */

/**
 * Component Description
 * @param {TextWavingColorProps} props TextWavingColor props
 * @returns {React.ReactElement} Rendered component
 */
const HighlightText = (
    {
        text = 'highlighted text',
        hookOptions,
        preset,
        adjustWavingColor,
        adjustWavingTranslate,
        adjustSpringRotate
    }
) => {
    const [usedPreset, setUsedPreset] = React.useState(null);
    const markRef = React.useRef(null);
    const inViewHook = useInView(markRef, hookOptions);

    const textWords = text.split(' ').flatMap((word, index, arr) => index < arr.length - 1 ? [word, '_spaces_'] : [word]);
    const textChars = textWords.map(word => word === '_spaces_' ? word : word.split(''));

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
            delay: (flatIndex * wordAnimate.transition.delay)
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
            delay: (flatIndex * charAnimate.transition.delay)
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