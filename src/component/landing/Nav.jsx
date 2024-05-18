'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region REACT DEPEDENCY
import { useEffect, useState } from "react";
// #endregion

// #region COMPONENT DEPEDENCY
import { Link } from 'react-scroll';
import { AnimatePresence, motion } from "framer-motion";
import { mutate } from 'swr';
// #endregion

// #region DATA DEPEDENCY
import { useLocalTheme } from '@/data/core';
import { landingNavItem } from '@/constant/client';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/landing.module.css'
// #endregion

// #region ICON DEPEDENCY
import {
    FiArrowRight,
    FiBarChart2,
    FiChevronDown,
    FiHome,
    FiPieChart,
    FiSun,
    FiMoon,
} from "react-icons/fi";
// #endregion

export function Nav({ data = { notifikasi: null } }) {
    const { data: theme } = useLocalTheme();

    const handleChangeTheme = (newTheme) => {
        if (theme === newTheme) { return }
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark')
        mutate('localUserTheme');
    }

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         console.log('Change theme every 3.5secs for preview.');
    //         handleChangeTheme(theme === 'dark' ? 'light' : 'dark');
    //     }, 3500);

    //     return () => {
    //         clearInterval(intervalId);
    //     };
    // }, [handleChangeTheme, theme]);

    return (
        // <div className={styles.nav}>
        //     {landingNavItem.map((item, index) => (
        //         <Link
        //             to={item.id}
        //             offset={-50}
        //             smooth={true}
        //             duration={500}
        //             key={`landingNavItem-${index}`}
        //         >
        //             <h3>{item.text}</h3>
        //         </Link>
        //     ))}
        // </div>
        <ShiftingDropDown theme={theme} handleChangeTheme={handleChangeTheme} />
    )
}

const ShiftingDropDown = ({ theme, handleChangeTheme }) => {
    return (
        <div className={styles.nav}>
            <div className={styles.theme_changer} onClick={() => handleChangeTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? <FiSun size={'18px'} /> : <FiMoon size={'18px'} />}
            </div>
            <Tabs />
        </div>
    )
}

const Tabs = () => {
    const [selected, setSelected] = useState(null);
    const [dir, setDir] = useState(null);

    const handleSetSelected = (val) => {
        if (typeof selected === "number" && typeof val === "number") {
            setDir(selected > val ? "r" : "l");
        } else if (val === null) {
            setDir(null);
        }

        setSelected(val);
    };

    return (
        <div
            onMouseLeave={() => handleSetSelected(null)}
            className={styles.tabs}
        >
            {TABS.map((t) => {
                return (
                    <Tab
                        key={t.id}
                        selected={selected}
                        handleSetSelected={handleSetSelected}
                        tab={t.id}
                        useDropdown={t.useDropdown}
                    >
                        {t.text}
                    </Tab>
                );
            })}

            <AnimatePresence>
                {selected && <Content dir={dir} selected={selected} />}
            </AnimatePresence>
        </div>
    )
}

const Tab = ({ children, tab, useDropdown, handleSetSelected, selected }) => {
    return (
        <button
            id={`shift-tab-${tab}`}
            onMouseEnter={() => handleSetSelected(useDropdown ? tab : null)}
            onClick={() => handleSetSelected(useDropdown ? tab : null)}
            className={`${styles.tab} ${!useDropdown ? styles.simple : ''} ${selected === tab ? styles.active : ''}`}
        >
            <span>{children}</span>
            {useDropdown ?
                <FiChevronDown className={`${styles.tab_arrow} ${selected === tab ? styles.active : ''}`} />
                :
                null
            }
        </button>
    );
};

const Content = ({ selected, dir }) => {
    return (
        <motion.div
            id="overlay-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={styles.content}
        >
            <Bridge />
            <Nub selected={selected} />

            {TABS.map((t) => {
                return (
                    <div style={{ overflow: 'hidden' }} key={t.id}>
                        {selected === t.id && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: dir === "l" ? 100 : dir === "r" ? -100 : 0,
                                }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                                <t.Component />
                            </motion.div>
                        )}
                    </div>
                );
            })}
        </motion.div>
    );
};

const Bridge = () => (
    <div className={styles.bridge} />
);

const Nub = ({ selected }) => {
    const [left, setLeft] = useState(0);

    useEffect(() => {
        moveNub();
    }, [selected]);

    const moveNub = () => {
        if (selected) {
            const hoveredTab = document.getElementById(`shift-tab-${selected}`);
            const overlayContent = document.getElementById("overlay-content");

            if (!hoveredTab || !overlayContent) return;

            const tabRect = hoveredTab.getBoundingClientRect();
            const { left: contentLeft } = overlayContent.getBoundingClientRect();

            const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;

            setLeft(tabCenter);
        }
    };

    return (
        <motion.span
            style={{
                clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)",
            }}
            animate={{ left }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={styles.nub}
        />
    );
};

const Feature = () => {
    return (
        <div className={styles.nav__item_feature}>
            <a
                href="#"
                className={styles.link}
            >
                <FiHome className={styles.icon} />
                <span className={styles.text}>Startup</span>
            </a>
            <a
                href="#"
                className={styles.link}
            >
                <FiBarChart2 className={styles.icon} />
                <span className={styles.text}>Scaleup</span>
            </a>
            <a
                href="#"
                className={styles.link}
            >
                <FiPieChart className={styles.icon} />
                <span className={styles.text}>Enterprise</span>
            </a>
            <a
                href="#"
                className={styles.link}
            >
                <FiBarChart2 className={styles.icon} />
                <span className={styles.text}>Scaleup</span>
            </a>
            <a
                href="#"
                className={styles.link}
            >
                <FiPieChart className={styles.icon} />
                <span className={styles.text}>Enterprise</span>
            </a>
            <a
                href="#"
                className={styles.link}
            >
                <FiHome className={styles.icon} />
                <span className={styles.text}>Startup</span>
            </a>
        </div>
    );
};

const Blog = () => {
    return (
        <div className={styles.nav__item_blog}>
            <div className={styles.link}>
                <a href="#" className={styles.link_item}>
                    <div className={styles.thumbnail} />
                    <h4 className={styles.text}>Lorem ipsum dolor</h4>
                    <p className={styles.description}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet illo
                        quidem eos.
                    </p>
                </a>
                <a href="#" className={styles.link_item}>
                    <div className={styles.thumbnail} />
                    <h4 className={styles.text}>Lorem ipsum dolor</h4>
                    <p className={styles.description}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet illo
                        quidem eos.
                    </p>
                </a>
                <a href="#" className={styles.link_item}>
                    <div className={styles.thumbnail} />
                    <h4 className={styles.text}>Lorem ipsum dolor</h4>
                    <p className={styles.description}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet illo
                        quidem eos.
                    </p>
                </a>
            </div>
            <button className={styles.more}>
                <span>View more</span>
                <FiArrowRight />
            </button>
        </div>
    );
};

const COMPONENTS = { feature: Feature, blog: Blog }
const TABS = landingNavItem.map((x, index) => ({ ...x, id: index + 1, useDropdown: x?.dropdown ? true : false, Component: COMPONENTS[x.sectionId] || null }));