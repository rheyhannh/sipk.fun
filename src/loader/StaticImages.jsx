// #region TYPE DEPEDENCY
import { Short as UniversitasShort } from '@/types/universitas';
import { ImageProps } from 'next/image';
// #endregion

// #region NEXT DEPEDENCY
import Image from 'next/image';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region SIPK STATIC ASSETS DEPEDENCY
import logo_sipk from '/public/logo.png';
import logo_fill_sipk from '/public/logo_fill.png';
import logo_fill_contrast_sipk from '/public/logo_fill_contrast.png';
// #endregion

// #region UNIVERSITAS STATIC ASSETS DEPEDENCY
import logo_airlangga from '/public/universitas/logo_airlangga.png';
import logo_brawijaya from '/public/universitas/logo_brawijaya.png';
import logo_diponegoro from '/public/universitas/logo_diponegoro.png';
import logo_indonesia from '/public/universitas/logo_indonesia.png';
import logo_ipb from '/public/universitas/logo_ipb.png';
import logo_itb from '/public/universitas/logo_itb.png';
import logo_its from '/public/universitas/logo_its.png';
import logo_padjajaran from '/public/universitas/logo_padjajaran.png';
import logo_telkom from '/public/universitas/logo_telkom.png';
import logo_unsoed from '/public/universitas/logo_unsoed.png';
// #endregion

/**
 * Render logo SIPK tipe `default` dengan default props berikut,
 * - `alt` : `'Logo SIPK'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud.
 *
 * Tipe logo `default` menggunakan ratio `1:1` dimana logo diletakan ditengah canvas ukuran `512x512` dan menggunakan warna `accents`.
 *
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoSipk = ({ ...props }) => (
	<Image src={logo_sipk} alt={'Logo SIPK'} {...props} />
);

/**
 * Render logo SIPK tipe `fill` dengan default props berikut,
 * - `alt` : `'Logo SIPK'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud.
 *
 * Tipe logo `fill` menggunakan ratio `1:1` dimana logo distretch untuk penuh dengan canvas ukuran `512x512` dan menggunakan warna `accents`.
 *
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoSipkFill = ({ ...props }) => (
	<Image src={logo_fill_sipk} alt={'Logo SIPK'} {...props} />
);

/**
 * Render logo SIPK tipe `fill` & `contrast` dengan default props berikut,
 * - `alt` : `'Logo SIPK'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud
 *
 * Tipe logo `fill` menggunakan ratio `1:1` dimana logo distretch untuk penuh dengan canvas ukuran `512x512`
 * dan `constrast` menggunakan warna `neutral` dimana match dengan tema dark atau background yang gelap.
 *
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoSipkFillContrast = ({ ...props }) => (
	<Image src={logo_fill_contrast_sipk} alt={'Logo SIPK'} {...props} />
);

/**
 * Render logo Universitas Airlangga dengan default props berikut,
 * - `alt` : `'Logo Universitas Airlangga'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoUnair = ({ ...props }) => (
	<Image src={logo_airlangga} alt={'Logo Universitas Airlangga'} {...props} />
);

/**
 * Render logo Universitas Brawijaya dengan default props berikut,
 * - `alt` : `'Logo Universitas Brawijaya'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoUb = ({ ...props }) => (
	<Image src={logo_brawijaya} alt={'Logo Universitas Brawijaya'} {...props} />
);

/**
 * Render logo Universitas Diponegoro dengan default props berikut,
 * - `alt` : `'Logo Universitas Diponegoro'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoUndip = ({ ...props }) => (
	<Image src={logo_diponegoro} alt={'Logo Universitas Diponegoro'} {...props} />
);

/**
 * Render logo Univeritas Indonesia dengan default props berikut,
 * - `alt` : `'Logo Univeritas Indonesia'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoUi = ({ ...props }) => (
	<Image src={logo_indonesia} alt={'Logo Univeritas Indonesia'} {...props} />
);

/**
 * Render logo Institut Pertanian Bogor dengan default props berikut,
 * - `alt` : `'Logo Institut Pertanian Bogor'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoIpb = ({ ...props }) => (
	<Image src={logo_ipb} alt={'Logo Institut Pertanian Bogor'} {...props} />
);

/**
 * Render logo Institut Teknologi Bandung dengan default props berikut,
 * - `alt` : `'Logo Institut Teknologi Bandung'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoItb = ({ ...props }) => (
	<Image src={logo_itb} alt={'Logo Institut Teknologi Bandung'} {...props} />
);

/**
 * Render logo Institut Teknologi Sepuluh November dengan default props berikut,
 * - `alt` : `'Logo Institut Teknologi Sepuluh November'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoIts = ({ ...props }) => (
	<Image
		src={logo_its}
		alt={'Logo Institut Teknologi Sepuluh November'}
		{...props}
	/>
);

/**
 * Render logo Universitas Padjajaran dengan default props berikut,
 * - `alt` : `'Logo Universitas Padjajaran'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoUnpad = ({ ...props }) => (
	<Image src={logo_padjajaran} alt={'Logo Universitas Padjajaran'} {...props} />
);

/**
 * Render logo Universitas Telkom dengan default props berikut,
 * - `alt` : `'Logo Universitas Telkom'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoTelkom = ({ ...props }) => (
	<Image src={logo_telkom} alt={'Logo Universitas Telkom'} {...props} />
);

/**
 * Render logo Universitas Jendral Soedirman dengan default props berikut,
 * - `alt` : `'Logo Universitas Jendral Soedirman'`
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 */
export const LogoUnsoed = ({ ...props }) => (
	<Image
		src={logo_unsoed}
		alt={'Logo Universitas Jendral Soedirman'}
		{...props}
	/>
);

/**
 * Render logo universitas yang dipilih berdasarkan singkatannya dengan default props `alt` menggunakan nama universitas yang dipilih.
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud
 *
 * @param {UniversitasShort} short Singkatan universitas dalam format uppercase
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 * @returns {React.ReactElement | null} Logo universitas yang dipilih, `null` saat tidak tersedia
 * @example
 * ```jsx
 * // Singkatan Universitas
 * const x = [ "UB", "UNDIP", "UI", "ITB", "UNAIR", "IPB", "ITS", "TELKOM", "UNPAD", "UNSOED" ];
 * const LogoUb = () => getLogoUniversitasByShort(x[0]);
 * const LogoUnpad = () => getLogoUniversitasByShort('UNPAD');
 *
 * const MyComponent = () => {
 *      return (
 *          <div class={'wrapper'}>
 *              <LogoUb/>
 *              <LogoUnpad/>
 *          </div>
 *      )
 * }
 * ```
 */
export const getLogoUniversitasByShort = (short, props) => {
	const logoByShort = {
		UNAIR: <LogoUnair {...props} />,
		UB: <LogoUb {...props} />,
		UNDIP: <LogoUndip {...props} />,
		UI: <LogoUi {...props} />,
		IPB: <LogoIpb {...props} />,
		ITB: <LogoItb {...props} />,
		ITS: <LogoIts {...props} />,
		UNPAD: <LogoUnpad {...props} />,
		TELKOM: <LogoTelkom {...props} />,
		UNSOED: <LogoUnsoed {...props} />
	};

	return logoByShort[short] ?? null;
};

/**
 * Render logo SIPK berdasarkan tipe yang dipilih.
 *
 * Karna menggunakan static import, jangan mengubah props `src` karna sudah diset sesuai dengan logo yang dimaksud.
 *
 * Untuk penjelasan terkait tipe logo dapat dilihat sebagai berikut,
 * - `default` : Menggunakan ratio `1:1` dimana logo diletakan ditengah canvas ukuran `512x512` dan menggunakan warna `accents`
 * - `fill` :  Menggunakan ratio `1:1` dimana logo distretch untuk penuh dengan canvas ukuran `512x512` dan menggunakan warna `accents`
 * - `fill-contrast` : Tipe `fill` dengan menggunakan warna `neutral` dimana match dengan tema dark atau background yang gelap
 * @param {'default' | 'fill' | 'fill-contrast'} type Tipe logo yang dipilih, default : `'default'`
 * @param {Omit<ImageProps, 'src'>} props Next.js {@link Image} props
 * @returns {React.ReactElement | null} Logo sipk dengan tipe yang dipilih, `null` saat tidak tersedia
 */
export const getLogoSipkByType = (type, props) => {
	const logoByType = {
		default: <LogoSipk {...props} />,
		fill: <LogoSipkFill {...props} />,
		'fill-contrast': <LogoSipkFillContrast {...props} />
	};

	return logoByType[type] ?? null;
};
