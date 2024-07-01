'use client'

// #region TYPE DEPEDENCY
import { HTMLProps, CSSProperties } from 'react';
// #endregion

// #region REACT DEPEDENCY
import { useEffect } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { mutate } from 'swr';
// #endregion

// #region DATA DEPEDENCY
import { useLocalTheme } from '@/data/core';
// #endregion

// #region UTIL DEPEDENCY
import PropTypes from 'prop-types';
// #endregion

// #region ICON DEPEDENCY
import {
    FiSun,
    FiMoon,
} from 'react-icons/fi';
// #endregion

/**
 * @typedef {Object} ThemeChangerProps
 * @property {Object} options
 * Opsi yang dapat digunakan pada component `ThemeChanger`
 * @property {string|number} [options.size]
 * Box width dan height berupa angka atau string angka dengan unit css
 * - Contoh : `15`, `'25px'`, `'1rem'`
 * - Default : `42`
 * @property {string|number} [options.sizeIcon]
 * Icon size berupa angka atau string angka dengan unit css
 * - Contoh : `15`, `'25px'`, `'1rem'`
 * - Default : `'40%'`
 * @property {Object} options.position
 * @property {'absolute'|'fixed'|'sticky'} [options.position.type]
 * Tipe `position` yang digunakan
 * - Jika menggunakan `preset` posisi pada `options.position`, pilih salah satu dari `'absolute'|'fixed'|'sticky'` (default: `'absolute'`)
 * @property {'top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right'|'middle-left'|'middle-center'|'middle-right'|'none'} [options.position.preset]
 * Preset posisi yang digunakan untuk meletakan component
 * - Default : `'none'`
 * @property {string|number} options.position.offsetX
 * Offset untuk menggeser component secara horizontal, dapat berupa angka, string angka atau string angka dengan unit css.
 * - Angka atau string angka (`3.25, -25, '10', '-12.5', etc`) secara otomatis akan dikonversi ke `px`
 * - String angka dengan unit css (`'2rem', '-3.25vw', '25px', '0.25vmax', '-35%', etc`)
 * 
 * Hanya dapat digunakan jika preset posisi tidak `'none'`
 * @property {string|number} options.position.offsetY
 * Offset untuk menggeser component secara vertikal, dapat berupa angka, string angka atau string angka dengan unit css
 * - Angka atau string angka (`3.25, -25, '10', '-12.5', etc`) secara otomatis akan dikonversi ke `px`
 * - String angka dengan unit css (`'2rem', '-3.25vw', '25px', '0.25vmax', '-35%', etc`)
 * 
 * Hanya dapat digunakan jika preset posisi tidak `'none'`
 * @property {CSSProperties} style
 * Custom style yang digunakan
 * - Note : Style yang digunakan pada props ini akan mengoverride opsi style yang digunakan pada `options`
 */

/**
 * Box dengan button untuk mengubah tema yang digunakan pada hook `useLocalTheme`. Hanya gunakan component ini untuk tujuan `testing` tidak untuk `production`
 * @param {HTMLProps & ThemeChangerProps} props Component props
 * @returns {JSX.Element} Rendered component
 */
const ThemeChanger = (
    {
        options = {
            size: 42,
            sizeIcon: '40%',
            position: {
                type: 'relative',
                preset: 'none',
            },
        },
        style,
        onClick: onClickCallback,
        ...props
    }
) => {
    const { data: theme } = useLocalTheme();

    const offsetX = options?.position?.offsetX ? convertOffset(options.position.offsetX) : { value: '0px', negative: false };
    const offsetY = options?.position?.offsetY ? convertOffset(options.position.offsetY) : { value: '0px', negative: false };

    const positionStylePreset = {
        'none': { position: options?.position?.type ?? null },
        'top-left': {
            position: options?.position?.type ?? 'absolute',
            top: `calc(0% ${offsetY.negative ? '-' : '+'} ${offsetY.value})`,
            left: `calc(0% ${offsetX.negative ? '-' : '+'} ${offsetX.value})`,
            transform: `translate(-0%, -0%)`
        },
        'top-center': {
            position: options?.position?.type ?? 'absolute',
            top: `calc(0% ${offsetY.negative ? '-' : '+'} ${offsetY.value})`,
            left: `calc(50% ${offsetX.negative ? '-' : '+'} ${offsetX.value})`,
            transform: `translate(-50%, -0%)`
        },
        'top-right': {
            position: options?.position?.type ?? 'absolute',
            top: `calc(0% ${offsetY.negative ? '-' : '+'} ${offsetY.value})`,
            left: `calc(100% ${offsetX.negative ? '-' : '+'} ${offsetX.value})`,
            transform: `translate(-100%, -0%)`
        },
        'bottom-left': {
            position: options?.position?.type ?? 'absolute',
            top: `calc(100% ${offsetY.negative ? '-' : '+'} ${offsetY.value})`,
            left: `calc(0% ${offsetX.negative ? '-' : '+'} ${offsetX.value})`,
            transform: `translate(-0%, -100%)`
        },
        'bottom-center': {
            position: options?.position?.type ?? 'absolute',
            top: `calc(100% ${offsetY.negative ? '-' : '+'} ${offsetY.value})`,
            left: `calc(50% ${offsetX.negative ? '-' : '+'} ${offsetX.value})`,
            transform: `translate(-50%, -100%)`
        },
        'bottom-right': {
            position: options?.position?.type ?? 'absolute',
            top: `calc(100% ${offsetY.negative ? '-' : '+'} ${offsetY.value})`,
            left: `calc(100% ${offsetX.negative ? '-' : '+'} ${offsetX.value})`,
            transform: `translate(-100%, -100%)`
        },
        'middle-left': {
            position: options?.position?.type ?? 'absolute',
            top: `calc(50% ${offsetY.negative ? '-' : '+'} ${offsetY.value})`,
            left: `calc(0% ${offsetX.negative ? '-' : '+'} ${offsetX.value})`,
            transform: `translate(-0%, -50%)`
        },
        'middle-center': {
            position: options?.position?.type ?? 'absolute',
            top: `calc(50% ${offsetY.negative ? '-' : '+'} ${offsetY.value})`,
            left: `calc(50% ${offsetX.negative ? '-' : '+'} ${offsetX.value})`,
            transform: `translate(-50%, -50%)`
        },
        'middle-right': {
            position: options?.position?.type ?? 'absolute',
            top: `calc(50% ${offsetY.negative ? '-' : '+'} ${offsetY.value})`,
            left: `calc(100% ${offsetX.negative ? '-' : '+'} ${offsetX.value})`,
            transform: `translate(-100%, -50%)`
        },
    }
    const otherStylePreset = {
        width: options?.size ?? 42,
        height: options?.size ?? 42,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--box-color-main)',
        color: 'var(--logo-second-color)',
        borderRadius: '.5rem',
        zIndex: 999
    }

    const handleChangeTheme = (newTheme) => {
        if (theme === newTheme) { return }
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark')
        mutate('localUserTheme');
    }

    const handleOnClick = (event) => {
        handleChangeTheme(theme === 'dark' ? 'light' : 'dark');
        if (onClickCallback) { onClickCallback(event); }
    }

    return (
        <div
            style={{
                ...(positionStylePreset[options?.position?.preset ?? 'none'] ?? positionStylePreset['none']),
                ...(otherStylePreset),
                ...(style)
            }}
            onClick={handleOnClick}
            {...props}
        >
            {theme === 'dark' ? <FiSun size={options?.sizeIcon ?? '40%'} /> : <FiMoon size={options?.sizeIcon ?? '40%'} />}
        </div>
    )
}

ThemeChanger.propTypes = {
    options: PropTypes.shape({
        size: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        sizeIcon: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        position: PropTypes.shape({
            type: PropTypes.string,
            preset: PropTypes.oneOf([
                'top-left',
                'top-center',
                'top-right',
                'bottom-left',
                'bottom-center',
                'bottom-right',
                'middle-left',
                'middle-center',
                'middle-right',
                'none'
            ]),
            offsetX: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            offsetY: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
        }),
    }),
    style: PropTypes.object,
    onClick: PropTypes.func,
}

// #region Utils

/**
 * Method untuk konversi parameter `offset` ke format tertentu dan mengidentifikasi apakah negatif atau tidak
 * ```js
 * // 'offset' dapat berupa salah satu dari kriteria berikut
 * // 1. Angka (positif atau negatif, bulat atau decimal)
 * const angka = [5, -2.25, 1.95, ...]; // Secara otomatis dikonversi ke 'px'
 * // 2. String Angka (positif atau negatif, bulat atau decimal)
 * const stringAngka = ['10', '-3.5', ...]; // Secara otomatis dikonversi ke 'px'
 * // 3. String Angka dengan CSS Unit
 * const cssUnit = ['25px', '-2rem', '-25vw', '2vmax', '-25%', ...];
 * ```
 * Untuk contoh output dapat lihat pada `example`
 * @param {string|number} offset Nilai yang ingin dikonversi
 * @returns {{value:string, negative:boolean}} Object dengan key `value` yang merupakan nilainya dan `negative` boolean apakah negatif
 * @example 
 * ```js
 * console.log(convertOffset('50')); // {value: '50px', negative: false}
 * console.log(convertOffset('-2.5')); // {value: '2.5px', negative: true}
 * console.log(convertOffset('5rem')); // {value: '5rem', negative: false}
 * console.log(convertOffset('-10%')); // {value: '10%', negative: true}
 * console.log(convertOffset('invalid')); // {value: '0px', negative: false}
 * console.log(convertOffset(1.25)); // {value: '1.25px', negative: false}
 * console.log(convertOffset(-15)); // {value: '15px', negative: true}
 * ```
 */
const convertOffset = (offset) => {
    const result = {
        value: '0px',
        negative: false
    };

    if (typeof offset === 'string' && /^-?\d+(\.\d+)?$/.test(offset)) {
        offset = parseFloat(offset);
    }

    if (typeof offset === 'number') {
        result.value = `${Math.abs(offset)}px`;
        result.negative = offset < 0;
        return result;
    }

    if (typeof offset === 'string') {
        const validUnits = /^(-?\d+(\.\d+)?)(px|em|rem|vh|vw|vmin|vmax|%)$/;
        const match = offset.match(validUnits);

        if (match) {
            result.value = `${Math.abs(parseFloat(match[1]))}${match[3]}`;
            result.negative = parseFloat(match[1]) < 0;
            return result;
        }
    }

    return result;
}

// #endregion

export default ThemeChanger;