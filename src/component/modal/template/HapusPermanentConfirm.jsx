// #region NEXT DEPEDENCY
import { useRouter } from 'next/navigation';
// #endregion

// #region HOOKS DEPEDENCY
import { mutate } from 'swr';
import { useCookies } from 'next-client-cookies';
// #endregion

// #region COMPONENT DEPEDENCY
import toast from 'react-hot-toast';
import { ModalContext } from '@/component/modal/provider';
import { Backdrop, Layout, Head, Button } from '@/component/modal/components';
// #endregion

// #region UTIL DEPEDENCY
import { getLoadingMessage, fetchWithAuth } from '@/utils/client_side';
import { handleApiResponseError } from '@/component/modal/utils';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css'
// #endregion

/**
 * @typedef {Object} HapusPermanentConfirmModalData
 * Data yang digunakan pada modal {@link HapusPermanentConfirm}
 * @property {import('@/types/supabase').MatkulData['id'] | import('@/types/supabase').MatkulHistoryData['id']} id
 * Saat {@link HapusPermanentConfirmModalData.fromTabel fromTabel} falsy props ini merepresentasikan Id matakuliah yang ingin dihapus.
 * Sebaliknya saat {@link HapusPermanentConfirmModalData.fromTabel fromTabel} truthy props ini merepresentasikan Id matakuliah history yg relevan terhadap matakuliah yang ingin dihapus
 * @property {import('@/types/supabase').MatkulHistoryData['current'] | undefined} current
 * Saat {@link HapusPermanentConfirmModalData.fromTabel fromTabel} falsy props ini bernilai `undefined`
 * @property {import('@/types/supabase').MatkulData['nama']} nama
 * Nama matakuliah yang ingin dihapus
 * @property {import('@/types/supabase').MatkulHistoryData['id'] | undefined} refId
 * Saat {@link HapusPermanentConfirmModalData.fromTabel fromTabel} falsy props ini merepresentasikan Id matakuliah history yg relevan terhadap matakuliah yang ingin dihapus.
 * Sebaliknya saat {@link HapusPermanentConfirmModalData.fromTabel fromTabel} truthy props ini bernilai `undefined`
 * @property {import('@/types/supabase').MatkulData['id'] | undefined} matkul_id
 * Saat {@link HapusPermanentConfirmModalData.fromTabel fromTabel} truthy props ini merepresentasikan Id matakuliah yang ingin dihapus.
 * Sebaliknya saat {@link HapusPermanentConfirmModalData.fromTabel fromTabel} falsy props ini bernilai `undefined`
 * @property {boolean | undefined} fromTabel
 * Boolean apakah modal ditrigger dari tabel. Jika `true` maka modal ditrigger melalui klik pada matakuliah yang ada ditabel.
 * Jika `undefined` maka modal ditrigger melalui `RowAction`.
 */
const HapusPermanentConfirm = () => {
    const router = useRouter();
    const cookies = useCookies();
    const userIdCookie = cookies.get('s_user_id');
    const accessToken = cookies.get('s_access_token');

    return (
        <ModalContext.Consumer>
            {/** @param {import('@/types/context').ModalContext<HapusPermanentConfirmModalData>} context */ context => {
                const matakuliah = context?.data?.nama ? context?.data?.nama : context?.data?.current?.nama ? context?.data?.current?.nama : null;

                const handleHapusPermanent = async () => {
                    context.handleModalClose();

                    const deletePermanent = () => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                if (!accessToken || !userIdCookie) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }
                                if (context?.data?.fromTabel) {
                                    if (!context?.data?.id || !context?.data?.matkul_id) {
                                        router.refresh();
                                        throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                    }
                                } else {
                                    if (!context?.data?.id || !context?.data?.refId) {
                                        router.refresh();
                                        throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                    }
                                }

                                const idParamsValue = context?.data?.fromTabel ? context.data.id : context.data.refId;
                                const midParamsValue = context?.data?.fromTabel ? context.data.matkul_id : context.data.id;
                                const response = await fetchWithAuth('DELETE', 'matkul-history', accessToken, null, { id: idParamsValue, mid: midParamsValue });

                                if (!response.ok) {
                                    const { toastMessage, refresh, navigate } = await handleApiResponseError(response);
                                    if (refresh) { router.refresh() }
                                    if (navigate && navigate?.type === 'push' && navigate?.to) { router.push(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                    if (navigate && navigate?.type === 'replace' && navigate?.to) { router.replace(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                    throw new Error(toastMessage);
                                } else {
                                    try {
                                        mutate(['/api/matkul', userIdCookie], undefined, {
                                            populateCache: (_, currentMatkul) => {
                                                if (!currentMatkul) {
                                                    return [];
                                                } else {
                                                    const filteredMatkul = currentMatkul.filter(matkul => matkul.id !== `${midParamsValue}`);
                                                    return [...filteredMatkul];
                                                }
                                            },
                                            revalidate: false,
                                        });
                                        mutate(['/api/matkul-history', userIdCookie], undefined, {
                                            populateCache: (_, currentRef) => {
                                                if (!currentRef) {
                                                    return []
                                                } else {
                                                    const filteredRef = currentRef.filter(refs => refs.id !== `${idParamsValue}`);
                                                    return [...filteredRef];
                                                }
                                            },
                                            revalidate: false,
                                        });
                                        resolve();
                                    } catch {
                                        mutate(['/api/matkul', userIdCookie]);
                                        mutate(['/api/matkul-history', userIdCookie]);
                                        resolve();
                                    }
                                }
                            } catch (error) { reject(error) }
                        })
                    }

                    toast.promise(
                        deletePermanent(),
                        {
                            loading: `${getLoadingMessage(false, 0)} matakuliah`,
                            success: `${matakuliah ?? 'Matakuliah'} berhasil dihapus permanen`,
                            error: (error) => `${error?.message ?? 'Terjadi kesalahan'}`
                        },
                        {
                            position: 'top-left',
                            duration: 4000,
                        }
                    )
                }

                return (
                    <Backdrop>
                        <Layout
                            onEsc={true}
                            className={`${styles.hapus__permanent} ${styles.confirm}`}
                        >
                            <Head title='Hapus Permanen' />

                            <div style={{ color: 'var(--infoDark-color)' }}>
                                <p>
                                    Kamu yakin ingin menghapus
                                    {matakuliah ? <b style={{ fontWeight: '600' }}> {matakuliah} </b> : ' matakuliah ini '}
                                    secara <b style={{ fontWeight: '600' }}> permanen? </b>
                                </p>
                            </div>

                            <div className={styles.form__action}>
                                <Button
                                    title='Ya'
                                    action={handleHapusPermanent}
                                    className={`${styles.btn} ${styles.confirm} ${styles.reset}`}
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
            }}
        </ModalContext.Consumer>
    )
}

export default HapusPermanentConfirm;