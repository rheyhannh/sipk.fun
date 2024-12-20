// #region TYPE DEPEDENCY
import { HTMLMotionProps } from 'framer-motion';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useWindowSize from '@/hooks/utils/useWindowSize';
import useMeasure from 'react-use-measure'
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useMotionValue, useScroll, useVelocity, useSpring, useTransform, useAnimationFrame } from 'framer-motion';
// #endregion

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
const ScrollingCarousel = ({
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

export default ScrollingCarousel;