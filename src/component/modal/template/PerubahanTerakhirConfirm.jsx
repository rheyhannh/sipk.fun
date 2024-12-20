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
import { handleApiResponseError } from '@/component/modal/utils';
import { getLoadingMessage, fetchWithAuth } from '@/utils/client_side';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css'
// #endregion

/**
 * @typedef {import('@/types/supabase').MatkulHistoryData} PerubahanTerakhirConfirmModalData
 * Data yang digunakan pada modal {@link PerubahanTerakhirConfirm}
 */
const PerubahanTerakhirConfirm = () => {
    const router = useRouter();
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');

    return (
        <ModalContext.Consumer>
            {/** @param {import('@/types/context').ModalContext<PerubahanTerakhirConfirmModalData>} context */ context => {
                const { type, nama } = context?.data?.current ?? { type: '', nama: '' };

                const renderTitle = () => {
                    if (type === 'tambah') { return `Hapus Matakuliah` }
                    else if (type === 'hapus') { return `Tambah Matakuliah` }
                    else if (type === 'ubah') { return `Ubah Matakuliah` }
                    else { return 'Terjadi Kesalahan'; }
                }

                const renderMessage = () => {
                    if (type === 'tambah') { return (<p>Kamu ingin menghapus <b style={{ fontWeight: '600' }}>{nama}</b> yang sudah ditambah?</p>) }
                    else if (type === 'hapus') { return (<p>Kamu ingin menambah kembali <b style={{ fontWeight: '600' }}>{nama}</b> yang sudah dihapus?</p>) }
                    else if (type === 'ubah') { return (<p>Kamu ingin mengubah <b style={{ fontWeight: '600' }}>{nama}</b> ke data sebelumnya?</p>) }
                    else { return (<p>Sepertinya ada yang salah</p>) }
                }

                const handleUndoMatkul = async () => {
                    context.handleModalClose();

                    if (type === 'tambah') {
                        const deleteMatkul = () => {
                            return new Promise(async (resolve, reject) => {
                                try {
                                    if (!accessToken || !userIdCookie) {
                                        router.refresh();
                                        throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                    }

                                    const response = await fetchWithAuth('DELETE', 'matkul', accessToken, null, { id: context.data.matkul_id })

                                    if (!response.ok) {
                                        const { toastMessage, refresh, navigate } = await handleApiResponseError(response);
                                        if (refresh) { router.refresh() }
                                        if (navigate && navigate?.type === 'push' && navigate?.to) { router.push(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                        if (navigate && navigate?.type === 'replace' && navigate?.to) { router.replace(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                        throw new Error(toastMessage);
                                    } else {
                                        try {
                                            /** @type {{ref:import('@/types/supabase').MatkulHistoryData}} */
                                            const { ref } = await response.json();
                                            if (!ref) {
                                                throw new Error('Failed to update cache');
                                            }
                                            mutate(['/api/matkul', userIdCookie], undefined, {
                                                populateCache: (_, currentMatkul) => {
                                                    if (!currentMatkul) {
                                                        return [];
                                                    } else {
                                                        const filteredMatkul = currentMatkul.filter(matkul => matkul.id !== `${context?.data?.matkul_id}`);
                                                        return [...filteredMatkul];
                                                    }
                                                },
                                                revalidate: false,
                                            });
                                            mutate(['/api/matkul-history', userIdCookie], ref, {
                                                populateCache: (ref, currentRef) => {
                                                    if (!currentRef) {
                                                        return [ref]
                                                    } else if (currentRef.length === 1) {
                                                        return [ref];
                                                    } else {
                                                        const filteredRef = currentRef.filter(refs => refs.id !== ref.id);
                                                        return [...filteredRef, ref];
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
                                } catch (error) { reject(error); }
                            });
                        };

                        toast.promise(
                            deleteMatkul(),
                            {
                                loading: `${getLoadingMessage(false, 0)} matakuliah`,
                                success: `${context?.data?.current?.nama} berhasil dihapus`,
                                error: (error) => `${error?.message ?? 'Terjadi kesalahan'}`
                            },
                            {
                                position: 'top-left',
                                duration: 4000,
                            }
                        )
                    }
                    else if (type === 'hapus') {
                        const addMatkul = () => {
                            return new Promise(async (resolve, reject) => {
                                try {
                                    if (!accessToken || !userIdCookie) {
                                        router.refresh();
                                        throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                    }

                                    const response = await fetchWithAuth('POST', 'matkul', accessToken,
                                        {
                                            nama: context?.data?.current?.nama,
                                            semester: context?.data?.current?.semester,
                                            sks: context?.data?.current?.sks,
                                            nilai: {
                                                indeks: context?.data?.current?.nilai?.indeks,
                                            },
                                            dapat_diulang: context?.data?.current?.dapat_diulang,
                                            target_nilai: {
                                                indeks: context?.data?.current?.target_nilai?.indeks,
                                            },
                                        },
                                        { ref: context.data.matkul_id }
                                    )

                                    if (!response.ok) {
                                        const { toastMessage, refresh, navigate } = await handleApiResponseError(response);
                                        if (refresh) { router.refresh() }
                                        if (navigate && navigate?.type === 'push' && navigate?.to) { router.push(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                        if (navigate && navigate?.type === 'replace' && navigate?.to) { router.replace(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                        throw new Error(toastMessage);
                                    } else {
                                        try {
                                            /** @type {{matkul:import('@/types/supabase').MatkulData, ref:import('@/types/supabase').MatkulHistoryData}} */
                                            const { matkul, ref } = await response.json();
                                            if (!matkul || !ref) {
                                                throw new Error('Failed to update cache');
                                            }
                                            mutate(['/api/matkul', userIdCookie], matkul, {
                                                populateCache: (matkul, currentMatkul) => {
                                                    if (!currentMatkul) {
                                                        return [matkul]
                                                    } else if (currentMatkul.length === 0) {
                                                        return [matkul];
                                                    } else {
                                                        return [...currentMatkul, matkul];
                                                    }
                                                },
                                                revalidate: false,
                                            });
                                            mutate(['/api/matkul-history', userIdCookie], ref, {
                                                populateCache: (ref, currentRef) => {
                                                    if (!currentRef) {
                                                        return [ref]
                                                    } else if (currentRef.length === 1) {
                                                        return [ref];
                                                    } else {
                                                        const filteredRef = currentRef.filter(refs => refs.id !== ref.id);
                                                        return [...filteredRef, ref];
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
                                } catch (error) { reject(error); }
                            });
                        };

                        toast.promise(
                            addMatkul(),
                            {
                                loading: `${getLoadingMessage(false, 0)} matakuliah`,
                                success: `${context?.data?.current?.nama} berhasil ditambah`,
                                error: (error) => `${error?.message ?? 'Terjadi kesalahan'}`
                            },
                            {
                                position: 'top-left',
                                duration: 4000,
                            }
                        )

                    }
                    else if (type === 'ubah') {
                        const editMatkul = () => {
                            return new Promise(async (resolve, reject) => {
                                try {
                                    if (
                                        !accessToken ||
                                        !userIdCookie ||
                                        !context?.data?.matkul_id ||
                                        !context?.data?.prev
                                    ) {
                                        router.refresh();
                                        throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                    }

                                    var { stamp: _, type: _, nilai: { indeks: indeksNilai }, target_nilai: { indeks: indeksTarget }, ...prevData } = context.data.prev;
                                    const prevDataFiltered = { ...prevData, nilai: { indeks: indeksNilai }, target_nilai: { indeks: indeksTarget } };
                                    const response = await fetchWithAuth('PATCH', 'matkul', accessToken, prevDataFiltered, { id: context.data.matkul_id });

                                    if (!response.ok) {
                                        const { toastMessage, refresh, navigate } = await handleApiResponseError(response);
                                        if (refresh) { router.refresh() }
                                        if (navigate && navigate?.type === 'push' && navigate?.to) { router.push(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                        if (navigate && navigate?.type === 'replace' && navigate?.to) { router.replace(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                        throw new Error(toastMessage);
                                    } else {
                                        try {
                                            /** @type {{matkul:import('@/types/supabase').MatkulData, ref:import('@/types/supabase').MatkulHistoryData}} */
                                            const { matkul, ref } = await response.json();
                                            if (!matkul || !ref) {
                                                throw new Error('Failed to update cache');
                                            }
                                            mutate(['/api/matkul', userIdCookie], matkul, {
                                                populateCache: (matkul, currentMatkul) => {
                                                    if (!currentMatkul || !currentMatkul.length) {
                                                        return [matkul]
                                                    } else {
                                                        const findIndex = currentMatkul.findIndex(item => item.id === matkul.id);
                                                        if (findIndex !== -1) {
                                                            return currentMatkul.map((item, index) => (index === findIndex ? matkul : item));
                                                        }
                                                        else {
                                                            return [...currentMatkul, matkul];
                                                        }
                                                    }
                                                },
                                                revalidate: false,
                                            });
                                            mutate(['/api/matkul-history', userIdCookie], ref, {
                                                populateCache: (ref, currentRef) => {
                                                    if (!currentRef || !currentRef.length) {
                                                        return [ref]
                                                    } else {
                                                        const filteredRef = currentRef.filter(item => item.id !== ref.id);
                                                        return [...filteredRef, ref]
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
                                } catch (error) { reject(error); }
                            })
                        }

                        toast.promise(
                            editMatkul(),
                            {
                                loading: `${getLoadingMessage(false, 1)}`,
                                success: `${context.data.current.nama ?? 'Matakuliah'} berhasil diperbarui`,
                                error: (error) => `${error?.message ?? 'Terjadi kesalahan'}`
                            },
                            {
                                position: 'top-left',
                                duration: 4000,
                            }
                        )
                    }
                    else { return }
                }

                return (
                    <Backdrop>
                        <Layout className={`${styles.perubahan__terakhir} ${styles.confirm}`}>
                            <Head title={renderTitle()} />

                            <div style={{ color: 'var(--infoDark-color)' }}>
                                {renderMessage()}
                            </div>

                            <div className={styles.form__action}>
                                <Button
                                    title='Ya'
                                    action={() => { handleUndoMatkul() }}
                                    className={`${styles.btn} ${styles.confirm} ${styles[type] ?? ''}`}
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

export default PerubahanTerakhirConfirm;