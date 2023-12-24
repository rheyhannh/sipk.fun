import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import {
    encryptAES,
    decryptAES,
    rateLimit,
} from '@/utils/server_side';
import Joi from 'joi';
import isUUID from 'validator/lib/isUUID';
import isNumber from 'validator/lib/isNumeric';
import { SHA256, HmacSHA512 } from 'crypto-js';
import Hex from 'crypto-js/enc-hex';

const cookieAuthOptions = { secure: true, httpOnly: true, maxAge: 2592000, sameSite: 'lax' };
const cookieAuthDeleteOptions = { secure: true, httpOnly: true, maxAge: -2592000, sameSite: 'lax' };
const cookieServiceOptions = { secure: false, httpOnly: false, maxAge: 2592000, sameSite: 'lax' };
const limitRequest = parseInt(process.env.API_REGISTER_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_REGISTER_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_REGISTER_MAX_TOKEN_PERINTERVAL),
})

const verifyIdentifier = async (id, stamp, identifier) => {
    try {
        if (stamp.length < 10) { throw new Error('Invalid stamp format'); }
        if (!isNumber(stamp)) { throw new Error('Invalid stamp type'); }

        const result = Array.from(stamp)
            .map(Number)
            .filter(digit => digit !== 0)
            .reduce((acc, digit) => acc * digit, 1);

        const nonce = result.toString();
        const nonceReverse = nonce.split('').reverse().join('');
        const hashDigest = SHA256(nonce + id + nonceReverse);
        const hmacDigest = HmacSHA512(hashDigest, stamp);
        const hmacDigestStr = Hex.stringify(hmacDigest);

        if (hmacDigestStr !== identifier) { throw new Error('Identifier not valid'); }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

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
        await verifyIdentifier(serviceGuestCookie, stamp, identifier);
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
        const formDataSchema =
            Joi.object(
                {
                    email: Joi.string().min(6).max(100).email().required(),
                    password: Joi.string().min(6).max(50).required(),
                    fullname: Joi.string().required(),
                    university: Joi.string().required(),
                    university_id: Joi.number().min(0).max(parseInt(process.env.DATA_UNIVERSITAS_LENGTH)).required(),
                    token: process.env.NODE_ENV !== 'production' ? Joi.string() : Joi.string().required(),
                }
            )

        await formDataSchema.validateAsync(formData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message || 'Bad Request' }, {
            status: 400,
            headers: newHeaders
        })
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
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
                    cookieStore.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions })
                    cookieStore.set({ name: 's_access_token', value: '', ...cookieAuthDeleteOptions })
                },
            },
        }
    )

    const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                fullname: formData.fullname,
                university: formData.university,
                university_id: formData.university_id,
            },
            captchaToken: formData.token,
        }
    })

    if (error) {
        return NextResponse.json({ message: error.message }, {
            status: 500,
            headers: newHeaders
        })
    }

    return NextResponse.json({ success: true }, { status: 200, headers: newHeaders })
}