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
    getSipkCookies,
} from '@/utils/server_side';
import {
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

/** 
 * Array of string berisikan method yang tersedia pada route `'/api/auth/check'`
*/
const routeMethods = ['GET'];

/** 
 * Opsi `CORS` yang digunakan pada route `'/api/auth/check'`
 * 
 * @see {@link DEFAULT_CORS_OPTIONS Default}
*/
const routeCorsOptions = /** @type {import('@/lib/cors').CorsOptions} */ ({
    methods: routeMethods,
} ?? DEFAULT_CORS_OPTIONS
);

const limitRequest = parseInt(process.env.API_AUTH_CHECK_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_AUTH_CHECK_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_AUTH_CHECK_MAX_TOKEN_PERINTERVAL),
})

const cookieServiceOptions = await getCookieOptions('service', 'set');

/**
 * Route Handler untuk `OPTIONS` `'/api/auth/check'`
 * @param {NextRequest} request
 */
export async function OPTIONS(request) {
    return cors(request, new Response(null, { status: 204 }), routeCorsOptions);
}

/**
 * Route Handler untuk `GET` `'/api/auth/check'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    try {
        await checkRateLimit(limiter, limitRequest).then(x => {
            const { currentUsage, currentTtl, currentSize, rateLimitHeaders } = x;
            Object.assign(responseHeaders, rateLimitHeaders);
            Object.assign(ratelimitLog, { currentUsage, currentTtl, currentSize })
        })

        const {
            secureSessionCookie,
            serviceUserIdCookie,
            serviceAccessTokenCookie
        } = await getSipkCookies(request);

        if (!secureSessionCookie) {
            throw authError.missing_session(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: null,
                    stack: null,
                    functionDetails: 'GET /api/auth/check line 64',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        /** @type {SupabaseTypes._auth_getSession} */
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            throw authError.invalid_session(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: "Supabase error occurred, see details in 'more'",
                    stack: null,
                    functionDetails: 'supabase.auth.getSession at GET /api/auth/check line 83',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        const cookieStore = cookies();

        if (data?.session) {
            if (!serviceUserIdCookie || serviceUserIdCookie !== data.session.user.id) { cookieStore.set({ name: 's_user_id', value: data.session.user.id, ...cookieServiceOptions }) }
            if (!serviceAccessTokenCookie || serviceAccessTokenCookie !== data.session.access_token) { cookieStore.set({ name: 's_access_token', value: data.session.access_token, ...cookieServiceOptions }) }
        }
        return cors(request, new Response(null, { status: 204, headers: responseHeaders }), routeCorsOptions);
    } catch (/** @type {import('@/constant/api_response').APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return cors(request, NextResponse.json(body, { status, headers: responseHeaders }), routeCorsOptions);
    }
}