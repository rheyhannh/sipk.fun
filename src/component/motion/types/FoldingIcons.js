// #region TYPE DEPEDENCY
import { HTMLProps, CSSProperties } from 'react';
// #endregion

/**
 * @typedef {Object} ContentEntry
 * Object yang merepresentasikan content
 * @property {JSX.Element | string} [icon]
 * Element icon atau teks content
 * - Default : `'Null'`
 * @property {string} [color]
 * Warna icon atau teks content
 * - Default : `'#262626'`
 * @property {string} [backgroundColor]
 * Warna background icon atau teks content
 * - Default : `'#ff6341'`
 */

/**
 * @typedef {Object} ContentStyleOptions
 * @property {string} [fontSize]
 * Ukuran icon atau teks content. 
 * Direkomendasikan untuk menggunakan `'rem'` based karna nilai ini secara default menentukan variabel lainnya sebagai berikut,
 * ```js
 * // Ukuran box container dan content ditentukan berdasarkan props 'contentOptions.fontSize'
 * const containerWidth = `calc(${fontSize} * 3.4)`;
 * const containerHeight = `calc(${fontSize} * 2.4)`;
 * const contentWidth = `calc(${fontSize} * 2.6)`;
 * const contentHeight = `calc(${fontSize} * 1.8)`;
 * // Customable dengan props 'containerStyleOptions' dan 'contentStyleOptions'
 * ```
 * - Default : `'5rem'`
 * @property {string} [width]
 * Width content
 * - Default : `'calc(${fontSize} * 2.6)'`
 * @property {string} [height]
 * Height content
 * - Default : `'calc(${fontSize} * 1.8)'`
 * @property {string} [borderRadius]
 * Border radius content
 * - Default : `'.25rem'`
 * @property {CSSProperties} custom
 * Custom content style. Secara default menggunakan style berikut,
 * ```style
 * display: grid;
 * place-content: center;
 * line-height: 1;
 * ```
 */

/**
 * @typedef {Object} ContainerStyleOptions
 * @property {string} [width]
 * Width container
 * - Default : `'calc(${contentOptions.fontSize} * 3.4)'`
 * @property {string} [height]
 * Height container
 * - Default : `'calc(${contentOptions.fontSize} * 2.4)'`
 * @property {string} [backgroundColor]
 * Background color container
 * - Default : `'#262626'`
 * @property {string} [borderColor]
 * Border color container
 * - Default : `'#404040'`
 * @property {string} [borderWidth]
 * Border width container
 * - Default : `'1px'`
 * @property {string} [borderStyle]
 * Border style container
 * - Default : `'solid'`
 * @property {string} [borderRadius]
 * Border radius container
 * - Default : `'0.5rem'`
 * @property {CSSProperties} custom
 * Custom container style. Secara default menggunakan style berikut,
 * ```style
 * position: relative;
 * z-index: 0;
 * transform: rotateY(-20deg);
 * transform-style: preserve-3d;
 * ```
 */

/** 
 * @typedef {Object} DividerStyleOptions
 * @property {string} [width]
 * Width divider
 * - Default : `'100%'`
 * @property {string} [height]
 * Height divider
 * - Default : `'1px'`
 * @property {string} [backgroundColor]
 * Background color divider
 * - Default : `'#262626'`
 * @property {CSSProperties} custom
 * Custom divider style. Secara default menggunakan style berikut,
 * ```style
 * position: absolute;
 * top: 50%;
 * transform: translateZ(1px);
 * ```
 */

/**
 * @typedef {Object} AnimationOptions
 * @property {'stateChanges' | 'repeat'} [type]
 * Timing animasi yang digunakan
 * - `'stateChanges'` : Animasi dimainkan saat state berubah. Opsi tambahan tipe ini dapat dilihat di props `stateChangesOptions`.
 * - `'repeat'` : Animasi dimainkan berulang saat component mount. Opsi tambahan tipe ini dapat dilihat di props `repeatOptions`.
 * - Default : `'stateChanges'`
 * @property {number} [duration]
 * Durasi animasi pergantian icon atau teks content
 * - Default : `0.5`
 * @property {(nextContent:number) => void} onStart
 * Callback saat animasi pergantian icon atau teks content mulai dengan parameter `nextContent` yang merupakan index contents yang akan aktif atau tampil
 * @property {(currentContent:number) => void} onComplete
 * Callback saat animasi pergantian icon atau teks content selesai dengan parameter `currentContent` yang merupakan index contents yang sedang aktif atau tampil
 */

/**
 * @typedef {Object} StateChangesOptions
 * @property {boolean} [useParentState]
 * Opsi untuk menggunakan state dari component lain atau tidak
 * - Default : `false`
 * @property {boolean} [parentStateValue]
 * State value dari component lain. Saat `true` animasi akan dimainkan untuk mengganti icon atau teks content
 * - Default : `false`
 * @property {(newParentStateValue:boolean) => void} parentStateSetter
 * State setter dari component lain
 * @property {boolean} [autoUpdateParentState]
 * Opsi untuk otomatis memperbarui parent state value dengan memanggil `parentStateSetter`
 * - Default : `false`
 */

/**
 * @typedef {Object} RepeatOptions
 * @property {number} [delay]
 * Delay dalam detik yang dihitung setelah mount
 * - Default : `5`
 * @property {number} [interval]
 * Interval perulangan animasi dalam detik
 * - Default : `5`
 */

export const FoldingIconsTypes = {}