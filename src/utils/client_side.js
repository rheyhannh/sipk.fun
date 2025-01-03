// #region TYPE DEPEDENCY
import {
    CardGrafikState,
    CardTargetState,
    CardDistribusiState
} from '@/component/Card';
import { TableState } from '@/types/table_matakuliah';
// #endregion

// #region UTIL DEPEDENCY
import isStrongPassword from 'validator/lib/isStrongPassword';
import { endpointByKey } from '@/constant/api_endpoint';
// #endregion

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

/**
 * Method untuk mendapatkan fakta default (static) tentang SIPK. Dapat digunakan untuk error handler jika fetch `api/fakta` gagal.
 * @returns {Array<string>} Array of string fakta tentang SIPK yang sudah dishuffle urutan indexnya.
 */
export const getDefaultFakta = () => {
    // Maximum fatka length 160 chars or Lorem20.
    const fakta = [
        'Email Login adalah fitur untuk kamu yang mau login tanpa menggunakan password.',
        'Sampai saat ini, SIPK dapat digunakan mahasiswa dari 10 universitas di Indonesia.',
        'Kamu dapat mengubah target SKS dan Matakuliah dengan rentang 5 sampai dengan 1000.',
        'Matakuliah yang sudah dihapus dapat dikembalikan lagi dari Perubahan Terakhir atau Tabel',
        'Kamu dapat mengubah target IPK dengan rentang 1.00 sampai dengan 4.00',
        'Perubahan Terakhir adalah fitur yang dapat melihat perubahan matakuliah kamu baik itu yang ditambah, dihapus dan diubah.',
        'Kamu dapat menghapus dan mengembalikan matakuliah yang sudah diubah dari Tabel Diubah',
        'Perubahan Terakhir dapat mengembalikan matakuliah yang sudah ditambah, dihapus dan diubah.',
        'Kamu dapat menghapus secara permanent dan mengembalikan matakuliah yang sudah dihapus dari Tabel Dihapus.',
        'Kamu dapat melihat matakuliah yang sudah dihapus pada Tabel Dihapus dan yang sudah diubah pada Tabel Diedit.'
    ]

    // Shuffle array use Fisher-Yates Algorithm
    for (let i = fakta.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fakta[i], fakta[j]] = [fakta[j], fakta[i]];
    }

    return fakta;
}

// Settings or Preferences Utility
/**
 * Method untuk mendapatkan tema yang digunakan dari `localStorage` jika tersedia. Default value `'light'`.
 * @return {"dark"|"light"} Tema yang digunakan `'dark'` atau `'light'`
 */
export const getLocalTheme = () => {
    const localTheme = localStorage.getItem('_theme');
    if (!localTheme) { localStorage.setItem('_theme', 'light'); }
    document.body.classList.toggle('dark-theme', localTheme === 'dark');
    const isDarkTheme = localTheme ? localTheme === 'dark' : false;
    return isDarkTheme ? 'dark' : 'light';
}

/**
 * Method untuk mendapatkan table state dari `sessionStorage` lalu melakukan validasi. Jika tidak valid, maka properties akan bernilai `null`
 * @returns {TableState} Table state object
 */
export const getSessionTable = () => {
    const savedState = sessionStorage.getItem('_table');
    if (savedState) {
        try {
            const allowedKeys = ['nomor', 'matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target', 'ontarget'];
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
                    if (arr.length !== 8) {
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
                if (keys.length !== 8 || !keys.every(key => allowedKeys.includes(key))) {
                    return null;
                }

                const values = Object.values(obj);
                if (!values.every(value => typeof value === 'boolean')) {
                    return null;
                }

                return obj;
            }
            const validateColumnFilters = (arr) => {
                const validId = ['matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target', 'ontarget'];
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
                const validId = ['matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target', 'ontarget'];
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
                'columnSorting' in state && Array.isArray(state.columnSorting) &&
                'rowAction' in state && typeof state.rowAction === 'boolean'
            ) {
                const {
                    tab, pageSize, pageIndex,
                    pageControlPosition, columnOrder,
                    columnVisibility, columnFilters,
                    columnSorting, rowAction
                }
                    = state;
                return {
                    tab: validateTab(tab),
                    pageSize: validatePageSize(pageSize),
                    pageIndex,
                    pageControlPosition: validatePageControlPosition(pageControlPosition),
                    columnOrder: validateColumnOrder(columnOrder),
                    columnVisibility: validateColumnVisibility(columnVisibility),
                    columnFilters: validateColumnFilters(columnFilters),
                    columnSorting: validateColumnSorting(columnSorting),
                    rowAction
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
                columnSorting: null,
                rowAction: null,
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
            columnSorting: null,
            rowAction: null
        }
    }
}

/**
 * Method untuk mendapatkan grafik card state dari `sessionStorage` lalu melakukan validasi. Jika tidak valid, maka properties akan bernilai `null`
 * @returns {CardGrafikState} Grafik card state
 */
export const getSessionGrafik = () => {
    const savedState = sessionStorage.getItem('_grafik');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            if (
                'hideIp' in state && typeof state.hideIp === 'boolean' &&
                'hideMatkul' in state && typeof state.hideMatkul === 'boolean' &&
                'hideSks' in state && typeof state.hideSks === 'boolean'
            ) {
                const { hideIp, hideMatkul, hideSks } = state;
                return {
                    hideIp, hideMatkul, hideSks
                }
            } else { throw new Error('Invalid grafik state') }
        } catch (error) {
            sessionStorage.removeItem('_grafik');
            console.error(error?.message || 'Something went wrong');
            console.error('Using default grafik state');
            return {
                hideIp: null,
                hideMatkul: null,
                hideSks: null
            }
        }
    } else {
        return {
            hideIp: null,
            hideMatkul: null,
            hideSks: null
        }
    }
}

/**
 * Method untuk mendapatkan target card state dari `sessionStorage` lalu melakukan validasi. Jika tidak valid, maka properties akan bernilai `null`
 * @returns {CardTargetState} Target card state
 */
export const getSessionTarget = () => {
    const savedState = sessionStorage.getItem('_target');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            const validateTab = tab => {
                return [0, 1].includes(tab) ? tab : null;
            }

            if (
                'tab' in state && typeof state.tab === 'number' &&
                'swiperIndex' in state && typeof state.swiperIndex === 'number'
            ) {
                const { tab, swiperIndex } = state;
                return {
                    tab: validateTab(tab),
                    swiperIndex
                }
            } else { throw new Error('Invalid target state') }
        } catch (error) {
            sessionStorage.removeItem('_target');
            console.error(error?.message || 'Something went wrong');
            console.error('Using default target state');
            return {
                tab: null,
                swiperIndex: null
            }
        }
    } else {
        return {
            tab: null,
            swiperIndex: null
        }
    }
}

/**
 * Method untuk mendapatkan distribusi card state dari `sessionStorage` lalu melakukan validasi. Jika tidak valid, maka properties akan bernilai `null`
 * @returns {CardDistribusiState} Distribusi card state
 */
export const getSessionDistribusi = () => {
    const savedState = sessionStorage.getItem('_distribusi');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            if (
                'tab' in state && typeof state.tab === 'number' &&
                'hideMatkul' in state && typeof state.hideMatkul === 'boolean' &&
                'hideSks' in state && typeof state.hideSks === 'boolean'
            ) {
                const { tab, hideMatkul, hideSks } = state;
                return {
                    tab, hideMatkul, hideSks
                }
            } else { throw new Error('Invalid distribusi state') }
        } catch (error) {
            sessionStorage.removeItem('_distribusi');
            console.error(error?.message || 'Something went wrong');
            console.error('Using default distribusi state');
            return {
                tab: null,
                hideMatkul: null,
                hideSks: null
            }
        }
    } else {
        return {
            tab: null,
            hideMatkul: null,
            hideSks: null
        }
    }
}

// Validator or Input Checker
/**
 * Method untuk mengecek apakah password kuat menggunakan `validator.isStrongPassword` berdasarkan password point.
 * @param {string} password Jika falsy, return `{point: -1, message: 'Pasword kosong', level: 'empty'}`
 * @returns {{point:number|-1, message:'Password kuat'|'Password kurang kuat'|'Password lemah'|'Password kosong', level:'kuat'|'cukup'|'lemah'|'empty' }} Password object attribute.
 */
export const checkStrongPassword = (password) => {
    if (!password) { return { point: -1, message: 'Password kosong', level: 'empty' } }
    const point = isStrongPassword(password, { returnScore: true });
    const message = point >= 45 ? 'Password kuat' : point >= 25 ? 'Password kurang kuat' : 'Password lemah';
    const level = point >= 45 ? 'kuat' : point >= 25 ? 'cukup' : 'lemah';
    return { point, message, level };
}

// Fetcher or Data Retriever
/**
 * Method untuk fetch API yang tersedia pada SIPK dengan preset header `Authorization` dan `Content-Type`.
 * Authorization header digunakan sebagai autentikasi dengan `accessToken`.
 * 
 * ```js
 * const headers = {
 *      'Content-Type': 'application/json',
 *      'Authorization': `Bearer ${accessToken}`,
 *      ...otherOptions?.headers,
 * }
 * ```
 * 
 * `Throw error` saat, 
 * - Menggunakan `'custom'` endpoint tapi `customEndpoint` falsy atau bukan string
 * - Terjadi pre-request error atau error saat memproses request
 * 
 * @param {'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'} [method] Request method, default `GET`
 * @param {keyof typeof endpointByKey | 'custom'} endpoint API endpoint yang tersedia pada SIPK. Jika menggunakan custom endpoint atau URL, gunakan `'custom'` dan isi param `customEndpoint`
 * @param {string} accessToken User access token atau cookie `'s_access_token'`
 * @param {BodyInit} [body] Request body yang akan di `stringify`, default `null`
 * @param {Object<string, string>} [urlParams] Object yang merepresentasikan url params, default `null`
 * @param {string | URL} [customEndpoint] Custom API endpoint, default `null`
 * @param {Omit<RequestInit, 'method' | 'body'>} [otherOptions] Object sebagai opsi lainnya yg tersedia pada `fetch` selain `body` dan `method`, default `{}`
 * @returns {Promise<Response>} Promise dengan resolve API response
 * @throws Lihat deskripsi
 */
export const fetchWithAuth = async (
    method,
    endpoint,
    accessToken,
    body = null,
    urlParams = null,
    customEndpoint = null,
    otherOptions = {}
) => {
    if (endpoint === 'custom' && !customEndpoint && typeof customEndpoint !== 'string') {
        throw new TypeError('Custom endpoint tidak valid');
    }

    const target = endpoint === 'custom' ? customEndpoint : endpointByKey[endpoint];
    const baseUrl = process.env.NEXT_PUBLIC_SIPK_API_URL || process.env.NEXT_PUBLIC_SIPK_URL;
    const targetWithParams = new URL(target, baseUrl);
    if (urlParams) { Object.keys(urlParams).forEach(key => targetWithParams.searchParams.append(key, urlParams[key])) }
    const { headers: customHeaders = {}, ...restOptions } = otherOptions;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...customHeaders,
    }

    try {
        const options = { ...restOptions, method, headers };
        if (body) { options.body = JSON.stringify(body) }

        const response = await fetch(targetWithParams, options);

        return response;
    } catch (error) {
        console.error(error);
        throw new Error('Gagal memproses permintaan');
    }
};