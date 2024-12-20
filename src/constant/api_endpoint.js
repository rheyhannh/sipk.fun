/**
 * Object dengan key sebagai nama endpoint dengan value enpointnya. 
 * ```js
 * // Contoh
 * console.log(endpointByKey['fakta']) // '/api/fakta'
 * console.log(endpointByKey['auth/check']) // '/api/auth/check'
 * console.log(endpointByKey['rating']) // '/api/rating'
 * ```
 */
export const endpointByKey = {
    'auth/check': '/api/auth/check',
    'auth/confirm': '/api/auth/confirm',
    'auth/reset': '/api/auth/reset',
    'fakta': '/api/fakta',
    'login': '/api/login',
    'logout': '/api/logout',
    'magiclink': '/api/magiclink',
    'matkul': '/api/matkul',
    'matkul-history': '/api/matkul-history',
    'me': '/api/me',
    'notifikasi': '/api/notifikasi',
    'password': '/api/password',
    'rating': '/api/rating',
    'register': '/api/register',
    'universitas': '/api/universitas',
}