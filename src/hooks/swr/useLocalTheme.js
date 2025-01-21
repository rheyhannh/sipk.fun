// #region TYPE DEPEDENCY
import { SWRConfiguration } from 'swr';
import { SWRState } from './config';
// #endregion

// #region CONFIG DEPEDENCY
import { SWR_DEFAULT_OPTIONS } from './config';
// #endregion

// #region HOOKS DEPEDENCY
import useSWR from 'swr';
// #endregion

// #region UTIL DEPEDENCY
import { getLocalTheme } from '@/utils/client_side';
// #endregion

/**
 * Hook SWR untuk mendapatkan user local browser theme yang menggunakan {@link SWR_DEFAULT_OPTIONS opsi default}, dimana dapat dioverride melalui param `custom`.
 * @param {SWRConfiguration} custom Custom SWR options
 * @returns {SWRState<Array<'dark' | 'light'>>} User local browser theme dan SWR state
 */
function useLocalTheme(custom) {
    return useSWR('localUserTheme', getLocalTheme, { ...SWR_DEFAULT_OPTIONS, revalidateOnFocus: true, ...custom });
}

export default useLocalTheme;