import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
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
const limitRequest = parseInt(process.env.API_MATKUL_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_MATKUL_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_MATKUL_MAX_TOKEN_PERINTERVAL),
})

export async function DELETE(request) {
    const newHeaders = {};
    const userAccessToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    const cookieStore = cookies();
    const searchParams = request.nextUrl.searchParams;
    const matkulId = searchParams.get('id');

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

    if (!matkulId) {
        return NextResponse.json({ message: `Gagal menghapus matakuliah, 'id' dibutuhkan` }, {
            status: 400,
            headers: newHeaders
        })
    }

    if (!isUUID(matkulId)) {
        return NextResponse.json({ message: `Gagal menghapus matakuliah, 'id' bukan uuid` }, {
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
                    cookieStore.set({ name: 's_access_token', value: '', ...cookieAuthDeleteOptions})
                },
            },
        }
    )

    const unixNow = Math.floor(Date.now() / 1000);

    var { error } = await supabase.from('matkul').delete().eq('id', matkulId)

    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Gagal menghapus matakuliah` }, { status: 500, headers: newHeaders })
    }

    var { data, error } = await supabase.from('matkul_history').select().eq('matkul_id', matkulId);
    if (data.length === 0) {
        return NextResponse.json({ message: `Gagal menghapus matakuliah, id tidak ditemukan` }, { status: 400, headers: newHeaders })
    }
    const prevHistory = data[0].current;

    if (error) {
        // Rollback will be good
        console.error(error);
        return NextResponse.json({ message: `Gagal memperbarui riwayat` }, { status: 500, headers: newHeaders })
    }

    var { data: matkulHistory, error } = await supabase.from('matkul_history').update(
        {
            matkul_id: data[0].matkul_id,
            current:
            {
                ...prevHistory,
                type: 'hapus',
                stamp: unixNow
            },
            prev: { ...prevHistory },
            owned_by: userId,
            last_change_at: unixNow
        }
    ).eq('matkul_id', matkulId).select();

    if (error) {
        // Rollback will be good
        console.error(error);
        return NextResponse.json({ message: `Gagal memperbarui riwayat` }, { status: 500, headers: newHeaders })
    }

    return NextResponse.json({ ref: matkulHistory[0] }, { status: 200, headers: newHeaders })
}

export async function POST(request) {
    const newHeaders = {};
    const userAccessToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    const cookieStore = cookies();
    const searchParams = request.nextUrl.searchParams;
    const ref = searchParams.get('ref');

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

    // Check are formData equal to schema using 'Joi'
    const formData = await request.json();
    // const formDataSchema = Joi.object({
    //     nama: Joi.string().min(3).max(50).required(),
    //     semester: Joi.number().min(0).max(50).required(),
    //     sks: Joi.number().min(0).max(50).required(),
    //     nilai: Joi.object({
    //         indeks: Joi.string().allow('A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E').required(),
    //         bobot: Joi.string().allow('4', '3.5', '3', '2.5', '2', '1.5', '1', '0').required(),
    //         akhir: Joi.number()
    //     }),
    //     dapat_diulang: Joi.boolean(),
    //     target_nilai: Joi.object({
    //         indeks: Joi.string().allow('A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E').required(),
    //         bobot: Joi.string().allow('4', '3.5', '3', '2.5', '2', '1.5', '1', '0').required(),
    //     })
    // })

    // try {
    //     await formDataSchema.validateAsync(formData);
    // } catch (error) {
    //     console.error(error);
    //     return NextResponse.json({ message: error.message }, { status: 400, headers: newHeaders })
    // }

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
                    cookieStore.set({ name: 's_access_token', value: '', ...cookieAuthDeleteOptions})
                },
            },
        }
    )

    const unixNow = Math.floor(Date.now() / 1000);

    var { data: matkulBaru, error } = await supabase.from('matkul').insert({ ...formData, owned_by: userId, created_at: unixNow }).select();

    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Gagal menambahkan ${formData.nama}` }, { status: 500, headers: newHeaders })
    }

    var { data: matkulBaruHistory, error } = ref ?
        await supabase.from('matkul_history')
            .update({ matkul_id: matkulBaru[0].id, current: { ...formData, type: 'tambah', stamp: unixNow }, prev: null, owned_by: userId, last_change_at: unixNow })
            .eq('matkul_id', ref)
            .select()
        : await supabase.from('matkul_history')
            .insert({ matkul_id: matkulBaru[0].id, current: { ...formData, type: 'tambah', stamp: unixNow }, prev: null, owned_by: userId, last_change_at: unixNow })
            .select();

    if (error) {
        console.error(error);
        return NextResponse.json({ message: `${formData.nama} tidak tercatat diriwayat` }, { status: 500, headers: newHeaders })
    }

    return NextResponse.json({ matkul: matkulBaru[0], ref: matkulBaruHistory[0] }, { status: 200, headers: newHeaders })
}

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
        var currentUsage = await limiter.check(limitRequest, `matkul-${userId}`);
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
                    cookieStore.set({ name: 's_access_token', value: '', ...cookieAuthDeleteOptions})
                },
            },
        }
    )

    let { data, error } = await supabase.from('matkul').select('*');

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