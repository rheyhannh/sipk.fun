// #region TYPE DEPEDENCY
import { CSSProperties } from 'react';
import * as MotionTypes from './types/_global';
// #endregion

/**
 * Method untuk mendapatkan `variants` yang digunakan pada component `motion` dengan tipe animasi tertentu.
 * 
 * Jika tipe animasi tidak tersedia, maka akan return animasi default sebagai berikut,
 * ```js
 * const hide = { opacity: 0 };
 * const show = { opacity: 1 };
 * ```
 * @param {MotionTypes.CommonAnimationName} type Tipe animasi yang digunakan
 * @returns {{hide:CSSProperties, show:CSSProperties}} Object dengan key `hide` sebagai initial styles dan `show` sebagai animated styles
 */
const getCommonAnimationVariants = (
    type
) => {
    const animations = {
        default: { hide: { opacity: 0 }, show: { opacity: 1 } },
        flyUp: { hide: { opacity: 0, y: 75 }, show: { opacity: 1, y: 0 } },
        flyDown: { hide: { opacity: 0, y: -75 }, show: { opacity: 1, y: 0 } },
        slideLeft: { hide: { opacity: 0, x: 75 }, show: { opacity: 1, x: 0 } },
        slideRight: { hide: { opacity: 0, x: -75 }, show: { opacity: 1, x: 0 } },
        throwUp: { hide: { opacity: 0, x: -200, y: 200, rotate: 30 }, show: { opacity: 1, x: 0, y: 0, rotate: 0 } },
        throwDown: { hide: { opacity: 0, x: -200, y: -200, rotate: -30 }, show: { opacity: 1, x: 0, y: 0, rotate: 0 } },
        scaleFromSmall: { hide: { opacity: 0, scale: 0.5 }, show: { opacity: 1, scale: 1 } },
        scaleFromBig: { hide: { opacity: 0, scale: 1.5 }, show: { opacity: 1, scale: 1 } },
        diagonalUpLeft: { hide: { opacity: 0, y: 75, x: 75 }, show: { opacity: 1, y: 0, x: 0 } },
        diagonalUpRight: { hide: { opacity: 0, y: 75, x: -75 }, show: { opacity: 1, y: 0, x: 0 } },
        diagonalDownLeft: { hide: { opacity: 0, y: -75, x: 75 }, show: { opacity: 1, y: 0, x: 0 } },
        diagonalDownRight: { hide: { opacity: 0, y: -75, x: -75 }, show: { opacity: 1, y: 0, x: 0 } },
    }

    return animations[type] ?? animations['default'];
}

export {
    getCommonAnimationVariants
};