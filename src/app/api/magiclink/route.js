// #region TYPE DEPEDENCY
import { LoginMagiclinkFormData } from '@/types/form_data';
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
    checkRateLimit,
    parseFormData,
    validateFormData,
    handleErrorResponse,
    supabaseServerClient as supabase,
} from '@/utils/api_helper';
// #endregion

const routeMethods = ['POST'];
const limitRequest = parseInt(process.env.API_MAGICLINK_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_MAGICLINK_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_MAGICLINK_MAX_TOKEN_PERINTERVAL),
})

/**
 * Route Handler untuk `POST` `'/api/magiclink'`
 * @param {NextRequest} request
 */
export async function POST(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    try {
        await checkRateLimit(limiter, limitRequest).then(x => {
            const { currentUsage, currentTtl, currentSize, rateLimitHeaders } = x;
            Object.assign(responseHeaders, rateLimitHeaders);
            Object.assign(ratelimitLog, { currentUsage, currentTtl, currentSize })
        })

        /** @type {LoginMagiclinkFormData} */
        var formData = await parseFormData(request);

        await validateFormData(formData, 'magiclink');

        const { error } = await supabase.auth.signInWithOtp({
            email: formData.email,
            options: {
                captchaToken: formData?.token,
                shouldCreateUser: false
            }
        })

        if (error) {
            throw serverError.interval_server_error(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: "Supabase error occurred, see details in 'more'",
                    stack: null,
                    functionDetails: 'supabase.auth at POST /api/magiclink line 59',
                    functionArgs: { signInWithOtp: { options: { captchaToken: formData?.token, shouldCreateUser: false } } },
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        return new Response(null, { status: 204, headers: responseHeaders })
    } catch (/** @type {APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return NextResponse.json(body, { status, headers: responseHeaders })
    }
}