// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region NEXT DEPEDENCY
import { NextResponse, NextRequest } from 'next/server';
// #endregion

// #region UTIL DEPEDENCY
import cors, { DEFAULT_CORS_OPTIONS } from '@/lib/cors';
import { rateLimit } from '@/utils/server_side';
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
	supabaseServiceClient as supabaseService
} from '@/utils/api_helper';
// #endregion

/**
 * Array of string berisikan method yang tersedia pada route `'/api/universitas'`
 */
const routeMethods = ['GET'];

/**
 * Opsi `CORS` yang digunakan pada route `'/api/universitas'`
 *
 * @see {@link DEFAULT_CORS_OPTIONS Default}
 */
const routeCorsOptions = /** @type {import('@/lib/cors').CorsOptions} */ (
	{
		methods: routeMethods
	} ?? DEFAULT_CORS_OPTIONS
);

const limitRequest = parseInt(process.env.API_UNIVERSITAS_REQUEST_LIMIT);
const limiter = await rateLimit({
	interval: parseInt(process.env.API_UNIVERSITAS_TOKEN_INTERVAL_SECONDS) * 1000,
	uniqueTokenPerInterval: parseInt(
		process.env.API_UNIVERSITAS_MAX_TOKEN_PERINTERVAL
	)
});

/**
 * Route Handler untuk `OPTIONS` `'/api/universitas'`
 * @param {NextRequest} request
 */
export async function OPTIONS(request) {
	return cors(request, new Response(null, { status: 204 }), routeCorsOptions);
}

/**
 * Route Handler untuk `GET` `'/api/universitas'`
 * @param {NextRequest} request
 */
export async function GET(request) {
	const responseHeaders = {};
	const requestLog = await getLogAttributes(request);
	const ratelimitLog = {};

	try {
		const isService = await verifyService(request);
		if (isService) {
			/** @type {SupabaseTypes._from<SupabaseTypes.UniversitasData>} */
			const { data, error } = await supabaseService
				.from('universitas')
				.select('*')
				.order('id', { ascending: true });
			if (error) {
				const {
					code,
					headers = {},
					_details,
					...rest
				} = await handleSupabaseError(error, false, {
					functionDetails:
						'supabaseService.from at GET /api/universitas line 49',
					functionArgs: {
						from: 'universitas',
						select: '*',
						orderColumn: 'id',
						orderOptions: { ascending: true }
					},
					functionResolvedVariable: { data, error }
				});

				const body = {
					...rest,
					_details: {
						..._details,
						request: { info: requestLog, ..._details.request }
					}
				};
				return cors(
					request,
					NextResponse.json(body, { status: code, headers }),
					routeCorsOptions
				);
			}

			return cors(
				request,
				NextResponse.json(data, { status: 200 }),
				routeCorsOptions
			);
		}

		await checkRateLimit(limiter, limitRequest).then((x) => {
			const { currentUsage, currentTtl, currentSize, rateLimitHeaders } = x;
			Object.assign(responseHeaders, rateLimitHeaders);
			Object.assign(ratelimitLog, { currentUsage, currentTtl, currentSize });
		});

		const { decryptedSession, decodedAccessToken } = await verifyAuth();

		/** @type {SupabaseTypes._from<SupabaseTypes.UniversitasData>} */
		const { data, error } = await supabase
			.from('universitas')
			.select('*')
			.order('id', { ascending: true });
		if (error) {
			await handleSupabaseError(error, true, {
				functionDetails: 'supabase.from at GET /api/universitas line 73',
				functionArgs: {
					from: 'universitas',
					select: '*',
					orderColumn: 'id',
					orderOptions: { ascending: true }
				},
				functionResolvedVariable: { data, error }
			});
		}

		return cors(
			request,
			NextResponse.json(data, { status: 200, headers: responseHeaders }),
			routeCorsOptions
		);
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
