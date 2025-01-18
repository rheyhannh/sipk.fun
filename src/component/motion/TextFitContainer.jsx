'use client'

// #region TYPE DEPEDENCY
import { HTMLMotionProps } from 'framer-motion';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useWindowSize from '@/hooks/utils/useWindowSize';
import { useTimeout } from 'ahooks';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from 'framer-motion';
// #endregion

/**
 * Props yang digunakan component `TextFitContainer`
 * @typedef {Object} TextFitContainerProps
 * @property {React.RefObject<HTMLElement>} containerRef
 * Ref dari container yang digunakan, props ini dibutuhkan untuk perhitungan ukuran teks. Jika tidak tersedia, maka ukuran teks tidak akan berubah
 * @property {keyof motion} as
 * Tipe element yang digunakan dan tersedia pada component `motion`
 * - Default : `'span'`
 * @property {number} [minSize]
 * Ukuran minimal font-size dalam `px`, saat sudah menyentuh level ini, teks tidak akan dikecilkan lagi
 * - Default : `1`
 * @property {number} [maxSize]
 * Ukuran maksimal font-size dalam `px`, saat sudah menyentuh level ini, teks tidak akan diperbesar lagi
 * - Default : `75`
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
 * Style dapat diatur melalui props `style` walaupun secara default menggunakan style berikut,
 * ```js
 * { margin: '0 auto',  whiteSpace: 'nowrap', textAlign: 'center' }
 * ```
 * @param {Omit<HTMLMotionProps<any>, 'className'> & TextFitContainerProps} props TextFitContainer props
 * @returns {React.ReactElement} Rendered component
 */
const TextFitContainer = ({ containerRef, as = 'span', minSize = 1, maxSize = 75, style, children, ...props }) => {
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

    useTimeout(() => {
        if (containerRef?.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    if (entry.contentRect.width) {
                        resizeText();
                    }
                }
            });

            resizeObserver.observe(containerRef.current);

            return () => {
                resizeObserver.unobserve(containerRef.current);
            };
        }
    }, 100);

    React.useEffect(() => {
        resizeText();
    }, [width, height]);

    return (
        <TextElement
            style={{
                margin: "0 auto",
                whiteSpace: "nowrap",
                textAlign: "center",
                ...style
            }}
            ref={textRef}
        >
            {children}
        </TextElement>
    )
}

export default TextFitContainer;