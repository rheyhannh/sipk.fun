// #region TYPE DEPEDENCY
import { NavItem } from '@/constant/client';
import { LinkProps as LinkToProps } from 'next/link';
import { LinkProps as ScrollToProps } from 'react-scroll';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { Link as ScrollTo } from 'react-scroll';
import LinkTo from 'next/link';
// #endregion

/**
 * Props yang digunakan component `Link`
 * @typedef {Object} LinkProps
 * @property {NavItem} item
 * - Tag : `required`
 * @property {LinkToProps} [routingOptions]
 * Opsi yang digunakan untuk routing
 * - Tag : `optional`
 * @property {ScrollToProps} [scrollOptions]
 * Opsi yang digunakan untuk scroll
 * - Tag : `optional`
 */

/**
 * Component untuk melakukan routing atau scroll ke elemen tertentu.
 * Props `item` harus dipass dengan property `href` atau `elementId`, dimana `href` sebagai tujuan routing
 * dan `elementId` sebagai target scroll element.
 * 
 * - Saat href tersedia maka akan menggunakan component Link pada `'next/link'` untuk routing ke `href`
 * - Saat elementId tersedia maka akan menggunakan component Link pada `'react-scroll'` untuk scroll ke `elementId`
 * - Jika keduanya tidak tersedia atau item tidak dipass, maka akan return `null`
 * 
 * @param {React.HTMLProps<HTMLElement> & LinkProps} props Link props
 * @returns {React.ReactElement<React.HTMLProps<HTMLElement> & LinkProps, any>} Rendered component
 * @example
 * ```jsx
 * const navItems = [
 *      {elementId: 'universitas', scrollOptions: { offset: 50 }},
 *      {href: '/dashboard', routingOptions: { prefetch: false }}
 * ]
 * 
 * // Scroll to elementId
 * <Link item={navItems[0]} scrollOptions={{offset:100}} />
 * // Props yang digunakan pada Link akan override opsi yang digunakan pada item
 * // Sehingga component tersebut akan scroll ke #universitas dengan offset 100
 * 
 * // Routing to href
 * <Link item={navItems[1]} routingOptions={{prefetch:true}} />
 * // Props yang digunakan pada Link akan override opsi yang digunakan pada item
 * // Sehingga component tersebut akan routing ke /dashboard dengan prefetch
 * ```
 */
const Link = ({ item, children, routingOptions, scrollOptions, ...props }) => {
    if (!item) {
        console.warn('item should exist!');
        return null;
    }
    if (item?.href) {
        return (
            <LinkTo {...props} href={item.href} {...routingOptions} {...item.routingOptions}>
                {children}
            </LinkTo>
        );
    } else if (item?.elementId) {
        return (
            <ScrollTo {...props} to={item.elementId} {...scrollOptions} {...item.scrollOptions}>
                {children}
            </ScrollTo>
        )
    } else {
        console.warn('href or elementId should exist!');
        return null;
    }
}

export default Link;