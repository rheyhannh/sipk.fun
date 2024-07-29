'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region REACT DEPEDENCY
import { useEffect, useState, useContext } from "react";
// #endregion

// #region COMPONENT DEPEDENCY
import { Link } from 'react-scroll';
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from '@/component/loader/ReactIcons';
import { LandingContext } from "@/component/provider/Landing";
// #endregion

// #region DATA DEPEDENCY
import { landingNavItem } from '@/constant/client';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/landing.module.css'
// #endregion

// #region ICON DEPEDENCY
import {
    FiArrowRight,
    FiChevronDown,
} from "react-icons/fi";
// #endregion

/**
 * Render landing page nav
 * @returns {ReactElement} Element react untuk render landing page nav
 */
export function Nav() {
    return (
        <ShiftingDropDown />
    )
}

const ShiftingDropDown = () => {
    return (
        <div className={styles.nav}>
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
                        item={t}
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

const Tab = ({ children, item, tab, useDropdown, handleSetSelected, selected }) => {
    return (
        <Link
            id={`shift-tab-${tab}`}
            to={item.sectionId}
            offset={-72}
            smooth={'easeInOutQuart'}
            duration={1500}
            onMouseEnter={() => handleSetSelected(useDropdown ? tab : null)}
            className={`${styles.tab} ${!useDropdown ? styles.simple : ''} ${selected === tab ? styles.active : ''}`}
        >
            <span>{children}</span>
            {useDropdown ?
                <FiChevronDown className={`${styles.tab_arrow} ${selected === tab ? styles.active : ''}`} />
                :
                null
            }
        </Link>
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
                                <t.Component {...(t.dropdown && { dropdown: t.dropdown })} />
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

/**
 * Render nav item `feature` dropdown
 * @param {{dropdown:landingNavItem|null}} props React props object 
 * @param props.dropdown Dropdown yang tesedia pada `landingNavItem` dengan `sectionId=feature`. Props ini dipass secara otomatis jika dropdown tersedia (lihat component `Content`) atau null
 * @returns {ReactElement} Element react untuk render nav item `feature` dropdown 
 */
const How = ({ dropdown = null }) => {
    return (
        <div className={styles.nav__item_feature}>
            {dropdown.map((item, index) => {
                return (
                    <Link
                        to={item.sectionId}
                        offset={-72}
                        smooth={'easeInOutQuart'}
                        duration={1500}
                        className={styles.link}
                        key={`landingNavFeatureItem-${index}`}
                    >
                        <div className={styles.icon}>
                            <Icon name={item.icon} lib={item.lib} />
                        </div>
                        <span className={styles.text}>{item.text}</span>
                    </Link>
                )
            })}
        </div>
    );
};

/**
 * Render nav item `blog` dropdown
 * @param {{dropdown:landingNavItem|null}} props React props object 
 * @param props.dropdown Dropdown yang tesedia pada `landingNavItem` dengan `sectionId=blog`. Props ini dipass secara otomatis jika dropdown tersedia (lihat component `Content`) atau null
 * @returns {ReactElement} Element react untuk render nav item `blog` dropdown 
 */
const Blog = ({ dropdown = null }) => {
    /** @type {ContextTypes.LandingContext} */
    const { data: { notifikasi } } = useContext(LandingContext);
    const latestNotifikasi = notifikasi.sort((a, b) => b.unix_created_at - a.unix_created_at).slice(0, 3);

    const truncateText = (text, maxLength = 60) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength - 3) + '...';
    };

    return (
        <div className={styles.nav__item_blog}>
            <div className={styles.link}>
                {latestNotifikasi.map((item, index) => {
                    return (
                        <a href={item.href} className={styles.link_item} key={`landingNavBlogItem-${index}`}>
                            <div style={{ color: item.color }} className={styles.thumbnail}>
                                <Icon name={item.icon.name} lib={item.icon.lib} />
                            </div>
                            <h4 style={{ color: item.color }} className={styles.text}>{item.title}</h4>
                            <p className={styles.description}>
                                {truncateText(item.description)}
                            </p>
                        </a>
                    )
                })}
            </div>
            <button className={styles.more}>
                <span>Selengkapnya</span>
                <FiArrowRight />
            </button>
        </div>
    );
};

const COMPONENTS = { how: How, blog: Blog }
const TABS = landingNavItem.map((x, index) => ({ ...x, id: index + 1, useDropdown: x?.dropdown ? true : false, Component: COMPONENTS[x.sectionId] || null }));