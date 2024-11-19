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
    { text: 'Pelajari Lebih Lanjut', type: 'secondary', href: 'https://medium.com', isOpenNewTab: true },
    { text: 'Mulai Sekarang', href: '/users?action=daftar', scroll: false }
]

// #endregion