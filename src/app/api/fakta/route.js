import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import {
    encryptAES,
    decryptAES,
    rateLimit,
} from '@/utils/server_side';
import isUUID from 'validator/lib/isUUID';

const cookieAuthOptions = { secure: true, httpOnly: true, maxAge: 2592000, sameSite: 'lax' };
const cookieAuthDeleteOptions = { secure: true, httpOnly: true, maxAge: -2592000, sameSite: 'lax' };
const cookieServiceOptions = { secure: false, httpOnly: false, maxAge: 2592000, sameSite: 'lax' };
const limitRequest = parseInt(process.env.API_FAKTA_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_FAKTA_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_FAKTA_MAX_TOKEN_PERINTERVAL),
})

export async function GET(request) {
    const cookieStore = cookies();
    const newHeaders = {};
    var serviceGuestCookie = request.cookies.get('s_guest_id')?.value;
    var serviceUserIdCookie = request.cookies.get('s_user_id')?.value;

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

    // guestKey (IP or guest_Id) to create key for rate limiter
    const guestKey =
        headers().get('X-Client-IP') ||
        headers().get('X-Forwarded-For') ||
        headers().get('X-Real-IP') ||
        serviceUserIdCookie ||
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

    // Create connection to 'supabase' using createServerClient
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

    const { data, error } = await supabase.from('fakta').select('*');

    if (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500, headers: newHeaders })
    }

    return NextResponse.json(data, { status: 200, headers: newHeaders })
}