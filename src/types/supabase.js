/**
 * @typedef UserData
 * @type {object}
 * @property {string} id Id user
 * @property {string} email Email user
 * @property {boolean} is_email_confirmed Boolean apakah email sudah dikonfirmasi
 * @property {Date} email_confirmed_at Tanggal email dikonfirmasi
 * @property {boolean} is_banned Boolean apakah user diban
 * @property {Date} banned_until Tanggal berakhirnya ban user
 * @property {string} roles Roles user
 * @property {string} fullname Fullname user
 * @property {string} nickname Nickname user
 * @property {string} university University user
 * @property {number} university_id Id university user
 * @property {string} jurusan Jurusan atau program studi user
 * @property {number} sks_target Target sks user
 * @property {number} matkul_target Target matakuliah user
 * @property {float} ipk_target Target ipk user
 * @property {Date} created_at Tanggal user daftar
 * @property {Date} updated_at Tanggal terakhir user memperbarui datanya
 * @property {{table:{size:number, controlPosition:0|1|2, columnOrder:['nomor'|'matakuliah'|'semester'|'sks'|'nilai'|'diulang'|'target'|'ontarget'], columnVisibility:{nomor:boolean, matakuliah:boolean, semester:boolean, sks:boolean, nilai:boolean, diulang:boolean, target:boolean, ontarget:boolean} }}} preferences Preferences user
 */

/**
 * @typedef MatkulData
 * @type {object}
 * @property {string} id Id matakuliah
 * @property {string} nama Nama matakuliah
 * @property {number} semester Semester matakuliah
 * @property {number} sks Sks matakuliah
 * @property {object} nilai Nilai matakuliah
 * @property {string} nilai.indeks Indeks nilai matakuliah
 * @property {float} nilai.bobot Bobot nilai matakuliah
 * @property {float} nilai.akhir Nilai akhir matakuliah
 * @property {boolean} dapat_diulang Boolean matakuliah dapat diulang atau tidak
 * @property {string} owned_by Id user pemilik matakuliah
 * @property {object} target_nilai Target nilai matakuliah
 * @property {string} target_nilai.indeks Indeks target nilai matakuliah
 * @property {float} target_nilai.bobot Bobot target nilai matakuliah
 * @property {number} created_at Unix timestamp matakuliah dibuat
 * @property {number} updated_at Unix timestamp terakhir matakuliah diperbarui
 * @property {number} deleted_at Unix timestamp matakuliah dihapus
 */

export const SupabaseTypes = {}