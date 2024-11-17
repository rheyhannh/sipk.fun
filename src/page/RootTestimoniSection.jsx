'use client'

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
} from './RootConfig';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useMotionValue, useScroll, useVelocity, useSpring, useTransform, useAnimationFrame } from 'framer-motion';
import { TextFitContainer } from './RootComponents';
import HighlightText from '@/component/motion/HighlightText';
import useMeasure from 'react-use-measure'
// #endregion

// #region ICON DEPEDENCY
import { AiFillStar } from 'react-icons/ai';
// #endregion

/**
 * Props yang digunakan component `ScrollingCarousel`
 * @typedef {Object} ScrollingCarouselProps
 * @property {number} [speed]
 * Angka positif `> 0` sebagai kecepatan scroll container
 * @property {'left' | 'right'} [initialDirection]
 * Arah scroll container saat pertama kali mount
 * - Default : `'left'`
 * @property {boolean} [useHoverEffect]
 * Boolean untuk menggunakan efek hover atau tidak, pengaturan tersedia pada props `hoverOffset`
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
 */

/**
 * Component Description
 * @param {React.HTMLAttributes & ScrollingCarouselProps} props ScrollingCarousel props
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
    children
}) => {
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

        if (baseX.get() > (((wrapperWidth - (COUNT_CHILDREN - 1) * contentGap) / COUNT_CHILDREN) + contentGap)) {
            baseX.set(0);
        } else if (baseX.get() < (-((wrapperWidth - (COUNT_CHILDREN - 1) * contentGap) / COUNT_CHILDREN) - contentGap)) {
            baseX.set(0);
        } else {
            baseX.set(baseX.get() + moveBy);
        }
    })

    return (
        <div ref={containerRef} style={{ display: 'flex', flexDirection: initialDirection === 'right' ? 'row-reverse' : 'row' }}>
            <motion.div
                ref={wrapperRef}
                style={{ display: 'flex', gap: contentGap, width: 'max-content', x }}
                onHoverStart={() => {
                    if (useHoverEffect) {
                        decelerationFactor.set(Math.abs(hoverOffset))
                    }
                }}
                onHoverEnd={() => { decelerationFactor.set(1) }}
            >
                {Array.from({ length: COUNT_CHILDREN }, (_, index) => (
                    <React.Fragment key={index}>{children}</React.Fragment>
                ))}
            </motion.div>
        </div>
    )
}

const Testimoni = ({ rating }) => {
    const stars = [3, 3, 5, 4, 4, 5];
    const headingRef = React.useRef(null);

    return (
        <div id={'testimoni'} className={`${styles.section} ${styles.testimoni}`} onClick={() => { console.log(rating) }}>
            <motion.div
                ref={headingRef}
                className={styles.heading}
                initial={{ visibility: 'hidden', minHeight: 85 }}
                variants={{ inView: { visibility: 'visible' } }}
                whileInView={'inView'}
                viewport={{
                    once: GLOBAL_VIEWPORT_ONCE,
                    amount: 1
                }}
            >
                <TextFitContainer containerRef={headingRef} maxSize={52}>
                    <HighlightText
                        useHook={false}
                        preset={'mixFancyTranslate'}
                        presetOptions={{
                            wordStagger: 'random',
                            makeVariant: true,
                            variantName: 'inView'
                        }}
                        adjustMixFancyTranslate={{
                            x: [-25, 25, 0],
                            y: [-125, 125, 0],
                            z: [-750, -250, 0],
                            rotateX: [-5, 5, 0],
                            stagger: 0.25
                        }}
                        text={'Kata Mereka Tentang SIPK'}
                    />
                </TextFitContainer>
            </motion.div>

            <div className={styles.content}>
                <ScrollingCarousel
                    speed={75}
                    initialDirection={'left'}
                    useHoverEffect={true}
                    hoverOffset={2}
                    scrollEffectType={'none'}
                >
                    {Array.from({ length: 6 }).map((item, index) => (
                        <div
                            key={index}
                            className={styles.card}
                        >
                            <div className={styles.stars}>
                                {Array.from({ length: stars[index] }).map((item, index) => (
                                    <AiFillStar key={index} fontSize={'var(--star-fontsize)'} />
                                ))}
                            </div>

                            <p className={styles.review}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque viverra posuere turpis non rutrum. Donec quis molestie quis.
                            </p>

                            <div className={styles.user}>
                                <div className={styles.avatar}>

                                </div>
                                <div className={styles.info}>
                                    <span>Lorem ipsum dolor sit.</span>
                                    <small>Lorem, ipsum dolor.</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollingCarousel>

                <ScrollingCarousel
                    speed={75}
                    initialDirection={'right'}
                    useHoverEffect={true}
                    hoverOffset={2}
                    scrollEffectType={'none'}
                >
                    {Array.from({ length: 6 }).map((item, index) => (
                        <div
                            key={index}
                            className={styles.card}
                        >
                            <div className={styles.stars}>
                                {Array.from({ length: stars[index] }).map((item, index) => (
                                    <AiFillStar key={index} fontSize={'var(--star-fontsize)'} />
                                ))}
                            </div>

                            <p className={styles.review}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque viverra posuere turpis non rutrum. Donec quis molestie quis.
                            </p>

                            <div className={styles.user}>
                                <div className={styles.avatar}>

                                </div>
                                <div className={styles.info}>
                                    <span>Lorem ipsum dolor sit.</span>
                                    <small>Lorem, ipsum dolor.</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollingCarousel>
            </div>

            {/* <motion.div
                className={styles.cards}
                transition={{ staggerChildren: 0.4 }}
                whileInView={'inView'}
                viewport={{
                    once: GLOBAL_VIEWPORT_ONCE,
                    amount: 1
                }}
            >
                {Array.from({ length: 6 }).map((item, index) => (
                    <motion.div
                        key={index}
                        className={styles.card}
                        initial={{ opacity: 0, scale: 0.25 }}
                        variants={{
                            inView: {
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    duration: 1.25, ease: 'easeInOut'
                                }
                            }
                        }}
                    >
                        <div className={styles.stars}>
                            {Array.from({ length: stars[index] }).map((item, index) => (
                                <AiFillStar key={index} fontSize={'var(--star-fontsize)'} />
                            ))}
                        </div>

                        <p className={styles.review}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque viverra posuere turpis non rutrum. Donec quis molestie quis.
                        </p>

                        <div className={styles.user}>
                            <div className={styles.avatar}>

                            </div>
                            <div className={styles.info}>
                                <span>Lorem ipsum dolor sit.</span>
                                <small>Lorem, ipsum dolor.</small>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div> */}
        </div>
    )
}

export default Testimoni;