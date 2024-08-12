// #region TYPE DEPEDENCY
import {
    User as SupabaseUser,
    Session as SupabaseSession,
    AuthError as SupabaseAuthError,
    PostgrestError as SupabasePostgrestError
} from '@supabase/supabase-js';
// #endregion

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

/**
 * @typedef MatkulHistoryData
 * @type {object}
 * @property {string} id Id history matakuliah
 * @property {object} current Current history matakuliah
 * @property {string} current.nama Nama matakuliah
 * @property {number} current.semester Semester matakuliah
 * @property {number} current.sks Sks matakuliah
 * @property {object} current.nilai Nilai matakuliah
 * @property {string} current.nilai.indeks Indeks nilai matakuliah
 * @property {float} current.nilai.bobot Bobot nilai matakuliah
 * @property {float} current.nilai.akhir Nilai akhir matakuliah
 * @property {boolean} current.dapat_diulang Boolean matakuliah dapat diulang atau tidak
 * @property {object} current.target_nilai Target nilai matakuliah
 * @property {string} current.target_nilai.indeks Indeks target nilai matakuliah
 * @property {float} current.target_nilai.bobot Bobot target nilai matakuliah
 * @property {'tambah'|'hapus'|'ubah'} current.type Tipe history matakuliah
 * @property {number} current.stamp Unix timestamp history matakuliah
 * @property {object} prev Previous history matakuliah
 * @property {string} prev.nama Nama matakuliah
 * @property {number} prev.semester Semester matakuliah
 * @property {number} prev.sks Sks matakuliah
 * @property {object} prev.nilai Nilai matakuliah
 * @property {string} prev.nilai.indeks Indeks nilai matakuliah
 * @property {float} prev.nilai.bobot Bobot nilai matakuliah
 * @property {float} prev.nilai.akhir Nilai akhir matakuliah
 * @property {boolean} prev.dapat_diulang Boolean matakuliah dapat diulang atau tidak
 * @property {object} prev.target_nilai Target nilai matakuliah
 * @property {string} prev.target_nilai.indeks Indeks target nilai matakuliah
 * @property {float} prev.target_nilai.bobot Bobot target nilai matakuliah
 * @property {'tambah'|'hapus'|'ubah'} prev.type Tipe history matakuliah
 * @property {number} prev.stamp Unix timestamp history matakuliah
 * @property {string} owned_by Id user pemilik history matakuliah
 * @property {number} last_change_at Unix timestamp perubahan terakhir history matakuliah
 * @property {string} matkul_id Id matakuliah
 */

/**
 * @typedef RatingData
 * @type {object}
 * @property {string} id Id rating
 * @property {number} rating Jumlah bintang atau rating (`1 - 5`)
 * @property {string} review Ulasan atau review
 * @property {string} owned_by Id user pemilik rating
 * @property {Date} created_at Tanggal rating dibuat
 * @property {number} unix_created_at Unix timestamp rating dibuat
 * @property {number} unix_updated_at Unix timestamp terakhir rating diperbarui
 * @property {object} details Details rating
 * @property {string} details.author Nama user pemilik rating
 * @property {0|1|2} details.authorType Tipe author rating
 * @property {string} details.universitas Universitas user pemilik rating
 */

/**
 * @typedef NotifikasiData
 * @type {object}
 * @property {string} title Judul atau headline notifikasi
 * @property {string} description Deskripsi notifikasi
 * @property {string} href Path atau link notifikasi
 * @property {object} icon Icon {@link https://react-icons.github.io/react-icons/ react-icons} yang digunakan
 * @property {string} icon.lib Library icon pada {@link https://react-icons.github.io/react-icons/ react-icons}, ex: `'fa', 'io5', etc`
 * @property {string} icon.name Nama icon pada {@link https://react-icons.github.io/react-icons/ react-icons}, ex: `'FaRocket', 'IoAdd', etc`
 * @property {string} color Warna atau variabel warna yang digunakan, ex: `'red', 'var(--some-color)', etc`
 * @property {Date} date_created_at Tanggal notifikasi dibuat
 * @property {number} unix_created_at Unix timestamp notifikasi dibuat
 */

/**
 * @typedef UniversitasData
 * @type {object}
 * @property {number} id Id universitas dalam bentuk integer
 * @property {string} nama Nama universitas dengan format pascal case
 * - Contoh : `'Universitas Brawijaya'`
 * @property {string} short Singkatan universitas dengan format uppercase
 * - Contoh : `'UB', 'ITB', 'UNDIP'`
 * @property {object} penilaian Penilaian universitas
 * @property {?string} penilaian.cat Kategori penilaian
 * - Contoh : `'baik', 'kurang', etc`
 * - Note : Pada beberapa universitas kategori tidak tersedia, gunakan optional chaining `?.` atau nullish coalescing `??` untuk menghindari error
 * @property {'success'|'warning'|'danger'|'crimson'} penilaian.style Style color penilaian
 * @property {float} penilaian.weight Bobot penilaian
 * @property {object} assets Assets universitas
 * @property {string} assets.logo Logo universitas dalam bentuk filename
 * - Contoh : `'logo_itb.png'`
 * @property {string} assets.desc Deskripsi universitas
 * @property {object} assets.style Universitas custom style
 * @property {object} assets.style.color Universitas custom color dalam bentuk `hex`
 * @property {string} assets.style.color.primary Universitas primary hex color, ex: `'#FBEA04'`
 * @property {string} assets.style.color.secondary Universitas secondary hex color, ex: `'#252422'`
 * @property {Date} created_at Tanggal universitas ditambahkan
 */

/**
 * @typedef FaktaData
 * @type {object}
 * @property {string} id Id fakta
 * @property {string} text Konten fakta
 * @property {object} details Details fakta
 * @property {Array<string>} details.tags Tags atau tagar fakta
 * @property {Date} created_at Tanggal fakta dibuat
 * @property {Date} updated_at Tanggal fakta diperbarui
 */

/**
 * @typedef UserMetadata
 * @type {object}
 * @property {string} fullname
 * Nama lengkap user
 * @property {string} university
 * Universitas user
 * @property {number} university_id
 * Id universitas user
 */

/**
 * @typedef {Omit<SupabaseUser, 'user_metadata'> & {user_metadata:UserMetadata}} User
 */

/**
 * @typedef {Omit<SupabaseSession, 'user'> & {user:User}} Session
 */

/**
 * Override `Session` type yang direturn dari `supabase.auth.getSession()`
 * @typedef {Object} _auth_getSession
 * @property {Object} data
 * Data yang diresolve dari supabase
 * @property {Session | null} data.session
 * Session user, jika autentikasi gagal maka bernilai `null`
 * @property {SupabaseAuthError} error
 */

/**
 * Override `User` dan `Session` type yang direturn dari `supabase.auth.verifyOtp()`
 * @typedef {Object} _auth_verifyOtp
 * @property {Object} data
 * Data yang diresolve dari supabase
 * @property {User | null} data.user
 * Data user, jika autentikasi gagal maka bernilai `null`
 * @property {Session | null} data.session
 * Session user, jika autentikasi gagal maka bernilai `null`
 * @property {SupabaseAuthError} error
 */

export const SupabaseTypes = {}