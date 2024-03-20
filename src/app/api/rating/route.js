// ========== NEXT DEPEDENCY ========== //
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

// ========== SUPABASE DEPEDENCY ========== //
import { createServerClient } from '@supabase/ssr';

// ========== UTIL DEPEDENCY ========== //
import {
    encryptAES,
    decryptAES,
    rateLimit,
    validateJWT
} from '@/utils/server_side';
import isUUID from 'validator/lib/isUUID';
import Joi from 'joi';

const cookieAuthOptions = { secure: true, httpOnly: true, maxAge: 2592000, sameSite: 'lax' };
const cookieAuthDeleteOptions = { secure: true, httpOnly: true, maxAge: -2592000, sameSite: 'lax' };
const limitRequest = parseInt(process.env.API_RATING_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_RATING_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_RATING_MAX_TOKEN_PERINTERVAL),
})

/*
============================== CODE START HERE ==============================
*/

export async function GET(request) {
    const userAccessToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;
    const cookieStore = cookies();
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;

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
        var currentUsage = await limiter.check(limitRequest, `rating-${userId}`);
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

    let { data, error } = await supabase.from('rating').select('*');

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

export async function POST(request) {
    const newHeaders = {};
    const userAccessToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    const cookieStore = cookies();

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
        var currentUsage = await limiter.check(limitRequest, `rating-${userId}`);
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

    // Refactorable from here
    try {
        var formData = await request.json();
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Invalid JSON Format' }, {
            status: 400,
            headers: newHeaders
        })
    }

    const formDataSchema = Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        review: Joi.string().allow('').max(200).required(),
        details: Joi.object({
            author: Joi.string().required(),
            authorType: Joi.number().min(0).max(2).required(),
            universitas: Joi.string().required() // Belum validasi dengan Universitas yang valid atau tersedia
        }).required()
    })

    try {
        await formDataSchema.validateAsync(formData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 400, headers: newHeaders })
    }

    const unallowedWords = ['http', 'https', 'www'];
    const unallowedSymbols = ['<', '>', '&', '/', `'`, `"`];

    if (unallowedWords.some(word => formData.review.includes(word))) {
        return NextResponse.json({ message: `Review tidak dapat mengandung URL` }, { status: 400, headers: newHeaders })
    }
    if (unallowedSymbols.some(symbol => formData.review.includes(symbol))) {
        return NextResponse.json({ message: `Review tidak dapat mengandung simbol > , < , & , ' , " dan /` }, { status: 400, headers: newHeaders })
    }
    // to here

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

    var { data, error } = await supabase.from('rating').select('*');

    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Gagal menambahkan rating` }, { status: 500, headers: newHeaders })
    }

    if (data.length) {
        return NextResponse.json({ message: `Gagal menambahkan rating, rating sudah tersedia`, resolve: `Silahkan edit atau hapus rating yang sudah tersedia` }, { status: 400, headers: newHeaders })
    }

    const unixNow = Math.floor(Date.now() / 1000);

    var { data, error } = await supabase.from('rating').insert({ ...formData, owned_by: userId, unix_created_at: unixNow }).select();

    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Gagal menambahkan rating` }, { status: 500, headers: newHeaders })
    }

    return NextResponse.json({ rating: data[0] }, { status: 200, headers: newHeaders })
}

export async function PATCH(request) {
    const newHeaders = {};
    const userAccessToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    const cookieStore = cookies();
    const searchParams = request.nextUrl.searchParams;
    const ratingId = searchParams.get('id');

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
        var currentUsage = await limiter.check(limitRequest, `rating-${userId}`);
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

    if (!ratingId) {
        return NextResponse.json({ message: `Gagal memperbarui rating, 'id' dibutuhkan` }, {
            status: 400,
            headers: newHeaders
        })
    }

    if (!isUUID(ratingId)) {
        return NextResponse.json({ message: `Gagal memperbarui rating, 'id' bukan uuid` }, {
            status: 400,
            headers: newHeaders
        })
    }

    // Refactorable from here
    try {
        var formData = await request.json();
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Invalid JSON Format' }, {
            status: 400,
            headers: newHeaders
        })
    }

    const formDataSchema = Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        review: Joi.string().allow('').max(200).required(),
        details: Joi.object({
            author: Joi.string().required(),
            authorType: Joi.number().min(0).max(2).required(),
            universitas: Joi.string().required() // Belum validasi dengan Universitas yang valid atau tersedia
        }).required()
    })

    try {
        await formDataSchema.validateAsync(formData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 400, headers: newHeaders })
    }

    const unallowedWords = ['http', 'https', 'www'];
    const unallowedSymbols = ['<', '>', '&', '/', `'`, `"`];

    if (unallowedWords.some(word => formData.review.includes(word))) {
        return NextResponse.json({ message: `Review tidak dapat mengandung URL` }, { status: 400, headers: newHeaders })
    }
    if (unallowedSymbols.some(symbol => formData.review.includes(symbol))) {
        return NextResponse.json({ message: `Review tidak dapat mengandung simbol > , < , & , ' , " dan /` }, { status: 400, headers: newHeaders })
    }
    // to here

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

    const unixNow = Math.floor(Date.now() / 1000);

    const { data, error } = await supabase.from('rating').update(
        {
            rating: formData.rating,
            review: formData.review,
            unix_updated_at: unixNow,
            details: formData.details
        }
    ).eq('id', ratingId).select();

    if (!data.length) {
        return NextResponse.json({ message: `Gagal memperbarui rating, rating tidak ditemukan`, resolve: `Gunakan id rating yang valid dan tersedia` }, { status: 404, headers: newHeaders })
    }

    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Gagal memperbarui rating` }, { status: 500, headers: newHeaders })
    }

    return NextResponse.json({ rating: data[0] }, { status: 200, headers: newHeaders })
}

/*
============================== CODE END HERE ==============================
*/