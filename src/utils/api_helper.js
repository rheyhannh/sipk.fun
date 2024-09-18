// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { rateLimitInstance } from '@/utils/server_side';
import {
    APIResponseErrorProps,
    checkRateLimitReturnType,
    getLogAttributesReturnType
} from '@/constant/api_response';
import { PostgrestError } from '@supabase/supabase-js';
// #endregion
// #region NEXT DEPEDENCY
import { NextRequest } from 'next/server';
import { cookies, headers } from 'next/headers';
// #endregion

// #region SUPABASE DEPEDENCY
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
// #endregion

// #region UTIL DEPEDENCY
import Joi from 'joi';
import {
    encryptAES,
    decryptAES,
    validateJWT,
    getCookieOptions,
    getSipkCookies,
    getApiKey,
    resetSipkCookies,
    getIpFromHeaders,
    getRequestDetails,
} from '@/utils/server_side';
import {
    BadRequestErrorResponse as badRequestError,
    AuthErrorResponse as authError,
    ServerErrorResponse as serverError,
} from '@/constant/api_response';
// #endregion

/**
 * Middleware untuk verifikasi user `Session` yang diperoleh dari cookie `'_Secure-auth.session-token'`
 * @param {boolean} [resetCookies=true] Reset cookies saat verifikasi `Session` gagal, default `true`
 * @returns {Promise<SupabaseTypes.Session>} Resolve dengan decrypted user session
 * @throws Object `AuthError` saat user session tidak tersedia atau tidak valid
 */
export async function verifySession(resetCookies = true) {
    const { secureSessionCookie = null } = await getSipkCookies();
    if (!secureSessionCookie) {
        if (resetCookies) await resetSipkCookies();
        throw authError.missing_session(
            undefined, undefined,
            {
                severity: 'error',
                reason: 'User session not found',
                stack: null,
                functionDetails: 'verifySession at utils/api_helper.js line 42',
                functionArgs: { resetCookies },
                functionResolvedVariable: { secureSessionCookie },
                request: await getRequestDetails(),
                more: null,
            }
        );
    }

    const decryptedSession = await decryptAES(secureSessionCookie, true);
    if (!decryptedSession) {
        if (resetCookies) await resetSipkCookies();
        throw authError.invalid_session(
            undefined, undefined,
            {
                severity: 'error',
                reason: 'User session invalid',
                stack: null,
                functionDetails: 'verifySession at utils/api_helper.js line 61',
                functionArgs: { resetCookies },
                functionResolvedVariable: { secureSessionCookie },
                request: await getRequestDetails(),
                more: null,
            }
        );
    }

    return decryptedSession;
}

/**
 * Middleware untuk verifikasi user access token yang diperoleh dari header `Authorization`
 * @param {string} [userId] User id berformat `UUID` sebagai referensi untuk proses verifikasi user access token. Jika tidak dipass maka akan mencoba mengambil user id dari cookie `serviceUserIdCookie`
 * @returns {Promise<SupabaseTypes.AccessTokenPayload>} Resolve dengan decoded user access token atau decoded `JWT` payload
 * @throws Object `AuthError` saat user access token tidak tersedia, tidak valid dan saat `userId` tidak dapat diresolve
 */
export async function verifyAccessToken(userId = null) {
    const authorizationHeader = headers().get('Authorization');
    if (!authorizationHeader) throw authError.missing_access_token(
        undefined, undefined,
        {
            severity: 'error',
            reason: 'Authorization header not found',
            stack: null,
            functionDetails: 'verifyAccessToken at utils/api_helper.js line 87',
            functionArgs: { userId },
            functionResolvedVariable: { authorizationHeader },
            request: await getRequestDetails(),
            more: null,
        }
    );

    const authorizationToken = authorizationHeader.split(' ')[1] ? authorizationHeader.split(' ')[1] : null;
    if (!authorizationToken) throw authError.missing_access_token(
        undefined, undefined,
        {
            severity: 'error',
            reason: "Authorization header format not valid, expected access token after 'Bearer'",
            stack: null,
            functionDetails: 'verifyAccessToken at utils/api_helper.js line 102',
            functionArgs: { userId },
            functionResolvedVariable: { authorizationHeader, authorizationToken },
            request: await getRequestDetails(),
            more: null,
        }
    );

    userId = userId ?? (await getSipkCookies()).serviceUserIdCookie ?? '';

    try {
        const decodedAccessToken = await validateJWT(authorizationToken, userId);

        return decodedAccessToken;
    } catch (/** @type {APIResponseErrorProps} */ error) {
        // Rethrow error from validateJWT()
        throw error;
    }
}

/**
 * @typedef {Object} verifyAuthReturnType
 * @property {SupabaseTypes.Session} decryptedSession
 * Decrypted user session
 * @property {SupabaseTypes.AccessTokenPayload} decodedAccessToken
 * Decoded user access token atau decoded `JWT` payload
 */

/**
 * Middleware untuk verifikasi autentikasi user menggunakan `verifySession()` dan `verifyAccessToken()`
 * @param {boolean} [resetCookies] Reset cookies saat verifikasi session gagal, default `true`
 * @param {boolean} [revalidateCookies] Revalidate cookie `'s_access_token'` dan `'s_user_id'` jika tidak sesuai saat verifikasi session berhasil, default `true`
 * @returns {Promise<verifyAuthReturnType>} Resolve dengan object yg berisikan decrypted user session dan decoded user access token
 * @throws Object `AuthError` verifikasi session atau access token gagal
 */
export async function verifyAuth(resetCookies = true, revalidateCookies = true) {
    try {
        const decryptedSession = await verifySession(resetCookies);
        const { user: { id: userId = null }, access_token = null } = decryptedSession;

        const cookieStore = cookies();
        const { serviceUserIdCookie, serviceAccessTokenCookie, serviceGuestCookie } = await getSipkCookies();
        const cookieServiceOptions = await getCookieOptions('service', 'set');
        const cookieServiceDeleteOptions = await getCookieOptions('service', 'remove');

        if (revalidateCookies && userId && serviceUserIdCookie !== userId) {
            cookieStore.set('s_user_id', userId, cookieServiceOptions);
        }

        if (revalidateCookies && serviceGuestCookie) {
            cookieStore.set('s_guest_id', '', cookieServiceDeleteOptions)
        }

        const decodedAccessToken = await verifyAccessToken(userId).catch(error => {
            if (revalidateCookies && access_token && serviceAccessTokenCookie !== access_token) {
                cookieStore.set('s_access_token', access_token, cookieServiceOptions);
            }

            throw error;
        });

        return { decryptedSession, decodedAccessToken }
    } catch (/** @type {APIResponseErrorProps} */ error) {
        // Rethrow error from verifySession() or verifyAccessToken()
        throw error;
    }
}

/**
 * Middleware untuk verifikasi service api key dari query param `'apiKey'` atau header `'X-Api-Key'`
 * @param {NextRequest} request 
 * @returns {Promise<boolean>} Resolve dengan boolean dimana `true` saat berhasil, dan `false` saat gagal
 */
export async function verifyService(request) {
    const serviceApiKey = await getApiKey(request);
    return serviceApiKey === process.env.SUPABASE_SERVICE_KEY;
}

/**
 * Middleware untuk cek rate limit berdasarkan `IP` yang diperoleh dari method `getIpFromHeaders()`
 * @param {rateLimitInstance} limiter Ratelimit instance
 * @param {number} maxRequest Limit maksimum jumlah penggunaan
 * @returns {Promise<checkRateLimitReturnType>} Resolve dengan object
 * @throws Object `RateLimitError` saat jumlah penggunaan sudah mencapai limit atau token pada server penuh
 */
export async function checkRateLimit(limiter, maxRequest) {
    const clientIp = await getIpFromHeaders() ?? 'public';

    try {
        const { currentUsage, currentTtl, currentSize } = await limiter.check(maxRequest, clientIp);
        const rateLimitHeaders = {
            'X-Ratelimit-limit': maxRequest,
            'X-Ratelimit-Remaining': maxRequest - currentUsage,
        }

        return { currentUsage, currentTtl, currentSize, rateLimitHeaders }
    } catch (/** @type {APIResponseErrorProps} */ error) {
        throw error;
    }
}

/**
 * Supabase instance atau client yang digenerate menggunakan `createServerClient()` dilengkapi dengan cookie manager.
 * 
 * Autentikasi menggunakan user `Session` atau cookie `'_Secure-auth.session-token'`.
 * Gunakan instance ini untuk memperoleh data user atau hal lainnya dengan `autentikasi` tersebut.
 */
export const supabaseServerClient = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        cookies: {
            async get(name) {
                try {
                    const decryptedSession = await verifySession(false);
                    return decryptedSession;
                } catch { return null }
            },
            async set(name, value, options) {
                const cookieStore = cookies();
                const encryptedSession = await encryptAES(value);
                const cookieAuthOptions = await getCookieOptions('auth', 'set');
                cookieStore.set({
                    name: process.env.USER_SESSION_COOKIES_NAME,
                    value: encryptedSession,
                    ...cookieAuthOptions,
                });
            },
            async remove(name, options) {
                await resetSipkCookies();
            },
        },
    }
)

/**
 * Supabase instance atau client yang digenerate menggunakan `createClient()` dengan `SERVICE_KEY`.
 * 
 * Dengan service key, `autentikasi` tidak dibutuhkan dan service key dapat bypass supabase `RLS`, sehingga hanya gunakan instance ini untuk kebutuhan `internal`.
 */
export const supabaseServiceClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

/**
 * Middleware untuk retrieve log attributes untuk kebutuhan `logging`, resolve dengan object berikut,
 * 
 * ```js
 * const logAttributes = 
 * {
 *      method: request.method, 
 *      url: request.url,
 *      nextUrl: {
 *          host: request.nextUrl?.host,
 *          hostname: request.nextUrl?.hostname,
 *          href: request.nextUrl?.href,
 *          origin: request.nextUrl?.origin,
 *          pathname: request.nextUrl?.pathname,
 *          port: request.nextUrl?.port,
 *          protocol: request.nextUrl?.protocol,
 *          search: request.nextUrl?.search,
 *      }
 * };
 * ```
 * @param {NextRequest} request
 * @returns {Promise<getLogAttributesReturnType>} Resolve dengan object `logAttributes` lihat deksripsi
 */
export async function getLogAttributes(request) {
    const { method, url } = request;
    const { host, hostname, href, origin, pathname, port, protocol, search } = request.nextUrl;

    return {
        method: method ?? null,
        url: url ?? null,
        nextUrl: {
            host: host ?? null,
            hostname: hostname ?? null,
            href: href ?? null,
            origin: origin ?? null,
            pathname: pathname ?? null,
            port: port ?? null,
            protocol: protocol ?? null,
            search: search ?? null,
        }
    }
}

/**
 * @typedef {Object} handleErrorResponseReturnType
 * @property {Omit<APIResponseErrorProps, '_details' | 'code' | 'headers'>} body
 * Response body
 * @property {APIResponseErrorProps['code']} status
 * Response status
 * @property {APIResponseErrorProps['headers'] | null} headers
 * Response headers
 */

/**
 * Middleware untuk handle error response yang akan dikirim ke user dengan step berikut,
 * - Saat `production`, props `'_details'` pada error object `APIResponseError` akan difilter karna props tersebut hanya dapat diexpose pada sisi server
 * - Assign `requestLog` dan `ratelimitLog` jika tersedia untuk kebutuhan `logging`
 * - Log error yang terjadi dengan `console.error` saat param `logError` truthy
 * - Return object dengan props `body`, `status` dan `headers` untuk digunakan `NextResponse`
 * @param {APIResponseErrorProps} error Error object dari `APIResponseError`
 * @param {getLogAttributesReturnType} [requestLog] Log request untuk digunakan sebagai `logging`, default `null`
 * @param {Omit<checkRateLimitReturnType, 'rateLimitHeaders'>} [ratelimitLog] Log ratelimit untuk digunakan sebagai `logging`, default `null`
 * @param {boolean} [logError] Log error, default `true`
 * @returns {Promise<handleErrorResponseReturnType>} Resolve dengan object untuk digunakan sebagai response
 */
export async function handleErrorResponse(error, requestLog = null, ratelimitLog = null, logError = true) {
    if (requestLog) error._details.request = { info: requestLog, ...error._details.request };
    if (ratelimitLog) error._details.resolvedRatelimit = ratelimitLog;

    const { code, headers = null, _details, ...rest } = error;
    const body = process.env.NODE_ENV === 'production' ? { ...rest } : { ...rest, _details: error._details };

    if (logError) console.error(error);

    return { body, status: code, headers };
}

/**
 * Middleware untuk generate object `ServerError` saat terjadi error dari supabase `PostgrestError`
 * @param {PostgrestError} [error] Error object dari `PostgrestError`, default `null`
 * @param {boolean} throwErrorObject Boolean untuk throw object `ServerError`
 * @param {Pick<APIResponseErrorProps['_details'], 'functionDetails' | 'functionArgs' | 'functionResolvedVariable'>} [initiator] Detail function penyebab error, default `{}`
 * @returns {Promise<APIResponseErrorProps>} Resolve dengan object `ServerError` atau `void` saat `!throwErrorObject`
 * @throws Object `ServerError` saat param `throwErrorObject`
 */
export async function handleSupabaseError(error = null, throwErrorObject, initiator = {}) {
    if (!initiator?.functionDetails) initiator.functionDetails = null;
    if (!initiator?.functionArgs) initiator.functionArgs = null;
    if (!initiator?.functionResolvedVariable) initiator.functionResolvedVariable = null;

    const errorObject = serverError.interval_server_error(
        undefined, undefined,
        {
            severity: 'error',
            reason: 'Error when querying database',
            stack: null,
            ...initiator,
            request: await getRequestDetails(),
            more: error,
        }
    )

    if (throwErrorObject) { throw errorObject }
    else { return errorObject }
}

/**
 * Middleware untuk parse `formData` atau request `body` dengan `request.json()`
 * @param {NextRequest} request
 * @returns {Promise<Object<string, any>>} Resolve dengan parsed form data
 * @throws Object `BadRequestError` saat parsing gagal
 */
export async function parseFormData(request) {
    try {
        const formData = await request.json();

        return formData;
    } catch (error) {
        throw badRequestError.malformed_request_body(
            undefined, undefined,
            {
                severity: 'error',
                reason: 'Failed to parse request body',
                stack: null,
                functionDetails: 'parseFormData at utils/api_helper.js line 345',
                functionArgs: null,
                functionResolvedVariable: null,
                request: await getRequestDetails(),
                more: error,
            }
        );
    }
}

/**
 * Middleware untuk validate `formData` dengan preset schema yang tersedia atau custom schema menggunakan `Joi`
 * @param {Object<string, any>} formData Form data yang ingin divalidasi
 * @param {keyof schemaDataJoi} [presetSchema] Preset schema yang digunakan
 * @param {Joi.ObjectSchema<any>} [customSchema] Custom schema yang digunakan
 * @returns {Promise<void>} Resolve dengan void
 * @throws Object `BadRequestError` saat validasi gagal
 */
export async function validateFormData(formData, presetSchema = null, customSchema = null) {
    const schemaDataJoi = {
        login: Joi.object({
            email: Joi.string().min(6).max(100).email().required(),
            password: Joi.string().min(6).max(50).required(),
            token: process.env.NODE_ENV !== 'production' ? Joi.string() : Joi.string().required(),
        }),
        magiclink: Joi.object({
            email: Joi.string().min(6).max(100).email().required(),
            token: process.env.NODE_ENV !== 'production' ? Joi.string() : Joi.string().required(),
        }),
        password: Joi.object({
            password: Joi.string().min(6).max(50).required()
        }).required(),
        rating: Joi.object({
            rating: Joi.number().min(1).max(5).required(),
            review: Joi.string().allow('').max(200).required(),
            details: Joi.object({
                author: Joi.string().required(),
                authorType: Joi.number().min(0).max(2).required(),
            }).required()
        }),
        register: Joi.object(
            {
                email: Joi.string().min(6).max(100).email().required(),
                password: Joi.string().min(6).max(50).required(),
                fullname: Joi.string().min(6).max(100).required(),
                university: Joi.string().required(), // Add validator to make sure university and university_id match (ex: id = 1, university must Universitas Brawijaya)
                university_id: Joi.number().min(0).max(parseInt(process.env.DATA_UNIVERSITAS_LENGTH)).required(),
                token: process.env.NODE_ENV !== 'production' ? Joi.string() : Joi.string().required(),
            }
        )
    }

    try {
        const formDataSchema = customSchema ?? schemaDataJoi[presetSchema];

        if (!formDataSchema) {
            throw new Error('Schema required for validation');
        }

        await formDataSchema.validateAsync(formData);
    } catch (error) {
        throw badRequestError.invalid_form_data(
            undefined, undefined,
            {
                severity: 'error',
                reason: error instanceof Joi.ValidationError ? 'Form data not match against schema' : error?.message ?? null,
                stack: null,
                functionDetails: 'validateFormData at utils/api_helper.js line 454',
                functionArgs: null,
                functionResolvedVariable: null,
                request: await getRequestDetails(),
                more: error instanceof Joi.ValidationError ? error : null,
            }
        );
    }
}