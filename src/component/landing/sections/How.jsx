'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { motion, useTransform, useScroll, MotionValue } from 'framer-motion';
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
    const [activeCard, setActiveCard] = React.useState(null);
    const sectionRef = React.useRef(null);
    const { scrollYProgress: sectionScrollProgress } = useScroll({ target: sectionRef });

    return (
        <Section sectionRef={sectionRef}>
            <Wrapper>
                <Progress>
                    <Circles activeCard={activeCard} />
                </Progress>

                <Content>
                    <Titles sectionScrollProgress={sectionScrollProgress} />
                </Content>
            </Wrapper>

            <Cards />
        </Section>
    )
}

const Section = ({ sectionRef, children }) => (
    <section
        ref={sectionRef}
        id={'how'}
        className={styles.section}
        style={{ '--card-count': CONTENTS.length }}
    >
        {children}
    </section>
)

const Wrapper = ({ children }) => (
    <div className={styles.wrapper}>
        {children}
    </div>
)

const Progress = ({ children }) => (
    <div className={styles.progress}>
        {children}
    </div>
)

const Circles = ({ activeCard }) => (
    <div
        className={styles.circles}
    >
        {CONTENTS.map((item, index) => (
            <Link
                key={`how_progress_circle-${index}`}
                to={item.id}
                offset={-72}
                smooth={'easeInOutQuart'}
                duration={2000}
            >
                <Circle activeCard={activeCard} item={item} index={index} />
            </Link>
        ))}
    </div>
)

const Circle = ({ activeCard, item, index }) => (
    <motion.div
        className={styles.circle}
        variants={{
            highlight: { scale: 1.35, backgroundColor: 'var(--logo-second-color)', color: 'var(--landing-copyInverse)' }
        }}
        animate={activeCard === index ? 'highlight' : {}}
        whileHover={'highlight'}
    >
        <div className={styles.icon}>
            {item.icon}
        </div>
    </motion.div>
)

const Content = ({ children }) => (
    <div className={styles.content}>
        {children}
    </div>
)

const Titles = ({ sectionScrollProgress }) => (
    <div
        className={styles.titles}
    >
        {CONTENTS.map((item, index) => (
            <Title key={`how_content_title-${index}`} sectionScrollProgress={sectionScrollProgress} item={item} index={index} />
        ))}
    </div>
)

const Title = ({ sectionScrollProgress, item, index, ...props }) => {
    const { input, output } = getTransform()[index];
    const progress = useTransform(sectionScrollProgress, input, output);

    return (
        <motion.svg
            className={styles.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            {...props}
        >
            <mask id={`mask-title-${index}`}>
                <rect width={'100%'} height={'100%'} fill={'var(--logo-second-color)'} />
                <text x={'0%'} y={'70%'}>
                    {item.title}
                </text>
            </mask>

            <motion.rect
                width={progress}
                height={'100%'}
                fill={'var(--logo-second-color)'}
                mask={`url(#mask-title-${index})`}
            />
        </motion.svg>
    )
}

const Cards = () => (
    <div
        className={styles.cards}
    >
        {CONTENTS.map((item, index) => (
            <Card key={`how_cards_card-${index}`} item={item} index={index} />
        ))}
    </div>
)

const Card = ({ item, index, ...props }) => {
    const cardRef = React.useRef(null);
    const { scrollYProgress: cardScrollProgress } = useScroll({
        target: cardRef,
        offset: ["start", "end"],
    })

    return (
        <div
            ref={cardRef}
            className={styles.card}
            style={{
                border: '1px dashed red'
            }}
            {...props}
        >
            <div id={`${item.id}_s`} className={styles.start} style={{ border: '.5px solid purple' }}>
                Content {index} Start
            </div>

            <div id={item.id} className={styles.center} style={{ border: '.5px solid gray' }}>
                Content {index} Center
            </div>

            <div id={`${item.id}_e`} className={styles.end} style={{ border: '.5px solid aqua' }}>
                Content {index} End
            </div>
        </div>
    )
}

// #region Utils

const roundThreeDecimals = (x) => Math.round(x * 1000) / 1000;

const getTransform = () => {
    const input = [];
    const overallStep = (100 / CONTENTS.length) / 100;
    const timeframeStep = overallStep / 3;
    for (let i = 0; i < CONTENTS.length; i++) {
        const itemNumber = i + 1;
        const four = (itemNumber * overallStep);
        const one = i * overallStep;
        const three = (timeframeStep * 2) + one;
        const two = timeframeStep + one;
        const output = itemNumber === 1 ? ['100%', '100%', '0%', '0%'] : itemNumber === CONTENTS.length ? ['0%', '100%', '100%', '100%'] : ['0%', '100%', '100%', '0%'];
        input.push(
            {
                input: [
                    roundThreeDecimals(one),
                    roundThreeDecimals(two),
                    roundThreeDecimals(three),
                    roundThreeDecimals(four)
                ],
                output
            }
        )
    }

    return input;
}

// #endregion

// #region Variables

const CONTENTS = [
    {
        id: 'how_tambah',
        title: 'Tambah Matakuliahmu',
        short: 'Tambah',
        description: 'Tambah matakuliahmu yang sudah ditempuh',
        icon: <TbPlaylistAdd />,
        iconName: 'TbPlaylistAdd',
        iconLib: 'tb',
    },
    {
        id: 'how_rencana',
        title: 'Rencanakan Studimu',
        short: 'Rencanakan',
        description: 'Buat rencana studimu untuk semester yang akan datang dengan perhitungan IPK yang aktual',
        icon: <TbLayoutGridAdd />,
        iconName: 'TbLayoutGridAdd',
        iconLib: 'tb',
    },
    {
        id: 'how_ubah',
        title: 'Ubah Sesukamu',
        short: 'Ubah',
        description: 'Simulasikan perubahan IPK dengan mengubah sks maupun nilai',
        icon: <TbEdit />,
        iconName: 'TbEdit',
        iconLib: 'tb',
    },
    {
        id: 'how_atur',
        title: 'Atur Targetmu',
        short: 'Atur',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.',
        icon: <TbTargetArrow />,
        iconName: 'TbTargetArrow',
        iconLib: 'tb',
    },
    {
        id: 'how_lacak',
        title: 'Lacak Progressmu',
        short: 'Lacak',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.',
        icon: <TbChartInfographic />,
        iconName: 'TbChartInfographic',
        iconLib: 'tb',
    },
]

// #endregion

// #region Types

/** 
 * State indeks card yang sedang aktif atau sedang tampil.
 * - Initial : `null`
 * @typedef {?number} activeCard
*/

/** 
 * React ref object dari root element atau component `Section`
 * @typedef {React.RefObject} sectionRef
*/

/** 
 * Progress scroll section
 * @typedef {MotionValue<number>} sectionScrollProgress
*/

/** 
 * Contents item
 * @typedef {Object} contentsItem
 * @property {string} id 
 * Id yang digunakan berfungsi sebagai attribut `id` pada elemen terkait
 * - Contoh : `'how_tambah'`
 * @property {string} title
 * Judul yang digunakan 
 * - Contoh : `'Tambah Matakuliahmu'`
 * @property {string} short 
 * Judul singkat yang digunakan
 * - Contoh : `'Rencanakan'`
 * @property {string} description 
 * Deskripsi yang digunakan
 * - Contoh : `'Tambah matakuliahmu yang sudah ditempuh'`
 * @property {React.ReactElement} icon 
 * Icon yang digunakan dari `react-icons`
 * - Contoh : `<TbPlaylistAdd />`
 * @property {string} iconName
 * Nama icon yang digunakan dari `react-icons`
 * - Contoh : `'TbPlaylistAdd'`
 * @property {string} iconLib 
 * Library icon yang digunakan dari `react-icons`
 * - Contoh : `'tb'`
*/

// #endregion

export { How }