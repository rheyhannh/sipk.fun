// #region REACT DEPEDENCY
import { useState } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useAnimation } from "framer-motion";
import FoldingIcons from '@/component/motion/FoldingIcons';
import AnimatedTextBox from '@/component/motion/TextBox';
// #endregion

// #region UTIL DEPEDENCY
import { getCommonAnimationVariants } from '@/component/motion/_helper';
// #endregion

// #region ICON DEPEDENCY
import { AiOutlineDelete, AiOutlinePlus, AiOutlineLike } from "react-icons/ai";
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/feature.module.css';

// #endregion

const TambahHapus = () => {
    const descriptionArray = ["Kamu", "bebas", "tambah", "dan", "hapus", "matakuliah", "kamu", "secara", "dinamis.", "Gausah", "binggung", "IPK", "kamu", "jadi", "berapa,", "biar", "SIPK", "yang", "hitungin", "itu", "semua", "buat kamu."];
    const [foldingCurrentIndex, setFoldingCurrentIndex] = useState(null);

    return (
        <Wrapper>
            <Layout>
                <Highlight>
                    <Box>
                        <AnimatedTextBox
                            text='Tambah Matakuliah'
                            fontSize='1.2rem'
                            color='var(--landing-copyInverse)'
                            background='#74ff8d'
                            enterAnimation='custom'
                            customEnterAnimation={{
                                hide: { opacity: 0, rotateY: -25, rotateX: -75, scale: 0.75 },
                                introCardBox_show: { opacity: 1, rotateY: 0, rotateX: 0, scale: 1, transition: { type: 'spring', damping: 9, stiffness: 100 } },
                                introCardBox_tambah_unhighlight: { opacity: 1, y: 0, x: 0, scale: 1, zIndex: 6, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } },
                                introCardBox_tambah_highlight: { scale: 1.15, zIndex: 10, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } }
                            }}
                            style={{ fontWeight: '600', zIndex: 6, transformOrigin: 'bottom left 1.5rem' }}
                        />

                        <AnimatedTextBox
                            text='Hapus Matakuliah'
                            fontSize='1.35rem'
                            color='var(--landing-copyInverse)'
                            background='#ff747d'
                            enterAnimation='custom'
                            customEnterAnimation={{
                                hide: { opacity: 0, y: (-75 / 2), x: (-75 / 2), scale: 0.25 },
                                introCardBox_show: { opacity: 1, y: 0, x: 0, scale: 1, transition: { type: 'spring', damping: 8, stiffness: 100 } },
                                introCardBox_hapus_unhighlight: { opacity: 1, y: 0, x: 0, scale: 1, zIndex: 5, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } },
                                introCardBox_hapus_highlight: { scale: 1.15, zIndex: 10, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } }
                            }}
                            style={{ fontWeight: '600', zIndex: 5, margin: '.5rem 0 0 1rem' }}
                        />

                        <AnimatedTextBox
                            text='Apapun Sesukamu'
                            fontSize='1.5rem'
                            color='var(--landing-copyInverse)'
                            background='#ffd274'
                            enterAnimation='custom'
                            customEnterAnimation={{
                                hide: { opacity: 0, y: (-75 / 3), x: (-75 / 3), scale: 0.5 },
                                introCardBox_show: { opacity: 1, y: 0, x: 0, scale: 1, transition: { type: 'spring', damping: 7, stiffness: 100 } },
                                introCardBox_apapun_unhighlight: { opacity: 1, y: 0, x: 0, scale: 1, zIndex: 4, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } },
                                introCardBox_apapun_highlight: { scale: 1.15, zIndex: 10, transition: { type: 'spring', damping: 8, stiffness: 100, delay: 0 } }
                            }}
                            style={{ fontWeight: '600', zIndex: 4, margin: '.5rem 0 0 2rem' }}
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

                </Demo>
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

const Layout = ({ children }) => {
    const animControls = useAnimation();

    return (
        <motion.div
            className={styles.tambah_hapus}
            style={{
                border: '2px solid red',
            }}
            initial={'hide'}
            animate={animControls}
            whileInView={[
                'introCardBox_show',
                'introCardDescription_show'
            ]}
            transition={{
                delayChildren: 0.5,
                staggerChildren: 0.2
            }}
            onAnimationComplete={
                definition => {
                    console.log(`${definition} selesai`)
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

const Demo = ({ children }) => (
    <motion.div
        className={styles.demo}
        style={{
            border: '1px solid green',
        }}
    >
        {children}
    </motion.div>
)

export default TambahHapus;