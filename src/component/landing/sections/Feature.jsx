'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js'
import { HTMLProps, CSSProperties } from 'react';
import { MotionProps, Variants } from 'framer-motion';
// #endregion

// #region REACT DEPEDENCY
import { useContext, useRef, useState, useEffect } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { motion, useTransform, useScroll, useAnimationControls, useAnimation, useAnimate } from "framer-motion";
// #endregion

// #region ICON DEPEDENCY
import { AiOutlineQuestion, AiOutlineDelete, AiOutlinePlus, AiOutlineLike } from "react-icons/ai";
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/landing.module.css'
// #endregion

/**
 * Render landing page section `feature`
 * @returns {ReactElement} Element react untuk render landing page section `feature`
 */
export function Feature() {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist } = useContext(LandingContext);
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: sectionRef })
    const x = useTransform(scrollYProgress, [0, 1], ["0", "-100%"]);

    return (
        <Section sectionRef={sectionRef}>
            <Wrapper>
                <Cards animateX={x}>
                    {cards.map((card, index) => {
                        return <Card
                            card={card}
                            key={`featureCard-${index}`}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        />
                    })}
                </Cards>
            </Wrapper>
        </Section>
    )
}

const Section = ({ children, sectionRef }) => {
    return (
        <section
            ref={sectionRef}
            id={'feature'}
            style={{ height: `500vh` }}
            className={`${styles.section} ${styles.feature}`}
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
                display: 'flex',
                alignItems: 'center',
                height: '100vh',
                overflow: 'hidden',
                // background: 'aquamarine',
            }}
        >
            {children}
        </div>
    )
}

const Cards = ({ children, animateX: x }) => {
    return (
        <motion.div
            style={{
                x,
                display: 'flex',
                gap: '2.5rem',
            }}

        >
            {children}
        </motion.div>
    )
}

const Card = (
    {
        children,
        card = {
            title: 'Feature X',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.'
        },
        style,
        ...props
    }) => {
    const defaultStyle = {
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        color: 'var(--dark-color)',
        border: '2.5px solid pink',
        padding: 'calc(72px + 2rem) 2rem 2rem 2rem',
    }

    const DefaultElement = () => (
        <>
            <motion.h2
                variants={{
                    hide: { opacity: 0, y: 50 },
                    show: { opacity: 1, y: 0 }
                }}
                initial={'hide'}
                whileInView={'show'}
            // viewport={{ once: true }}
            >
                {card.title}
            </motion.h2>

            <motion.h3
                variants={{
                    hide: { opacity: 0, y: 75 },
                    show: { opacity: 1, y: 0 }
                }}
                initial={'hide'}
                whileInView={'show'}
            // viewport={{ once: true }}
            >
                {card.description}
            </motion.h3>
        </>
    )

    return (
        <div
            style={{
                ...defaultStyle,
                ...style
            }}
            {...props}
        >
            {children ?? <DefaultElement />}
        </div>
    )
}

const cards = [
    {
        title: 'Feature 1',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.'
    },
    {
        title: 'Feature 2',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.'
    },
    {
        title: 'Feature 3',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.'
    },
    {
        title: 'Feature 4',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.'
    },
    {
        title: 'Feature 5',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.'
    },
    {
        title: 'Feature 6',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.'
    },
]