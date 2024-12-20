// #region TYPE DEPEDENCY
import { LinkProps as NextLinkProps } from "next/link";
import { LinkProps as ReactScrollProps } from "react-scroll";
// #endregion

// #region ICON DEPEDENCY
import { AiOutlineAppstore } from 'react-icons/ai';
import { BsJournalBookmark } from 'react-icons/bs';
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
 * @property {React.AnchorHTMLAttributes<HTMLAnchorElement> & NextLinkProps} routingOptions 
 * Props atau opsi yang digunakan untuk routing dengan component Link pada `'next/link'`.
 * @property {ReactScrollProps} scrollOptions 
 * Props atau opsi yang digunakan untuk scroll dengan component Link pada `'react-scroll'`.
 */

/** 
 * Dashboard page navigation item
 * @type {Array<NavItem>}
 */
export const dashboardNavItem = [
    {
        text: 'Dashboard',
        elementId: null,
        href: '/dashboard',
        icon: <AiOutlineAppstore size={'24px'} />,
        iconName: 'AiOutlineAppstore',
        iconLib: 'ai',
        routingOptions: {
            prefetch: false
        },
    },
    {
        text: 'Matakuliah',
        elementId: null,
        href: '/dashboard/matakuliah',
        icon: <BsJournalBookmark size={'24px'} />,
        iconName: 'BsJournalBookmark',
        iconLib: 'bs',
        routingOptions: {
            prefetch: false
        },
    },
];