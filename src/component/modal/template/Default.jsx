'use client';

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { ModalContext } from '@/component/modal/provider';
import { Backdrop, Layout, Button } from '@/component/modal/components';
// #endregion

// #region ICON DEPEDENCY
import { FaRegTimesCircle } from 'react-icons/fa';
import { FaRegCircleCheck } from 'react-icons/fa6';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css';
// #endregion

const DEFAULT_TRUTHY_ICON = (
	<FaRegCircleCheck size={'70px'} color={'var(--logo-second-color)'} />
);
const DEFAULT_FALSY_ICON = (
	<FaRegTimesCircle size={'70px'} color={'var(--logo-second-color)'} />
);
const DEFAULT_TRUTHY_TITLE = 'Yeaay!';
const DEFAULT_FALSY_TITLE = 'Ooops!';
const DEFAULT_TRUTHY_MESSAGE = 'Berhasil memproses permintaanmu';
const DEFAULT_FALSY_MESSAGE =
	'Sepertinya ada yang salah saat memproses permintaanmu';

/**
 * @typedef {Object} DefaultModalData
 * Data yang digunakan pada modal {@link Default}
 * @property {boolean} [isSuccess]
 * Kategori modal apakah berhasil atau tidak
 * - Default : `true`
 * @property {import('react').ReactNode} [image]
 * Gambar atau icon modal dengan default sebagai berikut,
 * - Jika `isSuccess` truthy menggunakan {@link DEFAULT_TRUTHY_ICON icon ini}
 * - Jika `isSuccess` falsy menggunakan {@link DEFAULT_FALSY_ICON icon ini}
 * @property {string} [title]
 * Judul modal dengan default sebagai berikut,
 * - Jika `isSuccess` truthy menggunakan {@link DEFAULT_TRUTHY_TITLE teks ini}
 * - Jika `isSuccess` falsy menggunakan {@link DEFAULT_FALSY_TITLE teks ini}
 * @property {string} [message]
 * Pesan modal dengan default sebagai berikut,
 * - Jika `isSuccess` truthy menggunakan {@link DEFAULT_TRUTHY_MESSAGE teks ini}
 * - Jika `isSuccess` falsy menggunakan {@link DEFAULT_FALSY_MESSAGE teks ini}
 *
 * Gunakan pesan ringkas, jika lebih dari 3 paragraf atau 120 kata maka ukuran modal perlu diatur agar tidak overflow.
 * @property {string} [actionText]
 * Teks yang digunakan pada button untuk menutup modal
 * - Default : `'Tutup'`
 */
const Default = () => {
	/** @type {import('@/types/context').ModalContext<DefaultModalData>} */
	const { data } = React.useContext(ModalContext);
	const isSuccess = data?.isSuccess ?? true;
	const image =
		data?.image || (isSuccess ? DEFAULT_TRUTHY_ICON : DEFAULT_FALSY_ICON);
	const title =
		data?.title || (isSuccess ? DEFAULT_TRUTHY_TITLE : DEFAULT_FALSY_TITLE);
	const message =
		data?.message ||
		(isSuccess ? DEFAULT_TRUTHY_MESSAGE : DEFAULT_FALSY_MESSAGE);
	const actionText = data?.actionText ?? 'Tutup';

	return (
		<Backdrop>
			<Layout className={styles.default}>
				<div className={styles.main}>{image}</div>

				<div style={{ textAlign: 'center' }} className={styles.title}>
					<h2>{title}</h2>
				</div>

				<div style={{ textAlign: 'center' }}>
					<p>{message}</p>
				</div>

				<div className={styles.form__action}>
					<Button
						title={actionText}
						action={'close'}
						className={`${styles.btn} ${styles.confirm}`}
					/>
				</div>
			</Layout>
		</Backdrop>
	);
};

export default Default;
