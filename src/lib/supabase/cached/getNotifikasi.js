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
 * @param {'desc' | 'asc'} [sort] Sort berdasarkan kapan notifikasi dibuat secara ascending dengan `asc` atau descending `desc`. Saat param ini falsy, data tidak akan disort, default: `desc`
 * @returns {Promise<Array<import('@/types/supabase').NotifikasiData>>} Data notifikasi
 */
export default async function getNotifikasi(sort = 'desc') {
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

    const data = /** @type {Array<import('@/types/supabase').NotifikasiData>} */ (
        await response.json()
    );

    if (sort === 'asc') return data.sort((a, b) => a.unix_created_at - b.unix_created_at);
    else if (sort === 'desc') return data.sort((a, b) => b.unix_created_at - a.unix_created_at);
    else return data;
}