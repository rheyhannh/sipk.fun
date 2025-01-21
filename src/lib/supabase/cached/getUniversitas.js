'use server';

const nextOptions = /** @type {RequestInit['next']} */ ({
	revalidate: 86400, // Every 24 hours
	tags: ['universitas']
});

/**
 * Method untuk fetch data `universitas` menggunakan supabase service role key dengan response yang dicache Nextjs.
 *
 * Data akan direvalidasi menggunakan time-based revalidation dengan {@link nextOptions opsi ini}
 * dan dapat direvalidasi secara on-demand melalui API SIPK
 *
 * `POST /service/revalidate-cache`
 *
 * @async
 * @serverComponents
 * @param {'desc' | 'asc'} [sort] Sort berdasarkan id universitas secara ascending dengan `asc` atau descending `desc`. Saat param ini falsy, data tidak akan disort, default: `asc`
 * @returns {Promise<Array<import('@/types/supabase').UniversitasData>>} Data universitas
 */
export default async function getUniversitas(sort = 'asc') {
	const response = await fetch(process.env.SUPABASE_API_URL + '/universitas', {
		method: 'GET',
		headers: {
			apikey: process.env.SUPABASE_SERVICE_KEY,
			Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`
		},
		next: nextOptions
	});

	const data =
		/** @type {Array<import('@/types/supabase').UniversitasData>} */ (
			await response.json()
		);

	if (sort === 'asc') return data.sort((a, b) => a.id - b.id);
	else if (sort === 'desc') return data.sort((a, b) => b.id - a.id);
	else return data;
}
