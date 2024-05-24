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

// #region DATA DEPEDENCY
import { useLocalTheme } from '@/data/core';
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
            <Clouds cloudsState={cloudsState} setCloudsState={setCloudsState} />
            <Rocket rocketState={rocketState} setRocketState={setRocketState} />
        </section>
    )
}

const Clouds = ({ cloudsState, setCloudsState }) => {
    const { data: theme } = useLocalTheme();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const Outter = () => {
        return (
            <svg id="outter-shape" viewBox="0 0 1024 512" xmlns="http://www.w3.org/2000/svg">
                <path id="outter-path" d="M -221.018 402.012 L -199.108 377.893 C -177.107 353.685 -133.289 305.449 -89.197 294.288 C -45.198 283.219 -63.586 193.589 -16.483 173.889 C 41.719 149.548 85.387 225.757 131.462 205.07 C 170.338 187.614 229.489 224.099 308.464 244.527 C 350.383 255.369 397.229 195.108 422.141 206.324 C 454.314 220.809 516.121 201.452 547.266 178.743 C 578.86 155.705 652.276 130.53 691.447 148.754 C 736.592 169.758 767.181 215.837 781.899 241.133 C 798.692 269.992 789.876 290.262 828.266 302.212 C 858.299 311.56 868.703 332.211 869.183 354.009 C 869.682 376.561 864.87 400.522 883.926 411.386 C 905.46 423.663 909.155 433.877 935.229 436.251 C 959.403 438.452 965.836 471.862 986.379 488.086 C 1017.631 512.767 1055.403 524.958 1055.403 524.958 L 496.344 537.588 L 4.683 550.609 C 4.683 550.609 -45.198 487.508 -89.197 487.508 C -133.289 487.508 -177.107 487.508 -199.108 487.508 L -221.018 487.508 L -221.018 402.012 Z" fill={theme === 'dark' ? cloudsDarkColor.outter : cloudsLightColor.outter} />
            </svg>
        )
    }

    const Center = () => {
        return (
            <svg id="center-shape" viewBox="0 0 1024 512" xmlns="http://www.w3.org/2000/svg">
                <path id="center-path" d="M 202.947 463.551 L 215.424 385.54 C 230.846 336.383 333.961 328.213 364.865 286.839 C 395.709 245.594 467.264 238.962 498.106 229.493 C 529.012 219.896 622.521 179.633 653.302 187.805 C 684.081 195.977 694.512 244.169 725.29 278.022 C 756.069 312.004 768.717 312.877 795.475 331.501 C 821.482 349.603 828.682 360.56 824.351 402.571 C 820.694 438.046 813.024 453.448 813.024 453.448 L 793.19 503.276 L 773.765 536.897 L 749.622 558.377 L 732.326 568.038 C 716.905 568.038 730.627 568.063 699.723 568.063 C 668.881 568.063 687.178 570.024 656.336 570.024 C 625.431 570.024 639.153 568.118 608.374 568.118 C 577.596 568.118 592.726 549.861 546.047 571.033 C 499.368 592.205 493.25 566.208 462.344 566.208 C 431.502 566.208 405.366 562.346 374.522 562.346 C 343.618 562.346 321.597 562.352 306.175 562.352 L 235.756 557.489 C 157.787 585.632 209.842 527.396 202.947 463.551 Z" fill={theme === 'dark' ? cloudsDarkColor.center : cloudsLightColor.center} transform="matrix(1, -0.000575000013, 0.000575000013, 1, -0.220209552064, 0.301957995288)" />
            </svg>
        )
    }

    const Main = () => {
        return (
            <svg id="main-shape" viewBox="0 0 1024 512" xmlns="http://www.w3.org/2000/svg">
                <path id="main-path" d="M -19.147 466.837 L -16.98 437.672 C 5.738 412.427 -49.495 306.925 -3.962 291.168 C 41.476 275.255 161.884 218.019 196.696 251.649 C 234.033 287.719 327.173 300.899 383.002 290.224 C 435.111 280.26 500.332 275.052 545.679 241.855 C 591.025 208.807 691.129 228.046 667.317 274.932 C 646.102 316.704 687.862 321.38 717.846 332.336 C 750.8 344.377 765.322 359.41 772.424 387.091 C 776.371 402.474 777.343 444.081 767.034 463.498 C 746.41 502.343 737.183 503.703 698.445 518.795 C 674.691 528.049 627.518 530.388 627.518 530.388 C 604.798 531.354 604.948 527.489 559.417 527.489 C 513.977 527.489 561.092 530.387 515.65 530.387 C 470.121 530.387 482.828 528.456 437.482 528.456 C 392.135 528.456 371.034 524.591 325.687 524.591 C 280.342 524.591 272.765 525.557 227.233 525.557 C 181.795 525.557 143.895 527.489 98.457 527.489 C 52.924 527.489 5.738 514.931 -16.98 514.931 L -39.607 514.931 L -19.147 466.837 Z" fill={theme === 'dark' ? cloudsDarkColor.main : cloudsLightColor.main} />
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

const Rocket = ({ rocketState = 'hide', setRocketState }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            // Fire the animation
            setRocketState('show');
        }
    }, [isInView])

    return (
        <div
            ref={ref}
            className={styles.rocket}
        >
            <motion.div
                variants={{
                    hide: { y: 1500 },
                    show: { y: 0 },
                }}
                initial={"hide"}
                animate={rocketState}
                transition={{ duration: 1, delay: 0.25 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" width="809.16369" height="657.27702" viewBox="0 0 809.16369 657.27702">
                    <path d="M546.57954,700.70834l-19.83221.5476a13.81233,13.81233,0,0,1-8.48582-2.37891c-2.15367-1.602-3.14159-3.76763-2.70847-5.94251l3.90258-19.61285c.73546-3.7,5.26958-6.49709,10.77994-6.6493l10.95246-.30244c5.51034-.15215,10.19188,2.39045,11.1305,6.04428l4.979,19.36762c.55248,2.14764-.31449,4.36453-2.37642,6.08292A13.81231,13.81231,0,0,1,546.57954,700.70834Z" transform="translate(-193.54052 -122.01419)" fill="#3f3d56" />
                    <path d="M667.20992,700.14778l-19.83215.54763a13.81226,13.81226,0,0,1-8.48582-2.37891c-2.15362-1.602-3.14159-3.76763-2.70848-5.94251l3.90259-19.61285c.73546-3.7,5.2696-6.49714,10.77993-6.6493l10.95246-.30243c5.5104-.15214,10.19189,2.39044,11.1305,6.04427l4.979,19.36762c.55246,2.1477-.31448,4.36453-2.37641,6.08293A13.81223,13.81223,0,0,1,667.20992,700.14778Z" transform="translate(-193.54052 -122.01419)" fill="#3f3d56" />
                    <path d="M477.71428,533.6434a4.33143,4.33143,0,0,1,1.595-8.30761L704.777,519.11a4.33,4.33,0,0,1,4.4488,4.208l0,.00038a4.33573,4.33573,0,0,1-4.20924,4.44844l-.00045-.00019L479.54839,533.9923A4.30673,4.30673,0,0,1,477.71428,533.6434Z" transform="translate(-193.54052 -122.01419)" fill="#3f3d56" />
                    <rect x="499.4665" y="459.85109" width="64.47382" height="217.68039" transform="translate(-209.03562 -107.12078) rotate(-1.58175)" fill="#e6e6e6" />
                    <polygon points="369.018 333.079 356.629 366.828 356.64 520.587 371.736 524.916 369.018 333.079" fill="#ccc" />
                    <path d="M528.363,402.136c-12.05744.34245-21.2569,21.20913-21.03568,29.35186l.40705,14.74161,43.65914-1.20557-.40705-14.74161C550.75786,422.1398,540.42089,401.81259,528.363,402.136Z" transform="translate(-193.54052 -122.01419)" fill="#3f3d56" />
                    <path d="M568.3137,498.37505l-74.73857,2.0638c-7.13852-8.70518-7.78692-45.79259,7.11089-52.85111l5.8423-9.92024,45.04258-2.19882,5.26415,10.44507C564.24572,452.21964,568.06692,489.07551,568.3137,498.37505Z" transform="translate(-193.54052 -122.01419)" fill="#e6e6e6" />
                    <path d="M540.18331,480.58758l-18.90006.52192c-3.64714.10071-6.74794-4.631-6.91129-10.54634s2.67166-10.811,6.3188-10.91168l18.90007-.52192c3.64714-.10071,6.74793,4.631,6.91128,10.54634S543.83045,480.48687,540.18331,480.58758Z" transform="translate(-193.54052 -122.01419)" fill="#6c63ff" />
                    <polygon points="310.043 465.568 271.084 493.088 264.278 555.138 309.726 539.953 310.043 465.568" fill="#e6e6e6" />
                    <rect x="623.87687" y="457.18614" width="64.47382" height="217.68039" transform="translate(-208.91465 -103.68767) rotate(-1.58175)" fill="#e6e6e6" />
                    <polygon points="428.888 333.806 442.149 367.222 446.128 520.93 431.149 525.649 428.888 333.806" fill="#ccc" />
                    <path d="M651.51553,399.50588c-12.05744.34245-21.25689,21.20914-21.03567,29.35186l.407,14.74162,43.65913-1.20558-.407-14.74161C673.91039,419.50962,663.57349,399.1824,651.51553,399.50588Z" transform="translate(-193.54052 -122.01419)" fill="#3f3d56" />
                    <path d="M691.46628,495.74489l-74.73849,2.0638c-1.30315-7.87682.38259-44.63292,7.11089-52.85111l5.84229-9.92024,45.04259-2.19882,5.26415,10.44507C693.28642,444.36732,697.93794,480.48676,691.46628,495.74489Z" transform="translate(-193.54052 -122.01419)" fill="#e6e6e6" />
                    <path d="M663.42733,481.26809l-18.90007.52193c-3.64714.1007-6.76843-5.37373-6.957-12.2017s2.626-12.46635,6.273-12.56707l18.90007-.52193c3.64714-.1007,6.76843,5.37372,6.957,12.20169S667.07441,481.16736,663.42733,481.26809Z" transform="translate(-193.54052 -122.01419)" fill="#6c63ff" />
                    <polygon points="494.978 449.662 532.641 478.93 536.607 541.227 491.901 523.983 494.978 449.662" fill="#e6e6e6" />
                    <path d="M582.24819,141.20465c-12.05744.34245-21.2569,21.20915-21.03568,29.35188l.40705,14.74161,43.65913-1.20556-.40711-14.74162C604.64305,161.20839,594.30614,140.8812,582.24819,141.20465Z" transform="translate(-193.54052 -122.01419)" fill="#3f3d56" />
                    <path d="M608.24508,699.42335l-19.83215.54763a13.81226,13.81226,0,0,1-8.48582-2.37891c-2.15368-1.602-3.14165-3.76765-2.70848-5.94251l3.90259-19.61285c.73552-3.7,5.2696-6.49714,10.78-6.64927l10.95246-.30244c5.5104-.15213,10.19189,2.39044,11.1305,6.04427l4.9789,19.36752c.55246,2.1477-.31448,4.36453-2.37641,6.08292A13.81214,13.81214,0,0,1,608.24508,699.42335Z" transform="translate(-193.54052 -122.01419)" fill="#3f3d56" />
                    <rect x="558.70021" y="235.85625" width="64.47382" height="440.01582" transform="translate(-205.89866 -105.52873) rotate(-1.58175)" fill="#e6e6e6" />
                    <path d="M629.77769,275.30579l-87.32589,2.41139c-1.52253-9.20342.447-52.14995,8.30847-61.75224l2.15433-11.462,60.29654-1.665,3.15478,11.17106C625.02452,221.37694,629.48931,264.44,629.77769,275.30579Z" transform="translate(-193.54052 -122.01419)" fill="#e6e6e6" />
                    <path d="M615.11716,204.1904l-62.22262,1.7182c-2.29662.06335-4.19309-1.14245-4.23579-2.69338a1.952,1.952,0,0,1,.09665-.65849l9.66494-29.77518c.41385-1.275,2.06138-2.21137,3.98418-2.26446l41.26444-1.13938c1.9228-.05309,3.61947.79092,4.10307,2.04114l11.29335,29.19646c.57762,1.4933-.75639,3.04723-2.97964,3.47082A6.08056,6.08056,0,0,1,615.11716,204.1904Z" transform="translate(-193.54052 -122.01419)" fill="#e6e6e6" />
                    <path d="M559.03257,445.94067a7.62637,7.62637,0,0,1-1.58088-.915,5.60392,5.60392,0,0,1-2.37913-4.32149l-2.26085-81.87757c-.09309-3.3894,3.22545-6.24062,7.39768-6.356l55.70318-1.53841c4.17306-.116,7.64291,2.54888,7.7371,5.93821l2.26072,81.878a5.60268,5.60268,0,0,1-2.13683,4.44594,8.50615,8.50615,0,0,1-5.2613,1.90983l-55.70233,1.53768A8.91988,8.91988,0,0,1,559.03257,445.94067Z" transform="translate(-193.54052 -122.01419)" fill="#3f3d56" />
                    <path d="M594.68505,198.921l-18.90007.52192c-3.64714.10071-6.73109-4.01989-6.87367-9.18422s2.70927-9.44884,6.35641-9.54955l18.90006-.52192c3.64714-.1007,6.7311,4.01989,6.87367,9.18422S598.33219,198.82031,594.68505,198.921Z" transform="translate(-193.54052 -122.01419)" fill="#6c63ff" />
                </svg>
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
                    hide: { opacity: 0, x: 75, y: -75 },
                    show: { opacity: 1, x: 0, y: 0 },
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

const cloudsDarkColor = {
    outter: '#483B38',
    center: '#A2513F',
    main: '#FF6341'
}

const cloudsLightColor = {
    outter: '#DBDEE3',
    center: '#7784A2',
    main: '#1D3263'
}
