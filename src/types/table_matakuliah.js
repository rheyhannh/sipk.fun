/** Id column yang tersedia pada tabel matakuliah
 * @typedef {'nomor' | 'matakuliah' | 'semester' | 'sks' | 'nilai' | 'diulang' | 'target' | 'ontarget'} ColumnId
 */

/** Title column yang tersedia pada tabel matakuliah
 * @typedef {'Nomor' | 'Matakuliah' | 'Semester' | 'Sks' | 'Nilai' | 'Bisa Diulang' | 'Target Nilai' | 'On Target'} ColumnTitle
 */

/** Pengaturan atau preferensi tabel matakuliah yang dapat diatur
 * @typedef {Object} PreferencesProps
 * @property {number} size
 * Jumlah maksimal matakuliah yang tampil pada tabel untuk 1 halaman. Dapat bernilai `-1` dimana menampilkan semua matakuliah yang ada.
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

/** State table yang diperoleh dari `sessionStorage`
 * @typedef {Object} TableState
 * @property {number | null} tab
 * Tab table yang sedang aktif dimana,
 * - `0` : Semua matakuliah
 * - `1` : Matakuliah yang dihapus
 * - `2` : Matakuliah yang diedit
 * @property {boolean | null} rowAction
 * State element row action dimana saat `true` element tampil jika `false` maka tidak
 * @property {Array<{id:ColumnId, value: any}> | null} columnFilters
 * Array yang berisikan object dengan props `id` dan `value` untuk mendeskripsikan column mana yang sedang difilter serta nilainya. Value dapat bernilai sebagai berikut,
 * - `[string, string]` : Sebuah range dimana index pertama sebagai nilai `min` dan kedua sebagai nilai `max`
 * - `string` : Keyword tertentu
 * - `Array<string>` : Array yang berisikan kumpulan string
 * - `boolean` : Boolean sebagai flag sebuah atribut
 *
 * ```js
 * // Contoh
 * const columnFilters = [
 *      { id:'sks', value: ['2', '4'] },
 *      { id:'semester', value: '1' },
 *      { id:'matakuliah', value: 'xyz' },
 *      { id:'ontarget', value: true },
 *      { id:'nilai', value: ['A', 'C', 'D+', 'E'] }
 * ]
 * // Memfilter matakuliah dengan sks 2 sampai 4 dimana matakuliah semester 1 dan matakuliah yang mengandung keyword 'xyz' yang sesuai target 'ontarget' yang nilainya salah satu dari ['A', 'C', 'D+', 'E']
 * ```
 * @property {PreferencesProps['columnOrder'] | null} columnOrder
 * @property {Array<{id:ColumnId, desc:boolean}> | null} columnSorting
 * Array yang berisikan object dengan props `id` dan `desc` untuk mendeskripsikan column mana yang sedang disorting dan apakah secara descending atau tidak
 * ```js
 * // Contoh
 * const columnSorting = [
 *      { id:'semester', desc: false }
 * ]
 * // Sorting berdasarkan column 'semester' tanpa descending
 * ```
 * @property {PreferencesProps['columnVisibility'] | null} columnVisibility
 * @property {PreferencesProps['size'] | null} pageSize
 * @property {number | null} pageIndex
 * Halaman tabel yang sedang aktif
 * @property {PreferencesProps['controlPosition'] | null} pageControlPosition
 */

export const TableMatakuliahTypes = {};
