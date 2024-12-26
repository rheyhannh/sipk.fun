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
    AuthErrorResponse as authError,
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
const limitRequest = parseInt(process.env.API_LOGIN_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_LOGIN_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_LOGIN_MAX_TOKEN_PERINTERVAL),
})

const cookieServiceOptions = await getCookieOptions('service', 'set');

/**
 * Route Handler untuk `POST` `'/api/login'`
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

        var formData = /** @type {import('@/types/form_data').LoginFormData} */ (
            await parseFormData(request)
        );
        await validateFormData(formData, 'login');

        /** @type {import('@/types/supabase')._auth_signInWithPassword} */
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
            options: {
                captchaToken: formData?.token
            }
        });

        if (error) {
            throw authError.invalid_login_credentials(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: "Supabase error occurred, see details in 'more'",
                    stack: null,
                    functionDetails: 'supabase.auth.signInWithPassword at POST /api/login line 64',
                    functionArgs: { options: { captchaToken: formData?.token } },
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        const cookieStore = cookies();

        if (data.session) {
            cookieStore.set({ name: 's_user_id', value: data.session.user.id, ...cookieServiceOptions });
            cookieStore.set({ name: 's_access_token', value: data.session.access_token, ...cookieServiceOptions });
        }

        return new Response(null, { status: 204, headers: responseHeaders });
    } catch (/** @type {import('@/constant/api_response').APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return NextResponse.json(body, { status, headers: responseHeaders })
    }
}