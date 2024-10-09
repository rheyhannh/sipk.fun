// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { APIResponseErrorProps } from '@/constant/api_response';
// #endregion

// #region NEXT DEPEDENCY
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
// #endregion

// #region UTIL DEPEDENCY
import {
    rateLimit,
    getRequestDetails,
    getCookieOptions,
} from '@/utils/server_side';
import {
    BadRequestErrorResponse as badRequestError,
    AuthErrorResponse as authError,
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

const routeMethods = ['GET'];
const limitRequest = parseInt(process.env.API_AUTH_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_AUTH_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_AUTH_MAX_TOKEN_PERINTERVAL),
})

const cookieServiceOptions = await getCookieOptions('service', 'set');

/**
 * Route Handler untuk `GET` `'/api/auth/confirm/login'`
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
                    functionDetails: 'GET /api/auth/confirm/login line 62',
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
                    functionDetails: 'GET /api/auth/confirm/login line 78',
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
            return NextResponse.redirect(dashboardUrl);
        }

        /** @type {SupabaseTypes._auth_verifyOtp} */
        const { data, error } = await supabase.auth.verifyOtp({ type, token_hash })

        if (error) {
            throw authError.invalid_hash_token(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: "Supabase error occurred, see details in 'more'",
                    stack: null,
                    functionDetails: 'supabase.auth at GET /api/auth/confirm/login line 101',
                    functionArgs: { verifyOtp: { token_hash, type } },
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

        return new Response(null, { status: 204, headers: responseHeaders })
    } catch (/** @type {APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return NextResponse.json(body, { status, headers: responseHeaders })
    }
}