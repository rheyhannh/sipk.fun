import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import rateLimit from '@/utils/rateLimit';
import CryptoJS from 'crypto-js';

function encryptSomething(message) {
    try {
        const ciphertext = CryptoJS.AES.encrypt(message, process.env.SECRET_KEY).toString();
        return ciphertext;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

function decryptSomething(ciphertext, parse = false) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        if (parse) { return JSON.parse(decryptedData) }
        return decryptedData;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
})

export async function GET(request) {
    const limitRequest = 10;
    const userAccessToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;

    if (!userAccessToken) {
        return new NextResponse(null, {
            status: 401
        })
    }

    const decryptedSession = decryptSomething(userAccessToken, true);
    const userId = decryptedSession?.user?.id

    if (!userId) {
        return new NextResponse(null, {
            status: 401
        })
    }

    try {
        var currentUsage = await limiter.check(limitRequest, `logout-${userId}`);
    } catch {
        return new NextResponse(null, {
            status: 429,
            headers: {
                'X-Ratelimit-Limit': limitRequest,
                'X-Ratelimit-Remaining': 0,
            }
        })
    }

    const cookieStore = cookies();
    const cookieAuthOptions = { secure: true, httpOnly: true, maxAge: 2592000, sameSite: 'lax' };
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    const encryptedSession = cookieStore.get(process.env.USER_SESSION_COOKIES_NAME)?.value
                    if (encryptedSession) {
                        const decryptedSession = decryptSomething(encryptedSession) || 'removeMe';
                        return decryptedSession;
                    }
                    return encryptedSession;
                },
                set(name, value, options) {
                    const encryptedSession = encryptSomething(value);
                    if (encryptedSession) {
                        cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: encryptedSession, ...cookieAuthOptions })
                    } else {
                        cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value, ...cookieAuthOptions })
                    }
                },
                remove(name, options) {
                    cookieStore.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: '', ...options })
                },
            },
        }
    )

    let { error } = await supabase.auth.signOut()

    if (error) {
        console.error(error);
        return new NextResponse(null, {
            status: 500,
            headers: {
                'X-Ratelimit-Limit': limitRequest,
                'X-Ratelimit-Remaining': limitRequest - currentUsage,
            }
        })
    }

    return NextResponse.redirect(new URL("/users", request.url));
}