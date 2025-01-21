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
                const swrError = /** @type {import('@/hooks/swr/config').SWRError} */ (
                    new Error(`An error occurred while fetching the data with status ${response.status}`)
                );

                try {
                    const parsed = /** @type {import('@/constant/api_response').ClientAPIResponseErrorProps} */ (
                        await response.json()
                    );
                    swrError.info = parsed;
                    throw swrError;
                } catch (error) {
                    swrError.info = null;
                    throw swrError;
                }
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error.message);
            throw error;
        });
}

export default fetcher;