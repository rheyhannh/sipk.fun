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
import FoldingIcons from '@/component/motion/FoldingIcons';
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

/**
 * 
 * @param {Object} props
 * @param {string} [props.text] Teks konten
 * - Default : `'Lorem ipsum'`
 * @param {string} [props.fontSize] Font size teks konten
 * - Default : `'1rem'`
 * @param {string} [props.color] Warna teks konten
 * - Default : `'var(--dark-color)'`
 * @param {string} [props.borderRadius] Border radius box konten
 * - Default : `'calc(0.25 * ${fontSize})'`
 * @param {string} [props.padding] Padding box konten
 * - Default : `'calc(0.25 * ${fontSize})'`
 * @param {string} [props.background] Background box konten
 * - Default : `'none'`
 * @param {boolean} [props.useBoxShadow] Boolean untuk menggunakan box shadow
 * - Default : `true`
 * @param {CommonAnimationName | 'custom'} [props.enterAnimation] 
 * Animasi yang digunakan. Jika menggunakan `'custom'`, silahkan pass props `customEnterAnimation`
 * - Default : `'throwDown'`
 * @param {Variants} [props.customEnterAnimation] Object yang berisikan key `hide` yang merupakan initial styles dan `show` yang merupakan animated styles yang diterapkan
 * - Default : `{ hide: { opacity: 0 }, show: { opacity: 1 } }`
 * @param {CSSProperties} [props.style] Object yang berisikan style tambahan yang digunakan
 * - Default : `{}`
 * @param {HTMLProps | MotionProps} [props.otherProps] Object yang berisikan props lainnya yang digunakan
 * - Note : Props `motion` seperti `animate`, `transition` dan lainnya dapat digunakan
 * - Default : `{}`
 * @returns 
 */
const AnimatedTextBox = (
    {
        text = 'Lorem ipsum',
        fontSize = '1rem',
        color = 'var(--dark-color)',
        borderRadius = `calc(0.25 * ${fontSize})`,
        padding = `calc(0.25 * ${fontSize})`,
        background = 'none',
        useBoxShadow = true,
        enterAnimation = 'throwDown',
        customEnterAnimation = { hide: { opacity: 0 }, show: { opacity: 1 } },
        style = {},
        otherProps = {}
    }
) => {
    const variants = enterAnimation === 'custom' ? { ...customEnterAnimation } : getCommonAnimationVariants(enterAnimation);

    return (
        <motion.div
            className={useBoxShadow ? styles.animated__text_box : ''}
            style={{
                position: 'relative',
                width: 'max-content',
                height: 'max-content',
                borderRadius,
                ...style
            }}
            variants={variants}
            {...otherProps}
        >
            <motion.span
                style={{
                    position: 'relative',
                    zIndex: 2,
                    fontSize,
                    color,
                    borderRadius,
                    padding,
                    background,
                }}
            >
                {text}
            </motion.span>
        </motion.div>
    )
}

/**
 * @typedef CommonAnimationName
 * @type {'default' | 'flyUp' | 'flyDown'| 'slideLeft'| 'slideRight'| 'throwUp'| 'throwDown'| 'scaleFromSmall'| 'scaleFromBig' | 'diagonalUpLeft' | 'diagonalUpRight' | 'diagonalDownLeft' | 'diagonalDownRight'}
 */

/**
 * Method untuk mendapatkan `variants` yang digunakan pada component `motion` dengan tipe animasi tertentu.
 * 
 * Jika tipe animasi tidak tersedia, maka akan return animasi default sebagai berikut,
 * ```js
 * const hide = { opacity: 0 };
 * const show = { opacity: 1 };
 * ```
 * @param {CommonAnimationName} type Tipe animasi yang digunakan
 * @returns {{hide:CSSProperties, show:CSSProperties}} Object dengan key `hide` sebagai initial styles dan `show` sebagai animated styles
 */
const getCommonAnimationVariants = (
    type
) => {
    const animations = {
        default: { hide: { opacity: 0 }, show: { opacity: 1 } },
        flyUp: { hide: { opacity: 0, y: 75 }, show: { opacity: 1, y: 0 } },
        flyDown: { hide: { opacity: 0, y: -75 }, show: { opacity: 1, y: 0 } },
        slideLeft: { hide: { opacity: 0, x: 75 }, show: { opacity: 1, x: 0 } },
        slideRight: { hide: { opacity: 0, x: -75 }, show: { opacity: 1, x: 0 } },
        throwUp: { hide: { opacity: 0, x: -200, y: 200, rotate: 30 }, show: { opacity: 1, x: 0, y: 0, rotate: 0 } },
        throwDown: { hide: { opacity: 0, x: -200, y: -200, rotate: -30 }, show: { opacity: 1, x: 0, y: 0, rotate: 0 } },
        scaleFromSmall: { hide: { opacity: 0, scale: 0.5 }, show: { opacity: 1, scale: 1 } },
        scaleFromBig: { hide: { opacity: 0, scale: 1.5 }, show: { opacity: 1, scale: 1 } },
        diagonalUpLeft: { hide: { opacity: 0, y: 75, x: 75 }, show: { opacity: 1, y: 0, x: 0 } },
        diagonalUpRight: { hide: { opacity: 0, y: 75, x: -75 }, show: { opacity: 1, y: 0, x: 0 } },
        diagonalDownLeft: { hide: { opacity: 0, y: -75, x: 75 }, show: { opacity: 1, y: 0, x: 0 } },
        diagonalDownRight: { hide: { opacity: 0, y: -75, x: -75 }, show: { opacity: 1, y: 0, x: 0 } },
    }

    return animations[type] ?? animations['default'];
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