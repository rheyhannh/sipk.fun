'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js'
// #endregion

// #region REACT DEPEDENCY
import { useContext, useRef, useEffect, useState } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing'
import { motion, useInView, useAnimation } from 'framer-motion';
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/landing.module.css'
// #endregion

export function Landing() {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist } = useContext(LandingContext);

    return (
        <section className={`${styles.section} ${styles.landing}`} id={'landing'}>
            <div className={styles.main}>
                <div className={styles.announcer}>
                    <Reveal>
                        <h3>Announcer Component</h3>
                    </Reveal>
                </div>
                <div className={styles.text}>
                    <Reveal>
                        <h1 className={styles.title}>SIPK</h1>
                    </Reveal>
                    <Reveal>
                        <h2 className={styles.description}>Elevate Your Academic Journey</h2>
                    </Reveal>
                </div>
            </div>
            <div className={styles.background}>
                <h1>Something Cool</h1>
            </div>
        </section>
    )
}

const Reveal = ({ children }) => {
    const [anim, setAnim] = useState('hide');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const mainControls = useAnimation();
    const sliceControls = useAnimation();

    const handleHideAnimation = () => {
        mainControls.start('hide');
        sliceControls.start('hide');
        setAnim('hide');
    }

    const handleShowAnimation = () => {
        mainControls.start('show');
        sliceControls.start('show');
        setAnim('show');
    }

    useEffect(() => {
        if (isInView) {
            // Fire the animation
            mainControls.start("show");
            sliceControls.start("show");
            setAnim('show');
        }
    }, [isInView])

    return (
        <div
            ref={ref}
            style={{
                position: 'relative',
                overflow: 'hidden',
            }}
            onClick={() => { anim === 'hide' ? handleShowAnimation() : handleHideAnimation() }}
        >
            <motion.div
                variants={{
                    hide: { opacity: 0, y: 75 },
                    show: { opacity: 1, y: 0 },
                }}
                initial="hide"
                animate={mainControls}
                transition={{ duration: 0.5, delay: 0.25 }}
            >
                {children}
            </motion.div>
            <motion.div
                variants={{
                    hide: { left: 0 },
                    show: { left: '100%' },
                }}
                initial="hide"
                animate={sliceControls}
                transition={{ duration: 0.5, ease: 'easeIn' }}
                style={{
                    position: 'absolute',
                    top: 4,
                    bottom: 4,
                    left: 0,
                    right: 0,
                    background: 'var(--logo-second-color)',
                    zIndex: 5,
                }}
            >

            </motion.div>
        </div>
    )
}