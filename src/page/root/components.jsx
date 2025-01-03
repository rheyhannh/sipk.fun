'use client'

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from 'framer-motion';
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