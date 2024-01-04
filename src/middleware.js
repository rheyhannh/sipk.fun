// ========== NEXT DEPEDENCY ========== //
import { NextResponse } from 'next/server'

// ========== COMPONENT DEPEDENCY ========== //
import { createServerClient } from '@supabase/ssr'
import {
    encryptAES,
    decryptAES,
} from '@/utils/server_side';
import isUUID from 'validator/lib/isUUID';

/*
============================== CODE START HERE ==============================
*/
const cookieAuthOptions = { secure: true, httpOnly: true, maxAge: 2592000, sameSite: 'lax' };
const cookieAuthDeleteOptions = { secure: true, httpOnly: true, maxAge: -2592000, sameSite: 'lax' };
const cookieServiceOptions = { secure: false, httpOnly: false, maxAge: 2592000, sameSite: 'lax' };

export default async function middleware(request) {
    const secureAuthSessionToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;
    const serviceUserCookie = request.cookies.get('s_user_id')?.value;
    const serviceAccessTokenCookie = request.cookies.get('s_access_token')?.value;
    const serviceGuestCookie = request.cookies.get('s_guest_id')?.value;
    const { pathname } = request.nextUrl;

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    if (!secureAuthSessionToken) {
        const loginUrl = new URL("/users", request.url);
        if (serviceUserCookie || serviceAccessTokenCookie) {
            response.cookies.set({ name: 's_user_id', value: '', ...cookieAuthDeleteOptions });
            response.cookies.set({ name: 's_access_token', value: '', ...cookieAuthDeleteOptions });
        }
        if (pathname.startsWith('/users')) {
            if (!serviceGuestCookie || !isUUID(serviceGuestCookie) ) { response.cookies.set({ name: 's_guest_id', value: crypto.randomUUID(), ...cookieServiceOptions }) }
            return response
        }
        loginUrl.searchParams.set('action', 'login');
        loginUrl.searchParams.set('error', 'esession');
        response = NextResponse.redirect(loginUrl);
        return response;
    }

    const supabase = createServerClient(
        process.env.SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                async get(name) {
                    const decryptedSession = await decryptAES(secureAuthSessionToken) || 'removeMe';
                    return decryptedSession;
                },
                async set(name, value, options) {
                    const encryptedSession = await encryptAES(value);
                    if (encryptedSession) {
                        response.cookies.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: encryptedSession, ...cookieAuthOptions })
                    } else {
                        response.cookies.set({ name: process.env.USER_SESSION_COOKIES_NAME, value: value, ...cookieAuthOptions })
                    }
                },
            },
        }
    )

    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
        // This block run when session (secure auth token) are invalid [1].
        // Handle : redirect user to '/users?action=login'
        const loginUrl = new URL("/users", request.url);
        loginUrl.searchParams.set('action', 'login');
        if (pathname.startsWith('/dashboard')) {
            // This block run when [1] and user try access '/dashboard/*'
            // Handle : redirect user to '/users?action=login&error=isession'
            loginUrl.searchParams.set('error', 'isession');
        }
        response = NextResponse.redirect(loginUrl);
        
        // Reset sensitive cookies
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
