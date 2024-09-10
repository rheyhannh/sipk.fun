'use server'

// #region TYPE DEPEDENCY
import * as CookiesTypes from '@/types/cookies';
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region NEXT DEPEDENCY
import { NextRequest } from 'next/server';
import { headers, cookies } from 'next/headers';
// #endregion

// #region UTIL DEPEDENCY
import CryptoJS from 'crypto-js';
import { LRUCache } from 'lru-cache';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import isJWT from 'validator/lib/isJWT';
import isUUID from 'validator/lib/isUUID';
import isNumeric from 'validator/lib/isNumeric';
import {
    AuthErrorResponse as authError,
    RatelimitErrorResponse as rateLimitError
} from '@/constant/api_response';
// #endregion

// #region Security, Encryptor, Decryptor

/**
 * Method untuk enkripsi teks atau data dengan algoritma `AES` dengan key
 * 
 * ```js
 * process.env.SECRET_KEY
 * ```
 * 
 * @param {string} message Teks atau data berbentuk `string` yang ingin diencrypt
 * @return {Promise<string | null>} Promise dengan resolve encrypted teks atau data sebagai `string` saat berhasil dan `null` saat gagal
 * @example 
 * ```js
 * // Stringified Data
 * const data = {
 *      email: 'john@gmail.com',     
 *      session_id: '3fbacbd6-b429-4eb8-87a4-d6aeec54f6c9',
 *      refresh_token: '04aad8a5-aa2a-424c-8c10-e7c058980a00'    
 * }
 * const stringifiedData = JSON.stringify(data);
 * console.log(await encryptAES(stringifiedData)) // '...'
 * 
 * // Plain Text
 * const text = 'pleaseEncryptMe'
 * console.log(await encryptAES(text)) // '...'

 * // Error
 * console.log(await encryptAES(data)) // null
 * ```
 */
export async function encryptAES(message) {
    try {
        const ciphertext = CryptoJS.AES.encrypt(message, process.env.SECRET_KEY).toString();
        return ciphertext;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Method untuk dekripsi teks atau data dengan algoritma `AES` dengan key
 * 
 * ```js
 * process.env.SECRET_KEY
 * ```
 * 
 * @param {string} ciphertext Teks atau data berbentuk `string` yang ingin didecrypt
 * @param {boolean} [parse=false] Opsi boolean untuk parse hasil dekripsi, default: `false`
 * @return {Promise<string | Object | null>} Promise dengan resolve decrypted teks atau data sebagai `string` atau `Object` saat berhasil dan `null` saat gagal
 * @example 
 * ```js
 * // Only Decrypt
 * const encryptedObject = 'someEncryptedText';
 * const x = await decryptAES(encryptedObject);
 * console.log(x); // "{email:'john@gmail.com'}"
 * console.log(typeof x); // string
 * 
 * // Decrypt and Parse Data
 * const y = await decryptAES(encryptedObject, true);
 * console.log(y); // {email:'john@gmail.com'}
 * console.log(typeof y); // object
 * 
 * // Error
 * console.log(await decryptAES(null, true)) // null
 * ```
 */
export async function decryptAES(ciphertext, parse = false) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        if (parse) {
            const decryptedDataParsed = JSON.parse(decryptedData);
            return decryptedDataParsed;
        } else {
            return decryptedData;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

// #endregion

// #region Ratelimit

/**
 * @typedef {Object} rateLimitInstanceCheckReturnType
 * @property {number} currentUsage Jumlah penggunaan
 * @property {number} currentTtl Durasi reset penggunaan dalam detik
 * @property {currentSize} currentSize Jumlah size token
 */

/**
 * @typedef {Object} rateLimitInstance
 * @property {(limit:number, token:string) => Promise<rateLimitInstanceCheckReturnType>} check
 * Method untuk mengecek rate limit dari sebuah token dengan parameter berikut,
 * - `limit` : Limit maksimum jumlah penggunaan
 * - `token` : Token untuk mengecek ratelimit
 * 
 * `Resolve` dengan object berisikan props berikut,
 * - `currentUsage` : Jumlah penggunaan
 * - `currentSize` : Jumlah size token
 * - `currentTtl` : Durasi reset penggunaan dalam detik
 * 
 * `Reject` dengan object `RatelimitError` saat penggunaan sudah lebih dari limit atau jumlah token pada server mencapai maksimal
 */

/**
 * Membuat rate limiter yang dapat mengecek rate limit dari token
 * @param {object} options - Opsi untuk rate limit
 * @param {number} [options.uniqueTokenPerInterval=500] - Angka maksimal untuk setiap token unik yang dapat diterima dalam suatu interval, default : `500`
 * @param {number} [options.interval=60000] - Interval waktu dalam millisekon untuk rate limit, default : `60000`
 * @returns {Promise<rateLimitInstance>} Promise dengan resolve instance ratelimit
 */
export async function rateLimit(options) {
    const tokenCache = new LRUCache({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000,
        ttlAutopurge: true,
    });

    const check = async (limit, token) => {
        const tokenCount = tokenCache.get(token) || [0];
        const isTokenMax = tokenCache.size >= tokenCache.max;

        if (tokenCount[0] === 0) {
            if (isTokenMax) {
                return Promise.reject(rateLimitError.maximum_token(
                    'Server sibuk, coba lagi dalam 1 menit',
                    undefined,
                    {
                        severity: 'error',
                        reason: 'Ratelimit token on server already full',
                        stack: null,
                        functionDetails: 'Ratelimit.check at utils/server_side.js line 143',
                        functionArgs: { limit, token },
                        functionResolvedVariable: { tokenCacheSize: tokenCache.size, tokenCacheMax: tokenCache.max, isTokenMax },
                        request: await getRequestDetails(),
                        more: null,
                    },
                    {
                        headers: {
                            'Retry-After': 60,
                        }
                    }
                ))
            }
            tokenCache.set(token, tokenCount);
        }

        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const currentTtl = Math.round(tokenCache.getRemainingTTL(token) / 1000);
        const currentTtlMsg = currentTtl >= 60 ? '1 menit' : `${currentTtl} detik`;
        const isRateLimited = currentUsage >= limit;

        return isRateLimited ? Promise.reject(rateLimitError.maximum_usage(
            `Terlalu banyak request, coba lagi dalam ${currentTtlMsg}`,
            undefined,
            {
                severity: 'error',
                reason: 'inherit',
                stack: null,
                functionDetails: 'Ratelimit.check at utils/server_side.js line 173',
                functionArgs: { limit, token },
                functionResolvedVariable: { currentUsage, maximumUsage: limit, isRateLimited },
                request: await getRequestDetails(),
                more: null,
            },
            {
                headers: {
                    'Retry-After': currentTtl,
                    'X-Ratelimit-Limit': limit,
                    'X-Ratelimit-Remaining': 0,
                    'X-Ratelimit-Retry-After': currentTtl,
                }
            }
        )) : { currentUsage, currentTtl, currentSize: tokenCache.size };
    };

    return {
        check,
    };
}

// #endregion

// #region Validator, Input Validator, Sanitizer

/**
 * Method untuk validasi supabase `JWT` atau access token atau cookie `'s_access_token'` dengan menggunakan 
 * ```js
 * jwt.verify(); // import jwt from 'jsonwebtoken'
 * ```
 * 
 * Secara default token dinyatakan valid dengan kriteria berikut, 
 * - Tipe param `token` merupakan JWT 
 * - Tipe param `userId` merupakan UUID
 * - Algorithms match dengan salah satu algoritma yang digunakan pada `process.env.JWT_ALGORITHM`
 * - Audience bernilai `'authenticated'`
 * - Issuer match dengan salah satu issuer yang tersedia pada `process.env.JWT_ISSUER`
 * - Subject match dengan param `userId`
 * 
 * @param {string} token Encoded string `JWT` atau access token atau cookie `'s_access_token'`
 * @param {string} userId User id `uuid-v4`
 * @param {boolean} [ignoreExpiration=true] Boolean untuk tetap kategorikan token sebagai `valid` walaupun sudah kadaluwarsa atau `expired`, default: `true`
 * @param {Omit<VerifyOptions, 'algorithms' | 'audience' | 'issuer' | 'ignoreExpiration' | 'subject'} otherOptions Opsi lainnya untuk mempertimbangkan token `valid` atau tidak
 * @returns {Promise<SupabaseTypes.AccessTokenPayload>} Promise dengan `resolve` decoded payload `JWT` atau access token atau cookie `'s_access_token'` dan `reject` dengan error
 * @throws Object `AuthError` saat kriteria pada deskripsi tidak terpenuhi
 */
export async function validateJWT(token, userId, ignoreExpiration = true, otherOptions = {}) {
    if (!userId || typeof userId !== 'string' || !isUUID(userId)) {
        throw authError.invalid_access_token(undefined, undefined, {
            severity: 'error',
            reason: 'User id should exist and UUID typed',
            stack: null,
            functionDetails: 'validateJWT at utils/server_side.js line 208',
            functionArgs: { token, userId, ignoreExpiration, otherOptions },
            functionResolvedVariable: null,
            request: await getRequestDetails(),
            more: null,
        })
    }
    if (!token || typeof token !== 'string' || !isJWT(token)) {
        throw authError.invalid_access_token(undefined, undefined, {
            severity: 'error',
            reason: 'Access token should exist and JWT typed',
            stack: null,
            functionDetails: 'validateJWT at utils/server_side.js line 217',
            functionArgs: { token, userId, ignoreExpiration, otherOptions },
            functionResolvedVariable: null,
            request: await getRequestDetails(),
            more: null,
        })
    }

    try {
        const algorithms = process.env.JWT_ALGORITHM ? process.env.JWT_ALGORITHM.split(',') : ['HS256'];
        const issuer = process.env.JWT_ISSUER ? process.env.JWT_ISSUER.split(',') : ['defaultIssuer'];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, {
            algorithms,
            audience: 'authenticated',
            issuer,
            ignoreExpiration,
            subject: userId,
            ...otherOptions,
        });

        return decoded;
    } catch (error) {
        throw authError.invalid_access_token(undefined, undefined, {
            severity: 'error',
            reason: 'inherit',
            stack: error?.stack ?? null,
            functionDetails: 'validateJWT at utils/server_side.js line 246',
            functionArgs: { token, userId, ignoreExpiration, otherOptions },
            functionResolvedVariable: null,
            request: await getRequestDetails(),
            more: error,
        })
    }
}

/**
 * Method untuk validasi hash identifier
 * @param {string} id Salt string atau user id / guest id.
 * @param {string} stamp Timestamp hash dibuat berformat unix
 * @param {string} identifier Hmac string dengan algoritma SHA512
 * @throws Throw error saat `stamp.length < 10`, `!isNumeric(stamp)`, `stamp lebih dari 30 detik` atau `hash tidak match`
 * @returns {Promise<void>} void
 */
export async function validateIdentifier(id, stamp, identifier) {
    try {
        if (stamp.length < 10) { throw new Error('Invalid stamp format'); }
        if (!isNumeric(stamp)) { throw new Error('Invalid stamp type'); }

        const expiredAt = Number(stamp) + 30;
        const now = Math.round(Date.now() / 1000);
        const isExpired = now > expiredAt;
        if (isExpired) { throw new Error('Expired stamp') }

        const result = Array.from(stamp)
            .map(Number)
            .filter(digit => digit !== 0)
            .reduce((acc, digit) => acc * digit, 1);

        const nonce = result.toString();
        const nonceReverse = nonce.split('').reverse().join('');
        const hashDigest = CryptoJS.SHA256(nonce + id + nonceReverse);
        const hmacDigest = CryptoJS.HmacSHA512(hashDigest, stamp);
        const hmacDigestStr = CryptoJS.enc.Hex.stringify(hmacDigest);

        if (hmacDigestStr !== identifier) { throw new Error('Identifier not match'); }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Method untuk generate Etag atau hash data identifier
 * @param {string|object} data Data yang ingin dihash. Dapat berupa object atau JSON string format (stringified)
 * @param {string} algorithm Algoritma HMAC (case insensitive) yang tersedia pada library `crypto-js`. Contoh 'SHA256', 'sha512', etc. Default: `MD5`
 * @param {boolean} etagFormat Boolean untuk menggunakan format Etag ("..."). Default: `true`
 * @returns {Promise<string>} Etag atau Hash Identifier dengan encoder `Hex`
 * @throws Throw error (return null) saat `!data`
 */
export async function getEtag(data, algorithm = 'MD5', etagFormat = true) {
    try {
        if (!data) { throw new Error('Error generating Etag: No data provided') }
        const hmacFunction = CryptoJS[`Hmac${algorithm.toUpperCase()}`] || CryptoJS.HmacMD5;
        const dataString = typeof data === 'string' ? data : JSON.stringify(data);
        const hash = hmacFunction(dataString, process.env.SECRET_KEY);
        const hexHash = hash.toString(CryptoJS.enc.Hex);
        const etag = etagFormat ? `"${hexHash}"` : `${hexHash}`;
        return etag;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// #endregion

// #region Options, Cookies, Headers

/**
 * Method untuk mendapatkan cookies options dengan preset berdasarkan param `type` dan `action`.
 * 
 * - Jika type `'auth'` maka secure dan httpOnly bernilai `true`, sedangkan jika `'service'` maka secure dan httpOnly bernlai `false`
 * - Jika action `'set'` maka maxAge bernilai `positif`, sedangkan jika `'remove'` maka maxAge bernilai `negatif`
 * 
 * Tips penggunaan method : 
 * - Gunakan type `'auth'` saat cookie hanya ingin diakses melalui http dan secure
 * - Gunakan action `'set'` saat ingin set cookie, sedangkan `'remove'` saat ingin remove cookie
 * 
 * Jika ingin custom, gunakan param `custom` untuk mengubah value dari `secure`, `httpOnly`, `maxAge` dan `sameSite`
 * @param {'auth'|'service'} type Type preset
 * @param {'set'|'remove'} action Action preset
 * @param {{secure?:boolean, httpOnly?:boolean, maxAge?:number, sameSite?:string}} [custom] Cookie options custom value
 * @returns {Promise<{secure:boolean, httpOnly:boolean, maxAge:2592000|-2592000, sameSite:'lax'}>} Promise dengan resolve object sebagai cookie options
 */
export async function getCookieOptions(type, action, custom = {}) {
    return {
        secure: type === 'service' ? false : true,
        httpOnly: type === 'service' ? false : true,
        maxAge: action === 'remove' ? -2592000 : 2592000,
        sameSite: 'lax',
        ...custom
    }
}

/**
 * Method untuk mendapatkan cookies yang digunakan pada sipk. Jika `request` dipass, cookie diresolve menggunakan `request.cookies`,
 * jika tidak maka cookie diresolve menggunakan cookies store `cookies()` yang ada pada `next/headers`.
 * @param {NextRequest} [request]
 * @returns {Promise<CookiesTypes.AllCookies>} Promise dengan resolve object yang berisikan cookies yang digunakan pada sipk. Jika cookie tidak tersedia, value bernilai `undefined`
 */
export async function getSipkCookies(request = null) {
    const cookiesStore = cookies();
    if (request) {
        var { cookies: cookiesRequest } = request;
    }

    /** @type {CookiesTypes.AllCookies} */
    const allCookies = {
        serviceGuestCookie: request ? cookiesRequest.get('s_guest_id')?.value : cookiesStore.get('s_guest_id')?.value,
        serviceUserIdCookie: request ? cookiesRequest.get('s_user_id')?.value : cookiesStore.get('s_user_id')?.value,
        serviceAccessTokenCookie: request ? cookiesRequest.get('s_access_token')?.value : cookiesStore.get('s_access_token')?.value,
        secureSessionCookie: request ? cookiesRequest.get(process.env.USER_SESSION_COOKIES_NAME)?.value : cookiesStore.get(process.env.USER_SESSION_COOKIES_NAME)?.value,
    };

    return allCookies;
}

/**
 * Method untuk mencoba mendapatkan ip dari beberapa header berikut,
 * - `'X-Client-IP'`
 * - `'X-Forwarded-For'`
 * - `'X-Real-IP'`
 * @returns {Promise<string>} Promise dengan resolve string ip jika tersedia, `null` jika tidak tersedia
 */
export async function getIpFromHeaders() {
    const ip = headers().get('X-Client-IP') ?? headers().get('X-Forwarded-For') ?? headers().get('X-Real-IP');

    return ip;
}

/**
 * Method untuk mencoba mendapatkan api key dari query param `'apiKey'` atau header `'X-Api-Key'` 
 * @param {NextRequest} request 
 * @returns {Promise<string>} Promise dengan resolve string api key jika tersedia, `null` jika tidak tersedia
 */
export async function getApiKey(request) {
    const apiKey = headers().get('X-Api-Key') ?? request.nextUrl.searchParams.get('apiKey');

    return apiKey;
}

/**
 * Method untuk mendapatkan request detail berupa `ip`, semua `cookies` dan `headers` yang digunakan.
 * 
 * Saat `filterSensitiveCookies` maka cookie berikut akan difilter :
 * - `_Secure-auth.session-token` : User session
 * - `s_access_token` : User access token
 * 
 * Saat `filterSensitiveHeaders` maka header berikut akan difilter :
 * - `Authorization` : Request authorization
 * - `X-Api-Key` : Request apiKey
 * - `Cookie` : Request cookie
 * @param {boolean} [filterSensitiveCookies] Filter cookies sensitive, default `true`
 * @param {boolean} [filterSensitiveHeaders] Filter headers sensitive, default `true` 
 */
export async function getRequestDetails(filterSensitiveCookies = true, filterSensitiveHeaders = true) {
    const ip = await getIpFromHeaders();
    const allCookies = cookies().getAll();
    const filteredCookies =
        filterSensitiveCookies
            ? allCookies.filter(cookie => !['_secure-auth.session-token', 's_access_token'].includes(cookie.name.toLowerCase()))
            : allCookies;

    const allHeaders = {};
    headers().forEach((value, key) => {
        allHeaders[key] = value;
    });

    const filteredHeaders = filterSensitiveHeaders
        ? Object.fromEntries(
            Object.entries(allHeaders).filter(([key]) => !['authorization', 'x-api-key', 'cookie'].includes(key.toLowerCase()))
        )
        : allHeaders;

    return { ip, cookies: filteredCookies, headers: filteredHeaders }
}

/**
 * Method untuk reset cookies yang digunakan pada sipk
 * @param {Array<CookiesTypes.AllCookiesName>} [cookiesName] Array yang berisikan nama cookie yang ingin direset, default `['secureSessionCookie', 'serviceUserIdCookie', 'serviceAccessTokenCookie']`
 * @returns {Promise<void>} Promise dengan resolve void
 */
export async function resetSipkCookies(cookiesName = ['secureSessionCookie', 'serviceUserIdCookie', 'serviceAccessTokenCookie']) {
    const cookieStore = cookies();
    const cookieAuthDeleteOptions = await getCookieOptions('auth', 'remove');
    const cookieServiceDeleteOptions = await getCookieOptions('service', 'remove');
    if (cookiesName.includes('secureSessionCookie')) cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: '', ...cookieAuthDeleteOptions });
    if (cookiesName.includes('serviceUserIdCookie')) cookieStore.set({ name: 's_user_id', value: '', ...cookieServiceDeleteOptions });
    if (cookiesName.includes('serviceAccessTokenCookie')) cookieStore.set({ name: 's_access_token', value: '', ...cookieServiceDeleteOptions });
    if (cookiesName.includes('serviceGuestCookie')) cookieStore.set({ name: 's_guest_id', value: '', ...cookieServiceDeleteOptions });
}

// #endregion