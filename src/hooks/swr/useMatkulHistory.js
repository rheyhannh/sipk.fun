// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { SWRConfiguration } from 'swr';
import { SWRState } from './config';
// #endregion

// #region CONFIG DEPEDENCY
import { SWR_BASE_URL, SWR_DEFAULT_OPTIONS } from './config';
// #endregion

// #region HOOKS DEPEDENCY
import useSWR from 'swr';
import { useCookies } from 'next-client-cookies';
// #endregion

// #region UTIL DEPEDENCY
import fetcher from './fetcher';
// #endregion

/**
 * Hook SWR untuk mendapatkan data matakuliah history user yang menggunakan {@link SWR_DEFAULT_OPTIONS opsi default}, dimana dapat dioverride melalui param `custom`.
 * Untuk menggunakan hook ini pastikan provider `CookiesProvider` tersedia.
 * 
 * ```jsx
 * import { CookiesProvider } from 'next-client-cookies/server';
 * const MyComponent => (
 *      <CookiesProvider>
 *          <UseMatkulHistoryInsideThisComponent/>
 *      </CookiesProvider>
 * )
 * ```
 * @param {SWRConfiguration} custom Custom SWR options
 * @returns {SWRState<Array<SupabaseTypes.MatkulHistoryData>, any>} Users matakuliah history data dan SWR state
 */
function useMatkulHistory(custom) {
    const url = SWR_BASE_URL + '/api/matkul-history';
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    return useSWR([url, userIdCookie], () => fetcher(url, userIdCookie, accessToken), { ...SWR_DEFAULT_OPTIONS, ...custom })
}

export default useMatkulHistory;