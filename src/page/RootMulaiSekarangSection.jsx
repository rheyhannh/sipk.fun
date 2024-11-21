'use client'

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
} from './RootConfig';
// #endregion

// #region NEXT DEPEDENCY
import Link from 'next/link';
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
import { scroller } from 'react-scroll';
// #endregion

const title = 'Mulai Sekarang';
const description = 'Akses semua fitur secara gratis! Daftar sekarang atau login jika sudah punya akun. Jangan lewatkan,'
const descriptionWords = description.split(' ');

// Describe animation delay (after element inView)
// with an array [logo, title, description, button, description highlight]
const delayAnims = [0.125, 0.25, 0.85, 0.975, 1.175];

const Button = React.forwardRef(({ type = 'default', text = 'Lorem', onClick, href, ...props }, ref) => {
    if (typeof type !== 'string') type = 'default';
    if (!['default', 'main', 'secondary'].includes(type)) type = 'default';

    const useClass = type !== 'default';

    return (
        <motion.a
            ref={ref}
            className={`${styles.btn} ${useClass ? styles[type] : ''}`}
            href={href}
            onClick={onClick}
            initial={{ scale: 0 }}
            variants={{
                inView: { scale: 1, transition: { delay: delayAnims[3], type: 'spring', bounce: 0.2 } },
                hide: { scale: 0 },
            }}
            whileInView={'inView'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
            {...props}
        >
            {text}
        </motion.a>
    )
})

const MulaiSekarang = () => {
    /** @type {React.MutableRefObject<HTMLDivElement>} */
    const sectionRef = React.useRef(null);

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
                    sectionRef.current.previousElementSibling.focus();
                    scroller.scrollTo(sectionRef.current.previousElementSibling.id, { offset: -75 });
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
                <LogoImage
                    src={'/logo_fill.png'}
                    width={128}
                    height={128}
                />
            </motion.div>

            <motion.h1
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
                <Link href={'/users?action=login'} scroll={false} passHref legacyBehavior>
                    <Button text={'Masuk'} type={'secondary'} tabIndex={0} />
                </Link>

                <Link href={'/users?action=daftar'} scroll={false} passHref legacyBehavior>
                    <Button text={'Daftar'} type={'main'} tabIndex={0} />
                </Link>
            </motion.div>
        </section>
    )
}

export default MulaiSekarang;