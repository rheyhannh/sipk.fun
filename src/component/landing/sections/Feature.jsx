'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js'
// #endregion

// #region REACT DEPEDENCY
import { useContext, useRef, useState, useEffect } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { motion, useTransform, useScroll } from "framer-motion";
import { MatkulList, MatkulListInstance } from '../preview/MatkulList';
import { animateScroll as scroll } from 'react-scroll';
// #endregion

// #region ICON DEPEDENCY
import { GoChecklist } from "react-icons/go";
import { TbAdjustmentsStar, TbQuestionMark, TbCurrencyDollarOff } from "react-icons/tb";
import { MdEditNote } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/feature.module.css'
// #endregion

/**
 * Render landing page section `feature`
 * @returns {ReactElement} Element react untuk render landing page section `feature`
 */
function Feature() {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist } = useContext(LandingContext);
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: sectionRef })
    const x = useTransform(scrollYProgress, calculateHooksX().input, calculateHooksX().output);
    const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <Section sectionRef={sectionRef}>
            <Wrapper>
                <Progress scrollProgress={scrollProgress} sectionRef={sectionRef} />
                <Cards animateX={x}>
                    {/* <Card>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3,315px)',
                                gap: '1rem',
                                height: '350px',
                            }}
                        >
                            <MatkulList
                                title={'Semester 1'}
                                dummiesRange={[0, 24]}
                                maximumMatkul={5}
                                minimumMatkul={1}
                            />

                            <MatkulList
                                title={'Semester 2'}
                                dummiesRange={[25, 48]}
                                maximumMatkul={5}
                                minimumMatkul={1}
                            />

                            <MatkulList
                                title={'Semester 3'}
                                dummiesRange={[50, 74]}
                                maximumMatkul={5}
                                minimumMatkul={1}
                            />

                        </div>
                    </Card> */}
                    {contents.map((card, index) => {
                        return <Card
                            card={card}
                            key={`featureCard-${index}`}
                        />
                    })}
                </Cards>
            </Wrapper>
        </Section>
    )
}

const Section = ({ children, sectionRef }) => {
    const cardCount = contents.length;
    const cardWidth = '100vw';
    const cardGap = '2.5rem';
    const cardTotalGap = `${cardCount - 1} * ${cardGap}`;
    const cardsPadding = '3rem'
    const cardsTotalPadding = `2 * ${cardsPadding}`;
    const count = `calc((${cardCount} * ${cardWidth}) + ${cardTotalGap} + ${cardsTotalPadding})`;
    return (
        <section
            ref={sectionRef}
            id={'feature'}
            style={{ height: count }}
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

const Progress = ({ scrollProgress, sectionRef }) => {
    const [activeSlide, setActiveSlide] = useState(0);

    scrollProgress.on('change', (val) => {
        const current = val * 100;
        const offset = 2;
        const contentsRange = (100 / (contents.length - 1)) - offset;
        const halfContentsRange = contentsRange / 2;

        for (let i = 0; i < contents.length; i++) {
            const start = i * contentsRange;
            const middle = start + halfContentsRange;
            const end = start + contentsRange;

            if (current >= start && current < middle) {
                setActiveSlide(i);
                return;
            } else if (current >= middle && current < end) {
                setActiveSlide(null);
                return;
            }
        }
    })

    return (
        <motion.div
            className={styles.progress}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.5 }}
        >
            <Circle activeSlide={activeSlide} sectionRef={sectionRef}/>
            <Line scrollProgress={scrollProgress} />
        </motion.div>
    )
}

const Circle = ({ activeSlide, sectionRef }) => (
    <div className={styles.circle}>
        {contents.map((item, index) => (
            <motion.div
                key={`featureCardProgress-${index}`}
                className={styles.item}
                animate={index === activeSlide ? 'highlight' : {}}
                variants={{
                    highlight: {
                        scale: 1.35, backgroundColor: 'var(--logo-second-color)', color: 'var(--landing-copyInverse)'
                    }
                }}
                whileHover={'highlight'}
                onClick={() => {
                    if (sectionRef) {
                        const rect = sectionRef.current.getBoundingClientRect();
                        const cardGap = 2.5 * 14;
                        const section = window.scrollY + rect.top;
                        const offset = (window.innerWidth + (cardGap * 3)) * index;
                        const y = section + offset;
                        scroll.scrollTo(y)
                    }
                }}
            >
                <div className={styles.icon}>
                    {item.icon}
                </div>

            </motion.div>
        ))}
    </div>
)

const Line = ({ scrollProgress }) => (
    <motion.svg
        viewBox="0 0 100% 100%"
        className={styles.line}
    >
        <motion.line
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
            pathLength={scrollProgress}
            stroke={'var(--logo-second-color)'}
            style={{
                zIndex: 2
            }}
        />

        <motion.line
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke={'var(--landing-copyInverse)'}
            style={{
                zIndex: 1
            }}
        />
    </motion.svg>
)

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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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

const contents = [
    {
        title: 'Kenapa harus pakai SIPK',
        short: 'Kenapa SIPK',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur ducimus natus minus ex accusamus sapiente?',
        icon: <TbQuestionMark />,
        iconName: 'TbQuestionMark',
        icobLib: 'tb',
    },
    {
        title: 'Rencanakan Studimu',
        short: 'Perencanaan',
        description: 'Mulai rencanakan matakuliah kamu sedini mungkin dengan perkiraan IPK yang aktual.',
        icon: <GoChecklist />,
        iconName: 'GoChecklist',
        icobLib: 'go',
    },
    {
        title: 'Ubah Sesukamu',
        short: 'Dinamis',
        description: 'Gaperlu binggung lagi kalau ingin mengulang atau perbaiki matakuliah IPK kamu jadi berapa nantinya, tinggal ubah dan simulasikan sesukamu.',
        icon: <MdEditNote />,
        iconName: 'MdEditNote',
        icobLib: 'md',
    },
    {
        title: 'Petakan Mimpimu',
        short: 'Kustom',
        description: 'Atur target IPK yang kamu ingin raih beserta dengan jumlah matakuliah dan sks yang ingin dicapai.',
        icon: <TbAdjustmentsStar />,
        iconName: 'TbAdjustmentsStar',
        icobLib: 'tb',
    },
    {
        title: 'Lacak Progressmu',
        short: 'Track',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.',
        icon: <GiProgression />,
        iconName: 'GiProgression',
        icobLib: 'gi',
    },
    {
        title: 'Gratisss',
        short: 'Gratis',
        description: 'Cuma butuh wifi kampus atau nyolong hotspot temen kamu',
        icon: <TbCurrencyDollarOff />,
        iconName: 'TbCurrencyDollarOff',
        icobLib: 'tb',
    }
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

const calculateHooksX = () => {
    const step = 100 / (contents.length);
    return {
        input: [0, 1],
        output: [`0%`, `-${step * (contents.length - 1) + 2.5}%`]
    }
}

export { Feature, contents }