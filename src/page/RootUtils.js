export const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateRandomFloat = (min, max) => {
    const randomFloat = Math.random() * (max - min) + min;
    return Math.round(randomFloat * 100) / 100;
};

export const calculatePercentage = (value, target) => {
    const percentage = Math.round((value / target) * 100);
    return Math.min(percentage, 100);
};

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