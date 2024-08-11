// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region NEXT DEPEDENCY
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
// #endregion

// #region SUPABASE DEPEDENCY
import { createServerClient } from '@supabase/ssr';
// #endregion

// #region UTIL DEPEDENCY
import {
    encryptAES,
    decryptAES,
    rateLimit,
    getCookieOptions,
    getSipkCookies,
    getIpFromHeaders,
} from '@/utils/server_side';
// #endregion

const limitRequest = parseInt(process.env.API_AUTHCHECK_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_AUTHCHECK_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_AUTHCHECK_MAX_TOKEN_PERINTERVAL),
})

const cookieAuthOptions = await getCookieOptions('auth', 'set');
const cookieAuthDeleteOptions = await getCookieOptions('auth', 'remove');
const cookieServiceOptions = await getCookieOptions('service', 'set');

/**
 * Route Handler untuk `GET` `'/api/auth/check'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const newHeaders = {};
    const {
        serviceGuestCookie,
        serviceUserIdCookie,
        serviceAccessTokenCookie,
        secureSessionCookie
    } = await getSipkCookies(request);

    // Identifier for Ratelimiting
    const guestKey = await getIpFromHeaders() ?? serviceGuestCookie ?? 'public';

    // #region Checking Ratelimit
    try {
        var currentUsage = await limiter.check(limitRequest, guestKey);
        // Log Here, ex: '{TIMESTAMP} userId {ROUTE} limit {currentUsage}/{limitRequest}'
        newHeaders['X-Ratelimit-limit'] = limitRequest;
        newHeaders['X-Ratelimit-Remaining'] = limitRequest - currentUsage;
    } catch {
        // Log Here, ex: '{TIMESTAMP} userId {ROUTE} limited'
        return NextResponse.json({ message: `Terlalu banyak request` }, {
            status: 429,
            headers: {
                'X-Ratelimit-Limit': limitRequest,
                'X-Ratelimit-Remaining': 0,
            }
        })
    }

    if (!secureSessionCookie) {
        return NextResponse.json({ message: 'Unauthorized - Missing access token' }, {
            status: 401,
            headers: newHeaders
        })
    }
    // #endregion

    // #region Initiate Supabase Instance
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
            cookies: {
                async get(name) {
                    const encryptedSession = cookieStore.get(process.env.USER_SESSION_COOKIES_NAME)?.value
                    if (encryptedSession) {
                        const decryptedSession = await decryptAES(encryptedSession) || 'removeMe';
                        return decryptedSession;
                    }
                    return encryptedSession;
                },
                async set(name, value, options) {
                    const encryptedSession = await encryptAES(value);
                    if (encryptedSession) {
                        if (!secureSessionCookie || secureSessionCookie !== encryptedSession) { cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: encryptedSession, ...cookieAuthOptions }) }
                    } else {
                        cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value, ...cookieAuthOptions })
                    }
                },
                remove(name, options) {
                    cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: '', ...cookieAuthDeleteOptions })
                    cookieStore.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions })
                    cookieStore.set({ name: 's_access_token', value: '', ...cookieAuthDeleteOptions })
                },
            },
        }
    )
    // #endregion

    // #region Handle Response
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error(error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, {
            status: 500,
            headers: newHeaders
        })
    }

    if (data.session) {
        if (!serviceUserIdCookie || serviceUserIdCookie !== data.session.user.id) { cookieStore.set({ name: 's_user_id', value: data.session.user.id, ...cookieServiceOptions }) }
        if (!serviceAccessTokenCookie || serviceAccessTokenCookie !== data.session.access_token) { cookieStore.set({ name: 's_access_token', value: data.session.access_token, ...cookieServiceOptions }) }
        return new Response(null, {
            status: 204,
            headers: newHeaders
        })
    } else {
        return NextResponse.json({ message: 'Unauthorized - Invalid access token' }, {
            status: 401,
            headers: newHeaders
        })
    }
    // #endregion
}