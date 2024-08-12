'use server'

// #region TYPE DEPEDENCY
import * as CookiesTypes from '@/types/cookies';
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region NEXT DEPEDENCY
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
// #endregion

// #region UTIL DEPEDENCY
import CryptoJS from 'crypto-js';
import { LRUCache } from 'lru-cache';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import isJWT from 'validator/lib/isJWT';
import isUUID from 'validator/lib/isUUID';
import isNumeric from 'validator/lib/isNumeric';
// #endregion

// #region Security, Encryptor, Decryptor

/**
 * Method async untuk enkripsi teks atau data dengan algoritma AES
 * @param {string} message Teks atau data yang ingin diencrypt (ex: `'encryptAku'`)
 * @return {Promise<string|number>} Resolve dengan string yang sudah terenkripsi (ex: `'U2s5AsDs12uX...'`), Reject dengan `0`
 */
export async function encryptAES(message) {
    try {
        const ciphertext = CryptoJS.AES.encrypt(message, process.env.SECRET_KEY).toString();
        return ciphertext;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

/**
 * Method async untuk dekripsi teks atau data yang menggunakan algoritma AES
 * @param {string} ciphertext Teks atau string yang terenkripsi (ex: `'U2s5AsDs12uX...'`)
 * @param {boolean} [parse=false]  Opsi boolean untuk parse(`JSON.parse`) hasil dekripsi
 * @return {Promise<string|object|number>} Resolve dengan string atau object yang sudah terdekripsi (ex: `'decrypted'`, `{data: 'decrypted'}`), Reject dengan `0`
 */
export async function decryptAES(ciphertext, parse = false) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        if (parse) { return JSON.parse(decryptedData) }
        else { return decryptedData; }
    } catch (error) {
        console.error(error);
        return 0;
    }
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
    });

    const check = async (limit, token) => {
        const tokenCount = tokenCache.get(token) || [0];

        if (tokenCount[0] === 0) {
            tokenCache.set(token, tokenCount);
        }

        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        return isRateLimited ? Promise.reject() : currentUsage;
    };

    return {
        check,
    };
}

// #endregion

// #region Validator, Input Validator, Sanitizer

/**
 * Method untuk validasi token JWT supabase
 * @param {string} token Token JWT valid (`algorithms=[...env]`, `audience='authenticated'`, `issuer=[...env]`, `subject=userId`)
 * @param {string} userId User UUID untuk validasi JWT subject.
 * @returns {object} JWT payload data
 * @throws Throw error saat token invalid (bukan expired) atau `type(token) !== JWT` atau `type(userId) !== uuid` 
 */
export async function validateJWT(token, userId) {
    if (!isUUID(userId) || !userId) { throw new Error(`Unauthorized - Invalid or empty user id`) }
    if (!isJWT(token) || !token) { throw new Error(`Unauthorized - Invalid or empty access token`) }
    try {
        const decoded = jwt.verify(
            token, process.env.JWT_SECRET_KEY,
            {
                algorithms: process.env.JWT_ALGORITHM.split(','),
                audience: 'authenticated',
                issuer: process.env.JWT_ISSUER.split(','),
                ignoreExpiration: true,
                subject: userId
            }
        )

        return decoded;
    } catch (error) {
        const { name, message } = error;
        console.error(name && message ? `${name} - ${message}` : 'Error when validating JWT')
        throw new Error(`Unauthorized - Invalid access token`);
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
export async function getSipkCookies(request) {
    return new Promise((resolve) => {
        /** @type {CookiesTypes.AllCookies} */
        const cookies = {
            serviceGuestCookie: request.cookies.get('s_guest_id')?.value,
            serviceUserIdCookie: request.cookies.get('s_user_id')?.value,
            serviceAccessTokenCookie: request.cookies.get('s_access_token')?.value,
            secureSessionCookie: request.cookies.get(process.env.USER_SESSION_COOKIES_NAME)?.value,
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

// #endregion