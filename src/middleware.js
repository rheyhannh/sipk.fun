import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
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

export default async function middleware(request) {
    const authSessionToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    if (!authSessionToken) {
        const loginUrl = new URL("/users", request.url);
        loginUrl.searchParams.set('from', request.nextUrl.pathname);
        response = NextResponse.redirect(loginUrl);
        return response;
    }

    const cookieAuthOptions = { secure: true, httpOnly: true, maxAge: 2592000, sameSite: 'lax' };
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    const encryptedSession = request.cookies.get(process.env.USER_SESSION_COOKIES_NAME)?.value
                    if (encryptedSession) {
                        const decryptedSession = decryptSomething(encryptedSession) || 'removeMe';
                        return decryptedSession;
                    }
                    return encryptedSession;
                },
                set(name, value, options) {
                    const encryptedSession = encryptSomething(value);
                    if (encryptedSession) {
                        request.cookies.set({
                            name: process.env.USER_SESSION_COOKIES_NAME,
                            value: encryptedSession,
                            ...cookieAuthOptions
                        })

                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })

                        response.cookies.set({
                            name: process.env.USER_SESSION_COOKIES_NAME,
                            value: encryptedSession,
                            ...cookieAuthOptions
                        })
                    } else {
                        request.cookies.set({
                            name: process.env.USER_SESSION_COOKIES_NAME,
                            value: encryptedSession,
                            ...cookieAuthOptions
                        })

                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })

                        response.cookies.set({
                            name: process.env.USER_SESSION_COOKIES_NAME,
                            value: encryptedSession,
                            ...cookieAuthOptions
                        })
                    }
                },
                remove(name, options) {
                    request.cookies.set({
                        name: process.env.USER_SESSION_COOKIES_NAME,
                        value: '',
                        ...options,
                    })

                    const loginUrl = new URL("/users", request.url);
                    loginUrl.searchParams.set('from', request.nextUrl.pathname);

                    response = NextResponse.redirect(loginUrl);

                    response.cookies.set({
                        name: process.env.USER_SESSION_COOKIES_NAME,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data, error } = await supabase.auth.getSession();

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*'],
}
