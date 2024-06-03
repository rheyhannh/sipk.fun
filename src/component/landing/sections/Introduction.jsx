'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region REACT DEPEDENCY
import { useContext, useRef, useEffect, useState } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { useInView, useAnimate, useScroll, useMotionValueEvent, useMotionValue, stagger, motion, useTransform } from "framer-motion";
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

const introductionContent = {
    text: {
        title: 'Apa itu SIPK ?',
        description: 'SIPK adalah aplikasi untuk mengorganisir matakuliah dan menghitung IPK yang kalian peroleh. Berbeda dengan portal akademik pada umumnya, SIPK berdiri sendiri sehingga kalian dapat menambah, menghapus bahkan mengubah nilai matakuliah kalian secara dinamis.',
    },
    optionsProps: {
        title: {
            tag: 'h1',
            useMotion: true,
            otherProps: {
                style: {
                    margin: '0 10px 10px 0',
                    whiteSpace: 'nowrap',
                    fontSize: 'var(--big-font-size)',
                    color: 'var(--dark-color)',
                },
            }
        },
        description: {
            tag: 'span',
            useMotion: true,
            otherProps: {
                style: {
                    margin: '0 10px 10px 0',
                    whiteSpace: 'nowrap',
                    fontSize: 'var(--h1-font-size)',
                    color: 'var(--dark-color)',
                },
            }
        }
    },
    containerOptionsProps: {
        title: {
            tag: 'div',
            useMotion: false,
            otherProps: {
                style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '1rem 1rem 1rem 1rem',
                    overflow: 'hidden',
                },
            }
        },
        description: {
            tag: 'p',
            useMotion: false,
            otherProps: {
                style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '1rem 1rem 1rem 1rem',
                    overflow: 'hidden',
                },
            }
        }
    }
}

export function Introduction() {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist, data } = useContext(LandingContext);
    const sectionRef = useRef(null);
    const isSectionInView = useInView(sectionRef, { once: true });
    const { scrollYProgress: sectionScrollProgress } = useScroll({ target: sectionRef });

    return (
        <Section sectionRef={sectionRef}>
            <Wrapper>
                <Content>
                    <AnimatedScrollingText
                        sectionScrollProgress={sectionScrollProgress}
                        title={introductionContent.text.title}
                        enterScrollTimeframe={[0, 0.2]}
                        exitScrollTimeframe={[0.7, 0.9]}
                        overallTimeframe={[0, 1]}
                        useStagger={true}
                        options={introductionContent.optionsProps.title}
                        useContainer={true}
                        containerOptions={introductionContent.containerOptionsProps.title}
                    />
                    <AnimatedScrollingText
                        sectionScrollProgress={sectionScrollProgress}
                        title={introductionContent.text.description}
                        enterScrollTimeframe={[0.1, 0.35]}
                        exitScrollTimeframe={[0.8, 0.9]}
                        overallTimeframe={[0, 1]}
                        useStagger={true}
                        options={introductionContent.optionsProps.description}
                        useContainer={true}
                        containerOptions={introductionContent.containerOptionsProps.description}
                    />
                </Content>
            </Wrapper>
        </Section>
    )
}

const Section = ({ children, sectionRef }) => {
    return (
        <section
            ref={sectionRef}
            className={`${styles.section}`}
            style={{
                display: 'initial',
                height: '500vh',
                border: '7.5px solid red'
            }}
            id={'intro'}
        >
            {children}
        </section>
    )
}

const Wrapper = ({ children }) => {
    return (
        <div
            style={{
                position: 'sticky',
                top: '0',
                height: '100vh',
                overflow: 'hidden',
                padding: 'calc(72px + 2rem) 2rem 2rem 2rem',
                border: '5px solid purple',
            }}
        >
            {children}
        </div>
    )
}

const Content = ({ children }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                background: 'red',
                width: '100%',
                height: '100%',
            }}
        >
            {children}
        </div>
    )
}

/** 
 * Render konten teks dengan animasi masuk dan keluar berdasarkan scroll progress dari section atau parent element `sectionRef`
 * @param {Object} props React props object
 * @param {any} props.sectionScrollProgress 
 * Scroll progress section atau parent element yang diperoleh dari hook framer motion `useScroll`
 * @param {string} [props.title]
 * Konten teks yang ditampilkan
 * - Default: `'Lorem ipsum dolor sit amet.'` 
 * @param {[number, number]} [props.enterScrollTimeframe] 
 * Array dengan 2 indeks dimana indeks ke-1 merepresentasikan kapan animasi masuk mulai dan indeks ke-2 kapan animasi masuk selesai berdasarkan sequence dari `overallTimeframe`
 * - Kriteria array `arr[0] < arr[1]` & `arr.length === 2`
 * - Kriteria angka `0 >= x >= 1`
 * - Default: `[0, 0.2]` 
 * @param {[number, number]} [props.exitScrollTimeframe] 
 * Array dengan 2 indeks dimana indeks ke-1 merepresentasikan kapan animasi keluar mulai dan indeks ke-2 kapan animasi keluar selesai berdasarkan sequence dari `overallTimeframe`
 * - Kriteria array `arr[0] < arr[1]` & `arr.length === 2`
 * - Kriteria angka `0 >= x >= 1`
 * - Default: `[0.75, 0.95]` 
 * @param {[number, number]} [props.overallTimeframe] 
 * Array dengan 2 indeks yang merepresentasikan durasi total dari progress scroll `sectionRef`
 * - Kriteria array `arr[0] < arr[1]` & `arr.length === 2`
 * - Kriteria angka `0 >= x >= 1`
 * - Default: `[0, 0.5]` 
 * @param {boolean} [props.useStagger] 
 * Boolean untuk menggunakan stagger. Stagger akan memberikan efek animasi delay untuk setiap kata
 * - Default : `false`
 * @param {Object} [props.options]
 * Opsi yang digunakan
 * @param {any} [props.options.tag]
 * Tag html yang digunakan dalam string
 * - Default : `'h1'`
 * @param {boolean} [props.options.useMotion]
 * Boolean untuk menggunakan komponen `motion` sesuai dengan tag yang digunakan
 * - Contoh : Jika tag `h1` dan opsi ini `true` maka menggunakan`motion.h1`, jika tidak hanya `h1`
 * - Default : `false` 
 * @param {{}} [props.options.otherProps]
 * Props lainnya yang ingin digunakan seperti onClick, style dan lainnya
 * - Default : `{}`
 * @param {boolean} [props.useContainer]
 * Boolean untuk menggunakan container atau parent element
 * - Default : `false`
 * @param {Object} [props.containerOptions]
 * Opsi yang digunakan pada container
 * @param {any} [props.containerOptions.tag]
 * Tag html yang digunakan pada container dalam string
 * - Default : `'div'`
 * @param {boolean} [props.containerOptions.useMotion]
 * Boolean untuk menggunakan komponen `motion` sesuai dengan tag yang digunakan pada container
 * - Contoh : Jika tag `div` dan opsi ini `true` maka menggunakan`motion.div`, jika tidak hanya `div`
 * - Default : `false` 
 * @param {{}} [props.containerOptions.otherProps]
 * Props lainnya yang ingin digunakan pada container seperti onClick, style dan lainnya
 * - Default : `{}`
 */
const AnimatedScrollingText = (
    {
        sectionScrollProgress,
        title = 'Lorem ipsum dolor sit amet.',
        enterScrollTimeframe = [0, 0.2],
        exitScrollTimeframe = [0.75, 0.95],
        overallTimeframe = [0, 0.5],
        useStagger = false,
        options = {
            tag: 'h1',
            useMotion: false,
            otherProps: {},
        },
        useContainer = false,
        containerOptions = {
            tag: 'div',
            useMotion: false,
            otherProps: {},
        },
    }) => {
    const titleWords = title.split(' ');
    const timeframe = useTransform(sectionScrollProgress, [overallTimeframe[0], overallTimeframe[1]], [0, 1]);

    const getOpacity = () => {
        const enterOffset = (enterScrollTimeframe[1] - enterScrollTimeframe[0]) / titleWords.length;
        const exitOffset = (exitScrollTimeframe[1] - exitScrollTimeframe[0]) / titleWords.length;

        return titleWords.map((_, index) => {
            const enterStart = enterScrollTimeframe[0] + (index * enterOffset);
            const exitStart = exitScrollTimeframe[0] + (index * exitOffset);

            return useTransform(
                timeframe,
                [enterStart, enterScrollTimeframe[1], exitStart, exitScrollTimeframe[1]],
                [0, 1, 1, 0]
            );
        });
    }
    const opacity = getOpacity();

    const getY = () => {
        const enterOffset = (enterScrollTimeframe[1] - enterScrollTimeframe[0]) / titleWords.length;
        const exitOffset = (exitScrollTimeframe[1] - exitScrollTimeframe[0]) / titleWords.length;

        return titleWords.map((_, index) => {
            const enterStart = enterScrollTimeframe[0] + (index * enterOffset);
            const exitStart = exitScrollTimeframe[0] + (index * exitOffset);

            return useTransform(
                timeframe,
                [enterStart, enterScrollTimeframe[1], exitStart, exitScrollTimeframe[1]],
                [-75, 0, 0, -75]
            );
        });
    }
    const y = getY();

    const getX = () => {
        const enterOffset = (enterScrollTimeframe[1] - enterScrollTimeframe[0]) / titleWords.length;
        const exitOffset = (exitScrollTimeframe[1] - exitScrollTimeframe[0]) / titleWords.length;

        return titleWords.map((_, index) => {
            const enterStart = enterScrollTimeframe[0] + (index * enterOffset);
            const exitStart = exitScrollTimeframe[0] + (index * exitOffset);

            return useTransform(
                timeframe,
                [enterStart, enterScrollTimeframe[1], exitStart, exitScrollTimeframe[1]],
                [-50, 0, 0, -50]
            );
        });
    }
    const x = getX();

    const Content = () => {
        const ContentElement = options.useMotion ? motion[options.tag] : options.tag;

        if (useStagger) {
            return (
                <>
                    {titleWords.map((item, index) => (
                        <ContentElement
                            key={`titleWords-${index}`}
                            {...options.otherProps}
                            style={{
                                ...options.otherProps?.style,
                                opacity: opacity[index],
                                y: y[index],
                                x: x[index],
                            }}
                        >
                            {item}
                        </ContentElement>
                    ))}
                </>
            )
        } else {
            return (
                <ContentElement
                    {...options.otherProps}
                    style={{
                        ...options.otherProps?.style,
                        opacity: opacity[0],
                        y: y[0],
                        x: x[0],
                    }}
                >
                    {title}
                </ContentElement>
            )
        }
    }

    const Container = ({ children }) => {
        const ContainerElement = containerOptions.useMotion ? motion[containerOptions.tag] : containerOptions.tag;

        return (
            <ContainerElement {...containerOptions.otherProps}>
                {children}
            </ContainerElement>
        )
    }

    if (useContainer) {
        return (
            <Container>
                <Content />
            </Container>
        )
    } else {
        return (
            <Content />
        )
    }
}