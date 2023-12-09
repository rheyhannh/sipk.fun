// ========== COMPONENT DEPEDENCY ========== //

/*
============================== CODE START HERE ==============================
*/

// Date or Time Utility
/**
 * Method untuk mengubah unix timestamp ke format tanggal tertentu
 * @param {number} unix Milidetik dalam integer (ex: `Date.Now() / 1000`)
 * @param {string} [intlLocales=null] Unicode locale identifier (ex: `en-US`, `id-ID`, etc)
 * @param {object} [intlFormatOptions=null] Opsi pada `Intl.DateTimeFormatOptions`
 * @return {string} Format tanggal tertentu (ex: `Minggu, 03 Desember 2023`)
 */
export const unixToDate = (unix, intlLocales = null, intlFormatOptions = null) => {
    const date = new Date(unix * 1000);
    return date.toLocaleString(intlLocales || 'id-ID', intlFormatOptions || { dateStyle: 'full' });
}

// Message or Response Utility
/**
 * Method untuk mendapatkan pesan loading lucu/tidak dengan indeks tertentu atau random
 * @param {boolean} [funWord=false] Boolean untuk menggunakan kata lucu atau tidak. Default value `false`
 * @param {number} [index=true] Number untuk memilih index kata. Default value `true` yaitu menggunakan index random. Gunakan `number` untuk pilih indeks tertentu (tidak random).
 * @return {string} Pesan atau teks loading yang tersedia. Jika tidak tersedia default `funWord=true` 'Memproses Keajaiban', default `funWord=false` 'Memproses permintaanmu'
 */
export const getLoadingMessage = (funWord = false, index = true) => {
    const message = {
        fun: [
            'Memproses keajaiban',
            'Kunci adalah sabar',
            'Membaca pikiranmu'
        ],
        default: [
            'Memproses',
            'Memproses permintaanmu',
            'Tunggu sebentar',
        ]
    }

    const maximumIndex = funWord ? message.fun.length : message.default.length;
    const usedIndex = index === true ? Math.floor(Math.random() * maximumIndex) : index === 0 ? 0 : index;
    return funWord ? message.fun[usedIndex] || 'Memproses Keajaiban' : message.default[usedIndex] || 'Memproses permintaanmu';
}