'use client'

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

export function Nav() {
    const { data: theme } = useLocalTheme();

    return (
        <div className={styles.nav}>
            {landingNavItem.map((item, index) => (
                <Link
                    to={item.id}
                    offset={-50}
                    smooth={true}
                    duration={500}
                    key={`landingNavItem-${index}`}
                >
                    <h3>{item.text}</h3>
                </Link>
            ))}
        </div>
    )
}