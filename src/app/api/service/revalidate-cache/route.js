// #region NEXT DEPEDENCY
import { NextResponse, NextRequest } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
// #endregion

// #region UTIL DEPEDENCY
import cors, { DEFAULT_CORS_OPTIONS } from '@/lib/cors';
import { rateLimit, getRequestDetails } from '@/utils/server_side';
import {
	BadRequestErrorResponse as badRequestError,
	AuthErrorResponse as authError
} from '@/constant/api_response';
// #endregion

// #region API HELPER DEPEDENCY
import {
	getLogAttributes,
	verifyService,
	checkRateLimit,
	handleErrorResponse
} from '@/utils/api_helper';
// #endregion

/**
 * Array of string berisikan method yang tersedia pada route `'/api/service/revalidate-cache'`
 */
const routeMethods = ['POST'];

/**
 * Opsi `CORS` yang digunakan pada route `'/api/service/revalidate-cache'`
 *
 * @see {@link DEFAULT_CORS_OPTIONS Default}
 */
const routeCorsOptions = /** @type {import('@/lib/cors').CorsOptions} */ (
	{
		methods: routeMethods,
		allowedHeaders: ['x-api-key', 'content-type']
	} ?? DEFAULT_CORS_OPTIONS
);

const limitRequest = parseInt(process.env.API_SERVICE_REQUEST_LIMIT);
const limiter = await rateLimit({
	interval: parseInt(process.env.API_SERVICE_TOKEN_INTERVAL_SECONDS) * 1000,
	uniqueTokenPerInterval: parseInt(
		process.env.API_SERVICE_MAX_TOKEN_PERINTERVAL
	)
});

/**
 * Route Handler untuk `OPTIONS` `'/api/service/revalidate-cache'`
 * @param {NextRequest} request
 */
export async function OPTIONS(request) {
	return cors(request, new Response(null, { status: 204 }), routeCorsOptions);
}

/**
 * Route Handler untuk `POST` `'/api/service/revalidate-cache'`
 * @param {NextRequest} request
 */
export async function POST(request) {
	const responseHeaders = {};
	const requestLog = await getLogAttributes(request);
	const ratelimitLog = {};

	const searchParams = request.nextUrl.searchParams;
	const tagParam = searchParams.get('tag');
	const pathParam = searchParams.get('path');

	try {
		const isService = await verifyService(request);
		if (isService) {
			if (tagParam || pathParam) {
				if (tagParam) {
					revalidateTag(tagParam);
				} else {
					revalidatePath(pathParam);
				}
				return cors(
					request,
					new Response(null, { status: 204 }),
					routeCorsOptions
				);
			}

			throw badRequestError.malformed_request_params(undefined, undefined, {
				severity: 'error',
				reason: "Request param 'tag' or 'path' required",
				stack: null,
				functionDetails: 'POST /api/service/revalidate-cache line 58',
				functionArgs: null,
				functionResolvedVariable: null,
				request: await getRequestDetails(),
				more: null
			});
		}

		await checkRateLimit(limiter, limitRequest).then((x) => {
			const { currentUsage, currentTtl, currentSize, rateLimitHeaders } = x;
			Object.assign(responseHeaders, rateLimitHeaders);
			Object.assign(ratelimitLog, { currentUsage, currentTtl, currentSize });
		});

		throw authError.api_key_error(undefined, undefined, {
			severity: 'error',
			reason: null,
			stack: null,
			functionDetails: 'POST /api/service/revalidate-cache line 79',
			functionArgs: null,
			functionResolvedVariable: null,
			request: await getRequestDetails(),
			more: null
		});
	} catch (/** @type {import('@/constant/api_response').APIResponseErrorProps} */ error) {
		const { body, status, headers } = await handleErrorResponse(
			error,
			requestLog,
			ratelimitLog,
			true
		);
		if (headers) {
			Object.assign(responseHeaders, headers);
		}
		return cors(
			request,
			NextResponse.json(body, { status, headers: responseHeaders }),
			routeCorsOptions
		);
	}
}
