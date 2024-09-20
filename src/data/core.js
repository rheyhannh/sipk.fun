// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { SWRConfiguration } from 'swr';
// #endregion

// #region COMPONENT DEPEDENCY
import useSWR from 'swr'
import { useCookies } from 'next-client-cookies';
// #endregion

// #region UTIL DEPEDENCY
import { getLocalTheme } from '@/utils/client_side';
// #endregion

// #region TYPE DEFINITION
/**
 * @template [T=any]
 * @typedef {Object} SWRState 
 * @property {boolean} isLoading SWR loading state
 * @property {boolean} isValidating SWR validating state
 * @property {any} error SWR error object
 * @property {T} data SWR resolved data
 */
// #endregion

// #region VARIABLES
const baseApiUrl = process.env.NEXT_PUBLIC_SIPK_API_URL;
// #endregion

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
 * @param {SWRConfiguration} custom Custom SWR options
 * @returns {SWRState<Array<SupabaseTypes.UserData>>} Users data dan SWR state
 */
export function useUser(custom) {
    const url = baseApiUrl + '/api/me';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), { ...swrOptions, ...custom })
}

/**
 * Hook SWR untuk mendapatkan data matakuliah user
 * @param {SWRConfiguration} custom Custom SWR options
 * @returns {SWRState<Array<SupabaseTypes.MatkulData>} Users matakuliah data dan SWR state
 */
export function useMatkul(custom) {
    const url = baseApiUrl + '/api/matkul';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), { ...swrOptions, ...custom })
}

/**
 * Hook SWR untuk mendapatkan data matakuliah history user
 * @param {SWRConfiguration} custom Custom SWR options
 * @returns {SWRState<Array<SupabaseTypes.MatkulHistoryData>>} Users matakuliah history data dan SWR state
 */
export function useMatkulHistory(custom) {
    const url = baseApiUrl + '/api/matkul-history';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), { ...swrOptions, ...custom })
}

/**
 * Hook SWR untuk mendapatkan data rating user
 * @param {SWRConfiguration} custom Custom SWR options
 * @returns {SWRState<Array<SupabaseTypes.RatingData>>} Users rating data dan SWR state
 */
export function useRating(custom) {
    const url = baseApiUrl + '/api/rating';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), { ...swrOptions, ...custom })
}

/**
 * Hook SWR untuk mendapatkan user local browser theme
 * @param {SWRConfiguration} custom Custom SWR options
 * @returns {SWRState<'dark'|'light'>} User local browser theme dan SWR state
 */
export function useLocalTheme(custom) {
    return useSWR('localUserTheme', getLocalTheme, { ...swrOptions, revalidateOnFocus: true, ...custom });
}