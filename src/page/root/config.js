// #region TYPE DEPEDENCY
import * as React from 'react';
import { NavItem } from '@/constant/client';
// #endregion

/**
 * Mendefinisikan opsi yang digunakan pada props `viewport.once` untuk setiap element yang menggunakan animasi atau component `motion`.
 * 
 * Saat bernilai `true` maka animasi masuk hanya ditampilkan sekali sedangkan saat `false` animasi dapat ditampilkan berulang kali setiap element masuk ke viewport.
 * Umumnya opsi ini hanya akan bernilai `false` saat debug pada fase `development`
 * @type {boolean}
 */
export const GLOBAL_VIEWPORT_ONCE = true;

// #region Header and Navigation Config 

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
        text: 'Untuk?',
        elementId: 'universitas',
        href: null
    },
    {
        text: 'Kenapa?',
        elementId: 'kenapa_sipk',
        href: null
    },
    {
        text: 'Fitur?',
        elementId: 'fitur',
        href: null
    },
    {
        text: 'FAQ!',
        elementId: null,
        href: '/faq',
    },
]

// #endregion

// #region Hero Section Config 

/**
 * Attribute `id` yang digunakan pada element section pada section `Hero`
 */
export const HERO_SECTION_ID = 'home';

/**
 * Atribute `id` yang digunakan component `Banner` pada section `Hero`
 */
export const HERO_BANNER_ID = 'hero-cta-banner';

/**
 * Offset delay animasi yang digunakan untuk setiap kata pada {@link HERO_TITLE_PARAGRAPH judul} section `Hero`
 */
export const HERO_TITLE_DELAY_OFFSET = 0.175;

/**
 * Array yang mendeskripsikan paragraf dan kata sebagai judul yang digunakan pada section `Hero`
 */
export const HERO_TITLE_PARAGRAPH = [
    ['Perhitungan', 'IPK'],
    ['yang', 'Akurat', 'dengan', 'Matakuliah', 'Dinamis']
]

/**
 * Props yang digunakan component `Title` pada section `Hero`
 */
export const HERO_TITLE_PROPS = /** @type {import('@root_page/sections/hero').TitleProps} */ ({
    id: 'hero-title',
    label: 'SIPK Introduction'
});

/**
 * Deskripsi yang digunakan pada section `Hero`
 */
export const HERO_DESCRIPTION_TEXT = 'SIPK memungkinkan kalian menyimpan seluruh matakuliah dengan SKS dan nilai yang kalian tentukan sendiri untuk memvisualisasikan perolehan IPK secara lebih fleksibel dan proaktif.'

/**
 * Array yang mendeskripsikan button yang digunakan pada section `Hero`
 */
export const HERO_BUTTONS = /** @type {Array<import('@root_page/sections/hero').ButtonItemProps>} */ ([
    {
        id: 'hero-cta-main',
        text: 'Mulai Sekarang',
        href: '/users?action=daftar&utm_source=slp'
    },
    {
        id: 'hero-cta-secondary',
        text: 'Pelajari Lebih Lanjut',
        href: '#universitas'
    }
])

/**
 * Array yang mendeskripsikan notifikasi dummy yang tampil pada section `Hero`
 */
export const HERO_NOTIFIKASI_DUMMY_DATA = /** @type {Array<import('@/types/supabase').NotifikasiData>} */ ([
    {
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "title": "Maintenance",
        "description": "Mohon maaf atas ketidaknyamanannya🙏, SIPK akan melakukan perawatan sistem pada 22 November 2023 jam 19:30 WIB🌙",
        "href": "/update/22112023/maintenance-untuk-pemeliharan-jaringan",
        "icon": {
            "lib": "fa",
            "name": "FaTools"
        },
        "color": "var(--warning-color)",
        "date_created_at": "2023-11-22T06:19:57.158438+00:00",
        "unix_created_at": 1700620147
    },
    {
        "id": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",
        "title": "Announcement",
        "description": "Jaga email dan password kamu, karna admin SIPK tidak pernah meminta email, password atau data pribadi kamu❗",
        "href": "/update/21112023/admin-sipk-tidak-pernah-meminta-password",
        "icon": {
            "lib": "ri",
            "name": "RiLockPasswordLine"
        },
        "color": "var(--danger-color)",
        "date_created_at": "2023-11-22T06:21:26.929915+00:00",
        "unix_created_at": 1700508547
    },
    {
        "id": "zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz",
        "title": "Fitur Baru",
        "description": "Hujan rintik ada payung, payungnya terbang kebekasi, daripada nyariin payung, Mending cek fitur baru disini🏃",
        "href": "/update/20112023/fitur-baru-journey",
        "icon": {
            "lib": "fa",
            "name": "FaRocket"
        },
        "color": "var(--primary-color)",
        "date_created_at": "2023-11-22T06:22:33.95118+00:00",
        "unix_created_at": 1700422147
    }
])

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

// #region Testimoni Section Config 

/**
 * Jumlah minimal rating untuk render section `Testimoni`
 * @type {number}
 */
export const TESTIMONI_MINIMUM_RATING = 20;

// #endregion