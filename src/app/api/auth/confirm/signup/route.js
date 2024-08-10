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

const limitRequest = parseInt(process.env.API_AUTH_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_AUTH_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_AUTH_MAX_TOKEN_PERINTERVAL),
})

const cookieAuthOptions = await getCookieOptions('auth', 'set');
const cookieAuthDeleteOptions = await getCookieOptions('auth', 'remove');
const cookieServiceOptions = await getCookieOptions('service', 'set');

/*
============================== CODE START HERE ==============================
*/

/**
 * Route Handler untuk `GET` `'/api/auth/confirm/signup'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const newHeaders = {};
    const serviceGuestCookie = request.cookies.get('s_guest_id')?.value;

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

    const searchParams = request.nextUrl.searchParams;
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (!token_hash || !type || type !== 'email') {
        return NextResponse.json({ message: 'Forbidden' }, {
            status: 403,
            headers: newHeaders
        })
    }

    const cookieStore = cookies();
    const dashboardUrl = new URL("/dashboard", request.url);

    if (cookieStore.has(process.env.USER_SESSION_COOKIES_NAME)) {
        return NextResponse.redirect(dashboardUrl);
    }

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
                        cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: encryptedSession, ...cookieAuthOptions })
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

    var { data, error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
    })

    if (error) {
        console.error(error);
        return NextResponse.json({ message: 'Forbidden' }, {
            status: 403,
            headers: newHeaders
        })
    }

    if (data?.session) {
        cookieStore.set({ name: 's_user_id', value: data.session.user.id, ...cookieServiceOptions });
        cookieStore.set({ name: 's_access_token', value: data.session.access_token, ...cookieServiceOptions });

        var { error } = await supabase.from('user').update(
            {
                is_email_confirmed: true,
                email_confirmed_at: new Date(),
            }
        ).eq('id', data.session.user.id);

        if (error) {
            console.error(`Gagal update column setelah konfirmasi email. [uid: ${data.session.user.id || 'Unknown'}]`)
        }
    }

    return new Response(null, {
        status: 204,
        headers: newHeaders
    })
}

/*
============================== CODE END HERE ==============================
*/