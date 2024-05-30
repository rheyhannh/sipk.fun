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
    const isSectionInView = useInView(sectionRef, { once: true });
    const { scrollYProgress } = useScroll({
        target: sectionRef
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        console.log(`Section introduction scroll : ${(latest * 100).toFixed(1)}%`)
    })

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
                height: '300vh',
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