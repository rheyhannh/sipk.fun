// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
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
    handleErrorResponse,
    handleSupabaseError,
    supabaseServerClient as supabase,
    supabaseServiceClient as supabaseService,
} from '@/utils/api_helper';
// #endregion

const limitRequest = parseInt(process.env.API_MATKULHISTORY_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_MATKULHISTORY_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_MATKULHISTORY_MAX_TOKEN_PERINTERVAL),
})

/**
 * Route Handler untuk `GET` `'/api/matkul-history'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    try {
        const isService = await verifyService(request);
        if (isService) {
            /** @type {SupabaseTypes._from<SupabaseTypes.MatkulHistoryData>} */
            const { data, error } = await supabaseService.from('matkul_history').select('*');
            if (error) {
                const { code, headers = {}, _details, ...rest } = await handleSupabaseError(error, false, {
                    functionDetails: 'supabaseService.from at GET /api/matkul-history line 55',
                    functionArgs: { from: 'matkul_history', select: '*' },
                    functionResolvedVariable: { data, error },
                });

                const body = { ...rest, _details: { ..._details, request: { info: requestLog, ..._details.request } } }
                return NextResponse.json(body, { status: code, headers });
            }

            return NextResponse.json(data, { status: 200 });
        }

        await checkRateLimit(limiter, limitRequest).then(x => {
            const { currentUsage, currentTtl, currentSize, rateLimitHeaders } = x;
            Object.assign(responseHeaders, rateLimitHeaders);
            Object.assign(ratelimitLog, { currentUsage, currentTtl, currentSize })
        })

        const { decryptedSession, decodedAccessToken } = await verifyAuth();

        /** @type {SupabaseTypes._from<SupabaseTypes.MatkulHistoryData>} */
        const { data, error } = await supabase.from('matkul_history').select('*').order('last_change_at', { ascending: true });
        if (error) {
            await handleSupabaseError(error, true, {
                functionDetails: 'supabase.from at GET /api/matkul-history line 79',
                functionArgs: { from: 'matkul_history', select: '*', orderColumn: 'last_change_at', orderOptions: { ascending: true } },
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
 * Route Handler untuk `DELETE` `'/api/matkul-history'`
 * @param {NextRequest} request
 */
export async function DELETE(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    const defaultUserErrorMessage = 'Gagal menghapus matakuliah';
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const matkulId = searchParams.get('mid');


    try {
        const isService = await verifyService(request);
        if (isService) {
            throw serverError.request_not_supported(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: 'No service handler for delete matakuliah history',
                    stack: null,
                    functionDetails: 'DELETE /api/matkul-history line 114',
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

        if (
            !id || !matkulId ||
            typeof id !== 'string' || typeof matkulId !== 'string' ||
            !isUUID(id) || !isUUID(matkulId)
        ) {
            throw badRequestError.malformed_request_params(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: "Request param 'id' and 'matkulId' expected exist and typed as string and UUID format",
                    stack: null,
                    functionDetails: 'DELETE /api/matkul-history line 140',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        const { decryptedSession, decodedAccessToken } = await verifyAuth();

        var { error } = await supabase.from('matkul').delete().eq('id', matkulId);
        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to delete matakuliah when deleting matakuliah history',
                    stack: null,
                    functionDetails: 'supabase.from at DELETE /api/matkul-history line 157',
                    functionArgs: { from: 'matkul', delete: true, eq: { id: matkulId } },
                    functionResolvedVariable: { error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        var { error } = await supabase.from('matkul_history').delete().eq('id', id);
        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to delete matakuliah history',
                    stack: null,
                    functionDetails: 'supabase.from at DELETE /api/matkul-history line 174',
                    functionArgs: { from: 'matkul_history', delete: true, eq: { id: id } },
                    functionResolvedVariable: { error },
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