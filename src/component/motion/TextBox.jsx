// #region TYPE DEPEDENCY
import { HTMLProps, CSSProperties } from 'react';
import { MotionProps, Variants } from 'framer-motion';
import * as MotionTypes from './types/_global';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from "framer-motion";
// #endregion

// #region UTIL DEPEDENCY
import { getCommonAnimationVariants } from './_helper';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/text_box.module.css'
// #endregion

/**
 * 
 * @param {Object} props
 * @param {string} [props.text] Teks konten
 * - Default : `'Lorem ipsum'`
 * @param {string} [props.fontSize] Font size teks konten
 * - Default : `'1rem'`
 * @param {string} [props.color] Warna teks konten
 * - Default : `'var(--dark-color)'`
 * @param {string} [props.borderRadius] Border radius box konten
 * - Default : `'calc(0.25 * ${fontSize})'`
 * @param {string} [props.padding] Padding box konten
 * - Default : `'calc(0.25 * ${fontSize})'`
 * @param {string} [props.background] Background box konten
 * - Default : `'none'`
 * @param {boolean} [props.useBoxShadow] Boolean untuk menggunakan box shadow
 * - Default : `true`
 * @param {MotionTypes.CommonAnimationName | 'custom'} [props.enterAnimation] 
 * Animasi yang digunakan. Jika menggunakan `'custom'`, silahkan pass props `customEnterAnimation`
 * - Default : `'throwDown'`
 * @param {Variants} [props.customEnterAnimation] Object yang berisikan key `hide` yang merupakan initial styles dan `show` yang merupakan animated styles yang diterapkan
 * - Default : `{ hide: { opacity: 0 }, show: { opacity: 1 } }`
 * @param {CSSProperties} [props.style] Object yang berisikan style tambahan yang digunakan
 * - Default : `{}`
 * @param {HTMLProps | MotionProps} [props.otherProps] Object yang berisikan props lainnya yang digunakan
 * - Note : Props `motion` seperti `animate`, `transition` dan lainnya dapat digunakan
 * - Default : `{}`
 * @returns 
 */
const TextBox = (
    {
        text = 'Lorem ipsum',
        fontSize = '1rem',
        color = 'var(--dark-color)',
        borderRadius = `calc(0.25 * ${fontSize})`,
        padding = `calc(0.25 * ${fontSize})`,
        background = 'none',
        useBoxShadow = true,
        enterAnimation = 'throwDown',
        customEnterAnimation = { hide: { opacity: 0 }, show: { opacity: 1 } },
        style = {},
        otherProps = {}
    }
) => {
    const variants = enterAnimation === 'custom' ? { ...customEnterAnimation } : getCommonAnimationVariants(enterAnimation);

    return (
        <motion.div
            className={`${styles.container} ${useBoxShadow ? styles.shadow : ''}`}
            style={{
                borderRadius,
                ...style
            }}
            variants={variants}
            {...otherProps}
        >
            <motion.span
                className={styles.content}
                style={{
                    fontSize,
                    color,
                    borderRadius,
                    padding,
                    background,
                }}
            >
                {text}
            </motion.span>
        </motion.div>
    )
}

export default TextBox;