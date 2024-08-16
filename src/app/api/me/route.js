// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { UserFormData } from '@/types/form_data';
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
    getApiKey
} from '@/utils/server_side';
import Joi from 'joi';
// #endregion

const limitRequest = parseInt(process.env.API_ME_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_ME_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_ME_MAX_TOKEN_PERINTERVAL),
})

const cookieAuthOptions = await getCookieOptions('auth', 'set');
const cookieAuthDeleteOptions = await getCookieOptions('auth', 'remove');

/**
 * Route Handler untuk `GET` `'/api/me'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const { secureSessionCookie } = await getSipkCookies(request);
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    const cookieStore = cookies();
    const serviceApiKey = await getApiKey(request);

    // #region Handler when serviceApiKey exist
    if (serviceApiKey) {
        if (serviceApiKey !== process.env.SUPABASE_SERVICE_KEY) {
            return NextResponse.json({ message: `Invalid API key` }, {
                status: 401,
            })
        }
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
        const { data, error } = await supabase.from('user').select('*');
        if (error) {
            console.error(error);
            return NextResponse.json({ message: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 200 })
    }
    // #endregion

    // #region Handler Unauthenticated User
    if (!secureSessionCookie || !authorizationHeader || !authorizationToken) {
        return NextResponse.json({ message: 'Unauthorized - Missing access token' }, {
            status: 401,
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
            status: 401
        })
    }

    // #region Validating and Decoding JWT or 's_access_token' cookie
    try {
        var decoded = await validateJWT(authorizationToken, userId);
        // Log Here, ex: '{TIMESTAMP} decoded.id {METHOD} {ROUTE} {BODY} {PARAMS}'
    } catch (error) {
        return NextResponse.json({ message: error.message || 'Unauthorized - Invalid access token' }, {
            status: 401
        })
    }
    // #endregion

    // #region Checking Ratelimit
    try {
        var currentUsage = await limiter.check(limitRequest, `me-${userId}`);
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
                    cookieStore.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions })
                    cookieStore.set({ name: 's_access_token', value: '', ...cookieAuthDeleteOptions })
                },
            },
        }
    )
    // #endregion

    // #region Get User Data and Handle Response
    /** @type {SupabaseTypes._from<SupabaseTypes.UserData>} */
    let { data, error } = await supabase.from('user').select('*');

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
    // #endregion
}

/**
 * Route Handler untuk `PATCH` `'/api/me'`
 * @param {NextRequest} request
 */
export async function PATCH(request) {
    const newHeaders = {};
    const { secureSessionCookie } = await getSipkCookies(request);
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    const cookieStore = cookies();

    // #region Handler Unauthenticated User
    if (!secureSessionCookie || !authorizationHeader || !authorizationToken) {
        return NextResponse.json({ message: 'Unauthorized - Missing access token' }, {
            status: 401,
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
            status: 401
        })
    }

    // #region Validating and Decoding JWT or 's_access_token' cookie
    try {
        var decoded = await validateJWT(authorizationToken, userId);
        // Log Here, ex: '{TIMESTAMP} decoded.id {METHOD} {ROUTE} {BODY} {PARAMS}'
    } catch (error) {
        return NextResponse.json({ message: error.message || 'Unauthorized - Invalid access token' }, {
            status: 401
        })
    }
    // #endregion

    // #region Checking Ratelimit
    try {
        var currentUsage = await limiter.check(limitRequest, `me-${userId}`);
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
    // #endregion

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const allowedType = ['preferences'];

    // #region Validating Query Params
    if (type && !allowedType.includes(type)) {
        return NextResponse.json({ message: 'Bad Request - Invalid type' }, { status: 400, headers: newHeaders })
    }
    // #endregion

    // #region Parsing and Handle formData
    try {
        /** @type {UserFormData} */
        var formData = await request.json();
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Invalid JSON Format' }, {
            status: 400,
            headers: newHeaders
        })
    }
    // #endregion

    // #region Validating and Handle formData
    const allowedColumn = ['nomor', 'matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target', 'ontarget'];
    const formDataSchema =
        type === 'preferences' ?
            Joi.object({
                table: Joi.object({
                    size: Joi.number().valid(-1, 5, 10, 25, 50, 100).required().options({ convert: false }),
                    controlPosition: Joi.number().min(0).max(2).required().options({ convert: false }),
                    columnOrder: Joi.array()
                        .items(Joi.string().valid(...allowedColumn))
                        .unique()
                        .length(8)
                        .required(),
                    columnVisibility: Joi.object()
                        .keys({
                            nomor: Joi.boolean().required(),
                            matakuliah: Joi.boolean().required(),
                            semester: Joi.boolean().required(),
                            sks: Joi.boolean().required(),
                            nilai: Joi.boolean().required(),
                            diulang: Joi.boolean().required(),
                            target: Joi.boolean().required(),
                            ontarget: Joi.boolean().required()
                        })
                        .required()
                        .length(allowedColumn.length)
                        .unknown(false)
                        .options({ convert: false })
                }).required()
            }).required()
            :
            Joi.object({
                fullname: Joi.string().pattern(/^[A-Za-z\s]*$/, 'alpha only').pattern(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'one space each word').min(6).max(50),
                nickname: Joi.string().min(3).max(20),
                jurusan: Joi.string().min(6).max(30),
                sks_target: Joi.number().integer().min(5).max(1000),
                matkul_target: Joi.number().integer().min(5).max(1000),
                ipk_target: Joi.number().min(1).max(4)
            })

    try {
        await formDataSchema.validateAsync(formData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 400, headers: newHeaders })
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
                    cookieStore.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions })
                    cookieStore.set({ name: 's_access_token', value: '', ...cookieAuthDeleteOptions })
                },
            },
        }
    )
    // #endregion

    // #region Update User Data
    /** @type {SupabaseTypes._from<SupabaseTypes.UserData>} */
    var { data: profilBaru, error } =
        type === 'preferences' ?
            await supabase.from('user').update({ preferences: formData }).eq('id', userId).select()
            :
            await supabase.from('user').update({ ...formData }).eq('id', userId).select()


    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Gagal memperbarui data` }, { status: 500, headers: newHeaders })
    }

    return NextResponse.json({ profil: profilBaru[0] }, { status: 200, headers: newHeaders })
    // #endregion
}