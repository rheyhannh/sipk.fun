'use client'

// #region TYPE DEPEDENCY
import { HTMLMotionProps, MotionStyle, MotionValue, SpringOptions } from 'framer-motion';
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

export const ContainerWrapper = ({ children }) => (
    <div className={styles.container_wrap}>
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
 * @param {{as:T} & HTMLMotionProps<T> & AnimatedElementProps} props AnimatedElement props
 * @returns {React.ReactElement} Rendered component
 */
export const AnimatedElement = ({
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
export const TextFitContainer = ({ containerRef, as = 'span', minSize = 1, maxSize = 75, style, children, ...props }) => {
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
 * - `reverse` : Merubah arah scroll container saat mouse scroll berlawanan dengan arah scroll container
 * 
 * Default menggunakan `none`
 * @property {number} [contentGap]
 * Gap content yang digunakan dalam `px`, props ini diperlukan untuk melakukan perhitungan width dari scroll container
 * - Default : `28`
 * @property {number} [contentRenderOffset]
 * Saat bernilai `> 0` menyatakan berapa kali content harus dirender. Semakin besar, maka semakin panjang width dari scroll container.
 * 
 * Umumnya kita ingin width scroll container selalu lebih besar dari viewport agar scroll container selalu berisikan content dan tidak kosong saat animasi berjalan
 * 
 * Saat bernilai `< 0` maka props ini akan dihitung secara otomatis. Jika menggunakan tipe scroll efek `reverse`
 * sangat dianjurkan untuk menyetel props ini bilangan negatif agar dihitung secara otomatis
 * 
 * - Default : `3`
 * @property {HTMLMotionProps<'div'>} containerProps
 * Props yang digunakan pada container component, harap melihat `description` terlebih dahulu sebelum melakukan perubahan
 * @property {Omit<HTMLMotionProps<'div'>, 'onHoverStart' | 'onHoverEnd'>} wrapperProps
 * Props yang digunakan pada wrapper component, harap melihat `description` terlebih dahulu sebelum melakukan perubahan
 */

/**
 * Component wrapper untuk membuat carousel horizontal dengan efek `infinite scrolling`. 
 * Saat menggunakan tipe efek scroll `reverse`, component harus dibungkus parent element dengan atribut css position `relative`.
 * 
 * Secara default menggunakan `containerProps` dan `wrapperProps` sebagai berikut,
 * ```js
 * { style: { display, flexDirection, position, top, left, transform } } = containerProps;
 * { style: { display, gap, width, transform }, onHoverStart, onHoverEnd } = wrapperProps;
 * ```
 * Perubahan props atau atribut style yang digunakan diatas akan membuat efek infinite scrolling terganggu
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
    const { width: viewportWidth, height: viewportHeight } = useWindowSize();
    let [containerRef, { width: containerWidth }] = useMeasure();
    let [wrapperRef, { width: wrapperWidth }] = useMeasure();

    const { style: containerStyleProp, ...containerPropsFiltered } = containerProps;
    const { style: wrapperStyleProps, ...wrapperPropsFiltered } = wrapperProps;

    const [countChildren, setCountChildren] = React.useState(1);

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

        if (baseX.get() > (((wrapperWidth - (countChildren - 1) * contentGap) / countChildren) + contentGap)) {
            baseX.set(0);
        } else if (baseX.get() < (-((wrapperWidth - (countChildren - 1) * contentGap) / countChildren) - contentGap)) {
            baseX.set(0);
        } else {
            baseX.set(baseX.get() + moveBy);
        }
    })

    const resolveCountChildren = () => {
        if (!wrapperWidth || !viewportWidth) return 1;
        const contentWidth = wrapperWidth / countChildren;
        const minimum = viewportWidth + 2 * contentWidth;
        const result = (Math.ceil(minimum / contentWidth)) + 1;

        return result;
    }

    const resolveContainerStyle = () => {
        if (scrollEffectType === 'reverse') {
            return {
                display: 'flex',
                position: 'absolute',
                top: '0%',
                left: '50%',
                transform: 'translate(-50%, -0%)',
                ...containerStyleProp
            }
        } else {
            return {
                display: 'flex',
                flexDirection: initialDirection === 'right' ? 'row-reverse' : 'row',
                ...containerStyleProp
            }
        }
    }

    const resolveWrapperStyle = () => ({
        display: 'flex',
        width: 'max-content',
        ...wrapperStyleProps
    })

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (contentRenderOffset >= 0) {
                setCountChildren(contentRenderOffset)
            } else {
                setCountChildren(resolveCountChildren())
            }
        }, 100)

        return () => clearTimeout(timeout);
    }, [contentRenderOffset, viewportWidth, wrapperWidth])

    return (
        <motion.div ref={containerRef} style={resolveContainerStyle()} {...containerPropsFiltered}>
            <motion.div
                ref={wrapperRef}
                style={{ ...resolveWrapperStyle(), gap: contentGap, x }}
                onHoverStart={() => {
                    if (useHoverEffect) {
                        decelerationFactor.set(Math.abs(hoverOffset))
                    }
                }}
                onHoverEnd={() => { decelerationFactor.set(1) }}
                {...wrapperPropsFiltered}
            >
                {Array.from({ length: countChildren }, (_, index) => (
                    <React.Fragment key={index}>{children}</React.Fragment>
                ))}
            </motion.div>
        </motion.div>
    )
}