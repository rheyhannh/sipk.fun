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
 * @property {object} preferences User preferences
 * @property {object} preferences.table User table preferences
 * @property {number} preferences.table.size Jumlah matakuliah yang ditampilkan pada table
 * @property {0|1|2} preferences.table.controlPosition Posisi kontrol table
 * @property {['nomor'|'matakuliah'|'semester'|'sks'|'nilai'|'diulang'|'target'|'ontarget']} preferences.table.columnOrder Array untuk urutan table dari kiri ke kanan (index terkecil ke terbesar)
 * @property {object} preferences.table.columnVisibility Object untuk visibilitas kolom
 * @property {boolean} preferences.table.columnVisibility.nomor Boolean untuk menampilkan kolom `nomor` pada table
 * @property {boolean} preferences.table.columnVisibility.matakuliah Boolean untuk menampilkan kolom `matakuliah` pada table
 * @property {boolean} preferences.table.columnVisibility.semester Boolean untuk menampilkan kolom `semester` pada table
 * @property {boolean} preferences.table.columnVisibility.sks Boolean untuk menampilkan kolom `sks` pada table
 * @property {boolean} preferences.table.columnVisibility.nilai Boolean untuk menampilkan kolom `nilai` pada table
 * @property {boolean} preferences.table.columnVisibility.diulang Boolean untuk menampilkan kolom `diulang` pada table
 * @property {boolean} preferences.table.columnVisibility.target Boolean untuk menampilkan kolom `target` pada table
 * @property {boolean} preferences.table.columnVisibility.ontarget Boolean untuk menampilkan kolom `ontarget` pada table
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