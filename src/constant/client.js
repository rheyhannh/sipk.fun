// #region TYPE DEPEDENCY
import { LinkProps as NextLinkProps } from "next/link";
import { LinkProps as ReactScrollProps } from "react-scroll";
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region VARIABLE DEPEDENCY
import { CONTENTS as howContents } from "@/component/landing/sections/How";
// #endregion

/**
 * @typedef {Object} NavItem Object yang merepresentasikan navigation item link
 * @property {string} text Display teks item
 * @property {string|null} sectionId Section id saat item diklik, ex: `'feature'` (tanpa `'#'`). Property ini dapat bernilai `null`.
 * @property {string|null} href URL path saat item diklik, ex: `'/dashboard'`. Property ini dapat bernilai `null`.
 * @property {string} icon Nama icon yang digunakan. Lihat {@link https://react-icons.github.io/react-icons/ react-icons}, ex: `'FaRocket', 'IoAdd', etc`
 * @property {string} lib Library icon yang digunakan. Lihat {@link https://react-icons.github.io/react-icons/ react-icons}, ex: `'fa', 'io5', etc`
 * @property {Array<NavItem>|null} dropdown List dropdown jika tersedia. Property ini dapat bernilai `null`. 
 */

export const dashboardNavItem = [
    { text: 'Dashboard', elementId: null, href: '/dashboard', iconName: 'AiOutlineAppstore', iconLib: 'ai' },
    { text: 'Matakuliah', elementId: null, href: '/dashboard/matakuliah', iconName: 'BsJournalBookmark', iconLib: 'bs' },
];

export const landingNavItem = [
    { text: 'Home', elementId: 'landing', href: null, iconName: 'AiOutlineAppstore', iconLib: 'ai' },
    {
        text: 'How', elementId: 'how', href: null, iconName: 'AiOutlineAppstore', iconLib: 'ai',
        dropdown: howContents.map((x) => ({
            text: x.short, elementId: x.id, href: null, iconName: x.iconName, iconLib: x.iconLib,
        }))
    },
    { text: 'Universitas', elementId: 'universitas', href: null, iconName: 'AiOutlineAppstore', iconLib: 'ai' },
    { text: 'Testimoni', elementId: 'testimoni', href: null, iconName: 'AiOutlineAppstore', iconLib: 'ai' },
    { text: 'Blog', elementId: 'blog', href: null, iconName: 'AiOutlineAppstore', iconLib: 'ai', dropdown: [] },
    { text: 'Context', elementId: 'context', href: null, iconName: 'AiOutlineAppstore', iconLib: 'ai' },
]