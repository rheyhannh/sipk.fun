// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

/**
 * Method untuk hitung perolehan IPK berdasarkan seluruh {@link matkul matakuliah} dengan tahap berikut,
 * 
 * 1. Menghitung total SKS dari seluruh matakuliah 
 * 2. Menghitung total nilai akhir dari seluruh matakuliah
 * 3. Perolehan IPK dihitung dengan membagi total nilai akhir dengan total SKS
 * 4. Melakukan pembulatan 2 angka dibelakang koma
 * 
 * Pastikan {@link matkul} merupakan `Array` dengan length `!== 0` atau method tidak akan menghitung perolehan IPK sehingga return `-1`
 * 
 * @param {Array<SupabaseTypes.MatkulData>} matkul Array yang berisikan matakuliah
 * @returns {string} Perolehan IPK dalam `string` dengan pembulatan 2 angka dibelakang koma, jika terjadi error return `-1`
 */
export const getUserIpk = (matkul) => {
  if (Array.isArray(matkul) && matkul.length !== 0) {
    const totalSks = getUserSks(matkul);
    if (totalSks === -1 || totalSks === 0) return -1;

    const { totalNilaiAkhir } = matkul.reduce((sum, current) => {
      return {
        totalNilaiAkhir: sum.totalNilaiAkhir + current.nilai.akhir
      };
    }, { totalNilaiAkhir: 0 }
    );
    return (totalNilaiAkhir / totalSks).toFixed(2);
  }

  return -1
}

/**
 * Method untuk hitung persentase perolehan IPK berdasarkan {@link SupabaseTypes.UserData.ipk_target ipk target} dengan tahap berikut,
 * 
 * 1. Menghitung perolehan IPK dari seluruh {@link matkul matakuliah}
 * 2. Persentase perolehan IPK dihitung dengan membagi perolehan ipk dengan ipk target
 * 3. Melakukan pembulatan angka menjadi bilangan bulat terhadap hasil perhitungan
 * 4. Jika hasil lebih dari `100`, maka method akan return `100` sehingga hasil akan selalu berada pada range `0` sampai `100`
 * 
 * Pastikan {@link user} dan {@link matkul} merupakan `Array` dengan length `!== 0` atau method tidak akan menghitung persentase perolehan IPK sehingga return `-1`
 * 
 * @param {Array<SupabaseTypes.UserData} user Array yang berisikan data user
 * @param {Array<SupabaseTypes.MatkulData>} matkul Array yang berisikan matakuliah
 * @returns {number} Persentase perolehan IPK dalam bilangan bulat, jika terjadi error return `-1`
 */
export const getUserIpkPercentage = (user, matkul) => {
  if (Array.isArray(user) && user.length !== 0 && Array.isArray(matkul) && matkul.length !== 0) {
    const ipk = parseFloat(getUserIpk(matkul));
    const ipkTarget = user[0]?.ipk_target;
    const ipkPercentage = ipkTarget ? Math.round((ipk / ipkTarget) * 100) : Math.round((ipk / 4) * 100);

    return ipkPercentage > 100 ? 100 : ipkPercentage
  }

  return -1
}

/**
 * Method untuk hitung perolehan SKS berdasarkan seluruh {@link matkul matakuliah}.
 * 
 * Pastikan {@link matkul} merupakan `Array` dengan length `!== 0` atau method tidak akan menghitung perolehan SKS sehingga return `-1`
 * 
 * @param {Array<SupabaseTypes.MatkulData>} matkul Array yang berisikan matakuliah
 * @returns {number} Perolehan SKS, jika terjadi error return `-1`
 */
export const getUserSks = (matkul) => {
  if (Array.isArray(matkul) && matkul.length !== 0) {
    const { totalSks } = matkul.reduce((sum, current) => {
      return {
        totalSks: sum.totalSks + current.sks,
      };
    }, { totalSks: 0 }
    );
    return totalSks;
  }

  return -1
}

/**
 * Method untuk hitung persentase perolehan SKS berdasarkan {@link SupabaseTypes.UserData.sks_target sks target} dengan tahap berikut,
 * 
 * 1. Menghitung perolehan SKS dari seluruh {@link matkul matakuliah}
 * 2. Persentase perolehan SKS dihitung dengan membagi perolehan sks dengan sks target
 * 3. Melakukan pembulatan angka menjadi bilangan bulat terhadap hasil perhitungan
 * 4. Jika hasil lebih dari `100`, maka method akan return `100` sehingga hasil akan selalu berada pada range `0` sampai `100`
 * 
 * Pastikan {@link user} dan {@link matkul} merupakan `Array` dengan length `!== 0` atau method tidak akan menghitung persentase perolehan SKS sehingga return `-1`
 * 
 * @param {Array<SupabaseTypes.UserData} user Array yang berisikan data user
 * @param {Array<SupabaseTypes.MatkulData>} matkul Array yang berisikan matakuliah
 * @returns {number} Persentase perolehan SKS dalam bilangan bulat, jika terjadi error return `-1`
 */
export const getUserSksPercentage = (user, matkul) => {
  if (Array.isArray(user) && user.length !== 0 && Array.isArray(matkul) && matkul.length !== 0) {
    const sks = getUserSks(matkul);
    const sksTarget = user[0]?.sks_target;
    const sksPercentage = sksTarget ? Math.round((sks / sksTarget) * 100) : Math.round((sks / 144) * 100);

    return sksPercentage > 100 ? 100 : sksPercentage
  }

  return -1
}

/**
 * Method untuk hitung perolehan matakuliah berdasarkan seluruh {@link matkul matakuliah}.
 * 
 * Pastikan {@link matkul} merupakan `Array` dengan length `!== 0` atau method tidak akan menghitung perolehan matakuliah sehingga return `-1`
 * 
 * @param {Array<SupabaseTypes.MatkulData>} matkul Array yang berisikan matakuliah
 * @returns {number} Perolehan matakuliah, jika terjadi error return `-1`
 */
export const getUserMatkul = (matkul) => {
  if (Array.isArray(matkul) && matkul.length !== 0) {
    return matkul.length
  }

  return -1
}

/**
 * Method untuk hitung persentase perolehan matakuliah berdasarkan {@link SupabaseTypes.UserData.matkul_target matakuliah target} dengan tahap berikut,
 * 
 * 1. Menghitung perolehan matakuliah dari seluruh {@link matkul matakuliah}
 * 2. Persentase perolehan matakuliah dihitung dengan membagi perolehan matakuliah dengan matakuliah target
 * 3. Melakukan pembulatan angka menjadi bilangan bulat terhadap hasil perhitungan
 * 4. Jika hasil lebih dari `100`, maka method akan return `100` sehingga hasil akan selalu berada pada range `0` sampai `100`
 * 
 * Pastikan {@link user} dan {@link matkul} merupakan `Array` dengan length `!== 0` atau method tidak akan menghitung persentase perolehan matakuliah sehingga return `-1`
 * 
 * @param {Array<SupabaseTypes.UserData} user Array yang berisikan data user
 * @param {Array<SupabaseTypes.MatkulData>} matkul Array yang berisikan matakuliah
 * @returns {number} Persentase perolehan matakuliah dalam bilangan bulat, jika terjadi error return `-1`
 */
export const getUserMatkulPercentage = (user, matkul) => {
  if (Array.isArray(user) && user.length !== 0 && Array.isArray(matkul) && matkul.length !== 0) {
    const matkulTotal = matkul.length;
    const matkulTarget = user[0]?.matkul_target;
    const matkulPercentage = matkulTarget ? Math.round((matkulTotal / matkulTarget) * 100) : Math.round((matkulTotal / 50) * 100)

    return matkulPercentage > 100 ? 100 : matkulPercentage
  }

  return -1
}

/**
 * Method untuk menghitung semester yang tersedia dari seluruh {@link matkul matakuliah}.
 * 
 * Pastikan {@link matkul} merupakan `Array` dengan length `!== 0` atau method tidak akan menghitung semester yang tersedia sehingga return `-1`
 * 
 * @param {Array<SupabaseTypes.MatkulData>} matkul Array yang berisikan matakuliah
 * @param {boolean} [sort] Urutkan dari semester terkecil, default: `false`
 * @returns {Array<number>} Array yang berisikan semester yang tersedia, jika terjadi error return `-1`
 * @example 
 * ```js
 * const matkul = [
 *    { nama: 'Jaringan Komputer', semester: 3 }, 
 *    { nama: 'Algoritma Data', semester: 2 }, 
 *    { nama: 'Bahasa Indonesia', semester: 3 }, 
 *    { nama: 'Bahasa Inggris', semester: 5 }, 
 *    { nama: 'Kewarganegaraan', semester: 1 }, 
 *    { nama: 'Matematika Komputasi', semester: 7 }
 * ]
 * 
 * console.log(getAllSemester(matkul, false)) // [3, 2, 5, 1, 7]
 * console.log(getAllSemester(matkul, true)) // [1, 2, 3, 5, 7]
 * ```
 * 
 */
export const getAllSemester = (matkul, sort = false) => {
  if (Array.isArray(matkul) && matkul.length !== 0) {
    const allSemester = [...new Set(matkul.map(item => item.semester))];
    return sort ? allSemester.sort((x, y) => x - y) : allSemester;
  }

  return [];
}

/**
 * Object yang merepresentasikan statistik dari total nilai akhir, total SKS dan total matakuliah dari {@link getStatsSemesterReturnType.semester semester} tertentu
 * 
 * ```js
 * const myObj = {
 *    semester: 3,
 *    totalNilai : 52, // Total nilai pada semester 3 
 *    totalSks: 20, // Total SKS pada semester 3 
 *    count: 10, // Total matakuliah pada semester 3 
 * }
 * ```
 * 
 * @typedef {Object} getStatsSemesterReturnType
 * @property {number} semester Semester ke-n
 * @property {number} totalNilai Total nilai akhir dari setiap matakuliah pada {@link getStatsSemesterReturnType.semester semester} tertentu
 * @property {number} totalSks Total perolehan SKS dari setiap matakuliah pada {@link getStatsSemesterReturnType.semester semester} tertentu
 * @property {number} count Total matakuliah pada {@link getStatsSemesterReturnType.semester semester} tertentu
*/

/**
 * Method untuk menghitung statistik per-semester berupa total nilai akhir, total SKS dan total matakuliah dari seluruh {@link matkul matakuliah}.
 * 
 * Pastikan {@link matkul} merupakan `Array` dengan length `!== 0` atau method akan return `-1`
 * 
 * @param {Array<SupabaseTypes.MatkulData>} matkul Array yang berisikan matakuliah
 * @param {boolean} [sort] Urutkan dari semester terkecil, default: `false`
 * @returns {Array<getStatsSemesterReturnType>} Array yang berisikan {@link getStatsSemesterReturnType statistik} per-semester berupa total nilai akhir, total SKS dan total matakuliah, jika terjadi error return `-1`
 */
export const getStatsSemester = (matkul, sort = false) => {
  if (Array.isArray(matkul) && matkul.length !== 0) {
    const groupBySemester = matkul.reduce((acc, item) => {
      const key = item.semester;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    const statsSemester = Object.values(groupBySemester).map(group => {
      const totalNilai = group.reduce((sum, item) => sum + item.nilai.akhir, 0);
      const totalSks = group.reduce((sum, item) => sum + item.sks, 0);
      const count = group.length;
      const semester = group[0].semester;

      return { totalNilai, totalSks, count, semester };
    });

    return sort ? statsSemester.sort((a, b) => a.semester - b.semester) : statsSemester;
  }

  return [];
}

/**
 * Object yang merepresentasikan jumlah matakuliah yang sesuai dan tidak sesuai target pada {@link getOnAndOffTargetReturnType.semester semester} tertentu
 * 
 * ```js
 * const myObj = {
 *    semester: 2,
 *    on_target : { matkul: 3, sks: 7 },
 *    off_target : { matkul: 1, sks: 2 }
 * }
 * ```
 * 
 * Contoh diatas merupakan contoh pada semester 2, dimana jumlah matakuliah yang mencapai target `3` dengan total sks `7` dan
 * matakuliah yang tidak mencapai target `1` dengan total sks `2`
 * 
 * @typedef {Object} getOnAndOffTargetReturnType
 * @property {number} semester Semester ke-n
 * @property {{matkul:number, sks:number}} on_target Jumlah matakuliah dan sks yang mencapai target pada {@link getOnAndOffTargetReturnType.semester semester} tertentu
 * @property {{matkul:number, sks:number}} off_target Jumlah matakuliah dan sks yang tidak mencapai target pada {@link getOnAndOffTargetReturnType.semester semester} tertentu
*/

/**
 * Method untuk menghitung statistik per-semester berupa jumlah matakuliah dan sks yang sesuai target dan tidak sesuai target dari seluruh {@link matkul matakuliah}.
 * 
 * Pastikan {@link matkul} merupakan `Array` dengan length `!== 0` atau method akan return `-1`
 * 
 * @param {Array<SupabaseTypes.MatkulData>} matkul Array yang berisikan matakuliah
 * @returns {Array<getOnAndOffTargetReturnType>} Array yang berisikan {@link getOnAndOffTargetReturnType statistik} per-semester berupa jumlah matakuliah dan sks yang sesuai target dan tidak sesuai target, jika terjadi error return `-1`
 */
export const getOnAndOffTarget = (matkul) => {
  if (Array.isArray(matkul) && matkul.length !== 0) {
    const groupBySemester = matkul.reduce((acc, item) => {
      const key = item.semester;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    const result = Object.values(groupBySemester).map(group => {
      const semester = group[0].semester;
      const on = group.filter(item => item.nilai.bobot >= item.target_nilai.bobot);
      const off = group.filter(item => item.nilai.bobot < item.target_nilai.bobot);
      const on_target = { matkul: on.length, sks: on.reduce((sum, item) => sum + item.sks, 0) };
      const off_target = { matkul: off.length, sks: off.reduce((sum, item) => sum + item.sks, 0) };

      return { semester, on_target, off_target };
    })

    return result;
  }

  return [];
}

/**
 * Object yang merepresentasikan sebaran nilai seluruh matakuliah dimana key `x` mereferensikan semester tertentu atau seluruh semester jika `semua`.
 * 
 * ```js
 * const example = { 
 *    'semester1': [], // Sebaran nilai pada semester 1
 *    'semester3': [], // Sebaran nilai pada semester 3
 *    'semua': []  // Sebaran nilai seluruh semester
 * };
 * ```
 * 
 * Setiap key berisikan array yang mendeskripsikan jumlah matakuliah dan sks dengan `nilai` tersebut,
 * 
 * ```js
 * const example = {
 *    'semester3' : [
 *        { nilai: 'A', matkul: 3, sks: 7 },
 *        { nilai: 'C', matkul: 1, sks: 2 },
 *        { nilai: 'E', matkul: 0, sks: 0 }
 *    ]
 * }
 * ```
 * 
 * Contoh diatas menggambarkan pada semester 3 terdapat 3 matakuliah dengan total 7 sks yang bernilai `A`,
 * 1 matakuliah dengan total 2 sks yang bernilai `C` dan 0 matakuliah dengan total 0 sks yang bernilai `E`
 * 
 * @typedef {Object<string, Array<{nilai:string, matkul:number, sks:number, weight:number}>>} getDistribusiNilaiReturnType
*/

/**
 * Method untuk menghitung sebaran nilai dari seluruh {@link matkul matakuliah}.
 * 
 * Pastikan {@link matkul} merupakan `Array` dengan length `!== 0` atau method akan return `-1`
 * 
 * @param {Array<SupabaseTypes.MatkulData>} matkul Array yang berisikan matakuliah
 * @param {SupabaseTypes.UniversitasData['penilaian']} penilaian Sistem `penilaian` yang digunakan
 * @param {boolean} asc Urutkan berdasarkan bobot nilai dimana saat `truthy` dari yang terkecil, sedangkan saat `falsy` dari yang terbesar, default `false`
 * @returns {getDistribusiNilaiReturnType} {@link getDistribusiNilaiReturnType Sebaran nilai} dari seluruh matakuliah, jika terjadi error return `-1`
 */
export const getDistribusiNilai = (matkul, penilaian, asc = false) => {
  if (Array.isArray(matkul) && matkul.length !== 0) {
    const result = {};

    matkul.forEach(matakuliah => {
      const semesterKey = `semester${matakuliah.semester}`;

      if (!result['semua']) { result['semua'] = []; }
      if (!result[semesterKey]) { result[semesterKey] = []; }

      Object.keys(penilaian).forEach(indeksNilai => {
        const nilai = result[semesterKey].find(item => item.nilai === indeksNilai);
        const semua = result['semua'].find(item => item.nilai === indeksNilai);

        if (nilai) {
          nilai.matkul += (matakuliah.nilai.indeks === indeksNilai) ? 1 : 0;
          nilai.sks += (matakuliah.nilai.indeks === indeksNilai) ? matakuliah.sks : 0;
        } else {
          result[semesterKey].push({
            nilai: indeksNilai,
            matkul: (matakuliah.nilai.indeks === indeksNilai) ? 1 : 0,
            sks: (matakuliah.nilai.indeks === indeksNilai) ? matakuliah.sks : 0,
            weight: penilaian[indeksNilai].weight,
          });
        }

        if (semua) {
          semua.matkul += (matakuliah.nilai.indeks === indeksNilai) ? 1 : 0;
          semua.sks += (matakuliah.nilai.indeks === indeksNilai) ? matakuliah.sks : 0;
        } else {
          result['semua'].push({
            nilai: indeksNilai,
            matkul: (matakuliah.nilai.indeks === indeksNilai) ? 1 : 0,
            sks: (matakuliah.nilai.indeks === indeksNilai) ? matakuliah.sks : 0,
            weight: penilaian[indeksNilai].weight,
          });
        }
      });
    });

    Object.keys(result).forEach(semester => {
      result[semester] = result[semester].sort((a, b) => {
        return asc ? a.weight - b.weight : b.weight - a.weight;
      });
    });

    return result;
  }

  return -1;
}