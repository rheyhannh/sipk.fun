// ========== TYPE DEPEDENCY ========== //
import * as SupabaseTypes from '../types/supabase.js';

// ========== COMPONENT DEPEDENCY ========== //
import useSWR from 'swr'
import { useCookies } from 'next-client-cookies';
import { getLocalTheme } from '@/utils/client_side';

// ========== TYPE ========== //
/**
 * @typedef SWRState 
 * @property {boolean} isLoading SWR loading state
 * @property {boolean} isValidating SWR validating state
 * @property {object} error SWR error object
 */

/*
============================== CODE START HERE ==============================
*/

const fetchPublic = (url) => {
    return fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(async (response) => {
            if (!response.ok) {
                try {
                    const { message } = await response.json();
                    if (message) { throw new Error(`${message} (code: ${response.status})`); }
                    else { throw new Error(`Terjadi error (code: ${response.status})`); }
                } catch (error) {
                    throw error;
                }
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Gagal mengambil data:', error.message);
            throw error;
        });
}

const fetchDefault = (url, accessToken) => {
    if (!accessToken) { throw new Error('Access token required') }
    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
        .then(async (response) => {
            if (!response.ok) {
                try {
                    const { message } = await response.json();
                    if (message) { throw new Error(`${message} (code: ${response.status})`); }
                    else { throw new Error(`Terjadi error (code: ${response.status})`); }
                } catch (error) {
                    throw error;
                }
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Gagal mengambil data:', error.message);
            throw error;
        });
}

const fetchWithUserId = (url, id, accessToken) => {
    if (!accessToken || !id) { throw new Error('Access token required') }
    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
        .then(async (response) => {
            if (!response.ok) {
                try {
                    const { message } = await response.json();
                    if (message) { throw new Error(`${message} (code: ${response.status})`); }
                    else { throw new Error(`Terjadi error (code: ${response.status})`); }
                } catch (error) {
                    throw error;
                }
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Gagal mengambil data:', error.message);
            throw error;
        });
}

const swrOptions = {
    refreshInterval: 0,
    revalidateIfStale: true,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    shouldRetryOnError: false,
}

/**
 * Hook SWR untuk mendapatkan data user
 * @param {object} custom Custom SWR options
 * @returns {{isLoading:Boolean, isValidating:Boolean, error:{}, data: Array<SupabaseTypes.UserData>}} Users data dan SWR state
 */
export function useUser(custom) {
    const url = '/api/me';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), { ...swrOptions, ...custom })
}

/**
 * Hook SWR untuk mendapatkan data matakuliah user
 * @param {object} custom Custom SWR options
 * @returns {{isLoading:Boolean, isValidating:Boolean, error:{}, data: Array<SupabaseTypes.MatkulData>}} Users matakuliah data dan SWR state
 */
export function useMatkul(custom) {
    const url = '/api/matkul';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), { ...swrOptions, ...custom })
}

/**
 * Hook SWR untuk mendapatkan data matakuliah history user
 * @param {object} custom Custom SWR options
 * @returns {{isLoading:Boolean, isValidating:Boolean, error:{}, data: Array<SupabaseTypes.MatkulHistoryData>}} Users matakuliah history data dan SWR state
 */
export function useMatkulHistory(custom) {
    const url = '/api/matkul-history';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), { ...swrOptions, ...custom })
}

/**
 * Hook SWR untuk mendapatkan data rating user
 * @param {object} custom Custom SWR options
 * @returns {{isLoading:Boolean, isValidating:Boolean, error:{}, data: Array<SupabaseTypes.RatingData>}} Users rating data dan SWR state
 */
export function useRating(custom) {
    const url = '/api/rating';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), { ...swrOptions, ...custom })
}

/**
 * Hook SWR untuk mendapatkan notifikasi atau berita dari SIPK
 * @param {object} custom Custom SWR options
 * @returns {{isLoading:Boolean, isValidating:Boolean, error:{}, data: Array<SupabaseTypes.NotifikasiData>}} Notifikasi atau berita dan SWR state
 */
export function useNotifikasi(custom) {
    const url = '/api/notifikasi';
    const accessToken = useCookies().get('s_access_token');
    return useSWR(url, () => fetchDefault(url, accessToken), { ...swrOptions, ...custom })
}

/**
 * Hook SWR untuk mendapatkan data universitas
 * @param {object} custom Custom SWR options
 * @param {'public'|'user'} type Jika 'user' akan return props `penilaian` untuk digunakan sebagai perhitungan nilai. Jika 'public' akan return props `assets` berupa deskripsi, logo, etc.
 * @param {number|'all'} id Id universitas. Query data berdasarkan `id` atau `all` untuk semua
 * @returns {{isLoading:Boolean, isValidating:Boolean, error:{}, data: Array<SupabaseTypes.UniversitasData>}} Universitas data dan SWR state
 */
export function useUniversitas(custom, type, id) {
    var url = null;
    if (type && id) {
        var url = `/api/universitas?type=${type}&id=${id}`
    }
    const accessToken = useCookies().get('s_access_token');
    return useSWR(url, () => {
        if (type === 'public') {
            return fetchPublic(url);
        } else {
            return fetchDefault(url, accessToken);
        }
    }, { ...swrOptions, ...custom })
}

/**
 * Hook SWR untuk mendapatkan user local browser theme
 * @param {object} custom Custom SWR options
 * @returns {{isLoading:Boolean, isValidating:Boolean, error:{}, data:'dark'|'light'}} User local browser theme dan SWR state
 */
export function useLocalTheme(custom) {
    return useSWR('localUserTheme', getLocalTheme, { ...swrOptions, revalidateOnFocus: true, ...custom });
}

/**
 * Hook SWR untuk mendapatkan data fakta tentang SIPK
 * @param {object} custom Custom SWR options
 * @returns {{isLoading:Boolean, isValidating:Boolean, error:{}, data: Array<SupabaseTypes.FaktaData>}} Data fakta SIPK dan SWR state
 */
export function useFakta(custom) {
    const url = '/api/fakta';
    return useSWR(url, () => fetchPublic(url), { ...swrOptions, ...custom });
}

/*
============================== CODE END HERE ==============================
*/