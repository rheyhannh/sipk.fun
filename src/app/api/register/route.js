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
    NotFoundErrorResponse as notFoundError,
    ServerErrorResponse as serverError,
} from '@/constant/api_response';
import Joi from 'joi';
// #endregion

// #region API HELPER DEPEDENCY
import {
    getLogAttributes,
    checkRateLimit,
    parseFormData,
    validateFormData,
    handleErrorResponse,
    supabaseServerClient as supabase,
    supabaseServiceClient as supabaseService,
} from '@/utils/api_helper';
// #endregion

/** 
 * Array of string berisikan method yang tersedia pada route `'/api/register'`
*/
const routeMethods = ['POST'];

/** 
 * Opsi `CORS` yang digunakan pada route `'/api/register'`
 * 
 * @see {@link DEFAULT_CORS_OPTIONS Default}
*/
const routeCorsOptions = /** @type {import('@/lib/cors').CorsOptions} */ ({
    methods: routeMethods,
} ?? DEFAULT_CORS_OPTIONS
);

const limitRequest = parseInt(process.env.API_REGISTER_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_REGISTER_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_REGISTER_MAX_TOKEN_PERINTERVAL),
})

/**
 * Route Handler untuk `OPTIONS` `'/api/register'`
 * @param {NextRequest} request
 */
export async function OPTIONS(request) {
    return cors(request, new Response(null, { status: 204 }), routeCorsOptions);
}

/**
 * Route Handler untuk `POST` `'/api/register'`
 * @param {NextRequest} request
 */
export async function POST(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    const maximumRegisteredUser = parseInt(process.env.MAXIMUM_REGISTERED_USER);
    const defaultUserErrorMessage = 'Gagal memproses pendaftaran';

    try {
        await checkRateLimit(limiter, limitRequest).then(x => {
            const { currentUsage, currentTtl, currentSize, rateLimitHeaders } = x;
            Object.assign(responseHeaders, rateLimitHeaders);
            Object.assign(ratelimitLog, { currentUsage, currentTtl, currentSize })
        })

        /** @type {SupabaseTypes._from<SupabaseTypes.UserData>} */
        var { data: users, error } = await supabaseService.from('user').select('*');
        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to register user, cant resolve users length',
                    stack: null,
                    functionDetails: 'supabase.from at POST /api/register line 62',
                    functionArgs: { from: 'me', select: '*' },
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }
        if (users.length >= maximumRegisteredUser) {
            throw serverError.user_registration_closed(
                undefined, undefined,
                {
                    severity: 'warning',
                    reason: 'Failed to register user, number of users is full',
                    stack: null,
                    functionDetails: 'POST /api/register line 79',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        var formData = /** @type {import('@/types/form_data').RegisterFormData} */ (
            await parseFormData(request)
        );

        /** @type {SupabaseTypes._from<SupabaseTypes.UniversitasData} */
        var { data: universitas, error } = await supabaseService.from('universitas').select('*').order('id', { ascending: true });
        if (!universitas.length) {
            throw notFoundError.resource_not_found(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to register user, cant resolve available universitas',
                    stack: null,
                    functionDetails: 'supabase.from at POST /api/register line 100',
                    functionArgs: { from: 'universitas', select: '*', orderColumn: 'id', orderOptions: { ascending: true } },
                    functionResolvedVariable: { universitas },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }
        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to regsiter user, cant resolve available universitas',
                    stack: null,
                    functionDetails: 'supabase.from at POST /api/register line 98',
                    functionArgs: { from: 'universitas', select: '*', orderColumn: 'id', orderOptions: { ascending: true } },
                    functionResolvedVariable: { universitas },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        const formDataSchema = Joi.object(
            /** @type {import('@/types/form_data').RegisterFormData} */
            ({
                email: Joi.string().min(6).max(100).email().required(),
                password: Joi.string().min(6).max(50).required(),
                fullname: Joi.string().pattern(/^[A-Za-z\s]*$/, 'alpha only').pattern(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'one space each word').min(6).max(50),
                university_id: Joi.number().min(0).max(universitas.length).required(),
                token: process.env.NODE_ENV !== 'production' ? Joi.string() : Joi.string().required(),
            }));

        await validateFormData(formData, null, formDataSchema);

        const userUniversitasName = universitas.find(item => item.id === formData.university_id)?.nama;

        if (!userUniversitasName) {
            throw notFoundError.resource_not_found(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to register user, cant resolve universitas name',
                    stack: null,
                    functionDetails: 'POST /api/register line 143',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        formData.university = userUniversitasName;

        /** @type {SupabaseTypes._auth_signUp} */
        var { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    fullname: formData.fullname,
                    university: formData.university,
                    university_id: formData.university_id,
                },
                captchaToken: formData.token,
            }
        })

        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: "Failed to register user, supabase error occurred, see details in 'more'",
                    stack: null,
                    functionDetails: 'supabase.auth.signUp at POST /api/register line 175',
                    functionArgs: { formData },
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