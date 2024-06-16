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
import styles from '../style/feature.module.css'
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
                    <IntroCard />
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
            className={styles.section}
        >
            {children}
        </section>
    )
}

const Wrapper = ({ children }) => {
    return (
        <div
            className={styles.wrapper}
            style={{
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
            className={styles.cards}
            style={{ x }}
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
        border: '2.5px solid pink',
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
            className={styles.card}
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

const IntroCard = ({ }) => {
    const animControls = useAnimation();
    const [animateState, setAnimateState] = useState(false);
    const descriptionArray = ["Kamu", "bebas", "tambah", "dan", "hapus", "matakuliah", "kamu", "secara", "dinamis.", "Gausah", "binggung", "IPK", "kamu", "jadi", "berapa,", "biar", "SIPK", "yang", "hitungin", "itu", "semua", "buat kamu."];

    return (
        <Card>
            <motion.div
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '500px 1fr',
                    gap: '1rem',
                    border: '2px solid red',
                }}
                initial={'hide'}
                animate={animControls}
                whileInView={[
                    'introCardBox_show',
                    'introCardDescription_show'
                ]}
                transition={{
                    delayChildren: 0.5,
                    staggerChildren: 0.2
                }}
                onAnimationComplete={
                    definition => {
                        console.log(`${definition} selesai`)
                    }
                }
            >
                <motion.div
                    onClick={() => { setAnimateState((value) => !value) }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '.5rem',
                        border: '1px solid yellow'
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            height: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '1rem',
                            border: '.5px solid purple'
                        }}
                    >
                        <AnimatedTextBox
                            text='Tambah Matakuliah'
                            fontSize='1.2rem'
                            color='var(--landing-copyInverse)'
                            background='#74ff8d'
                            enterAnimation='custom'
                            customEnterAnimation={{
                                hide: { opacity: 0, rotateY: -25, rotateX: -75, scale: 0.75 },
                                introCardBox_show: { opacity: 1, rotateY: 0, rotateX: 0, scale: 1, transition: { type: 'spring', damping: 9, stiffness: 100 } },
                                introCardBox_tambah_unhighlight: { opacity: 1, y: 0, x: 0, scale: 1, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } },
                                introCardBox_tambah_highlight: { scale: 1.25, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } }
                            }}
                            style={{ fontWeight: '600', zIndex: 6, transformOrigin: 'bottom left 1.5rem' }}
                        />

                        <AnimatedTextBox
                            text='Hapus Matakuliah'
                            fontSize='1.35rem'
                            color='var(--landing-copyInverse)'
                            background='#ff747d'
                            enterAnimation='custom'
                            customEnterAnimation={{
                                hide: { opacity: 0, y: (-75 / 2), x: (-75 / 2), scale: 0.25 },
                                introCardBox_show: { opacity: 1, y: 0, x: 0, scale: 1, transition: { type: 'spring', damping: 8, stiffness: 100 } },
                                introCardBox_hapus_unhighlight: { opacity: 1, y: 0, x: 0, scale: 1, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } },
                                introCardBox_hapus_highlight: { scale: 1.25, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } }
                            }}
                            style={{ fontWeight: '600', zIndex: 5, margin: '.5rem 0 0 1rem' }}
                        />

                        <AnimatedTextBox
                            text='Apapun Sesukamu'
                            fontSize='1.5rem'
                            color='var(--landing-copyInverse)'
                            background='#ffd274'
                            enterAnimation='custom'
                            customEnterAnimation={{
                                hide: { opacity: 0, y: (-75 / 3), x: (-75 / 3), scale: 0.5 },
                                introCardBox_show: { opacity: 1, y: 0, x: 0, scale: 1, transition: { type: 'spring', damping: 7, stiffness: 100 } },
                                introCardBox_apapun_unhighlight: { opacity: 1, y: 0, x: 0, scale: 1, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } },
                                introCardBox_apapun_highlight: { scale: 1.25, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } }
                            }}
                            style={{ fontWeight: '600', zIndex: 4, margin: '.5rem 0 0 2rem' }}
                        />

                        <motion.div
                            style={{
                                position: 'absolute',
                                transformOrigin: '200% -200%'
                            }}
                            variants={{
                                hide: { opacity: 0, scale: 1.25, rotateX: -75, rotateY: -25, top: '50%', left: '90%', translateX: '-90%', translateY: '-50%' },
                                introCardBox_show: { opacity: 1, scale: 1, rotateX: 0, rotateY: 0, transition: { type: 'spring', damping: 10, stiffness: 50 } }
                            }}
                        >
                            <FoldingIcons
                                contents={[
                                    { icon: <AiOutlinePlus style={{ display: 'block', verticalAlign: 'middle' }} />, color: 'var(--landing-copyInverse)', backgroundColor: '#74ff8d' },
                                    { icon: <AiOutlineDelete style={{ display: 'block', verticalAlign: 'middle' }} />, color: 'var(--landing-copyInverse)', backgroundColor: '#ff747d' },
                                    { icon: <AiOutlineLike style={{ display: 'block', verticalAlign: 'middle' }} />, color: 'var(--landing-copyInverse)', backgroundColor: '#ffd274' },
                                ]}
                                contentOptions={{
                                    fontSize: '3.25rem',
                                }}
                                dividerOptions={{
                                    height: '1.5px'
                                }}
                                animationOptions={{
                                    type: 'stateChanges',
                                }}
                                stateChangesOptions={{
                                    useParentState: true,
                                    parentStateValue: animateState,
                                    parentStateSetter: setAnimateState,
                                    autoUpdateParentState: true,
                                }}
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        style={{
                            overflow: 'hidden',
                            padding: '.5rem',
                            zIndex: 7,
                            border: '1px grey solid'
                        }}
                    >
                        <motion.p
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap'
                            }}
                            variants={{ hide: {}, introCardDescription_show: {} }}
                            transition={{
                                staggerChildren: 0.075,
                            }}
                        >
                            {descriptionArray.map((item, index) => (
                                <motion.span
                                    key={`introCard-description-${index}`}
                                    variants={{
                                        hide: getCommonAnimationVariants('scaleFromSmall').hide,
                                        introCardDescription_show: getCommonAnimationVariants('scaleFromSmall').show
                                    }}
                                    style={{
                                        margin: '0 5px 5px 0',
                                        fontSize: '1.375rem',
                                        fontWeight: '500',
                                        textAlign: 'justify',
                                        color: 'var(--landing-copy)',
                                    }}
                                >
                                    {item}
                                </motion.span>
                            ))}
                        </motion.p>

                    </motion.div>
                </motion.div>

                <motion.div
                    onClick={() => { console.log(animateState) }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '1rem',
                        padding: '1rem',
                        border: '1px solid green',
                        overflow: 'hidden'
                    }}
                >

                </motion.div>
            </motion.div>
        </Card >
    )
}

const MATKULDUMMIES = [
    { type: 'tambah', nama: '', date: '', nilai: '', sks: '' }
]

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