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
    return new Promise((resolve) => {
        try {
            const ciphertext = CryptoJS.AES.encrypt(message, process.env.SECRET_KEY).toString();
            resolve(ciphertext);
        } catch (error) {
            console.error(error);
            resolve(null);
        }
    })
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
    return new Promise((resolve) => {
        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            if (parse) {
                resolve(JSON.parse(decryptedData));
            } else {
                resolve(decryptedData);
            }
        } catch (error) {
            console.error(error);
            resolve(null);
        }
    });
}

// #endregion

// #region Ratelimit

/**
 * @typedef {Object} rateLimitInstance
 * @property {(limit:number, token:string) => Promise<number>} check
 * Method untuk mengecek rate limit dari sebuah token dengan parameter berikut,
 * - `limit` : Limit maksimum jumlah penggunaan
 * - `token` : Token untuk mengecek ratelimit
 * 
 * `Resolve` dengan jumlah penggunaan, `Reject` saat penggunaan sudah lebih dari limit
 */

/**
 * Membuat rate limiter yang dapat mengecek rate limit dari token
 * @param {object} options - Opsi untuk rate limit
 * @param {number} [options.uniqueTokenPerInterval=500] - Angka maksimal untuk setiap token unik yang dapat diterima dalam suatu interval, default : `500`
 * @param {number} [options.interval=60000] - Interval waktu dalam millisekon untuk rate limit, default : `60000`
 * @returns {rateLimitInstance} Instance ratelimit beserta object dengan method `check` untuk mengecek rate limit dari sebuah token
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
                    undefined, undefined, {
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
            undefined, undefined,
            {
                headers: {
                    'Retry-After': currentTtl,
                    'X-Ratelimit-Limit': limit,
                    'X-Ratelimit-Remaining': 0,
                    'X-Ratelimit-Retry-After': currentTtl,
                }
            }
        )) : currentUsage;
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
 * @throws
 * - Token invalid atau tidak memenuhi semua kriteria diatas
 * - Tipe `token` bukan `JWT`
 * - Tipe `userId` bukan `UUID`
 */
export async function validateJWT(token, userId, ignoreExpiration = true, otherOptions = {}) {
    return new Promise((resolve, reject) => {
        if (!userId || typeof userId !== 'string' || !isUUID(userId)) {
            return reject(authError.invalid_access_token(null, null, {
                reason: 'User id should exist and UUID typed'
            }));
        }
        if (!token || typeof token !== 'string' || !isJWT(token)) {
            return reject(authError.invalid_access_token(null, null, {
                reason: 'Access token should exist and JWT typed'
            }));
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY,
                {
                    algorithms: process.env.JWT_ALGORITHM.split(','),
                    audience: 'authenticated',
                    issuer: process.env.JWT_ISSUER.split(','),
                    ignoreExpiration,
                    subject: userId,
                    ...otherOptions
                }
            );

            resolve(decoded);
        } catch (error) {
            console.error(error);
            reject(authError.invalid_access_token());
        }
    });
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
        console.error(`Error generating ETag: ${error.message}`);
        return null;
    }
}

// #endregion

// #region Options, Cookies, Headers

/**
 * Method untuk mendapatkan cookies options.
 * @param {'auth'|'service'} type Jika `'auth'` maka secure dan httpOnly bernilai `true`, jika `'service'` maka secure dan httpOnly bernilai `false`.
 * @param {'set'|'remove'} action Jika `'set'` maka maxAge bernilai positif, jika `'remove'` maka maxAge bernilai negatif.
 * @param {{}} custom Object props cookies options yang ingin ditambah atau diubah.
 * @returns {{secure:boolean, httpOnly:boolean, maxAge:2592000|-2592000, sameSite:'lax', custom?:{}}} Object dengan props cookies options sesuai dengan parameter yang digunakan.
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
 * Method untuk mendapatkan cookies yang digunakan pada sipk
 * @param {NextRequest} request 
 * @returns {Promise<CookiesTypes.AllCookies>} Promise dengan resolve object yang berisikan cookies yang digunakan pada sipk. Jika cookie tidak tersedia, value bernilai `null`
 */
export async function getSipkCookies(request = null) {
    const cookiesStore = cookies();
    if (request) {
        var { cookies: cookiesRequest } = request;
    }

    return new Promise((resolve) => {
        /** @type {CookiesTypes.AllCookies} */
        const cookies = {
            serviceGuestCookie: request ? cookiesRequest.get('s_guest_id')?.value : cookiesStore.get('s_guest_id')?.value,
            serviceUserIdCookie: request ? cookiesRequest.get('s_user_id')?.value : cookiesStore.get('s_user_id')?.value,
            serviceAccessTokenCookie: request ? cookiesRequest.get('s_access_token')?.value : cookiesStore.get('s_access_token')?.value,
            secureSessionCookie: request ? cookiesRequest.get(process.env.USER_SESSION_COOKIES_NAME)?.value : cookiesStore.get(process.env.USER_SESSION_COOKIES_NAME)?.value,
        };

        resolve(cookies);
    });
}

/**
 * Method untuk mencoba mendapatkan ip dari beberapa header berikut,
 * - `'X-Client-IP'`
 * - `'X-Forwarded-For'`
 * - `'X-Real-IP'`
 * @returns {Promise<string>} Promise dengan resolve string ip jika tersedia, `null` jika tidak tersedia
 */
export async function getIpFromHeaders() {
    return new Promise((resolve) => {
        const ip = headers().get('X-Client-IP') ?? headers().get('X-Forwarded-For') ?? headers().get('X-Real-IP');
        resolve(ip);
    });
}

/**
 * Method untuk mencoba mendapatkan api key dari query param `'apiKey'` atau header `'X-Api-Key'` 
 * @param {NextRequest} request 
 * @returns {Promise<string>} Promise dengan resolve string api key jika tersedia, `null` jika tidak tersedia
 */
export async function getApiKey(request) {
    return new Promise((resolve) => {
        const apiKey = headers().get('X-Api-Key') ?? request.nextUrl.searchParams.get('apiKey');
        resolve(apiKey);
    });
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