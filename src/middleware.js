// ========== NEXT DEPEDENCY ========== //
import { NextResponse } from 'next/server'

// ========== COMPONENT DEPEDENCY ========== //
import { createServerClient } from '@supabase/ssr'
import {
    encryptSyncAES,
    decryptSyncAES,
    cookieAuthOptions,
    cookieAuthDeleteOptions,
    cookieServiceOptions
} from '@/utils/server_side';

/*
============================== CODE START HERE ==============================
*/
export default async function middleware(request) {
    const authSessionToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;
    const serviceUserCookie = request.cookies.get('s_user_id')?.value;
    const serviceGuestCookie = request.cookies.get('s_guest_id')?.value;
    const { pathname } = request.nextUrl;

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    if (!authSessionToken) {
        response.cookies.set({
            name: 's_user_id',
            value: '',
            ...cookieAuthDeleteOptions
        })
        if (pathname.startsWith('/users')) {
            if (!serviceGuestCookie) {
                response.cookies.set({
                    name: 's_guest_id',
                    value: crypto.randomUUID(),
                    ...cookieAuthOptions
                })
            }
            return response
        }
        const loginUrl = new URL("/users", request.url);
        loginUrl.searchParams.set('action', 'login');
        response = NextResponse.redirect(loginUrl);
        return response;
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    const encryptedSession = request.cookies.get(process.env.USER_SESSION_COOKIES_NAME)?.value
                    if (encryptedSession) {
                        const decryptedSession = decryptSyncAES(encryptedSession) || 'removeMe';
                        return decryptedSession;
                    }
                    return encryptedSession;
                },
                set(name, value, options) {
                    const encryptedSession = encryptSyncAES(value);
                    if (encryptedSession) {
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
                    const loginUrl = new URL("/users", request.url);
                    loginUrl.searchParams.set('error', 'session');
                    loginUrl.searchParams.set('action', 'login');
                    response = NextResponse.redirect(loginUrl);

                    response.cookies.set({
                        name: 's_user_id',
                        value: '',
                        ...cookieAuthDeleteOptions
                    })

                    response.cookies.set({
                        name: process.env.USER_SESSION_COOKIES_NAME,
                        value: '',
                        ...cookieAuthDeleteOptions,
                    })
                },
            },
        }
    )

    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
        const loginUrl = new URL("/users", request.url);
        loginUrl.searchParams.set('error', 'session');
        loginUrl.searchParams.set('action', 'login');
        response = NextResponse.redirect(loginUrl);

        response.cookies.set({
            name: process.env.USER_SESSION_COOKIES_NAME,
            value: '',
            ...cookieAuthDeleteOptions,
        })

        response.cookies.set({
            name: 's_user_id',
            value: '',
            ...cookieAuthDeleteOptions,
        })
    } else {
        if (serviceGuestCookie) {
            response.cookies.set({
                name: 's_guest_id',
                value: '',
                ...cookieAuthDeleteOptions,
            })
        }
        if (!serviceUserCookie) {
            response.cookies.set({
                name: 's_user_id',
                value: data.session.user.id,
                ...cookieServiceOptions
            })
        } else {
            if (serviceUserCookie !== data.session.user.id) {
                response.cookies.set({
                    name: 's_user_id',
                    value: data.session.user.id,
                    ...cookieServiceOptions
                })
            }
        }
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
