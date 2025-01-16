'use client'

// #region TYPE DEPEDENCY
import { NavItem } from '@/constant/client';
// #endregion

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
} from '../config';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useWindowSize from '@/hooks/utils/useWindowSize';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@root_page/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from 'framer-motion';
import { LogoSipkFillContrast } from '@/loader/StaticImages';
import Link from '@/component/Link';
import { animateScroll as scroll, scroller } from 'react-scroll';
// #endregion

// #region ICON DEPEDENCY
import { FaTelegram, FaLinkedin, FaTiktok } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
// #endregion

/**
 * Mendefinisikan width viewport dimana jika kurang dari nilai ini, maka animasi akan diadjust pada method {@link getFooterTransition}
 * @type {number}
 */
const FOOTER_SMALL_DEVICES = 524;

/**
 * Array yang berisikan link yang digunakan pada footer. Gunakan props `elementId` untuk scroll ke section atau element tertentu,
 * gunakan `href` untuk routing ke url tertentu. 
 * 
 * Saat url dibuka pada tab baru, pastikan pass `true` pada props `isOpenNewTab` untuk
 * menambahkan icon dan target `_blank` pada element anchor.
 * 
 * Untuk opsi lanjutan dapat diatur pada props `routingOptions` untuk opsi routing dan `scrollOptions` untuk opsi scroll.
 * @type {Array<Omit<NavItem, 'icon' | 'iconName' | 'iconLib' | 'dropdown'> & {isOpenNewTab:boolean}>}
 */
const footerShorcuts = [
    {
        text: 'Universitas',
        elementId: null,
        href: '/#universitas',
        routingOptions: {
            scroll: false,
            onClick: (event) => {
                const element = document.getElementById('universitas');
                if (element) {
                    event.preventDefault();
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    },
    {
        text: 'Fitur',
        elementId: null,
        href: '/#kenapa_sipk',
        routingOptions: {
            scroll: false,
            onClick: (event) => {
                const element = document.getElementById('kenapa_sipk');
                if (element) {
                    event.preventDefault();
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    },
    {
        text: 'FAQ',
        elementId: null,
        href: '/faq',
    },
]

const footerSocials = [
    { icon: <FaLinkedin size={'100%'} />, target: 'https://www.linkedin.com/company/sipk-app' },
    { icon: <FaTiktok size={'100%'} />, target: 'https://www.tiktok.com/@sipk.official' },
]

/**
 * Array yang berisikan link yang digunakan pada footer sublinks. Gunakan props `elementId` untuk scroll ke section atau element tertentu,
 * gunakan `href` untuk routing ke url tertentu. 
 * 
 * Saat url dibuka pada tab baru, pastikan pass `true` pada props `isOpenNewTab` untuk
 * menambahkan icon dan target `_blank` pada element anchor.
 * 
 * Untuk opsi lanjutan dapat diatur pada props `routingOptions` untuk opsi routing dan `scrollOptions` untuk opsi scroll.
 * @type {Array<Omit<NavItem, 'icon' | 'iconName' | 'iconLib' | 'dropdown'> & {isOpenNewTab:boolean}>}
 */
const footerSublinks = [
    {
        text: 'Analitik',
        elementId: null,
        href: 'https://dashboard.simpleanalytics.com/sipk.fun',
        isOpenNewTab: true,
    }
]

const footerDelayAnims = [0.125, 0.25, 0.375];

const getFooterTransition = (isText = true, delayIndex = 0, isLine = false, smallDevices = false) => ({
    initial: {
        opacity: isText ? 0 : 1,
        scale: isText ? 1 : 0,
        y: isText ? !smallDevices ? delayIndex === 2 ? 50 : 75 : 0 : 0
    },
    variants: {
        show: {
            opacity: 1,
            scale: 1,
            y: 0,
        }
    },
    transition: {
        duration: 1.25,
        bounce: (isLine || isText) ? 0 : 0.25,
        type: 'spring',
        delay: footerDelayAnims[delayIndex]
    }
})

const FooterOutter = ({ children }) => (
    <div className={styles.footer_outter}>
        {children}
    </div>
)

const FooterWrapper = ({ children }) => (
    <div className={styles.footer_wrapper}>
        {children}
    </div>
)

const Footers = ({ viewportWidth }) => (
    <footer id={'footer'} className={styles.footer}>
        <motion.div
            className={styles.primary}
            whileInView={'show'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
        >
            <div className={styles.brand_wrap}>
                <motion.div className={styles.brand} onClick={() => { scroll.scrollToTop({ smooth: false, duration: 1 }) }} {...getFooterTransition(false, 0, false, viewportWidth <= FOOTER_SMALL_DEVICES)}>
                    <LogoSipkFillContrast priority={true} />
                </motion.div>
            </div>

            <div id={'footer-shorcuts'} className={styles.shorcut}>
                {footerShorcuts.map((item, index) => (
                    <motion.div key={index} {...getFooterTransition(true, 0, false, viewportWidth <= FOOTER_SMALL_DEVICES)}>
                        <Link
                            key={index}
                            item={{ href: item.href, elementId: item.elementId }}
                            // TODOS offset still static '-75', when comes to mobile or any viewport less than 1280
                            // offset should be corrected
                            scrollOptions={{ offset: -75, ...item?.scrollOptions }}
                            routingOptions={{ ...item?.routingOptions }}
                            {...(item?.isOpenNewTab || false ? { target: '_blank' } : {})}
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && item?.elementId) {
                                    const target = document.getElementById(item.elementId);
                                    scroller.scrollTo(item.elementId, { offset: -75 })
                                    if (target) target.focus();
                                }
                            }}
                            onClickCapture={(event) => {
                                event.target.blur();
                                if (item?.elementId) {
                                    const target = document.getElementById(item.elementId);
                                    if (target) target.focus();
                                }
                            }}
                        >
                            {item.text}
                            {item?.isOpenNewTab && (
                                <FiArrowUpRight className={styles.external} />
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div id={'footer-socials'} className={styles.socials}>
                {footerSocials.map((item, index) => (
                    <motion.a
                        key={index}
                        className={styles.box}
                        href={item.target}
                        target={'_blank'}
                        tabIndex={0}
                        onClickCapture={(event) => { event.currentTarget.blur() }}
                        {...getFooterTransition(false, 0, false, viewportWidth <= FOOTER_SMALL_DEVICES)}>
                        {item.icon}
                    </motion.a>
                ))}
            </div>
        </motion.div>

        <motion.div
            className={styles.line}
            whileInView={'show'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
            {...getFooterTransition(false, 1, true, viewportWidth <= FOOTER_SMALL_DEVICES)}
        />

        <motion.div
            className={styles.secondary}
            whileInView={'show'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
        >
            <motion.span initial={{ y: 75, opacity: 0 }} {...getFooterTransition(true, 2, false, viewportWidth <= FOOTER_SMALL_DEVICES)}>
                2024 All Rights Reserved.
            </motion.span>
            <div id={'footer-sublinks'} className={styles.sublinks}>
                {footerSublinks.map((item, index) => (
                    <motion.div key={index} {...getFooterTransition(true, 2, false, viewportWidth <= FOOTER_SMALL_DEVICES)}>
                        <Link
                            key={index}
                            item={{ href: item.href, elementId: item.elementId }}
                            // TODOS offset still static '-75', when comes to mobile or any viewport less than 1280
                            // offset should be corrected
                            scrollOptions={{ offset: -75, ...item?.scrollOptions }}
                            routingOptions={{ ...item?.routingOptions }}
                            {...(item?.isOpenNewTab || false ? { target: '_blank' } : {})}
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && item?.elementId) {
                                    const target = document.getElementById(item.elementId);
                                    scroller.scrollTo(item.elementId, { offset: -75 })
                                    if (target) target.focus();
                                }
                            }}
                            onClickCapture={(event) => {
                                event.target.blur();
                                if (item?.elementId) {
                                    const target = document.getElementById(item.elementId);
                                    if (target) target.focus();
                                }
                            }}
                        >
                            {item.text}
                            {item?.isOpenNewTab && (
                                <FiArrowUpRight className={styles.external} />
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    </footer>
)

const Footer = () => {
    const { width: viewportWidth } = useWindowSize();

    if (typeof viewportWidth === 'undefined') return null;

    return (
        <FooterOutter>
            <FooterWrapper>
                <Footers viewportWidth={viewportWidth} />
            </FooterWrapper>
        </FooterOutter>
    );
}

export default Footer;