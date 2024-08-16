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
import * as TableMatakuliah from './table_matakuliah';
import {
    Names as UniversitasNames
} from './universitas';
// #endregion

// #region [CORE]
/** Entry user yang diperoleh dari API `'/api/me'` atau supabase database table `user`
 * @typedef {Object} UserData
 * @property {string} id 
 * Id user dalam bentuk `uuid-v4`
 * @property {string} email 
 * Email user dengan kriteria
 * - min_length : `6`
 * - max_length : `100`
 * - format : `email`
 * @property {boolean} is_email_confirmed 
 * Boolean apakah email sudah dikonfirmasi
 * 
 * Secara default diisi dengan `false` pada supabase setelah user mendaftar.
 * @property {Date} email_confirmed_at 
 * Tanggal email dikonfirmasi
 * 
 * Secara default diisi dengan `null` pada supabase setelah user mendaftar.
 * @property {boolean} is_banned 
 * Boolean apakah user diban
 * 
 * Secara default diisi dengan `false` pada supabase setelah user mendaftar.
 * @property {Date} banned_until 
 * Tanggal berakhirnya ban user
 * 
 * Secara default diisi dengan `null` pada supabase setelah user mendaftar.
 * @property {string} roles 
 * Roles atau kategori user dengan keterangan berikut,
 * - `member` : User dengan plan `free`
 * - `premium` : User dengan plan `premium` 
 * 
 * Secara default diisi dengan `'member'` pada supabase setelah user mendaftar.
 * @property {string} fullname 
 * Nama lengkap user dengan kriteria
 * - min_length : `6`
 * - max_length : `100`
 * @property {string} nickname 
 * Nama panggilan atau nickname user dengan kriteria
 * - min_length : `3`
 * - max_length : `20`
 * 
 * Secara default diisi dengan `'Si Misterius'` pada supabase setelah user mendaftar.
 * Kriteria diatas berlaku saat user mengganti nickname pada pengaturan profil.
 * @property {UniversitasNames} university 
 * Nama universitas user dengan format pascal case
 * - Contoh : `'Universitas Brawijaya'`
 * @property {number} university_id 
 * Id universitas user dalam bentuk integer dimulai dari `1`
 * @property {string} jurusan 
 * Jurusan atau program studi user dengan kriteria
 * - min_length : `6`
 * - max_length : `30`
 * 
 * Secara default diisi dengan `'-'` pada supabase setelah user mendaftar.
 * Kriteria diatas berlaku saat user mengganti jurusan pada pengaturan profil.
 * @property {number} sks_target 
 * Target sks user dengan kriteria
 * - min : `5`
 * - max : `1000`
 * 
 * Secara default diisi dengan `144` pada supabase setelah user mendaftar.
 * Kriteria diatas berlaku saat user mengganti target sks pada pengaturan profil.
 * @property {number} matkul_target 
 * Target matakuliah user dengan kriteria
 * - min : `5`
 * - max : `1000`
 * 
 * Secara default diisi dengan `50` pada supabase setelah user mendaftar.
 * Kriteria diatas berlaku saat user mengganti target matakuliah pada pengaturan profil.
 * @property {float} ipk_target 
 * Target ipk user dengan kriteria
 * - min : `1.00`
 * - max : `4.00`
 * - decimal_digit : `2`
 * 
 * Secara default diisi dengan `4` pada supabase setelah user mendaftar.
 * Kriteria diatas berlaku saat user mengganti target ipk pada pengaturan profil.
 * @property {Date} created_at 
 * Tanggal user daftar
 * 
 * Secara default diisi dengan `now()` pada supabase setelah user mendaftar.
 * @property {Date} updated_at 
 * Tanggal terakhir user memperbarui datanya
 * 
 * Secara default diisi dengan `now()` pada supabase setelah user mendaftar.
 * @property {Object} preferences 
 * User preferences
 * 
 * Secara default diisi dengan `null` pada supabase setelah user mendaftar.
 * Selalu gunakan optional chaining atau nullish coalescing saat mengakses key dari property ini untuk menghindari error.
 * @property {TableMatakuliah.PreferencesProps} preferences.table 
 * User table preferences
 * 
 * Secara default diisi dengan `null` pada supabase setelah user mendaftar.
 * Selalu gunakan optional chaining atau nullish coalescing saat mengakses key dari property ini untuk menghindari error.
 */

/** Entry matakuliah yang diperoleh dari API `'/api/matkul'` atau supabase database table `matkul`
 * @typedef {Object} MatkulData
 * @property {string} id 
 * Id matakuliah dalam bentuk `uuid-v4`.
 * 
 * Diresolve pada supabase menggunakan `gen_random_uuid()`
 * @property {string} nama 
 * Nama matakuliah dengan kriteria
 * - min_length : `3`
 * - max_length : `50`
 * 
 * Diinput melalui form oleh user, divalidasi pada `'api/matkul'`
 * @property {number} semester 
 * Semester matakuliah dengan kriteria
 * - min : `0`
 * - max : `50`
 * 
 * Diinput melalui form oleh user, divalidasi pada `'api/matkul'`
 * @property {number} sks 
 * Sks matakuliah dengan kriteria
 * - min: `0`
 * - max : `50`
 * 
 * Diinput melalui form oleh user, divalidasi pada `'api/matkul'`
 * @property {Object} nilai Object yang merepresentasikan nilai matakuliah
 * @property {Sipk.DefaultIndeksNilai} nilai.indeks 
 * Indeks nilai matakuliah.
 * 
 * Diinput melalui form oleh user, divalidasi pada `'api/matkul'`
 * @property {float} nilai.bobot 
 * Bobot nilai matakuliah untuk indeks nilai yang digunakan.
 * 
 * Diinput pada `'api/matkul'`
 * @property {float} nilai.akhir 
 * Nilai akhir matakuliah dihitung dari `bobot` * `sks`.
 * 
 * Dihitung pada `'api/matkul'`
 * @property {boolean} dapat_diulang 
 * Boolean matakuliah dapat diulang atau tidak.
 * 
 * Diinput melalui form oleh user, divalidasi pada `'api/matkul'`
 * @property {string} owned_by 
 * Id user pemilik matakuliah.
 * 
 * Diresolve pada supabase dimana match dengan id user pada session yang digunakan
 * @property {Object} target_nilai Object yang merepresentasikan nilai target matakuliah
 * @property {Sipk.DefaultIndeksNilai} target_nilai.indeks 
 * Indeks nilai target matakuliah.
 * 
 * Diinput melalui form oleh user, divalidasi pada `'api/matkul'`
 * @property {float} target_nilai.bobot 
 * Bobot nilai matakuliah untuk indeks nilai target yang digunakan.
 * 
 * Diinput pada `'api/matkul'`
 * @property {number} created_at 
 * Unix timestamp matakuliah dibuat.
 * 
 * Diresolve pada `'api/matkul'`
 * @property {number} updated_at 
 * Unix timestamp terakhir matakuliah diperbarui.
 * 
 * Diresolve pada `'api/matkul'`
 * @property {number} deleted_at 
 * Unix timestamp matakuliah dihapus.
 * 
 * Diresolve pada `'api/matkul'`
 */

/** Entry matakuliah history yang diperoleh dari API `'/api/matkul-history'` atau supabase database table `matkul_history`
 * @typedef {Object} MatkulHistoryData
 * @property {string} id 
 * Id matakuliah history dalam bentuk `uuid-v4`
 * 
 * Diresolve pada supabase menggunakan `gen_random_uuid()`
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

/** Entry rating yang diperoleh dari API `'/api/rating'` atau supabase database table `rating`
 * @typedef {Object} RatingData
 * @property {string} id 
 * Id rating dalam bentuk `uuid-v4`.
 * 
 * Diresolve pada supabase menggunakan `gen_random_uuid()`
 * @property {number} rating 
 * Jumlah bintang atau rating dengan kriteria
 * - min: `1`
 * - max : `5`
 * 
 * Diinput melalui form oleh user, divalidasi pada `'api/rating'`
 * @property {string} review 
 * Ulasan atau review dengan kriteria
 * - min_length : `0`
 * - max_length : `200`
 * - Tidak mengandung simbol `>` , `<` , `&` , `'` , `"` dan `/`
 * - Tidak mengandung kata `'http'`, `'https'`, `'www'`
 * 
 * Diinput melalui form oleh user, divalidasi pada `'api/rating'`
 * @property {string} owned_by 
 * Id user pemilik rating.
 * 
 * Diresolve pada supabase dimana match dengan id user pada session yang digunakan
 * @property {Date} created_at 
 * Tanggal rating dibuat.
 * 
 * Diresolve pada supabase dengan `now()`
 * @property {number} unix_created_at 
 * Unix timestamp rating dibuat
 * 
 * Diresolve pada `'api/rating'`
 * @property {number} unix_updated_at 
 * Unix timestamp terakhir rating diperbarui
 * 
 * Diresolve pada `'api/rating'`
 * @property {Object} details
 * Rating details
 * @property {string} details.author 
 * Dapat bernilai nama lengkap atau nickname user atau `'Anonim'` tergantung dengan `authorType` yang digunakan
 * @property {0|1|2} details.authorType 
 * Tipe author rating dengan keterangan berikut,
 * - `0` : Nama lengkap user akan digunakan pada `author`
 * - `1` : Nickname user akan digunakan pada `author`
 * - `2` : `'Anonim'` akan digunakan pada `author`
 * 
 * Diinput melalui form oleh user, divalidasi pada `'api/rating'`
 * @property {UniversitasNames} details.universitas 
 * Nama universitas user pemilik rating dengan format pascal case
 * - Contoh : `'Universitas Brawijaya'`
 */

/** Entry notifikasi yang diperoleh dari API `'/api/notifikasi'` atau supabase database table `notifikasi`
 * @typedef {Object} NotifikasiData
 * @property {string} id 
 * Id notifikasi.
 * 
 * Diresolve pada supabase dengan `gen_random_uuid()`
 * @property {string} title 
 * Judul atau headline notifikasi
 * @property {string} description 
 * Deskripsi notifikasi
 * @property {string} href 
 * Path atau link notifikasi
 * - Contoh : `'/update/22112023/maintenance-untuk-pemeliharan-jaringan'`
 * @property {Object} icon 
 * Icon {@link https://react-icons.github.io/react-icons/ react-icons} yang digunakan
 * @property {string} icon.lib 
 * Library icon pada {@link https://react-icons.github.io/react-icons/ react-icons}
 * - Contoh : `'fa'`, `'io5'`
 * @property {string} icon.name 
 * Nama icon pada {@link https://react-icons.github.io/react-icons/ react-icons}
 * - Contoh : `'FaRocket'`, `'IoAdd'`
 * @property {string} color 
 * Warna atau variabel warna yang digunakan
 * - Contoh : `'red'`, `'var(--some-color)'`
 * @property {Date} date_created_at 
 * Tanggal notifikasi dibuat.
 * 
 * Diresolve pada supabase dengan `now()`
 * @property {number} unix_created_at 
 * Unix timestamp notifikasi dibuat
 * 
 * Diresolve pada `'/api/notifikasi'`
 */

/** Entry universitas yang diperoleh dari API `'/api/universitas'` atau supabase database table `universitas`
 * @typedef {Object} UniversitasData
 * @property {number} id 
 * Id universitas dalam bentuk integer dimulai dari `1`
 * @property {UniversitasNames} nama 
 * Nama universitas dengan format pascal case
 * - Contoh : `'Universitas Brawijaya'`
 * @property {string} short 
 * Singkatan universitas dengan format uppercase
 * - Contoh : `'UB', 'ITB', 'UNDIP'`
 * @property {Record<Sipk.DefaultIndeksNilai, PenilaianProps>} penilaian 
 * Indeks nilai yang digunakan pada universitas tertentu.
 * Perlu diingat setiap universitas mungkin menggunakan indeks nilai yang berbeda, sehingga beberapa key dari property ini dapat bernilai `null`
 * - Note : Selalu gunakan optional chaining atau nullish coalescing saat mengakses key dari property ini untuk menghindari error
 * @property {Object} assets 
 * Assets universitas
 * @property {string} assets.logo 
 * Logo universitas dalam bentuk filename
 * - Contoh : `'logo_itb.png'`
 * @property {string} assets.desc 
 * Deskripsi universitas
 * @property {Object} assets.style 
 * Universitas custom style
 * @property {Object} assets.style.color 
 * Universitas custom color dalam bentuk `hex`
 * @property {string} assets.style.color.primary 
 * Universitas primary hex color, ex: `'#FBEA04'`
 * @property {string} assets.style.color.secondary 
 * Universitas secondary hex color, ex: `'#252422'`
 * @property {Date} created_at 
 * Tanggal universitas ditambahkan
 */

/** Entry fakta yang diperoleh dari API `'/api/fakta'` atau supabase database table `fakta`
 * @typedef {Object} FaktaData
 * @property {string} id 
 * Id fakta.
 * 
 * Diresolve pada supabase dengan `gen_random_uuid()`
 * @property {string} text 
 * Konten fakta
 * @property {Object} details 
 * Details fakta
 * @property {Array<string>} details.tags 
 * Array yang memuat string sebagai tag
 * @property {Date} created_at 
 * Tanggal fakta dibuat.
 * 
 * Diresolve pada supabase dengan `now()`
 * @property {Date} updated_at 
 * Tanggal fakta diperbarui.
 * 
 * Diresolve pada supabase dengan `now()`
 */
// #endregion

// #region [OVERRIDE_SUPABASE_TYPE_AND_RETURNTYPE]
/** Override `user_metadata` pada `User` yang diresolve dari supabase
 * @typedef {Omit<SupabaseUser, 'user_metadata'> & {user_metadata:UserMetadata}} User
 */

/** Override `User` pada `Session` yang diresolve dari supabase
 * @typedef {Omit<SupabaseSession, 'user'> & {user:User}} Session
 */

/** Override `Session` type yang direturn dari `supabase.auth.getSession()`
 * @typedef {Object} _auth_getSession
 * @property {Object} data
 * Data yang diresolve dari supabase
 * @property {Session | null} data.session
 * Session user, jika autentikasi gagal maka bernilai `null`
 * @property {SupabaseAuthError} error
 */

/** Override `User` dan `Session` type yang direturn dari `supabase.auth.verifyOtp()`
 * @typedef {Object} _auth_verifyOtp
 * @property {Object} data
 * Data yang diresolve dari supabase
 * @property {User | null} data.user
 * Data user, jika autentikasi gagal maka bernilai `null`
 * @property {Session | null} data.session
 * Session user, jika autentikasi gagal maka bernilai `null`
 * @property {SupabaseAuthError} error
 */

/** Override `data` dan `error` type yang direturn dari `supabase.from()` dengan template T entry CORE data
 * @typedef {{ data: Array<T>, error: SupabasePostgrestError}} _from<T>
 * @template T
 */

/** Override `User` dan `Session` type yang direturn dari `supabase.auth.signInWithPassword()`
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

/** Override `User` type yang direturn dari `supabase.auth.updateUser()`
 * @typedef {Object} _auth_updateUser
 * @property {Object} data
 * Data yang diresolve dari supabase
 * @property {User | null} data.user
 * Data user, jika autentikasi atau `updateUser` gagal maka bernilai `null`
 * @property {SupabaseAuthError} error
 */

/** Override `User` dan `Session` type yang direturn dari `supabase.auth.signUp()`
 * @typedef {Object} _auth_signUp
 * @property {Object} data
 * Data yang diresolve dari supabase
 * @property {User | null} data.user
 * Data user, jika autentikasi atau `signUp()` gagal maka bernilai `null`
 * @property {Session | null} data.session
 * Session user, jika autentikasi atau `signUp()` gagal maka bernilai `null`
 * @property {SupabaseAuthError} error
 */
// #endregion

// #region [MISC]
/** Decoded payload `JWT` atau access token atau cookie `'s_access_token'` tanpa `User`
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

/** Decoded payload `JWT` atau access token atau cookie `'s_access_token'`
 * @typedef {AccessTokenBasePayload & Pick<User, 'email' | 'phone' | 'app_metadata' | 'user_metadata' | 'role' | 'is_anonymous' | 'aud'} AccessTokenPayload
 */
// #endregion

// #region [HELPER]
/** Tipe `penilaian` pada entry universitas atau `UniversitasData`
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

/** Tipe `user_metadata` pada `User`
 * @typedef {Object} UserMetadata
 * @property {string} fullname
 * Nama lengkap user
 * @property {string} university
 * Universitas user
 * @property {number} university_id
 * Id universitas user
 */

/** User credentials untuk proses login dengan email dan password melalui `'/api/login'`
 * @typedef {Pick<UserData, 'email'> & UserCredentialsBase} UserCredentials
 */

/** User credentials tanpa `email`
 * @typedef {Object} UserCredentialsBase
 * @property {string} password
 * Password user dengan kriteria
 * - min_length : `6`
 * - max_length : `50`
 * @property {string} token
 * Token yang diresolve `hCaptcha` setelah menyelesaikan challange captcha. 
 * Saat production token ini `required` untuk proses login dan register, jika tidak maka `optional`
 */
// #endregion

export const SupabaseTypes = {}