import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import {
    encryptSyncAES,
    decryptAES,
    decryptSyncAES,
    rateLimit,
    cookieAuthOptions,
    cookieAuthDeleteOptions
} from '@/utils/server_side';

const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
})

export async function POST(request) {
    const limitRequest = 20;
    const newHeaders = {};
    const userAccessToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;
    const cookieStore = cookies();

    if (!userAccessToken) {
        return NextResponse.json({ message: 'Unauthorized - Missing access token' }, {
            status: 401,
        })
    }

    const decryptedSession = await decryptAES(userAccessToken, true);
    const userId = decryptedSession?.user?.id;

    if (!userId) {
        cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: '', ...cookieAuthDeleteOptions })
        cookieStore.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions })
        return NextResponse.json({ message: 'Unauthorized - Invalid access token' }, {
            status: 401
        })
    }

    try {
        var currentUsage = await limiter.check(limitRequest, `matkul-${userId}`);
        newHeaders['X-Ratelimit-limit'] = limitRequest;
        newHeaders['X-Ratelimit-Remaining'] = limitRequest - currentUsage;
    } catch {
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
    //     sks: Joi.number().min(1).max(50).required(),
    //     nilai_indeks: Joi.string().allow('A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E').required(),
    //     semester: Joi.number().min(1).max(50).required(),
    //     dapat_diulang: Joi.boolean(),
    //     bobot_maksimum: Joi.number().allow(4, 3.5, 3, 2.5, 2, 1.5, 1, 0)
    // })

    // try {
    //     await formDataSchema.validateAsync(formData);
    // } catch (error) {
    //     console.error(error);
    //     return NextResponse.json({ message: error.message }, { status: 400, headers: newHeaders })
    // }

    // const getMatkulData = async (formData) => {
    //     const penilaian = {
    //         'A': 4, 'B+': 3.5, 'B': 3, 'C+': 2.5, 'C': 2, 'D+': 1.5, 'D': 1, 'E': 0
    //     }

    //     return {
    //         nama: formData.nama,
    //         sks: formData.sks,
    //         nilai_indeks: formData.nilai_indeks,
    //         semester: formData.semester,
    //         dapat_diulang: formData.dapat_diulang,
    //         bobot_maksimum: formData.bobot_maksimum,
    //         bobot_indeks: penilaian[formData.nilai_indeks],
    //         nilai_akhir: formData.sks * penilaian[formData.nilai_indeks]
    //     }
    // }

    // const matkulData = await getMatkulData(formData);
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    const encryptedSession = cookieStore.get(process.env.USER_SESSION_COOKIES_NAME)?.value
                    if (encryptedSession) {
                        const decryptedSession = decryptSyncAES(encryptedSession) || 'removeMe';
                        return decryptedSession;
                    }
                    return encryptedSession;
                },
                set(name, value, options) {
                    const encryptedSession = encryptSyncAES(value);
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

    const unixNow = Math.floor(Date.now() / 1000);

    var { data: matkulBaru, error } = await supabase.from('matkul').insert({ ...formData, owned_by: userId, created_at: unixNow }).select();

    if (error) {
        console.error(error);
        return NextResponse.json({ message: `Gagal menambahkan ${formData.nama}` }, { status: 500, headers: newHeaders })
    }

    var { data: matkulBaruHistory, error } = await supabase.from('matkul_history').insert(
        { matkul_id: matkulBaru[0].id, current: { ...formData, type: 'tambah', stamp: unixNow }, prev: null, owned_by: userId, last_change_at: unixNow }
    ).select();

    if (error) {
        console.error(error);
        return NextResponse.json({ message: `${formData.nama} tidak tercatat diriwayat` }, { status: 500, headers: newHeaders })
    }

    return NextResponse.json({ matkul: matkulBaru[0], ref: matkulBaruHistory[0] }, { status: 200, headers: newHeaders })
}

export async function GET(request) {
    const limitRequest = 20;
    const userAccessToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;
    const cookieStore = cookies();
    const cookieAuthOptions = { secure: true, httpOnly: true, maxAge: 2592000, sameSite: 'lax' };
    const cookieAuthDeleteOptions = { secure: true, httpOnly: true, maxAge: -2592000, sameSite: 'lax' };

    if (!userAccessToken) {
        return NextResponse.json({ message: 'Unauthorized - Missing access token' }, {
            status: 401,
        })
    }

    const decryptedSession = await decryptAES(userAccessToken, true);
    const userId = decryptedSession?.user?.id;

    if (!userId) {
        cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: '', ...cookieAuthDeleteOptions })
        cookieStore.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions })
        return NextResponse.json({ message: 'Unauthorized - Invalid access token' }, {
            status: 401
        })
    }

    try {
        var currentUsage = await limiter.check(limitRequest, `matkul-${userId}`);
    } catch {
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
                get(name) {
                    const encryptedSession = cookieStore.get(process.env.USER_SESSION_COOKIES_NAME)?.value
                    if (encryptedSession) {
                        const decryptedSession = decryptSyncAES(encryptedSession) || 'removeMe';
                        return decryptedSession;
                    }
                    return encryptedSession;
                },
                set(name, value, options) {
                    const encryptedSession = encryptSyncAES(value);
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