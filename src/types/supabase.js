// #region TYPE DEPEDENCY
import {
    User as SupabaseUser,
    Session as SupabaseSession,
    AuthError as SupabaseAuthError,
    PostgrestError as SupabasePostgrestError,
    WeakPassword as SupabaseWeakPassword,
    AuthenticatorAssuranceLevels,
    AMREntry,
} from '@supabase/supabase-js';
import * as Sipk from './sipk';
// #endregion

/**
 * @typedef {Object} UserData
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
 * @property {Object} preferences User preferences
 * @property {UserTablePreferencesProps} preferences.table User table preferences
 */

/**
 * @typedef {'nomor' | 'matakuliah' | 'semester' | 'sks' | 'nilai' | 'diulang' | 'target' | 'ontarget'} UserTableColumnsId
 */

/**
 * @typedef {Object} UserTablePreferencesProps
 * @property {number} size 
 * Jumlah maksimal matakuliah yang tampil pada tabel untuk 1 halaman
 * @property {0|1|2} controlPosition 
 * Letak kontrol table untuk mengganti halaman tabel dengan keterangan berikut,
 * - `0` : Terletak pada bawah tabel
 * - `1` : Terletak pada atas tabel
 * - `2` : Terletak pada bawah dan atas tabel
 * @property {Array<UserTableColumnsId} columnOrder 
 * Array yang berisikan `columnId` dimana urutan indexnya merepresentasikan urutan column. Index terkecil berada paling kiri, dan index terbesar berada paling kanan
 * ```js
 * const columnOrder = ['nomor', ..., 'sks'] 
 * // Column 'nomor' akan berada paling kiri sisi tabel, dan 'sks' akan berada paling kanan 
 * ```
 * @property {Record<UserTableColumnsId, boolean>} columnVisibility 
 * Object dengan key `columnId` dengan value `boolean`. Saat `true`, maka column tersebut akan tampil jika `false` maka tidak akan tampil
 * ```js
 * const columnVisibility = {
 *      nomor: true,
 *      sks: false, 
 *      ...
 * }
 * // Column 'nomor' tampil dan 'sks' tidak tampil
 * ```
 */

/**
 * @typedef {Object} MatkulData
 * @property {string} id 
 * Id matakuliah dalam bentuk `uuid-v4`
 * - Note : Diresolve dari `supabase`
 * @property {string} nama 
 * Nama matakuliah dengan kriteria
 * - min_length : `3`
 * - max_length : `50`
 * - Note : Diinput melalui form oleh user `client-side`
 * @property {number} semester 
 * Semester matakuliah dengan kriteria
 * - min : `0`
 * - max : `50`
 * - Note : Diinput melalui form oleh user `client-side`
 * @property {number} sks 
 * Sks matakuliah dengan kriteria
 * - min: `0`
 * - max : `50`
 * - Note : Diinput melalui form oleh user `client-side`
 * @property {Object} nilai Object yang merepresentasikan nilai matakuliah
 * @property {Sipk.DefaultIndeksNilai} nilai.indeks 
 * Indeks nilai matakuliah
 * - Note : Diinput melalui form oleh user `client-side`
 * @property {float} nilai.bobot 
 * Bobot nilai matakuliah untuk indeks nilai yang digunakan
 * - Note : Diinput pada `api/matkul`
 * @property {float} nilai.akhir 
 * Nilai akhir matakuliah dihitung dari `bobot` * `sks`
 * - Note: Dihitung pada `api/matkul`
 * @property {boolean} dapat_diulang 
 * Boolean matakuliah dapat diulang atau tidak
 * - Note : Diinput melalui form oleh user `client-side`
 * @property {string} owned_by 
 * Id user pemilik matakuliah
 * - Note : Diresolve dari `supabase`
 * @property {Object} target_nilai Object yang merepresentasikan nilai target matakuliah
 * @property {Sipk.DefaultIndeksNilai} target_nilai.indeks 
 * Indeks nilai target matakuliah
 * - Note : Diinput melalui form oleh user `client-side`
 * @property {float} target_nilai.bobot 
 * Bobot nilai matakuliah untuk indeks nilai target yang digunakan
 * - Note : Diinput pada `api/matkul`
 * @property {number} created_at 
 * Unix timestamp matakuliah dibuat
 * - Note : Diresolve dari `api/matkul`
 * @property {number} updated_at 
 * Unix timestamp terakhir matakuliah diperbarui
 * - Note : Diresolve dari `api/matkul`
 * @property {number} deleted_at 
 * Unix timestamp matakuliah dihapus
 * - Note : Diresolve dari `api/matkul`
 */

/**
 * @typedef {Object} MatkulHistoryData
 * @property {string} id 
 * Id matakuliah history dalam bentuk `uuid-v4`
 * @property {Pick<MatkulData, 'nama' | 'semester' | 'sks' | 'nilai' | 'dapat_diulang' | 'target_nilai'>} current 
 * Current history matakuliah
 * @property {'tambah'|'hapus'|'ubah'} current.type 
 * Tipe history matakuliah
 * @property {number} current.stamp 
 * Unix timestamp history matakuliah
 * @property {Pick<MatkulData, 'nama' | 'semester' | 'sks' | 'nilai' | 'dapat_diulang' | 'target_nilai'>} prev 
 * Previous history matakuliah
 * @property {'tambah'|'hapus'|'ubah'} prev.type 
 * Tipe history matakuliah
 * @property {number} prev.stamp 
 * Unix timestamp history matakuliah
 * @property {string} owned_by 
 * Id user pemilik history matakuliah
 * @property {number} last_change_at 
 * Unix timestamp perubahan terakhir history matakuliah
 * @property {string} matkul_id 
 * Id matakuliah
 */

/**
 * @typedef {Object} RatingData
 * @property {string} id 
 * Id rating dalam bentuk `uuid-v4`
 * @property {number} rating 
 * Jumlah bintang atau rating dengan kriteria
 * - min: `1`
 * - max : `5`
 * @property {string} review 
 * Ulasan atau review dengan kriteria
 * - min_length : `0`
 * - max_length : `200`
 * - Tidak mengandung simbol `>` , `<` , `&` , `'` , `"` dan `/`
 * - Tidak mengandung kata `'http'`, `'https'`, `'www'`
 * @property {string} owned_by 
 * Id user pemilik rating
 * @property {Date} created_at 
 * Tanggal rating dibuat
 * @property {number} unix_created_at 
 * Unix timestamp rating dibuat
 * @property {number} unix_updated_at 
 * Unix timestamp terakhir rating diperbarui
 * @property {Object} details
 * Rating details
 * @property {string} details.author 
 * Dapat bernilai nama lengkap atau nickname user dan `'Anonim'` tergantung dengan `authorType` yang digunakan
 * @property {0|1|2} details.authorType 
 * Tipe author rating dengan keterangan berikut,
 * - `0` : Nama lengkap user akan digunakan pada `author`
 * - `1` : Nickname user akan digunakan pada `author`
 * - `2` : `'Anonim'` akan digunakan pada `author`
 * @property {string} details.universitas 
 * Nama universitas user pemilik rating
 */

/**
 * @typedef {Object} NotifikasiData
 * @property {string} title Judul atau headline notifikasi
 * @property {string} description Deskripsi notifikasi
 * @property {string} href Path atau link notifikasi
 * @property {Object} icon Icon {@link https://react-icons.github.io/react-icons/ react-icons} yang digunakan
 * @property {string} icon.lib Library icon pada {@link https://react-icons.github.io/react-icons/ react-icons}, ex: `'fa', 'io5', etc`
 * @property {string} icon.name Nama icon pada {@link https://react-icons.github.io/react-icons/ react-icons}, ex: `'FaRocket', 'IoAdd', etc`
 * @property {string} color Warna atau variabel warna yang digunakan, ex: `'red', 'var(--some-color)', etc`
 * @property {Date} date_created_at Tanggal notifikasi dibuat
 * @property {number} unix_created_at Unix timestamp notifikasi dibuat
 */

/**
 * @typedef {Object} UniversitasData
 * @property {number} id Id universitas dalam bentuk integer dimulai dari `1`
 * @property {string} nama Nama universitas dengan format pascal case
 * - Contoh : `'Universitas Brawijaya'`
 * @property {string} short Singkatan universitas dengan format uppercase
 * - Contoh : `'UB', 'ITB', 'UNDIP'`
 * @property {Record<Sipk.DefaultIndeksNilai, PenilaianProps>} penilaian 
 * Indeks nilai yang digunakan pada universitas tertentu.
 * Perlu diingat setiap universitas mungkin menggunakan indeks nilai yang berbeda, sehingga beberapa key dari property ini dapat bernilai `null`
 * - Note : Selalu gunakan optional chaining atau nullish coalescing saat mengakses key dari property ini untuk menghindari error
 * @property {Object} assets Assets universitas
 * @property {string} assets.logo Logo universitas dalam bentuk filename
 * - Contoh : `'logo_itb.png'`
 * @property {string} assets.desc Deskripsi universitas
 * @property {Object} assets.style Universitas custom style
 * @property {Object} assets.style.color Universitas custom color dalam bentuk `hex`
 * @property {string} assets.style.color.primary Universitas primary hex color, ex: `'#FBEA04'`
 * @property {string} assets.style.color.secondary Universitas secondary hex color, ex: `'#252422'`
 * @property {Date} created_at Tanggal universitas ditambahkan
 */

/**
 * @typedef {Object} PenilaianProps
 * @property {?string} cat 
 * Kategori penilaian
 * - Contoh : `'baik', 'kurang', etc`
 * 
 * Pada beberapa universitas kategori penilaian tidak tersedia sehingga bernilai `null`
 * - Note : Selalu gunakan optional chaining atau nullish coalescing saat mengakses property ini untuk menghindari error
 * @property {'success'|'warning'|'danger'|'crimson'} style 
 * Style color penilaian
 * @property {float} weight Bobot penilaian
 */

/**
 * @typedef {Object} FaktaData
 * @property {string} id Id fakta
 * @property {string} text Konten fakta
 * @property {Object} details Details fakta
 * @property {Array<string>} details.tags Tags atau tagar fakta
 * @property {Date} created_at Tanggal fakta dibuat
 * @property {Date} updated_at Tanggal fakta diperbarui
 */

/**
 * @typedef {Object} UserMetadata
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

/** 
 * @typedef {{ data: Array<T>, error: SupabasePostgrestError}} _from<T>
 * @template T
 */

/**
 * Override `User` dan `Session` type yang direturn dari `supabase.auth.signInWithPassword()`
 * @typedef {Object} _auth_signInWithPassword
 * @property {Object} data
 * Data yang diresolve dari supabase
 * @property {User | null} data.user
 * Data user, jika autentikasi gagal maka bernilai `null`
 * @property {Session | null} data.session
 * Session user, jika autentikasi gagal maka bernilai `null`
 * @property {SupabaseWeakPassword | null} data.weakPassword
 * Weak password object, jika autentikasi gagal maka bernilai `null`
 * @property {SupabaseAuthError} error
 */

/**
 * Decoded payload `JWT` atau access token atau cookie `'s_access_token'` tanpa `User`
 * @typedef {Object} AccessTokenBasePayload
 * @property {string} iss
 * Domain atau URL beserta endpoint dari pembuat `issuer` token
 * @property {string} sub
 * Id user `uuid-v4` yang merepresentasikan subject token
 * @property {number} exp
 * Unix timestamp kapan token kadaluwarsa `expired`
 * @property {number} iat
 * Unix timestamp kapan token dibuat `issuedAt`
 * @property {AuthenticatorAssuranceLevels} aal
 * Level autentikasi atau `Authenticator Assurance Level` untuk session yang terkait dengan keterangan berikut,
 * - `'aal1'` atau `null` menandakan user telah terverifikasi hanya dengan login konvensional seperti `email+password`, `OTP`, `magic link`, `social login`, dan lainnya
 * - `'aal2'` menandakan user telah terverifikasi dengan login konvensional dan setidaknya satu `MFA factor`
 * @property {Array<AMREntry>} amr
 * Array yang berisikan referensi metode autentikasi atau `Authentication Method Reference`
 * @property {string} session_id
 * Id session `uuid-v4`
 */

/**
 * Decoded payload `JWT` atau access token atau cookie `'s_access_token'`
 * @typedef {AccessTokenBasePayload & Pick<User, 'email' | 'phone' | 'app_metadata' | 'user_metadata' | 'role' | 'is_anonymous' | 'aud'} AccessTokenPayload
 */

export const SupabaseTypes = {}