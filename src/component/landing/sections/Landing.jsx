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
const Clouds = ({ cloudsState, setCloudsState }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const Outter = () => {
        return (
            <svg id="outter-shape" viewBox="0 0 1024 512" xmlns="http://www.w3.org/2000/svg">
                <path id="outter-path" d="M -221.018 402.012 L -199.108 377.893 C -177.107 353.685 -133.289 305.449 -89.197 294.288 C -45.198 283.219 -63.586 193.589 -16.483 173.889 C 41.719 149.548 85.387 225.757 131.462 205.07 C 170.338 187.614 229.489 224.099 308.464 244.527 C 350.383 255.369 397.229 195.108 422.141 206.324 C 454.314 220.809 516.121 201.452 547.266 178.743 C 578.86 155.705 652.276 130.53 691.447 148.754 C 736.592 169.758 767.181 215.837 781.899 241.133 C 798.692 269.992 789.876 290.262 828.266 302.212 C 858.299 311.56 868.703 332.211 869.183 354.009 C 869.682 376.561 864.87 400.522 883.926 411.386 C 905.46 423.663 909.155 433.877 935.229 436.251 C 959.403 438.452 965.836 471.862 986.379 488.086 C 1017.631 512.767 1055.403 524.958 1055.403 524.958 L 496.344 537.588 L 4.683 550.609 C 4.683 550.609 -45.198 487.508 -89.197 487.508 C -133.289 487.508 -177.107 487.508 -199.108 487.508 L -221.018 487.508 L -221.018 402.012 Z" fill="red" />
            </svg>
        )
    }

    const Center = () => {
        return (
            <svg id="center-shape" viewBox="0 0 1024 512" xmlns="http://www.w3.org/2000/svg">
                <path id="center-path" d="M 202.947 463.551 L 215.424 385.54 C 230.846 336.383 333.961 328.213 364.865 286.839 C 395.709 245.594 467.264 238.962 498.106 229.493 C 529.012 219.896 622.521 179.633 653.302 187.805 C 684.081 195.977 694.512 244.169 725.29 278.022 C 756.069 312.004 768.717 312.877 795.475 331.501 C 821.482 349.603 828.682 360.56 824.351 402.571 C 820.694 438.046 813.024 453.448 813.024 453.448 L 793.19 503.276 L 773.765 536.897 L 749.622 558.377 L 732.326 568.038 C 716.905 568.038 730.627 568.063 699.723 568.063 C 668.881 568.063 687.178 570.024 656.336 570.024 C 625.431 570.024 639.153 568.118 608.374 568.118 C 577.596 568.118 592.726 549.861 546.047 571.033 C 499.368 592.205 493.25 566.208 462.344 566.208 C 431.502 566.208 405.366 562.346 374.522 562.346 C 343.618 562.346 321.597 562.352 306.175 562.352 L 235.756 557.489 C 157.787 585.632 209.842 527.396 202.947 463.551 Z" fill="green" transform="matrix(1, -0.000575000013, 0.000575000013, 1, -0.220209552064, 0.301957995288)" />
            </svg>
        )
    }

    const Main = () => {
        return (
            <svg id="main-shape" viewBox="0 0 1024 512" xmlns="http://www.w3.org/2000/svg">
                <path id="main-path" d="M -19.147 466.837 L -16.98 437.672 C 5.738 412.427 -49.495 306.925 -3.962 291.168 C 41.476 275.255 161.884 218.019 196.696 251.649 C 234.033 287.719 327.173 300.899 383.002 290.224 C 435.111 280.26 500.332 275.052 545.679 241.855 C 591.025 208.807 691.129 228.046 667.317 274.932 C 646.102 316.704 687.862 321.38 717.846 332.336 C 750.8 344.377 765.322 359.41 772.424 387.091 C 776.371 402.474 777.343 444.081 767.034 463.498 C 746.41 502.343 737.183 503.703 698.445 518.795 C 674.691 528.049 627.518 530.388 627.518 530.388 C 604.798 531.354 604.948 527.489 559.417 527.489 C 513.977 527.489 561.092 530.387 515.65 530.387 C 470.121 530.387 482.828 528.456 437.482 528.456 C 392.135 528.456 371.034 524.591 325.687 524.591 C 280.342 524.591 272.765 525.557 227.233 525.557 C 181.795 525.557 143.895 527.489 98.457 527.489 C 52.924 527.489 5.738 514.931 -16.98 514.931 L -39.607 514.931 L -19.147 466.837 Z" fill="blue" />
            </svg>
        )
    }

    useEffect(() => {
        if (isInView) {
            // Fire the animation
            setCloudsState('show');
        }
    }, [isInView])

    return (
        <div
            ref={ref}
            className={styles.clouds}
        >
            <motion.div
                className={styles.item}
                variants={{
                    hide: { x: -1500, y: 1500 },
                    show: { x: 0, y: 0 },
                }}
                initial={"hide"}
                animate={cloudsState}
                transition={{ duration: 1, delay: 0.3 }}
            >
                <Outter />
            </motion.div>

            <motion.div
                className={styles.item}
                variants={{
                    hide: { x: -1500, y: 1500 },
                    show: { x: 0, y: 0 },
                }}
                initial={"hide"}
                animate={cloudsState}
                transition={{ duration: 1, delay: 0.275 }}
            >
                <Center />
            </motion.div>

            <motion.div
                className={styles.item}
                variants={{
                    hide: { x: -1500, y: 1500 },
                    show: { x: 0, y: 0 },
                }}
                initial={"hide"}
                animate={cloudsState}
                transition={{ duration: 1, delay: 0.25 }}
            >
                <Main />
                <Content />
            </motion.div>
        </div>
    )
}

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