'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region REACT DEPEDENCY
import { useContext, useRef, useEffect, useState } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { useInView, useAnimate, useScroll, useMotionValueEvent, stagger, motion } from "framer-motion";
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

    return (
        <Section sectionRef={sectionRef}>

        </Section>
    )
}

const Section = ({ children, sectionRef }) => {
    return (
        <section
            ref={sectionRef}
            className={`${styles.section} ${styles.introduction}`}
            id={'intro'}
        >
            {children}
        </section>
    )
}