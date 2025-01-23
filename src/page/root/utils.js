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
export const generateRandomNumber = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Method untuk generate angka bulat beserta pemilihan positif atau negatif secara acak pada batasan tertentu
 * dengan param `max` harus lebih besar dari `min`, jika tidak maka akan menggunakan nilai default.
 *
 * Untuk detailnya dapat melihat contoh pada `example`
 * @param {number} [min] Minimal angka yang digenerate, default `100`
 * @param {number} [max] Maksimal angka yang digenerate, default `500`
 * @returns {number} Angka bulat beserta positif atau negatif yang dipilih secara acak dengan range `min` dan `max`
 * @example
 * ```js
 * // Dua contoh dibawah memiliki logic yang sama yaitu
 * // 1. Generate angka acak dari 42 sampai 242 atau -42 sampai 242
 * // 2. Pilih secara acak apakah angka yang digenerate akan menjadi positif atau negatif
 * console.log(generateRandomNumberFixedRange(42, 242)) // ex: 76
 * console.log(generateRandomNumberFixedRange(-42, 242)) // ex: -32
 *
 * // Contoh lainnya
 * console.log(generateRandomNumberFixedRange(0, 0)) // 0
 * console.log(generateRandomNumberFixedRange(-325, -325)) // -325 atau 325
 * console.log(generateRandomNumberFixedRange(232, 232)) // -232 atau 232
 * ```
 */
export const generateRandomNumberFixedRange = (min = 100, max = 500) => {
	if (min > max) {
		min = 100;
		max = 500;
	}

	const randomValue = Math.random() * (max - min) + min;
	const sign = Math.random() < 0.5 ? -1 : 1;

	return randomValue * sign;
};

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
 * dengan menyalin array terlebih dahulu menggunakan `slice` sehingga tidak mengubah source array.
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
export const replacePlaceholders = (
	template,
	variables = {},
	defaultValue = 'null'
) => {
	return template.replace(/\{(\w+)\}/g, (_, key) => {
		return variables[key] ?? defaultValue;
	});
};

/**
 * Method untuk menghitung jumlah karakter dan kata sebelumnya dari kata yang dipilih.
 * Hanya gunakan method ini untuk menghitung konten `statis`. Berikut adalah format dari array yang digunakan,
 *
 * ```js
 * const pArray = [
 *      ['Analytics'], // Index 0 sebagai paragraf 1
 *      ['that', 'helps', 'you'], // Index 1 sebagai paragraf 2
 *      ['shape', 'the', 'future'] // Index 2 sebagai paragraf 3
 * ]
 *
 * // Format pArray[pIndex][wIndex] - paragrafArray[indexParagraf][indexKata]
 * // Sehingga,
 * // pIndex dari 'that' = 1 dan wIndex = 0
 * // pIndex dari 'the' = 2 dan wIndex = 1
 * ```
 *
 * Return object dengan key `words` sebagai jumlah kata, `chars` sebagai jumlah huruf dan `-1` jika beberapa case berikut terjadi,
 * - Param `pArray` falsy atau bukan merupakan tipe array
 * - Param `str` falsy atau tidak tersedia pada `pArray`
 * - Param `pIndex` dan `wIndex` tidak tersedia pada `pArray`
 *
 * Jika terdapat kata yang sama, `pIndex` dan `wIndex` harus dipass karna akan menyebabkan kesalahan perhitungan
 * karna kata yang muncul terlebih dahulu akan dianggap sebagai kata yang dipilih. Untuk lebih jelasnya lihat contoh berikut,
 *
 * ```js
 * const same_words = [
 *      ['lorem', 'ipsum', 'dolor'],
 *      ['sit', 'lorem', 'ipsum']
 * ]
 * console.log(countPrevCharactersAndWords(same_words, true, 'lorem')); // { previousWords: 0, previousCharacters: 0 }
 * console.log(countPrevCharactersAndWords(same_words, true, 'ipsum')); // { previousWords: 1, previousCharacters: 5 }
 *
 * // Pada console.log pertama, 'lorem' yang dimaksud adalah pada paragraf kedua namun hasil yang diberikan adalah 'lorem' yang pertama tampil
 * // Pada console.log kedua, 'ipsum' yang dimaksud adalah pada paragraf kedua namun hasil yang diberikan adalah 'ipsum' yang pertama tampil
 * ```
 * @param {Array<Array<string>>} pArray Array yang mendeskripsikan kata dari setiap paragraf
 * @param {boolean} [countDifferentParaghraph] Boolean untuk menghitung jumlah karakter dan kata sebelumnya walaupun berada pada paragraf yang berbeda, default `true`
 * @param {string} str Kata yang dipilih untuk menghitung jumlah karakter dan kata sebelumnya
 * @param {number} [pIndex] Index paragraf dari kata yang digunakan pada param `str`
 * @param {number} [wIndex] Index kata dari kata yang digunakan pada param `str`
 * @returns {{words:number, chars:number} | -1}
 */
export const countPrevCharactersAndWords = (
	pArray,
	countDifferentParaghraph = true,
	str,
	pIndex = null,
	wIndex = null
) => {
	if (!pArray || !Array.isArray(pArray) || !str) return -1;
	if (
		!pArray[pIndex] ||
		!pArray[pIndex][wIndex] ||
		pArray[pIndex][wIndex] !== str
	)
		return -1;

	let words = 0;
	let chars = 0;

	for (let i = 0; i < pArray.length; i++) {
		for (let j = 0; j < pArray[i].length; j++) {
			if (pIndex !== null && wIndex !== null) {
				if (i === pIndex && j === wIndex && pArray[i][j] === str) {
					return { words, chars };
				}
			} else {
				if (pArray[i][j] === str) {
					return { words, chars };
				}
			}

			if (countDifferentParaghraph) {
				words += 1;
				chars += pArray[i][j].length;
			} else {
				if (pIndex === i) {
					words += 1;
					chars += pArray[i][j].length;
				}
			}
		}
	}

	return -1;
};
