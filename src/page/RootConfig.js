// #region TYPE DEPEDENCY
import { LinkProps } from 'next/link';
import * as React from 'react';
import { ButtonLinkProps } from './RootUniversitasSection';
import { NavItem } from '@/constant/client';
// #endregion

export const GLOBAL_VIEWPORT_ONCE = true;

// #region Header and Navigation Confi 

/**
 * Array yang berisikan link yang digunakan pada navbar. Gunakan props `elementId` untuk scroll ke section atau element tertentu,
 * gunakan `href` untuk routing ke url tertentu. 
 * 
 * Saat url dibuka pada tab baru, pastikan pass `true` pada props `isOpenNewTab` untuk
 * menambahkan icon dan target `_blank` pada element anchor.
 * 
 * Untuk opsi lanjutan dapat diatur pada props `routingOptions` untuk opsi routing dan `scrollOptions` untuk opsi scroll.
 * @type {Array<Omit<NavItem, 'icon' | 'iconName' | 'iconLib' | 'dropdown'> & {isOpenNewTab:boolean}>}
 */
export const HEADER_NAVIGATION_SHORCUTS = [
    {
        text: 'Tentang',
        elementId: 'tentang',
        href: null
    },
    {
        text: 'Fitur',
        elementId: 'fitur',
        href: null
    },
    {
        text: 'Testimoni',
        elementId: 'testimoni',
        href: null
    },
    {
        text: 'Panduan',
        elementId: null,
        href: '/panduan',
    },
]

// #endregion

// #region Universitas Section Config

/**
 * Judul atau headline yang digunakan pada section `Universitas`
 * @type {string}
 */
export const UNIVERSITAS_SECTION_TITLE = 'Untuk Siapa?';

/**
 * Deskripsi yang digunakan pada section `Universitas`. Dapat menggunakan placeholder berikut,
 * - `{jumlah_universitas}` : Jumlah universitas yang tersedia
 * @type {string}
 */
export const UNIVERSITAS_SECTION_DESCRIPTION = 'Saat ini, SIPK tersedia untuk mahasiswa dari {jumlah_universitas} universitas yang didukung. Apapun jurusan atau program pendidikanmu, selama universitasmu ada dalam daftar, kamu bisa menggunakan SIPK.';

/**
 * Button yang ditampilkan pada section `Universitas`
 * @type {Array<Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps & ButtonLinkProps>}
 */
export const UNIVERSITAS_SECTION_BUTTON = [
    { text: 'Pelajari Lebih Lanjut', type: 'secondary', href: 'https://medium.com', isOpenNewTab: true, tabIndex: 0 },
    { text: 'Mulai Sekarang', href: '/users?action=daftar', scroll: false, tabIndex: 0 }
]

/**
 * Array yang berisikan object yang mendeskripsikan bagaimana layout icon universitas dibuat.
 * 
 * Setiap entries berperan sebagai sebuah container dengan key sebagai berikut,
 * - `count` : Jumlah icon pada container 
 * - `style` : Style yang digunakan pada container
 * 
 * Value pada atribut style dapat berupa callback function yang menerima dua parameter dimana 
 * parameter `pertama` bernilai client viewport width dan parameter `kedua` bernilai client viewport
 * height
 * 
 * @example
 * ```js
 * const UNIVERSITAS_ITEMS_LAYOUT = {
 *      {
 *          count: 1,
 *          style: {
 *              marginTop: 15,
 *              // viewportWidth - viewportHeight + 300
 *              marginBottom: (x, y) => x - y + 300, 
 *          }
 *      }
 * }
 * ```
 * 
 * @type {Array<{count:number, style:{[K in keyof React.CSSProperties]: React.CSSProperties[K] | (viewportWidth:number, viewportHeight:number) => React.CSSProperties[K]}}
 */
export const UNIVERSITAS_ITEMS_LAYOUT = [
    { count: 1, style: { marginTop: 90, display: (x, y) => x < 425 ? 'none' : 'block' } },
    { count: 3, style: {} },
    { count: 2, style: { marginTop: 45 } },
    { count: 3, style: {} },
    { count: 1, style: { marginBottom: 90, display: (x, y) => x < 425 ? 'none' : 'block' } },
];

// #endregion