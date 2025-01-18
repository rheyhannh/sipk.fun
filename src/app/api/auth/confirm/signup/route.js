// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region NEXT DEPEDENCY
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
// #endregion

// #region UTIL DEPEDENCY
import cors, { DEFAULT_CORS_OPTIONS } from '@/lib/cors';
import {
    rateLimit,
    getRequestDetails,
    getCookieOptions,
} from '@/utils/server_side';
import {
    BadRequestErrorResponse as badRequestError,
    AuthErrorResponse as authError,
    NotFoundErrorResponse as notFoundError,
    ServerErrorResponse as serverError,
} from '@/constant/api_response';
// #endregion

// #region API HELPER DEPEDENCY
import {
    getLogAttributes,
    checkRateLimit,
    handleErrorResponse,
    supabaseServerClient as supabase,
} from '@/utils/api_helper';
// #endregion

/** 
 * Array of string berisikan method yang tersedia pada route `'/api/auth/confirm/signup'`
*/
const routeMethods = ['GET'];

/** 
 * Opsi `CORS` yang digunakan pada route `'/api/auth/confirm/signup'`
 * 
 * @see {@link DEFAULT_CORS_OPTIONS Default}
*/
const routeCorsOptions = /** @type {import('@/lib/cors').CorsOptions} */ ({
    methods: routeMethods,
} ?? DEFAULT_CORS_OPTIONS
);

const limitRequest = parseInt(process.env.API_AUTH_CONFIRM_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_AUTH_CONFIRM_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_AUTH_CONFIRM_MAX_TOKEN_PERINTERVAL),
})

const cookieServiceOptions = await getCookieOptions('service', 'set');

/**
 * Route Handler untuk `OPTIONS` `'/api/auth/confirm/signup'`
 * @param {NextRequest} request
 */
export async function OPTIONS(request) {
    return cors(request, new Response(null, { status: 204 }), routeCorsOptions);
}

/**
 * Route Handler untuk `GET` `'/api/auth/confirm/signup'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    const searchParams = request.nextUrl.searchParams;
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    try {
        await checkRateLimit(limiter, limitRequest).then(x => {
            const { currentUsage, currentTtl, currentSize, rateLimitHeaders } = x;
            Object.assign(responseHeaders, rateLimitHeaders);
            Object.assign(ratelimitLog, { currentUsage, currentTtl, currentSize })
        })

        if (!token_hash || !type) {
            throw badRequestError.malformed_request_params(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: "Param 'token_hash' and 'type' expected exist",
                    stack: null,
                    functionDetails: 'GET /api/auth/confirm/signup line 64',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        if (type !== 'email') {
            throw badRequestError.malformed_request_params(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: "Param 'type' only accept 'email'",
                    stack: null,
                    functionDetails: 'GET /api/auth/confirm/signup line 80',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        const cookieStore = cookies();
        const dashboardUrl = new URL("/dashboard", request.url);

        if (cookieStore.has(process.env.USER_SESSION_COOKIES_NAME)) {
            return cors(request, NextResponse.redirect(dashboardUrl), routeCorsOptions);
        }

        /** @type {SupabaseTypes._auth_verifyOtp} */
        var { data, error } = await supabase.auth.verifyOtp({ type, token_hash })

        if (error) {
            throw authError.invalid_hash_token(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: "Supabase error occurred, see details in 'more'",
                    stack: null,
                    functionDetails: 'supabase.auth.verifyOtp at GET /api/auth/confirm/signup line 103',
                    functionArgs: { token_hash, type },
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        if (data?.session) {
            cookieStore.set({ name: 's_user_id', value: data.session.user.id, ...cookieServiceOptions });
            cookieStore.set({ name: 's_access_token', value: data.session.access_token, ...cookieServiceOptions });
        }

        if (!data?.session?.user?.id) {
            throw notFoundError.resource_not_found(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to update user data when confirming signup, user id not exist',
                    stack: null,
                    functionDetails: 'GET /api/auth/confirm/signup line 127',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        const dateNow = new Date();
        var { error } = await supabase.from('user').update({ is_email_confirmed: true, email_confirmed_at: dateNow }).eq('id', data.session.user.id);

        if (error) {
            throw serverError.interval_server_error(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: "Supabase error occurred, see details in 'more'",
                    stack: null,
                    functionDetails: 'supabase.from at GET /api/auth/confirm/signup line 143',
                    functionArgs: { from: 'user', update: { is_email_confirmed: true, email_confirmed_at: dateNow }, eq: { id: data.session.user.id } },
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        return cors(request, new Response(null, { status: 204, headers: responseHeaders }), routeCorsOptions);
    } catch (/** @type {import('@/constant/api_response').APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return cors(request, NextResponse.json(body, { status, headers: responseHeaders }), routeCorsOptions);
    }
}