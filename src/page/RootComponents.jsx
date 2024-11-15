'use client'

// #region TYPE DEPEDENCY
import { HTMLMotionProps, MotionStyle, MotionValue } from 'framer-motion';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useWindowSize from '@/hooks/useWindowSize';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useScroll, useTransform } from 'framer-motion';
// #endregion

export const Container = ({ children }) => (
    <div className={styles.container}>
        {children}
    </div>
)

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
 * @property {boolean} invertTimeframe
 * Lorem
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
 * Scroll progress dari sebuah element atau container yang diresolve menggunakan hook `useScroll`
 * 
 * ```js
 * const { scrollXProgress: scrollProgress } = useScroll({ container: scrollRef });
 * ```
 */

/**
 * Component wrapper untuk memberikan animasi pada timeframe tertentu berdasarkan scroll progress dari sebuah element atau container
 * @template [T='div']
 * @param {{as:T} & HTMLMotionProps<T> & AnimatedElementProps} props AnimatedElement props
 * @returns {React.ReactElement} Rendered component
 */
export const AnimatedElement = ({
    as: Tag = 'div',
    timeframe,
    animations,
    scrollProgress,
    style,
    children,
    ...props
}) => {
    const MotionTag = motion[Tag] ?? motion.div;
    const animationsHook = {};

    Object.entries(animations).forEach(([key, value]) => {
        animationsHook[key] = useTransform(scrollProgress, timeframe, value);
    })

    return (
        <MotionTag
            {...props}
            style={{
                ...style,
                ...animationsHook
            }}
        >
            {children}
        </MotionTag>
    )
}

/**
 * Props yang digunakan component `TextFitContainer`
 * @typedef {Object} TextFitContainerProps
 * @property {React.RefObject<HTMLElement>} containerRef
 * Ref dari container yang digunakan, props ini dibutuhkan untuk perhitungan ukuran teks. Jika tidak tersedia, maka ukuran teks tidak akan berubah
 * @property {keyof motion} as
 * Tipe element yang digunakan dan tersedia pada component `motion`
 * - Default : `'span'`
 */

/**
 * Component untuk membuat teks dengan ukuran yang fit terhadap sebuah container.
 * Pastikan ref dari element container dipass melalui props `containerRef`, karna jika tidak maka ukuran teks tidak akan berubah.
 * 
 * Perhitungan dan perubahan ukuran teks ditrigger saat,
 * - Component mount
 * - Perubahan width pada container 
 * - Perubahan width dan height pada viewport
 * 
 * Style dapat diatur melalui props `style` walaupun secara default menggunakan `className` yang menerapkan style berikut,
 * ```js
 * { margin: '0 auto',  whiteSpace: 'nowrap', textAlign: 'center' }
 * ```
 * @param {Omit<HTMLMotionProps<any>, 'className'> & TextFitContainerProps} props TextFitContainer props
 * @returns {React.ReactElement} Rendered component
 */
export const TextFitContainer = ({ containerRef, as = 'span', minSize = 1, maxSize = 75, children, ...props }) => {
    const { width, height } = useWindowSize();
    const textRef = React.useRef(null);
    const TextElement = motion[as] ?? motion['span'];

    const resizeText = () => {
        if (!containerRef) return;

        const container = containerRef.current;
        const text = textRef.current;

        if (!container || !text) return;

        const containerWidth = container.offsetWidth;
        let min = minSize;
        let max = maxSize;

        while (min <= max) {
            const mid = Math.floor((min + max) / 2);
            text.style.fontSize = mid + "px";

            if (text.offsetWidth <= containerWidth) {
                min = mid + 1;
            } else {
                max = mid - 1;
            }
        }

        text.style.fontSize = max + "px";
    }

    React.useEffect(() => {
        if (containerRef?.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    if (entry.contentRect.width) {
                        resizeText();
                    }
                }
            })

            resizeObserver.observe(containerRef.current);

            return () => {
                resizeObserver.unobserve(containerRef.current);
            }
        }
    }, [containerRef, resizeText]);

    React.useEffect(() => {
        resizeText();
    }, [width, height]);

    return (
        <TextElement
            style={{
                margin: "0 auto",
                whiteSpace: "nowrap",
                textAlign: "center",
            }}
            ref={textRef}
        >
            {children}
        </TextElement>
    )
}