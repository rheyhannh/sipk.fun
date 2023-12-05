// ========== COMPONENT DEPEDENCY ========== //
import useSWR from 'swr'
import { useCookies } from 'next-client-cookies';

/*
============================== CODE START HERE ==============================
*/
const fetchDefault = (url) => fetch(url).then((res) => res.json().then((data) => data))
const fetchWithUserId = (url, id) => fetch(url).then((res) => res.json().then((data) => data))

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