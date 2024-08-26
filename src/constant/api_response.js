/**
 * @typedef {Object} APIResponseBodyProps
 * @property {'success' | 'error'} status
 * Response status
 * @property {number} code
 * Http response code
 * - Note : Selalu destructure props ini sehingga tidak masuk ke response body
 * 
 * Lihat contoh berikut,
 * ```js
 * // Assume throwing this error
 * const error = AuthErrorResponseType.missing_access_token();
 * 
 * // Assume some catch block to handle response
 * const { code, headers: _, ...body } = error; // Destructure 'code' and 'headers'
 * return NextResponse.json(body, { status: code })
 * ```
 * @property {Object<string,any>} headers
 * Headers response. Initial value `undefined`, jika ingin digunakan dapat ditambahkan pada `customProps`
 * - Note : Selalu destructure props ini sehingga tidak masuk ke response body
 * 
 * Lihat contoh berikut,
 * ```js
 * // Assume throwing this error
 * const error = AuthErrorResponseType.missing_access_token(
 *      null, // use default message
 *      undefined, // no url hint
 *      undefined, // no error details
 *      {
 *          headers: {
 *              'X-Custom-Header': 'CustomHeaderValue',
 *          }
 *      }
 * );
 * 
 * // Assume some catch block to handle response
 * const { headers, code, ...body } = error; // Destructure 'headers' and 'code'
 * return NextResponse.json(body, { status: code, headers })
 * ```
 * @property {any | null} data 
 * Data yang berhasil diresolve
 * @property {string} message
 * General message untuk ditampilkan kepada user menggunakan `toast`
 * @property {Object} error 
 * Object yang merepresentasikan error yang terjadi
 * @property {AuthErrorCodes | RatelimitErrorCodes} error.code
 * Kode referensi error pada SIPK dengan keterangan berikut,
 * - `AUTH_00` : User access token atau cookie `'s_access_token'` tidak tersedia
 * - `AUTH_01` : User access token atau cookie `'s_access_token'` tidak valid
 * - `AUTH_02` : User access token atau cookie `'s_access_token'` expired atau kadaluwarsa
 * - `AUTH_03` : Session atau cookie `'_Secure-auth.session-token'` tidak tersedia
 * - `AUTH_04` : Session atau cookie `'_Secure-auth.session-token'` tidak valid
 * - `RL_00` : Penggunaan akses atau rate limit `token` mencapai maksimal
 * - `RL_01` : Jumlah rate limit `token` mencapai maksimal
 * @property {string} error.message
 * Message yang mendeskripsikan error lebih detail menggunakan format `[statusText] - [deskripsi]`
 * - Contoh : `'Bad Request - Invalid JSON format'`
 * @property {string | null} error.hintUrl 
 * Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * @property {any | null} error.details
 * Error details dapat berupa object untuk mendeskripsikan field tertentu atau lainnya
 */

/** @typedef {'AUTH_00' | 'AUTH_01' | 'AUTH_02'} AuthErrorCodes */

/** 
 * @typedef {Object} AuthErrorResponseType
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Object<string,any>, customProps?:Object<string,any>) => Omit<APIResponseBodyProps, 'data'>} missing_access_token
 * Method untuk generate payload response body saat user access token atau cookie `'s_access_token'` tidak tersedia dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details dapat berupa object untuk mendeskripsikan field tertentu atau lainnya
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 401,
 *      message: message ?? 'Akses token tidak ditemukan',
 *      error: {
 *          code: 'AUTH_00',
 *          message: 'Unauthorized - Missing access token',
 *          hintUrl: errorHintUrl,
 *          details: errorDetails,
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Object<string,any>, customProps?:Object<string,any>) => Omit<APIResponseBodyProps, 'data'>} invalid_access_token
 * Method untuk generate payload response body saat user access token atau cookie `'s_access_token'` tidak valid dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details dapat berupa object untuk mendeskripsikan field tertentu atau lainnya
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 401,
 *      message: message ?? 'Akses token tidak valid',
 *      error: {
 *          code: 'AUTH_01',
 *          message: 'Unauthorized - Invalid access token',
 *          hintUrl: errorHintUrl,
 *          details: errorDetails,
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Object<string,any>, customProps?:Object<string,any>) => Omit<APIResponseBodyProps, 'data'>} expired_access_token
 * Method untuk generate payload response body saat user access token atau cookie `'s_access_token'` expired atau kadaluwarsa dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details dapat berupa object untuk mendeskripsikan field tertentu atau lainnya
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 401,
 *      message: message ?? 'Akses token expired',
 *      error: {
 *          code: 'AUTH_02',
 *          message: 'Unauthorized - Expired access token',
 *          hintUrl: errorHintUrl,
 *          details: errorDetails,
 *      },
 *      ...customProps
 * }
 * ```
*/

/** 
 * Generate payload response body saat `AuthError` dimana setiap key merepresentasikan tipe error
 * @type {AuthErrorResponseType} 
 */
export const AuthErrorResponse = {
    missing_access_token: (message, errorHintUrl, errorDetails, customProps) => ({
        status: 'error',
        code: 401,
        message: message ?? 'Akses token tidak ditemukan',
        error: {
            code: 'AUTH_00',
            message: 'Unauthorized - Missing access token',
            hintUrl: errorHintUrl,
            details: errorDetails,
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
    invalid_access_token: (message, errorHintUrl, errorDetails, customProps) => ({
        status: 'error',
        code: 401,
        message: message ?? 'Akses token tidak valid',
        error: {
            code: 'AUTH_01',
            message: 'Unauthorized - Invalid access token',
            hintUrl: errorHintUrl,
            details: errorDetails,
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
    expired_access_token: (message, errorHintUrl, errorDetails, customProps) => ({
        status: 'error',
        code: 401,
        message: message ?? 'Akses token expired',
        error: {
            code: 'AUTH_02',
            message: 'Unauthorized - Expired access token',
            hintUrl: errorHintUrl,
            details: errorDetails,
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
}

/** @typedef {'RL_00' | 'RL_01'} RatelimitErrorCodes */

/** 
 * @typedef {Object} RatelimitErrorResponseType
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Object<string,any>, customProps?:Object<string,any>) => Omit<APIResponseBodyProps, 'data'>} maximum_usage
 * Method untuk generate payload response body saat penggunaan akses atau rate limit `token` mencapai maksimal dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details dapat berupa object untuk mendeskripsikan field tertentu atau lainnya
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 429,
 *      message: message ?? 'Terlalu banyak request, coba lagi nanti',
 *      error: {
 *          code: 'RL_00',
 *          message: 'Too Many Request - Rate limit exceeded',
 *          hintUrl: errorHintUrl,
 *          details: errorDetails,
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Object<string,any>, customProps?:Object<string,any>) => Omit<APIResponseBodyProps, 'data'>} maximum_token
 * Method untuk generate payload response body saat jumlah rate limit `token` mencapai maksimal dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details dapat berupa object untuk mendeskripsikan field tertentu atau lainnya
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 503,
 *      message: message ?? 'Server sibuk, coba lagi nanti',
 *      error: {
 *          code: 'RL_01',
 *          message: 'Service Unavailable - Server is currently busy',
 *          hintUrl: errorHintUrl,
 *          details: errorDetails,
 *      },
 *      ...customProps
 * }
 * ```
*/

/** 
 * Generate payload response body saat `RatelimitError` dimana setiap key merepresentasikan tipe error
 * @type {RatelimitErrorResponseType} 
 */
export const RatelimitErrorResponse = {
    maximum_usage: (message, errorHintUrl, errorDetails, customProps) => ({
        status: 'error',
        code: 429,
        message: message ?? 'Terlalu banyak request, coba lagi nanti',
        error: {
            code: 'RL_00',
            message: 'Too Many Request - Rate limit exceeded',
            hintUrl: errorHintUrl,
            details: errorDetails,
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
    maximum_token: (message, errorHintUrl, errorDetails, customProps) => ({
        status: 'error',
        code: 503,
        message: message ?? 'Server sibuk, coba lagi nanti',
        error: {
            code: 'RL_01',
            message: 'Service Unavailable - Server is currently busy',
            hintUrl: errorHintUrl,
            details: errorDetails,
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
}