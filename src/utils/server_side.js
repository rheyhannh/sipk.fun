// ========== COMPONENT DEPEDENCY ========== //
import CryptoJS from 'crypto-js';
import { LRUCache } from 'lru-cache';

/*
============================== CODE START HERE ==============================
*/

// Security
// Encryptor & Decryptor
export async function encryptAES(message) {
    try {
        const ciphertext = CryptoJS.AES.encrypt(message, process.env.SECRET_KEY).toString();
        return ciphertext;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

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

export function encryptSyncAES(message) {
    try {
        const ciphertext = CryptoJS.AES.encrypt(message, process.env.SECRET_KEY).toString();
        return ciphertext;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

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
export function rateLimit(options) {
    const tokenCache = new LRUCache({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000,
    });

    return {
        check: (limit, token) =>
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
            }),
    };
}

// Validator & Sanitizer