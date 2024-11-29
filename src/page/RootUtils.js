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

export const generateRandomNumberFixedRange = (min = 100, max = 500) => {
    if (min > max) { min = 100; max = 500; }

    const randomValue = Math.random() * (max - min) + min;
    const sign = Math.random() < 0.5 ? -1 : 1;

    return randomValue * sign;
}

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

/** 
 * Method untuk mengganti placeholder dalam string dengan nilai yang sesuai dari objek variables.
 * Placeholder ditandai dengan kurung kurawal `{}` dan harus sesuai dengan key di objek `variables`.
 * Jika key placeholder tidak ada di objek `variables`, placeholder akan diubah menjadi teks yang digunakan pada `defaultValue`
 * 
 * Untuk lebih jelasnya dapat lihat contoh pada `example`
 * @param {string} template String yang mengandung placeholder dalam format `{key}`
 * @param {Object<string,any>} variables Objek yang memiliki pasangan key dan value, di mana key sesuai dengan placeholder
 * @param {string} [defaultValue] Default value saat data dengan key tertentu tidak tersedia, default : `'null'`
 * @returns {string} String hasil dengan placeholder yang sudah diganti nilai sesuai
 * @example 
 * ```js
 * const data = [
 *      { id: 'xyz', value: 3 },
 *      { id: 'abc', value: 2 },
 *      { id: 'jkl', value: 9 }
 * ]
 * const variables = {
 *      jumlah_data: data.length,
 *      nilai_dataTerakhir: data[length - 1].value,
 *      nilai_data_pertama: data[0].value,
 *      id_datake2: data[1].id
 * }
 * const template = 'Saat {ini} tersedia {jumlah_data} data dengan nilai data terakhir {nilai_dataTerakhir}, nilai data pertama {nilai_data_pertama} dan id data ke-2 {id_datake2}'
 * 
 * const replaced = replacePlaceholders(template, variables, 'ini');
 * 
 * console.log(replaced) // Saat ini tersedia 3 data dengan nilai data terakhir 9, nilai data pertama 3 dan id data ke-2 abc
 * ```
*/
export const replacePlaceholders = (template, variables = {}, defaultValue = 'null') => {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        return variables[key] ?? defaultValue;
    });
};