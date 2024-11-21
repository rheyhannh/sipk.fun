'use client'

// #region TYPE DEPEDENCY
import { NavItem } from '@/constant/client';
// #endregion

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
} from './RootConfig';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from 'framer-motion';
import { LogoImage } from '@/component/Main';
import Link from '@/component/Link';
import { animateScroll as scroll, scroller } from 'react-scroll';
// #endregion

// #region ICON DEPEDENCY
import { FaTelegram, FaLinkedin, FaTiktok } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
// #endregion

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
        text: 'Tentang',
        elementId: 'tentang',
        href: null
    },
    {
        text: 'Fitur',
        elementId: 'fitur',
        href: null
    },
    {
        text: 'Testimoni',
        elementId: 'testimoni',
        href: null
    },
    {
        text: 'Panduan',
        elementId: null,
        href: '/panduan',
    },
]

const footerSocials = [
    { icon: <FaLinkedin size={'100%'} />, target: 'https://www.linkedin.com/' },
    { icon: <FaTiktok size={'100%'} />, target: 'https://www.tiktok.com/' },
    { icon: <FaTelegram size={'100%'} />, target: 'https://web.telegram.org/' },
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
        text: 'Status',
        elementId: null,
        href: 'https://status.atlassian.com/',
        isOpenNewTab: true,
    },
    {
        text: 'Riwayat Pembaruan',
        elementId: null,
        href: 'https://l.loggify.app/sipk/changes',
        isOpenNewTab: true,
    }
]

const footerDelayAnims = [0.125, 0.25, 0.375];

const getFooterTransition = (isText = true, delayIndex = 0, isLine = false) => ({
    initial: {
        opacity: isText ? 0 : 1,
        scale: isText ? 1 : 0,
        y: isText ? delayIndex === 2 ? 50 : 75 : 0,
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

const Footers = () => (
    <footer id={'footer'} className={styles.footer}>
        <motion.div
            className={styles.primary}
            whileInView={'show'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
        >
            <motion.div className={styles.brand} onClick={() => { scroll.scrollToTop({ smooth: false, duration: 1 }) }} {...getFooterTransition(false, 0)}>
                <LogoImage src={'/logo_fill_contrast.png'} width={60} height={60} />
            </motion.div>

            <div className={styles.shorcut}>
                {footerShorcuts.map((item, index) => (
                    <motion.div key={index} {...getFooterTransition(true, 0)}>
                        <Link
                            key={index}
                            item={{ href: item.href, elementId: item.elementId }}
                            // TODOS offset still static '-75', when comes to mobile or any viewport less than 1280
                            // offset should be corrected
                            scrollOptions={{ offset: -75, ...item?.scrollOptions }}
                            routingOptions={{ ...item?.routingOptions }}
                            {...(item?.isOpenNewTab || false ? { target: '_blank' } : {})}
                            tabIndex={2}
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

            <div className={styles.socials}>
                {footerSocials.map((item, index) => (
                    <motion.a
                        key={index}
                        className={styles.box}
                        href={item.target}
                        target={'_blank'}
                        tabIndex={2}
                        onClickCapture={(event) => { event.currentTarget.blur() }}
                        {...getFooterTransition(false, 0)}>
                        {item.icon}
                    </motion.a>
                ))}
            </div>
        </motion.div>

        <motion.div
            className={styles.line}
            whileInView={'show'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
            {...getFooterTransition(false, 1, true)}
        />

        <motion.div
            className={styles.secondary}
            whileInView={'show'}
            viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
        >
            <motion.span initial={{ y: 75, opacity: 0 }} {...getFooterTransition(true, 2)}>
                2024 All Rights Reserved.
            </motion.span>
            <div className={styles.sublinks}>
                {footerSublinks.map((item, index) => (
                    <motion.div key={index} {...getFooterTransition(true, 2)}>
                        <Link
                            key={index}
                            item={{ href: item.href, elementId: item.elementId }}
                            // TODOS offset still static '-75', when comes to mobile or any viewport less than 1280
                            // offset should be corrected
                            scrollOptions={{ offset: -75, ...item?.scrollOptions }}
                            routingOptions={{ ...item?.routingOptions }}
                            {...(item?.isOpenNewTab || false ? { target: '_blank' } : {})}
                            tabIndex={2}
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

const Footer = () => (
    <FooterOutter>
        <FooterWrapper>
            <Footers />
        </FooterWrapper>
    </FooterOutter>
)

export default Footer;