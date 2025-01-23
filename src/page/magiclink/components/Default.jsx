'use client';

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
 * Magiclink content saat state `default` dengan classname yang sudah ditentukan
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'> & {handleFetch: () => void}} props Default props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLDivElement>, 'className'>, HTMLDivElement>} Rendered content default
 */
function Default({ handleFetch, ...props }) {
	const { isLogin } = React.useContext(MagiclinkContext);

	return (
		<div className={styles.content} {...props}>
			<h2 className={styles.content__title}>
				{isLogin ? 'Magiclink Login' : 'Magiclink Confirm'}
			</h2>
			<div className={styles.content__text}>
				{isLogin
					? 'Login pakai magiclink dengan klik tombol dibawah.'
					: 'Konfirmasi akunmu dengan klik tombol dibawah.'}
			</div>
			<div className={styles.content__action} onClick={handleFetch}>
				<div className={`${styles.btn}`}>
					<h3>{isLogin ? 'Login' : 'Konfirmasi Akun'}</h3>
				</div>
			</div>
		</div>
	);
}

export default Default;
