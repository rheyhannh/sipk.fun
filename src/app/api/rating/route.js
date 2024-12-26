// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
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
                    functionDetails: 'supabaseService.from at GET /api/rating line 59',
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
                functionDetails: 'supabase.from at GET /api/rating line 83',
                functionArgs: { from: 'rating', select: '*' },
                functionResolvedVariable: { data, error },
            })
        }

        return NextResponse.json(data, { status: 200, headers: responseHeaders });
    } catch (/** @type {import('@/constant/api_response').APIResponseErrorProps} */ error) {
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
                    functionDetails: 'POST /api/rating line 116',
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

        var formData = /** @type {import('@/types/form_data').RatingFormData} */ (
            await parseFormData(request)
        );

        await validateFormData(formData, 'rating');

        if (unallowedWords.some(word => formData.review.includes(word))) {
            throw badRequestError.invalid_form_data(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: "Rating message 'review' contain some of 'unallowedWords'",
                    stack: null,
                    functionDetails: 'POST /api/rating line 146',
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
                    functionDetails: 'POST /api/rating line 162',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: { unallowedSymbols },
                }
            )
        }

        /*
            @breakingInFuture
            Try to resolve user universitas from session or access token first. 
            This case will not fit in the future when user can change their university.
            But for now, when user cant change their university, it can save a lot requests.
        */
        var userUniversitas = decryptedSession?.user?.user_metadata?.university ?? decodedAccessToken?.user_metadata?.university;
        if (!userUniversitas) {
            /** @type {SupabaseTypes._from<SupabaseTypes.UserData>} */
            const { data, error } = await supabase.from('user').select('*');
            if (error) {
                throw serverError.interval_server_error(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to add user rating, cant resolve user universitas, supabase error occurred',
                        stack: null,
                        functionDetails: 'supabase.from at POST /api/rating line 186',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: null,
                        request: await getRequestDetails(),
                        more: error,
                    }
                )
            }
            if (!data.length || !data[0]?.university) {
                throw notFoundError.resource_not_found(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to add user rating, cant resolve user universitas after querying',
                        stack: null,
                        functionDetails: 'supabase.from at POST /api/rating line 186',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: { data, error },
                        request: await getRequestDetails(),
                        more: null,
                    }
                )
            }

            userUniversitas = data[0].university;
        }

        formData.details.universitas = userUniversitas;

        if (formData.details.authorType === 0) {
            /** @type {SupabaseTypes._from<SupabaseTypes.UserData} */
            const { data, error } = await supabase.from('user').select('*');
            if (!data.length || !data[0]?.fullname) {
                throw notFoundError.resource_not_found(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to add user rating, cant resolve user fullname',
                        stack: null,
                        functionDetails: 'supabase.from at POST /api/rating line 198',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: { data, error },
                        request: await getRequestDetails(),
                        more: null,
                    }
                )
            }
            if (error) {
                throw serverError.interval_server_error(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to add user rating, error when trying to resolve user nickname',
                        stack: null,
                        functionDetails: 'supabase.from at POST /api/rating line 215',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: { data, error },
                        request: await getRequestDetails(),
                        more: error,
                    }
                )
            }

            formData.details.author = data[0].fullname;
        } else if (formData.details.authorType === 1) {
            /** @type {SupabaseTypes._from<SupabaseTypes.UserData} */
            const { data, error } = await supabase.from('user').select('*');
            if (!data.length || !data[0]?.nickname) {
                throw notFoundError.resource_not_found(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to add user rating, cant resolve user nickname',
                        stack: null,
                        functionDetails: 'supabase.from at POST /api/rating line 235',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: { data, error },
                        request: await getRequestDetails(),
                        more: null,
                    }
                )
            }
            if (error) {
                throw serverError.interval_server_error(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to add user rating, error when trying to resolve user nickname',
                        stack: null,
                        functionDetails: 'supabase.from at POST /api/rating line 250',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: { data, error },
                        request: await getRequestDetails(),
                        more: error,
                    }
                )
            }

            formData.details.author = data[0].nickname;
        } else {
            formData.details.author = 'Anonim';
        }

        /** @type {SupabaseTypes._from<SupabaseTypes.RatingData} */
        var { data, error } = await supabase.from('rating').select('*');
        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to add user rating, cant resolve user rating',
                    stack: null,
                    functionDetails: 'supabase.from at POST /api/rating line 271',
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
                    functionDetails: 'supabase.from at POST /api/rating line 288',
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
                    functionDetails: 'supabase.from at POST /api/rating line 308',
                    functionArgs: { from: 'rating', insert: { ...formData, owned_by: userId, unix_created_at: unixNow }, select: true },
                    functionResolvedVariable: { data, error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        return NextResponse.json({ rating: data[0] }, { status: 200, headers: responseHeaders })
    } catch (/** @type {import('@/constant/api_response').APIResponseErrorProps} */ error) {
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
                    functionDetails: 'PATCH /api/rating line 349',
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
                    functionDetails: 'PATCH /api/rating line 371',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        const { decryptedSession, decodedAccessToken } = await verifyAuth();

        var formData = /** @type {import('@/types/form_data').RatingFormData} */ (
            await parseFormData(request)
        );

        await validateFormData(formData, 'rating');

        if (unallowedWords.some(word => formData.review.includes(word))) {
            throw badRequestError.invalid_form_data(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: "Rating message 'review' contain some of 'unallowedWords'",
                    stack: null,
                    functionDetails: 'PATCH /api/rating line 394',
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
                    functionDetails: 'PATCH /api/rating line 410',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: { unallowedSymbols },
                }
            )
        }

        /*
            @breakingInFuture
            Try to resolve user universitas from session or access token first. 
            This case will not fit in the future when user can change their university.
            But for now, when user cant change their university, it can save a lot requests.
        */
        var userUniversitas = decryptedSession?.user?.user_metadata?.university ?? decodedAccessToken?.user_metadata?.university;
        if (!userUniversitas) {
            /** @type {SupabaseTypes._from<SupabaseTypes.UserData>} */
            const { data, error } = await supabase.from('user').select('*');
            if (error) {
                throw serverError.interval_server_error(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to edit user rating, cant resolve user universitas, supabase error occurred',
                        stack: null,
                        functionDetails: 'supabase.from at PATCH /api/rating line 186',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: null,
                        request: await getRequestDetails(),
                        more: error,
                    }
                )
            }
            if (!data.length || !data[0]?.university) {
                throw notFoundError.resource_not_found(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to edit user rating, cant resolve user universitas after querying',
                        stack: null,
                        functionDetails: 'supabase.from at PATCH /api/rating line 186',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: { data, error },
                        request: await getRequestDetails(),
                        more: null,
                    }
                )
            }

            userUniversitas = data[0].university;
        }

        formData.details.universitas = userUniversitas;

        if (formData.details.authorType === 0) {
            /** @type {SupabaseTypes._from<SupabaseTypes.UserData} */
            const { data, error } = await supabase.from('user').select('*');
            if (!data.length || !data[0]?.fullname) {
                throw notFoundError.resource_not_found(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to edit user rating, cant resolve user fullname',
                        stack: null,
                        functionDetails: 'supabase.from at PATCH /api/rating line 448',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: { data, error },
                        request: await getRequestDetails(),
                        more: null,
                    }
                )
            }
            if (error) {
                throw serverError.interval_server_error(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to edit user rating, error when trying to resolve user fullname',
                        stack: null,
                        functionDetails: 'supabase.from at PATCH /api/rating line 463',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: { data, error },
                        request: await getRequestDetails(),
                        more: error,
                    }
                )
            }

            formData.details.author = data[0].fullname;
        } else if (formData.details.authorType === 1) {
            /** @type {SupabaseTypes._from<SupabaseTypes.UserData} */
            const { data, error } = await supabase.from('user').select('*');
            if (!data.length || !data[0]?.nickname) {
                throw notFoundError.resource_not_found(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to edit user rating, cant resolve user nickname',
                        stack: null,
                        functionDetails: 'supabase.from at PATCH /api/rating line 483',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: { data, error },
                        request: await getRequestDetails(),
                        more: null,
                    }
                )
            }
            if (error) {
                throw serverError.interval_server_error(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to edit user rating, error when trying to resolve user nickname',
                        stack: null,
                        functionDetails: 'supabase.from at PATCH /api/rating line 498',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: { data, error },
                        request: await getRequestDetails(),
                        more: error,
                    }
                )
            }

            formData.details.author = data[0].nickname;
        } else {
            formData.details.author = 'Anonim';
        }

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
                    functionDetails: 'supabase.from at PATCH /api/rating line 489',
                    functionArgs: { from: 'rating', update: { rating: formData.rating, review: formData.review, unix_updated_at: unixNow, details: formData.details }, eq: { id: ratingId }, select: true },
                    functionResolvedVariable: { data, error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        return NextResponse.json({ rating: data[0] }, { status: 200, headers: responseHeaders })
    } catch (/** @type {import('@/constant/api_response').APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return NextResponse.json(body, { status, headers: responseHeaders })
    }
}