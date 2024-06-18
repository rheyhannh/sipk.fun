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
 * @param {boolean} [props.useBoxShadow] Boolean untuk menggunakan box shadow
 * - Default : `true`
 * @param {MotionTypes.CommonAnimationName | 'custom'} [props.enterAnimation] 
 * Animasi yang digunakan. Jika menggunakan `'custom'`, silahkan pass props `customEnterAnimation`
 * - Default : `'throwDown'`
 * @param {Variants} [props.customEnterAnimation] Object yang berisikan key `hide` yang merupakan initial styles dan `show` yang merupakan animated styles yang diterapkan
 * - Default : `{ hide: { opacity: 0 }, show: { opacity: 1 } }`
 * @param {CSSProperties} [props.style] Object yang berisikan style yang digunakan.
 * Secara default menggunakan style sebagai berikut,
 * ```js
 * const style = {};
 * style.position = 'relative';
 * style.width = 'max-content';
 * style.height = 'max-content';
 * style.fontSize = '1rem';
 * style.color = 'var(--dark-color)';
 * style.borderRadius = 'calc(0.25 * 1rem)';
 * style.padding = 'calc(0.25 * 1rem)';
 * style.backgroundColor = 'var(--logo-second-color)';
 * ```
 * @param {HTMLProps | MotionProps} [props.otherProps] Object yang berisikan props lainnya yang digunakan
 * - Note : Props `motion` seperti `animate`, `transition` dan lainnya dapat digunakan
 * - Default : `{}`
 * @returns 
 */
const TextBox = (
    {
        text = 'Lorem ipsum',
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
            style={style}
            variants={variants}
            {...otherProps}
        >
            <motion.span
                className={otherProps.className ? null : styles.content}
            >
                {text}
            </motion.span>
        </motion.div>
    )
}

export default TextBox;