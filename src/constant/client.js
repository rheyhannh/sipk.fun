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
 * @property {string} text 
 * Display teks item
 * @property {?string} elementId 
 * Id element saat item diklik tanpa tanda pagar `'#'`
 * - Contoh : `'feature'`
 * - Property ini dapat bernilai `null`
 * @property {?string} href 
 * URL atau path saat item diklik
 * - Contoh : `'/dashboard'`
 * - Property ini dapat bernilai `null`
 * @property {React.ReactElement} icon 
 * Element icon yang digunakan
 * - Contoh : `<FaRocket/>`
 * @property {string} iconName 
 * Nama icon yang digunakan
 * - Contoh : `'FaRocket'`
 * @property {string} iconLib 
 * Library icon yang digunakan
 * - Contoh : `'fa'`
 * @property {Array<NavItem>|null} dropdown 
 * List dropdown jika tersedia
 * - Property ini dapat bernilai `null`
 * @property {React.AnchorHTMLAttributes<HTMLAnchorElement & NextLinkProps} routingOptions 
 * Props atau opsi yang digunakan untuk routing dengan component Link pada `'next/link'`.
 * @property {ReactScrollProps} scrollOptions 
 * Props atau opsi yang digunakan untuk scroll dengan component Link pada `'react-scroll'`.
 */

/** 
 * Dashboard page navigation item
 * @type {Array<NavItem>}
 */
export const dashboardNavItem = [
    { text: 'Dashboard', elementId: null, href: '/dashboard', iconName: 'AiOutlineAppstore', iconLib: 'ai' },
    { text: 'Matakuliah', elementId: null, href: '/dashboard/matakuliah', iconName: 'BsJournalBookmark', iconLib: 'bs' },
];

/** 
 * Landing page navigation item
 * @type {Array<NavItem>}
 */
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