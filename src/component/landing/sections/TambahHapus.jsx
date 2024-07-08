'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js'
// #endregion

// #region REACT DEPEDENCY
import { useState, useContext, useEffect, useRef } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { motion, useAnimation, useTransform, useMotionValue, useSpring, useVelocity, AnimatePresence, LayoutGroup } from "framer-motion";
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
import mainStyles from '../style/main.module.css';
import tambahHapusStyles from '../style/tambah_hapus.module.css';
// #endregion

const TambahHapus = () => {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist } = useContext(LandingContext);

    const descriptionArray = DESCRIPTIONTEXT.split(' ');
    const [foldingCurrentIndex, setFoldingCurrentIndex] = useState(null);

    return (
        <Section>
            <Container>
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
                                    className: `${tambahHapusStyles.text_box} ${tambahHapusStyles.tambah}`
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
                                    className: `${tambahHapusStyles.text_box} ${tambahHapusStyles.hapus}`
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
                                    className: `${tambahHapusStyles.text_box} ${tambahHapusStyles.apapun}`
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

                    <Demo>
                        <MatkulGrid foldingCurrentIndex={foldingCurrentIndex}/>
                    </Demo>
                </Layout>
            </Container>
        </Section>
    )
}

// #region Main Components

const Section = ({ children }) => {
    return (
        <section
            id='tambah_hapus'
            className={`${mainStyles.section} ${mainStyles.tambah_hapus}`}
        >
            {children}
        </section>
    )
}

const Container = ({ children }) => {
    return (
        <div
            className={tambahHapusStyles.container}
        >
            {children}
        </div>
    )
}

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
            className={tambahHapusStyles.layout}
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

// #endregion

// #region Highlight Components

const Highlight = ({ children }) => (
    <motion.div
        className={tambahHapusStyles.highlight}
    >
        {children}
    </motion.div>
)

const Box = ({ children }) => (
    <div
        className={tambahHapusStyles.box}
    >
        {children}
    </div>
)

const AnimatedFoldingIcons = ({ setFoldingCurrentIndex, interval = 10, onlyPlayInView = true }) => {
    const [animateState, setAnimateState] = useState(false);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        let intervalId;

        if (!onlyPlayInView || inView) {
            intervalId = setInterval(() => {
                setAnimateState(true);
            }, interval * 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [interval, onlyPlayInView, inView]);

    return (
        <motion.div
            className={tambahHapusStyles.folding}
            variants={{
                hide: { opacity: 0, scale: 1.5, rotateX: -75, rotateY: -25, top: '50%', left: '90%', translateX: '-90%', translateY: '-50%' },
                introCardBox_show: { opacity: 1, scale: 1, rotateX: 0, rotateY: 0, transition: { type: 'spring', damping: 10, stiffness: 50 } }
            }}
            onViewportEnter={() => { setInView(true); }}
            onViewportLeave={() => { setInView(false); }}
        >
            <FoldingIcons
                contents={[
                    { icon: <AiOutlinePlus style={{ display: 'block', verticalAlign: 'middle' }} />, color: 'var(--landing-copyInverse)', backgroundColor: 'var(--primary-color)' },
                    { icon: <AiOutlineDelete style={{ display: 'block', verticalAlign: 'middle' }} />, color: 'var(--landing-copyInverse)', backgroundColor: 'var(--danger-color)' },
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
                    onStart: (nextContentIndex) => {
                        setFoldingCurrentIndex(nextContentIndex);
                    },
                }}
                stateChangesOptions={{
                    useParentState: true,
                    parentStateValue: animateState,
                    parentStateSetter: setAnimateState,
                    autoUpdateParentState: true,
                }}
            />
        </motion.div>
    )
}

const Description = ({ children }) => (
    <motion.div
        className={tambahHapusStyles.description}
        style={{
            overflow: 'hidden',
            zIndex: 7,
        }}
    >
        {children}
    </motion.div>
)

// #endregion

// #region Demo Components

const Demo = ({ children }) => (
    <div
        className={tambahHapusStyles.demo}
    >
        {children}
    </div>
)

const MatkulGrid = ({ foldingCurrentIndex }) => {
    const [matkuls, setMatkuls] = useState(MATKULDUMMIESINITIAL);
    const [maximumMatkul, setMaximumMatkul] = useState(3);
    const [minimumMatkul, setMinimumMatkul] = useState(1);

    const addMatkul = () => {
        if (matkuls.length >= maximumMatkul) return;

        const maxAddable = maximumMatkul - matkuls.length;
        const numToAdd = Math.floor(Math.random() * (maxAddable - 1 + 1)) + 1;

        const availableMatkuls = MATKULDUMMIES.filter(dummy =>
            !matkuls.some(matkul => matkul.id === dummy.id)
        );

        if (availableMatkuls.length === 0) return;

        const newEntries = [];
        for (let i = 0; i < numToAdd && availableMatkuls.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableMatkuls.length);
            newEntries.push(availableMatkuls.splice(randomIndex, 1)[0]);
        }

        const updatedMatkuls = [...matkuls];
        newEntries.forEach(newMatkul => {
            const placeAt = Math.floor(Math.random() * (updatedMatkuls.length + 1));
            updatedMatkuls.splice(placeAt, 0, newMatkul);
        });

        setMatkuls(updatedMatkuls);
    }

    const removeMatkul = () => {
        if (matkuls.length <= minimumMatkul) return;

        const maxRemove = matkuls.length - minimumMatkul;
        const countRemove = Math.floor(Math.random() * (maxRemove - 1 + 1)) + 1;

        const indexToRemove = new Set();
        while (indexToRemove.size < countRemove) {
            const randomIndex = Math.floor(Math.random() * matkuls.length);
            indexToRemove.add(randomIndex);
        }

        const updatedMatkuls = matkuls.filter((_, index) => !indexToRemove.has(index));

        setMatkuls(updatedMatkuls);
    }

    const shuffleMatkul = () => {
        if (matkuls.length < 2) return;

        const shuffledMatkuls = [...matkuls];
        for (let i = shuffledMatkuls.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledMatkuls[i], shuffledMatkuls[j]] = [shuffledMatkuls[j], shuffledMatkuls[i]];
        }
        setMatkuls(shuffledMatkuls);
    }

    useEffect(() => {
        const adjustMatkulSize = () => {
            const width = window.innerWidth;

            if (width >= 1414) {
                setMaximumMatkul(12);
                setMinimumMatkul(3);
            } else if (width >= 1150) {
                setMaximumMatkul(8);
                setMinimumMatkul(2);
            } else if (width >= 1024) {
                setMaximumMatkul(4);
                setMinimumMatkul(1);
            } else {
                return
            }
        }

        adjustMatkulSize();

        window.addEventListener('resize', adjustMatkulSize);

        return () => {
            window.removeEventListener('resize', adjustMatkulSize);
        }
    }, [])

    useEffect(() => {
        if (foldingCurrentIndex === 0) {
            addMatkul();
        } else if (foldingCurrentIndex === 1) {
            removeMatkul();
        } else if (foldingCurrentIndex === 2) {
            shuffleMatkul();
        }
    }, [foldingCurrentIndex])

    return (
        <div
            className={tambahHapusStyles.matkul_grid}
        >
            <AnimatePresence>
                {matkuls.map((item) => (
                    <MatkulCard key={`matkulDemo-${item.id}`} item={item} foldingCurrentIndex={foldingCurrentIndex} />
                ))}
            </AnimatePresence>
        </div>
    )
}

const MatkulCard = ({ item, foldingCurrentIndex, ...props }) => (
    <motion.div
        className={tambahHapusStyles.matkul_card}
        initial={{ scale: 0 }}
        animate={{
            scale: 1,
        }}
        exit={{
            opacity: 0,
            transition: { duration: 2 }
        }}
        layout
        {...props}
    >
        <div className={tambahHapusStyles.matkul_card_layout}>
            <motion.div
                className={tambahHapusStyles.matkul_card_icon}
                animate={{
                    backgroundColor: foldingCurrentIndex === 2 ? '#ffd274' : 'var(--primary-color)'
                }}
            >
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        display: 'inherit',
                        justifyContent: 'inherit',
                        alignItems: 'inherit',
                        transform: 'translate(-50%,-50%)',
                        backgroundColor: 'var(--danger-color)',
                    }}
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 1 }}
                >
                    <CiTrash />
                </motion.div>

                {foldingCurrentIndex === 2 ? <AiOutlineLike /> : <IoAddOutline />}
            </motion.div>

            <div className={tambahHapusStyles.matkul_card_name}>
                {item.nama}
            </div>

            <div className={tambahHapusStyles.matkul_card_details}>
                <span>{item.nilai}</span>
                <span>{item.sks} SKS</span>
            </div>
        </div>
    </motion.div>
)

// #endregion

// #region Variables

const MATKULDUMMIESINITIAL = [
    {
        "id": "a86bfd11-9f8c-40f1-9f57-511f7a3daa6d",
        "type": "hapus",
        "nama": "Bahasa Indonesia",
        "date": "Sun Jul 14 2019 12:38:47 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 1
    },
    {
        "id": "d0c4e17b-90c4-4fdb-b02b-0a81a7ecfda8",
        "type": "tambah",
        "nama": "Statistika",
        "date": "Fri Mar 17 2017 09:26:03 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "id": "565982b2-8860-4b29-80b9-d651e3fed85d",
        "type": "tambah",
        "nama": "Kalkulus",
        "date": "Thu Apr 04 2024 17:09:18 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 4
    },
]

const MATKULDUMMIESTEST = [
    {
        "id": "a86bfd11-9f8c-40f1-9f57-511f7a3daa6d",
        "type": "hapus",
        "nama": "Bahasa Indonesia",
        "date": "Sun Jul 14 2019 12:38:47 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 1
    },
    {
        "id": "d0c4e17b-90c4-4fdb-b02b-0a81a7ecfda8",
        "type": "tambah",
        "nama": "Statistika",
        "date": "Fri Mar 17 2017 09:26:03 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "id": "565982b2-8860-4b29-80b9-d651e3fed85d",
        "type": "tambah",
        "nama": "Kalkulus",
        "date": "Thu Apr 04 2024 17:09:18 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 4
    },
]

const MATKULDUMMIES = [
    {
        "id": "a86bfd11-9f8c-40f1-9f57-511f7a3daa6d",
        "type": "hapus",
        "nama": "Bahasa Indonesia",
        "date": "Sun Jul 14 2019 12:38:47 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 1
    },
    {
        "id": "d0c4e17b-90c4-4fdb-b02b-0a81a7ecfda8",
        "type": "tambah",
        "nama": "Statistika",
        "date": "Fri Mar 17 2017 09:26:03 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "id": "565982b2-8860-4b29-80b9-d651e3fed85d",
        "type": "tambah",
        "nama": "Kalkulus",
        "date": "Thu Apr 04 2024 17:09:18 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 4
    },
    {
        "id": "221dd193-040a-49a2-b8c9-b794ff2cee30",
        "type": "tambah",
        "nama": "Fisika Dasar",
        "date": "Tue Mar 17 2015 14:36:26 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 1
    },
    {
        "id": "5228c321-45e9-4aba-94b3-907f5fc4cf83",
        "type": "hapus",
        "nama": "Kimia Dasar",
        "date": "Sun Apr 23 2023 08:10:16 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 3
    },
    {
        "id": "65fd41ba-095e-4bd6-9aa2-f81f5d583f02",
        "type": "hapus",
        "nama": "Biologi Umum",
        "date": "Wed Dec 19 2018 12:56:23 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 2
    },
    {
        "id": "1c7dc278-37a8-41a3-9d25-5ff4f26a4cbc",
        "type": "hapus",
        "nama": "Sistem Informasi",
        "date": "Sat Feb 21 2015 20:18:41 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4
    },
    {
        "id": "d9b50bf8-3cca-47af-bea7-327c8e2975cf",
        "type": "tambah",
        "nama": "Algoritma dan Pemrograman",
        "date": "Mon Oct 03 2016 08:49:24 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "id": "f4c139ab-1d5e-40fd-8f00-2acac5dbf2c6",
        "type": "tambah",
        "nama": "Struktur Data",
        "date": "Sun Aug 04 2019 05:17:45 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "id": "8b892158-b6f6-4d4a-8e79-0d2b531f7d17",
        "type": "tambah",
        "nama": "Jaringan Komputer",
        "date": "Thu May 24 2018 03:52:48 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 2
    },
    {
        "id": "c00c0c11-09e3-4c6e-8b94-5309476be965",
        "type": "tambah",
        "nama": "Basis Data",
        "date": "Sat Jun 23 2018 04:43:48 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 1
    },
    {
        "id": "d9af17ef-5991-49ac-b79e-de0b9e760315",
        "type": "hapus",
        "nama": "Pemrograman Web",
        "date": "Sat Nov 27 2021 04:35:52 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 4
    },
    {
        "id": "a66d05a2-6dd1-4bd1-83f4-9f364fe1cbd5",
        "type": "hapus",
        "nama": "Keamanan Komputer",
        "date": "Sat Feb 22 2014 21:57:22 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 3
    },
    {
        "id": "39c49e5b-2878-42d7-b6e0-f844ebed238a",
        "type": "hapus",
        "nama": "Manajemen Proyek TI",
        "date": "Thu Jul 06 2023 03:12:09 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 4
    },
    {
        "id": "55286404-d49f-4cc5-9d68-4e2333507499",
        "type": "hapus",
        "nama": "Analisis Sistem",
        "date": "Sat Aug 24 2019 12:04:00 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 3
    },
    {
        "id": "4c1577e5-e35e-4f95-9c99-ec6b21181780",
        "type": "hapus",
        "nama": "Desain Grafis",
        "date": "Fri Nov 17 2023 21:09:58 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 2
    },
    {
        "id": "05017e7f-3fe5-4514-a24d-75aecddde48c",
        "type": "hapus",
        "nama": "Teknologi Multimedia",
        "date": "Tue Mar 25 2014 06:43:19 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 1
    },
    {
        "id": "1c543378-e0b0-44db-81b5-69b14a5e11ad",
        "type": "tambah",
        "nama": "Kewirausahaan",
        "date": "Sat Oct 31 2020 03:42:37 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4
    },
    {
        "id": "f35ada58-c11f-4d9d-bdad-3284b870640d",
        "type": "tambah",
        "nama": "Etika Profesi",
        "date": "Wed Mar 20 2019 15:56:22 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "id": "5f66514b-0e3b-4aa2-aec0-959c50784287",
        "type": "tambah",
        "nama": "Manajemen Pemasaran",
        "date": "Sun Jun 02 2024 22:02:52 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 3
    },
    {
        "id": "993e66f2-ca86-493f-a0a6-ba085c248130",
        "type": "hapus",
        "nama": "Akuntansi Dasar",
        "date": "Wed May 17 2017 04:21:57 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 3
    },
    {
        "id": "80c7405e-adb6-4cf0-80d2-c5a57869f3cb",
        "type": "hapus",
        "nama": "Ekonomi Mikro",
        "date": "Fri Sep 04 2020 14:02:17 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "id": "6bc4ffa3-b5fb-4120-b4c3-f778cb0d8ebd",
        "type": "tambah",
        "nama": "Ekonomi Makro",
        "date": "Thu Jun 25 2015 05:22:18 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 2
    },
    {
        "id": "88aba4c3-ab42-4a0d-a2b9-7f18c82d3daf",
        "type": "tambah",
        "nama": "Hukum Bisnis",
        "date": "Wed Sep 21 2022 16:52:23 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 4
    },
    {
        "id": "45ac59d2-b6a1-4da3-9d49-aaac92ab1281",
        "type": "hapus",
        "nama": "Teori Organisasi",
        "date": "Mon Aug 06 2018 03:12:49 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 1
    },
    {
        "id": "347dbc0c-7308-4371-9603-17b8cb18829a",
        "type": "hapus",
        "nama": "Psikologi Industri",
        "date": "Mon May 16 2016 14:35:39 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 1
    },
    {
        "id": "33805381-f553-466e-8aa5-16ec1c0293f6",
        "type": "hapus",
        "nama": "Psikologi Sosial",
        "date": "Wed Aug 30 2023 13:42:12 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 1
    },
    {
        "id": "6084d6bf-4126-4da4-bf92-c58027d36f26",
        "type": "hapus",
        "nama": "Psikologi Pendidikan",
        "date": "Fri Mar 10 2017 09:05:33 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 2
    },
    {
        "id": "7ed0d3fa-443a-4ba4-b37f-d819a2dc71f7",
        "type": "tambah",
        "nama": "Psikologi Klinis",
        "date": "Sun May 17 2015 08:12:52 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4
    },
    {
        "id": "a70d5872-a135-45d7-9e20-95db5e0cce39",
        "type": "tambah",
        "nama": "Sosiologi",
        "date": "Fri Feb 07 2020 20:07:07 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 3
    },
    {
        "id": "7c3c56c4-c226-4cff-9dab-1e134ccd0615",
        "type": "hapus",
        "nama": "Antropologi",
        "date": "Sat Dec 22 2018 00:53:48 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 3
    },
    {
        "id": "f0932450-a7fc-4c42-b967-ed095328640b",
        "type": "hapus",
        "nama": "Ilmu Politik",
        "date": "Thu Jul 30 2015 17:59:28 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 3
    },
    {
        "id": "526e85ab-cfed-490f-b691-85be01f0a677",
        "type": "tambah",
        "nama": "Hubungan Internasional",
        "date": "Fri Jan 18 2019 02:27:44 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 3
    },
    {
        "id": "e042942e-b9b3-4435-815f-db7b9ef56a3c",
        "type": "hapus",
        "nama": "Metodologi Penelitian",
        "date": "Tue Feb 06 2018 12:27:03 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 1
    },
    {
        "id": "288568de-64e6-41c4-b889-87d77d26a749",
        "type": "tambah",
        "nama": "Statistika Sosial",
        "date": "Tue May 10 2022 00:24:29 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 2
    },
    {
        "id": "2b11750b-aa13-4c07-b47c-0f18522650e0",
        "type": "hapus",
        "nama": "Metode Penelitian Kualitatif",
        "date": "Mon Dec 11 2017 07:32:16 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 3
    },
    {
        "id": "a0d3aec7-f485-4a75-a17c-662f881342e8",
        "type": "hapus",
        "nama": "Metode Penelitian Kuantitatif",
        "date": "Sun Jul 12 2015 09:57:43 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 2
    },
    {
        "id": "a2341d13-ccac-4e34-8212-64c652be037b",
        "type": "tambah",
        "nama": "Sejarah Indonesia",
        "date": "Sat Apr 15 2017 21:38:59 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 3
    },
    {
        "id": "f63e2b04-8968-47c4-9ee7-389664652782",
        "type": "hapus",
        "nama": "Sejarah Dunia",
        "date": "Sat Nov 22 2014 16:46:54 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 3
    },
    {
        "id": "82488b1e-6c77-4c30-894e-99ecc99bf412",
        "type": "tambah",
        "nama": "Geografi",
        "date": "Thu Jan 30 2014 20:08:26 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 4
    },
    {
        "id": "7f57f268-4d0b-4b0f-bba1-0300bd7124d6",
        "type": "hapus",
        "nama": "Geologi",
        "date": "Sun Apr 04 2021 16:00:41 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4
    },
    {
        "id": "c611d343-5e9b-471d-b8d2-094496029e24",
        "type": "hapus",
        "nama": "Ekologi",
        "date": "Thu Jul 07 2016 09:21:51 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 4
    },
    {
        "id": "b8d77cd0-f518-47ab-aefb-90b198ab6823",
        "type": "tambah",
        "nama": "Manajemen Sumber Daya Alam",
        "date": "Thu Aug 04 2016 23:22:39 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 1
    },
    {
        "id": "ba65765b-7dc8-4746-b8f6-facd739a4543",
        "type": "tambah",
        "nama": "Teknik Lingkungan",
        "date": "Fri Feb 28 2014 18:53:43 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 4
    },
    {
        "id": "10586e3a-1cde-4420-8659-28c34a92c5a9",
        "type": "tambah",
        "nama": "Hukum Lingkungan",
        "date": "Tue Dec 19 2017 12:28:22 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 3
    },
    {
        "id": "9f3a8155-9370-4d2b-ae61-0e2155a592cb",
        "type": "hapus",
        "nama": "Pengantar Ilmu Komunikasi",
        "date": "Wed Sep 30 2015 20:18:15 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 4
    },
    {
        "id": "00e23e02-6df5-473f-8226-500ebabd9f6a",
        "type": "tambah",
        "nama": "Jurnalistik",
        "date": "Sat Dec 12 2020 22:36:06 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 3
    },
    {
        "id": "b5445d20-473c-4f9c-9cd1-6eb244627c2f",
        "type": "tambah",
        "nama": "Hubungan Masyarakat",
        "date": "Thu May 19 2022 10:31:03 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 4
    },
    {
        "id": "b8f26dee-f7f8-44cf-8d47-081e2f008062",
        "type": "hapus",
        "nama": "Produksi Media",
        "date": "Tue Nov 11 2014 10:23:50 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 4
    },
    {
        "id": "fc163a5f-281d-4f88-aeed-b361a30f47a1",
        "type": "tambah",
        "nama": "Komunikasi Pemasaran",
        "date": "Fri Jul 21 2023 10:32:33 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 1
    },
    {
        "id": "ffb2ccb9-1323-490b-b01f-ff41ca83d9ef",
        "type": "tambah",
        "nama": "Ilmu Ekonomi",
        "date": "Mon Jun 06 2016 20:49:44 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 4
    },
    {
        "id": "0b882c7f-8f3e-4e39-810e-bb6927177f0c",
        "type": "hapus",
        "nama": "Sistem Ekonomi",
        "date": "Wed Jul 21 2021 14:39:49 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 2
    },
    {
        "id": "385ef9bc-ff17-403a-817c-c07e3fe5ccd2",
        "type": "hapus",
        "nama": "Pengantar Manajemen",
        "date": "Wed Nov 11 2015 00:02:10 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 3
    },
    {
        "id": "025fc1ad-b20a-44e7-9c73-683ca3fda19c",
        "type": "hapus",
        "nama": "Pengantar Akuntansi",
        "date": "Sun Apr 18 2021 06:05:16 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 4
    },
    {
        "id": "2262a3be-30b7-4f50-b62a-469a02dfddaa",
        "type": "tambah",
        "nama": "Hukum Perdata",
        "date": "Thu Mar 07 2019 01:17:19 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 2
    },
    {
        "id": "e589dedb-e1f1-4b2f-a52a-6b5131c93581",
        "type": "hapus",
        "nama": "Hukum Pidana",
        "date": "Sat Feb 16 2019 23:24:09 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 1
    },
    {
        "id": "ffe234a0-a76c-4258-9f36-2bd5dd002f36",
        "type": "hapus",
        "nama": "Hukum Internasional",
        "date": "Sat Mar 18 2023 11:20:36 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 2
    },
    {
        "id": "379e97f2-27ed-4ee2-b326-bb3ac436dc9a",
        "type": "tambah",
        "nama": "Administrasi Publik",
        "date": "Fri Nov 15 2019 05:11:29 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "id": "98b709d1-2f64-46ec-be26-51dd010ac7ce",
        "type": "tambah",
        "nama": "Administrasi Bisnis",
        "date": "Fri Apr 25 2014 02:45:56 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 1
    },
    {
        "id": "e6add23b-acab-4c3a-9e78-9fb7f5137e81",
        "type": "hapus",
        "nama": "Manajemen Keuangan",
        "date": "Mon Oct 19 2020 10:38:52 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 2
    },
    {
        "id": "a6595083-fe2e-4094-9f14-d934fa31fcd0",
        "type": "tambah",
        "nama": "Manajemen Operasi",
        "date": "Sun Feb 14 2021 14:00:22 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 1
    },
    {
        "id": "00f09b4e-fc7b-40af-8292-3044deee2c24",
        "type": "tambah",
        "nama": "Manajemen Strategis",
        "date": "Sat Jul 24 2021 01:07:17 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 1
    },
    {
        "id": "d9433f50-dd53-4bb4-a7ad-21938052297b",
        "type": "tambah",
        "nama": "Ilmu Kedokteran Dasar",
        "date": "Sun Aug 21 2016 16:58:54 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 4
    },
    {
        "id": "01cf8af1-bac5-4bf5-8d3c-5862c31ed686",
        "type": "tambah",
        "nama": "Farmakologi",
        "date": "Mon Jan 04 2021 09:28:28 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 3
    },
    {
        "id": "ea93c2cc-a99f-4217-be09-9de147262f64",
        "type": "tambah",
        "nama": "Patologi",
        "date": "Mon Apr 03 2023 21:24:23 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 4
    },
    {
        "id": "20c00b4b-029f-4837-88c0-c6165fe90b4c",
        "type": "tambah",
        "nama": "Anatomi Manusia",
        "date": "Fri Jan 13 2023 18:14:54 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 3
    },
    {
        "id": "5e0ad3a5-c63f-4340-bb8f-d2676c2c0b8b",
        "type": "tambah",
        "nama": "Fisiologi Manusia",
        "date": "Mon Aug 22 2022 07:24:09 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 3
    },
    {
        "id": "401ea3ab-0786-43ec-9750-f83d8454df4f",
        "type": "hapus",
        "nama": "Mikrobiologi",
        "date": "Mon Feb 10 2020 22:13:49 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 3
    },
    {
        "id": "92f52830-1d58-4b60-8815-b7405184d5df",
        "type": "hapus",
        "nama": "Kesehatan Masyarakat",
        "date": "Thu Apr 29 2021 05:10:01 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 2
    },
    {
        "id": "815c36a8-e5e1-400d-b318-caf3bd5fa806",
        "type": "tambah",
        "nama": "Epidemiologi",
        "date": "Wed May 10 2017 00:37:16 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 2
    },
    {
        "id": "5b1656b5-844c-4a5d-af16-d834a38a8572",
        "type": "hapus",
        "nama": "Gizi Kesehatan",
        "date": "Fri Dec 21 2018 17:10:36 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 4
    },
    {
        "id": "7eec4842-4532-47ea-8f50-35fc689a381c",
        "type": "tambah",
        "nama": "Kepemimpinan dalam Kesehatan",
        "date": "Mon Nov 20 2017 18:45:23 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 2
    },
    {
        "id": "015e2ea5-4f08-44ac-9d6c-ed7887b12c7d",
        "type": "hapus",
        "nama": "Teknik Mesin",
        "date": "Sat May 14 2016 09:54:27 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 1
    },
    {
        "id": "5d4b9595-5757-4c64-b047-ea21cde7a6bc",
        "type": "tambah",
        "nama": "Termodinamika",
        "date": "Thu May 18 2017 01:40:02 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 4
    },
    {
        "id": "63dbdfd6-a453-48dc-8bf5-e6ade951ad31",
        "type": "tambah",
        "nama": "Mekanika Fluida",
        "date": "Fri Sep 09 2016 17:05:38 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 1
    },
    {
        "id": "98a4c6bf-472e-42e5-8596-831bb00f0491",
        "type": "hapus",
        "nama": "Desain Mekanik",
        "date": "Mon Jun 13 2022 00:43:47 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 2
    },
    {
        "id": "4b3df01a-17b2-427c-b732-68e47af80f0d",
        "type": "tambah",
        "nama": "Teknik Material",
        "date": "Thu Jan 09 2020 16:13:22 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 1
    },
    {
        "id": "e7c75ac0-0cb1-4603-993e-001a7cfcd39a",
        "type": "tambah",
        "nama": "Proses Manufaktur",
        "date": "Mon Nov 07 2022 04:02:35 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 2
    },
    {
        "id": "5718eab2-7bb3-4350-8e15-46dcd2c3a195",
        "type": "hapus",
        "nama": "Rekayasa Sistem",
        "date": "Tue Jan 12 2021 10:46:09 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 2
    },
    {
        "id": "d6de553f-b4e6-4181-a91b-c4bdd9f9facb",
        "type": "hapus",
        "nama": "Teknik Elektro",
        "date": "Tue Aug 15 2017 22:53:04 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 4
    },
    {
        "id": "b348f745-a262-4564-8427-4bcf2837e52d",
        "type": "tambah",
        "nama": "Elektronika Dasar",
        "date": "Mon Aug 03 2015 12:18:58 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 3
    },
    {
        "id": "ad93a276-8c93-4834-8454-b3d8439372db",
        "type": "hapus",
        "nama": "Sistem Tenaga Listrik",
        "date": "Fri Oct 03 2014 13:19:00 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 3
    },
    {
        "id": "78309553-1301-4125-90c2-8fabc1e59046",
        "type": "tambah",
        "nama": "Instrumentasi",
        "date": "Sat Jun 22 2019 07:25:55 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "A",
        "sks": 3
    },
    {
        "id": "3f0ec6e7-9767-4402-8181-81fe40a09504",
        "type": "hapus",
        "nama": "Kontrol Otomatis",
        "date": "Mon Mar 20 2023 09:15:39 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 3
    },
    {
        "id": "f306a6e6-65a4-41d8-b256-fc58edf392fc",
        "type": "tambah",
        "nama": "Telekomunikasi",
        "date": "Sat Jul 04 2020 23:14:07 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "id": "5b4f763c-e8d9-4e6c-8dd6-11ef4f51dbf6",
        "type": "hapus",
        "nama": "Robotika",
        "date": "Sat Jul 01 2023 14:03:31 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 4
    },
    {
        "id": "9ef1578c-6e74-414d-8c0b-fa19026d51fc",
        "type": "tambah",
        "nama": "Seni Musik",
        "date": "Tue Nov 12 2019 17:50:56 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 3
    },
    {
        "id": "d8b3c3a8-d78a-4a5c-9997-3da97e3dc067",
        "type": "hapus",
        "nama": "Seni Tari",
        "date": "Mon Apr 26 2021 23:15:00 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 4
    },
    {
        "id": "ab3f4c4d-c3a8-4f4e-af13-ea2d33a49eb3",
        "type": "hapus",
        "nama": "Seni Rupa",
        "date": "Mon Nov 02 2020 11:13:03 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 2
    },
    {
        "id": "843604b1-71ed-45e8-876c-bcd50dc545e8",
        "type": "hapus",
        "nama": "Desain Interior",
        "date": "Mon Jan 22 2018 10:22:46 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 2
    },
    {
        "id": "b1665165-01de-4b78-a722-e4c7079fafd0",
        "type": "tambah",
        "nama": "Desain Produk",
        "date": "Tue Apr 09 2024 12:22:38 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 4
    },
    {
        "id": "ece5e45c-6bfc-441d-8d04-618cb6f64843",
        "type": "hapus",
        "nama": "Arsitektur",
        "date": "Sat Jun 08 2024 01:32:54 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "E",
        "sks": 2
    },
    {
        "id": "7d1162e5-af99-44ae-98b5-3d4e6b3525ea",
        "type": "tambah",
        "nama": "Perencanaan Wilayah dan Kota",
        "date": "Sun May 31 2020 07:52:00 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B",
        "sks": 2
    },
    {
        "id": "62b76981-c4e5-4b5d-8825-4d1015568eae",
        "type": "hapus",
        "nama": "Konstruksi Bangunan",
        "date": "Wed Nov 02 2022 11:25:00 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "B+",
        "sks": 2
    },
    {
        "id": "3786ce6b-65fe-4d7b-ba8b-7633767c993a",
        "type": "tambah",
        "nama": "Hukum Tata Negara",
        "date": "Tue Oct 19 2021 01:49:00 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 1
    },
    {
        "id": "f47294f7-faba-4dfd-a8bc-3306af244690",
        "type": "tambah",
        "nama": "Hukum Agraria",
        "date": "Wed Jan 01 2020 16:34:29 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D+",
        "sks": 2
    },
    {
        "id": "2159bb17-63af-48ba-9c2f-b98a741c9b88",
        "type": "tambah",
        "nama": "Pengantar Filsafat",
        "date": "Mon Dec 13 2021 18:22:32 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 1
    },
    {
        "id": "16336ffa-0f09-4fc2-9a42-de0c8a8773d7",
        "type": "tambah",
        "nama": "Logika",
        "date": "Mon Jul 30 2018 00:27:36 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "D",
        "sks": 4
    },
    {
        "id": "90976fde-214c-4440-921d-c34d4f789786",
        "type": "tambah",
        "nama": "Etika",
        "date": "Sat Jul 15 2017 08:59:41 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C",
        "sks": 4
    },
    {
        "id": "fdbf4f16-2132-4e47-a304-b081541c8e77",
        "type": "tambah",
        "nama": "Sejarah Filsafat",
        "date": "Thu Jul 06 2017 03:40:42 GMT+0700 (Waktu Indonesia Barat)",
        "nilai": "C+",
        "sks": 3
    }
]

const DESCRIPTIONTEXT = 'Apapun jurusan yang sedang kamu tempuh maupun nama matakuliah nya, kamu bebas buat tambah atau hapus itu semua secara dinamis.'

// #endregion

export default TambahHapus;