'use client'

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
} from '../config';
// #endregion

// #region NEXT DEPEDENCY
import Link from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useMeasure from 'react-use-measure';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from 'framer-motion';
import { LogoSipkFill } from '@/loader/StaticImages';
import HighlightText from '@/component/motion/HighlightText';
import { scroller } from 'react-scroll';
import { BUTTONSIMPLE_MAIN_PRESET, BUTTONSIMPLE_SECONDARY_PRESET } from './hero';
import { ButtonSimpleForwarded } from '@/component/Button';
// #endregion

// #region ICON DEPEDENCY
import { FiLogIn, FiUserPlus } from "react-icons/fi";
// #endregion

// #region STYLE DEPEDENCY
import styles from '@root_page/root.module.css';
// #endregion

const title = 'Mulai Sekarang';
const description = 'Akses semua fitur secara gratis! Daftar sekarang atau login jika sudah punya akun. Jangan lewatkan,'
const descriptionWords = description.split(' ');

// Describe animation delay (after element inView)
// with an array [logo, title, description, button, description highlight]
const delayAnims = [0.125, 0.25, 0.85, 0.975, 1.175];

const MulaiSekarang = () => {
    /** @type {React.MutableRefObject<HTMLDivElement>} */
    const sectionRef = React.useRef(null);

    const [titleRef, { width: titleWidth }] = useMeasure();

    /** @param {React.KeyboardEvent} event */
    const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
            if (event.shiftKey) {
                if (
                    sectionRef.current &&
                    sectionRef.current === document.activeElement &&
                    sectionRef.current.previousElementSibling
                ) {
                    event.preventDefault();
                    scroller.scrollTo(sectionRef.current.previousElementSibling.id, { offset: -75, smooth: true });
                    sectionRef.current.previousElementSibling.focus();
                }
            } else {
                if (sectionRef.current) {
                    const focusableElements = Array.from(sectionRef.current.querySelectorAll('[tabIndex="0"]'));
                    const isLastFocusableElement = focusableElements[focusableElements.length - 1] === document.activeElement;
                    if (isLastFocusableElement) {
                        event.preventDefault();
                        event.target.blur();
                        scroller.scrollTo('footer-shorcuts', { smooth: true });
                    }
                }
            }
        }
    }

    return (
        <section
            ref={sectionRef}
            id={'mulai_sekarang'}
            tabIndex={0}
            className={`${styles.section} ${styles.mulai_sekarang}`}
            onKeyDown={handleKeyDown}
        >
            <motion.div
                initial={{ scale: 1.5, opacity: 0 }}
                variants={{ inView: { scale: 1, opacity: 1 }, hide: { scale: 1.5, opacity: 0 } }}
                whileInView={'inView'}
                viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
                transition={{ type: 'spring', duration: 0.75, delay: delayAnims[0] }}
                className={styles.logo}
            >
                <LogoSipkFill priority={true} />
            </motion.div>

            <motion.h1
                ref={titleRef}
                className={styles.title_big}
                initial={{ visibility: 'hidden' }}
                variants={{ inView: { visibility: 'visible' } }}
                whileInView={'inView'}
                viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
                transition={{ type: 'spring', delayChildren: delayAnims[1] }}
            >
                <HighlightText
                    text={title}
                    useHook={false}
                    preset={'wavingTranslate'}
                    presetOptions={{
                        makeVariant: true,
                        variantName: 'inView'
                    }}
                    adjustWavingTranslate={{
                        perspective: 500,
                        duration: 0.75,
                        baseDelay: delayAnims[1]
                    }}
                />
            </motion.h1>

            <motion.div
                className={styles.title_big_description}
                style={{
                    width: 0.9 * titleWidth
                }}
                whileInView={'inView'}
                viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
                transition={{ type: 'spring', delayChildren: delayAnims[2] }}
            >
                <motion.span
                    initial={{ y: 25, opacity: 0 }}
                    variants={{ inView: { y: 0, opacity: 1 }, hide: { y: 25, opacity: 0 } }}
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
                            color: ['var(--danger-sec-color)', 'var(--infoDark-color)', 'var(--danger-sec-color)'],
                            scale: [1, 1.3, 1],
                            baseDelay: delayAnims[4],
                            repeat: Infinity,
                            repeatDelay: 10
                        }}
                    />
                </motion.span>
            </motion.div>

            <motion.div className={styles.title_big_cta}>
                <motion.div
                    initial={{ scale: 0 }}
                    variants={{
                        inView: { scale: 1, transition: { delay: delayAnims[3], type: 'spring', bounce: 0.2 } },
                        hide: { scale: 0 },
                    }}
                    whileInView={'inView'}
                    viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
                >
                    <Link
                        href={'/users?action=login&utm_source=slp'}
                        scroll={false}
                        passHref
                        legacyBehavior
                    >
                        <ButtonSimpleForwarded
                            id='mulai_sekarang-cta-secondary'
                            {...BUTTONSIMPLE_SECONDARY_PRESET}
                            style={{
                                ...BUTTONSIMPLE_SECONDARY_PRESET?.style,
                                gap: '0.35rem',
                                fontWeight: 500,
                            }}
                        >
                            Masuk <FiLogIn className={styles.icon} />
                        </ButtonSimpleForwarded>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ scale: 0 }}
                    variants={{
                        inView: { scale: 1, transition: { delay: delayAnims[3], type: 'spring', bounce: 0.2 } },
                        hide: { scale: 0 },
                    }}
                    whileInView={'inView'}
                    viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
                >
                    <Link
                        href={'/users?action=daftar&utm_source=slp'}
                        scroll={false}
                        passHref
                        legacyBehavior
                    >
                        <ButtonSimpleForwarded
                            id='mulai_sekarang-cta-main'
                            {...BUTTONSIMPLE_MAIN_PRESET}
                            style={{
                                ...BUTTONSIMPLE_MAIN_PRESET?.style,
                                gap: '0.35rem',
                                fontWeight: 500,
                            }}
                        >
                            Daftar <FiUserPlus className={styles.icon} />
                        </ButtonSimpleForwarded>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default MulaiSekarang;