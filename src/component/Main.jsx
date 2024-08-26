'use client'

// #region NEXT DEPENDENCY
import Image, { ImageProps } from "next/image";
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import { league_spartan } from "@/fonts/fonts";
// #endregion

/**
 * @typedef LogoTextProps
 * @type {object}
 * @property {JSX.Element|string} as Custom element atau string sebagai container, default: `'h2'`
 * @property {object} textProps Custom props yang digunakan selain 'className', default: `{}`
 * @property {object} styles Custom style yang digunakan selain 'fontFamily', default: `{}`
 */

/**
 * @typedef LogoImageProps
 * @type {object}
 * @property {string} src Source image logo, default: `'/logo.png'`
 * @property {number} width Width image logo, default: `96`
 * @property {number} height Height image logo, default: `96`
 * @property {string} alt Alt image logo, default: `'SIPK Logo'`
 * @property {object} imageProps Custom props lainnya yang tersedia pada component next image, default: `{}`
 */

/**
 * @typedef LogoProps
 * @type {object}
 * @property {JSX.Element|string} container Custom element atau string sebagai container, default: `'div'`
 * @property {object} containerProps Custom container props yang digunakan, default: `{}`
 * @property {LogoImageProps} image
 * @property {LogoTextProps} text
 */

/**
 * Render text `SIPK` dengan font dan warna yang telah ditentukan
 * @param {LogoTextProps} props React props object 
 * @returns Element react untuk render text `SIPK`
 */
export function LogoText({
    as: TextTag = 'h2',
    textProps = {},
    styles = {}
}) {
    return (
        <TextTag
            className={league_spartan.variable}
            style={{ fontFamily: 'var(--leaguespartan-font)', ...styles }}
            {...textProps}
        >
            <span style={{ color: 'var(--logo-first-color)' }}>SIP</span>
            <span style={{ color: 'var(--logo-second-color)' }}>K</span>
        </TextTag>
    );
}

/**
 * Render logo menggunakan next image
 * @param {LogoImageProps} props React props object 
 * @returns Element react untuk render logo menggunakan next image
 */
export function LogoImage({
    src = '/logo.png',
    width = 96,
    height = 96,
    alt = 'SIPK Logo',
    imageProps = {}
}) {
    return (
        <Image
            src={src}
            width={width}
            height={height}
            alt={alt}
            {...imageProps}
        />
    );
}

/**
 * Render logo image dan logo text
 * @param {LogoProps} props React props object 
 * @returns Element react untuk render logo image dan logo text
 */
export function Logo({
    container: ContainerTag = 'div',
    containerProps = {},
    image = {},
    text = {}
}) {
    const {
        src = '/logo.png',
        width = 96,
        height = 96,
        alt = 'SIPK Logo',
        imageProps = {}
    } = image;

    const {
        as: TextTag = 'h2',
        textProps = {},
        styles = {}
    } = text;

    return (
        <ContainerTag {...containerProps}>
            <LogoImage
                src={src}
                width={width}
                height={height}
                alt={alt}
                imageProps={imageProps}
            />
            <LogoText
                as={TextTag}
                textProps={textProps}
                styles={styles}
            />
        </ContainerTag>
    );
}
