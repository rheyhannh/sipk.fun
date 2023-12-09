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
    const serviceAccessTokenCookie = request.cookies.get('s_access_token')?.value;
    const serviceGuestCookie = request.cookies.get('s_guest_id')?.value;
    const { pathname } = request.nextUrl;

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    if (!authSessionToken) {
        const loginUrl = new URL("/users", request.url);
        if (serviceUserCookie || serviceAccessTokenCookie) {
            response.cookies.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions });
            response.cookies.set({ name: 's_access_token', value: '', ...cookieAuthDeleteOptions });
        }
        if (pathname.startsWith('/users')) {
            if (!serviceGuestCookie) { response.cookies.set({ name: 's_guest_id', value: crypto.randomUUID(), ...cookieAuthOptions }) }
            return response
        }
        loginUrl.searchParams.set('action', 'login');
        loginUrl.searchParams.set('error', 'esession');
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
                    loginUrl.searchParams.set('action', 'login');
                    loginUrl.searchParams.set('error', 'isession');
                    response = NextResponse.redirect(loginUrl);

                    response.cookies.set({
                        name: 's_user_id',
                        value: '',
                        ...cookieAuthDeleteOptions
                    })

                    response.cookies.set({
                        name: 's_access_token',
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
        // This block run when session (secure auth token) are invalid.
        // Handle : redirect user to '/users?action=login&error={isession}' and delete sensitive cookies
        const loginUrl = new URL("/users", request.url);
        loginUrl.searchParams.set('action', 'login');
        loginUrl.searchParams.set('error', 'isession');
        response = NextResponse.redirect(loginUrl);
        response.cookies.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: '', ...cookieAuthDeleteOptions, })
        response.cookies.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions, })
        response.cookies.set({ name: 's_access_token', value: '', ...cookieAuthDeleteOptions, })
    } else {
        // This block run when session (secure auth token) are valid or receiving new session
        if (serviceGuestCookie) {
            // Set cookies (Make sure s_guest_id not exist)
            response.cookies.set({ name: 's_guest_id', value: '', ...cookieAuthDeleteOptions, })
        }
        if (!serviceUserCookie || !serviceAccessTokenCookie) {
            // Set cookies (Make sure s_user_id and s_access_token exist)
            response.cookies.set({ name: 's_user_id', value: data.session.user.id, ...cookieServiceOptions })
            response.cookies.set({ name: 's_access_token', value: data.session.access_token, ...cookieServiceOptions })
        } else {
            if (serviceUserCookie !== data.session.user.id) {
                // Set cookies (Make sure s_user_id match to valid user id)
                response.cookies.set({ name: 's_user_id', value: data.session.user.id, ...cookieServiceOptions })
            }
            if (serviceAccessTokenCookie !== data.session.access_token) {
                // Set cookies (Make sure s_access_token match to valid access token)
                response.cookies.set({ name: 's_access_token', value: data.session.access_token, ...cookieServiceOptions })
            }
        }
    }

    if (pathname.startsWith('/users')) {
        // This block run when session (secure auth token) are valid or receiving new session ...
        // ... but user trying to access '/users'
        // Handle : redirect user to '/dashboard'
        const dashboardUrl = new URL("/dashboard", request.url);
        response = NextResponse.redirect(dashboardUrl);
    }

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*', '/users/:path*'],
}
