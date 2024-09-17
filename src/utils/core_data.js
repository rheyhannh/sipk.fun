'use server'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

/**
 * Method untuk fetch core data `universitas` menggunakan opsi berikut
 * 
 * ```js
 * const options = {
 *      headers: { 'x-api-key': process.env.SUPABASE_SERVICE_KEY },
 *      next: { revalidate } // from param
 * }
 * ```
 * 
 * Tambahkan custom opsi fetch lainnya pada param `options`, atur interval untuk revalidate data pada param `revalidate`.
 * Perlu diingat bahwa, 
 * 
 * - Header `'x-api-key'` tidak dapat dioverride
 * - Hanya gunakan method ini pada Server Component
 * 
 * @param {number} [revalidate] Interval dalam detik untuk revalidate data, default `3600`
 * @param {Omit<RequestInit, 'next'> & {next:Omit<RequestInit['next'], 'revalidate'>}} [options] Opsi fetch lainnya yang digunakan, default `{}`
  * @returns {Promise<Array<SupabaseTypes.UniversitasData>>} Array of universitas data
 */
export async function getUniversitasData(revalidate = 3600, options = {}) {
    const { headers = {}, next = {}, ...restOptions } = options;

    const updatedHeaders = { ...headers, 'x-api-key': process.env.SUPABASE_SERVICE_KEY };
    const updatedNext = { ...next, revalidate };

    const response = await fetch('http://localhost:3000/api/universitas', {
        ...restOptions,
        headers: updatedHeaders,
        next: updatedNext,
    });

    return await response.json();
}

/**
 * Method untuk fetch core data `notifikasi` menggunakan opsi berikut
 * 
 * ```js
 * const options = {
 *      headers: { 'x-api-key': process.env.SUPABASE_SERVICE_KEY },
 *      next: { revalidate } // from param
 * }
 * ```
 * 
 * Tambahkan custom opsi fetch lainnya pada param `options`, atur interval untuk revalidate data pada param `revalidate`.
 * Perlu diingat bahwa, 
 * 
 * - Header `'x-api-key'` tidak dapat dioverride
 * - Hanya gunakan method ini pada Server Component
 * 
 * @param {number} [revalidate] Interval dalam detik untuk revalidate data, default `3600`
 * @param {Omit<RequestInit, 'next'> & {next:Omit<RequestInit['next'], 'revalidate'>}} [options] Opsi fetch lainnya yang digunakan, default `{}`
  * @returns {Promise<Array<SupabaseTypes.NotifikasiData>>} Array of notifikasi data
 */
export async function getNotifikasiData(revalidate = 3600, options = {}) {
    const { headers = {}, next = {}, ...restOptions } = options;

    const updatedHeaders = { ...headers, 'x-api-key': process.env.SUPABASE_SERVICE_KEY };
    const updatedNext = { ...next, revalidate };

    const response = await fetch('http://localhost:3000/api/notifikasi', {
        ...restOptions,
        headers: updatedHeaders,
        next: updatedNext,
    });

    return await response.json();
}

/**
 * Method untuk fetch core data `rating` menggunakan opsi berikut
 * 
 * ```js
 * const options = {
 *      headers: { 'x-api-key': process.env.SUPABASE_SERVICE_KEY },
 *      next: { revalidate } // from param
 * }
 * ```
 * 
 * Tambahkan custom opsi fetch lainnya pada param `options`, atur interval untuk revalidate data pada param `revalidate`.
 * Perlu diingat bahwa, 
 * 
 * - Header `'x-api-key'` tidak dapat dioverride
 * - Hanya gunakan method ini pada Server Component
 * 
 * @param {number} [revalidate] Interval dalam detik untuk revalidate data, default `3600`
 * @param {Omit<RequestInit, 'next'> & {next:Omit<RequestInit['next'], 'revalidate'>}} [options] Opsi fetch lainnya yang digunakan, default `{}`
  * @returns {Promise<Array<SupabaseTypes.RatingData>>} Array of rating data
 */
export async function getRatingData(revalidate = 3600, options = {}) {
    const { headers = {}, next = {}, ...restOptions } = options;

    const updatedHeaders = { ...headers, 'x-api-key': process.env.SUPABASE_SERVICE_KEY };
    const updatedNext = { ...next, revalidate };

    const response = await fetch('http://localhost:3000/api/rating', {
        ...restOptions,
        headers: updatedHeaders,
        next: updatedNext,
    });

    return await response.json();
}

/**
 * Method untuk fetch core data `fakta` menggunakan opsi berikut
 * 
 * ```js
 * const options = {
 *      headers: { 'x-api-key': process.env.SUPABASE_SERVICE_KEY },
 *      next: { revalidate } // from param
 * }
 * ```
 * 
 * Tambahkan custom opsi fetch lainnya pada param `options`, atur interval untuk revalidate data pada param `revalidate`.
 * Perlu diingat bahwa, 
 * 
 * - Header `'x-api-key'` tidak dapat dioverride
 * - Hanya gunakan method ini pada Server Component
 * 
 * @param {number} [revalidate] Interval dalam detik untuk revalidate data, default `3600`
 * @param {Omit<RequestInit, 'next'> & {next:Omit<RequestInit['next'], 'revalidate'>}} [options] Opsi fetch lainnya yang digunakan, default `{}`
  * @returns {Promise<Array<SupabaseTypes.FaktaData>>} Array of fakta data
 */
export async function getFaktaData(revalidate = 3600, options = {}) {
    const { headers = {}, next = {}, ...restOptions } = options;

    const updatedHeaders = { ...headers, 'x-api-key': process.env.SUPABASE_SERVICE_KEY };
    const updatedNext = { ...next, revalidate };

    const response = await fetch('http://localhost:3000/api/fakta', {
        ...restOptions,
        headers: updatedHeaders,
        next: updatedNext,
    });

    return await response.json();
}