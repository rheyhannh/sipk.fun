// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

/** Context yang digunakan modal dengan template `T` sebagai type modal data yang digunakan
 * @template {any} T
 * @typedef {Object} ModalContext<T>
 * @property {React.Dispatch<React.SetStateAction<keyof import('@/component/modal/provider').AvailableModal>>} setModal 
 * React dispatch untuk state {@link ModalContext.modal modal}.
 * Ini digunakan untuk menyetel tipe modal.
 * @property {React.Dispatch<React.SetStateAction<ModalContext['active']>} setActive 
 * React dispatch untuk state {@link ModalContext.active active}.
 * Ini digunakan untuk mengaktifkan modal.
 * @property {React.Dispatch<React.SetStateAction<T>} setData 
 * React dispatch untuk state {@link ModalContext.data data}.
 * Ini digunakan menyetel data modal.
 * @property {React.Dispatch<React.SetStateAction<keyof import('@/component/modal/provider').AvailableModal>>} setPrevModal 
 * React dispatch untuk state {@link ModalContext.prevModal prevModal}.
 * Ini digunakan menyetel tipe modal sebelumnya.
 * @property {keyof import('@/component/modal/provider').AvailableModal} modal 
 * Tipe modal yang digunakan, ini akan merender element modal.
 * 
 * Jika ingin mengaktifkan suatu modal harus dibarengi dengan mengaktifkan state {@link ModalContext.active active},
 * karna jika tipe modal tersedia namun tidak aktif, parent modal akan memiliki atribut visibility hidden.
 * @property {boolean} active 
 * State modal apakah aktif atau nonaktif, ini akan membuat parent modal tampil dengan visibility visible.
 * 
 * Jika ingin mengaktifkan suatu modal harus dibarengi dengan menyetel state {@link ModalContext.modal tipe modal},
 * karna jika modal aktif namun tipe tidak disetel, element modal tidak akan dirender.
 * @property {T} data 
 * Data modal yang digunakan.
 * @property {keyof import('@/component/modal/provider').AvailableModal} prevModal 
 * Tipe modal sebelumnya yang digunakan, ini memungkinkan untuk perpindahan modal ke tipe sebelum dan setelah tanpa mengubah URL halaman.
 * @property {() => void} handleModalClose 
 * Method untuk menutup dan menonaktifkan modal.
 * @property {(resetData?:boolean) => void} handleModalPrev 
 * Method untuk kembali ke modal sebelumya jika `prevModal` tersedia dengan params berikut,
 * - `resetData` : Boolean untuk reset modal data, default `true`
 * @property {(type:ModalContext<any>['modal'], data:T, beforeShowingModal:() => void, afterShowingModal:() => void) => void} handleShowModal
 * Method untuk menampilkan modal tanpa harus menyetel satu persatu state dengan param,
 * - type : Tipe modal yang digunakan
 * - data : Data modal yang digunakan, default `null`
 * - beforeShowingModal : Callback sebelum menampilkan modal
 * - afterShowingModal : Callback setelah menampilkan modal
 */

/** Context yang dishare pada halaman `/users/*`
 * @typedef {Object} UsersContext
 * @property {React.Dispatch<React.SetStateAction<UsersContext['loginMode']>>} setLoginMode 
 * React dispatch untuk state {@link UsersContext.loginMode loginMode}.
 * Ini digunakan untuk mengaktifkan atau nonaktifkan mode login.
 * @property {React.Dispatch<React.SetStateAction<UsersContext['isBigContent']>>} setBigContent 
 * React dispatch untuk state {@link UsersContext.isBigContent isBigContent}.
 * Ini digunakan untuk mengaktifkan atau nonaktifkan big content.
 * @property {boolean} loginMode 
 * State apakah mode login atau bukan.
 * @property {boolean} isBigContent 
 * State apakah big content atau bukan dimana ditentukan dengan,
 * ```js
 * window.matchMedia('(min-width: 870px)')
 * ```
 */

/** Context yang dishare pada halaman dashboard `/dashboard/*`
 * @typedef {Object} DashboardContext
 * @property {React.Dispatch<React.SetStateAction<DashboardContext['isNavbarActive']>>} setNavbarActive 
 * React dispatch untuk state {@link DashboardContext.isNavbarActive isNavbarActive}.
 * Ini digunakan untuk mengaktifkan atau menonaktifkan navbar.
 * @property {React.Dispatch<React.SetStateAction<DashboardContext['activeLink']>>} setActiveLink 
 * React dispatch untuk state {@link DashboardContext.activeLink activeLink}.
 * Ini digunakan untuk mengaktifkan pathname yang sedang tampil.
 * @property {React.Dispatch<React.SetStateAction<DashboardContext['isRichContent']>>} setRichContent 
 * React dispatch untuk state {@link DashboardContext.isRichContent isRichContent}.
 * @property {React.Dispatch<React.SetStateAction<DashboardContext['isPhoneContent']>>} setPhoneContent 
 * React dispatch untuk state {@link DashboardContext.isPhoneContent isPhoneContent}.
 * @property {React.Dispatch<React.SetStateAction<DashboardContext['isTouchDevice']>>} setTouchDevice 
 * React dispatch untuk state {@link DashboardContext.isTouchDevice isTouchDevice}.
 * @property {boolean} isNavbarActive 
 * State apakah navbar aktif atau tidak.
 * @property {string} activeLink 
 * State bernilai pathname yang sedang aktif. 
 * - Ex: `'/dashboard'`
 * @property {boolean} isRichContent 
 * State apakah rich content atau bukan dimana ditentukan dengan,
 * ```js
 * window.matchMedia('(min-width: 1280px)')
 * ```
 * @property {boolean} isPhoneContent 
 * State apakah phone content atau bukan dimana ditentukan dengan,
 * ```js
 * window.matchMedia('(max-width: 768px)')
 * ```
 * @property {boolean} isTouchDevice 
 * State apakah touch device atau bukan dimana ditentukan dengan,
 * ```js
 * 'ontouchstart' in window || navigator.msMaxTouchPoints
 * ```
 */

/** Context yang dishare pada halaman root atau landing page `/`
 * @typedef {Object} RootContext
 * @property {boolean} isRichContent 
 * State apakah rich content atau bukan dimana ditentukan dengan,
 * ```js
 * window.matchMedia('(min-width: 1280px)')
 * ```
 * @property {boolean} isTouchDevice 
 * State apakah touch device atau bukan dimana ditentukan dengan,
 * ```js
 * 'ontouchstart' in window || navigator.msMaxTouchPoints
 * ```
 * @property {boolean} showNavbarOverlay
 * State apakah navbar overlay aktif atau tidak.
 * @property {React.Dispatch<React.SetStateAction<RootContext['showNavbarOverlay']>>} setShowNavbarOverlay
 * React dispatch untuk state {@link RootContext.showNavbarOverlay showNavbarOverlay}. 
 */

/** Context yang dishare pada halaman magiclink `/magiclink`
 * @typedef {Object} MagiclinkContext
 * @property {boolean} isLogin
 * Boolean apakah magiclink digunakan untuk login atau konfirmasi akun. Ini ditentukan dengan
 * URL param `action` sebagai berikut,
 * ```js
 * useSearchParams().get('action') === 'login';
 * ```
 * @property {Object} states
 * @property {boolean} states.loading
 * Boolean apakah dalam state `loading`
 * @property {boolean} states.success
 * Boolean apakah dalam state `success`
 * @property {boolean} states.error
 * Boolean apakah dalam state `error`
 * @property {string} states.code
 * HTTP response code untuk generate title dan deskripsi sesuai dengan error yang terjadi.
 * Saat tidak terjadi error bernilai `null`.
 * - Ex : `'401'`
 * @property {React.Dispatch<React.SetStateAction<MagiclinkContext['states']>>} setStates
 * React dispatch untuk page {@link MagiclinkContext.states states}. 
 * @property {() => string} getClassnameByState
 * Method untuk resolve classname berdasarkan page {@link MagiclinkContext.states states}.
 */

export const ContextTypes = {}