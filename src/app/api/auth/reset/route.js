// #region NEXT DEPEDENCY
import { NextResponse, NextRequest } from 'next/server';
// #endregion

// #region UTIL DEPEDENCY
import cors, { DEFAULT_CORS_OPTIONS } from '@/lib/cors';
import { PAGE_ROUTES } from '@/constant/routes';
import {
	rateLimit,
	getSipkCookies,
	resetSipkCookies
} from '@/utils/server_side';
// #endregion

// #region API HELPER DEPEDENCY
import {
	getLogAttributes,
	checkRateLimit,
	handleErrorResponse,
	supabaseServerClient as supabase
} from '@/utils/api_helper';
// #endregion

/**
 * Array of string berisikan method yang tersedia pada route `'/api/auth/reset'`
 */
const routeMethods = ['GET'];

/**
 * Opsi `CORS` yang digunakan pada route `'/api/auth/reset'`
 *
 * @see {@link DEFAULT_CORS_OPTIONS Default}
 */
const routeCorsOptions = /** @type {import('@/lib/cors').CorsOptions} */ (
	{
		methods: routeMethods
	} ?? DEFAULT_CORS_OPTIONS
);

const limitRequest = parseInt(process.env.API_AUTH_RESET_REQUEST_LIMIT);
const limiter = await rateLimit({
	interval: parseInt(process.env.API_AUTH_RESET_TOKEN_INTERVAL_SECONDS) * 1000,
	uniqueTokenPerInterval: parseInt(
		process.env.API_AUTH_RESET_MAX_TOKEN_PERINTERVAL
	)
});

/**
 * Route Handler untuk `OPTIONS` `'/api/auth/reset'`
 * @param {NextRequest} request
 */
export async function OPTIONS(request) {
	return cors(request, new Response(null, { status: 204 }), routeCorsOptions);
}

/**
 * Route Handler untuk `GET` `'/api/auth/reset'`
 * @param {NextRequest} request
 */
export async function GET(request) {
	const responseHeaders = {};
	const requestLog = await getLogAttributes(request);
	const ratelimitLog = {};

	const { searchParams } = request.nextUrl;
	const envokeSession = searchParams.get('envoke_session') === 'true';
	const redirectPathname = PAGE_ROUTES[searchParams.get('redirect')];

	try {
		await checkRateLimit(limiter, limitRequest).then((x) => {
			const { currentUsage, currentTtl, currentSize, rateLimitHeaders } = x;
			Object.assign(responseHeaders, rateLimitHeaders);
			Object.assign(ratelimitLog, { currentUsage, currentTtl, currentSize });
		});

		const sipkCookies = await getSipkCookies(request);

		if (envokeSession && sipkCookies['serviceAccessTokenCookie']) {
			const { error } = await supabase.auth.signOut(
				sipkCookies['serviceAccessTokenCookie']
			);
		}

		await resetSipkCookies(
			Object.keys(sipkCookies).filter((key) => sipkCookies[key])
		);

		if (redirectPathname) {
			const target = new URL(
				redirectPathname,
				process.env.NEXT_PUBLIC_SIPK_URL
			);
			searchParams.forEach((val, key) => {
				if (key !== 'redirect' && key !== 'envoke_session') {
					target.searchParams.set(key, val);
				}
			});

			return cors(
				request,
				NextResponse.redirect(target, {
					headers: responseHeaders,
					status: 307
				}),
				routeCorsOptions
			);
		} else {
			return cors(
				request,
				new Response(null, { status: 204, headers: responseHeaders }),
				routeCorsOptions
			);
		}
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
