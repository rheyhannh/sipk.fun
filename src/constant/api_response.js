// #region api_helper Types
/**
 * @typedef {Object} checkRateLimitReturnType
 * @property {number} currentUsage 
 * Jumlah penggunaan
 * @property {number} currentTtl 
 * Durasi reset penggunaan dalam detik
 * @property {currentSize} currentSize 
 * Jumlah size token
 * @property {{"X-Ratelimit-limit":number, "X-Ratelimit-Remaining":number}} rateLimitHeaders
 * Ratelimit headers dengan props :
 * - `X-Ratelimit-limit` : Jumlah maksimum penggunaan
 * - `X-Ratelimit-Remaining` : Sisa penggunaan
 * 
 * Append props ini pada headers `NextResponse`
 * 
 * ```js
 * const { rateLimitHeaders } = await checkRateLimit(limiter, 10);
 * return NextResponse.json(null, {
 *      headers: { ...rateLimitHeaders }
 * })
 * ```
 */

/**
 * @typedef {Object} getLogAttributesReturnType
 * @property {string} method
 * Request method, diresolve melalui `request.method`
 * @property {string} url
 * Request url, diresolve melalui `request.url`
 * @property {Object} nextUrl 
 * @property {string} nextUrl.host
 * Request host, diresolve melalui `request.nextUrl?.host`
 * @property {string} nextUrl.hostname
 * Request hostname, diresolve melalui `request.nextUrl?.hostname`
 * @property {string} nextUrl.href
 * Request href, diresolve melalui `request.nextUrl?.href`
 * @property {string} nextUrl.origin
 * Request origin, diresolve melalui `request.nextUrl?.origin`
 * @property {string} nextUrl.pathname
 * Request pathname, diresolve melalui `request.nextUrl?.pathname`
 * @property {string} nextUrl.port
 * Request port, diresolve melalui `request.nextUrl?.port`
 * @property {string} nextUrl.protocol
 * Request protocol, diresolve melalui `request.nextUrl?.protocol`
 * @property {string} nextUrl.search
 * Request search, diresolve melalui `request.nextUrl?.search`
 */
// #endregion

// #region Core
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
 * @property {'BadRequestError' | 'AuthError' | 'RatelimitError' | 'ServerError' | 'NotFoundError' | 'ConflictError'} error.type
 * Tipe atau instance error yang terjadi
 * @property {BadRequestErrorCodes | AuthErrorCodes | RatelimitErrorCodes | ServerErrorCodes | NotFoundErrorCodes | ConflictErrorCodes} error.code
 * Kode referensi error pada SIPK dengan keterangan berikut,
 * - `BR_00` : Proses parsing request body `request.json()` gagal
 * - `BR_01` : Proses validasi form data menggunakan `Joi` gagal
 * - `BR_02` : Request params tidak valid
 * - `AUTH_00` : User access token atau cookie `'s_access_token'` tidak tersedia
 * - `AUTH_01` : User access token atau cookie `'s_access_token'` tidak valid
 * - `AUTH_02` : User access token atau cookie `'s_access_token'` expired atau kadaluwarsa
 * - `AUTH_03` : Session atau cookie `'_Secure-auth.session-token'` tidak tersedia
 * - `AUTH_04` : Session atau cookie `'_Secure-auth.session-token'` tidak valid
 * - `RL_00` : Penggunaan akses atau rate limit `token` mencapai maksimal
 * - `RL_01` : Jumlah rate limit `token` mencapai maksimal
 * - `SRV_00` : Terjadi kesalahan pada server biasanya karna error pada `Supabase` saat query database
 * - `SRV_01` : Server sibuk, overload atau sedang maintenance
 * - `SRV_02` : Request tidak dapat dipenuhi karna tidak didukung
 * - `NF_00` : Resource tidak ditemukan
 * - `CF_00` : Resource sudah tersedia
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
 * @property {getLogAttributesReturnType} _details.request.info
 * @property {string} _details.request.ip
 * Request ip
 * @property {Array<{name:string, value:string, path:string}>} _details.request.cookies
 * Request cookies
 * @property {Object<string,any>} _details.request.headers
 * Request headers
 * @property {Omit<checkRateLimitReturnType, 'rateLimitHeaders'>} _details.resolvedRatelimit
 * @property {any | null} _details.more
 * Instance error yang digenerate dari library lain jika tersedia
 */

/** @typedef {Omit<APIResponseBaseProps, 'data'>} APIResponseErrorProps */
/** @typedef {Omit<APIResponseBaseProps, 'error' | '_details'>} APIResponseSuccessProps */

/** @typedef {Omit<APIResponseBaseProps, 'data' | 'code' | 'headers' | '_details'>} ClientAPIResponseErrorProps */
/** @typedef {Omit<APIResponseBaseProps, 'error' | 'code' | 'headers' | '_details'>} ClientAPIResponseSuccessProps */
// #endregion

// #region BadRequestError or any 400 error 
/** @typedef {keyof badRequestErrorCodesList} BadRequestErrorCodes */

export const badRequestErrorCodesList = {
    'BR_00': { name: 'Bad Request - Invalid JSON format', message: 'Terjadi kesalahan saat memproses permintaan' },
    'BR_01': { name: 'Bad Request - Invalid form data format', message: 'Form data yang dilampirkan tidak valid' },
    'BR_02': { name: 'Bad Request - Invalid request params', message: 'Terjadi kesalahan saat memproses permintaan' },
}

/** 
 * @typedef {Object} BadRequestErrorResponseType
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} malformed_request_body
 * Method untuk generate payload response body saat proses parsing request body `request.json()` gagal dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 400,
 *      message: message ?? badRequestErrorCodesList['BR_00'].message,
 *      error: {
 *          type: 'BadRequestError',
 *          code: 'BR_00',
 *          message: badRequestErrorCodesList['BR_00'].name,
 *          hintUrl: errorHintUrl,
 *      },
 *      _details: {
 *          stamp: Math.floor(Date.now() / 1000),
 *          ...errorDetails
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} invalid_form_data
 * Method untuk generate payload response body saat proses validasi form data menggunakan `Joi` gagal dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 400,
 *      message: message ?? badRequestErrorCodesList['BR_01'].message,
 *      error: {
 *          type: 'BadRequestError',
 *          code: 'BR_01',
 *          message: badRequestErrorCodesList['BR_01'].name,
 *          hintUrl: errorHintUrl,
 *      },
 *      _details: {
 *          stamp: Math.floor(Date.now() / 1000),
 *          ...errorDetails
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} malformed_request_params
 * Method untuk generate payload response body saat request params tidak valid dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 400,
 *      message: message ?? badRequestErrorCodesList['BR_02'].message,
 *      error: {
 *          type: 'BadRequestError',
 *          code: 'BR_02',
 *          message: badRequestErrorCodesList['BR_02'].name,
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
 * Generate payload response body saat `BadRequestError` dimana setiap key merepresentasikan tipe error
 * @type {BadRequestErrorResponseType} 
 */
export const BadRequestErrorResponse = {
    malformed_request_body: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 400,
        message: message ?? badRequestErrorCodesList['BR_00'].message,
        error: {
            type: 'BadRequestError',
            code: 'BR_00',
            message: badRequestErrorCodesList['BR_00'].name,
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
    invalid_form_data: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 400,
        message: message ?? badRequestErrorCodesList['BR_01'].message,
        error: {
            type: 'BadRequestError',
            code: 'BR_01',
            message: badRequestErrorCodesList['BR_01'].name,
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
    malformed_request_params: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 400,
        message: message ?? badRequestErrorCodesList['BR_02'].message,
        error: {
            type: 'BadRequestError',
            code: 'BR_02',
            message: badRequestErrorCodesList['BR_02'].name,
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
}
// #endregion

// #region AuthError or any 401 error
/** @typedef {keyof authErrorCodesList} AuthErrorCodes */

export const authErrorCodesList = {
    'AUTH_00': { name: 'Unauthorized - Missing access token', message: 'Akses token tidak ditemukan' },
    'AUTH_01': { name: 'Unauthorized - Invalid access token', message: 'Akses token tidak valid' },
    'AUTH_02': { name: 'Unauthorized - Expired access token', message: 'Akses token expired' },
    'AUTH_03': { name: 'Unauthorized - Missing session', message: 'Session tidak ditemukan' },
    'AUTH_04': { name: 'Unauthorized - Invalid session', message: 'Session tidak valid' },
}

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
 *      message: message ?? authErrorCodesList['AUTH_00'].message,
 *      error: {
 *          type: 'AuthError',
 *          code: 'AUTH_00',
 *          message: authErrorCodesList['AUTH_00'].name,
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
 *      message: message ?? authErrorCodesList['AUTH_01'].message,
 *      error: {
 *          type: 'AuthError',
 *          code: 'AUTH_01',
 *          message: authErrorCodesList['AUTH_01'].name,
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
 *      message: message ?? authErrorCodesList['AUTH_02'].message,
 *      error: {
 *          type: 'AuthError',
 *          code: 'AUTH_02',
 *          message: authErrorCodesList['AUTH_02'].name,
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
 *      message: message ?? authErrorCodesList['AUTH_03'].message,
 *      error: {
 *          type: 'AuthError',
 *          code: 'AUTH_03',
 *          message: authErrorCodesList['AUTH_03'].name,
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
 *      message: message ?? authErrorCodesList['AUTH_04'].message,
 *      error: {
 *          type: 'AuthError',
 *          code: 'AUTH_04',
 *          message: authErrorCodesList['AUTH_04'].name,
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
        message: message ?? authErrorCodesList['AUTH_00'].message,
        error: {
            type: 'AuthError',
            code: 'AUTH_00',
            message: authErrorCodesList['AUTH_00'].name,
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
        message: message ?? authErrorCodesList['AUTH_01'].message,
        error: {
            type: 'AuthError',
            code: 'AUTH_01',
            message: authErrorCodesList['AUTH_01'].name,
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
        message: message ?? authErrorCodesList['AUTH_02'].message,
        error: {
            type: 'AuthError',
            code: 'AUTH_02',
            message: authErrorCodesList['AUTH_02'].name,
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
        message: message ?? authErrorCodesList['AUTH_03'].message,
        error: {
            type: 'AuthError',
            code: 'AUTH_03',
            message: authErrorCodesList['AUTH_03'].name,
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
        message: message ?? authErrorCodesList['AUTH_04'].message,
        error: {
            type: 'AuthError',
            code: 'AUTH_04',
            message: authErrorCodesList['AUTH_04'].name,
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
}
// #endregion

// #region NotFoundError or any 404 error
/** @typedef {keyof notFoundErrorCodesList} NotFoundErrorCodes */

export const notFoundErrorCodesList = {
    'NF_00': { name: 'Not Found - Resource not found', message: 'Resource tidak ditemukan' },
}

/** 
 * @typedef {Object} NotFoundErrorResponseType
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} resource_not_found
 * Method untuk generate payload response body saat resource tidak ditemukan dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 404,
 *      message: message ?? notFoundErrorCodesList['NF_00'].message,
 *      error: {
 *          type: 'NotFoundError',
 *          code: 'NF_00',
 *          message: notFoundErrorCodesList['NF_00'].name,
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
 * Generate payload response body saat `NotFoundError` dimana setiap key merepresentasikan tipe error
 * @type {NotFoundErrorResponseType} 
 */
export const NotFoundErrorResponse = {
    resource_not_found: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 404,
        message: message ?? notFoundErrorCodesList['NF_00'].message,
        error: {
            type: 'NotFoundError',
            code: 'NF_00',
            message: notFoundErrorCodesList['NF_00'].name,
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
}
// #endregion

// #region ConflictError or any 409 error
/** @typedef {keyof conflictErrorCodesList} ConflictErrorCodes */

export const conflictErrorCodesList = {
    'CF_00': { name: 'Conflict - Resource already exist', message: 'Resource sudah tersedia' },
}

/** 
 * @typedef {Object} ConflictErrorResponseType
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} resource_already_exist
 * Method untuk generate payload response body saat resource sudah tersedia dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 409,
 *      message: message ?? conflictErrorCodesList['CF_00'].message,
 *      error: {
 *          type: 'ConflictError',
 *          code: 'CF_00',
 *          message: conflictErrorCodesList['CF_00'].name,
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
 * Generate payload response body saat `ConflictError` dimana setiap key merepresentasikan tipe error
 * @type {ConflictErrorResponseType} 
 */
export const ConflictErrorResponse = {
    resource_already_exist: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 409,
        message: message ?? conflictErrorCodesList['CF_00'].message,
        error: {
            type: 'ConflictError',
            code: 'CF_00',
            message: conflictErrorCodesList['CF_00'].name,
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
}
// #endregion

// #region RatelimitError or any 429 error
/** @typedef {keyof rateLimitErrorCodesList} RatelimitErrorCodes */

export const rateLimitErrorCodesList = {
    'RL_00': { name: 'Too Many Request - Rate limit exceeded', message: 'Terlalu banyak request, coba lagi nanti' },
    'RL_01': { name: 'Service Unavailable - Server is currently busy', message: 'Server sibuk, coba lagi nanti' },
}

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
 *      message: message ?? rateLimitErrorCodesList['RL_00'].message,
 *      error: {
 *          type: 'RatelimitError',
 *          code: 'RL_00',
 *          message: rateLimitErrorCodesList['RL_00'].name,
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
 *      message: message ?? rateLimitErrorCodesList['RL_01'].message,
 *      error: {
 *          type: 'RatelimitError',
 *          code: 'RL_01',
 *          message: rateLimitErrorCodesList['RL_01'].name,
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
        message: message ?? rateLimitErrorCodesList['RL_00'].message,
        error: {
            type: 'RatelimitError',
            code: 'RL_00',
            message: rateLimitErrorCodesList['RL_00'].name,
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
        message: message ?? rateLimitErrorCodesList['RL_01'].message,
        error: {
            type: 'RatelimitError',
            code: 'RL_01',
            message: rateLimitErrorCodesList['RL_01'].name,
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
}
// #endregion

// #region ServerError or any 500 error
/** @typedef {keyof serverErrorCodesList} ServerErrorCodes */

export const serverErrorCodesList = {
    'SRV_00': { name: 'Internal Server Error - Something went wrong', message: 'Terjadi kesalahan pada server' },
    'SRV_01': { name: 'Service Unavailable - Server is currently busy', message: 'Server sibuk, coba lagi nanti' },
    'SRV_02': { name: 'Not Implemented - Request not supported', message: 'Request tidak dapat diproses' },
}

/** 
 * @typedef {Object} ServerErrorResponseType
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} interval_server_error
 * Method untuk generate payload response body saat terjadi internal server error dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 500,
 *      message: message ?? serverErrorCodesList['SRV_00'].message,
 *      error: {
 *          type: 'ServerError',
 *          code: 'SRV_00',
 *          message: serverErrorCodesList['SRV_00'].name,
 *          hintUrl: errorHintUrl,
 *      },
 *      _details: {
 *          stamp: Math.floor(Date.now() / 1000),
 *          ...errorDetails
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} service_unavailable
 * Method untuk generate payload response body saat server tidak dapat handle request dimana server sedang sibuk, overload atau maintenance dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 503,
 *      message: message ?? serverErrorCodesList['SRV_01'].message,
 *      error: {
 *          type: 'ServerError',
 *          code: 'SRV_01',
 *          message: serverErrorCodesList['SRV_01'].name,
 *          hintUrl: errorHintUrl,
 *      },
 *      _details: {
 *          stamp: Math.floor(Date.now() / 1000),
 *          ...errorDetails
 *      },
 *      ...customProps
 * }
 * ```
 * @property {(message?:string, errorHintUrl?:string, errorDetails?:Omit<APIResponseBaseProps['_details'], 'stamp'>, customProps?:Object<string,any>) => APIResponseErrorProps} request_not_supported
 * Method untuk generate payload response body saat request tidak dapat dipenuhi karna tidak didukung dengan `optional` parameter berikut,
 * - `message` : String untuk override default message yang ditampilkan ke user dengan `toast`
 * - `errorHintUrl` : Link atau pathname yang dapat digunakan sebagai call to action untuk user mengetahui lebih lanjut `error` yang terjadi 
 * - `errorDetails` : Error details untuk mendeskripsikan error lebih detail untuk tujuan `logging`
 * - `customProps` : Object untuk menambah props tertentu selain status, message, code dan error
 * 
 * ```js
 * const payload = {
 *      status: 'error',
 *      code: 501,
 *      message: message ?? serverErrorCodesList['SRV_02'].message,
 *      error: {
 *          type: 'ServerError',
 *          code: 'SRV_02',
 *          message: serverErrorCodesList['SRV_02'].name,
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
 * Generate payload response body saat `ServerError` dimana setiap key merepresentasikan tipe error
 * @type {ServerErrorResponseType} 
 */
export const ServerErrorResponse = {
    interval_server_error: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 500,
        message: message ?? serverErrorCodesList['SRV_00'].message,
        error: {
            type: 'ServerError',
            code: 'SRV_00',
            message: serverErrorCodesList['SRV_00'].name,
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
    service_unavailable: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 503,
        message: message ?? serverErrorCodesList['SRV_01'].message,
        error: {
            type: 'ServerError',
            code: 'SRV_01',
            message: serverErrorCodesList['SRV_01'].name,
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
    request_not_supported: (message, errorHintUrl, errorDetails = {}, customProps) => ({
        status: 'error',
        code: 501,
        message: message ?? serverErrorCodesList['SRV_02'].message,
        error: {
            type: 'ServerError',
            code: 'SRV_02',
            message: serverErrorCodesList['SRV_02'].name,
            hintUrl: errorHintUrl,
        },
        _details: {
            stamp: Math.floor(Date.now() / 1000),
            ...errorDetails
        },
        ...((({ status, code, message, error, ...rest }) => rest)(customProps || {}))
    }),
}
// #endregion