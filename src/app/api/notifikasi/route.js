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

const limitRequest = parseInt(process.env.API_NOTIFIKASI_REQUEST_LIMIT);
const limiter = rateLimit({
    interval: parseInt(process.env.API_NOTIFIKASI_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_NOTIFIKASI_MAX_TOKEN_PERINTERVAL),
})

export async function GET(request) {
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
        cookieStore.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions})
        return NextResponse.json({ message: 'Unauthorized - Invalid access token' }, {
            status: 401
        })
    }

    try {
        var currentUsage = await limiter.check(limitRequest, `notifikasi-${userId}`);
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

    let { data, error } = await supabase.from('notifikasi').select('*').limit(10).order('unix_created_at', { ascending: false });

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