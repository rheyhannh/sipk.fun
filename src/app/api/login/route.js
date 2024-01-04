import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import {
    encryptAES,
    decryptAES,
    rateLimit,
    validateIdentifier,
} from '@/utils/server_side';
import Joi from 'joi'
import isUUID from 'validator/lib/isUUID';

const cookieAuthOptions = { secure: true, httpOnly: true, maxAge: 2592000, sameSite: 'lax' };
const cookieAuthDeleteOptions = { secure: true, httpOnly: true, maxAge: -2592000, sameSite: 'lax' };
const cookieServiceOptions = { secure: false, httpOnly: false, maxAge: 2592000, sameSite: 'lax' };
const limitRequest = parseInt(process.env.API_LOGIN_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_LOGIN_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_LOGIN_MAX_TOKEN_PERINTERVAL),
})

export async function POST(request) {
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

    const cookieStore = cookies();
    if (!serviceGuestCookie || !isUUID(serviceGuestCookie)) {
        const newId = crypto.randomUUID();
        cookieStore.set({ name: 's_guest_id', value: newId, ...cookieServiceOptions });
        return NextResponse.json({ message: 'Unauthorized - Missing guest cookie' }, {
            status: 401,
            headers: newHeaders
        })
    }

    const searchParams = request.nextUrl.searchParams;
    const stamp = searchParams.get('stamp');
    const identifier = searchParams.get('identifier');
    if (!stamp || !identifier) {
        return NextResponse.json({ message: 'Unauthorized - Missing stamp or identifier query' }, {
            status: 401,
            headers: newHeaders
        })
    }

    // Verify 'identifier'
    try {
        await validateIdentifier(serviceGuestCookie, stamp, identifier);
    } catch (error) {
        return NextResponse.json({ message: 'Unauthorized - Invalid identifier' }, {
            status: 401,
            headers: newHeaders
        })
    }

    // Try parsing formData JSON
    try {
        var formData = await request.json();
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Bad Request - Invalid JSON Format' }, {
            status: 400,
            headers: newHeaders
        })
    }

    // Try checking are formData equal to schema using 'Joi'
    try {
        const formDataSchema = Joi.object({
            email: Joi.string().min(6).max(100).email().required(),
            password: Joi.string().min(6).max(50).required(),
            token: process.env.NODE_ENV !== 'production' ? Joi.string() : Joi.string().required(),
        })
        await formDataSchema.validateAsync(formData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 400, headers: newHeaders })
    }

    // Create connection to 'supabase' using createServerClient
    const supabase = createServerClient(
        process.env.SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

    // Attempting to signInWithPassword
    const signInOptions = {
        email: formData.email,
        password: formData.password,
        options: { captchaToken: formData.token },
    }

    const { data, error } = await supabase.auth.signInWithPassword(signInOptions);

    if (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 403, headers: newHeaders })
    }

    return NextResponse.json({ success: true }, { status: 200, headers: newHeaders })
}