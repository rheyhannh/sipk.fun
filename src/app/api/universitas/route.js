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
    getIpFromHeaders,
} from '@/utils/server_side';
import isUUID from 'validator/lib/isUUID';
import isNumeric from 'validator/lib/isNumeric';
import isInt from 'validator/lib/isint';
// #endregion

const limitRequest = parseInt(process.env.API_UNIVERSITAS_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_UNIVERSITAS_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_UNIVERSITAS_MAX_TOKEN_PERINTERVAL),
})

const cookieAuthOptions = await getCookieOptions('auth', 'set');
const cookieAuthDeleteOptions = await getCookieOptions('auth', 'remove');
const cookieServiceOptions = await getCookieOptions('service', 'set');

/**
 * Route Handler untuk `GET` `'/api/universitas'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const cookieStore = cookies();
    const newHeaders = {};
    const { secureSessionCookie } = await getSipkCookies(request);
    var { serviceGuestCookie, serviceUserIdCookie } = await getSipkCookies(request);
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    const serviceApiKey = await getApiKey(request);

    // #region Handler when serviceApiKey exist
    if (serviceApiKey) {
        if (serviceApiKey !== process.env.SUPABASE_SERVICE_KEY) {
            return NextResponse.json({ message: `Invalid API key` }, {
                status: 401,
            })
        }
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
        const { data, error } = await supabase.from('universitas').select('*').order('id', { ascending: true });
        if (error) {
            console.error(error);
            return NextResponse.json({ message: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 200 })
    }
    // #endregion

    // #region Verifying serviceGuestCookie and serviceUserIdCookie
    if (serviceGuestCookie) {
        if (!isUUID(serviceGuestCookie)) {
            const newId = crypto.randomUUID();
            cookieStore.set({ name: 's_guest_id', value: newId, ...cookieServiceOptions });
            serviceGuestCookie = 'public';
        }
    }

    if (serviceUserIdCookie) {
        if (!isUUID(serviceUserIdCookie)) {
            cookieStore.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions });
            serviceUserIdCookie = 'public';
        }
    }
    // #endregion

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
    // #endregion

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    // #region Validating 'type' Query Params
    if (!type) { return NextResponse.json({ message: 'Bad Request - Missing type params' }, { status: 400, headers: newHeaders }) }
    if (type !== 'public' && type !== 'user') { return NextResponse.json({ message: 'Bad Request - Invalid type' }, { status: 400, headers: newHeaders }) }
    
    if (type === 'user') {
        if (!id) { return NextResponse.json({ message: 'Bad Request - Missing id params' }, { status: 400, headers: newHeaders }) }
        if (!isNumeric(id) || !isInt(id, { min: 1, max: parseInt(process.env.DATA_UNIVERSITAS_LENGTH) })) {
            return NextResponse.json({ message: 'Bad Request - Invalid id' }, { status: 400, headers: newHeaders })
        }

        // #region Handler Unauthenticated User
        if (!secureSessionCookie || !authorizationHeader || !authorizationToken) {
            return NextResponse.json({ message: 'Unauthorized - Missing access token' }, {
                status: 401,
                headers: newHeaders
            })
        }
        // #endregion

        /** @type {SupabaseTypes.Session} */
        const decryptedSession = await decryptAES(secureSessionCookie, true);
        const userId = decryptedSession?.user?.id;

        if (!decryptedSession || !userId) {
            cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: '', ...cookieAuthDeleteOptions })
            cookieStore.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions })
            cookieStore.set({ name: 's_access_token', value: '', ...cookieAuthDeleteOptions })
            return NextResponse.json({ message: 'Unauthorized - Invalid access token' }, {
                status: 401,
                headers: newHeaders
            })
        }

        // #region Validating and Decoding JWT or 's_access_token' cookie
        try {
            var decoded = await validateJWT(authorizationToken, userId);
            // Log Here, ex: '{TIMESTAMP} decoded.id {METHOD} {ROUTE} {BODY} {PARAMS}'
        } catch (error) {
            return NextResponse.json({ message: error.message || 'Unauthorized - Invalid access token' }, {
                status: 401,
                headers: newHeaders
            })
        }
        // #endregion
    }
    // #endregion

    // #region Initiate Supabase Instance
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
                },
            },
        }
    )
    // #endregion

    // #region Get Universitas and Handle Response
    /** @type {SupabaseTypes._from<SupabaseTypes.UniversitasData>} */
    const { data, error } = type === 'user' ?
        await supabase.from('universitas').select('id,nama,penilaian').eq('id', id) :
        await supabase.from('universitas').select('id,nama,short,assets').order('id', { ascending: true })

    if (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500, headers: newHeaders })
    }

    return NextResponse.json(data, { status: 200, headers: newHeaders })
    // #endregion
}