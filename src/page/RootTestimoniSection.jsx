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
import { motion } from 'framer-motion';
import { ScrollingCarousel } from './RootComponents';
import HighlightText from '@/component/motion/HighlightText';
// #endregion

// #region ICON DEPEDENCY
import { AiFillStar } from 'react-icons/ai';
// #endregion

const Testimoni = ({ rating }) => {
    const stars = [3, 3, 5, 4, 4, 5];
    const headingRef = React.useRef(null);

    return (
        <div id={'testimoni'} className={`${styles.section} ${styles.testimoni}`}>
            <div className={styles.inner}>
                <motion.h1
                    ref={headingRef}
                    className={styles.title}
                    initial={{ visibility: 'hidden', minHeight: 85 }}
                    variants={{ inView: { visibility: 'visible' } }}
                    whileInView={'inView'}
                    viewport={{
                        once: GLOBAL_VIEWPORT_ONCE,
                        amount: 1,
                    }}
                >
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
                </motion.h1>
            </div>

            <motion.div whileInView={'inView'} viewport={{ once: GLOBAL_VIEWPORT_ONCE }} className={styles.content}>
                <ScrollingCarousel
                    speed={75}
                    initialDirection={'left'}
                    useHoverEffect={true}
                    hoverOffset={2}
                    scrollEffectType={'none'}
                    containerProps={{
                        initial: { opacity: 0 },
                        variants: { inView: { opacity: 1 } },
                        transition: { duration: 0.75, delay: 1.25, ease: 'linear' }
                    }}
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
                    containerProps={{
                        initial: { opacity: 0 },
                        variants: { inView: { opacity: 1 } },
                        transition: { duration: 0.75, delay: 1.5, ease: 'linear' }
                    }}
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
            </motion.div>
        </div>
    )
}

export default Testimoni;