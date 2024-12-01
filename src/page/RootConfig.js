// #region TYPE DEPEDENCY
import { LinkProps } from 'next/link';
import * as React from 'react';
import { ButtonLinkProps } from './RootUniversitasSection';
// #endregion

export const GLOBAL_VIEWPORT_ONCE = true;

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
 * @type {Array<{count:number, style:React.CSSProperties}>}
 */
export const UNIVERSITAS_ITEMS_LAYOUT = [
    { count: 1, style: { marginTop: 90, display: (x, y) => x < 425 ? 'none' : 'block' } },
    { count: 3, style: {} },
    { count: 2, style: { marginTop: 45 } },
    { count: 3, style: {} },
    { count: 1, style: { marginBottom: 90, display: (x, y) => x < 425 ? 'none' : 'block' } },
];

// #endregion