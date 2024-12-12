// #region TYPE DEPEDENCY
import { SWRConfiguration } from 'swr';
// #endregion

/**
 * Object yang merepresentasikan state `SWR` dengan template `T` sebagai schema data dan `Y` sebagai schema error
 * @template [T=any] 
 * @template [Y=any]
 * @typedef {Object} SWRState 
 * @property {boolean} isLoading 
 * Boolean yang menentukan SWR dalam state `loading`
 * @property {boolean} isValidating 
 * Boolean yang menentukan SWR dalam state `validating`
 * @property {Y} error 
 * Error yang diproduce
 * @property {T} data
 * Data yang diresolve 
 */

/**
 * Konfigurasi default untuk setiap hook SWR yang digunakan
 * @type {SWRConfiguration}
 */
export const SWR_DEFAULT_OPTIONS = {
    refreshInterval: 0,
    revalidateIfStale: true,
    revalidateOnMount: true,
    revalidateOnFocus: process.env.NODE_ENV === 'production' ? true : false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    shouldRetryOnError: false,
}

/**
 * Base URL untuk setiap hook SWR yang digunakan yang ditentukan dari salah satu variabel `env` berikut,
 * - `NEXT_PUBLIC_SIPK_URL` : Base URL aplikasi
 * - `NEXT_PUBLIC_SIPK_API_URL` : Base URL API aplikasi
 * 
 * Menggunakan variabel `NEXT_PUBLIC_SIPK_API_URL` jika tersedia atau bukan empty string.
 * Jika tidak tersedia atau empty string, maka menggunakan `NEXT_PUBLIC_SIPK_URL`.
 * 
 * Umumnya jika API direserve dari domain yang sama dengan aplikasi, `NEXT_PUBLIC_SIPK_API_URL` akan bernilai empty string.
 * 
 * ```js
 * // Contoh saat domain aplikasi dan API sama
 * var NEXT_PUBLIC_SIPK_URL = "https://sipk.app"; // SWR_BASE_URL use this
 * var NEXT_PUBLIC_SIPK_API_URL = "";
 * 
 * // Contoh saat domain aplikasi dan API berbeda
 * var NEXT_PUBLIC_SIPK_URL = "https://sipk.app";
 * var NEXT_PUBLIC_SIPK_API_URL = "https://sipk-api.com"; // SWR_BASE_URL use this
 * ```
 * 
 * Konfigurasi ini dilakukan untuk suatu saat nanti jika ingin memisahkan front-end dan back-end. Semisalnya hosting front-end pada 
 * layanan CDN seperti Vercel atau Netlify dan back-end pada AWS, Google Cloud atau Heroku.
 * 
 */
export const SWR_BASE_URL = process.env.NEXT_PUBLIC_SIPK_API_URL || process.env.NEXT_PUBLIC_SIPK_URL;