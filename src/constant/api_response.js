/**
 * @typedef {Object} APIResponseBaseProps
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
 * @property {Object} _details
 * Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`, initial value `undefined`.
 * Selalu destructure props ini, pastikan props ini hanya tampil pada body response jika request diinisialisasikan oleh `service` atau proses `internal` lainnya.
 * @property {'error' | 'warning' | 'critical'} _details.severity
 * Tingkat error yang terjadi
 * @property {number} _details.stamp
 * Kapan error terjadi dalam unix timestamp
 * @property {string} _details.reason
 * Penyebab error yang terjadi
 * @property {string | null} _details.stack
 * Stack error yang terjadi
 * @property {string} _details.functionDetails
 * Nama fungsi, letak module dan baris kode penyebab error yang terjadi
 * - Contoh : `'validateJWT at utils/server_side.js line 27'`
 * @property {Object<string,any>} _details.functionArgs
 * Object yang berisikan parameter function penyebab error yang terjadi
 * @property {Object<string,any>} _details.functionResolvedVariable
 * Object yang berisikan variable yang diresolve function
 * @property {Object} _details.request
 * Object yang berisikan request data `cookies`, `ip`, `headers`
 * @property {string} _details.request.ip
 * Request ip
 * @property {Array<{name:string, value:string, path:string}>} _details.request.cookies
 * Request cookies
 * @property {Object<string,any>} _details.request.headers
 * Request headers
 * @property {any | null} _details.more
 * Instance error yang digenerate dari library lain jika tersedia
 */

/** @typedef {Omit<APIResponseBaseProps, 'data'>} APIResponseErrorProps */
/** @typedef {Omit<APIResponseBaseProps, 'error' | '_details'>} APIResponseSuccessProps */

/** @typedef {Omit<APIResponseBaseProps, 'data' | 'code' | 'headers' | '_details'>} ClientAPIResponseErrorProps */
/** @typedef {Omit<APIResponseBaseProps, 'error' | 'code' | 'headers' | '_details'>} ClientAPIResponseSuccessProps */

/** @typedef {'AUTH_00' | 'AUTH_01' | 'AUTH_02' | 'AUTH_03' | 'AUTH_04'} AuthErrorCodes */

/** 
 * @typedef {Object} AuthErrorResponseType
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} missing_access_token
 * Method untuk generate payload response body saat user access token atau cookie `'s_access_token'` tidak tersedia dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
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
 *      },
 *      _details: {
 *          stamp: Math.floor(Date.now() / 1000),
 *          ...errorDetails
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} invalid_access_token
 * Method untuk generate payload response body saat user access token atau cookie `'s_access_token'` tidak valid dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
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
 *      },
 *      _details: {
 *          stamp: Math.floor(Date.now() / 1000),
 *          ...errorDetails
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} expired_access_token
 * Method untuk generate payload response body saat user access token atau cookie `'s_access_token'` expired atau kadaluwarsa dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
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
 *      },
 *      _details: {
 *          stamp: Math.floor(Date.now() / 1000),
 *          ...errorDetails
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} missing_session
 * Method untuk generate payload response body saat session atau cookie `'_Secure-auth.session-token'` tidak tersedia dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 401,
 *      message: message ?? 'Session tidak ditemukan',
 *      error: {
 *          code: 'AUTH_03',
 *          message: 'Unauthorized - Missing session',
 *          hintUrl: errorHintUrl,
 *      },
 *      _details: {
 *          stamp: Math.floor(Date.now() / 1000),
 *          ...errorDetails
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} invalid_session
 * Method untuk generate payload response body saat session atau cookie `'_Secure-auth.session-token'` tidak valid dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 401,
 *      message: message ?? 'Session tidak valid',
 *      error: {
 *          code: 'AUTH_04',
 *          message: 'Unauthorized - Invalid session',
 *          hintUrl: errorHintUrl,
 *      },
 *      _details: {
 *          stamp: Math.floor(Date.now() / 1000),
 *          ...errorDetails
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
    missing_access_token: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 401,
        message: message ?? 'Akses token tidak ditemukan',
        error: {
            code: 'AUTH_00',
            message: 'Unauthorized - Missing access token',
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
    invalid_access_token: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 401,
        message: message ?? 'Akses token tidak valid',
        error: {
            code: 'AUTH_01',
            message: 'Unauthorized - Invalid access token',
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
    expired_access_token: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 401,
        message: message ?? 'Akses token expired',
        error: {
            code: 'AUTH_02',
            message: 'Unauthorized - Expired access token',
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
    missing_session: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 401,
        message: message ?? 'Session tidak ditemukan',
        error: {
            code: 'AUTH_03',
            message: 'Unauthorized - Missing session',
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
    invalid_session: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 401,
        message: message ?? 'Session tidak valid',
        error: {
            code: 'AUTH_04',
            message: 'Unauthorized - Invalid session',
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
}

/** @typedef {'RL_00' | 'RL_01'} RatelimitErrorCodes */

/** 
 * @typedef {Object} RatelimitErrorResponseType
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} maximum_usage
 * Method untuk generate payload response body saat penggunaan akses atau rate limit `token` mencapai maksimal dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
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
 *      },
 *      _details: {
 *          stamp: Math.floor(Date.now() / 1000),
 *          ...errorDetails
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} maximum_token
 * Method untuk generate payload response body saat jumlah rate limit `token` mencapai maksimal dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
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
 *      },
 *      _details: {
 *          stamp: Math.floor(Date.now() / 1000),
 *          ...errorDetails
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
    maximum_usage: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 429,
        message: message ?? 'Terlalu banyak request, coba lagi nanti',
        error: {
            code: 'RL_00',
            message: 'Too Many Request - Rate limit exceeded',
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
    maximum_token: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 503,
        message: message ?? 'Server sibuk, coba lagi nanti',
        error: {
            code: 'RL_01',
            message: 'Service Unavailable - Server is currently busy',
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
}