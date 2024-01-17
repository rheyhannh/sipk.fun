// ========== COMPONENT DEPEDENCY ========== //
import useSWR from 'swr'
import { useCookies } from 'next-client-cookies';
import { getLocalTheme, getSessionTable } from '@/utils/client_side';

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

export function useUser(custom) {
    const url = '/api/me';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), { ...swrOptions, ...custom })
}

export function useMatkul(custom) {
    const url = '/api/matkul';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), { ...swrOptions, ...custom })
}

export function useMatkulHistory(custom) {
    const url = '/api/matkul-history';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), { ...swrOptions, ...custom })
}

export function useRating(custom) {
    const url = '/api/rating';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), { ...swrOptions, ...custom })
}

export function useNotifikasi(custom) {
    const url = '/api/notifikasi';
    const accessToken = useCookies().get('s_access_token');
    return useSWR(url, () => fetchDefault(url, accessToken), { ...swrOptions, ...custom })
}

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

export function useLocalTheme(custom) {
    return useSWR('localUserTheme', getLocalTheme, { ...swrOptions, revalidateOnFocus: true, ...custom });
}

export function useSessionTable(custom) {
    return useSWR('sessionUserTable', getSessionTable, { ...swrOptions, ...custom });
}