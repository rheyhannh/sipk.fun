/**
 * @typedef MatkulData
 * @type {object}
 * @property {string} id Id matakuliah
 * @property {string} nama Nama matakuliah
 * @property {number} semester Semester matakuliah
 * @property {number} sks Sks matakuliah
 * @property {{indeks:string, bobot:float, akhir:float}} nilai Nilai matakuliah
 * @property {boolean} dapat_diulang Boolean matakuliah dapat diulang atau tidak
 * @property {string} owned_by Id user pemilik matakuliah
 * @property {{indeks:string, bobot: float}} target_nilai Target nilai matakuliah
 * @property {number} created_at Unix timestamp matakuliah dibuat
 * @property {number} updated_at Unix timestamp terakhir matakuliah diperbarui
 * @property {number} deleted_at Unix timestamp matakuliah dihapus
 */

export const SupabaseTypes = {}