// #region TYPE DEFINITION
/** @typedef {boolean | string | RegExp | (boolean | string | RegExp)[]} StaticOrigin */
/** @typedef {(origin: string | undefined, req:import('next/server').NextRequest) => StaticOrigin | Promise<StaticOrigin> } OriginFn */
/**
 * @typedef {Object} CorsOptions
 * @property {StaticOrigin | OriginFn} [origin] 
 * Asal `origin` yang diperbolehkan untuk permintaan `CORS`. Dapat berupa string, regex, array, atau fungsi yang mengembalikan asal yang diizinkan
 * 
 * ```js
 * // Default
 * process.env.NODE_ENV !== 'production' ? '*' : process.env.NEXT_PUBLIC_SIPK_URL
 * ```
 * 
 * Silahkan atur untuk setiap API routes/endpoint walaupun umumnya origin yang digunakan sama sehingga menggunakan opsi default.
 * @property {string | string[]} [methods]
 * Daftar metode HTTP yang diizinkan untuk digunakan dalam permintaan `CORS`, dapat berupa array atau string yang dipisah tanda koma
 * 
 * - Default : `'GET,POST,PUT,PATCH,DELETE'`
 * 
 * Silahkan atur untuk setiap API routes/endpoint karena umumnya method yang tersedia berbeda.
 * @property {string | string[]} [allowedHeaders]
 * Header yang diizinkan untuk dikirimkan oleh klien dalam permintaan `CORS`
 * 
 * - Default : `['authorization', 'x-api-key', 'content-type']`
 * 
 * Silahkan atur untuk setiap API routes/endpoint karena umumnya headers yang digunakan berbeda.
 * @property {string | string[]} [exposedHeaders]
 * Header yang diizinkan untuk diungkapkan kepada klien dalam respons `CORS`. Header yang tidak disebutkan di sini tidak dapat diakses oleh klien
 * 
 * - Default : `null`
 * 
 * Silahkan atur untuk setiap API routes/endpoint karena umumnya headers yang digunakan berbeda.
 * @property {boolean} [credentials]
 * Mengatur apakah kredensial diperbolehkan dalam permintaan `CORS`. Jika `true`, server akan menerima kredensial
 * 
 * - Default : `true`
 * 
 * Silahkan atur untuk setiap API routes/endpoint walaupun umumnya opsi yang digunakan sama sehingga menggunakan opsi default.
 * @property {number} [maxAge]
 * Waktu dalam detik yang mengizinkan browser untuk menyimpan hasil preflight request `CORS` dalam cache sebelum mengirimkan permintaan preflight baru
 * 
 * - Default : `86400`
 * 
 * Silahkan atur untuk setiap API routes/endpoint walaupun umumnya opsi yang digunakan sama sehingga menggunakan opsi default.
 * @property {boolean} [preflightContinue]
 * Jika `true`, server akan meneruskan permintaan preflight tanpa mengakhiri respons. Jika `false`, server akan merespons langsung setelah preflight
 * 
 * - Default : `false`
 * 
 * Silahkan atur untuk setiap API routes/endpoint walaupun umumnya opsi yang digunakan sama sehingga menggunakan opsi default.
 * @property {number} [optionsSuccessStatus]
 * Status kode HTTP yang digunakan untuk merespons permintaan OPTIONS preflight
 * 
 * - Default : `204`
 * 
 * Silahkan atur untuk setiap API routes/endpoint walaupun umumnya opsi yang digunakan sama sehingga menggunakan opsi default.
 */
// #endregion

/** 
 * Opsi default `CORS` yang digunakan
 */
export const DEFAULT_CORS_OPTIONS = /** @type {CorsOptions} */ ({
    origin: process.env.NODE_ENV !== 'production' ? '*' : process.env.NEXT_PUBLIC_SIPK_URL,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: ['authorization', 'x-api-key', 'content-type'],
    exposedHeaders: null,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    maxAge: 86400,
});

/**
 * Method untuk memeriksa apakah asal `origin` dari permintaan diizinkan sesuai dengan aturan yang diberikan
 * @param {string} origin
 * @param {StaticOrigin} allowed
 * @returns {boolean} Mengembalikan `true` jika asal yang diberikan sesuai dengan aturan yang diizinkan, `false` jika tidak
 */
function isOriginAllowed(origin, allowed) {
    return Array.isArray(allowed)
        ? allowed.some((o) => isOriginAllowed(origin, o))
        : typeof allowed === 'string'
            ? origin === allowed
            : allowed instanceof RegExp
                ? allowed.test(origin)
                : !!allowed;
}

/**
 * Mengatur header `CORS` untuk mengizinkan asal `origin` tertentu dalam respons
 * @param {string | undefined} reqOrigin
 * @param {StaticOrigin} origin
 * @returns {Headers} Mengembalikan objek `Headers` yang telah disesuaikan dengan aturan asal `origin` yang diizinkan
 */
function getOriginHeaders(reqOrigin, origin) {
    const headers = new Headers();

    if (origin === '*') {
        headers.set('Access-Control-Allow-Origin', '*');
    } else if (typeof origin === 'string') {
        headers.set('Access-Control-Allow-Origin', origin);
        headers.append('Vary', 'Origin');
    } else {
        const allowed = isOriginAllowed(reqOrigin ?? '', origin);

        if (allowed && reqOrigin) {
            headers.set('Access-Control-Allow-Origin', reqOrigin);
        }
        headers.append('Vary', 'Origin');
    }

    return headers;
}

/**
 * Method untuk mengambil dan mengatur header asal `origin` dari permintaan berdasarkan aturan `CORS` yang digunakan
 * @param {import('next/server').NextRequest} req
 * @param {StaticOrigin | OriginFn} origin
 * @returns {Promise<Headers | undefined>} Mengembalikan objek `Headers` dengan header `CORS` yang sesuai jika asal diizinkan, atau `undefined` jika tidak ada asal yang valid
 */
async function originHeadersFromReq(req, origin) {
    const reqOrigin = req.headers.get('Origin') || undefined;
    const value = typeof origin === 'function' ? await origin(reqOrigin, req) : origin;

    if (!value) return;
    return getOriginHeaders(reqOrigin, value);
}

/**
 * Method untuk mengambil dan mengatur header yang diizinkan dalam respons `CORS`
 * @param {import('next/server').NextRequest} req
 * @param {string | string[]} allowed
 * @returns {Headers} Mengembalikan objek `Headers`
 */
function getAllowedHeaders(req, allowed) {
    const headers = new Headers();

    if (!allowed) {
        allowed = req.headers.get('Access-Control-Request-Headers');
        headers.append('Vary', 'Access-Control-Request-Headers');
    } else if (Array.isArray(allowed)) {
        allowed = allowed.join(',');
    }
    if (allowed) {
        headers.set('Access-Control-Allow-Headers', allowed);
    }

    return headers;
}

/**
 * Middleware untuk handle `CORS` pada response yang akan diberikan dengan menambahkan header tertentu berdasarkan opsi yang digunakan
 * @param {import('next/server').NextRequest} req Request yang diterima
 * @param {import('next/server').NextResponse} res Response yang diberikan
 * @param {CorsOptions} options Opsi `CORS` yang digunakan
 */
export default async function cors(req, res, options) {
    const opts = { ...DEFAULT_CORS_OPTIONS, ...options };
    const { headers } = res;
    const originHeaders = await originHeadersFromReq(req, opts.origin ?? false);
    const mergeHeaders = (v, k) => {
        if (k === 'Vary') headers.append(k, v);
        else headers.set(k, v);
    };

    if (!originHeaders) return res;

    originHeaders.forEach(mergeHeaders);

    if (opts.credentials) {
        headers.set('Access-Control-Allow-Credentials', 'true');
    }

    const exposed = Array.isArray(opts.exposedHeaders) ? opts.exposedHeaders.join(',') : opts.exposedHeaders;

    if (exposed) {
        headers.set('Access-Control-Expose-Headers', exposed);
    }

    if (req.method === 'OPTIONS') {
        if (opts.methods) {
            const methods = Array.isArray(opts.methods)
                ? opts.methods.join(',')
                : opts.methods;

            headers.set('Access-Control-Allow-Methods', methods);
        }

        getAllowedHeaders(req, opts.allowedHeaders).forEach(mergeHeaders);

        if (typeof opts.maxAge === 'number') {
            headers.set('Access-Control-Max-Age', String(opts.maxAge));
        }

        if (opts.preflightContinue) return res;

        headers.set('Content-Length', '0');
        return new Response(null, { status: opts.optionsSuccessStatus, headers });
    }

    return res;
}