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
 * @returns {React.ReactElement} Rendered component
 */
const Link = ({ item, children, ...props }) => {
    if (!item) {
        console.warn('item should exist!');
        return null;
    }
    if (item?.href) {
        return (
            <LinkTo href={item.href} {...item.routingOptions} {...props}>
                {children}
            </LinkTo>
        );
    } else if (item?.elementId) {
        return (
            <ScrollTo to={item.elementId} {...item.scrollOptions} {...props}>
                {children}
            </ScrollTo>
        )
    } else {
        console.warn('href or elementId should exist!');
        return null;
    }
}

export default Link;