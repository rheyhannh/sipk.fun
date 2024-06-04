'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js'
// #endregion

// #region REACT DEPEDENCY
import { useContext, useRef } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { motion, useTransform, useScroll } from "framer-motion";
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

    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    })

    const x = useTransform(scrollYProgress, [0, 1], ["0", "-100%"]);
    const getSectionHeight = () => {
        console.log(`Cards Total: ${cards.length}`);
        console.log(`Cards Gap Count: ${cards.length - 1}`);
        const cardsMaximum = 500 * (cards.length - 2);
        const cardsGapMaximum = 14 * 2.5 * (cards.length - 2);
        return cardsMaximum + cardsGapMaximum + (14 * 5 * 2);
    }

    return (
        <section style={{ height: `500vh` }} ref={targetRef} className={`${styles.section} ${styles.feature}`} id={'feature'}>
            <div className={styles.card_container}>
                <motion.div style={{ x }} className={styles.card_wrapper}>
                    {cards.map((card, index) => {
                        return <Card card={card} key={`featureCard-${index}`} />
                    })}
                </motion.div>
            </div>
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

const Card = ({ card }) => {
    return (
        <div className={styles.card}>
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