'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js';
import { MotionProps } from 'framer-motion';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { motion, useAnimation, useTransform, useMotionValue, useSpring, useVelocity, AnimatePresence, LayoutGroup } from "framer-motion";
import FoldingIcons from '@/component/motion/FoldingIcons';
import AnimatedTextBox from '@/component/motion/TextBox';
// #endregion

// #region DATA DEPEDENCY
import { MatkulDummies, MatkulDummiesProps } from '../variables/MatkulDummies';
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
    const { isRichContent, isTouchDevice, isAccessTokenExist } = React.useContext(LandingContext);

    const descriptionArray = DESCRIPTIONTEXT.split(' ');
    const [foldingCurrentIndex, setFoldingCurrentIndex] = React.useState(null);

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

                            <AnimatedFoldingIcons
                                setFoldingCurrentIndex={setFoldingCurrentIndex}
                                interval={4}
                                onlyPlayInView={true}
                            />
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
                        <MatkulGrid foldingCurrentIndex={foldingCurrentIndex} />
                    </Demo>
                </Layout>
            </Container>
        </Section>
    )
}

// #region Main Components

/**
 * Children wrapper dengan css class `.section .tambah_hapus` dengan atribut html id `'tambah_hapus'`
 * - Module : `main.module.css`
 * @param {React.HTMLAttributes<HTMLDivElement>} props Section props
 * @returns {React.ReactElement} Rendered component
 */
const Section = ({ children }) => (
    <section
        id='tambah_hapus'
        className={`${mainStyles.section} ${mainStyles.tambah_hapus}`}
    >
        {children}
    </section>
)

/**
 * Children wrapper dengan css class `.container`
 * - Module : `tambah_hapus.module.css`
 * @param {React.HTMLAttributes<HTMLDivElement>} props Container props
 * @returns {React.ReactElement} Rendered component
 */
const Container = ({ children }) => (
    <div
        className={tambahHapusStyles.container}
    >
        {children}
    </div>
)

/**
 * Props yang digunakan component `Layout`
 * @typedef {Object} LayoutProps
 * @property {?number} foldingCurrentIndex
 * State indeks component `folding` yang sedang aktif berupa angka dengan penjelasan berikut,
 * - `0` : State tambah dengan icon plus 
 * - `1` : State hapus dengan icon trash
 * - `2` : State sesukamu dengan icon like
 * - Initial : `null`
 */

/**
 * Children wrapper dengan css class `.layout`
 * - Module : `tambah_hapus.module.css`
 * @param {React.HTMLAttributes<HTMLDivElement> & LayoutProps} props Layout props
 * @returns {React.ReactElement} Rendered component
 */
const Layout = ({ children, foldingCurrentIndex }) => {
    const animControls = useAnimation();

    React.useEffect(() => {
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

/**
 * Children wrapper dengan css class `.highlight`
 * - Module : `tambah_hapus.module.css`
 * @param {React.HTMLAttributes<HTMLDivElement>} props Highlight props
 * @returns {React.ReactElement} Rendered component
 */
const Highlight = ({ children }) => (
    <motion.div
        className={tambahHapusStyles.highlight}
    >
        {children}
    </motion.div>
)

/**
 * Children wrapper dengan css class `.box`
 * - Module : `tambah_hapus.module.css`
 * @param {React.HTMLAttributes<HTMLDivElement>} props Box props
 * @returns {React.ReactElement} Rendered component
 */
const Box = ({ children }) => (
    <div
        className={tambahHapusStyles.box}
    >
        {children}
    </div>
)

/**
 * Wrapper component `FoldingIcons` dengan css class `.folding`
 * - Module : `tambah_hapus.module.css`
 * @param {Object} props AnimatedFoldingIcons props
 * @param {(newState:number) => void} props.setFoldingCurrentIndex
 * Callback untuk update `foldingCurrentIndex` state
 * @param {number} [props.interval]
 * Interval animasi pergantian state atau icon yang digunakan dalam detik
 * - Default : `10`
 * @param {boolean} [props.onlyPlayInView]
 * Saat `true` animasi hanya akan dimainkan saat element terlihat atau scroll posisi berada pada element terletak.
 * Sedangkan saat `false` animasi tetap dimainkan walaupun element tidak terlihat.
 * - Default : `true`
 * @returns {React.ReactElement} Rendered component
 */
const AnimatedFoldingIcons = ({ setFoldingCurrentIndex, interval = 10, onlyPlayInView = true }) => {
    const [animateState, setAnimateState] = React.useState(false);
    const [inView, setInView] = React.useState(false);

    React.useEffect(() => {
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

/**
 * Children wrapper dengan css class `.description`
 * - Module : `tambah_hapus.module.css`
 * 
 * Juga menggunakan tambahan style sebagai berikut,
 * ```js
 * const style = { overflow: 'hidden', zIndex: 7 }
 * ```
 * @param {React.HTMLAttributes<HTMLDivElement>} props Description props
 * @returns {React.ReactElement} Rendered component
 */
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
    const [matkuls, setMatkuls] = React.useState(MatkulDummies.slice(0, 3));
    const [maximumMatkul, setMaximumMatkul] = React.useState(3);
    const [minimumMatkul, setMinimumMatkul] = React.useState(1);

    const addMatkul = () => {
        if (matkuls.length >= maximumMatkul) return;

        const maxAddable = maximumMatkul - matkuls.length;
        const numToAdd = Math.floor(Math.random() * (maxAddable - 1 + 1)) + 1;

        const availableMatkuls = MatkulDummies.filter(dummy =>
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

    React.useEffect(() => {
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

    React.useEffect(() => {
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

const DESCRIPTIONTEXT = 'Apapun jurusan yang sedang kamu tempuh maupun nama matakuliah nya, kamu bebas buat tambah atau hapus itu semua secara dinamis.'

// #endregion

export default TambahHapus;