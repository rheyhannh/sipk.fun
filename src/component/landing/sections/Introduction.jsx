'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region REACT DEPEDENCY
import { useContext, useRef, useEffect, useState } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { useInView, useAnimate, stagger, motion } from "framer-motion";
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

    const [titleAnimState, setTitleAnimState] = useState('hide');
    const [descriptionAnimState, setDescriptionAnimState] = useState('hide');

    return (
        <Section sectionRef={sectionRef}>
            <AnimationController
                stateAnimation={{ title: titleAnimState, description: descriptionAnimState }}
                setAnimation={{ title: setTitleAnimState, description: setDescriptionAnimState }}
            />
            <Content>
                <TitleText
                    isSectionInView={isSectionInView}
                    titleAnimState={titleAnimState}
                    setTitleAnimState={setTitleAnimState}
                />
                <DescriptionText />
            </Content>
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

const Content = ({ children }) => {
    return (
        <div
            // className={styles.content}    
            style={{
                background: 'red',
                padding: '2rem',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem'
            }}
        >
            {children}
        </div>
    )
}

const TitleText = (
    {
        isSectionInView,
        titleAnimState,
        setTitleAnimState,
    }) => {
    const title = 'Apa itu SIPK';
    const titleArray = title.split(' ');

    useEffect(() => {
        if (isSectionInView) {
            // Fire the animation
            setTitleAnimState('show');
        }
    }, [isSectionInView])

    return (
        <div
            // className={styles.title}
            style={{
                overflow: 'hidden',
                background: 'purple',
            }}
        >
            <motion.div
                variants={{
                    hide: { opacity: 0, y: -75 },
                    show: { opacity: 1, y: 0 },
                }}
                initial={false}
                animate={titleAnimState}
                transition={{ duration: 0.25, delay: 0 }}
            >
                <h2
                    style={{
                        fontSize: 'var(--big-font-size)',
                    }}
                >
                    Apa itu SIPK
                </h2>
            </motion.div>
        </div>
    )
}

const DescriptionText = () => {
    return (
        <div
            // className={styles.description}
            style={{
                background: 'grey'
            }}
        >
            <p
                style={{
                    fontSize: 'var(--h1-font-size)',
                    textAlign: 'justify',
                }}
            >
                SIPK adalah aplikasi untuk mengorganisir matakuliah dan menghitung IPK yang kalian peroleh.
                Berbeda dengan portal akademik pada umumnya, SIPK berdiri sendiri sehingga kalian dapat menambah,
                menghapus bahkan mengubah nilai matakuliah kalian secara dinamis.
            </p>
        </div>
    )
}

const AnimationController = (
    {
        stateAnimation = { title: 'hide', description: 'hide' },
        setAnimation = { title: (param) => param, description: (param) => param }
    }) => {
    const handleOnClick = () => {
        if (stateAnimation.title === 'hide') {
            setAnimation.title('show');
        } else {
            setAnimation.title('hide');
        }
    }

    return (
        <div
            className={styles.theme_changer}
            onClick={handleOnClick}
            style={{
                left: '92px'
            }}
        >
            {stateAnimation.title === 'hide' ? <FaEye size={'18px'} /> : <FaEyeSlash size={'18px'} />}
        </div>
    )
}