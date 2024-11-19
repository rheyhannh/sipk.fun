'use client'

// #region TYPE DEPEDENCY
import { HTMLMotionProps, MotionStyle, MotionValue } from 'framer-motion';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useWindowSize from '@/hooks/useWindowSize';
import { useTimeout } from 'ahooks';
import useMeasure from 'react-use-measure'
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useMotionValue, useScroll, useVelocity, useSpring, useTransform, useAnimationFrame } from 'framer-motion';
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
            }}
            ref={textRef}
        >
            {children}
        </TextElement>
    )
}

/**
 * Props yang digunakan component `ScrollingCarousel`
 * @typedef {Object} ScrollingCarouselProps
 * @property {number} [speed]
 * Angka positif `> 0` sebagai kecepatan scroll container
 * - Default : `50`
 * @property {'left' | 'right'} [initialDirection]
 * Arah scroll container saat pertama kali mount
 * - Default : `'left'`
 * @property {boolean} [useHoverEffect]
 * Boolean untuk menggunakan efek hover atau tidak, pengaturan tersedia pada props `hoverOffset`
 * - Default : `true`
 * @property {number} [hoverOffset]
 * Angka positif `>= 0` sebagai offset saat container dihover. Props ini berfungsi sebagai pembagi kecepatan scroll container,
 * sehingga semakin besar maka semakin pelan scroll container saat dihover.
 * 
 * - Default : `2`
 * - Tips : Gunakan `0` untuk memberhentikan scoll container
 * @property {'none' | 'bounce' | 'speed' | 'reverse'} [scrollEffectType]
 * Tipe efek yang digunakan saat terjadi mouse scroll dengan keterangan berikut,
 * - `none` : Tidak ada efek yang terjadi
 * - `bounce` : Tidak merubah arah, menambah kecepatan scroll container dengan efek bounce saat mouse scroll berlawanan dengan arah scroll container
 * - `speed` : Tidak merubah arah, menambah kecepatan scroll container tanpa bounce
 * - `reverse` : Merubah arah scroll container dengan saat mouse scroll berlawanan dengan arah scroll container
 * 
 * Default menggunakan `none`
 * @property {number} [contentGap]
 * Gap content yang digunakan dalam `px`, props ini diperlukan untuk melakukan perhitungan width dari scroll container
 * - Default : `28`
 * @property {number} [contentRenderOffset]
 * Props ini menyatakan bilangan bulat `> 0` berapa kali content harus dirender. Semakin besar, maka semakin panjang width dari scroll container.
 * 
 * Umumnya kita ingin width scroll container selalu lebih besar dari viewport agar scroll container selalu berisikan content dan tidak kosong saat animasi berjalan
 * - Default : `3`
 * @property {Omit<React.HTMLProps<HTMLDivElement>,'ref'>} containerProps
 * Agar component dapat berjalan sesuai, jangan merubah atribut `display` dan `flex-direction` pada props style
 * @property {Omit<HTMLMotionProps<'div'>, 'onHoverStart' | 'onHoverEnd'>} wrapperProps
 * Agar component dapat berjalan sesuai, jangan merubah atribut `display`, `gap`, `width` dan `x` pada props style
 * dan props `onHoverStart` dan `onHoverEnd`
 */

/**
 * Component Description
 * @param {ScrollingCarouselProps} props ScrollingCarousel props
 * @returns {React.ReactElement} Rendered component
 */
export const ScrollingCarousel = ({
    speed = 50,
    initialDirection = 'left',
    useHoverEffect = true,
    hoverOffset = 2,
    scrollEffectType = 'none',
    contentGap = 28,
    contentRenderOffset = 3,
    containerProps = {},
    wrapperProps = {},
    children
}) => {
    const { style: _x, ...containerPropsFiltered } = containerProps;
    const { style: _y, ...wrapperPropsFiltered } = wrapperProps;

    const COUNT_CHILDREN = contentRenderOffset;

    const speedAbs = Math.abs(speed);
    const baseSpeed = initialDirection === 'right' ? speedAbs : (speedAbs * -1);
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })

    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
    const decelerationFactor = useMotionValue(1);

    const x = useTransform(baseX, (v) => v);
    const directionFactor = React.useRef(1);

    let [containerRef, { width: containerWidth }] = useMeasure();
    let [wrapperRef, { width: wrapperWidth }] = useMeasure();
    const { width: viewportWidth, height: viewportHeight } = useWindowSize();

    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseSpeed * (delta / 1000);

        if (scrollEffectType === 'reverse') {
            if (velocityFactor.get() < 0) {
                directionFactor.current = -1;
            } else if (velocityFactor.get() > 0) {
                directionFactor.current = 1;
            }
            moveBy += (directionFactor.current * moveBy * velocityFactor.get());
        } else if (scrollEffectType === 'bounce') {
            moveBy += (moveBy * velocityFactor.get());
        } else if (scrollEffectType === 'speed') {
            moveBy += (moveBy * Math.abs(velocityFactor.get()));
        }

        if (decelerationFactor.get() === 0) {
            moveBy = 0;
        } else {
            moveBy = moveBy / decelerationFactor.get();
        }

        if (baseX.get() > viewportWidth) {
            baseX.set(0);
        } else if (baseX.get() < viewportWidth * -1) {
            baseX.set(0);
        } else {
            baseX.set(baseX.get() + moveBy);
        }
    })

    return (
        <div
            ref={containerRef}
            style={{
                display: 'flex',
                flexDirection: initialDirection === 'right' ? 'row-reverse' : 'row',
                ...containerProps?.style
            }}
            {...containerPropsFiltered}
        >
            <motion.div
                ref={wrapperRef}
                style={{ display: 'flex', gap: contentGap, width: 'max-content', x, ...wrapperProps?.style }}
                onHoverStart={() => {
                    if (useHoverEffect) {
                        decelerationFactor.set(Math.abs(hoverOffset))
                    }
                }}
                onHoverEnd={() => { decelerationFactor.set(1) }}
                {...wrapperPropsFiltered}
            >
                {Array.from({ length: COUNT_CHILDREN }, (_, index) => (
                    <React.Fragment key={index}>{children}</React.Fragment>
                ))}
            </motion.div>
        </div>
    )
}