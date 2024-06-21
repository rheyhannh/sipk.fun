// #region REACT DEPEDENCY
import { useState, useEffect, useRef } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useAnimation, useTransform, useMotionValue, useSpring, useVelocity } from "framer-motion";
import FoldingIcons from '@/component/motion/FoldingIcons';
import AnimatedTextBox from '@/component/motion/TextBox';
// #endregion

// #region UTIL DEPEDENCY
import { getCommonAnimationVariants } from '@/component/motion/_helper';
// #endregion

// #region ICON DEPEDENCY
import { AiOutlineDelete, AiOutlinePlus, AiOutlineLike, AiOutlineMinus } from "react-icons/ai";
import { CiTrash } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/feature.module.css';

// #endregion

const TambahHapus = () => {
    const descriptionArray = ["Kamu", "bebas", "tambah", "dan", "hapus", "matakuliah", "kamu", "secara", "dinamis.", "Gausah", "binggung", "IPK", "kamu", "jadi", "berapa,", "biar", "SIPK", "yang", "hitungin", "itu", "semua", "buat kamu."];
    const [foldingCurrentIndex, setFoldingCurrentIndex] = useState(null);

    return (
        <Wrapper>
            <Layout foldingCurrentIndex={foldingCurrentIndex}>
                <Highlight>
                    <Box>
                        <AnimatedTextBox
                            text='Tambah Matakuliah'
                            enterAnimation='custom'
                            customEnterAnimation={{
                                hide: { opacity: 0, rotateY: -25, rotateX: -75, scale: 0.75 },
                                introCardBox_show: { opacity: 1, rotateY: 0, rotateX: 0, scale: 1, transition: { type: 'spring', damping: 9, stiffness: 100 } },
                                introCardBox_tambah_unhighlight: { opacity: 1, y: 0, x: 0, scale: 1, zIndex: 6, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } },
                                introCardBox_tambah_highlight: { scale: 1.15, zIndex: 10, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } }
                            }}
                            otherProps={{
                                className: `${styles.text_box} ${styles.tambah}`
                            }}
                        />

                        <AnimatedTextBox
                            text='Hapus Matakuliah'
                            enterAnimation='custom'
                            customEnterAnimation={{
                                hide: { opacity: 0, y: (-75 / 2), x: (-75 / 2), scale: 0.25 },
                                introCardBox_show: { opacity: 1, y: 0, x: 0, scale: 1, transition: { type: 'spring', damping: 8, stiffness: 100 } },
                                introCardBox_hapus_unhighlight: { opacity: 1, y: 0, x: 0, scale: 1, zIndex: 5, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } },
                                introCardBox_hapus_highlight: { scale: 1.15, zIndex: 10, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } }
                            }}
                            otherProps={{
                                className: `${styles.text_box} ${styles.hapus}`
                            }}
                        />

                        <AnimatedTextBox
                            text='Apapun Sesukamu'
                            enterAnimation='custom'
                            customEnterAnimation={{
                                hide: { opacity: 0, y: (-75 / 3), x: (-75 / 3), scale: 0.5 },
                                introCardBox_show: { opacity: 1, y: 0, x: 0, scale: 1, transition: { type: 'spring', damping: 7, stiffness: 100 } },
                                introCardBox_apapun_unhighlight: { opacity: 1, y: 0, x: 0, scale: 1, zIndex: 4, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } },
                                introCardBox_apapun_highlight: { scale: 1.15, zIndex: 10, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } }
                            }}
                            otherProps={{
                                className: `${styles.text_box} ${styles.apapun}`
                            }}
                        />

                        <AnimatedFoldingIcons setFoldingCurrentIndex={setFoldingCurrentIndex} />
                    </Box>

                    <Description>
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
                    </Description>
                </Highlight>

                <Demo />
            </Layout>
        </Wrapper >
    )
}

const Wrapper = ({ children }) => (
    <div
        className={styles.card}
        style={{
            border: '2.5px solid pink',
        }}
    >
        {children}
    </div>
)

const Layout = ({ children, foldingCurrentIndex }) => {
    const animControls = useAnimation();

    useEffect(() => {
        if (foldingCurrentIndex === 0) {
            animControls.start('introCardBox_apapun_unhighlight');
            animControls.start('introCardBox_tambah_highlight');
        } else if (foldingCurrentIndex === 1) {
            animControls.start('introCardBox_tambah_unhighlight');
            animControls.start('introCardBox_hapus_highlight');
        } else if (foldingCurrentIndex === 2) {
            animControls.start('introCardBox_hapus_unhighlight');
            animControls.start('introCardBox_apapun_highlight');
        }
    }, [foldingCurrentIndex])

    return (
        <motion.div
            className={styles.tambah_hapus}
            style={{
                border: '2px solid red',
            }}
            initial={'hide'}
            animate={animControls}
            whileInView={[
                'gridContainer_scroll',
                'introCardBox_show',
                'introCardDescription_show'
            ]}
            transition={{
                delayChildren: 0.5,
                staggerChildren: 0.2
            }}
            onAnimationComplete={
                definition => {
                }
            }
        >
            {children}
        </motion.div>
    )
}

const Highlight = ({ children }) => (
    <motion.div
        className={styles.highlight}
        style={{
            border: '1px solid yellow'
        }}
    >
        {children}
    </motion.div>
)

const Box = ({ children }) => (
    <div
        className={styles.box}
        style={{
            border: '.5px solid purple'
        }}
    >
        {children}
    </div>
)

const AnimatedFoldingIcons = ({ setFoldingCurrentIndex }) => {
    const [animateState, setAnimateState] = useState(false);

    return (
        <motion.div
            className={styles.folding}
            variants={{
                hide: { opacity: 0, scale: 1.5, rotateX: -75, rotateY: -25, top: '50%', left: '90%', translateX: '-90%', translateY: '-50%' },
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
                    type: 'repeat',
                    onStart: (nextContentIndex) => {
                        setFoldingCurrentIndex(nextContentIndex);
                    },
                }}
                repeatOptions={{
                    interval: 5,
                    delay: 10,
                }}
            />
        </motion.div>
    )
}

const Description = ({ children }) => (
    <motion.div
        className={styles.description}
        style={{
            overflow: 'hidden',
            zIndex: 7,
            border: '1px grey solid'
        }}
    >
        {children}
    </motion.div>
)

const Demo = () => {
    const demoRef = useRef(null);

    return (
        <div
            ref={demoRef}
            className={styles.demo}
            style={{
                border: '1px solid green',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '4rem',
                    left: '2rem',
                    width: 'calc(100% - (2 * 2rem))',
                    height: 'calc(100% - (2 * 4rem))',
                    border: '1px solid red',
                    overflow: 'hidden',
                    zIndex: -1,
                }}
            />

            <GridContainer
                demoRef={demoRef}
                matkuls={MATKULDUMMIES}
            />

        </div>
    )
}

const GridContainer = ({ demoRef, matkuls }) => {
    const gridRef = useRef(null);
    const [gridScroll, setGridScroll] = useState(0);
    const [gridBoundingClientRect, setGridBoundingClientRect] = useState(null);
    const scrollSpeed = matkuls.length * 2;

    useEffect(() => {
        const updateBoundingClientRect = () => {
            if (gridRef.current) {
                setGridBoundingClientRect(gridRef.current.getBoundingClientRect());
            }
        };

        updateBoundingClientRect();

        window.addEventListener('resize', updateBoundingClientRect);

        return () => window.removeEventListener('resize', updateBoundingClientRect);
    }, []);

    return (
        <motion.div
            ref={gridRef}
            className={styles.grid_container}
            style={{
                y: (demoRef.current ? (demoRef.current.getBoundingClientRect().height - parseFloat(getComputedStyle(demoRef.current).paddingTop) - parseFloat(getComputedStyle(demoRef.current).paddingBottom)) : 0)
            }}
            variants={{
                gridContainer_scroll: {
                    y: (gridBoundingClientRect ? (gridBoundingClientRect.height * -1) : -5000),
                },
            }}
            transition={{
                duration: scrollSpeed, ease: 'linear', repeat: Infinity, repeatType: 'reverse'
            }}
            onUpdate={(latest) => setGridScroll(latest.y)}
        >
            {matkuls.map((item, index) => (
                <Matkul
                    item={item}
                    index={index}
                    demoRef={demoRef}
                    gridScroll={gridScroll}
                    key={`tambahHapus_Matkul_${index}`}
                />
            ))}
        </motion.div>
    )
}

const Matkul = ({ item, index, demoRef, gridScroll, ...props }) => {
    const matkulRef = useRef(null);
    const matkulInDemo = useMotionValue(0);
    const [timingArray, setTimingArray] = useState([0, 1, 1, 0]);
    const opacity = useTransform(matkulInDemo, timingArray, [0, 1, 1, 0]);
    const scale = useTransform(matkulInDemo, timingArray, [0.75, 1, 1, 0.75]);

    useEffect(() => {
        const updateTimingArray = () => {
            if (demoRef.current) {
                const demoPadding = { top: parseFloat(getComputedStyle(demoRef.current).paddingTop), bottom: parseFloat(getComputedStyle(demoRef.current).paddingBottom) };
                const demoHeight = demoRef.current.getBoundingClientRect().height - demoPadding.top - demoPadding.bottom;
                setTimingArray([demoHeight - (demoPadding.bottom / 2), demoHeight - (demoPadding.bottom + (demoPadding.bottom / 2)), 0, demoPadding.top * -1]);
            }
        }

        updateTimingArray();

        window.addEventListener('resize', updateTimingArray);

        return () => window.removeEventListener('resize', updateTimingArray);
    }, [])

    useEffect(() => {
        const demoRect = demoRef.current.getBoundingClientRect();
        const demoPaddingTop = parseFloat(getComputedStyle(demoRef.current).paddingTop);
        const matkulRect = matkulRef.current.getBoundingClientRect();
        const cardTopInDemo = matkulRect.top - demoRect.top - demoPaddingTop;
        matkulInDemo.set(cardTopInDemo);

        // if (index === 0) {
        //     console.log(`cardTopInDemo: ${cardTopInDemo}, opacity: ${opacity.get()}`);
        //     matkulInDemo.set(cardTopInDemo);
        // }
    }, [gridScroll])

    return (
        <motion.div
            ref={matkulRef}
            style={{
                height: '80px',
                background: 'var(--landing-foreground)',
                padding: '1.4rem 1.8rem',
                border: '1px solid var(--landing-border)',
                borderRadius: '1.2rem',
                opacity,
                scale,
            }}
            {...props}
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '40px auto 40px',
                    gridGap: '1rem',
                    gap: '1rem',
                    color: 'var(--landing-copyLighter)',
                    fontWeight: '500',
                }}

            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '40px',
                        height: '40px',
                        padding: '.6rem',
                        color: 'var(--landing-copyInverse)',
                        borderRadius: '50%',
                        background: item.type === 'hapus' ? 'var(--danger-color)' : 'var(--primary-color)'
                    }}
                >
                    {item.type === 'hapus' ? <CiTrash size={'24px'} /> : <IoAddOutline size={'24px'} />}
                </div>

                <div
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        margin: 'auto 0'
                    }}
                >
                    <span
                        style={{
                            textTransform: 'capitalize',
                        }}
                    >
                        {item.nama}
                    </span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignSelf: 'center',
                        textAlign: 'center',
                    }}
                >
                    <span>{item.nilai}</span>
                    <span>{item.sks} SKS</span>
                </div>
            </div>
        </motion.div>
    )
}

const MATKULDUMMIESTEST = [
    {
        "type": "hapus",
        "nama": "incididunt aute",
        "date": "Fri May 07 2021 08:27:35 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 2
    },
    {
        "type": "hapus",
        "nama": "nisi in",
        "date": "Sun May 25 2014 22:21:03 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 1
    },
    {
        "type": "tambah",
        "nama": "aute laborum",
        "date": "Wed Nov 01 2023 12:15:47 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
]

const MATKULDUMMIES = [
    {
        "type": "hapus",
        "nama": "incididunt aute",
        "date": "Fri May 07 2021 08:27:35 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 2
    },
    {
        "type": "hapus",
        "nama": "nisi in",
        "date": "Sun May 25 2014 22:21:03 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 1
    },
    {
        "type": "tambah",
        "nama": "aute laborum",
        "date": "Wed Nov 01 2023 12:15:47 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "type": "hapus",
        "nama": "velit magna",
        "date": "Sun Oct 26 2014 00:25:09 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 2
    },
    {
        "type": "tambah",
        "nama": "enim commodo",
        "date": "Fri Dec 03 2021 12:32:13 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 4
    },
    {
        "type": "tambah",
        "nama": "magna consectetur",
        "date": "Fri Nov 19 2021 04:35:27 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 1
    },
    {
        "type": "tambah",
        "nama": "dolor eu",
        "date": "Sun Sep 20 2020 20:10:33 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 2
    },
    {
        "type": "tambah",
        "nama": "fugiat esse",
        "date": "Fri Mar 15 2024 03:25:27 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 3
    },
    {
        "type": "hapus",
        "nama": "culpa ex",
        "date": "Mon Feb 01 2021 23:41:59 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 2
    },
    {
        "type": "hapus",
        "nama": "ex nisi",
        "date": "Thu Mar 26 2020 19:22:50 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4
    },
    {
        "type": "tambah",
        "nama": "in qui",
        "date": "Wed Feb 01 2023 07:21:18 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 3
    },
    {
        "type": "tambah",
        "nama": "aute id",
        "date": "Sun Nov 27 2022 20:09:25 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 1
    },
    {
        "type": "tambah",
        "nama": "ut enim",
        "date": "Wed Mar 03 2021 18:29:26 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 4
    },
    {
        "type": "hapus",
        "nama": "dolor fugiat",
        "date": "Thu Jan 22 2015 14:04:51 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 3
    },
    {
        "type": "tambah",
        "nama": "voluptate exercitation",
        "date": "Sat Sep 27 2014 17:38:50 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 1
    },
    {
        "type": "hapus",
        "nama": "dolor eu",
        "date": "Fri Feb 03 2017 17:56:22 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 1
    },
    {
        "type": "tambah",
        "nama": "do qui",
        "date": "Fri Sep 06 2019 00:42:16 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 3
    },
    {
        "type": "tambah",
        "nama": "proident tempor",
        "date": "Fri Jan 19 2024 14:37:33 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 3
    },
    {
        "type": "hapus",
        "nama": "eiusmod laborum",
        "date": "Sat Apr 02 2022 23:22:28 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 1
    },
    {
        "type": "tambah",
        "nama": "ut sunt",
        "date": "Sat Apr 18 2015 11:30:35 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "type": "tambah",
        "nama": "enim anim",
        "date": "Wed Oct 05 2022 11:07:37 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 2
    },
    {
        "type": "hapus",
        "nama": "esse reprehenderit",
        "date": "Tue Jan 02 2024 14:31:24 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "type": "hapus",
        "nama": "est est",
        "date": "Mon Dec 31 2018 12:19:34 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 1
    },
    {
        "type": "tambah",
        "nama": "labore labore",
        "date": "Fri Mar 06 2020 13:59:09 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 2
    },
    {
        "type": "hapus",
        "nama": "veniam elit",
        "date": "Mon Oct 24 2022 10:03:06 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4
    },
    {
        "type": "tambah",
        "nama": "excepteur mollit",
        "date": "Mon Aug 28 2023 12:56:17 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 4
    },
    {
        "type": "tambah",
        "nama": "minim dolore",
        "date": "Sat Jul 28 2018 04:13:49 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 2
    },
    {
        "type": "hapus",
        "nama": "do duis",
        "date": "Tue Oct 16 2018 11:47:51 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 3
    },
    {
        "type": "tambah",
        "nama": "exercitation laboris",
        "date": "Mon Jun 15 2015 16:14:36 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 4
    },
    {
        "type": "hapus",
        "nama": "ea veniam",
        "date": "Tue Jan 21 2014 09:48:39 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 2
    },
    {
        "type": "tambah",
        "nama": "est irure",
        "date": "Thu Sep 01 2022 11:54:35 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 1
    },
    {
        "type": "tambah",
        "nama": "laboris id",
        "date": "Mon Oct 09 2017 11:23:07 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 1
    },
    {
        "type": "hapus",
        "nama": "qui laboris",
        "date": "Tue Dec 06 2022 05:04:41 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 4
    },
    {
        "type": "tambah",
        "nama": "ea reprehenderit",
        "date": "Mon Dec 19 2016 23:10:01 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 2
    },
    {
        "type": "tambah",
        "nama": "reprehenderit aliquip",
        "date": "Sun Jun 12 2016 22:40:41 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 2
    },
    {
        "type": "hapus",
        "nama": "mollit labore",
        "date": "Sun Sep 23 2018 19:12:36 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 1
    },
    {
        "type": "tambah",
        "nama": "qui qui",
        "date": "Fri Jul 21 2023 03:43:50 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 3
    },
    {
        "type": "hapus",
        "nama": "velit nisi",
        "date": "Thu Apr 07 2016 07:42:09 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 4
    },
    {
        "type": "tambah",
        "nama": "qui et",
        "date": "Mon Mar 11 2019 21:04:34 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4
    },
    {
        "type": "hapus",
        "nama": "velit labore",
        "date": "Sun May 16 2021 10:07:01 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 3
    },
    {
        "type": "hapus",
        "nama": "sint est",
        "date": "Fri Feb 10 2017 15:56:20 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 4
    },
    {
        "type": "tambah",
        "nama": "fugiat anim",
        "date": "Sun Dec 26 2021 17:34:09 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 3
    },
    {
        "type": "hapus",
        "nama": "enim nisi",
        "date": "Fri Mar 24 2017 02:03:06 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "type": "tambah",
        "nama": "dolore occaecat",
        "date": "Tue Oct 22 2019 12:50:32 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 3
    },
    {
        "type": "tambah",
        "nama": "commodo ullamco",
        "date": "Thu Aug 03 2017 04:32:57 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4
    },
    {
        "type": "hapus",
        "nama": "irure labore",
        "date": "Tue Jun 13 2017 12:53:54 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 1
    },
    {
        "type": "hapus",
        "nama": "adipisicing labore",
        "date": "Wed Sep 06 2023 01:59:31 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 2
    },
    {
        "type": "hapus",
        "nama": "cupidatat eu",
        "date": "Tue Oct 16 2018 18:32:41 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 2
    },
    {
        "type": "hapus",
        "nama": "aute ad",
        "date": "Tue Nov 10 2015 03:35:00 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 2
    },
    {
        "type": "hapus",
        "nama": "do amet",
        "date": "Mon Jul 31 2023 07:36:28 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 1
    }
]

export default TambahHapus;