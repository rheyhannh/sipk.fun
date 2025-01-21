/**
 * Custom `SWR` fetcher
 * @async
 * @template T
 * @param {URL} url Fetch `URL` target
 * @param {string} id User id
 * @param {string} accessToken User access token
 * @returns {Promise<T>}
 * @throws `SWRError`
 */
const fetcher = async (url, id, accessToken) => {
    if (!accessToken || !id) { throw new Error('Access token required') }
    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    })
        .then(async (response) => {
            if (!response.ok) {
                try {
                    const { message } = await response.json();
                    if (message) { throw new Error(`${message} (code: ${response.status})`); }
                    else { throw new Error(`Terjadi error (code: ${response.status})`); }
                } catch (error) {
                    throw error;
                }
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Gagal mengambil data:', error.message);
            throw error;
        });
}

export default fetcher;