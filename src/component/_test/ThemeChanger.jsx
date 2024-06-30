'use client'

// #region TYPE DEPEDENCY
import { HTMLProps, CSSProperties } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { mutate } from 'swr';
// #endregion

// #region DATA DEPEDENCY
import { useLocalTheme } from '@/data/core';
// #endregion

// #region ICON DEPEDENCY
import {
    FiSun,
    FiMoon,
} from 'react-icons/fi';
// #endregion

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
        handleChangeTheme(theme === 'dark' ? 'light' : 'dark')
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

// #region Utils

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