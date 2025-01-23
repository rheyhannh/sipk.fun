'use server';

const nextOptions = /** @type {RequestInit['next']} */ ({
	revalidate: 10800, // Every 3 hours
	tags: ['rating']
});

/**
 * Method untuk fetch data `rating` menggunakan supabase service role key dengan response yang dicache Nextjs.
 *
 * Data akan direvalidasi menggunakan time-based revalidation dengan {@link nextOptions opsi ini}
 * dan dapat direvalidasi secara on-demand melalui API SIPK
 *
 * `POST /service/revalidate-cache`
 *
 * @async
 * @serverComponents
 * @returns {Promise<Array<import('@/types/supabase').RatingData>>} Data rating
 */
export default async function getRating() {
	const response = await fetch(process.env.SUPABASE_API_URL + '/rating', {
		method: 'GET',
		headers: {
			apikey: process.env.SUPABASE_SERVICE_KEY,
			Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`
		},
		next: nextOptions
	});

	return await response.json();
}
