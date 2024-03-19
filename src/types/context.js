/**
 * @typedef ModalContext
 * @type {object}
 * @property {(modalType:'default'|'panduanDaftar'|'logout'|'perubahanTerakhirDetail'|'perubahanTerakhirConfirm'|'tambahMatkul'|'profil'|'rating'|'tabelSetting'|'tabelFilter'|'detailMatkul'|'hapusPermanentConfirm') => void} setModal Method untuk set tipe modal.
 * @property {(modalActive:boolean) => void} setActive Method untuk mengaktifkan atau nonaktifkan modal.
 * @property {(modalData: {isSuccess?:boolean|true, image?:any|(FaRegCircleCheck|FaRegTimesCircle), title?:string|('Yeaay!'|'Ooops!'), message?:string|('Berhasil memproses permintaanmu'|'Sepertinya ada yang salah saat memproses permintaanmu.'), actionText?:string|'Tutup'}) => void} setData Method untuk set data modal. Setiap tipe modal cenderung memiliki props yang berbeda, sehingga perlu disesuaikan. Jika tipe modal `'default'`, gunakan props yang tertera diatas.
 * @property {'default'|'panduanDaftar'|'logout'|'perubahanTerakhirDetail'|'perubahanTerakhirConfirm'|'tambahMatkul'|'profil'|'rating'|'tabelSetting'|'tabelFilter'|'detailMatkul'|'hapusPermanentConfirm'} modal Tipe modal yang digunakan.
 * @property {boolean} active State modal apakah aktif atau nonaktif.
 * @property {{}} data Data modal yang digunakan.
 */

/**
 * @typedef UsersContext
 * @type {object}
 * @property {(loginMode:boolean) => void} setLoginMode Method untuk mengaktifkan atau nonaktifkan mode login.
 * @property {(isBigContent:boolean) => void} setBigContent Method untuk mengaktifkan atau nonaktifkan big content.
 * @property {boolean} loginMode State apakah mode login atau bukan.
 * @property {boolean} isBigContent State apakah big content `window.matchMedia('(min-width: 870px)')` atau bukan.
 */

export const ContextTypes = {}