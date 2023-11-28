import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import Joi from 'joi'
import rateLimit from '@/utils/rateLimit';
import CryptoJS from 'crypto-js';

const limiter = rateLimit({
    interval: 30 * 1000,
    uniqueTokenPerInterval: 500,
})

function encryptSomething(message) {
    try {
        const ciphertext = CryptoJS.AES.encrypt(message, process.env.SECRET_KEY).toString();
        return ciphertext;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

function decryptSomething(ciphertext) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedData;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

export async function POST(req) {
    // Limit {limitRequest} each {rateLimit.interval}
    const limitRequest = 5;
    const newHeaders = {};
    const headerList = headers();
    const userIp =
        headerList.get('X-Client-IP') ||
        headerList.get('X-Forwarded-For') ||
        headerList.get('X-Real-IP') ||
        'guest_uid:myUUID';

    if (userIp === 'guest_uid:myUUID') {
        // Need to handle this shit
        console.log('Set guest cookie with some id/token');
    }

    // Check are user got limited
    try {
        var currentUsage = await limiter.check(limitRequest, userIp);
        newHeaders['X-Ratelimit-limit'] = limitRequest;
        newHeaders['X-Ratelimit-Remaining'] = limitRequest - currentUsage;
    } catch {
        return new NextResponse(null, {
            status: 429,
            headers: {
                'X-Ratelimit-Limit': limitRequest,
                'X-Ratelimit-Remaining': 0,
            }
        })
    }

    // Check are formData equal to schema using 'Joi'
    const formData = await req.json();
    const formDataSchema = Joi.object({
        email: Joi.string().min(6).max(100).email().required(),
        password: Joi.string().min(6).max(50).required(),
        token: Joi.string().required()
    })

    try {
        await formDataSchema.validateAsync(formData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 400, headers: newHeaders })
    }

    // Create connection to 'supabase' using createServerClient
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

    // Attempting to signInWithPassword
    const signInOptions = {
        email: formData.email,
        password: formData.password,
        options: { captchaToken: formData.token },
    }

    const { data, error } = await supabase.auth.signInWithPassword(signInOptions);

    if (error) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 400, headers: newHeaders })
    }

    return NextResponse.json({ success: true }, { status: 200, headers: newHeaders })
}