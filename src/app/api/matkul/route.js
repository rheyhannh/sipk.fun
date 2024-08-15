// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { MatkulFormDataServer } from '@/types/form_data';
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
import Joi from 'joi';
// #endregion

const limitRequest = parseInt(process.env.API_MATKUL_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_MATKUL_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_MATKUL_MAX_TOKEN_PERINTERVAL),
})

const cookieAuthOptions = await getCookieOptions('auth', 'set');
const cookieAuthDeleteOptions = await getCookieOptions('auth', 'remove');

/**
 * Route Handler untuk `PATCH` `'/api/matkul'`
 * @param {NextRequest} request
 */
export async function PATCH(request) {
    const newHeaders = {};
    const { secureSessionCookie } = await getSipkCookies(request);
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    const cookieStore = cookies();
    const searchParams = request.nextUrl.searchParams;
    const matkulId = searchParams.get('id');

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
    // #endregion

    // #region Validating 'matkulId'
    if (!matkulId) {
        return NextResponse.json({ message: `Gagal memperbarui matakuliah, 'id' dibutuhkan` }, {
            status: 400,
            headers: newHeaders
        })
    }

    if (!isUUID(matkulId)) {
        return NextResponse.json({ message: `Gagal memperbarui matakuliah, 'id' bukan uuid` }, {
            status: 400,
            headers: newHeaders
        })
    }
    // #endregion

    // #region Parsing and Handle formData
    try {
        /** @type {MatkulFormDataServer} */
        var formData = await request.json();
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Bad Request - Invalid JSON Format' }, {
            status: 400,
            headers: newHeaders
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

    const userUniversitasId = decryptedSession?.user?.user_metadata?.university_id;
    if (!userUniversitasId) {
        return NextResponse.json({ message: `Gagal memperbarui matakuliah` }, { status: 500, headers: newHeaders })
    }

    // #region Get Penilaian User
    /** @type {SupabaseTypes._from<SupabaseTypes.UniversitasData} */
    var { data: universitas, error } = await supabase.from('universitas').select('*').eq('id', userUniversitasId);

    if (!universitas.length || error) {
        return NextResponse.json({ message: `Gagal memperbarui matakuliah` }, { status: 500, headers: newHeaders })
    }
    // #endregion

    const nilaiRef = universitas[0].penilaian;
    const nilaiKeys = Object.keys(nilaiRef);

    // #region Validating and Handle formData
    const formDataSchema = Joi.object({
        nama: Joi.string().min(3).max(50).required(),
        semester: Joi.number().min(0).max(50).required(),
        sks: Joi.number().min(0).max(50).required(),
        nilai: Joi.object({ indeks: Joi.string().valid(...nilaiKeys).required() }).required(),
        dapat_diulang: Joi.boolean().required(),
        target_nilai: Joi.object({ indeks: Joi.string().valid(...nilaiKeys).required() }).required()
    });

    try {
        await formDataSchema.validateAsync(formData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 400, headers: newHeaders })
    }
    // #endregion

    // #region Resolve Bobot Indeks and Calculate Nilai Akhir
    const { indeks: nilaiIndeks } = formData.nilai;
    const { indeks: targetIndeks } = formData.target_nilai;

    const nilaiWeight = nilaiRef[nilaiIndeks].weight;
    const targetNilaiWeight = nilaiRef[targetIndeks].weight;

    formData.nilai.bobot = nilaiWeight;
    formData.nilai.akhir = formData.sks * nilaiWeight;
    formData.target_nilai.bobot = targetNilaiWeight;
    // #endregion

    const unixNow = Math.floor(Date.now() / 1000);

    // #region Update Matkul
    /** @type {SupabaseTypes._from<SupabaseTypes.MatkulData>} */
    var { data: matkulUpdated, error } = await supabase.from('matkul').update({ ...formData, updated_at: unixNow }).eq('id', matkulId).select();

    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Gagal memperbarui matakuliah` }, { status: 500, headers: newHeaders })
    }
    // #endregion

    // #region Update Matkul-History Related to Matkul
    /** @type {SupabaseTypes._from<SupabaseTypes.MatkulHistoryData>} */
    var { data, error } = await supabase.from('matkul_history').select().eq('matkul_id', matkulId);
    if (!data.length) {
        // Should rollback previous transaction (.update)
        return NextResponse.json({ message: `Gagal memperbarui riwayat matakuliah, id tidak ditemukan` }, { status: 400, headers: newHeaders })
    }
    const prevHistory = data[0].current;

    if (error) {
        // Should rollback previous transaction (.update)
        console.error(error);
        return NextResponse.json({ message: `Gagal memperbarui riwayat matakuliah` }, { status: 500, headers: newHeaders })
    }

    /** @type {SupabaseTypes._from<SupabaseTypes.MatkulHistoryData>} */
    var { data: matkulHistory, error } = await supabase.from('matkul_history').update(
        {
            current:
            {
                ...formData,
                type: 'ubah',
                stamp: unixNow
            },
            prev: { ...prevHistory },
            last_change_at: unixNow
        }
    ).eq('matkul_id', matkulId).select();

    if (error) {
        // Should rollback previous transaction (.update)
        console.error(error);
        return NextResponse.json({ message: `Gagal memperbarui riwayat matakuliah` }, { status: 500, headers: newHeaders })
    }

    return NextResponse.json({ matkul: matkulUpdated[0], ref: matkulHistory[0] }, { status: 200, headers: newHeaders });
    // #endregion
}

/**
 * Route Handler untuk `DELETE` `'/api/matkul'`
 * @param {NextRequest} request
 */
export async function DELETE(request) {
    const newHeaders = {};
    const { secureSessionCookie } = await getSipkCookies(request);
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    const cookieStore = cookies();
    const searchParams = request.nextUrl.searchParams;
    const matkulId = searchParams.get('id');

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
    // #endregion

    // #region Validating 'matkulId'
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

    const unixNow = Math.floor(Date.now() / 1000);

    // #region Delete Matkul
    var { error } = await supabase.from('matkul').delete().eq('id', matkulId)

    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Gagal menghapus matakuliah` }, { status: 500, headers: newHeaders })
    }
    // #endregion

    // #region Update Matkul-History Related to Matkul
    /** @type {SupabaseTypes._from<SupabaseTypes.MatkulHistoryData>} */
    var { data, error } = await supabase.from('matkul_history').select().eq('matkul_id', matkulId);
    if (!data.length) {
        return NextResponse.json({ message: `Gagal menghapus matakuliah, id tidak ditemukan` }, { status: 400, headers: newHeaders })
    }
    const prevHistory = data[0].current;

    if (error) {
        // Rollback will be good
        console.error(error);
        return NextResponse.json({ message: `Gagal memperbarui riwayat` }, { status: 500, headers: newHeaders })
    }

    /** @type {SupabaseTypes._from<SupabaseTypes.MatkulHistoryData>} */
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
    // #endregion
}

/**
 * Route Handler untuk `POST` `'/api/matkul'`
 * @param {NextRequest} request
 */
export async function POST(request) {
    const newHeaders = {};
    const { secureSessionCookie } = await getSipkCookies(request);
    const authorizationHeader = headers().get('Authorization');
    const authorizationToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    const cookieStore = cookies();
    const searchParams = request.nextUrl.searchParams;
    const ref = searchParams.get('ref');

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
    // #endregion

    // #region Parsing and Handle formData
    try {
        /** @type {MatkulFormDataServer} */
        var formData = await request.json();
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Bad Request - Invalid JSON Format' }, {
            status: 400,
            headers: newHeaders
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

    const userUniversitasId = decryptedSession?.user?.user_metadata?.university_id;
    if (!userUniversitasId) {
        return NextResponse.json({ message: `Gagal menambahkan matakuliah` }, { status: 500, headers: newHeaders })
    }

    // #region Get Penilaian User
    /** @type {SupabaseTypes._from<SupabaseTypes.UniversitasData} */
    var { data: universitas, error } = await supabase.from('universitas').select('*').eq('id', userUniversitasId);

    if (!universitas.length || error) {
        return NextResponse.json({ message: `Gagal menambahkan matakuliah` }, { status: 500, headers: newHeaders })
    }
    // #endregion

    const nilaiRef = universitas[0].penilaian;
    const nilaiKeys = Object.keys(nilaiRef);

    // #region Validating and Handle formData
    const formDataSchema = Joi.object({
        nama: Joi.string().min(3).max(50).required(),
        semester: Joi.number().min(0).max(50).required(),
        sks: Joi.number().min(0).max(50).required(),
        nilai: Joi.object({ indeks: Joi.string().valid(...nilaiKeys).required() }).required(),
        dapat_diulang: Joi.boolean().required(),
        target_nilai: Joi.object({ indeks: Joi.string().valid(...nilaiKeys).required() }).required()
    });

    try {
        await formDataSchema.validateAsync(formData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 400, headers: newHeaders })
    }
    // #endregion

    // #region Resolve Bobot Indeks and Calculate Nilai Akhir
    const { indeks: nilaiIndeks } = formData.nilai;
    const { indeks: targetIndeks } = formData.target_nilai;

    const nilaiWeight = nilaiRef[nilaiIndeks].weight;
    const targetNilaiWeight = nilaiRef[targetIndeks].weight;

    formData.nilai.bobot = nilaiWeight;
    formData.nilai.akhir = formData.sks * nilaiWeight;
    formData.target_nilai.bobot = targetNilaiWeight;
    // #endregion

    const unixNow = Math.floor(Date.now() / 1000);

    // #region Add Matkul
    /** @type {SupabaseTypes._from<SupabaseTypes.MatkulData>} */
    var { data: matkulBaru, error } = await supabase.from('matkul').insert({ ...formData, owned_by: userId, created_at: unixNow }).select();

    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Gagal menambahkan ${formData.nama}` }, { status: 500, headers: newHeaders })
    }
    // #endregion

    // #region Update or Add Matkul-History Related to Matkul
    /** @type {SupabaseTypes._from<SupabaseTypes.MatkulHistoryData>} */
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
    // #endregion
}

/**
 * Route Handler untuk `GET` `'/api/matkul'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const { secureSessionCookie } = await getSipkCookies(request);
    const cookieStore = cookies();
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
        const { data, error } = await supabase.from('matkul').select('*');
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

    // #region Get Matkul and Handle Response
    /** @type {SupabaseTypes._from<SupabaseTypes.MatkulData>} */
    let { data, error } = await supabase.from('matkul').select('*').order('created_at', { ascending: true });

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