// ========== COMPONENT DEPEDENCY ========== //
import useSWR from 'swr'
import { useCookies } from 'next-client-cookies';

/*
============================== CODE START HERE ==============================
*/
const fetchDefault = (url) => {
    return fetch(url, {
        headers: {
            'Authorization': `Accesses_Token`,
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

const fetchWithUserId = (url, id) => {
    return fetch(url, {
        headers: {
            'Authorization': `Accesses_Token`,
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
    const userIdCookie = useCookies().get('s_user_id');
    const options = custom ? custom : swrOptions;
    return useSWR(['/api/me', userIdCookie], ([url, id]) => fetchWithUserId(url, id), options)
}

export function useMatkul(custom) {
    const userIdCookie = useCookies().get('s_user_id');
    const options = custom ? custom : swrOptions;
    return useSWR(['/api/matkul', userIdCookie], ([url, id]) => fetchWithUserId(url, id), options)
}

export function useMatkulHistory(custom) {
    const userIdCookie = useCookies().get('s_user_id');
    const options = custom ? custom : swrOptions;
    return useSWR(['/api/matkul-history', userIdCookie], ([url, id]) => fetchWithUserId(url, id), options)
}

export function useNotifikasi(custom) {
    const options = custom ? custom : swrOptions;
    return useSWR('/api/notifikasi', fetchDefault, options)
}