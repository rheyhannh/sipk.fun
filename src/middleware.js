// ========== NEXT DEPEDENCY ========== //
import { NextResponse } from 'next/server'

// ========== COMPONENT DEPEDENCY ========== //
import { createServerClient } from '@supabase/ssr'
import CryptoJS from 'crypto-js';

/*
============================== CODE START HERE ==============================
*/
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
    const { pathname } = request.nextUrl;

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    if (!authSessionToken) {
        if (pathname.startsWith('/users')) { return response }
        const loginUrl = new URL("/users", request.url);
        loginUrl.searchParams.set('action', 'login');
        response = NextResponse.redirect(loginUrl);
        return response;
    }

    const cookieAuthOptions = { secure: true, httpOnly: true, maxAge: 2592000, sameSite: 'lax' };
    const deleteCookieAuthOptions = { secure: true, httpOnly: true, maxAge: -2592000, sameSite: 'lax' };
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
                        ...deleteCookieAuthOptions,
                    })

                    const loginUrl = new URL("/users", request.url);
                    loginUrl.searchParams.set('error', 'session');
                    loginUrl.searchParams.set('action', 'login');
                    response = NextResponse.redirect(loginUrl);

                    response.cookies.set({
                        name: process.env.USER_SESSION_COOKIES_NAME,
                        value: '',
                        ...deleteCookieAuthOptions,
                    })
                },
            },
        }
    )

    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
        request.cookies.set({
            name: process.env.USER_SESSION_COOKIES_NAME,
            value: '',
            ...deleteCookieAuthOptions,
        })

        const loginUrl = new URL("/users", request.url);
        loginUrl.searchParams.set('error', 'session');
        loginUrl.searchParams.set('action', 'login');
        response = NextResponse.redirect(loginUrl);

        response.cookies.set({
            name: process.env.USER_SESSION_COOKIES_NAME,
            value: '',
            ...deleteCookieAuthOptions,
        })
    }

    if (pathname.startsWith('/users')) {
        const dashboardUrl = new URL("/dashboard", request.url);
        response = NextResponse.redirect(dashboardUrl);
    }

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*', '/users/:path*'],
}
