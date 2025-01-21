// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region NEXT DEPEDENCY
import { NextResponse, NextRequest } from 'next/server';
// #endregion

// #region UTIL DEPEDENCY
import cors, { DEFAULT_CORS_OPTIONS } from '@/lib/cors';
import { rateLimit, getRequestDetails } from '@/utils/server_side';
import {
	BadRequestErrorResponse as badRequestError,
	NotFoundErrorResponse as notFoundError,
	ServerErrorResponse as serverError
} from '@/constant/api_response';
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
	supabaseServiceClient as supabaseService
} from '@/utils/api_helper';
// #endregion

/**
 * Array of string berisikan method yang tersedia pada route `'/api/me'`
 */
const routeMethods = ['GET', 'PATCH'];

/**
 * Opsi `CORS` yang digunakan pada route `'/api/me'`
 *
 * @see {@link DEFAULT_CORS_OPTIONS Default}
 */
const routeCorsOptions = /** @type {import('@/lib/cors').CorsOptions} */ (
	{
		methods: routeMethods
	} ?? DEFAULT_CORS_OPTIONS
);

const limitRequest = parseInt(process.env.API_ME_REQUEST_LIMIT);
const limiter = await rateLimit({
	interval: parseInt(process.env.API_ME_TOKEN_INTERVAL_SECONDS) * 1000,
	uniqueTokenPerInterval: parseInt(process.env.API_ME_MAX_TOKEN_PERINTERVAL)
});

/**
 * Route Handler untuk `OPTIONS` `'/api/me'`
 * @param {NextRequest} request
 */
export async function OPTIONS(request) {
	return cors(request, new Response(null, { status: 204 }), routeCorsOptions);
}

/**
 * Route Handler untuk `GET` `'/api/me'`
 * @param {NextRequest} request
 */
export async function GET(request) {
	const responseHeaders = {};
	const requestLog = await getLogAttributes(request);
	const ratelimitLog = {};

	try {
		const isService = await verifyService(request);
		if (isService) {
			/** @type {SupabaseTypes._from<SupabaseTypes.UserData>} */
			const { data, error } = await supabaseService.from('user').select('*');
			if (error) {
				const {
					code,
					headers = {},
					_details,
					...rest
				} = await handleSupabaseError(error, false, {
					functionDetails: 'supabaseService.from at GET /api/me line 58',
					functionArgs: { from: 'user', select: '*' },
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

		/** @type {SupabaseTypes._from<SupabaseTypes.UserData>} */
		const { data, error } = await supabase.from('user').select('*');
		if (error) {
			await handleSupabaseError(error, true, {
				functionDetails: 'supabase.from at GET /api/me line 82',
				functionArgs: { from: 'matkul', select: '*' },
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

/**
 * Route Handler untuk `PATCH` `'/api/me'`
 * @param {NextRequest} request
 */
export async function PATCH(request) {
	const responseHeaders = {};
	const requestLog = await getLogAttributes(request);
	const ratelimitLog = {};

	const defaultUserErrorMessage = 'Gagal memperbarui profil';
	const searchParams = request.nextUrl.searchParams;
	const type = searchParams.get('type');
	const allowedType = ['preferences'];

	try {
		const isService = await verifyService(request);
		if (isService) {
			throw serverError.request_not_supported(undefined, undefined, {
				severity: 'error',
				reason: "No service handler for update user profil 'me'",
				stack: null,
				functionDetails: 'PATCH /api/me line 115',
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

		if (type && !allowedType.includes(type)) {
			throw badRequestError.malformed_request_params(
				defaultUserErrorMessage,
				undefined,
				{
					severity: 'error',
					reason: "Request param 'type' expected to be one of 'allowedType'",
					stack: null,
					functionDetails: 'PATCH /api/me line 137',
					functionArgs: null,
					functionResolvedVariable: null,
					request: await getRequestDetails(),
					more: null
				}
			);
		}

		const { decryptedSession, decodedAccessToken } = await verifyAuth();
		const userId = decryptedSession?.user?.id ?? decodedAccessToken?.sub;

		if (!userId) {
			throw notFoundError.resource_not_found(
				defaultUserErrorMessage,
				undefined,
				{
					severity: 'error',
					reason: "Failed to update user profil 'me', cant resolve user id",
					stack: null,
					functionDetails: 'PATCH /api/me line 156',
					functionArgs: null,
					functionResolvedVariable: { userId },
					request: await getRequestDetails(),
					more: null
				}
			);
		}

		var formData = /** @type {import('@/types/form_data').UserFormData} */ (
			await parseFormData(request)
		);

		const allowedColumn = [
			'nomor',
			'matakuliah',
			'semester',
			'sks',
			'nilai',
			'diulang',
			'target',
			'ontarget'
		];
		const formDataSchema =
			type === 'preferences'
				? Joi.object({
						table: Joi.object(
							/** @type {import('@/types/form_data').UserFormData['preferences']['table']} */
							({
								size: Joi.number()
									.valid(-1, 5, 10, 25, 50, 100)
									.required()
									.options({ convert: false }),
								controlPosition: Joi.number()
									.min(0)
									.max(2)
									.required()
									.options({ convert: false }),
								columnOrder: Joi.array()
									.items(Joi.string().valid(...allowedColumn))
									.unique()
									.length(8)
									.required(),
								columnVisibility: Joi.object()
									.keys({
										nomor: Joi.boolean().required(),
										matakuliah: Joi.boolean().required(),
										semester: Joi.boolean().required(),
										sks: Joi.boolean().required(),
										nilai: Joi.boolean().required(),
										diulang: Joi.boolean().required(),
										target: Joi.boolean().required(),
										ontarget: Joi.boolean().required()
									})
									.required()
									.length(allowedColumn.length)
									.unknown(false)
									.options({ convert: false })
							})
						).required()
					}).required()
				: Joi.object(
						/** @type {Omit<import('@/types/form_data').UserFormData, 'preferences'>} */
						({
							fullname: Joi.string()
								.pattern(/^[A-Za-z\s]*$/, 'alpha only')
								.pattern(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, 'one space each word')
								.min(6)
								.max(50),
							nickname: Joi.string().min(3).max(20),
							jurusan: Joi.string().min(6).max(30),
							sks_target: Joi.number().integer().min(5).max(1000),
							matkul_target: Joi.number().integer().min(5).max(1000),
							ipk_target: Joi.number().min(1).max(4)
						})
					);

		await validateFormData(formData, null, formDataSchema);

		/** @type {SupabaseTypes._from<SupabaseTypes.UserData>} */
		const { data: profilBaru, error } =
			type === 'preferences'
				? await supabase
						.from('user')
						.update({ preferences: formData })
						.eq('id', userId)
						.select()
				: await supabase
						.from('user')
						.update({ ...formData })
						.eq('id', userId)
						.select();

		if (error) {
			throw serverError.interval_server_error(
				defaultUserErrorMessage,
				undefined,
				{
					severity: 'error',
					reason: "Failed to update user profil 'me'",
					stack: null,
					functionDetails: 'supabase.from at PATCH /api/me line 216',
					functionArgs: {
						from: 'user',
						update:
							type === 'preferences'
								? { preferences: formData }
								: { ...formData },
						eq: { id: userId },
						select: true
					},
					functionResolvedVariable: { data: profilBaru, error },
					request: await getRequestDetails(),
					more: error
				}
			);
		}

		return cors(
			request,
			NextResponse.json(
				{ profil: profilBaru[0] },
				{ status: 200, headers: responseHeaders }
			),
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
