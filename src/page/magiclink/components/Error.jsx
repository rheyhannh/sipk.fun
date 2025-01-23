'use client';

// #region NEXT DEPEDENCY
import Link from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { MagiclinkContext } from '@magiclink_page/provider';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@magiclink_page/magiclink.module.css';
// #endregion

/**
 * Magiclink content saat state `error` dengan classname yang sudah ditentukan
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props Error props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLDivElement>, 'className'>, HTMLDivElement>} Rendered content error
 */
function Error({ ...props }) {
	const { isLogin, states: state } = React.useContext(MagiclinkContext);
	const getContent = () => {
		if (state?.code === '429') {
			return {
				title: 'Too Many Request',
				text: 'Terlalu banyak request. Silahkan refresh dan coba lagi dalam 1 menit.',
				action: null
			};
		} else if (state?.code === '401') {
			return {
				title: 'Magiclink Invalid',
				text: `Magiclink tidak sesuai atau sudah expired. Silahkan ${isLogin ? 'login ulang' : 'daftar ulang'} agar dapat magiclink baru.`,
				action: isLogin ? (
					<Link
						className={`${styles.btn} ${styles.error}`}
						href={'/users?action=login&type=email'}
						replace
					>
						<h3>Login Ulang</h3>
					</Link>
				) : (
					<Link
						className={`${styles.btn} ${styles.error}`}
						href={'/users?action=daftar'}
						replace
					>
						<h3>Daftar Ulang</h3>
					</Link>
				)
			};
		} else {
			return {
				title: 'Terjadi Kesalahan',
				text: `Ada yang salah. Silahkan coba lagi atau ${isLogin ? 'login ulang' : 'daftar ulang'} untuk mendapatkan magiclink baru.`,
				action: isLogin ? (
					<Link
						className={`${styles.btn} ${styles.error}`}
						href={'/users?action=login&type=email'}
						replace
					>
						<h3>Login Ulang</h3>
					</Link>
				) : (
					<Link
						className={`${styles.btn} ${styles.error}`}
						href={'/users?action=daftar'}
						replace
					>
						<h3>Daftar Ulang</h3>
					</Link>
				)
			};
		}
	};

	return (
		<div
			className={`${styles.content} ${getContent().action ? '' : styles.no_action}`}
			{...props}
		>
			<h2 className={styles.content__title}>{getContent().title}</h2>

			<div className={styles.content__text}>{getContent().text}</div>

			{getContent().action && (
				<div className={styles.content__action}>{getContent().action}</div>
			)}
		</div>
	);
}

export default Error;
