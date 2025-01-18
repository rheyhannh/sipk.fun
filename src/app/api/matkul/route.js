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
    BadRequestErrorResponse as badRequestError,
    NotFoundErrorResponse as notFoundError,
    ServerErrorResponse as serverError,
} from '@/constant/api_response';
import isUUID from 'validator/lib/isUUID';
import Joi from 'joi';
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

/** 
 * Array of string berisikan method yang tersedia pada route `'/api/matkul'`
*/
const routeMethods = ['GET', 'POST', 'PATCH', 'DELETE'];

/** 
 * Opsi `CORS` yang digunakan pada route `'/api/matkul'`
 * 
 * @see {@link DEFAULT_CORS_OPTIONS Default}
*/
const routeCorsOptions = /** @type {import('@/lib/cors').CorsOptions} */ ({
    methods: routeMethods,
} ?? DEFAULT_CORS_OPTIONS
);

const limitRequest = parseInt(process.env.API_MATKUL_REQUEST_LIMIT);
const limiter = await rateLimit({
    interval: parseInt(process.env.API_MATKUL_TOKEN_INTERVAL_SECONDS) * 1000,
    uniqueTokenPerInterval: parseInt(process.env.API_MATKUL_MAX_TOKEN_PERINTERVAL),
})

/**
 * Route Handler untuk `OPTIONS` `'/api/matkul'`
 * @param {NextRequest} request
 */
export async function OPTIONS(request) {
    return cors(request, new Response(null, { status: 204 }), routeCorsOptions);
}

/**
 * Route Handler untuk `PATCH` `'/api/matkul'`
 * @param {NextRequest} request
 */
export async function PATCH(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    const defaultUserErrorMessage = 'Gagal memperbarui matakuliah';
    const searchParams = request.nextUrl.searchParams;
    const matkulId = searchParams.get('id');

    try {
        const isService = await verifyService(request);
        if (isService) {
            throw serverError.request_not_supported(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: 'No service handler for edit matkul',
                    stack: null,
                    functionDetails: 'PATCH /api/matkul line 61',
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

        if (!matkulId || typeof matkulId !== 'string' || !isUUID(matkulId)) {
            throw badRequestError.malformed_request_params(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: "Request param 'id' expected exist and typed as string and UUID format",
                    stack: null,
                    functionDetails: 'PATCH /api/matkul line 83',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        const { decryptedSession, decodedAccessToken } = await verifyAuth();

        /*
            @breakingInFuture
            Try to resolve user universitas from session or access token first. 
            This case will not fit in the future when user can change their university.
            But for now, when user cant change their university, it can save a lot requests.
        */
        var userUniversitasId = decryptedSession?.user?.user_metadata?.university_id ?? decodedAccessToken?.user_metadata?.university_id;
        if (!userUniversitasId) {
            /** @type {SupabaseTypes._from<SupabaseTypes.UserData>} */
            const { data, error } = await supabase.from('user').select('*');
            if (error) {
                throw serverError.interval_server_error(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to edit matakuliah, cant resolve user universitas id, supabase error occurred',
                        stack: null,
                        functionDetails: 'supabase.from at PATCH /api/matkul line 186',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: null,
                        request: await getRequestDetails(),
                        more: error,
                    }
                )
            }
            if (!data.length || !data[0]?.university_id) {
                throw notFoundError.resource_not_found(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to edit matakuliah, cant resolve user universitas id after querying',
                        stack: null,
                        functionDetails: 'supabase.from at PATCH /api/matkul line 186',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: { data, error },
                        request: await getRequestDetails(),
                        more: null,
                    }
                )
            }

            userUniversitasId = data[0].university_id;
        }

        const userId = decryptedSession?.user?.id ?? decodedAccessToken?.sub;
        if (!userId) {
            throw notFoundError.resource_not_found(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to edit matakuliah, cant resolve user id',
                    stack: null,
                    functionDetails: 'PATCH /api/matkul line 106',
                    functionArgs: null,
                    functionResolvedVariable: { userUniversitasId, userId },
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        var formData = /** @type {SupabaseTypes.MatkulData} */ (
            await parseFormData(request)
        );

        /** @type {SupabaseTypes._from<SupabaseTypes.UniversitasData} */
        var { data: universitas, error } = await supabase.from('universitas').select('*').eq('id', userUniversitasId);
        if (!universitas.length) {
            throw notFoundError.resource_not_found(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to edit matakuliah, cant resolve user universitas',
                    stack: null,
                    functionDetails: 'supabase.from at PATCH /api/matkul line 122',
                    functionArgs: { from: 'universitas', select: '*', eq: { id: userUniversitasId } },
                    functionResolvedVariable: { universitas, error },
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
                    reason: 'Failed to edit matakuliah, cant resolve user universitas',
                    stack: null,
                    functionDetails: 'supabase.from at PATCH /api/matkul line 122',
                    functionArgs: { from: 'universitas', select: '*', eq: { id: userUniversitasId } },
                    functionResolvedVariable: { universitas, error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        const nilaiRef = universitas[0].penilaian;
        const nilaiKeys = Object.keys(nilaiRef);
        const formDataSchema = Joi.object(
            /** @type {import('@/types/form_data').MatkulFormData} */
            ({
                nama: Joi.string().min(3).max(50).required(),
                semester: Joi.number().min(0).max(50).required(),
                sks: Joi.number().min(0).max(50).required(),
                nilai: Joi.object({ indeks: Joi.string().valid(...nilaiKeys).required() }).required(),
                dapat_diulang: Joi.boolean().required(),
                target_nilai: Joi.object({ indeks: Joi.string().valid(...nilaiKeys).required() }).required()
            }));

        await validateFormData(formData, null, formDataSchema);

        const { indeks: nilaiIndeks } = formData.nilai;
        const { indeks: targetIndeks } = formData.target_nilai;

        const nilaiWeight = nilaiRef[nilaiIndeks].weight;
        const targetNilaiWeight = nilaiRef[targetIndeks].weight;

        formData.nilai.bobot = nilaiWeight;
        formData.nilai.akhir = formData.sks * nilaiWeight;
        formData.target_nilai.bobot = targetNilaiWeight;

        const unixNow = Math.floor(Date.now() / 1000);

        /** @type {SupabaseTypes._from<SupabaseTypes.MatkulHistoryData>} */
        var { data, error } = await supabase.from('matkul_history').select().eq('matkul_id', matkulId);
        if (!data.length) {
            throw notFoundError.resource_not_found(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to edit matakuliah, cant resolve matkul history',
                    stack: null,
                    functionDetails: 'supabase.from at PATCH /api/matkul line 180',
                    functionArgs: { from: 'matkul_history', select: true, eq: { matkul_id: matkulId } },
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
                    reason: 'Failed to edit matakuliah, cant resolve matkul history',
                    stack: null,
                    functionDetails: 'supabase.from at PATCH /api/matkul line 180',
                    functionArgs: { from: 'matkul_history', select: true, eq: { matkul_id: matkulId } },
                    functionResolvedVariable: { data, error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        var { id: _, matkul_id: _, owned_by: _, ...originalMatkulHistory } = data[0];
        const updatedPrev = { ...data[0].current };
        const updatedCurrent = { ...formData, type: 'ubah', stamp: unixNow };

        /** @type {SupabaseTypes._from<SupabaseTypes.MatkulHistoryData>} */
        var { data: matkulHistory, error } = await supabase.from('matkul_history').update({ current: updatedCurrent, prev: updatedPrev, last_change_at: unixNow }).eq('matkul_id', matkulId).select();
        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to edit matakuliah, cant update matakuliah history',
                    stack: null,
                    functionDetails: 'supabase.from at PATCH /api/matkul line 217',
                    functionArgs: { from: 'matkul_history', update: { current: updatedCurrent, prev: updatedPrev, last_change_at: unixNow }, eq: { matkul_id: matkulId }, select: true },
                    functionResolvedVariable: { data: matkulHistory, error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        /** @type {SupabaseTypes._from<SupabaseTypes.MatkulData>} */
        var { data: matkulUpdated, error } = await supabase.from('matkul').update({ ...formData, updated_at: unixNow }).eq('id', matkulId).select();
        if (error) {
            const updateError = error;
            var { error: rollbackError } = await supabase.from('matkul_history').update(originalMatkulHistory).eq('matkul_id', matkulId);
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: rollbackError ? 'critical' : 'error',
                    reason: "Failed to edit matakuliah when trying to update matakuliah. Will attempting to rollback matkul history to previous state. If rollback failed, error showed in 'more'",
                    stack: null,
                    functionDetails: 'supabase.from at PATCH /api/matkul line 235',
                    functionArgs: { from: 'matkul', update: { ...formData, updated_at: unixNow }, eq: { id: matkulId }, select: true },
                    functionResolvedVariable: { data: matkulUpdated, error: updateError },
                    request: await getRequestDetails(),
                    more: rollbackError,
                }
            )
        }

        return cors(request, NextResponse.json({ matkul: matkulUpdated[0], ref: matkulHistory[0] }, { status: 200, headers: responseHeaders }), routeCorsOptions);
    } catch (/** @type {import('@/constant/api_response').APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return cors(request, NextResponse.json(body, { status, headers: responseHeaders }), routeCorsOptions);
    }
}

/**
 * Route Handler untuk `DELETE` `'/api/matkul'`
 * @param {NextRequest} request
 */
export async function DELETE(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    const defaultUserErrorMessage = 'Gagal menghapus matakuliah';
    const searchParams = request.nextUrl.searchParams;
    const matkulId = searchParams.get('id');

    try {
        const isService = await verifyService(request);
        if (isService) {
            throw serverError.request_not_supported(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: 'No service handler for delete matakuliah',
                    stack: null,
                    functionDetails: 'DELETE /api/matkul line 278',
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

        if (!matkulId || typeof matkulId !== 'string' || !isUUID(matkulId)) {
            throw badRequestError.malformed_request_params(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: "Request param 'id' expected exist and typed as string and UUID format",
                    stack: null,
                    functionDetails: 'DELETE /api/matkul line 300',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        const { decryptedSession, decodedAccessToken } = await verifyAuth();
        const unixNow = Math.floor(Date.now() / 1000);

        /** @type {SupabaseTypes._from<SupabaseTypes.MatkulHistoryData>} */
        var { data, error } = await supabase.from('matkul_history').select().eq('matkul_id', matkulId);
        if (!data.length) {
            throw notFoundError.resource_not_found(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to delete matakuliah, cant resolve matakuliah history',
                    stack: null,
                    functionDetails: 'supabase.from at DELETE /api/matkul line 319',
                    functionArgs: { from: 'matkul_history', select: true, eq: { matkul_id: matkulId } },
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
                    reason: 'Failed to delete matkauliah, cant resolve matakuliah history',
                    stack: null,
                    functionDetails: 'supabase.from at DELETE /api/matkul line 319',
                    functionArgs: { from: 'matkul_history', select: true, eq: { matkul_id: matkulId } },
                    functionResolvedVariable: { data, error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        var { id: _, matkul_id: _, owned_by: _, prev: _, ...originalMatkulHistory } = data[0];
        const updatedCurrent = { ...data[0].current, type: 'hapus', stamp: unixNow };

        /** @type {SupabaseTypes._from<SupabaseTypes.MatkulHistoryData>} */
        var { data: matkulHistory, error } = await supabase.from('matkul_history').update({ current: updatedCurrent, last_change_at: unixNow }).eq('matkul_id', matkulId).select();

        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to delete matakuliah',
                    stack: null,
                    functionDetails: 'supabase.from at DELETE /api/matkul line 355',
                    functionArgs: { from: 'matkul_history', update: { current: updatedCurrent, last_change_at: unixNow }, eq: { matkul_id: matkulId }, select: true },
                    functionResolvedVariable: { data: matkulHistory, error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        var { error } = await supabase.from('matkul').delete().eq('id', matkulId);
        if (error) {
            const deleteError = error;
            var { error: rollbackError } = await supabase.from('matkul_history').update(originalMatkulHistory).eq('matkul_id', matkulId);
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: rollbackError ? 'critical' : 'error',
                    reason: "Failed to delete matakuliah when trying to delete matakuliah. Will attempting to rollback matkul history to previous state. If rollback failed, error showed in 'more'",
                    stack: null,
                    functionDetails: 'supabase.from at DELETE /api/matkul line 373',
                    functionArgs: { from: 'matkul', delete: true, eq: { id: matkulId } },
                    functionResolvedVariable: { error: deleteError },
                    request: await getRequestDetails(),
                    more: rollbackError,
                }
            )
        }

        return cors(request, NextResponse.json({ ref: matkulHistory[0] }, { status: 200, headers: responseHeaders }), routeCorsOptions);
    } catch (/** @type {import('@/constant/api_response').APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return cors(request, NextResponse.json(body, { status, headers: responseHeaders }), routeCorsOptions);
    }
}

/**
 * Route Handler untuk `POST` `'/api/matkul'`
 * @param {NextRequest} request
 */
export async function POST(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    const defaultUserErrorMessage = 'Gagal menambah matakuliah';
    const searchParams = request.nextUrl.searchParams;
    const ref = searchParams.get('ref');

    try {
        const isService = await verifyService(request);
        if (isService) {
            throw serverError.request_not_supported(
                undefined, undefined,
                {
                    severity: 'error',
                    reason: 'No service handler for add matakuliah',
                    stack: null,
                    functionDetails: 'POST /api/matkul line 416',
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

        if (ref && (typeof ref !== 'string' || !isUUID(ref))) {
            throw badRequestError.malformed_request_params(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: "Request param 'ref' expected typed as string and UUID format",
                    stack: null,
                    functionDetails: 'POST /api/matkul line 438',
                    functionArgs: null,
                    functionResolvedVariable: null,
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        const { decryptedSession, decodedAccessToken } = await verifyAuth();

        /*
            @breakingInFuture
            Try to resolve user universitas from session or access token first. 
            This case will not fit in the future when user can change their university.
            But for now, when user cant change their university, it can save a lot requests.
        */
        var userUniversitasId = decryptedSession?.user?.user_metadata?.university_id ?? decodedAccessToken?.user_metadata?.university_id;
        if (!userUniversitasId) {
            /** @type {SupabaseTypes._from<SupabaseTypes.UserData>} */
            const { data, error } = await supabase.from('user').select('*');
            if (error) {
                throw serverError.interval_server_error(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to add matakuliah, cant resolve user universitas id, supabase error occurred',
                        stack: null,
                        functionDetails: 'supabase.from at POST /api/matkul line 186',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: null,
                        request: await getRequestDetails(),
                        more: error,
                    }
                )
            }
            if (!data.length || !data[0]?.university_id) {
                throw notFoundError.resource_not_found(
                    defaultUserErrorMessage, undefined,
                    {
                        severity: 'error',
                        reason: 'Failed to add matakuliah, cant resolve user universitas id after querying',
                        stack: null,
                        functionDetails: 'supabase.from at POST /api/matkul line 186',
                        functionArgs: { from: 'user', select: '*' },
                        functionResolvedVariable: { data, error },
                        request: await getRequestDetails(),
                        more: null,
                    }
                )
            }

            userUniversitasId = data[0].university_id;
        }

        const userId = decryptedSession?.user?.id ?? decodedAccessToken?.sub;
        if (!userId) {
            throw notFoundError.resource_not_found(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to add matakuliah, cant resolve user id',
                    stack: null,
                    functionDetails: 'POST /api/matkul line 461',
                    functionArgs: null,
                    functionResolvedVariable: { userUniversitasId, userId },
                    request: await getRequestDetails(),
                    more: null,
                }
            )
        }

        var formData = /** @type {SupabaseTypes.MatkulData} */ (
            await parseFormData(request)
        );

        /** @type {SupabaseTypes._from<SupabaseTypes.UniversitasData} */
        var { data: universitas, error } = await supabase.from('universitas').select('*').eq('id', userUniversitasId);
        if (!universitas.length) {
            throw notFoundError.resource_not_found(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to add matakuliah, cant resolve user universitas',
                    stack: null,
                    functionDetails: 'supabase.from at POST /api/matkul line 477',
                    functionArgs: { from: 'universitas', select: '*', eq: { id: userUniversitasId } },
                    functionResolvedVariable: { universitas, error },
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
                    reason: 'Failed to add matakuliah, cant resolve user universitas',
                    stack: null,
                    functionDetails: 'supabase.from at POST /api/matkul line 477',
                    functionArgs: { from: 'universitas', select: '*', eq: { id: userUniversitasId } },
                    functionResolvedVariable: { universitas, error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        const nilaiRef = universitas[0].penilaian;
        const nilaiKeys = Object.keys(nilaiRef);
        const formDataSchema = Joi.object(
            /** @type {import('@/types/form_data').MatkulFormData} */
            ({
                nama: Joi.string().min(3).max(50).required(),
                semester: Joi.number().min(0).max(50).required(),
                sks: Joi.number().min(0).max(50).required(),
                nilai: Joi.object({ indeks: Joi.string().valid(...nilaiKeys).required() }).required(),
                dapat_diulang: Joi.boolean().required(),
                target_nilai: Joi.object({ indeks: Joi.string().valid(...nilaiKeys).required() }).required()
            }));

        await validateFormData(formData, null, formDataSchema);

        const { indeks: nilaiIndeks } = formData.nilai;
        const { indeks: targetIndeks } = formData.target_nilai;

        const nilaiWeight = nilaiRef[nilaiIndeks].weight;
        const targetNilaiWeight = nilaiRef[targetIndeks].weight;

        formData.nilai.bobot = nilaiWeight;
        formData.nilai.akhir = formData.sks * nilaiWeight;
        formData.target_nilai.bobot = targetNilaiWeight;

        const unixNow = Math.floor(Date.now() / 1000);

        /** @type {SupabaseTypes._from<SupabaseTypes.MatkulData>} */
        var { data: matkulBaru, error } = await supabase.from('matkul').insert({ ...formData, owned_by: userId, created_at: unixNow }).select();
        if (error) {
            throw serverError.interval_server_error(
                defaultUserErrorMessage, undefined,
                {
                    severity: 'error',
                    reason: 'Failed to add matakuliah',
                    stack: null,
                    functionDetails: 'supabase.from at POST /api/matkul line 535',
                    functionArgs: { from: 'matkul', insert: { ...formData, owned_by: userId, created_at: unixNow }, select: true },
                    functionResolvedVariable: { matkulBaru, error },
                    request: await getRequestDetails(),
                    more: error,
                }
            )
        }

        /** @type {SupabaseTypes._from<SupabaseTypes.MatkulHistoryData>} */
        var { data: matkulBaruHistory, error } = ref ?
            await supabase.from('matkul_history')
                .update({ matkul_id: matkulBaru[0].id, current: { ...formData, type: 'tambah', stamp: unixNow }, prev: null, owned_by: userId, last_change_at: unixNow })
                .eq('matkul_id', ref)
                .select()
            : await supabase.from('matkul_history')
                .insert({ matkul_id: matkulBaru[0].id, current: { ...formData, type: 'tambah', stamp: unixNow }, prev: null, owned_by: userId, last_change_at: unixNow })
                .select();

        if (!matkulBaruHistory.length || error) {
            const matkulBaruHistoryError = error;
            var { error: rollbackError } = await supabase.from('matkul').delete().eq('id', matkulBaru[0].id);
            throw notFoundError.resource_not_found(
                defaultUserErrorMessage, undefined,
                {
                    severity: rollbackError ? 'critical' : 'error',
                    reason: "Failed to add matakuliah, ref not exist. Will attempting to remove added matakuliah, if error showed in 'more'",
                    stack: null,
                    functionDetails: 'supabase.from at POST /api/matkul line 553',
                    functionArgs: { from: 'matkul_history', updateOrInsert: { matkul_id: matkulBaru[0].id, current: { ...formData, type: 'tambah', stamp: unixNow }, prev: null, owned_by: userId, last_change_at: unixNow }, eq: { matkul_id: ref }, select: true },
                    functionResolvedVariable: { matkulBaruHistory, matkulBaruHistoryError },
                    request: await getRequestDetails(),
                    more: rollbackError,
                }
            )
        }

        return cors(request, NextResponse.json({ matkul: matkulBaru[0], ref: matkulBaruHistory[0] }, { status: 200, headers: responseHeaders }), routeCorsOptions);
    } catch (/** @type {import('@/constant/api_response').APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return cors(request, NextResponse.json(body, { status, headers: responseHeaders }), routeCorsOptions);
    }
}

/**
 * Route Handler untuk `GET` `'/api/matkul'`
 * @param {NextRequest} request
 */
export async function GET(request) {
    const responseHeaders = {};
    const requestLog = await getLogAttributes(request);
    const ratelimitLog = {};

    try {
        const isService = await verifyService(request);
        if (isService) {
            /** @type {SupabaseTypes._from<SupabaseTypes.MatkulData>} */
            const { data, error } = await supabaseService.from('matkul').select('*');
            if (error) {
                const { code, headers = {}, _details, ...rest } = await handleSupabaseError(error, false, {
                    functionDetails: 'supabaseService.from at GET /api/matkul line 601',
                    functionArgs: { from: 'matkul', select: '*' },
                    functionResolvedVariable: { data, error },
                });

                const body = { ...rest, _details: { ..._details, request: { info: requestLog, ..._details.request } } }
                return cors(request, NextResponse.json(body, { status: code, headers }), routeCorsOptions);
            }

            return cors(request, NextResponse.json(data, { status: 200 }), routeCorsOptions);
        }

        await checkRateLimit(limiter, limitRequest).then(x => {
            const { currentUsage, currentTtl, currentSize, rateLimitHeaders } = x;
            Object.assign(responseHeaders, rateLimitHeaders);
            Object.assign(ratelimitLog, { currentUsage, currentTtl, currentSize })
        })

        const { decryptedSession, decodedAccessToken } = await verifyAuth();

        /** @type {SupabaseTypes._from<SupabaseTypes.MatkulData>} */
        const { data, error } = await supabase.from('matkul').select('*').order('created_at', { ascending: true });
        if (error) {
            await handleSupabaseError(error, true, {
                functionDetails: 'supabase.from at GET /api/matkul line 625',
                functionArgs: { from: 'matkul', select: '*', orderColumn: 'created_at', orderOptions: { ascending: true } },
                functionResolvedVariable: { data, error },
            })
        }

        return cors(request, NextResponse.json(data, { status: 200, headers: responseHeaders }), routeCorsOptions);
    } catch (/** @type {import('@/constant/api_response').APIResponseErrorProps} */ error) {
        const { body, status, headers } = await handleErrorResponse(error, requestLog, ratelimitLog, true);
        if (headers) { Object.assign(responseHeaders, headers) }
        return cors(request, NextResponse.json(body, { status, headers: responseHeaders }), routeCorsOptions);
    }
}