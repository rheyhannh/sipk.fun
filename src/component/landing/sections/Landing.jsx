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

// #region ICON DEPEDENCY
import { FaCheck, FaTimes } from "react-icons/fa";
// #endregion

/**
 * Render landing page section `landing`
 * @returns {ReactElement} Element react untuk render landing page section `landing`
 */
export function Landing() {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist } = useContext(LandingContext);

    const [rocketState, setRocketState] = useState('hide');
    const [cloudsState, setCloudsState] = useState('hide');

    return (
        <section className={`${styles.section} ${styles.landing}`} id={'landing'}>
            <div
                className={styles.animation__controller}
                onClick={() => {
                    if (rocketState === 'hide' && cloudsState === 'hide') {
                        setRocketState('show');
                        setCloudsState('show');
                    } else {
                        setRocketState('hide');
                        setCloudsState('hide');
                    }
                }}
            >
                {(rocketState === 'hide' && cloudsState === 'hide') ? <FaCheck size={'18px'} /> : <FaTimes size={'18px'} />}
            </div>

                        </div>
                    </Reveal>
                </div>
const Content = () => {
    const [top, setTop] = useState('0');
    const [left, setLeft] = useState('0');
    const [width, setWidth] = useState('0px');
    const [height, setHeight] = useState('0px');

    useEffect(() => {
        const adjustPositions = () => {
            const svg = document.getElementById('main-shape');
            const path1 = document.getElementById('main-path');
            const svgRect = svg.getBoundingClientRect();

            // Get the bounding box of the path
            const bbox1 = path1.getBBox();

            // Calculate the position of the content relative to the SVG container
            const content1Width = bbox1.width / 2;
            const content1Height = bbox1.height / 2;
            const content1X = bbox1.x + bbox1.width / 2 - content1Width / 2;
            const content1Y = bbox1.y + bbox1.height / 2 - content1Height / 2;

            // Adjust content positions
            setTop(`${(content1Y / svg.viewBox.baseVal.height) * svgRect.height}px`);
            setLeft(`${(content1X / svg.viewBox.baseVal.width) * svgRect.width}px`);
            setWidth(`${(content1Width / svg.viewBox.baseVal.width) * svgRect.width}px`);
            setHeight(`${(content1Height / svg.viewBox.baseVal.height) * svgRect.height}px`);
        }

        adjustPositions();
        window.addEventListener('resize', adjustPositions);

        return () => {
            window.removeEventListener('resize', adjustPositions);
        };
    }, [])

    return (
        <div
            className={styles.content}
            style={{
                top,
                left,
                width,
                height
            }}
        >
            <div className={styles.text}>
                <FlyIn duration={0.5} delay={0}>
                    <h1 className={styles.title}>
                        Lorem ipsum dolor sit amet.
                    </h1>
                </FlyIn>

                <FlyIn duration={0.5} delay={0}>
                    <p className={styles.description}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, quis.
                    </p>
                </FlyIn>
            </div>
        </div>
    )
}

const FlyIn = ({ children, duration = 0.5, delay = 0.25 }) => {
    const [anim, setAnim] = useState('hide');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const mainControls = useAnimation();

    const handleHideAnimation = () => {
        mainControls.start('hide');
        setAnim('hide');
    }

    const handleShowAnimation = () => {
        mainControls.start('show');
        setAnim('show');
    }

    useEffect(() => {
        if (isInView) {
            // Fire the animation
            mainControls.start("show");
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
                    hide: { x: -75, y: 75 },
                    show: { x: 0, y: 0 },
                }}
                initial="hide"
                animate={mainControls}
                transition={{ duration, delay }}
            >
                {children}
            </motion.div>
        </div>
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