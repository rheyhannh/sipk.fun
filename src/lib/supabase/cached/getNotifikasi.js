'use server'

const nextOptions = /** @type {RequestInit['next']} */ ({
    revalidate: 3600, // Every 1 hours
    tags: ['notifikasi']
})

/**
 * Method untuk fetch data `notifikasi` menggunakan supabase service role key dengan response yang dicache Nextjs.
 * 
 * Data akan direvalidasi menggunakan time-based revalidation dengan {@link nextOptions opsi ini}
 * dan dapat direvalidasi secara on-demand melalui API SIPK
 * 
 * `POST /service/revalidate-cache`
 * 
 * @async
 * @serverComponents
 * @returns {Promise<Array<import('@/types/supabase').NotifikasiData>>} Data notifikasi
 */
export default async function getNotifikasi() {
    const response = await fetch(
        process.env.SUPABASE_API_URL + '/notifikasi',
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