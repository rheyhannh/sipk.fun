// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region NEXT DEPEDENCY
import { NextResponse, NextRequest } from 'next/server';
import { cookies, headers } from 'next/headers';
// #endregion

// #region SUPABASE DEPEDENCY
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
// #endregion

// #region UTIL DEPEDENCY
import {
    encryptAES,
    decryptAES,
    rateLimit,
    validateJWT,
    getCookieOptions,
    getSipkCookies,
    getApiKey,
} from '@/utils/server_side';
import isUUID from 'validator/lib/isUUID';
// #endregion

const limitRequest = parseInt(process.env.API_MATKULHISTORY_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_MATKULHISTORY_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_MATKULHISTORY_MAX_TOKEN_PERINTERVAL),
})

const cookieAuthOptions = await getCookieOptions('auth', 'set');
const cookieAuthDeleteOptions = await getCookieOptions('auth', 'remove');

/**
 * Route Handler untuk `GET` `'/api/matkul-history'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const userAccessToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    const cookieStore = cookies();
    const apiKeyHeader = headers().get('X-API-KEY');

    if (apiKeyHeader) {
        if (apiKeyHeader !== process.env.SUPABASE_SERVICE_KEY) {
            return NextResponse.json({ message: `Invalid API key` }, {
                status: 401,
            })
        }
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
        const { data, error } = await supabase.from('matkul_history').select('*');
        if (error) {
            console.error(error);
            return NextResponse.json({ message: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 200 })
    }

    if (!userAccessToken || !authorizationHeader || !authorizationToken) {
        return NextResponse.json({ message: 'Unauthorized - Missing access token' }, {
            status: 401,
        })
    }

    const decryptedSession = await decryptAES(userAccessToken, true);
    const userId = decryptedSession?.user?.id;

    if (!decryptedSession || !userId) {
        cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: '', ...cookieAuthDeleteOptions })
        cookieStore.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions })
        cookieStore.set({ name: 's_access_token', value: '', ...cookieAuthDeleteOptions })
        return NextResponse.json({ message: 'Unauthorized - Invalid access token' }, {
            status: 401
        })
    }

    try {
        var decoded = await validateJWT(authorizationToken, userId);
        // Log Here, ex: '{TIMESTAMP} decoded.id {METHOD} {ROUTE} {BODY} {PARAMS}'
    } catch (error) {
        return NextResponse.json({ message: error.message || 'Unauthorized - Invalid access token' }, {
            status: 401
        })
    }

    try {
        var currentUsage = await limiter.check(limitRequest, `matkul-history-${userId}`);
        // Log Here, ex: '{TIMESTAMP} userId {ROUTE} limit {currentUsage}/{limitRequest}'
    } catch {
        // Log Here, ex: '{TIMESTAMP} userId {ROUTE} limited'
        return NextResponse.json({ message: 'Too many request' }, {
            status: 429,
            headers: {
                'X-Ratelimit-Limit': limitRequest,
                'X-Ratelimit-Remaining': 0,
            }
        })
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

    let { data, error } = await supabase.from('matkul_history').select('*').order('last_change_at', { ascending: true });

    if (error) {
        console.error(error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, {
            status: 500,
            headers: {
                'X-Ratelimit-Limit': limitRequest,
                'X-Ratelimit-Remaining': limitRequest - currentUsage,
            }
        })
    }

    return NextResponse.json(data, {
        status: 200,
        headers: {
            'X-Ratelimit-Limit': limitRequest,
            'X-Ratelimit-Remaining': limitRequest - currentUsage,
        }
    });
}

/**
 * Route Handler untuk `DELETE` `'/api/matkul-history'`
 * @param {NextRequest} request
 */
export async function DELETE(request) {
    const newHeaders = {};
    const userAccessToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    const cookieStore = cookies();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const matkulId = searchParams.get('mid');

    if (!userAccessToken || !authorizationHeader || !authorizationToken) {
        return NextResponse.json({ message: 'Unauthorized - Missing access token' }, {
            status: 401,
        })
    }

    const decryptedSession = await decryptAES(userAccessToken, true);
    const userId = decryptedSession?.user?.id;

    try {
        var decoded = await validateJWT(authorizationToken, userId);
        // Log Here, ex: '{TIMESTAMP} decoded.id {METHOD} {ROUTE} {BODY} {PARAMS}'
    } catch (error) {
        return NextResponse.json({ message: error.message || 'Unauthorized - Invalid access token' }, {
            status: 401
        })
    }

    try {
        var currentUsage = await limiter.check(limitRequest, `matkul-${userId}`);
        // Log Here, ex: '{TIMESTAMP} userId {ROUTE} limit {currentUsage}/{limitRequest}'
        newHeaders['X-Ratelimit-limit'] = limitRequest;
        newHeaders['X-Ratelimit-Remaining'] = limitRequest - currentUsage;
    } catch {
        // Log Here, ex: '{TIMESTAMP} userId {ROUTE} limited'
        return NextResponse.json({ message: `Terlalu banyak request, coba lagi dalam 1 menit` }, {
            status: 429,
            headers: {
                'X-Ratelimit-Limit': limitRequest,
                'X-Ratelimit-Remaining': 0,
            }
        })
    }

    if (!id || !matkulId) {
        return NextResponse.json({ message: `Gagal menghapus matakuliah, 'id' dan 'mid' dibutuhkan` }, {
            status: 400,
            headers: newHeaders
        })
    }

    if (!isUUID(id) || !isUUID(matkulId)) {
        return NextResponse.json({ message: `Gagal menghapus matakuliah, 'id' atau 'mid' bukan uuid` }, {
            status: 400,
            headers: newHeaders
        })
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

    var { error } = await supabase.from('matkul').delete().eq('id', matkulId);
    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Gagal menghapus matakuliah` }, { status: 500, headers: newHeaders })
    }

    var { error } = await supabase.from('matkul_history').delete().eq('id', id);
    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Gagal menghapus matakuliah` }, { status: 500, headers: newHeaders })
    }

    return new Response(null, {
        status: 204,
        headers: newHeaders
    })
}