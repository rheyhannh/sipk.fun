// #region NEXT DEPEDENCY
import { NextResponse, NextRequest } from 'next/server';
// #endregion

// #region SUPABASE DEPEDENCY
import { createServerClient } from '@supabase/ssr';
// #endregion

// #region UTIL DEPEDENCY
import {
    encryptAES,
    decryptAES,
    getCookieOptions
} from '@/utils/server_side';
import isUUID from 'validator/lib/isUUID';
// #endregion

/**
 * @param {NextRequest} request
 */
export default async function middleware(request) {
    const cookieAuthOptions = await getCookieOptions('auth', 'set');
    const cookieAuthDeleteOptions = await getCookieOptions('auth', 'remove');
    const cookieServiceOptions = await getCookieOptions('service', 'set');
    const secureAuthSessionToken = request.cookies.get(`${process.env.USER_SESSION_COOKIES_NAME}`)?.value;
    const serviceUserCookie = request.cookies.get('s_user_id')?.value;
    const serviceAccessTokenCookie = request.cookies.get('s_access_token')?.value;
    const serviceGuestCookie = request.cookies.get('s_guest_id')?.value;
    const { pathname, searchParams } = request.nextUrl;

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
            if (!serviceGuestCookie || !isUUID(serviceGuestCookie)) { response.cookies.set({ name: 's_guest_id', value: crypto.randomUUID(), ...cookieServiceOptions }) }
            return response
        }
        if (pathname.startsWith('/magiclink')) {
            const allowedActions = ['login', 'confirm'];
            const action = request.nextUrl.searchParams.get('action');
            const token = request.nextUrl.searchParams.get('token');
            if (!serviceGuestCookie || !isUUID(serviceGuestCookie)) { response.cookies.set({ name: 's_guest_id', value: crypto.randomUUID(), ...cookieServiceOptions }) }
            if (!action || !token || !allowedActions.includes(action)) {
                loginUrl.searchParams.set('action', 'login');
                loginUrl.searchParams.set('type', 'email');
                loginUrl.searchParams.set('error', 'ilink');
                response = NextResponse.redirect(loginUrl);
            }
            return response
        }

        loginUrl.searchParams.set('action', 'login');
        loginUrl.searchParams.set('error', 'esession');
        if (pathname === '/dashboard') { loginUrl.searchParams.set('from', 'dashboard') }
        if (pathname === '/dashboard/matakuliah') { loginUrl.searchParams.set('from', 'matakuliah') }
        response = NextResponse.redirect(loginUrl);
        return response;
    }

    const supabase = createServerClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
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
            if (pathname === '/dashboard') { loginUrl.searchParams.set('from', 'dashboard') }
            if (pathname === '/dashboard/matakuliah') { loginUrl.searchParams.set('from', 'matakuliah') }
            response = NextResponse.redirect(loginUrl);
        }

        if (pathname.startsWith('/magiclink')) {
            const allowedActions = ['login', 'confirm'];
            const action = request.nextUrl.searchParams.get('action');
            const token = request.nextUrl.searchParams.get('token');
            if (!action || !token || !allowedActions.includes(action)) {
                loginUrl.searchParams.set('action', 'login');
                loginUrl.searchParams.set('type', 'email');
                loginUrl.searchParams.set('error', 'ilink');
                response = NextResponse.redirect(loginUrl);
            }
        }

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

        if (pathname.startsWith('/users') || pathname.startsWith('/magiclink')) {
            // This block run when session (secure auth token) are valid or receiving new session ...
            // ... but user trying to access '/users' or '/magiclink'
            // Handle : redirect user to '/dashboard'
            const fromParams = searchParams.get('from');
            var redirectPathname = '/dashboard';

            if (fromParams && ['matakuliah'].includes(fromParams)) {
                redirectPathname = '/dashboard/' + fromParams;
            }

            const dashboardUrl = new URL(redirectPathname, request.url);
            response = NextResponse.redirect(dashboardUrl);
        }
    }

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*', '/users/:path*', '/magiclink/:path*'],
}