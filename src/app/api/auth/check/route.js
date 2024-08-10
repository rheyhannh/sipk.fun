// #region TYPE DEPEDENCY
import * as SIPK from '@/types/supabase';
// #endregion

// ========== NEXT DEPEDENCY ========== //
import { NextResponse, NextRequest } from 'next/server';
import { cookies, headers } from 'next/headers';

// ========== SUPABASE DEPEDENCY ========== //
import { createServerClient } from '@supabase/ssr';

// ========== UTIL DEPEDENCY ========== //
import {
    encryptAES,
    decryptAES,
    rateLimit,
    getCookieOptions
} from '@/utils/server_side';

const limitRequest = parseInt(process.env.API_AUTHCHECK_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_AUTHCHECK_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_AUTHCHECK_MAX_TOKEN_PERINTERVAL),
})

const cookieAuthOptions = await getCookieOptions('auth', 'set');
const cookieAuthDeleteOptions = await getCookieOptions('auth', 'remove');
const cookieServiceOptions = await getCookieOptions('service', 'set');

/*
============================== CODE START HERE ==============================
*/

/**
 * Route Handler untuk `GET` `'/api/auth/check'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const newHeaders = {};
    const serviceGuestCookie = request.cookies.get('s_guest_id')?.value;
    const accessTokenCookie = request.cookies.get('s_access_token')?.value;
    const userIdCookie = request.cookies.get('s_user_id')?.value;
    const secureCookie = request.cookies.get(process.env.USER_SESSION_COOKIES_NAME)?.value;

    // guestKey (IP or guest_Id) to create key for rate limiter
    const guestKey =
        headers().get('X-Client-IP') ||
        headers().get('X-Forwarded-For') ||
        headers().get('X-Real-IP') ||
        serviceGuestCookie ||
        'public'
        ;

    // Try checking rate limit
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

    if (!secureCookie) {
        return NextResponse.json({ message: 'Unauthorized - Missing access token' }, {
            status: 401,
            headers: newHeaders
        })
    }

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
                        if (!secureCookie || secureCookie !== encryptedSession) { cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: encryptedSession, ...cookieAuthOptions }) }
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

    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error(error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, {
            status: 500,
            headers: newHeaders
        })
    }

    if (data.session) {
        if (!userIdCookie || userIdCookie !== data.session.user.id) { cookieStore.set({ name: 's_user_id', value: data.session.user.id, ...cookieServiceOptions }) }
        if (!accessTokenCookie || accessTokenCookie !== data.session.access_token) { cookieStore.set({ name: 's_access_token', value: data.session.access_token, ...cookieServiceOptions }) }
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
}

/*
============================== CODE END HERE ==============================
*/