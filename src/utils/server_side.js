// ========== COMPONENT DEPEDENCY ========== //
import CryptoJS from 'crypto-js';
import { LRUCache } from 'lru-cache';
import jwt from 'jsonwebtoken';
import isJWT from 'validator/lib/isJWT';
import isUUID from 'validator/lib/isUUID';

/*
============================== CODE START HERE ==============================
*/

// Security
// Encryptor & Decryptor
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

/**
 * Method sync untuk enkripsi teks atau data dengan algoritma AES
 * @param {string} message Teks atau data yang ingin diencrypt (ex: `'encryptAku'`)
 * @return {string|number} Berhasil akan return string yang sudah terenkripsi (ex: `'U2s5AsDs12uX...'`), Gagal akan return `0`
 */
export function encryptSyncAES(message) {
    try {
        const ciphertext = CryptoJS.AES.encrypt(message, process.env.SECRET_KEY).toString();
        return ciphertext;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

/**
 * Method sync untuk dekripsi teks atau data yang menggunakan algoritma AES
 * @param {string} ciphertext Teks atau data yang terenkripsi (ex: `'U2s5AsDs12uX...'`)
 * @param {boolean} [parse=false] Opsi boolean untuk parse(`JSON.parse`) hasil dekripsi
 * @return {string|object|number} Berhasil akan return string atau object yang sudah terdekripsi (ex: `'decrypted'`, `{data: 'decrypted'}`), Gagal akan return `0`
 */
export function decryptSyncAES(ciphertext, parse = false) {
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

// Ratelimit
/**
 * Membuat rate limiter yang dapat mengecek rate limit dari token
 * @param {object} options - Opsi untuk rate limit.
 * @param {number} [options.uniqueTokenPerInterval=500] - Angka maksimal untuk setiap token unik yang dapat diterima dalam suatu interval.
 * @param {number} [options.interval=60000] - Interval waktu dalam millisekon untuk rate limit.
 * @returns {object} Ratelimiter dengan method `check`.
 */
export function rateLimit(options) {
    const tokenCache = new LRUCache({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000,
    });

    /**
     * Method untuk mengecek rate limit dari sebuah token
     * @param {number} limit Limit maksimum jumlah penggunaan.
     * @param {string} token Token untuk mengecek ratelimit.
     * @returns {Promise<number>} Resolve dengan jumlah penggunaan, Reject saat penggunaan sudah lebih dari limit.
     */
    const check = (limit, token) =>
        new Promise((resolve, reject) => {
            const tokenCount = tokenCache.get(token) || [0];
            if (tokenCount[0] === 0) {
                tokenCache.set(token, tokenCount);
            }
            tokenCount[0] += 1;

            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage >= limit;

            return isRateLimited ?
                reject() :
                resolve(currentUsage);
        });

    return {
        check,
    };
}

// Validator, Input Validator, Sanitizer.
/**
 * Method untuk validasi token JWT supabase
 * @param {string} token Token JWT valid (`algorithms=[...env]`, `audience='authenticated'`, `issuer=[...env]`, `subject=userId`)
 * @param {string} userId User UUID untuk validasi JWT subject.
 * @returns {object} JWT payload data
 * @throws Throw error saat token invalid (bukan expired) atau `type(token) !== JWT` atau `type(userId) !== uuid` 
 */
export function validateJWT(token, userId) {
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

// Options
/**
 * Options untuk set auth cookie. 
 * 
 * `secure = true`, `httpOnly = true`, `maxAge = 2592000`, `sameSite = 'lax'`
 */
export const cookieAuthOptions = { secure: true, httpOnly: true, maxAge: 2592000, sameSite: 'lax' };

/**
 * Options untuk remove/revoke auth cookie. 
 * 
 * `secure = true`, `httpOnly = true`, `maxAge = -2592000`, `sameSite = 'lax'`
 */
export const cookieAuthDeleteOptions = { secure: true, httpOnly: true, maxAge: -2592000, sameSite: 'lax' };

/**
 * Options untuk set service cookie. 
 * 
 * `secure = false`, `httpOnly = false`, `maxAge = 2592000`, `sameSite = 'lax'`
 */
export const cookieServiceOptions = { secure: false, httpOnly: false, maxAge: 2592000, sameSite: 'lax' };