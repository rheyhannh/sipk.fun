'use server'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region VARIABLES
const nextOptions = {
    universitas: {
        revalidate: 86400, // Revalidate every 24 hours
        tags: ['universitas']
    },
    notifikasi: {
        revalidate: 3600, // Revalidate every 1 hours
        tags: ['notifikasi']
    },
    rating: {
        revalidate: 10800, // Revalidate every 3 hours
        tags: ['rating']
    },
    fakta: {
        revalidate: 10800, // Revalidate every 3 hours
        tags: ['fakta']
    }
}
// #endregion

/**
 * Method untuk fetch core data `universitas` menggunakan header dan {@link nextOptions} sebagai berikut
 * 
 * ```js
 * const options = {
 *      headers: { 'x-api-key': process.env.SUPABASE_SERVICE_KEY },
 *      next: nextOptions['universitas']
 * }
 * ```
 * 
 * Tambahkan custom opsi fetch lainnya pada param `options`, Perlu diingat bahwa, 
 * - Header `'x-api-key'` dan opsi `next` tidak dapat dioverride
 * - Hanya gunakan method ini pada Server Component
 * 
 * @param {Omit<RequestInit, 'next'>} [options] Opsi fetch lainnya yang digunakan, default `{}`
 * @returns {Promise<Array<SupabaseTypes.UniversitasData>>} Array of universitas data
 */
export async function getUniversitasData(options = {}) {
    const { headers = {}, ...restOptions } = options;
    const updatedHeaders = { ...headers, 'x-api-key': process.env.SUPABASE_SERVICE_KEY };

    const response = await fetch('http://localhost:3000/api/universitas', {
        ...restOptions,
        headers: updatedHeaders,
        next: nextOptions['universitas'],
    });

    return await response.json();
}

/**
 * Method untuk fetch core data `notifikasi` menggunakan header dan {@link nextOptions} sebagai berikut
 * 
 * ```js
 * const options = {
 *      headers: { 'x-api-key': process.env.SUPABASE_SERVICE_KEY },
 *      next: nextOptions['notifikasi']
 * }
 * ```
 * 
 * Tambahkan custom opsi fetch lainnya pada param `options`, Perlu diingat bahwa, 
 * - Header `'x-api-key'` dan opsi `next` tidak dapat dioverride
 * - Hanya gunakan method ini pada Server Component
 * 
 * @param {Omit<RequestInit, 'next'>} [options] Opsi fetch lainnya yang digunakan, default `{}`
 * @returns {Promise<Array<SupabaseTypes.NotifikasiData>>} Array of notifikasi data
 */
export async function getNotifikasiData(options = {}) {
    const { headers = {}, ...restOptions } = options;
    const updatedHeaders = { ...headers, 'x-api-key': process.env.SUPABASE_SERVICE_KEY };

    const response = await fetch('http://localhost:3000/api/notifikasi', {
        ...restOptions,
        headers: updatedHeaders,
        next: nextOptions['notifikasi'],
    });

    return await response.json();
}

/**
 * Method untuk fetch core data `rating` menggunakan header dan {@link nextOptions} sebagai berikut
 * 
 * ```js
 * const options = {
 *      headers: { 'x-api-key': process.env.SUPABASE_SERVICE_KEY },
 *      next: nextOptions['rating']
 * }
 * ```
 * 
 * Tambahkan custom opsi fetch lainnya pada param `options`, Perlu diingat bahwa, 
 * - Header `'x-api-key'` dan opsi `next` tidak dapat dioverride
 * - Hanya gunakan method ini pada Server Component
 * 
 * @param {Omit<RequestInit, 'next'>} [options] Opsi fetch lainnya yang digunakan, default `{}`
 * @returns {Promise<Array<SupabaseTypes.RatingData>>} Array of rating data
 */
export async function getRatingData(options = {}) {
    const { headers = {}, ...restOptions } = options;
    const updatedHeaders = { ...headers, 'x-api-key': process.env.SUPABASE_SERVICE_KEY };

    const response = await fetch('http://localhost:3000/api/rating', {
        ...restOptions,
        headers: updatedHeaders,
        next:nextOptions['rating'],
    });

    return await response.json();
}

/**
 * Method untuk fetch core data `fakta` menggunakan header dan {@link nextOptions} sebagai berikut
 * 
 * ```js
 * const options = {
 *      headers: { 'x-api-key': process.env.SUPABASE_SERVICE_KEY },
 *      next: nextOptions['fakta']
 * }
 * ```
 * 
 * Tambahkan custom opsi fetch lainnya pada param `options`, Perlu diingat bahwa, 
 * - Header `'x-api-key'` dan opsi `next` tidak dapat dioverride
 * - Hanya gunakan method ini pada Server Component
 * 
 * @param {Omit<RequestInit, 'next'>} [options] Opsi fetch lainnya yang digunakan, default `{}`
 * @returns {Promise<Array<SupabaseTypes.FaktaData>>} Array of fakta data
 */
export async function getFaktaData(options = {}) {
    const { headers = {}, ...restOptions } = options;
    const updatedHeaders = { ...headers, 'x-api-key': process.env.SUPABASE_SERVICE_KEY };

    const response = await fetch('http://localhost:3000/api/fakta', {
        ...restOptions,
        headers: updatedHeaders,
        next: nextOptions['fakta'],
    });

    return await response.json();
}