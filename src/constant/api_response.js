/**
 * @typedef {Object} APIResponseBodyProps
 * @property {'success' | 'error'} status
 * Response status
 * @property {number} code
 * Http response code
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
 * const { headers, ...body } = error; // Destructure 'headers'
 * return NextResponse.json(body, { status: body.code, headers })
 * ```
 * @property {any | null} data 
 * Data yang berhasil diresolve
 * @property {string} message
 * General message untuk ditampilkan kepada user menggunakan `toast`. Gunakan bahasa yang sederhana, pendek dan mudah dimengerti user
 * @property {Object} error 
 * Object yang merepresentasikan error yang terjadi
 * @property {AuthErrorCodes | RatelimitErrorCodes} error.code
 * Kode referensi error pada SIPK
 * - Contoh : `'AUTH_00'`
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
 * Method untuk generate payload response body saat user `session` atau cookie `'s_access_token'` tidak tersedia dengan parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details dapat berupa object untuk mendeskripsikan field tertentu atau lainnya
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 401,
 *      message: message ?? 'Session tidak ditemukan, silahkan login ulang',
 *      error: {
 *          code: 'AUTH_00',
 *          message: 'Unauthorized - Missing access token'
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Object<string,any>, customProps?:Object<string,any>) => Omit<APIResponseBodyProps, 'data'>} invalid_access_token
 * Method untuk generate payload response body saat user `session` atau cookie `'s_access_token'` tidak valid dengan parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details dapat berupa object untuk mendeskripsikan field tertentu atau lainnya
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 401,
 *      message: message ?? 'Session tidak valid, silahkan login ulang',
 *      error: {
 *          code: 'AUTH_01',
 *          message: 'Unauthorized - Invalid access token'
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Object<string,any>, customProps?:Object<string,any>) => Omit<APIResponseBodyProps, 'data'>} expired_access_token
 * Method untuk generate payload response body saat user `session` atau cookie `'s_access_token'` expired atau kadaluwarsa dengan parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details dapat berupa object untuk mendeskripsikan field tertentu atau lainnya
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 401,
 *      message: message ?? 'Session sudah expired, silahkan login ulang',
 *      error: {
 *          code: 'AUTH_02',
 *          message: 'Unauthorized - Expired access token'
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
        message: message ?? 'Session tidak ditemukan, silahkan login ulang',
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
        message: message ?? 'Session tidak valid, silahkan login ulang',
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
        message: message ?? 'Session sudah expired, silahkan login ulang',
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
 * Method untuk generate payload response body saat penggunaan akses atau rate limit `token` mencapai maksimal dengan parameter berikut,
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
 *          message: 'Too Many Request - Rate limit exceeded'
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Object<string,any>, customProps?:Object<string,any>) => Omit<APIResponseBodyProps, 'data'>} maximum_token
 * Method untuk generate payload response body saat jumlah rate limit `token` mencapai maksimal dengan parameter berikut,
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
 *          message: 'Service Unavailable - Server is currently busy'
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