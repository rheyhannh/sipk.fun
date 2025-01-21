// #region NEXT DEPEDENCY
import { NextResponse, NextRequest } from 'next/server';
// #endregion

// #region UTIL DEPEDENCY
import cors, { DEFAULT_CORS_OPTIONS } from '@/lib/cors';
import { rateLimit, getRequestDetails } from '@/utils/server_side';
import { ServerErrorResponse as serverError } from '@/constant/api_response';
// #endregion

// #region API HELPER DEPEDENCY
import {
	getLogAttributes,
	checkRateLimit,
	parseFormData,
	validateFormData,
	handleErrorResponse,
	supabaseServerClient as supabase
} from '@/utils/api_helper';
// #endregion

/**
 * Array of string berisikan method yang tersedia pada route `'/api/magiclink'`
 */
const routeMethods = ['POST'];

/**
 * Opsi `CORS` yang digunakan pada route `'/api/magiclink'`
 *
 * @see {@link DEFAULT_CORS_OPTIONS Default}
 */
const routeCorsOptions = /** @type {import('@/lib/cors').CorsOptions} */ (
	{
		methods: routeMethods
	} ?? DEFAULT_CORS_OPTIONS
);

const limitRequest = parseInt(process.env.API_MAGICLINK_REQUEST_LIMIT);
const limiter = await rateLimit({
	interval: parseInt(process.env.API_MAGICLINK_TOKEN_INTERVAL_SECONDS) * 1000,
	uniqueTokenPerInterval: parseInt(
		process.env.API_MAGICLINK_MAX_TOKEN_PERINTERVAL
	)
});

/**
 * Route Handler untuk `OPTIONS` `'/api/magiclink'`
 * @param {NextRequest} request
 */
export async function OPTIONS(request) {
	return cors(request, new Response(null, { status: 204 }), routeCorsOptions);
}

/**
 * Route Handler untuk `POST` `'/api/magiclink'`
 * @param {NextRequest} request
 */
export async function POST(request) {
	const responseHeaders = {};
	const requestLog = await getLogAttributes(request);
	const ratelimitLog = {};

	try {
		await checkRateLimit(limiter, limitRequest).then((x) => {
			const { currentUsage, currentTtl, currentSize, rateLimitHeaders } = x;
			Object.assign(responseHeaders, rateLimitHeaders);
			Object.assign(ratelimitLog, { currentUsage, currentTtl, currentSize });
		});

		var formData =
			/** @type {import('@/types/form_data').LoginMagiclinkFormData} */ (
				await parseFormData(request)
			);
		await validateFormData(formData, 'magiclink');

		const { error } = await supabase.auth.signInWithOtp({
			email: formData.email,
			options: {
				captchaToken: formData?.token,
				shouldCreateUser: false
			}
		});

		if (error) {
			if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
				throw serverError.service_unavailable(undefined, undefined, {
					severity: 'error',
					reason: "Supabase error occurred, see details in 'more'",
					stack: null,
					functionDetails: 'supabase.auth at POST /api/magiclink line 87',
					functionArgs: {
						signInWithOtp: {
							options: {
								captchaToken: formData?.token,
								shouldCreateUser: false
							}
						}
					},
					functionResolvedVariable: null,
					request: await getRequestDetails(),
					more: error
				});
			}
			throw serverError.interval_server_error(undefined, undefined, {
				severity: 'error',
				reason: "Supabase error occurred, see details in 'more'",
				stack: null,
				functionDetails: 'supabase.auth at POST /api/magiclink line 101',
				functionArgs: {
					signInWithOtp: {
						options: { captchaToken: formData?.token, shouldCreateUser: false }
					}
				},
				functionResolvedVariable: null,
				request: await getRequestDetails(),
				more: error
			});
		}

		return cors(
			request,
			new Response(null, { status: 204, headers: responseHeaders }),
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
