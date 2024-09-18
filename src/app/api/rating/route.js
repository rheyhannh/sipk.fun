// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { RatingFormData } from '@/types/form_data';
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
    BadRequestErrorResponse as badRequestError,
    NotFoundErrorResponse as notFoundError,
    ConflictErrorResponse as conflictError,
    ServerErrorResponse as serverError,
} from '@/constant/api_response';
import isUUID from 'validator/lib/isUUID';
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
    handleSupabaseError,
    supabaseServerClient as supabase,
    supabaseServiceClient as supabaseService,
} from '@/utils/api_helper';
// #endregion

const limitRequest = parseInt(process.env.API_RATING_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_RATING_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_RATING_MAX_TOKEN_PERINTERVAL),
})

/**
 * Route Handler untuk `GET` `'/api/rating'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    try {
        const isService = await verifyService(request);
        if (isService) {
            /** @type {SupabaseTypes._from<SupabaseTypes.RatingData>} */
            const { data, error } = await supabaseService.from('rating').select('*');
            if (error) {
                const { code, headers = {}, _details, ...rest } = await handleSupabaseError(error, false, {
                    functionDetails: 'supabaseService.from at GET /api/rating line 58',
                    functionArgs: { from: 'rating', select: '*' },
                    functionResolvedVariable: { data, error },
                });

                const body = { ...rest, _details: { ..._details, request: { info: requestLog, ..._details.request } } }
                return NextResponse.json(body, { status: code, headers });
            }

            return NextResponse.json(data, { status: 200 })
        }

        await checkRateLimit(limiter, limitRequest).then(x => {
            const { currentUsage, currentTtl, currentSize, rateLimitHeaders } = x;
            Object.assign(responseHeaders, rateLimitHeaders);
            Object.assign(ratelimitLog, { currentUsage, currentTtl, currentSize })
        })

        const { decryptedSession, decodedAccessToken } = await verifyAuth();

        /** @type {SupabaseTypes._from<SupabaseTypes.RatingData>} */
        const { data, error } = await supabase.from('rating').select('*');
        if (error) {
            await handleSupabaseError(error, true, {
                functionDetails: 'supabase.from at GET /api/rating line 82',
                functionArgs: { from: 'rating', select: '*' },
                functionResolvedVariable: { data, error },
            })
        }

        return NextResponse.json(data, { status: 200, headers: responseHeaders });
    } catch (/** @type {APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return NextResponse.json(body, { status, headers: responseHeaders })
    }
}

/**
 * Route Handler untuk `POST` `'/api/rating'`
 * @param {NextRequest} request
 */
export async function POST(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    const defaultUserErrorMessage = 'Gagal menambah rating';
    const unallowedWords = ['http', 'https', 'www'];
    const unallowedSymbols = ['<', '>', '&', '/', `'`, `"`];

    try {
        const isService = await verifyService(request);
        if (isService) {
            throw serverError.request_not_supported(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: 'No service handler for add rating',
                    stack: null,
                    functionDetails: 'POST /api/rating line 115',
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
        const userId = decryptedSession?.user?.id ?? decodedAccessToken?.sub;

        /** @type {RatingFormData} */
        var formData = await parseFormData(request);

        await validateFormData(formData, 'rating');

        if (unallowedWords.some(word => formData.review.includes(word))) {
            throw badRequestError.invalid_form_data(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: "Rating message 'review' contain some of 'unallowedWords'",
                    stack: null,
                    functionDetails: 'POST /api/rating line 145',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: { unallowedWords },
                }
            )
        }

        if (unallowedSymbols.some(symbol => formData.review.includes(symbol))) {
            throw badRequestError.invalid_form_data(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: "Rating message 'review' contain some of 'unallowedSymbols'",
                    stack: null,
                    functionDetails: 'POST /api/rating line 161',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: { unallowedSymbols },
                }
            )
        }

        const userUniversitas = decryptedSession?.user?.user_metadata?.university ?? decodedAccessToken?.user_metadata?.university;
        if (!userUniversitas) {
            throw notFoundError.resource_not_found(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to add user rating, cant resolve user universitas',
                    stack: null,
                    functionDetails: 'POST /api/rating line 147',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: { userUniversitas },
                }
            )
        }

        formData.details.universitas = userUniversitas;

        /** @type {SupabaseTypes._from<SupabaseTypes.RatingData} */
        var { data, error } = await supabase.from('rating').select('*');
        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to add user rating, cant resolve user rating',
                    stack: null,
                    functionDetails: 'supabase.from at POST /api/rating line 177',
                    functionArgs: { from: 'rating', select: '*' },
                    functionResolvedVariable: { data, error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }
        if (data.length) {
            throw conflictError.resource_already_exist(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to add user rating, user rating already exist',
                    stack: null,
                    functionDetails: 'supabase.from at POST /api/rating line 177',
                    functionArgs: { from: 'rating', select: '*' },
                    functionResolvedVariable: { data, error },
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        const unixNow = Math.floor(Date.now() / 1000);

        /** @type {SupabaseTypes._from<SupabaseTypes.RatingData} */
        var { data, error } = await supabase.from('rating').insert({ ...formData, owned_by: userId, unix_created_at: unixNow }).select();
        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to add user rating',
                    stack: null,
                    functionDetails: 'supabase.from at POST /api/rating line 212',
                    functionArgs: { from: 'rating', insert: { ...formData, owned_by: userId, unix_created_at: unixNow }, select: true },
                    functionResolvedVariable: { data, error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        return NextResponse.json({ rating: data[0] }, { status: 200, headers: responseHeaders })
    } catch (/** @type {APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return NextResponse.json(body, { status, headers: responseHeaders })
    }
}

/**
 * Route Handler untuk `PATCH` `'/api/rating'`
 * @param {NextRequest} request
 */
export async function PATCH(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    const defaultUserErrorMessage = 'Gagal memperbarui rating';
    const unallowedWords = ['http', 'https', 'www'];
    const unallowedSymbols = ['<', '>', '&', '/', `'`, `"`];
    const searchParams = request.nextUrl.searchParams;
    const ratingId = searchParams.get('id');

    try {
        const isService = await verifyService(request);
        if (isService) {
            throw serverError.request_not_supported(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: 'No service handler for update user rating',
                    stack: null,
                    functionDetails: 'PATCH /api/rating line 255',
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

        if (!ratingId || typeof ratingId !== 'string' || !isUUID(ratingId)) {
            throw badRequestError.malformed_request_params(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: "Request param 'id' expected exist and typed as string and UUID format",
                    stack: null,
                    functionDetails: 'PATCH /api/rating line 277',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        const { decryptedSession, decodedAccessToken } = await verifyAuth();

        /** @type {RatingFormData} */
        var formData = await parseFormData(request);

        await validateFormData(formData, 'rating');

        if (unallowedWords.some(word => formData.review.includes(word))) {
            throw badRequestError.invalid_form_data(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: "Rating message 'review' contain some of 'unallowedWords'",
                    stack: null,
                    functionDetails: 'PATCH /api/rating line 300',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: { unallowedWords },
                }
            )
        }

        if (unallowedSymbols.some(symbol => formData.review.includes(symbol))) {
            throw badRequestError.invalid_form_data(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: "Rating message 'review' contain some of 'unallowedSymbols'",
                    stack: null,
                    functionDetails: 'PATCH /api/rating line 316',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: { unallowedSymbols },
                }
            )
        }

        const userUniversitas = decryptedSession?.user?.user_metadata?.university ?? decodedAccessToken?.user_metadata?.university;
        if (!userUniversitas) {
            throw notFoundError.resource_not_found(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to edit user rating, cant resolve user universitas',
                    stack: null,
                    functionDetails: 'PATCH /api/rating line 353',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: { userUniversitas },
                }
            )
        }

        formData.details.universitas = userUniversitas;

        const unixNow = Math.floor(Date.now() / 1000);

        /** @type {SupabaseTypes._from<SupabaseTypes.RatingData>} */
        const { data, error } = await supabase.from('rating').update({ rating: formData.rating, review: formData.review, unix_updated_at: unixNow, details: formData.details }).eq('id', ratingId).select();
        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to update user rating',
                    stack: null,
                    functionDetails: 'supabase.from at PATCH /api/rating line 334',
                    functionArgs: { from: 'rating', update: { rating: formData.rating, review: formData.review, unix_updated_at: unixNow, details: formData.details }, eq: { id: ratingId }, select: true },
                    functionResolvedVariable: { data, error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        return NextResponse.json({ rating: data[0] }, { status: 200, headers: responseHeaders })
    } catch (/** @type {APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return NextResponse.json(body, { status, headers: responseHeaders })
    }
}