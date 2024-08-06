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
import LazyWrapper from '@/component/LazyWrapper';
import ReactIconsLoader from '@/component/ReactIconsLoader';
import HighlightText from '@/component/motion/HighlightText';
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/how.module.css';
// #endregion

const How = () => {
    /** @type {sectionRef} */
    const sectionRef = React.useRef(null);
    const { scrollYProgress: sectionScrollProgress } = useScroll({ target: sectionRef });

    return (
        <Section sectionRef={sectionRef}>
            <Wrapper>
                <Progress>
                    <Circles sectionScrollProgress={sectionScrollProgress} />
                    <Lines sectionScrollProgress={sectionScrollProgress} />
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
 * @param {{sectionScrollProgress:sectionScrollProgress} & React.HTMLProps<HTMLDivElement>} props Circles props
 * @returns {React.ReactElement} Rendered component
 */
const Circles = ({ sectionScrollProgress, ...props }) => (
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
                <Circle
                    sectionScrollProgress={sectionScrollProgress}
                    item={item}
                    index={index} />
            </Link>
        ))}
    </div>
)

/**
 * Component Description
 * @param {{sectionScrollProgress:sectionScrollProgress, item:contentsItem, index:number} & HTMLMotionProps<'div'>} props Circle props
 * @returns {React.ReactElement} Rendered component
 */
const Circle = ({ sectionScrollProgress, item, index, ...props }) => {
    const [active, setActive] = React.useState(false);
    const input = getContentsTimeframes()[index];
    const hook = useTransform(sectionScrollProgress, input, [0, 1, 1, 0]);

    React.useEffect(() => {
        hook.on('change', (val) => {
            if (val > 0.75) {
                setActive(true)
            } else {
                setActive(false)
            }
        })

        return () => {
            hook.clearListeners();
        }
    }, []);

    return (
        <motion.div
            className={styles.circle}
            variants={{
                highlight: { scale: 1.35, backgroundColor: 'var(--logo-second-color)', color: 'var(--landing-copyInverse)' }
            }}
            animate={active ? 'highlight' : {}}
            whileHover={'highlight'}
            {...props}
        >
            <LazyWrapper as='div' className={styles.icon}>
                <ReactIconsLoader name={item.iconName} lib={item.iconLib} />
            </LazyWrapper>
        </motion.div>
    )
}

/**
 * Component Description
 * @param {{sectionScrollProgress:sectionScrollProgress} & React.SVGProps<SVGElement>} props Lines props
 * @returns {React.ReactElement} Rendered component
 */
const Lines = ({ sectionScrollProgress, ...props }) => {
    const input = getContentsTimeframes().map(timeframe => timeframe[1]);
    const output = [0, ...input.slice(1, -1), 1];
    const hook = useTransform(sectionScrollProgress, input, output);

    return (
        <svg
            className={styles.lines}
            {...props}
        >
            <motion.line
                x1="50%"
                y1="0%"
                x2="50%"
                y2="100%"
                pathLength={hook}
                stroke={'var(--logo-second-color)'}
                style={{ zIndex: 2 }}
            />

            <motion.line
                x1="50%"
                y1="0%"
                x2="50%"
                y2="100%"
                pathLength={1}
                stroke={'var(--landing-copyInverse)'}
                style={{ zIndex: 1 }}
            />
        </svg>
    )
}

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
    const input = getContentsTimeframes()[index];
    const progress = useTransform(sectionScrollProgress, input, [0, 1, 1, 0]);
    const titleChar = item.title.split('');

    return (
        <motion.div
            className={styles.title}
            {...props}
        >
            {titleChar.map((char, charIndex) => (
                <TitleChar titleLength={titleChar.length} progress={progress} char={char} index={charIndex} key={`how_titles_title_${index}_char-${charIndex}`} />
            ))}

            <Description item={item} progress={progress} />
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
            {char}
        </motion.div>
    )
}

const Description = ({ item, progress }) => {
    const words = item.description.split(' ').map((word, index) => {
        if (word.startsWith('[') && word.endsWith(']')) {
            const cleanWord = word.slice(1, -1);
            return (
                <HighlightText
                    key={index}
                    text={cleanWord}
                    useHook={false}
                    preset={'wavingColor'}
                    adjustWavingColor={{
                        options: {
                            makeVariant: true,
                            variantName: 'test_xxx'
                        }
                    }}
                />
            )
        }
        return <span key={index}>{word}</span>;
    });

    const opacity = useTransform(progress, [0, 1], [0, 1]);
    const x = useTransform(progress, [0, 1], [-200, 0]);

    return (
        <motion.p className={styles.description} whileHover={'test_xxx'}>
            <motion.span className={styles.text} style={{ opacity, x }}>
                {words.map((word, index) => <React.Fragment key={index}>{word} </React.Fragment>)}
            </motion.span>
        </motion.p>
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
        <Intro />

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

const Intro = () => (
    <div
        className={styles.intro}
    >
        <h3
            className={styles.text}
        >
            <HighlightText
                text={INTRO_TEXT}
                preset='wavingTranslate'
                hookOptions={{
                    amount: 1
                }}
                adjustWavingTranslate={{
                    perspective: 250,
                }}
            />
        </h3>
    </div>
)

// #region Utils

/**
 * Method untuk membulatkan angka `x` dengan jumlah digit dibelakang koma `digit`
 * @param {number} x Angka yang ingin dibulatkan
 * @param {number} [digit=3] Jumlah digit dibelakang koma, default : `3`
 * @returns {number} Angka yang sudah dibulatkan
 * @example
 * 
 * ```js
 * console.log(roundDecimals(5.231, 2)) // 5.23
 * console.log(roundDecimals(0.682252, 4)) // 0.6822
 * ```
 * 
 */
const roundDecimals = (x, digit = 3) => {
    const factor = Math.pow(10, digit);
    return Math.round(x * factor) / factor;
};

/**
 * Method untuk menghitung timeframe dari setiap content.
 * ```js
 * const timeframe = [0, 0.067, 0.133, 0.2]; // timeframe content x
 * ```
 * Timeframe didefinisikan sebagai array dengan panjang 4 yang berisikan angka dimana setiap angka `>= 0`, `<= 1 ` dan berurutan dari index terkecil.
 * - Index pertama menuju kedua mendefinisikan kapan transisi content mulai masuk hingga selesai. 
 * - Index kedua menuju ketiga mendefinisikan kapan content aktif. 
 * - Index ketiga menuju keempat mendefinisikan kapan transisi content mulai keluar hingga selesai. 
 * 
 * Semua dihitung secara `otomatis` berdasarkan jumlah `CONTENTS` yang tersedia. 
 * 
 * ```js
 * const CONTENTS = ['Konten 1', 'Konten 2', 'Konten 3'];
 * const timeframes = getContentsTimeframes();
 * console.log(timeframes()[0]) // [a, b, c, d] timeframe konten 1 
 * console.log(timeframes()[1]) // [i, j, k, l] timeframe konten 2 
 * console.log(timeframes()[3]) // [w, x, y, z] timeframe konten 3
 * console.log(timeframes()) // [[a, b, c, d], [i, j, k, l], [w, x, y, z]]
 * ```
 * 
 * Selanjutnya dari output timeframe yang dihasilkan dapat digunakan sebagai input hook `useTransform`
 * pada `framer-motion` untuk menganimasikan suatu element secara sekuensial berdasarkan `MotionValue` tertentu.
 * 
 * Lihat `example` untuk melihat contoh penggunaan method ini
 * 
 * @returns {Array<Array<number>>} Array yang berisikan `timeframe` setiap content yang digunakan
 * @example 
 * ```jsx
 * import * as React from 'react';
 * import { useTransform, useScroll } from 'framer-motion';
 * 
 * const Wrapper = () => {
 *      const wrapperRef = React.useRef(null);
 *      const { scrollYProgress:wrapperProgress} = useScroll({target:wrapperRef});
 * 
 *      return (
 *          <div ref={wrapperRef}>
 *              <TextPadaContentSatu scrolls={wrapperProgress}/>
 *         </div>
 *      )
 * }
 * 
 * const TextPadaContentSatu = ({scrolls}) => {
 *      const contentSatuTimeframe = getContentsTimeframes()[0];
 *      const hook = useTransform(scrolls, contentSatuTimeframe, [0, 1, 1, 0]);
 *      
 *      return (
 *          ...do something with hook
 *      )
 * }
 * ```
 * 
 * Dari contoh diatas kita dapat membuat sebuah animasi dari scroll progress dengan 
 * batasan atau timeframe tertentu berdasarkan scroll dari suatu container. Sehingga setiap component
 * atau element dapat tampil sesuai dengan timeframenya.
 * 
 * Element `TextPadaContentSatu` hanya akan tampil pada timeframe content 1 karna menggunakan timeframe content tersebut.
 * Mudahnya `timeframe` mendefinisikan persentase dari scroll kapan sebuah content harus masuk dan keluar.
 * 
 */
const getContentsTimeframes = () => {
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
                roundDecimals(one),
                roundDecimals(two),
                roundDecimals(three),
                roundDecimals(four)
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
        description: '[Tambah] matakuliahmu yang sudah ditempuh',
        descriptionPlain: 'Tambah matakuliahmu yang sudah ditempuh',
        icon: null,
        iconName: 'TbPlaylistAdd',
        iconLib: 'tb',
    },
    {
        id: 'how_rencana',
        title: 'Rencanakan Studimu',
        short: 'Rencanakan',
        description: 'Buat rencana studimu untuk semester yang akan datang dengan perhitungan IPK yang [aktual]',
        descriptionPlain: 'Buat rencana studimu untuk semester yang akan datang dengan perhitungan IPK yang aktual',
        icon: null,
        iconName: 'TbLayoutGridAdd',
        iconLib: 'tb',
    },
    {
        id: 'how_ubah',
        title: 'Ubah Sesukamu',
        short: 'Ubah',
        description: 'Simulasikan perubahan IPK dengan [mengubah] sks maupun nilai',
        descriptionPlain: 'Simulasikan perubahan IPK dengan mengubah sks maupun nilai',
        icon: null,
        iconName: 'TbEdit',
        iconLib: 'tb',
    },
    {
        id: 'how_atur',
        title: 'Atur Targetmu',
        short: 'Atur',
        description: 'Lorem ipsum, dolor sit amet [consectetur] adipisicing elit. Incidunt, vel.',
        descriptionPlain: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.',
        icon: null,
        iconName: 'TbTargetArrow',
        iconLib: 'tb',
    },
    {
        id: 'how_lacak',
        title: 'Lacak Progressmu',
        short: 'Lacak',
        description: 'Lorem ipsum, dolor sit amet consectetur [adipisicing] elit. Incidunt, vel.',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, vel.',
        icon: null,
        iconName: 'TbChartInfographic',
        iconLib: 'tb',
    },
]

const INTRO_TEXT = 'Cara Pakai SIPK';
// #endregion

// #region Types

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
 * Deskripsi yang digunakan. Dapat menggunakan prefix `[` dan postfix `]` untuk menghighlight suatu kata
 * ```js
 * // Highlight digunakan untuk conditional rendering tertentu
 * const contoh = '[Tambah] matakuliahmu yang sudah [ditempuh]'
 * ```
 * @property {string} descriptionPlain
 * Deskripsi yang digunakan tanpa prefix atau postfix apapun
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

export { How, CONTENTS }