// #region NEXT DEPEDENCY
import { useRouter } from 'next/navigation';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import { mutate } from 'swr';
import { useCookies } from 'next-client-cookies';
// #endregion

// #region COMPONENT DEPEDENCY
import toast from 'react-hot-toast';
import { ModalContext } from '@/component/modal/provider';
import { Backdrop, Layout, Head, Button, Inner } from '@/component/modal/components';
// #endregion

// #region UTIL DEPEDENCY
import { unixToDate, getLoadingMessage, fetchWithAuth } from '@/utils/client_side';
import { handleApiResponseError } from '@/component/modal/utils';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css'
// #endregion

/**
 * Props yang digunakan component `FormTabs`
 * @typedef {Object} FormTabsProps
 * @property {boolean} isSebelumForm
 * @property {React.Dispatch<React.SetStateAction<FormTabsProps['isSebelumForm']>>} setIsSebelumForm
 */

/**
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'> & FormTabsProps} props FormTabs props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLDivElement>, 'className'>, HTMLDivElement>} Rendered component
 */
const FormTabs = ({ isSebelumForm, setIsSebelumForm, ...props }) => (
    <div className={styles.form__type} {...props}>
        <span className={isSebelumForm ? styles.active : ''} onClick={() => { setIsSebelumForm(true) }}>
            <h3>Sebelum</h3>
        </span>
        <span className={!isSebelumForm ? styles.active : ''} onClick={() => { setIsSebelumForm(false) }}>
            <h3>Setelah</h3>
        </span>
    </div>
)

/**
 * @typedef {Object} PerubahanTerakhirDetailBaseModalData
 * @property {boolean} fromTabel
 * Apakah modal ditrigger dari tabel atau tidak
 */

/**
 * @typedef {import('@/types/supabase').MatkulHistoryData & PerubahanTerakhirDetailBaseModalData} PerubahanTerakhirDetailModalData
 * Data yang digunakan pada modal {@link PerubahanTerakhirDetail}
 */
const PerubahanTerakhirDetail = () => {
    const router = useRouter();
    const cookies = useCookies();
    const userIdCookie = cookies.get('s_user_id');
    const accessToken = cookies.get('s_access_token');
    const [isSebelumForm, setIsSebelumForm] = React.useState(false);

    return (
        <ModalContext.Consumer>
            {/** @param {import('@/types/context').ModalContext<PerubahanTerakhirDetailModalData>} context */ context => {
                const handleHapusMatakuliah = async () => {
                    context.handleModalClose();

                    const deleteMatkul = () => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                if (
                                    !accessToken ||
                                    !userIdCookie ||
                                    !context?.data?.matkul_id ||
                                    !context?.data?.current?.nama
                                ) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }

                                const response = await fetchWithAuth('DELETE', 'matkul', accessToken, null, { id: context.data.matkul_id });

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
                                                    const filteredMatkul = currentMatkul.filter(matkul => matkul.id !== `${context.data.matkul_id}`);
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
                        })
                    }

                    toast.promise(
                        deleteMatkul(),
                        {
                            loading: `${getLoadingMessage(false, 0)} matakuliah`,
                            success: `${context.data.current.nama ?? 'Matakuliah'} berhasil dihapus`,
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
                        {
                            context?.data?.current?.type === 'ubah' ?
                                <Layout className={`${styles.perubahan__terakhir} ${styles.ubah}`}>
                                    <Head title='Detail Matakuliah' />
                                    <FormTabs isSebelumForm={isSebelumForm} setIsSebelumForm={setIsSebelumForm} />
                                    <Inner>
                                        <form>
                                            <div className={styles.form__input_field}>
                                                <input
                                                    type="text"
                                                    id="nama"
                                                    placeholder=" "
                                                    className={styles.form__input}
                                                    value={isSebelumForm ? context?.data?.prev?.nama || '-' : context?.data?.current?.nama || '-'}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                                <label
                                                    htmlFor="nama"
                                                    className={styles.form__label}
                                                >
                                                    Nama
                                                </label>
                                            </div>
                                            <div className={styles.gtc_repeat3_1fr}>
                                                <div className={styles.form__input_field}>
                                                    <input
                                                        type="number"
                                                        id="sks"
                                                        placeholder=" "
                                                        className={styles.form__input}
                                                        value={isSebelumForm ? context?.data?.prev?.sks || '-1' : context?.data?.current?.sks || '-1'}
                                                        autoComplete='off'
                                                        disabled
                                                    />
                                                    <label
                                                        htmlFor="sks"
                                                        className={styles.form__label}
                                                    >
                                                        Sks
                                                    </label>
                                                </div>
                                                <div className={styles.form__input_field}>
                                                    <input
                                                        type="text"
                                                        id="nilai"
                                                        placeholder=" "
                                                        className={styles.form__input}
                                                        value={isSebelumForm ? context?.data?.prev?.nilai?.indeks || '-' : context?.data?.current?.nilai?.indeks || '-'}
                                                        autoComplete='off'
                                                        disabled
                                                    />
                                                    <label
                                                        htmlFor="nilai"
                                                        className={styles.form__label}
                                                    >
                                                        Nilai
                                                    </label>
                                                </div>
                                                <div className={styles.form__input_field}>
                                                    <input
                                                        type="number"
                                                        id="semester"
                                                        placeholder=" "
                                                        className={styles.form__input}
                                                        value={isSebelumForm ? context?.data?.prev?.semester || '-1' : context?.data?.current?.semester || '-1'}
                                                        autoComplete='off'
                                                        disabled
                                                    />
                                                    <label
                                                        htmlFor="semester"
                                                        className={styles.form__label}
                                                    >
                                                        Semester
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={styles.gtc_repeat2_1fr}>
                                                <div className={styles.form__input_field}>
                                                    <input
                                                        type="text"
                                                        id="dapatDiulang"
                                                        placeholder=" "
                                                        className={styles.form__input}
                                                        value={isSebelumForm ? context?.data?.prev?.dapat_diulang ? 'Ya' : 'Tidak' : context?.data?.current?.dapat_diulang ? 'Ya' : 'Tidak'}
                                                        autoComplete='off'
                                                        disabled
                                                    />
                                                    <label
                                                        htmlFor="dapatDiulang"
                                                        className={styles.form__label}
                                                    >
                                                        Bisa Diulang
                                                    </label>
                                                </div>
                                                <div className={styles.form__input_field}>
                                                    <input
                                                        type="text"
                                                        id="maxNilai"
                                                        placeholder=" "
                                                        className={styles.form__input}
                                                        value={isSebelumForm ? context?.data?.prev?.target_nilai?.indeks || '-' : context?.data?.current?.target_nilai?.indeks || '-'}
                                                        autoComplete='off'
                                                        disabled
                                                    />
                                                    <label
                                                        htmlFor="maxNilai"
                                                        className={styles.form__label}
                                                    >
                                                        Nilai Maks
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={styles.form__input_field}>
                                                <input
                                                    type="text"
                                                    id="date"
                                                    placeholder=" "
                                                    className={styles.form__input}
                                                    value={isSebelumForm ? context?.data?.prev?.stamp ? unixToDate(context?.data?.prev?.stamp, null, { dateStyle: 'full', timeStyle: 'medium' }) : 'Tidak Diketahui' : context?.data?.current?.stamp ? unixToDate(context?.data?.current?.stamp, null, { dateStyle: 'full', timeStyle: 'medium' }) : 'Tidak Diketahui'}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                                <label
                                                    htmlFor="date"
                                                    className={styles.form__label}
                                                >
                                                    {
                                                        isSebelumForm ?
                                                            context?.data?.prev?.type === 'tambah' ? 'Ditambah'
                                                                : context?.data?.prev?.type === 'ubah' ? 'Diedit'
                                                                    : context?.data?.prev?.type === 'hapus' ? 'Dihapus'
                                                                        : 'Tanggal'
                                                            :
                                                            context?.data?.current?.type === 'tambah' ? 'Ditambah'
                                                                : context?.data?.current?.type === 'ubah' ? 'Diedit'
                                                                    : context?.data?.current?.type === 'hapus' ? 'Dihapus'
                                                                        : 'Tanggal'
                                                    }
                                                </label>
                                            </div>
                                        </form>
                                    </Inner>
                                    {context?.data?.fromTabel ?
                                        <div className={styles.form__action}>
                                            <div className={styles.gtc_repeat2_1fr} style={{ height: '100%' }}>
                                                <Button
                                                    title='Hapus'
                                                    action={handleHapusMatakuliah}
                                                    className={`${styles.btn} ${styles.confirm} ${styles.reset}`}
                                                />
                                                <Button
                                                    title='Batalkan'
                                                    action={() => {
                                                        context.setModal('perubahanTerakhirConfirm');
                                                    }}
                                                    className={styles.btn}
                                                />
                                            </div>
                                        </div>
                                        : <div className={styles.form__action}>
                                            <Button
                                                title='Batalkan'
                                                action={() => {
                                                    context.setModal('perubahanTerakhirConfirm');
                                                }}
                                                className={styles.btn}
                                            />
                                        </div>
                                    }
                                </Layout>
                                :
                                <Layout className={styles.perubahan__terakhir}>
                                    <Head title='Detail Matakuliah' />
                                    <Inner>
                                        <form>
                                            <div className={styles.form__input_field}>
                                                <input
                                                    type="text"
                                                    id="nama"
                                                    placeholder=" "
                                                    className={styles.form__input}
                                                    value={context?.data?.current?.nama || '-'}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                                <label
                                                    htmlFor="nama"
                                                    className={styles.form__label}
                                                >
                                                    Nama
                                                </label>
                                            </div>
                                            <div className={styles.gtc_repeat3_1fr}>
                                                <div className={styles.form__input_field}>
                                                    <input
                                                        type="number"
                                                        id="sks"
                                                        placeholder=" "
                                                        className={styles.form__input}
                                                        value={context?.data?.current?.sks || '-1'}
                                                        autoComplete='off'
                                                        disabled
                                                    />
                                                    <label
                                                        htmlFor="sks"
                                                        className={styles.form__label}
                                                    >
                                                        Sks
                                                    </label>
                                                </div>
                                                <div className={styles.form__input_field}>
                                                    <input
                                                        type="text"
                                                        id="nilai"
                                                        placeholder=" "
                                                        className={styles.form__input}
                                                        value={context?.data?.current?.nilai?.indeks || '-'}
                                                        autoComplete='off'
                                                        disabled
                                                    />
                                                    <label
                                                        htmlFor="nilai"
                                                        className={styles.form__label}
                                                    >
                                                        Nilai
                                                    </label>
                                                </div>
                                                <div className={styles.form__input_field}>
                                                    <input
                                                        type="number"
                                                        id="semester"
                                                        placeholder=" "
                                                        className={styles.form__input}
                                                        value={context?.data?.current?.semester || '-1'}
                                                        autoComplete='off'
                                                        disabled
                                                    />
                                                    <label
                                                        htmlFor="semester"
                                                        className={styles.form__label}
                                                    >
                                                        Semester
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={styles.gtc_repeat2_1fr}>
                                                <div className={styles.form__input_field}>
                                                    <input
                                                        type="text"
                                                        id="dapatDiulang"
                                                        placeholder=" "
                                                        className={styles.form__input}
                                                        value={context?.data?.current?.dapat_diulang ? 'Ya' : 'Tidak'}
                                                        autoComplete='off'
                                                        disabled
                                                    />
                                                    <label
                                                        htmlFor="dapatDiulang"
                                                        className={styles.form__label}
                                                    >
                                                        Bisa Diulang
                                                    </label>
                                                </div>
                                                <div className={styles.form__input_field}>
                                                    <input
                                                        type="text"
                                                        id="maxNilai"
                                                        placeholder=" "
                                                        className={styles.form__input}
                                                        value={context?.data?.current?.target_nilai?.indeks || '-'}
                                                        autoComplete='off'
                                                        disabled
                                                    />
                                                    <label
                                                        htmlFor="maxNilai"
                                                        className={styles.form__label}
                                                    >
                                                        Nilai Maks
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={styles.form__input_field}>
                                                <input
                                                    type="text"
                                                    id="date"
                                                    placeholder=" "
                                                    className={styles.form__input}
                                                    value={context?.data?.current?.stamp ? unixToDate(context?.data?.current?.stamp, null, { dateStyle: 'full', timeStyle: 'medium' }) : 'Tidak Diketahui'}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                                <label
                                                    htmlFor="date"
                                                    className={styles.form__label}
                                                >
                                                    {
                                                        context?.data?.current?.type === 'tambah' ? 'Ditambah'
                                                            : context?.data?.current?.type === 'ubah' ? 'Diedit'
                                                                : context?.data?.current?.type === 'hapus' ? 'Dihapus'
                                                                    : 'Tanggal'
                                                    }
                                                </label>
                                            </div>
                                        </form>
                                    </Inner>
                                    {context?.data?.fromTabel ?
                                        <div className={styles.form__action}>
                                            <div className={styles.gtc_repeat2_1fr} style={{ height: '100%' }}>
                                                <Button
                                                    title='Hapus Permanen'
                                                    action={() => {
                                                        context.setModal('hapusPermanentConfirm');
                                                    }}
                                                    className={`${styles.btn} ${styles.confirm} ${styles.reset}`}
                                                />
                                                <Button
                                                    title='Batalkan'
                                                    action={() => {
                                                        context.setModal('perubahanTerakhirConfirm');
                                                    }}
                                                    className={styles.btn}
                                                />
                                            </div>
                                        </div>
                                        : <div className={styles.form__action}>
                                            <Button
                                                title='Batalkan'
                                                action={() => {
                                                    context.setModal('perubahanTerakhirConfirm');
                                                }}
                                                className={styles.btn}
                                            />
                                        </div>
                                    }
                                </Layout>
                        }
                    </Backdrop>
                )
            }}
        </ModalContext.Consumer>
    )
}

export default PerubahanTerakhirDetail;