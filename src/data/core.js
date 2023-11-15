import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json().then((data) => data))
const swrOptions = {
    refreshInterval: 0,
    revalidateIfStale: true,
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    shouldRetryOnError: false,
}

export function useMatkul() {
    return useSWR('/api/matkulku', fetcher, swrOptions)
}

export function useUniversitas() {
    return useSWR('/api/universitasku', fetcher, swrOptions)
}

export function useUser() {
    return useSWR('/api/me', fetcher, swrOptions)
}