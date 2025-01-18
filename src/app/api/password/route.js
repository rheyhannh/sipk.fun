// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region NEXT DEPEDENCY
import { NextResponse, NextRequest } from 'next/server';
// #endregion

// #region UTIL DEPEDENCY
import cors, { DEFAULT_CORS_OPTIONS } from '@/lib/cors';
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
    parseFormData,
    validateFormData,
    handleErrorResponse,
    supabaseServerClient as supabase,
} from '@/utils/api_helper';
// #endregion

/** 
 * Array of string berisikan method yang tersedia pada route `'/api/password'`
*/
const routeMethods = ['PATCH'];

/** 
 * Opsi `CORS` yang digunakan pada route `'/api/password'`
 * 
 * @see {@link DEFAULT_CORS_OPTIONS Default}
*/
const routeCorsOptions = /** @type {import('@/lib/cors').CorsOptions} */ ({
    methods: routeMethods,
} ?? DEFAULT_CORS_OPTIONS
);

const limitRequest = parseInt(process.env.API_PASSWORD_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_PASSWORD_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_PASSWORD_MAX_TOKEN_PERINTERVAL),
})

/**
 * Route Handler untuk `OPTIONS` `'/api/password'`
 * @param {NextRequest} request
 */
export async function OPTIONS(request) {
    return cors(request, new Response(null, { status: 204 }), routeCorsOptions);
}

/**
 * Route Handler untuk `PATCH` `'/api/password'`
 * @param {NextRequest} request
 */
export async function PATCH(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    const defaultUserErrorMessage = 'Gagal memperbarui password';

    try {
        const isService = await verifyService(request);
        if (isService) {
            throw serverError.request_not_supported(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: 'No service handler for update user password',
                    stack: null,
                    functionDetails: 'PATCH /api/password line 56',
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

        var formData = /** @type {import('@/types/form_data').PasswordFormData} */ (
            await parseFormData(request)
        );

        await validateFormData(formData, 'password');

        /** @type {SupabaseTypes._auth_updateUser} */
        const { data, error } = await supabase.auth.updateUser({ password: formData.password })
        if (error) {
            const isSamePasswordError = error?.code === 'same_password';
            throw serverError.interval_server_error(
                isSamePasswordError ? 'Password harus berbeda dari sebelumnya' : defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to update password',
                    stack: null,
                    functionDetails: 'supabase.from at PATCH /api/password line 85',
                    functionArgs: { updateUser: true, updateUserPassword: true },
                    functionResolvedVariable: { data, error },
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