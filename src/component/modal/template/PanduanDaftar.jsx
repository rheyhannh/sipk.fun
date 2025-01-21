'use client';

// #region NEXT DEPEDENCY
import Link from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { ModalContext } from '@/component/modal/provider';
import { Backdrop, Layout, Head, Inner } from '@/component/modal/components';
import { Accordion } from '@/component/Accordion';
// #endregion

// #region ICON DEPEDENCY
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { FaPlus, FaCircleInfo, FaGear } from 'react-icons/fa6';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css';
// #endregion

const accordionList = [
	{
		title: 'Nama Lengkap',
		description: (
			<ul>
				<li>Hanya dapat menggunakan huruf tanpa simbol maupun angka</li>
				<li>Jumlah minimal karakter 6 dan maksimal 50</li>
				<li>
					Pastikan hanya ada <span style={{ fontWeight: 500 }}>satu spasi</span>{' '}
					di antara setiap kata
				</li>
			</ul>
		),
		icon: <FaPlus />
	},
	{
		title: 'Universitas',
		description: (
			<ul>
				<li>Pilih universitas yang sesuai dan tersedia</li>
				<li>
					Universitas yang tidak sesuai dapat mempengaruhi sistem penilaian yang
					digunakan, pastikan kamu memilih yang sesuai
				</li>
			</ul>
		),
		icon: <FaPlus />
	},
	{
		title: 'Email',
		description: (
			<ul>
				<li>Gunakan email valid yang dapat dihubungi</li>
				<li>
					Lakukan konfirmasi pendaftaran dengan membuka tautan yang dikirim SIPK
				</li>
			</ul>
		),
		icon: <FaPlus />
	},
	{
		title: 'Password',
		description: (
			<ul>
				<li>Jumlah karakter minimal 6 dan maksimal 50</li>
				<li>
					Disarankan menggunakan kombinasi huruf kecil, huruf besar, angka dan
					simbol
				</li>
				<li>
					Password lemah ditandai dengan centang berwarna merah dan password
					kurang kuat ditandai dengan centang berwarna kuning, keduanya dapat
					digunakan walaupun tidak disarankan
				</li>
			</ul>
		),
		icon: <FaPlus />
	},
	{
		title: 'Keterangan Icon',
		description: (
			<div className={styles.keterangan_icon}>
				<span>
					<FaCircleInfo color='var(--primary-color)' /> Data dibutuhkan
				</span>
				<span>
					<FaGear color='var(--logo-second-color)' /> Data sedang divalidasi
				</span>
				<span>
					<FaCheckCircle color='var(--success-color)' /> Data Valid / Password
					kuat
				</span>
				<span>
					<FaCheckCircle color='var(--warning-color)' /> Password kurang kuat
				</span>
				<span>
					<FaCheckCircle color='var(--danger-color)' /> Password lemah
				</span>
				<span>
					<FaExclamationCircle color='crimson' /> Data Invalid
				</span>
			</div>
		),
		icon: <FaPlus />
	}
];

const PanduanDaftar = () => {
	const { handleModalClose } = React.useContext(ModalContext);

	return (
		<Backdrop>
			<Layout className={styles.panduan__daftar}>
				<Head title={'Panduan Daftar'} />
				<Inner>
					<p style={{ textAlign: 'justify', marginBottom: '.75rem' }}>
						Pastikan data yang kamu masukkan memenuhi kriteria sebagai berikut :
					</p>
					<Accordion item={accordionList} />
				</Inner>

				<div className={styles.form__action}>
					<Link
						className={styles.btn}
						onClickCapture={(event) => {
							event.currentTarget.blur();
							handleModalClose();
						}}
						href='/faq?tab=pendaftaran'
					>
						<h3 style={{ display: 'flex', alignItems: 'center' }}>
							<span style={{ marginRight: '0.25rem' }}>
								Pelajari Lebih Lanjut
							</span>
						</h3>
					</Link>
				</div>
			</Layout>
		</Backdrop>
	);
};

export default PanduanDaftar;
