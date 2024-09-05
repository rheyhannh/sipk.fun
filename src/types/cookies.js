/**
 * @typedef {string} serviceGuestCookie
 * Cookie berformat `uuid-v4` sebagai identifier user anonim atau tidak terautentikasi.
 * Opsi cookie dapat dilihat sebagai berikut, 
 * ```js
 * const options = {
 *      secure: false,
 *      httpOnly: false,
 *      sameSite: 'lax'  
 * }
 * ```
 * - Alias : `'s_guest_id'`
 * - Info : Cookies dengan prefix `'s_'` atau `'service'` dapat diakses dari client karna opsi yang digunakan 
 */

/**
 * @typedef {string} serviceUserIdCookie
 * Cookie berformat `uuid-v4` yang merupakan user id dari user yang terautentikasi.
 * Opsi cookie dapat dilihat sebagai berikut, 
 * ```js
 * const options = {
 *      secure: false,
 *      httpOnly: false,
 *      sameSite: 'lax'  
 * }
 * ```
 * - Alias : `'s_user_id'`
 * - Info : Cookies dengan prefix `'s_'` atau `'service'` dapat diakses dari client karna opsi yang digunakan
 */

/**
 * @typedef {string} serviceAccessTokenCookie
 * Cookie berformat plain `JWT` yang merupakan user access token dari user yang terautentikasi.
 * Opsi cookie dapat dilihat sebagai berikut, 
 * ```js
 * const options = {
 *      secure: false,
 *      httpOnly: false,
 *      sameSite: 'lax'  
 * }
 * ```
 * - Alias : `'s_access_token'`
 * - Info : Cookies dengan prefix `'s_'` atau `'service'` dapat diakses dari client karna opsi yang digunakan
 */

/**
 * @typedef {string} secureSessionCookie
 * Cookie yang sudah dienkripsi sebagai session dari user yang terautentikasi.
 * Opsi cookie dapat dilihat sebagai berikut, 
 * ```js
 * const options = {
 *      secure: true,
 *      httpOnly: true,
 *      sameSite: 'lax'  
 * }
 * ```
 * - Alias : `'_Secure-auth.session-token'`
 * - Info : Tidak dapat diakses melalui client
 */

/**
 * @typedef {'serviceGuestCookie' | 'serviceUserIdCookie' | 'serviceAccessTokenCookie' | 'secureSessionCookie'} AllCookiesName
 */

/**
 * @typedef {Object} AllCookies
 * @property {string} serviceGuestCookie
 * Cookie berformat `uuid-v4` sebagai identifier user anonim atau tidak terautentikasi.
 * Opsi cookie dapat dilihat sebagai berikut, 
 * ```js
 * const options = {
 *      secure: false,
 *      httpOnly: false,
 *      sameSite: 'lax'  
 * }
 * ```
 * - Alias : `'s_guest_id'`
 * - Info : Cookies dengan prefix `'s_'` atau `'service'` dapat diakses dari client karna opsi yang digunakan 
 * @property {string} serviceUserIdCookie
 * Cookie berformat `uuid-v4` yang merupakan user id dari user yang terautentikasi.
 * Opsi cookie dapat dilihat sebagai berikut, 
 * ```js
 * const options = {
 *      secure: false,
 *      httpOnly: false,
 *      sameSite: 'lax'  
 * }
 * ```
 * - Alias : `'s_user_id'`
 * - Info : Cookies dengan prefix `'s_'` atau `'service'` dapat diakses dari client karna opsi yang digunakan
 * @property {string} serviceAccessTokenCookie
 * Cookie berformat plain `JWT` yang merupakan user access token dari user yang terautentikasi.
 * Opsi cookie dapat dilihat sebagai berikut, 
 * ```js
 * const options = {
 *      secure: false,
 *      httpOnly: false,
 *      sameSite: 'lax'  
 * }
 * ```
 * - Alias : `'s_access_token'`
 * - Info : Cookies dengan prefix `'s_'` atau `'service'` dapat diakses dari client karna opsi yang digunakan
 * @property {string} secureSessionCookie
 * Cookie yang sudah dienkripsi sebagai session dari user yang terautentikasi.
 * Opsi cookie dapat dilihat sebagai berikut, 
 * ```js
 * const options = {
 *      secure: true,
 *      httpOnly: true,
 *      sameSite: 'lax'  
 * }
 * ```
 * - Alias : `'_Secure-auth.session-token'`
 * - Info : Tidak dapat diakses melalui client
 */

export const CookiesTypes = {}