/** 
 * Object yang direturn dari method `handleApiResponseError`
 * @typedef {Object} handleApiResponseErrorReturnType
 * @property {string} toastMessage
 * Message yang perlu ditoast
 * @property {boolean} refresh 
 * Boolean untuk menentukan apakah refresh diperlukan atau tidak
 * - Saat `true` handle dengan `router.refresh()`
 * @property {Object} navigate
 * Object untuk menentukan apakah redirect diperlukan atau tidak
 * - Saat `null` maka redirect tidak diperlukan
 * - Jika tidak `null` maka redirect diperlukan, handle dengan `router.replace()` atau `router.push()` sesuai dengan tipe navigasi yang digunakan pada props `type`
 * @property {'replace' | 'push'} navigate.type
 * Tipe navigasi yang digunakan
 * - Saat `'replace'` gunakan `router.replace()`
 * - Saat `'push'` gunakan `router.push()`
 * @property {string} navigate.to
 * Target navigasi
 * @property {boolean} navigate.scrollOptions
 * Opsi scroll pada `router.replace()` atau `router.push()`
 */

/** 
 * Method untuk handle instruksi selanjutnya dan toast message saat response API error atau saat `!response.ok`.
 * 
 * Object yang diresolve berisikan props berikut, 
 * - `toastMessage` : Message yang perlu ditoast
 * - `refresh` : Boolean untuk menentukan apakah refresh diperlukan atau tidak
 * - `navigate` : Object untuk menentukan apakah redirect diperlukan atau tidak, object ini dapat bernilai `null`
 * 
 * Lihat `example` untuk contoh penggunaan
 * @async
 * @param {Response} response Response yang diperoleh dari API SIPK
 * @param {string} [eventId] Event identifier
 * @returns {Promise<handleApiResponseErrorReturnType>} Resolve dengan object yg berisikan toast message dan instruksi selanjutnya
 * @example
 * ```jsx
 * import { useRouter } from 'next/navigation';
 * import toast from 'react-hot-toast';
 * 
 * const MyComponent = () => {
 *      const router = useRouter();
 *      const handleAddItem = async () => {
 *          const response = await fetch(); // assume fetch something
 *          if (!response.ok) {
 *              const {toastMessage, refresh, navigate} = await handleApiResponseError(response);
 *              toast.error(toastMessage);
 *              if (refresh) { router.refresh() }
 *              if (navigate && navigate.type === 'replace') {
 *                  router.replace(navigate.to, {scroll:navigate.scrollOptions});
 *              }
 *              if (navigate && navigate.type === 'push') {
 *                  router.push(navigate.to, {scroll:navigate.scrollOptions})
 *              }
 *          }
 *      }
 * }
 * ```
 */
export const handleApiResponseError = async (response, eventId = null) => {
    try {
        /** @type {import('@/constant/api_response').ClientAPIResponseErrorProps} */
        const { message = 'Gagal memproses permintaan', error = null } = await response.json();

        if (!error) return { toastMessage: message, refresh: false, navigate: null };

        if (['AUTH_00', 'AUTH_01'].includes(error.code)) {
            return {
                toastMessage: 'Terjadi kesalahan, silahkan coba lagi',
                refresh: false,
                navigate: null,
            }
        } else if (['AUTH_02'].includes(error.code)) {
            return {
                toastMessage: 'Terjadi kesalahan, silahkan coba lagi',
                refresh: true,
                navigate: null,
            }
        } else if (['AUTH_03', 'AUTH_04'].includes(error.code)) {
            return {
                toastMessage: 'Sesimu tidak valid, silahkan login ulang',
                refresh: false,
                navigate: {
                    type: 'replace',
                    to: '/users?action=login&error=isession',
                    scrollOptions: false,
                }
            }
        } else {
            return { toastMessage: message, refresh: false, navigate: null };
        }
    } catch (error) {
        console.error(error);
        return { toastMessage: 'Gagal memproses permintaan', refresh: false, navigate: null };
    }
}