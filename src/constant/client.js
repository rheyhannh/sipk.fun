/**
 * @typedef {Object} NavItem Object yang merepresentasikan navigation item link
 * @property {string} text Display teks item
 * @property {string} href URL path saat item diklik, ex: `'/dashboard'`
 * @property {string} icon Nama icon yang digunakan. Lihat {@link https://react-icons.github.io/react-icons/ react-icons}, ex: `'FaRocket', 'IoAdd', etc`
 * @property {string} lib Library icon yang digunakan. Lihat {@link https://react-icons.github.io/react-icons/ react-icons}, ex: `'fa', 'io5', etc`
 */

/** @type {Array<NavItem>} Dashboard navigation item */
const dashboardNavItem = [
    { text: 'Dashboard', href: '/dashboard', icon: 'AiOutlineAppstore', lib: 'ai' },
    { text: 'Matakuliah', href: '/dashboard/matakuliah', icon: 'BsJournalBookmark', lib: 'bs' },
];

export { 
    dashboardNavItem 
};