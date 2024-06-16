'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js'
// #endregion

// #region REACT DEPEDENCY
import { useContext, useRef } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { motion, useTransform, useScroll } from "framer-motion";
import TambahHapus from '../cards/TambahHapus';
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
                    <TambahHapus />
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

const MATKULDUMMIES = [
    { type: 'tambah', nama: '', date: '', nilai: '', sks: '' }
]







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