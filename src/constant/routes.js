/**
 * Object dengan key berisikan nama halaman yang tersedia pada SIPK dengan nilai pathnamenya.
 * Konteks halaman disini adalah yang dirender bukan sebuah `api`. Untuk api sendiri dapat dilihat {@link API_ROUTES disini}.
 * 
 * ```js
 * console.log(PAGE_ROUTES['dashboard']) // '/dashboard'
 * console.log(PAGE_ROUTES['magiclink']) // '/magiclink'
 * ```
 * 
 * - Untuk setiap subroute atau slash, kita menggunakan underscore atau garis bawah untuk pemisahnya.
 * 
 * ```js
 * console.log(PAGE_ROUTES['x_y_z']) // '/x/y/z'
 * console.log(PAGE_ROUTES['dashboard_matakuliah') // '/dashboard/matakuliah'
 * ```
 * 
 */
export const PAGE_ROUTES = {
    'dashboard': '/dashboard',
    'dashboard_matakuliah': '/dashboard/matakuliah',
    'faq': '/faq',
    'magiclink': '/magiclink',
    'panduan': '/panduan',
    'root': '/',
    'users': '/users',
}

/**
 * Object dengan key berisikan nama api yang tersedia pada SIPK dengan value prefix `/api` diikuti pathnamenya.
 * Untuk versi tanpa prefix dapat dilihat {@link API_ROUTES_WITHOUT_PREFIX disini}.
 * 
 * ```js
 * console.log(API_ROUTES['fakta']) // '/api/fakta'
 * console.log(API_ROUTES['logout']) // '/api/logout'
 * ```
 * 
 * - Untuk setiap subroute atau slash, kita menggunakan underscore atau garis bawah untuk pemisahnya.
 * 
 * ```js
 * console.log(API_ROUTES['auth_reset']) // '/api/auth/reset'
 * console.log(API_ROUTES['auth_check') // '/api/auth/check'
 * ```
 * 
 * - Untuk route dengan kata lebih dari 1, kita menggunakan tanda kurang atau minus untuk pemisahnya.
 * 
 * ```js
 * console.log(API_ROUTES['matkul-history']) // '/api/matkul-history'
 * console.log(API_ROUTES['lorem-ipsum-dolor']) // '/api/lorem-ipsum-dolor'
 * ```
 * 
 */
export const API_ROUTES = {
    'auth_check': '/api/auth/check',
    'auth_confirm': '/api/auth/confirm',
    'auth_reset': '/api/auth/reset',
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

/**
 * Object dengan key berisikan nama api yang tersedia pada SIPK dengan value pathnamenya.
 * Untuk versi dengan prefix dapat dilihat {@link API_ROUTES disini}.
 * 
 * ```js
 * console.log(API_ROUTES['fakta']) // '/fakta'
 * console.log(API_ROUTES['logout']) // '/logout'
 * ```
 * 
 * - Untuk setiap subroute atau slash, kita menggunakan underscore atau garis bawah untuk pemisahnya.
 * 
 * ```js
 * console.log(API_ROUTES['auth_reset']) // '/auth/reset'
 * console.log(API_ROUTES['auth_check') // '/auth/check'
 * ```
 * 
 * - Untuk route dengan kata lebih dari 1, kita menggunakan tanda kurang atau minus untuk pemisahnya.
 * 
 * ```js
 * console.log(API_ROUTES['matkul-history']) // '/matkul-history'
 * console.log(API_ROUTES['lorem-ipsum-dolor']) // '/lorem-ipsum-dolor'
 * ```
 * 
 */
export const API_ROUTES_WITHOUT_PREFIX = {
    'auth_check': '/auth/check',
    'auth_confirm': '/auth/confirm',
    'auth_reset': '/auth/reset',
    'fakta': '/fakta',
    'login': '/login',
    'logout': '/logout',
    'magiclink': '/magiclink',
    'matkul': '/matkul',
    'matkul-history': '/matkul-history',
    'me': '/me',
    'notifikasi': '/notifikasi',
    'password': '/password',
    'rating': '/rating',
    'register': '/register',
    'universitas': '/universitas',
}