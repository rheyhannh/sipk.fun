// #region NEXT DEPEDENCY
import { useRouter } from 'next/navigation';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import { useCookies } from 'next-client-cookies';
// #endregion

// #region COMPONENT DEPEDENCY
import toast from 'react-hot-toast';
import { ModalContext } from '@/component/modal/provider';
import { Backdrop, Layout, Head, Button } from '@/component/modal/components';
// #endregion

// #region UTIL DEPEDENCY
import { fetchWithAuth } from '@/utils/client_side';
import { handleApiResponseError } from '@/component/modal/utils';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css'
// #endregion

const Logout = () => {
    const router = useRouter();
    const accessToken = useCookies().get('s_access_token');
    const { handleModalClose } = React.useContext(ModalContext);

    const handleLogout = async () => {
        try {
            if (!accessToken) {
                router.refresh();
                throw new Error('Terjadi kesalahan, silahkan coba lagi');
            }

            const response = await fetchWithAuth('POST', 'logout', accessToken);

            if (!response.ok) {
                const { toastMessage, refresh, navigate } = await handleApiResponseError(response);
                if (refresh) { router.refresh() }
                if (navigate && navigate?.type === 'push' && navigate?.to) { router.push(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                if (navigate && navigate?.type === 'replace' && navigate?.to) { router.replace(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                toast.error(toastMessage, { duration: 4000, position: 'top-left' });
            } else {
                const stamp = Math.floor(Date.now() / 1000);
                sessionStorage.clear();
                router.replace(`/users?logout=${stamp}`, {
                    scroll: false,
                });
            }
        } catch (error) {
            toast.error(error?.message ?? 'Terjadi kesalahan', { duration: 4000, position: 'top-left' })
        }
    }

    return (
        <Backdrop>
            <Layout className={`${styles.logout} ${styles.confirm}`}>
                <Head title='Logout' />

                <div style={{ color: 'var(--infoDark-color)' }}>
                    Apakah kamu ingin logout dari SIPK?
                </div>

                <div className={styles.form__action}>
                    <Button
                        title='Logout'
                        action={() => {
                            handleModalClose();
                            handleLogout();
                        }}
                        className={`${styles.btn} ${styles.confirm}`}
                    />

                    <Button
                        title='Jangan'
                        action={'close'}
                        className={`${styles.btn} ${styles.cancel}`}
                    />
                </div>
            </Layout>
        </Backdrop>
    )
}

export default Logout;