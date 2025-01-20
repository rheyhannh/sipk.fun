'use client'

// #region NEXT DEPEDENCY
import Link from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from 'framer-motion';
// #endregion

// #region ICON DEPEDENCY
import {
    FiArrowUpRight
} from 'react-icons/fi';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@root_page/root.module.css';
// #endregion

export const Container = ({ children }) => (
    <div className={styles.container}>
        {children}
    </div>
)

/**
 * Component Description
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props ContainerWrapper props
 * @returns {React.ReactElement} Rendered component
 */
export const ContainerWrapper = ({ children, ...props }) => (
    <div className={styles.container_wrap} {...props}>
        {children}
    </div>
)

/**
 * Props yang digunakan component `VisibilityWrapper`
 * @typedef {Object} VisibilityWrapperProps
 * @property {keyof import('framer-motion')['motion']} as
 * Tipe element motion yang digunakan
 * 
 * - Default : `div`
 */

/**
 * Component {@link motion} dengan menggunakan preset props berikut,
 * 
 * ```js
 * {
 *      initial: { visibility: 'hidden' },
 *      variants: { inView: { visibility: 'visible' } }
 * }
 * ```
 * 
 * @template [Tag='div']
 * @param {import('framer-motion').HTMLMotionProps<Tag> & VisibilityWrapperProps} props VisibilityWrapper props
 * @returns {React.ReactElement} Rendered component
 */
export const VisibilityWrapper = ({ as: Tag = 'div', children, ...props }) => {
    const MotionTag = motion[Tag] ?? motion.div;

    return (
        <MotionTag
            {...props}
            initial={{ visibility: 'hidden' }}
            variants={{ inView: { visibility: 'visible' } }}
        >
            {children}
        </MotionTag>
    )
}

/**
 * Props yang digunakan component `LinkHash`
 * @typedef {Object} LinkHashProps
 * @property {string} text
 * Teks yang tampil
 * 
 * - Contoh : `Home`
 * @property {string} hashId
 * Hash atau element id terkait tanpa tanda pagar `#`
 * 
 * - Contoh : `fitur`
 * @property {boolean} [isOpenNewTab]
 * Konten atau link dibuka di tab baru. Ini akan menambahkan attribut `_blank` dan menambahkan render icon 
 * eksternal atau `arrowTopRight`
 * 
 * - Default : `false`
 * @property {import('next/link').LinkProps['scroll']} [scroll]
 * Opsi `scroll` pada component Link, disini kita merubah default valuenya.
 * 
 * - Default : `false`
 * @property {[string, Parameters<Element['scrollIntoView']>[0], Parameters<Element['scrollIntoView']>[0]] | Parameters<Element['scrollIntoView']>[0]} [scrollRules]
 * 
 * Untuk melakukan scroll ke element terkait, kita menggunakan [scrollIntoView](https://developer.mozilla.org/docs/Web/API/Element/scrollIntoView).
 * Props ini dapat berupa object [scrollIntoViewOptions](https://developer.mozilla.org/docs/Web/API/Element/scrollIntoView) atau array dengan length `3` yang berisikan sebuah rules untuk melakukan scroll.
 * - Index `0` merupakan rule query untuk {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia matchMedia}, contoh `(max-width: 1023px)`
 * - Index `1` merupakan opsi [scrollIntoViewOptions](https://developer.mozilla.org/docs/Web/API/Element/scrollIntoView) yang digunakan saat rule terpenuhi
 * - Index `2` merupakan opsi [scrollIntoViewOptions](https://developer.mozilla.org/docs/Web/API/Element/scrollIntoView) yang digunakan saat rule tidak dipenuhi
 * 
 * ```js
 * const scrollRules = [
 *      '(max-width: 1023px)', 
 *      { block: 'start' }, 
 *      { block: 'end', inline: 'nearest' }
 * ]
 * 
 * // Default
 * { behaviour: 'smooth', block: 'center' }
 * ```
 * @property {boolean} [focusTarget]
 * Blur element dan focus element target setelah klik
 * 
 * - Default : `false`
 */

/**
 * Component sebagai element anchor untuk melakukan navigasi dan scroll ke element tertentu
 * dengan melakukan navigasi secara client-side menggunakan component `Link` dan melakukan scroll menggunakan [scrollIntoView](https://developer.mozilla.org/docs/Web/API/Element/scrollIntoView). 
 * Component ini menggunakan atribut `onClick`, gunakan `onClickCapture` untuk menambahkan handler.
 * @param {React.AnchorHTMLAttributes<HTMLAnchorElement> & Omit<import('next/link').LinkProps, 'scroll'> & LinkHashProps} props LinkHash props
 * @returns {React.ReactElement} Rendered component
 */
export const LinkHash = ({
    text,
    hashId,
    isOpenNewTab = false,
    scroll = false,
    scrollRules = { behavior: 'smooth', block: 'center' },
    focusTarget = true,
    ...props
}) => {
    return (
        <Link
            scroll={scroll}
            tabIndex={props?.tabIndex ?? 0}
            {...(isOpenNewTab ? { target: '_blank' } : {})}
            onClick={(event) => {
                const target = hashId ? document.getElementById(hashId) : null;
                if (target) {
                    event.preventDefault();
                    var scrollOptions = { behaviour: 'smooth', block: 'center' };
                    if (Array.isArray(scrollRules) && scrollRules.length === 3) {
                        const rulesQuery = window.matchMedia(scrollRules[0]).matches;
                        if (rulesQuery) scrollOptions = scrollRules[1];
                        else scrollOptions = scrollRules[2];
                    } else if (typeof scrollRules === 'object') {
                        scrollOptions = scrollRules;
                    }

                    target.scrollIntoView(scrollOptions);
                }
                if (focusTarget) {
                    event.currentTarget.blur();
                    if (target) target.focus();
                }
            }}
            {...props}
        >
            {text}
            {isOpenNewTab && (
                <FiArrowUpRight fontSize={'calc(0.85 * 1em)'} />
            )}
        </Link>
    )
}