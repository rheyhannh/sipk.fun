'use client'

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
} from '../config';
// #endregion

// #region NEXT DEPEDENCY
import { useRouter, usePathname } from 'next/navigation';
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
import { LinkHash } from '../components';
import { animateScroll as scroll } from 'react-scroll';
// #endregion

// #region ICON DEPEDENCY
import { FaLinkedin, FaTiktok } from 'react-icons/fa';
// #endregion

/**
 * Mendefinisikan width viewport dimana jika kurang dari nilai ini, maka animasi akan diadjust pada method {@link getFooterTransition}
 * @type {number}
 */
const FOOTER_SMALL_DEVICES = 524;

/** Array yang berisikan link yang digunakan pada footer. */
const footerShorcuts = /** @type {Array<Parameters<typeof LinkHash>[0]>} */ ([
    {
        href: '/#universitas',
        text: 'Universitas',
        hashId: 'universitas',
        scrollRules: ['(max-width: 1023px)', { behaviour: 'smooth', block: 'start' }, { behaviour: 'smooth', block: 'center' }]
    },
    {
        href: '/#kenapa_sipk',
        text: 'Fitur',
        hashId: 'kenapa_sipk',
        scrollRules: ['(max-width: 1079px)', { behaviour: 'smooth', block: 'start' }, { behaviour: 'smooth', block: 'center' }],
    },
    {
        href: '/faq',
        text: 'FAQ',
        hashId: null,
        scrollRules: null,
    },
])

const footerSocials = [
    { icon: <FaLinkedin size={'100%'} />, target: 'https://www.linkedin.com/company/sipk-app' },
    { icon: <FaTiktok size={'100%'} />, target: 'https://www.tiktok.com/@sipk.official' },
]

/** Array yang berisikan link yang digunakan pada footer sublinks */
const footerSublinks = /** @type {Array<Parameters<typeof LinkHash>[0]>} */ ([
    {
        href: 'https://dashboard.simpleanalytics.com/sipk.fun',
        text: 'Analitik',
        hashId: null,
        scrollRules: null,
        isOpenNewTab: true,
    }
])

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

const Footers = ({ viewportWidth }) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <footer id={'footer'} className={styles.footer}>
            <motion.div
                className={styles.primary}
                whileInView={'show'}
                viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
            >
                <div className={styles.brand_wrap}>
                    <motion.div
                        className={styles.brand}
                        onClick={() => {
                            if (pathname === '/') scroll.scrollToTop({ smooth: false, duration: 1 })
                            else router.push('/')
                        }}
                        {...getFooterTransition(false, 0, false, viewportWidth <= FOOTER_SMALL_DEVICES)}
                    >
                        <LogoSipkFillContrast priority={true} />
                    </motion.div>
                </div>

                <div id={'footer-shorcuts'} className={styles.shorcut}>
                    {footerShorcuts.map((props, index) => (
                        <motion.div key={index} {...getFooterTransition(true, 0, false, viewportWidth <= FOOTER_SMALL_DEVICES)}>
                            <LinkHash key={index} {...props} />
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
                    2025 All Rights Reserved.
                </motion.span>
                <div id={'footer-sublinks'} className={styles.sublinks}>
                    {footerSublinks.map((props, index) => (
                        <motion.div key={index} {...getFooterTransition(true, 2, false, viewportWidth <= FOOTER_SMALL_DEVICES)}>
                            <LinkHash key={index} {...props} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </footer>
    )
}

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