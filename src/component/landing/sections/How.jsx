'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js';
import { HTMLMotionProps, SVGMotionProps } from 'framer-motion';
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
    /** @type {ReturnType<typeof React.useState<activeCard>} */
    const [activeCard, setActiveCard] = React.useState(null);
    /** @type {sectionRef} */
    const sectionRef = React.useRef(null);
    const { scrollYProgress: sectionScrollProgress } = useScroll({ target: sectionRef });

    return (
        <Section sectionRef={sectionRef}>
            <Wrapper>
                <Progress>
                    <Circles sectionScrollProgress={sectionScrollProgress} activeCard={activeCard} />
                </Progress>

                <Content>
                    <Titles sectionScrollProgress={sectionScrollProgress} />
                </Content>
            </Wrapper>

            <Cards />
        </Section>
    )
}

/**
 * Component Description
 * @param {{sectionRef:sectionRef} & React.HTMLProps<HTMLElement>} props Section props
 * @returns {React.ReactElement} Rendered component
 */
const Section = ({ sectionRef, children, ...props }) => (
    <section
        ref={sectionRef}
        id={'how'}
        className={styles.section}
        style={{ '--card-count': CONTENTS.length }}
        {...props}
    >
        {children}
    </section>
)

/**
 * Component Description
 * @param {React.HTMLProps<HTMLDivElement>} props Wrapper props
 * @returns {React.ReactElement} Rendered component
 */
const Wrapper = ({ children, ...props }) => (
    <div className={styles.wrapper} {...props}>
        {children}
    </div>
)

/**
 * Component Description
 * @param {React.HTMLProps<HTMLDivElement>} props Progress props
 * @returns {React.ReactElement} Rendered component
 */
const Progress = ({ children, ...props }) => (
    <div className={styles.progress} {...props}>
        {children}
    </div>
)

/**
 * Component Description
 * @param {{activeCard:activeCard} & React.HTMLProps<HTMLDivElement>} props Circles props
 * @returns {React.ReactElement} Rendered component
 */
const Circles = ({ sectionScrollProgress, activeCard, ...props }) => (
    <div
        className={styles.circles}
        {...props}
    >
        {CONTENTS.map((item, index) => (
            <Link
                key={`how_progress_circle-${index}`}
                to={item.id}
                offset={-72}
                smooth={'easeInOutQuart'}
                duration={2000}
            >
                <Circle sectionScrollProgress={sectionScrollProgress} activeCard={activeCard} item={item} index={index} />
            </Link>
        ))}
    </div>
)

/**
 * Component Description
 * @param {{activeCard:activeCard, item:contentsItem, index:number} & HTMLMotionProps<'div'>} props Circle props
 * @returns {React.ReactElement} Rendered component
 */
const Circle = ({ sectionScrollProgress, activeCard, item, index, ...props }) => (
    <motion.div
        className={styles.circle}
        variants={{
            highlight: { scale: 1.35, backgroundColor: 'var(--logo-second-color)', color: 'var(--landing-copyInverse)' }
        }}
        animate={activeCard === index ? 'highlight' : {}}
        whileHover={'highlight'}
        {...props}
    >
        <div className={styles.icon}>
            {item.icon}
        </div>
    </motion.div>
)

/**
 * Component Description
 * @param {React.HTMLProps<HTMLDivElement>} props Content props
 * @returns {React.ReactElement} Rendered component
 */
const Content = ({ children, ...props }) => (
    <div className={styles.content} {...props}>
        {children}
    </div>
)

/**
 * Component Description
 * @param {{sectionScrollProgress:sectionScrollProgress} & React.HTMLProps<HTMLDivElement>} props Titles props
 * @returns {React.ReactElement} Rendered component
 */
const Titles = ({ sectionScrollProgress, ...props }) => (
    <div
        className={styles.titles}
        {...props}
    >
        {CONTENTS.map((item, index) => (
            <Title key={`how_content_title-${index}`} sectionScrollProgress={sectionScrollProgress} item={item} index={index} />
        ))}
    </div>
)

/**
 * Component Description
 * @param {{sectionScrollProgress:sectionScrollProgress,item:contentsItem, index:number} & SVGMotionProps} props Title props
 * @returns {React.ReactElement} Rendered component
 */
const Title = ({ sectionScrollProgress, item, index, ...props }) => {
    const input = getTitleTransformArray()[index];
    const progress = useTransform(sectionScrollProgress, input, [0, 1, 1, 0]);
    const titleChar = item.title.split('');

    return (
        <motion.div
            className={styles.title}
            onClick={() => console.log(titleChar)}
            {...props}
        >
            {titleChar.map((char, charIndex) => (
                <TitleChar titleLength={titleChar.length} progress={progress} char={char} index={charIndex} key={`how_titles_title_${index}_char-${charIndex}`} />
            ))}
        </motion.div>
    )
}

/**
 * Component Description
 * @param {{titleLength:number, progress:MotionValue<number>, char:string, index:number} & HTMLMotionProps<'div'>} props TitleChar props
 * @returns {React.ReactElement} Rendered component
 */
const TitleChar = ({ titleLength, progress, char, index, ...props }) => {
    const scaleStart = 4 / (index + 1);
    const marginRightStart = 50 / (index + 1);
    const opacityTfStart = (1 / titleLength) * index;
    const scale = useTransform(progress, [0, 1], [scaleStart, 1]);
    const marginRight = useTransform(progress, [0, 1], [marginRightStart, 2.5]);
    const opacity = useTransform(progress, [opacityTfStart, 1], [0, 1]);

    const Spaces = () => (
        <div className={styles.space} />
    )

    return char === ' ' ? <Spaces /> : (
        <motion.div style={{ opacity, scale, marginRight }} {...props}>
            {char === ' ' ? 'MEMEQ' : char}
        </motion.div>
    )
}

/**
 * Component Description
 * @param {React.HTMLProps<HTMLDivElement>} props Cards props
 * @returns {React.ReactElement} Rendered component
 */
const Cards = ({ ...props }) => (
    <div
        className={styles.cards}
        {...props}
    >
        {CONTENTS.map((item, index) => (
            <Card key={`how_cards_card-${index}`} item={item} index={index} />
        ))}
    </div>
)

/**
 * Component Description
 * @param {{item:contentsItem, index:number} & React.HTMLProps<HTMLDivElement>} props Card props
 * @returns {React.ReactElement} Rendered component
 */
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

const getTitleTransformArray = () => {
    const input = [];
    const overallStep = (100 / CONTENTS.length) / 100;
    const timeframeStep = overallStep / 3;
    for (let i = 0; i < CONTENTS.length; i++) {
        const itemNumber = i + 1;
        const four = (itemNumber * overallStep);
        const one = i * overallStep;
        const three = (timeframeStep * 2) + one;
        const two = timeframeStep + one;
        input.push(
            [
                roundThreeDecimals(one),
                roundThreeDecimals(two),
                roundThreeDecimals(three),
                roundThreeDecimals(four)
            ],
        )
    }

    return input;
}

// #endregion

// #region Variables

/** @type {Array<contentsItem>} */
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
 * @typedef {React.RefObject<HTMLDivElement>} sectionRef
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