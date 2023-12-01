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
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    shouldRetryOnError: false,
}

export function useUser() {
    const userIdCookie = useCookies().get('s_user_id');
    return useSWR(['/api/me', , userIdCookie], ([url, id]) => fetchWithUserId(url, id), swrOptions)
}

export function useMatkul() {
    const userIdCookie = useCookies().get('s_user_id');
    return useSWR(['/api/matkulku', userIdCookie], ([url, id]) => fetchWithUserId(url, id), swrOptions)
}

export function useMatkulHistory() {
    const userIdCookie = useCookies().get('s_user_id');
    return useSWR(['/api/matkul-history', userIdCookie], ([url, id]) => fetchWithUserId(url, id), swrOptions)
}

export function useNotifikasi() {
    return useSWR('/api/notifikasi', fetchDefault, swrOptions)
}