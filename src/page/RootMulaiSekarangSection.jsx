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
import { LogoImage } from '@/component/Main';
import HighlightText from '@/component/motion/HighlightText';
import ThemeChanger from '@/component/_test/ThemeChanger';
// #endregion

const title = 'Mulai Sekarang';
const description = 'Akses semua fitur secara gratis! Daftar sekarang atau login jika sudah punya akun. Jangan lewatkan,'
const descriptionWords = description.split(' ');

// Describe animation delay (after element inView)
// with an array [logo, title, description, button, description highlight]
const delayAnims = [0.125, 0.25, 0.85, 0.975, 1.175];

const MulaiSekarang = () => (
    <div
        className={`${styles.section} ${styles.mulai_sekarang}`}
    >
        <ThemeChanger
            options={{
                position: {
                    type: 'absolute',
                    preset: 'top-left',
                    offsetX: 25,
                    offsetY: 25
                }
            }}
        />

        <motion.div
            initial={{ scale: 1.5, opacity: 0 }}
            variants={{ show: { scale: 1, opacity: 1 }, hide: { scale: 1.5, opacity: 0 } }}
            whileInView={'show'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
            transition={{ type: 'spring', duration: 0.75, delay: delayAnims[0] }}
            className={styles.logo}
        >
            <LogoImage
                src={'/logo_fill.png'}
                width={128}
                height={128}
            />
        </motion.div>

        <motion.div
            className={styles.title}
            whileInView={'show'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
            transition={{ type: 'spring', delayChildren: delayAnims[1] }}
        >
            <HighlightText
                text={title}
                preset={'wavingTranslate'}
                hookOptions={{
                    once: GLOBAL_VIEWPORT_ONCE
                }}
                adjustWavingTranslate={{
                    perspective: 500,
                    duration: 0.75,
                    baseDelay: delayAnims[1]
                }}
            />
        </motion.div>

        <motion.div
            className={styles.description}
            whileInView={'show'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
            transition={{ type: 'spring', delayChildren: delayAnims[2] }}
        >
            <motion.span
                initial={{ y: 25, opacity: 0 }}
                variants={{ show: { y: 0, opacity: 1 }, hide: { y: 25, opacity: 0 } }}
            >
                {descriptionWords.map((word, wordIndex) => (
                    <span key={`word-${wordIndex}`} className={styles.word}>
                        {word}
                    </span>
                ))}

                <HighlightText
                    text={'kuota pendaftaran terbatas!'}
                    hookOptions={{
                        once: GLOBAL_VIEWPORT_ONCE
                    }}
                    adjustWavingColor={{
                        color: ['var(--logo-second-color)', 'var(--infoDark-color)', 'var(--logo-second-color)'],
                        scale: [1, 1.3, 1],
                        baseDelay: delayAnims[4],
                        repeat: Infinity,
                        repeatDelay: 10
                    }}
                />
            </motion.span>
        </motion.div>

        <motion.div
            className={styles.buttons}
        >
            <motion.a
                className={`${styles.btn} ${styles.secondary}`}
                href={'/users?action=login'}
                initial={{ scale: 0 }}
                variants={{
                    show: { scale: 1, transition: { delay: delayAnims[3], type: 'spring', bounce: 0.2 } },
                    hide: { scale: 0 },
                }}
                whileInView={'show'}
                viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
            >
                Masuk
            </motion.a>

            <motion.a
                className={`${styles.btn} ${styles.main}`}
                href={'/users?action=daftar'}
                initial={{ scale: 0 }}
                variants={{
                    show: { scale: 1, transition: { delay: delayAnims[3], type: 'spring', bounce: 0.2 } },
                    hide: { scale: 0 },
                }}
                whileInView={'show'}
                viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
            >
                Daftar
            </motion.a>
        </motion.div>
    </div>
)

export default MulaiSekarang;