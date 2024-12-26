'use server'

const nextOptions = /** @type {RequestInit['next']} */ ({
    revalidate: 86400, // Every 24 hours
    tags: ['universitas']
})

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
 * @returns {Promise<Array<import('@/types/supabase').UniversitasData>>} Data universitas
 */
export default async function getUniversitas() {
    const response = await fetch(
        process.env.SUPABASE_API_URL + '/universitas',
        {
            method: 'GET',
            headers: {
                'apikey': process.env.SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
            },
            next: nextOptions
        }
    )

    return await response.json();
}