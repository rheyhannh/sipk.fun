'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { motion, useTransform, useScroll } from 'framer-motion';
import { Link } from 'react-scroll';
// #endregion

// #region ICON DEPEDENCY
import {
    TbPlaylistAdd,
    TbLayoutGridAdd,
    TbEdit,
    TbTargetArrow,
    TbChartInfographic,
} from "react-icons/tb";
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/how.module.css';
// #endregion

const How = () => {
    const [activeSlide, setActiveSlide] = React.useState(null);
    const sectionRef = React.useRef(null);
    const { scrollYProgress } = useScroll({ target: sectionRef });
    const titleOverlay = useTransform(scrollYProgress, [0, 0.5], ['0%', '100%'])

    return (
        <section
            ref={sectionRef}
            id={'how'}
            className={styles.section}
        >
            <div
                className={styles.wrapper}
            >
                <div
                    className={styles.progress}
                >
                    <div
                        className={styles.circles}
                    >
                        {CONTENTS.map((item, index) => (
                            <motion.div
                                key={`asereheaha-${index}`}
                                className={styles.circle}
                                variants={{
                                    highlight: { scale: 1.35, backgroundColor: 'var(--logo-second-color)', color: 'var(--landing-copyInverse)' }
                                }}
                                animate={activeSlide === index ? 'highlight' : {}}
                                whileHover={'highlight'}
                                onClick={() => setActiveSlide(index)}
                            >
                                <div className={styles.icon}>
                                    {item.icon}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className={styles.content}>
                    <div
                        className={styles.titles}
                    >
                        {CONTENTS.map((item, index) => (
                            <svg
                                key={`asaswasdz-${index}`}
                                className={styles.title}
                            >
                                <mask id={`mask-title-${index}`}>
                                    <rect width={'100%'} height={'100%'} fill={'var(--logo-second-color)'} />
                                    <text x={'0%'} y={'70%'}>
                                        {item.title}
                                    </text>
                                </mask>

                                <motion.rect
                                    width={titleOverlay}
                                    height={'100%'}
                                    fill={'var(--logo-second-color)'}
                                    mask={`url(#mask-title-${index})`}
                                />
                            </svg>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

const CONTENTS = [
    {
        title: 'Tambah Matakuliahmu',
        short: 'Tambah',
        description: 'Tambah matakuliahmu yang sudah ditempuh',
        icon: <TbPlaylistAdd />,
        iconName: 'TbPlaylistAdd',
        iconLib: 'tb',
    },
    {
        title: 'Rencanakan Studimu',
        short: 'Rencanakan',
        description: 'Buat rencana studimu untuk semester yang akan datang dengan perhitungan IPK yang aktual',
        icon: <TbLayoutGridAdd />,
        iconName: 'TbLayoutGridAdd',
        iconLib: 'tb',
    },
    {
        title: 'Ubah Sesukamu',
        short: 'Ubah',
        description: 'Simulasikan perubahan IPK dengan mengubah sks maupun nilai',
        icon: <TbEdit />,
        iconName: 'TbEdit',
        iconLib: 'tb',
    },
    {
        title: 'Atur Targetmu',
        short: 'Atur',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.',
        icon: <TbTargetArrow />,
        iconName: 'TbTargetArrow',
        iconLib: 'tb',
    },
    {
        title: 'Lacak Progressmu',
        short: 'Lacak',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.',
        icon: <TbChartInfographic />,
        iconName: 'TbChartInfographic',
        iconLib: 'tb',
    },
]

export { How }