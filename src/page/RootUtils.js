/** 
 * Method untuk generate angka bulat acak pada batasan tertentu
 * @param {number} min Minimal angka yang digenerate 
 * @param {number} max Maksimal angka yang digenerate
 * @returns {number} Angka bulat acak dengan range `min` dan `max`
 * @example 
 * ```js
 * console.log(generateRandomNumber(3, 25)) // ex: 12
 * ```
*/
export const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** 
 * Method untuk generate angka float acak dengan 2 angka dibelakang koma pada batasan tertentu
 * @param {number} min Minimal angka yang digenerate 
 * @param {number} max Maksimal angka yang digenerate
 * @returns {number} Angka float acak dengan dengan range `min` dan `max`
 * @example 
 * ```js
 * console.log(generateRandomFloat(11, 19)) // ex: 13.25
 * ```
*/
export const generateRandomFloat = (min, max) => {
    const randomFloat = Math.random() * (max - min) + min;
    return Math.round(randomFloat * 100) / 100;
};

/** 
 * Method untuk menghitung persentase dengan pembulatan angka dan tidak mungkin lebih dari 100
 * @param {number} value Angka yang dibagi
 * @param {number} target Angka pembagi
 * @returns {number} Persentase dengan pembulatan angka
 * @example 
 * ```js
 * console.log(calculatePercentage(24, 97)) // 24
 * ```
*/
export const calculatePercentage = (value, target) => {
    const percentage = Math.round((value / target) * 100);
    return Math.min(percentage, 100);
};

/** 
 * Method untuk mengacak index array
 * @template T
 * @param {Array<T>} array Array yang ingin diacak
 * @returns {Array<T>} Array dengan index yang sudah diacak
 * @example 
 * ```js
 * const arr = ['xyz', 'abc', 'ghi', 'opq', 'rst'];
 * console.log(shuffleArray(arr)) // ex: ['abc', 'opq', 'xyz', 'opq', 'ghi'];
 * ```
*/
export const shuffleArray = (array) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/** 
 * Method untuk mencari index pada array dengan string tertentu
 * @param {string} str String yang ingin dicari didalam array
 * @param {Array<string>} arr Array yang digunakan
 * @returns {number} Index dengan string yang dicari, jika tidak ditemukan atau param `arr` tidak tersedia atau bukan array, maka return `0`
 * @example 
 * ```js
 * const arr = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet']
 * console.log (findArrayIndexByString('dolor', arr)) // 2
 * console.log (findArrayIndexByString('xyz', arr)) // 0
 * console.log (findArrayIndexByString('sit', {})) // 0
 * console.log (findArrayIndexByString('amet')) // 0
 * ```
*/
export const findArrayIndexByString = (str, arr) => {
    if (!arr | !Array.isArray(arr)) return 0;
    const index = arr.indexOf(str);
    return index === -1 ? 0 : index;
};