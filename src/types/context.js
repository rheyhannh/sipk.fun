import * as SupabaseTypes from './supabase';

/**
 * @typedef ModalContext
 * Config berupa states, variable maupun method yang digunakan modal.
 * @type {object}
 * @property {(modalType:'tentang'|'default'|'panduanDaftar'|'logout'|'perubahanTerakhirDetail'|'perubahanTerakhirConfirm'|'tambahMatkul'|'profil'|'rating'|'tabelSetting'|'tabelFilter'|'detailMatkul'|'hapusPermanentConfirm'|'akun') => void} setModal Method untuk set tipe modal.
 * @property {(modalActive:boolean) => void} setActive Method untuk mengaktifkan atau nonaktifkan modal.
 * @property {(modalData: {isSuccess?:boolean|true, image?:any|(FaRegCircleCheck|FaRegTimesCircle), title?:string|('Yeaay!'|'Ooops!'), message?:string|('Berhasil memproses permintaanmu'|'Sepertinya ada yang salah saat memproses permintaanmu.'), actionText?:string|'Tutup'}) => void} setData Method untuk set data modal. Setiap tipe modal cenderung memiliki props yang berbeda, sehingga perlu disesuaikan. Jika tipe modal `'default'`, gunakan props yang tertera diatas.
 * @property {(modalType:'tentang'|'default'|'panduanDaftar'|'logout'|'perubahanTerakhirDetail'|'perubahanTerakhirConfirm'|'tambahMatkul'|'profil'|'rating'|'tabelSetting'|'tabelFilter'|'detailMatkul'|'hapusPermanentConfirm'|'akun') => void} setPrevModal Method untuk set tipe modal sebelumnya.
 * @property {'tentang'|'default'|'panduanDaftar'|'logout'|'perubahanTerakhirDetail'|'perubahanTerakhirConfirm'|'tambahMatkul'|'profil'|'rating'|'tabelSetting'|'tabelFilter'|'detailMatkul'|'hapusPermanentConfirm'} modal Tipe modal yang digunakan.
 * @property {boolean} active State modal apakah aktif atau nonaktif.
 * @property {{}} data Data modal yang digunakan.
 * @property {'tentang'|'default'|'panduanDaftar'|'logout'|'perubahanTerakhirDetail'|'perubahanTerakhirConfirm'|'tambahMatkul'|'profil'|'rating'|'tabelSetting'|'tabelFilter'|'detailMatkul'|'hapusPermanentConfirm'} prevModal Tipe modal sebelumnya yang digunakan.
 * @property {() => void} handleModalClose Method untuk menutup atau menonaktifkan modal.
 * @property {() => void} handleModalPrev Method untuk kembali ke modal sebelumya jika `prevModal` tersedia.
 */

/**
 * @typedef UsersContext
 * Config berupa states, variable maupun method yang digunakan pada page users `/users/:any`.
 * @type {object}
 * @property {(loginMode:boolean) => void} setLoginMode Method untuk mengaktifkan atau nonaktifkan mode login.
 * @property {(isBigContent:boolean) => void} setBigContent Method untuk mengaktifkan atau nonaktifkan big content.
 * @property {boolean} loginMode State apakah mode login atau bukan.
 * @property {boolean} isBigContent State apakah big content `window.matchMedia('(min-width: 870px)')` atau bukan.
 */

/**
 * @typedef DashboardContext
 * Config berupa states, variable maupun method yang digunakan pada page dashboard `/dashboard/:any`.
 * @type {object}
 * @property {(isNavbarActive:boolean) => void} setNavbarActive Method untuk mengaktifkan atau nonaktifkan navbar.
 * @property {(activeLink:string) => void} setActiveLink Method untuk mengaktifkan link atau pathname yang sedang aktif pada navbar.
 * @property {(isRichContent:boolean) => void} setRichContent Method untuk mengaktifkan atau nonaktifkan rich content.
 * @property {(isPhoneContent:boolean) => void} setPhoneContent Method untuk mengaktifkan atau nonaktifkan phone content.
 * @property {(isTouchDevice:boolean) => void} setTouchDevice Method untuk mengaktifkan atau nonaktifkan touch device.
 * @property {boolean} isNavbarActive State apakah navbar aktif atau tidak.
 * @property {string} activeLink State link atau pathname yang sedang aktif. Ex: `'/dashboard'`.
 * @property {boolean} isRichContent State apakah rich content `window.matchMedia('(min-width: 1280px)')` atau bukan.
 * @property {boolean} isPhoneContent State apakah phone content `window.matchMedia('(max-width: 768px)')` atau bukan.
 * @property {boolean} isTouchDevice State apakah touch device `'ontouchstart' in window || navigator.msMaxTouchPoints` atau bukan. 
 */

/**
 * @typedef LandingContext
 * Config berupa states, variable maupun method yang digunakan pada landing atau root page.
 * @type {object}
 * @property {(isRichContent:boolean) => void} setRichContent Method untuk mengaktifkan atau nonaktifkan rich content.
 * @property {(isTouchDevice:boolean) => void} setTouchDevice Method untuk mengaktifkan atau nonaktifkan touch device.
 * @property {(isAccessTokenExist:boolean) => void} setAccessTokenExist Method untuk set `s_access_token` cookie tersedia atau tidak.
 * @property {(data:{universitas:Array<SupabaseTypes.UniversitasData>, rating:Array<SupabaseTypes.RatingData>, notifikasi:Array<SupabaseTypes.NotifikasiData>}) => void} setData Method untuk set data yang dibutuhkan landing page.
 * @property {boolean} isRichContent State apakah rich content `window.matchMedia('(min-width: 820px)')` atau bukan.
 * @property {boolean} isTouchDevice State apakah touch device `'ontouchstart' in window || navigator.msMaxTouchPoints` atau bukan.
 * @property {boolean} isAccessTokenExist State apakah `s_access_token` cookie tersedia atau tidak.
 * @property {Object} data State untuk store data yang dibutuhkan landing page.
 * @property {Array<SupabaseTypes.UniversitasData>} data.universitas Lorem.
 * @property {Array<SupabaseTypes.RatingData>} data.rating Lorem2.
 * @property {Array<SupabaseTypes.NotifikasiData>} data.notifikasi Lorem3.
 */

export const ContextTypes = {}