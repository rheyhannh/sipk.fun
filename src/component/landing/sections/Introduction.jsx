'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region REACT DEPEDENCY
import { useContext, useRef, useEffect, useState } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { useInView, useAnimate, useScroll, useMotionValueEvent, useMotionValue, stagger, motion, useTransform } from "framer-motion";
// #endregion

// #region ICON DEPEDENCY
import {
    FaEye,
    FaEyeSlash,
} from 'react-icons/fa'
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/landing.module.css'
// #endregion

export function Introduction() {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist, data } = useContext(LandingContext);
    const sectionRef = useRef(null);
    const [sectionScrollProgress, setSectionScrollProgress] = useState(0);
    const isSectionInView = useInView(sectionRef, { once: true });
    const { scrollYProgress} = useScroll({ target: sectionRef });

    useEffect(() => {
        scrollYProgress.on('change', (latest) => {
            // console.log(latest);
            setSectionScrollProgress(latest);
        });

        return () => {
            scrollYProgress.clearListeners();
        }
    }, [scrollYProgress])

    return (
        <Section sectionRef={sectionRef}>
            <Wrapper>

            </Wrapper>
        </Section>
    )
}

const Section = ({ children, sectionRef }) => {
    return (
        <section
            ref={sectionRef}
            className={`${styles.section}`}
            style={{
                display: 'initial',
                height: '500vh',
                border: '7.5px solid red'
            }}
            id={'intro'}
        >
            {children}
        </section>
    )
}

const Wrapper = ({ children }) => {
    return (
        <div
            style={{
                position: 'sticky',
                top: '0',
                height: '100vh',
                overflow: 'hidden',
                padding: 'calc(72px + 2rem) 2rem 2rem 2rem',
                border: '5px solid purple',
            }}
        >
            {children}
        </div>
    )
}

const Content = ({ children }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                background: 'red',
                width: '100%',
                height: '100%',
            }}
        >
            {children}
        </div>
    )
}

const Title = (
    {
        sectionRef,
        title = 'Lorem ipsum dolor sit amet.',
        enterAnimation = 'staggerFirst',
        enterScrollTimeframe = [0, 0.2],
        exitAnimation = 'staggerLast',
        exitScrollTimeframe = [0.75, 0.95],
        overallTimeframe = [0, 0.5],
    }) => {
    const [scope, animate] = useAnimate();
    const { scrollYProgress: sectionScrollProgress } = useScroll({ target: sectionRef });
    const staggerAnim = {
        first: stagger(0.1, { startDelay: 0.25, from: 'first' }),
        last: stagger(0.1, { startDelay: 0.25, from: 'last' })
    };

    const timeframe = useTransform(sectionScrollProgress, [overallTimeframe[0], overallTimeframe[1]], [0, 1]);
    const opacity = useTransform(
        timeframe,
        [enterScrollTimeframe[0], enterScrollTimeframe[1], exitScrollTimeframe[0], exitScrollTimeframe[1]],
        [0, 1, 1, 0]
    )
    const y = useTransform(
        timeframe,
        [enterScrollTimeframe[0], enterScrollTimeframe[1], exitScrollTimeframe[0], exitScrollTimeframe[1]],
        [-75, 0, 0, -75]
    )

    // Testing Purposes.
    // useEffect(() => {
    //     sectionScrollProgress.on('change', (latest) => {
    //         const percentage = (latest * 100).toFixed(1);
    //         console.log(`section: ${percentage}`);
    //     })

    //     timeframe.on('change', (latest) => {
    //         const percentage = (latest * 100).toFixed(1);
    //         console.log(`timeframe: ${percentage}`);
    //     })

    //     return () => {
    //         console.log('Clearing Listener.')
    //         sectionScrollProgress.clearListeners();
    //         timeframe.clearListeners();
    //     }
    // }, [])

    return (
        <motion.h1
            ref={scope}
            style={{
                fontSize: 'var(--big-font-size)',
                color: 'var(--dark-color)',
                opacity,
                y
            }}
        >
            <span
            >
                {title}
            </span>
        </motion.h1>
    )
}

const Description = ({ sectionRef }) => {
    const [scope, animate] = useAnimate();
    const description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos nam fugit assumenda dolor neque, repellat veritatis saepe consequuntur impedit earum dolorem, ut dolores, eaque natus optio tempore? Sapiente, nulla repellat.';

    return (
        <p
            ref={scope}
            style={{
                fontSize: 'var(--h1-font-size)',
                color: 'var(--dark-color)',
                textAlign: 'justify',
            }}
        >
            <span>
                {description}
            </span>
        </p>
    )
}