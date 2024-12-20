'use client'

// #region TYPE DEPEDENCY
import { HTMLMotionProps, MotionStyle, MotionValue, SpringOptions } from 'framer-motion';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
// #endregion

/**
 * Props yang digunakan component `AnimatedElement`
 * @typedef {Object} AnimatedElementProps
 * @property {keyof motion} [as]
 * Tag element motion yang digunakan
 * - Default : `'div'`
 * @property {Array<number>} timeframe
 * Array yang mendeskripsikan sebuah titik kapan animasi tertentu harus sampai mencapai nilai sekian pada timeframe tersebut.
 * 
 * Jumlah array harus sama seperti setiap nilai dari setiap atribut pada props `animations`. Lihat contoh berikut,
 * 
 * ```js
 * const timeframe = [0, 0.5, 1]
 * const animations = {
 *      x : [-150, 0, 250],
 *      y : [-100, 25, 100],
 * }
 * ```
 * @property {boolean} [invertTimeframe]
 * Boolean untuk inverse timeframe yang digunakan. Saat `true` animasi yang digunakan akan dianimasikan secara terbalik. Lihat contoh berikut,
 * 
 * ```js
 * const timeframe = [0, 0.5, 1]
 * const animations = {
 *      x : [-150, 0, 250],
 * }
 * ```
 * 
 * Normalnya animasi `x` dimulai dari -150 -> 0 -> 250 namun saat props ini `true` animasi dimulai dari 250 -> 0 -> -150
 * 
 * - Default : `false`
 * @property {MotionStyle} animations
 * Object yang mendeskripsikan animasi yang digunakan dimana key sebagai css atribut yang ingin dianimasikan bernilai dengan
 * array yang mengambarkan bagaimana animasi dimainkan. 
 * 
 * Jumlah array harus sama seperti jumlah array yang digunakan pada props `timeframe`. Lihat contoh berikut,
 * 
 * ```js
 * const timeframe = [0, 0.5, 1]
 * const animations = {
 *      x : [-150, 0, 250],
 *      y : [-100, 25, 100],
 * }
 * ```
 * @property {MotionValue<number>} scrollProgress
 * Scroll progress dari sebuah element atau container yang diresolve menggunakan hook `useScroll` dimana akan mengatur kapan animasi mulai dan selesai.
 * 
 * ```js
 * const { scrollXProgress: scrollProgress } = useScroll({ container: scrollRef });
 * ```
 * 
 * Disaat props ini tidak tersedia, maka scroll progress akan dibuat menggunakan {@link useScroll} dan {@link useSpring} dari opsi yang digunakan pada props `scrollProgressOptions`
 * @property {Parameters<typeof useScroll>[0] & {spring:SpringOptions}} scrollProgressOptions
 * Secara default menggunakan opsi berikut, 
 * 
 * ```js
 * const scrollProgressOptions = {
 *      target: elementRef, // ref to this element itself
 *      offset: ["start end", "start center"],
 *      spring: {
 *          stiffness: 100, 
 *          damping: 30, 
 *          restDelta: 0.001
 *      }
 * }
 * ```
 * 
 * Singkatnya berdasarkan opsi diatas, element akan mulai dianimasikan saat masuk viewport dan selesai saat element sudah berada pada tengah viewport
 * 
 */

/**
 * Element wrapper untuk memberikan animasi pada timeframe tertentu berdasarkan scroll progress dari sebuah element atau container yang digunakan pada props `scrollProgress`.
 * 
 * Jika tidak tersedia, scroll progress akan dibuat berdasarkan opsi yang digunakan pada props `scrollProgressOptions` dimana secara default animasi akan dimulai
 * saat element masuk viewport dan selesai saat element berada pada tengah viewport
 * 
 * @template [T='div']
 * @param {HTMLMotionProps<T> & AnimatedElementProps} props AnimatedElement props
 * @returns {React.ReactElement} Rendered component
 */
const AnimatedElement = ({
    as: Tag = 'div',
    timeframe,
    animations,
    scrollProgress,
    scrollProgressOptions,
    style,
    children,
    ...props
}) => {
    const elementRef = React.useRef(null);
    const MotionTag = motion[Tag] ?? motion.div;
    const animationsHook = {};

    var { spring: useSpringOptions = {}, ...useScrollOptions } = scrollProgressOptions ?? {};
    useScrollOptions = { target: elementRef, offset: ["start end", "start center"], ...useScrollOptions }
    useSpringOptions = { stiffness: 100, damping: 30, restDelta: 0.001, ...useSpringOptions }

    const { scrollYProgress } = useScroll(useScrollOptions);
    const defaultScrollProgress = useSpring(scrollYProgress, useSpringOptions);

    Object.entries(animations).forEach(([key, value]) => {
        animationsHook[key] = useTransform(scrollProgress ?? defaultScrollProgress, timeframe, value);
    })

    return (
        <MotionTag
            {...props}
            ref={elementRef}
            style={{
                ...style,
                ...animationsHook
            }}
        >
            {children}
        </MotionTag>
    )
}

export default AnimatedElement;