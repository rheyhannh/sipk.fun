// #region TYPE DEPEDENCY
import { APIResponseErrorProps } from '@/constant/api_response';
// #endregion

// #region NEXT DEPEDENCY
import { NextResponse, NextRequest } from 'next/server';
// #endregion

// #region UTIL DEPEDENCY
import {
    rateLimit,
    getRequestDetails,
} from '@/utils/server_side';
import {
    ServerErrorResponse as serverError,
} from '@/constant/api_response';
// #endregion

// #region API HELPER DEPEDENCY
import {
    getLogAttributes,
    verifyService,
    checkRateLimit,
    verifyAuth,
    handleErrorResponse,
    supabaseServerClient as supabase,
} from '@/utils/api_helper';
// #endregion

const limitRequest = parseInt(process.env.API_LOGOUT_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_LOGOUT_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_LOGOUT_MAX_TOKEN_PERINTERVAL),
})

/**
 * Route Handler untuk `POST` `'/api/logout'`
 * @param {NextRequest} request
 */
export async function POST(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    const defaultUserErrorMessage = 'Gagal memproses logout';

    try {
        const isService = await verifyService(request);
        if (isService) {
            throw serverError.request_not_supported(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: 'No service handler for processing logout',
                    stack: null,
                    functionDetails: 'POST /api/logout line 50',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        await checkRateLimit(limiter, limitRequest).then(x => {
            const { currentUsage, currentTtl, currentSize, rateLimitHeaders } = x;
            Object.assign(responseHeaders, rateLimitHeaders);
            Object.assign(ratelimitLog, { currentUsage, currentTtl, currentSize })
        })

        const { decryptedSession, decodedAccessToken } = await verifyAuth();

        const { error } = await supabase.auth.signOut();
        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to processing logout',
                    stack: null,
                    functionDetails: 'supabase.from at POST /api/logout line 73',
                    functionArgs: { auth: true, signOut: true },
                    functionResolvedVariable: { error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        return new Response(null, { status: 204 });
    } catch (/** @type {APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return NextResponse.json(body, { status, headers: responseHeaders })
    }
}