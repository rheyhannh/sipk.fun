// ========== COMPONENT DEPEDENCY ========== //

/*
============================== CODE START HERE ==============================
*/

// Date or Time Utility
/**
 * Method untuk mengubah unix timestamp ke format tanggal tertentu
 * @param {number} unix Milidetik dalam integer (ex: `Date.Now() / 1000`)
 * @param {string} [intlLocales=null] Unicode locale identifier (ex: `en-US`, `id-ID`, etc)
 * @param {object} [intlFormatOptions=null] Opsi pada `Intl.DateTimeFormatOptions`
 * @return {string} Format tanggal tertentu (ex: `Minggu, 03 Desember 2023`)
 */
export const unixToDate = (unix, intlLocales = null, intlFormatOptions = null) => {
    const date = new Date(unix * 1000);
    return date.toLocaleString(intlLocales || 'id-ID', intlFormatOptions || { dateStyle: 'full' });
}

// Message or Response Utility
/**
 * Method untuk mendapatkan pesan loading lucu/tidak dengan indeks tertentu atau random
 * @param {boolean} [funWord=false] Boolean untuk menggunakan kata lucu atau tidak. Default value `false`
 * @param {number} [index=true] Number untuk memilih index kata. Default value `true` yaitu menggunakan index random. Gunakan `number` untuk pilih indeks tertentu (tidak random).
 * @return {string} Pesan atau teks loading yang tersedia. Jika tidak tersedia default `funWord=true` 'Memproses Keajaiban', default `funWord=false` 'Memproses permintaanmu'
 */
export const getLoadingMessage = (funWord = false, index = true) => {
    const message = {
        fun: [
            'Memproses keajaiban',
            'Kunci adalah sabar',
            'Membaca pikiranmu'
        ],
        default: [
            'Memproses',
            'Memproses permintaanmu',
            'Tunggu sebentar',
            'Membuat',
            'Memperbarui',
            'Menyimpan',
        ]
    }

    const maximumIndex = funWord ? message.fun.length : message.default.length;
    const usedIndex = index === true ? Math.floor(Math.random() * maximumIndex) : index === 0 ? 0 : index;
    return funWord ? message.fun[usedIndex] || 'Memproses Keajaiban' : message.default[usedIndex] || 'Memproses permintaanmu';
}

// Settings or Preferences Utility
export const getLocalTheme = () => {
    const localTheme = localStorage.getItem('_theme');
    if (!localTheme) { localStorage.setItem('_theme', 'light'); }
    document.body.classList.toggle('dark-theme', localTheme === 'dark');
    const isDarkTheme = localTheme ? localTheme === 'dark' : false;
    return isDarkTheme ? 'dark' : 'light';
}

export const getSessionTable = () => {
    const savedState = sessionStorage.getItem('_table');
    if (savedState) {
        try {
            const allowedKeys = ['nomor', 'matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target'];
            const state = JSON.parse(savedState);
            const validateTab = (tab) => {
                const allowedTab = [0, 1, 2];
                if (allowedTab.includes(tab)) {
                    return tab;
                }
                return null;
            }
            const validatePageSize = (size) => {
                const allowedPageSize = [5, 10, 25, 50, 100, -1];
                if (allowedPageSize.includes(size)) {
                    return size;
                }
                return null;
            }
            const validatePageControlPosition = (state) => {
                const allowedPageControlPosition = [0, 1, 2];
                if (allowedPageControlPosition.includes(state)) {
                    return state;
                }
                return null;
            }
            const validateColumnOrder = (arr) => {
                const isValid = () => {
                    if (arr.length !== 7) {
                        return false;
                    }
                    for (const str of allowedKeys) {
                        if (!arr.includes(str)) {
                            return false;
                        }
                    }
                    return true;
                }
                return isValid ? arr : null;
            }
            const validateColumnVisibility = (obj) => {
                const keys = Object.keys(obj);
                if (keys.length !== 7 || !keys.every(key => allowedKeys.includes(key))) {
                    return null;
                }

                const values = Object.values(obj);
                if (!values.every(value => typeof value === 'boolean')) {
                    return null;
                }

                return obj;
            }
            const validateColumnFilters = (arr) => {
                const validId = ['matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target'];
                const isValid = arr.every(obj => {
                    if (Object.keys(obj).length !== 2 || !obj.hasOwnProperty('id') || !obj.hasOwnProperty('value')) {
                        return false;
                    }
                    if (!validId.includes(obj.id)) {
                        return false;
                    }
                    return true;
                })
                return isValid ? arr : null;
            }
            const validateColumnSorting = (arr) => {
                const validId = ['matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target'];
                const isValid = arr.every(obj => {
                    if (Object.keys(obj).length !== 2 || !obj.hasOwnProperty('id') || !obj.hasOwnProperty('desc')) {
                        return false;
                    }
                    if (!validId.includes(obj.id)) {
                        return false;
                    }
                    return true;
                })
                return isValid ? arr : null;
            }

            if (
                'tab' in state && typeof state.tab === 'number' &&
                'pageSize' in state && typeof state.pageSize === 'number' &&
                'pageIndex' in state && typeof state.pageIndex === 'number' &&
                'pageControlPosition' in state && typeof state.pageControlPosition === 'number' &&
                'columnOrder' in state && Array.isArray(state.columnOrder) &&
                'columnVisibility' in state && typeof state.columnVisibility === 'object' && state.columnVisibility !== null && !Array.isArray(state.columnVisibility) &&
                'columnFilters' in state && Array.isArray(state.columnFilters) &&
                'columnSorting' in state && Array.isArray(state.columnSorting)
            ) {
                const {
                    tab, pageSize, pageIndex,
                    pageControlPosition, columnOrder,
                    columnVisibility, columnFilters,
                    columnSorting
                }
                    = state;
                return {
                    tab: validateTab(tab),
                    pageSize: validatePageSize(pageSize),
                    pageIndex: pageIndex,
                    pageControlPosition: validatePageControlPosition(pageControlPosition),
                    columnOrder: validateColumnOrder(columnOrder),
                    columnVisibility: validateColumnVisibility(columnVisibility),
                    columnFilters: validateColumnFilters(columnFilters),
                    columnSorting: validateColumnSorting(columnSorting)
                }
            } else { throw new Error('Invalid table state') }
        } catch (error) {
            sessionStorage.removeItem('_table');
            console.error(error?.message || 'Something went wrong');
            console.error('Using table settings from preferences');
            return {
                tab: null,
                pageSize: null,
                pageIndex: null,
                pageControlPosition: null,
                columnOrder: null,
                columnVisibility: null,
                columnFilters: null,
                columnSorting: null
            }
        }
    } else {
        return {
            tab: null,
            pageSize: null,
            pageIndex: null,
            pageControlPosition: null,
            columnOrder: null,
            columnVisibility: null,
            columnFilters: null,
            columnSorting: null
        }
    }
}
