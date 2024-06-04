'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region REACT DEPEDENCY
import { useContext, useRef, useEffect, useState } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { useInView, useAnimate, useScroll, useMotionValueEvent, useMotionValue, stagger, motion, useTransform, AnimatePresence } from "framer-motion";
// #endregion

// #region ICON DEPEDENCY
import {
    FaEye,
    FaEyeSlash,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa'
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/landing.module.css'
// #endregion

export function Introduction() {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist, data } = useContext(LandingContext);

    return (
        <Section>
            <Wrapper>
                <Title />
                <Description />
            </Wrapper>
        </Section>
    )
}

const Section = ({ children }) => {
    return (
        <section
            className={`${styles.section}`}
            style={{
                display: 'initial',
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
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                width: '100%',
                height: '100%',
                padding: '2rem',
                border: '2.5px solid purple'
            }}
        >
            {children}
        </div>
    )
}

const Title = ({ }) => {
    const title = 'Apa itu SIPK ?';

    return (
        <motion.div
            style={{
                position: 'relative',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'start',
                width: 'max-content',
                padding: '.5rem 5rem',
                overflow: 'hidden',
                // border: '1.25px solid red'
            }}
            variants={{
                initial: {},
                show: {
                    transition: {
                        delayChildren: 0.2,
                        staggerChildren: 0.2
                    }
                },
            }}
            initial={'initial'}
            whileInView={'show'}
        // viewport={{ once: true }}
        >
            <motion.div
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'var(--body-color)',
                    color: 'var(--logo-second-color)',
                    zIndex: '3',
                }}
                variants={{
                    initial: { zIndex: '3' },
                    show: { zIndex: '1' },
                }}
            >
                <motion.div
                    style={{
                        position: 'absolute',
                        left: '7.5%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        width: '50%',
                        height: '100%',
                        // border: '1px solid aqua',
                    }}
                    variants={{
                        initial: { x: 0, scale: 1 },
                        show: { x: '-70%', scale: 0.8 }
                    }}
                >
                    <FaChevronLeft size={'50%'} />
                </motion.div>

                <motion.div
                    style={{
                        position: 'absolute',
                        left: '42.5%',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '50%',
                        height: '100%',
                        // border: '1px solid gold',
                    }}
                    variants={{
                        initial: { x: 0, scale: 1 },
                        show: { x: '70%', scale: 0.8 }
                    }}
                >
                    <FaChevronRight size={'50%'} />
                </motion.div>
            </motion.div>

            <motion.h1
                style={{
                    fontSize: 'var(--big-font-size)',
                    color: 'var(--dark-color)',
                    zIndex: '2',
                }}
                variants={{
                    initial: { opacity: 0, scale: 0.8 },
                    show: { opacity: 1, scale: 1 }
                }}
            >
                {title}
            </motion.h1>
        </motion.div>
    )
}

const Description = ({ }) => {
    const description = 'SIPK adalah aplikasi untuk mengorganisir matakuliah dan menghitung IPK yang diperoleh. Dengan SIPK kalian dapat menambah, menghapus bahkan mengubah nilai matakuliah kalian secara dinamis.';

    return (
        <AnimatePresence>
            <motion.div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'start',
                    width: '100%',
                    padding: '.5rem 1rem',
                    overflow: 'hidden',
                    border: '1.25px solid green'
                }}
                variants={{
                    initial: {},
                    show: {
                        transition: {
                            delayChildren: 0.5,
                            staggerChildren: 0.075,
                        }
                    },
                }}
                initial={'initial'}
                whileInView={'show'}
                // viewport={{ once: true }}
            >
                {description.split(' ').map((item, index) => (
                    <motion.h1
                        key={`ApaItuSipk-Description-${index}`}
                        style={{
                            margin: '0 10px 10px 0',
                            whiteSpace: 'nowrap',
                            fontSize: 'var(--h1-font-size)',
                            color: 'var(--dark-color)',
                        }}
                        variants={{
                            initial: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    type: "spring",
                                    stiffness: 100,
                                    mass: 0.3
                                }
                            },
                        }}
                    >
                        {item}
                    </motion.h1>
                ))}
            </motion.div>
        </AnimatePresence>
    )
}
