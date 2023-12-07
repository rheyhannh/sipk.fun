// ========== COMPONENT DEPEDENCY ========== //
import useSWR from 'swr'
import { useCookies } from 'next-client-cookies';

/*
============================== CODE START HERE ==============================
*/
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
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    shouldRetryOnError: false,
}

export function useUser(custom) {
    const url = '/api/me';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    const options = custom ? custom : swrOptions;
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), options)
}

export function useMatkul(custom) {
    const url = '/api/matkul';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    const options = custom ? custom : swrOptions;
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), options)
}

export function useMatkulHistory(custom) {
    const url = '/api/matkul-history';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    const options = custom ? custom : swrOptions;
    return useSWR([url, userIdCookie], () => fetchWithUserId(url, userIdCookie, accessToken), options)
}

export function useNotifikasi(custom) {
    const url = '/api/notifikasi';
    const options = custom ? custom : swrOptions;
    const accessToken = useCookies().get('s_access_token');
    return useSWR(url, () => fetchDefault(url, accessToken), options)
}