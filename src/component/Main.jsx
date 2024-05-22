'use client'

// #region NEXT DEPENDENCY
import Image from "next/image";
import { League_Spartan } from 'next/font/google';
// #endregion

// #region STYLE DEPEDENCY
const league_spartan = League_Spartan({
    subsets: ['latin'],
    display: 'swap',
    variable: '--leaguespartan-font',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})
// #endregion

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
