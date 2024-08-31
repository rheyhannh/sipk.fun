/** Id column yang tersedia pada tabel matakuliah
 * @typedef {'nomor' | 'matakuliah' | 'semester' | 'sks' | 'nilai' | 'diulang' | 'target' | 'ontarget'} ColumnId
 */

/** Title column yang tersedia pada tabel matakuliah
 * @typedef {'Nomor' | 'Matakuliah' | 'Semester' | 'Sks' | 'Nilai' | 'Bisa Diulang' | 'Target Nilai' | 'On Target'} ColumnTitle
 */

/** Pengaturan atau preferensi tabel matakuliah yang dapat diatur
 * @typedef {Object} PreferencesProps
 * @property {number} size 
 * Jumlah maksimal matakuliah yang tampil pada tabel untuk 1 halaman
 * @property {0|1|2} controlPosition 
 * Letak kontrol table untuk mengganti halaman tabel dengan keterangan berikut,
 * - `0` : Terletak pada bawah tabel
 * - `1` : Terletak pada atas tabel
 * - `2` : Terletak pada bawah dan atas tabel
 * @property {Array<ColumnId} columnOrder 
 * Array yang berisikan `ColumnId` dimana urutan indexnya merepresentasikan urutan column. Index terkecil berada paling kiri, dan index terbesar berada paling kanan
 * ```js
 * const columnOrder = ['nomor', ..., 'sks'] 
 * // Column 'nomor' akan berada paling kiri sisi tabel, dan 'sks' akan berada paling kanan 
 * ```
 * @property {Record<ColumnId, boolean>} columnVisibility 
 * Object dengan key `ColumnId` dengan value `boolean`. Saat `true`, maka column tersebut akan tampil jika `false` maka tidak akan tampil
 * ```js
 * const columnVisibility = {
 *      nomor: true,
 *      sks: false, 
 *      ...
 * }
 * // Column 'nomor' tampil dan 'sks' tidak tampil
 * ```
 */

export const TableMatakuliahTypes = {}