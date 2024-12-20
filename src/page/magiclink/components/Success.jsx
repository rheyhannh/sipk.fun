'use client'

// #region NEXT DEPEDENCY
import Link from 'next/link'
import { useRouter } from 'next/navigation';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import Countdown from 'react-countdown';
import { MagiclinkContext } from '@magiclink_page/provider';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@magiclink_page/magiclink.module.css';
// #endregion

/**
 * Magiclink content saat state `success` dengan classname yang sudah ditentukan
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props Success props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLDivElement>, 'className'>, HTMLDivElement>} Rendered content success
 */
function Success({ ...props }) {
    const router = useRouter();
    const { isLogin } = React.useContext(MagiclinkContext);

    return (
        <div className={styles.content} {...props}>
            <h2 className={styles.content__title}>
                Magiclink Valid
            </h2>
            {isLogin ?
                <Countdown
                    date={Date.now() + 3000}
                    onComplete={() => router.replace('/dashboard')}
                    renderer={props => {
                        return (
                            <>
                                <div className={styles.content__text}>
                                    Login berhasil. Kamu akan dialihkan ke dashboard dalam <span style={{ fontWeight: '700' }}>{props.seconds} detik</span>
                                </div>
                                <div className={styles.content__action}>
                                    <Link className={`${styles.btn} ${styles.success}`} href={'/dashboard'} prefetch={false} replace>
                                        <h3>Menuju Dashboard ({props.seconds})</h3>
                                    </Link>
                                </div>
                            </>
                        )
                    }}
                />
                :
                <>
                    <div className={styles.content__text}>
                        Akun berhasil dikonfirmasi. Mulai pakai SIPK sekarang dengan klik tombol dibawah.
                    </div>
                    <div className={styles.content__action}>
                        <Link className={`${styles.btn} ${styles.success}`} href={'/dashboard'} prefetch={false} replace>
                            <h3>Mulai Sekarang</h3>
                        </Link>
                    </div>
                </>
            }
        </div>
    )
}

export default Success;