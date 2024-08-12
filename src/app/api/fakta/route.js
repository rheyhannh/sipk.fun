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
    getCookieOptions,
    getSipkCookies,
    getIpFromHeaders,
    getApiKey,
} from '@/utils/server_side';
import isUUID from 'validator/lib/isUUID';
// #endregion

const limitRequest = parseInt(process.env.API_FAKTA_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_FAKTA_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_FAKTA_MAX_TOKEN_PERINTERVAL),
})

const cookieAuthOptions = await getCookieOptions('auth', 'set');
const cookieAuthDeleteOptions = await getCookieOptions('auth', 'remove');
const cookieServiceOptions = await getCookieOptions('service', 'set');

/**
 * Route Handler untuk `GET` `'/api/fakta'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const cookieStore = cookies();
    const newHeaders = {};
    var { serviceGuestCookie, serviceUserIdCookie } = await getSipkCookies(request);
    const serviceApiKey = await getApiKey(request);

    // #region Handler when serviceApiKey exist
    if (serviceApiKey) {
        if (serviceApiKey !== process.env.SUPABASE_SERVICE_KEY) {
            return NextResponse.json({ message: `Invalid API key` }, {
                status: 401,
            })
        }
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
        /** @type {SupabaseTypes._from<SupabaseTypes.FaktaData>} */
        const { data, error } = await supabase.from('fakta').select('*');
        if (error) {
            console.error(error);
            return NextResponse.json({ message: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 200 })
    }
    // #endregion

    // #region Verifying serviceGuestCookie and serviceUserIdCookie
    const setNewServiceGuestCookie = () => {
        const newId = crypto.randomUUID();
        cookieStore.set({ name: 's_guest_id', value: newId, ...cookieServiceOptions });
        serviceGuestCookie = 'public';
    }

    if (serviceGuestCookie) {
        if (!isUUID(serviceGuestCookie)) { setNewServiceGuestCookie(); }
    } else { setNewServiceGuestCookie(); }

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

    // #region Handle Response
    /** @type {SupabaseTypes._from<SupabaseTypes.FaktaData>} */
    const { data, error } = await supabase.from('fakta').select('*');

    if (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500, headers: newHeaders })
    }

    return NextResponse.json(data, { status: 200, headers: newHeaders })
    // #endregion
}