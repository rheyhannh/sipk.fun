// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region NEXT DEPEDENCY
import Link from 'next/link';
// #endregion

// #region COMPONENT DEPEDENCY
import { Link as Scroll } from 'react-scroll';
// #endregion

/**
 * Props yang digunakan component `Linkto`
 * @typedef {Object} LinktoProps
 * @property {Object} item
 * @property {string} item.elementId 
 * Id element untuk scroll tanpa tanda pagar `#`. Saat `href` tersedia, props ini optional.
 * 
 * - Contoh : `feature`
 * @property {string} item.href 
 * URL atau path untuk navigasi atau routing. Saat `elementId` tersedia, props ini optional.
 * 
 * - Contoh : `/dashboard`
 * @property {Omit<import('next/link').LinkProps, 'href'>} [item.routingOptions]
 * Opsi yang digunakan untuk routing dengan {@link Link next/link}, selengkapnya lihat {@link https://nextjs.org/docs/13/pages/api-reference/components/link#props disini} 
 * @property {Omit<Omit<import('react-scroll').LinkProps, keyof React.HTMLProps<HTMLButtonElement>>, 'to'> & {onClick?:import('react-scroll').LinkProps['onClick']}} [item.scrollOptions]
 * Opsi yang digunakan untuk scroll dengan {@link Scroll react-scroll}, selengkapnya lihat {@link https://www.npmjs.com/package/react-scroll#propsoptions disini} 
 * @property {Omit<import('next/link').LinkProps, 'href'>} [routingOptions] 
 * Opsi yang digunakan untuk routing dengan {@link Link next/link}, selengkapnya lihat {@link https://nextjs.org/docs/13/pages/api-reference/components/link#props disini} 
 * @property {Omit<Omit<import('react-scroll').LinkProps, keyof React.HTMLProps<HTMLButtonElement>>, 'to'> & {onClick?:import('react-scroll').LinkProps['onClick']}} [scrollOptions] 
 * Opsi yang digunakan untuk scroll dengan {@link Scroll react-scroll}, selengkapnya lihat {@link https://www.npmjs.com/package/react-scroll#propsoptions disini} 
 * @property {boolean} [blurOnClick]
 * Boolean untuk blur element setelah diclick dengan menggunakan `onClickCapture`.
 * 
 * - Default : `true`
 */

/**
 * Component untuk melakukan routing menggunakan {@link Link next/link} atau scroll ke elemen tertentu menggunakan {@link Scroll react-scroll}.
 * Untuk melakukan routing, pass `href` pada props `item` sedangkan untuk melakukan scroll, pass property `elementId`.
 * Component ini ideal untuk case routing dengan styling menggunakan `className` atau custom component dan untuk case scroll dengan styling menggunakan `className`.
 * 
 * @param {React.AnchorHTMLAttributes<HTMLAnchorElement> & LinktoProps} props Linkto props
 * @returns {React.ReactElement<LinktoProps, HTMLAnchorElement>}
 * @see Next.js {@link https://nextjs.org/docs/13/pages/api-reference/components/link Link docs}  & react-scroll {@link https://www.npmjs.com/package/react-scroll docs} 
 * @example
 * ```jsx
 * const items = [
 *      { elementId: 'universitas', scrollOptions: { offset: 50 } },
 *      { href: '/dashboard', routingOptions: { prefetch: false } },
 *      { href: 'https://www.tiktok.com/', elementId: 'feature' },
 * ]
 * 
 * // Scroll to elementId
 * <Linkto item={items[0]} scrollOptions={{offset:100}} />
 * // Opsi scroll yang digunakan item akan mengoverride opsi scroll pada props Linkto
 * // Ini akan scroll ke #universitas dengan offset 50
 * 
 * // Routing to href
 * <Linkto item={items[1]} routingOptions={{prefetch:true}} />
 * // Opsi routing yang digunakan item akan mengoverride opsi routing pada props Linkto
 * // Ini akan routing ke /dashboard tanpa prefetch
 * 
 * // Another Example
 * <Linkto item={items[2]} />
 * // Jika href dan elementId tersedia, routing akan digunakan
 * // Ini akan routing ke https://www.tiktok.com/
 * ```
 */
const Linkto = ({
    item,
    routingOptions,
    scrollOptions,
    blurOnClick = true,
    children,
    ...props
}) => {
    if (!item) {
        console.warn('Linkto item should exist!');
        return null;
    }

    const handleBlur = blurOnClick ? /** @type {React.AnchorHTMLAttributes<HTMLAnchorElement>} */ ({
        onClickCapture: (event) => {
            event.currentTarget.blur()
        },
    }) : {};

    const sharedProps = {
        ...props,
        ...(item?.href ? routingOptions : scrollOptions),
        ...(item?.href ? item?.routingOptions : item?.scrollOptions),
        ...handleBlur,
    };

    if (item?.href) {
        return (
            <Link {...sharedProps} href={item.href}>
                {children}
            </Link>
        );
    }

    if (item?.elementId) {
        return (
            <Scroll {...sharedProps} to={item.elementId}>
                {children}
            </Scroll>
        );
    }

    console.warn('Linkto item should have either href or elementId!');
    return null;
}

export default Linkto;