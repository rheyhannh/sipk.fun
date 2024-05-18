/**
 * @typedef {Object} NavItem Object yang merepresentasikan navigation item link
 * @property {string} text Display teks item
 * @property {string|null} sectionId Section id saat item diklik, ex: `'feature'` (tanpa `'#'`). Property ini dapat bernilai `null`.
 * @property {string|null} href URL path saat item diklik, ex: `'/dashboard'`. Property ini dapat bernilai `null`.
 * @property {string} icon Nama icon yang digunakan. Lihat {@link https://react-icons.github.io/react-icons/ react-icons}, ex: `'FaRocket', 'IoAdd', etc`
 * @property {string} lib Library icon yang digunakan. Lihat {@link https://react-icons.github.io/react-icons/ react-icons}, ex: `'fa', 'io5', etc`
 */

/** @type {Array<NavItem>} Dashboard page navigation item */
const dashboardNavItem = [
    { text: 'Dashboard', sectionId: null, href: '/dashboard', icon: 'AiOutlineAppstore', lib: 'ai' },
    { text: 'Matakuliah', sectionId: null, href: '/dashboard/matakuliah', icon: 'BsJournalBookmark', lib: 'bs' },
];

/** @type {Array<NavItem>} Landing page navigation item */
const landingNavItem = [
    { text: 'Home', sectionId: 'landing', href: null, icon: 'AiOutlineAppstore', lib: 'ai' },
]

export { 
    dashboardNavItem,
    landingNavItem
};