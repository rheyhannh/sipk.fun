// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from 'framer-motion';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/style/button.module.css';
// #endregion

/**
 * Button component props with variants `Translate`
 * @typedef {Object} TranslateVariantsProps
 * @property {Object} [textColor]
 * Button text color
 * - Default :
 * 
 * ```js
 * { unhover: '#000000', hover: '#b4af79' }
 * ```
 * @property {string} textColor.unhover
 * Button text color, can be hex or rgb color
 * - Default : `#000000`
 * @property {string} textColor.hover
 * Button text color when hover, can be hex or rgb color
 * - Default : `#b4af79`
 * @property {Object} [bgColor]
 * Button background color
 * - Default :
 * 
 * ```js
 * { unhover: '#b4af79', hover: '#000000' }
 * ```
 * @property {string} bgColor.unhover
 * Button background color, can be hex or rgb color
 * - Default : `#b4af79`
 * @property {string} bgColor.hover
 * Button background color when hover, can be hex or rgb color
 * - Default : `#000000`
 * @property {Object} borderColor
 * Button border color
 * - Default : 
 * 
 * ```js
 * { unhover: '#d7d9dc', hover: '#000000' }
 * ```
 * @property {string} borderColor.unhover
 * Button border color, can be hex or rgb color
 * - Default : `#d7d9dc`
 * @property {string} borderColor.hover
 * Button border color when hover, can be hex or rgb color
 * - Default : `#000000`
 * @property {'oval' | 'rectangle'} shape
 * Shape type
 * - Default : `rectangle`
 * @property {'left' | 'right' | 'top' | 'top_left' | 'top_right' | 'bottom' | 'bottom_left' | 'bottom_right'} animationDirection
 * Animation direction
 * - Default : `top`
 */

/**
 * Render button element dengan tipe animasi `Translate` menggunakan `className` yang sudah ditentukan. 
 * Animasi akan dimainkan saat dihover maupun focus. 
 * 
 * Pastikan tidak override props yang diomit untuk memastikan animasi berjalan sesuai yang diharapkan.
 * @param {Omit<import('framer-motion').HTMLMotionProps<'button'>, 'variants' | 'whileHover' | 'whileFocus' | 'className'> & TranslateVariantsProps} props ButtonTranslate props
 * @returns {React.ReactElement<TranslateVariantsProps, HTMLButtonElement>} Rendered component
 */
export function ButtonTranslate({ children, textColor, bgColor, borderColor, shape, animationDirection, style, ...props }) {
    return (
        <motion.button
            data-shape={shape || 'rectangle'}
            data-direction={animationDirection || 'top'}
            className={styles.translate_variant}
            initial={{
                '--textColor': textColor?.unhover || '#000000',
                '--textColor-hover': textColor?.hover || '#b4af79',
                '--bgColor': bgColor?.unhover || '#b4af79',
                '--bgColor-hover': bgColor?.hover || '#000000',
                '--borderColor': borderColor?.unhover || '#d7d9dc',
                '--borderColor-hover': borderColor?.hover || '#000000',
                color: 'var(--textColor)',
                border: '1px solid var(--borderColor)',
                ...style
            }}
            variants={{
                active: {
                    border: '1px solid var(--borderColor-hover)',
                    color: 'var(--textColor-hover)',
                },
            }}
            whileHover={'active'}
            whileFocus={'active'}
            transition={{ duration: 0.75, delay: 0.1, ease: 'easeInOut' }}
            {...props}
        >
            {children}
        </motion.button>
    )
}

/**
 * Component yang sama dengan {@link ButtonTranslate} namun dibungkus dengan {@link React.forwardRef forwardRef} dan menggunakan anchor element sehingga dapat digunakan
 * bersamaan dengan component `Link` pada Next.js.
 * 
 * Gunakan component ini bersamaan dengan component Link disaat target URL membutuhkan prefetch, lihat `example` untuk contohnya.
 * 
 * @see Component {@link ButtonTranslate}
 * @see Next.js {@link https://nextjs.org/docs/pages/api-reference/components/link#if-the-child-is-a-custom-component-that-wraps-an-a-tag Link Docs}
 * @example
 * ```jsx
 * import Link from 'next/link'
 * import { ButtonTranslateForwarded } from 'source'
 * 
 * const MyPage = () => {
 *      return (
 *          <div>
 *              <Link href={'/thisPageNeedToBePrefetched'} passHref legacyBehavior>
 *                  <ButtonTranslateForwarded>
 *                      Page that need to be prefetched
 *                  </ButtonTranslateForwarded>
 *              </Link>
 *          </div>
 *      )
 * }
 * ```
 */
export const ButtonTranslateForwarded = React.forwardRef((
    /** @type {Omit<import('framer-motion').HTMLMotionProps<'button'>, 'variants' | 'whileHover' | 'whileFocus' | 'className'> & TranslateVariantsProps} */
    {
        children,
        textColor,
        bgColor,
        borderColor,
        shape,
        animationDirection,
        style,
        href,
        onClick,
        ...props
    },
    ref
) => (
    <motion.a
        ref={ref}
        href={href}
        onClick={onClick}
        onClickCapture={(event) => { if (event.currentTarget) { event.currentTarget.blur() } }}
        data-shape={shape || 'rectangle'}
        data-direction={animationDirection || 'top'}
        className={styles.translate_variant}
        initial={{
            '--textColor': textColor?.unhover || '#000000',
            '--textColor-hover': textColor?.hover || '#b4af79',
            '--bgColor': bgColor?.unhover || '#b4af79',
            '--bgColor-hover': bgColor?.hover || '#000000',
            '--borderColor': borderColor?.unhover || '#d7d9dc',
            '--borderColor-hover': borderColor?.hover || '#000000',
            color: 'var(--textColor)',
            border: '1px solid var(--borderColor)',
            ...style
        }}
        variants={{
            active: {
                border: '1px solid var(--borderColor-hover)',
                color: 'var(--textColor-hover)',
            },
        }}
        whileHover={'active'}
        whileFocus={'active'}
        transition={{ duration: 0.75, delay: 0.1, ease: 'easeInOut' }}
        {...props}
    >
        {children}
    </motion.a>
))

/**
 * Button component props with variants `Simple`
 * @typedef {Object} SimpleVariantsProps
 * @property {Object} [textColor]
 * Button text color
 * - Default :
 * 
 * ```js
 * { unhover: '#000000', hover: '#b4af79' }
 * ```
 * @property {string} textColor.unhover
 * Button text color, can be hex or rgb color
 * - Default : `#000000`
 * @property {string} textColor.hover
 * Button text color when hover, can be hex or rgb color
 * - Default : `#b4af79`
 * @property {Object} [bgColor]
 * Button background color
 * - Default :
 * 
 * ```js
 * { unhover: '#b4af79', hover: '#000000' }
 * ```
 * @property {string} bgColor.unhover
 * Button background color, can be hex or rgb color
 * - Default : `#b4af79`
 * @property {string} bgColor.hover
 * Button background color when hover, can be hex or rgb color
 * - Default : `#000000`
 * @property {Object} borderColor
 * Button border color
 * - Default : 
 * 
 * ```js
 * { unhover: '#d7d9dc', hover: '#000000' }
 * ```
 * @property {string} borderColor.unhover
 * Button border color, can be hex or rgb color
 * - Default : `#d7d9dc`
 * @property {string} borderColor.hover
 * Button border color when hover, can be hex or rgb color
 * - Default : `#000000`
 */

/**
 * Render button element dengan tipe `Simple` menggunakan `className` yang sudah ditentukan. 
 * @param {Omit<React.HTMLProps<HTMLButtonElement>, 'className'> & SimpleVariantsProps} props ButtonSimple props
 * @returns {React.ReactElement<SimpleVariantsProps, HTMLButtonElement>} Rendered component
 */
export function ButtonSimple({ children, textColor, bgColor, borderColor, style, ...props }) {
    return (
        <button
            className={styles.simple_variant}
            style={{
                '--textColor': textColor?.unhover || '#000000',
                '--textColor-hover': textColor?.hover || '#b4af79',
                '--bgColor': bgColor?.unhover || '#b4af79',
                '--bgColor-hover': bgColor?.hover || '#000000',
                '--borderColor': borderColor?.unhover || '#d7d9dc',
                '--borderColor-hover': borderColor?.hover || '#000000',
                ...style
            }}
            {...props}
        >
            {children}
        </button>
    )
}

/**
 * Component yang sama dengan {@link ButtonSimple} namun dibungkus dengan {@link React.forwardRef forwardRef} dan menggunakan anchor element sehingga dapat digunakan
 * bersamaan dengan component `Link` pada Next.js.
 * 
 * Gunakan component ini bersamaan dengan component Link disaat target URL membutuhkan prefetch, lihat `example` untuk contohnya.
 * 
 * @see Component {@link ButtonSimple}
 * @see Next.js {@link https://nextjs.org/docs/pages/api-reference/components/link#if-the-child-is-a-custom-component-that-wraps-an-a-tag Link Docs}
 * @example
 * ```jsx
 * import Link from 'next/link'
 * import { ButtonSimple } from 'source'
 * 
 * const MyPage = () => {
 *      return (
 *          <div>
 *              <Link href={'/thisPageNeedToBePrefetched'} passHref legacyBehavior>
 *                  <ButtonSimple>
 *                      Page that need to be prefetched
 *                  </ButtonSimple>
 *              </Link>
 *          </div>
 *      )
 * }
 * ```
 */
export const ButtonSimpleForwarded = React.forwardRef((
    /** @type {Omit<React.HTMLProps<HTMLAnchorElement>, 'className'> & SimpleVariantsProps} */
    {
        children,
        textColor,
        bgColor,
        borderColor,
        style,
        href,
        onClick,
        ...props
    },
    ref
) => (
    <a
        ref={ref}
        href={href}
        onClick={onClick}
        onClickCapture={(event) => { if (event.currentTarget) { event.currentTarget.blur() } }}
        className={styles.simple_variant}
        style={{
            '--textColor': textColor?.unhover || '#000000',
            '--textColor-hover': textColor?.hover || '#b4af79',
            '--bgColor': bgColor?.unhover || '#b4af79',
            '--bgColor-hover': bgColor?.hover || '#000000',
            '--borderColor': borderColor?.unhover || '#d7d9dc',
            '--borderColor-hover': borderColor?.hover || '#000000',
            ...style
        }}
        {...props}
    >
        {children}
    </a>
))