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
import { getLoadingMessage, fetchWithAuth } from '@/utils/client_side';
import { handleApiResponseError } from '@/component/modal/utils';
import isLength from 'validator/lib/isLength';
import isInt from 'validator/lib/isInt';
import isEmpty from 'validator/lib/isEmpty';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css'
// #endregion

/**
 * @typedef {Object} DetailMatkulModalData
 * Data yang digunakan pada modal {@link DetailMatkul}
 * @property {import('@/types/supabase').MatkulData['id']} id
 * Id matakuliah dalam bentuk `uuid-v4`
 * @property {import('@/types/supabase').MatkulData['nama']} nama
 * Nama matakuliah dengan kriteria
 * - min_length : `3`
 * - max_length : `50`
 * @property {import('@/types/supabase').MatkulData['nilai']['indeks']} nilai
 * Indeks nilai matakuliah
 * @property {import('@/types/supabase').MatkulData['semester']} semester
 * Semester matakuliah dengan kriteria
 * - min : `0`
 * - max : `50`
 * @property {import('@/types/supabase').MatkulData['sks']} sks
 * Sks matakuliah dengan kriteria
 * - min: `0`
 * - max : `50`
 * @property {import('@/types/supabase').MatkulData['target_nilai']['indeks']} target
 * Indeks nilai target matakuliah
 * @property {boolean} edit
 * Boolean sebagai initial state modal. Saat `true` form dapat diubah, sedangkan saat `false` form tidak dapat diubah
 * @property {'ya' | 'tidak'} diulang
 * Matakuliah dapat diulang atau tidak
 * @property {string} diedit
 * Date dalam string kapan matakuliah diedit yang diresolve menggunakan utils method `unixToDate`
 * @property {string} dibuat
 * Date dalam string kapan matakuliah dibuat yang diresolve menggunakan utils method `unixToDate`
 * @property {import('@/types/supabase').UniversitasData['penilaian']} penilaian
 * Indeks nilai yang digunakan pada universitas tertentu. Perlu diingat setiap universitas mungkin menggunakan indeks nilai yang berbeda, sehingga beberapa key dari property ini dapat bernilai `null`
 * - Note : Selalu gunakan optional chaining atau nullish coalescing saat mengakses key dari property ini untuk menghindari error
 */
const DetailMatkul = () => {
    const router = useRouter();
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    /** @type {import('@/types/context').ModalContext<DetailMatkulModalData>} */
    const { data } = React.useContext(ModalContext);
    const [nama, setNama] = React.useState(data.nama ?? '');
    const [sks, setSks] = React.useState(data.sks ?? '');
    const [nilai, setNilai] = React.useState(data.nilai ?? '');
    const [semester, setSemester] = React.useState(data.semester ?? '');
    const [dapatDiulang, setDapatDiulang] = React.useState(data.diulang ?? '');
    const [targetNilai, setTargetNilai] = React.useState(data.target ?? '');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [ubahMatkul, setUbahMatkul] = React.useState(data.edit ?? false);

    const handleNamaChange = (e) => {
        const newNama = e.target.value;
        if (newNama.length <= 50) {
            setNama(newNama);
        }
    }

    return (
        <ModalContext.Consumer>
            {/** @param {import('@/types/context').ModalContext<DetailMatkulModalData>} context */ context => {
                const penilaian = context.data.penilaian;
                const penilaianKey = Object.keys(penilaian);

                const validateForm = () => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            if (!accessToken) { throw new Error('Missing user access token'); }
                            if (!userIdCookie) { throw new Error('Missing user id'); }

                            // Validating 'Nama'
                            if (isEmpty(nama, { ignore_whitespace: true })) { setErrorMessage('Nama matakuliah dibutuhkan'); resolve(null); }
                            else {
                                if (!isLength(nama, { min: 3, max: 50 })) { setErrorMessage('Nama matakuliah minimal 3 karakter maksimal 50 karakter'); resolve(null); }
                            }

                            // Validating 'Sks'
                            if (isEmpty(sks, { ignore_whitespace: true })) { setErrorMessage('Sks matakuliah dibutuhkan'); resolve(null); }
                            else {
                                if (!isInt(sks, { min: 0, max: 50 })) { setErrorMessage('Sks harus angka (min: 0, max: 50)'); resolve(null); }
                            }

                            // Validating 'Nilai'
                            if (!penilaian.hasOwnProperty(nilai)) { setErrorMessage('Nilai matakuliah dibutuhkan'); resolve(null); }
                            else {
                                if (Number(penilaian[nilai].weight) > 4) { setErrorMessage('Nilai tidak valid'); resolve(null); }
                            }

                            // Validating 'Semester'
                            if (isEmpty(semester, { ignore_whitespace: true })) { setErrorMessage('Semester matakuliah dibutuhkan'); resolve(null); }
                            else {
                                if (!isInt(semester, { min: 0, max: 50 })) { setErrorMessage('Semester harus angka (min: 0, max: 50)'); resolve(null); }
                            }

                            resolve({
                                nama: nama,
                                semester: Number(semester),
                                sks: Number(sks),
                                nilai: {
                                    indeks: nilai
                                },
                                dapat_diulang: dapatDiulang === 'ya' ? true : false,
                                target_nilai: {
                                    indeks: targetNilai || 'A'
                                }
                            })
                        } catch (error) { reject(error); }
                    })
                }

                const toggleEditMatkul = () => {
                    if (ubahMatkul) { setUbahMatkul(false); setErrorMessage(''); }
                    else {
                        setNama(context?.data?.nama || '');
                        setSks(context?.data?.sks || '');
                        setNilai(context?.data?.nilai || '');
                        setSemester(context?.data?.semester || '');
                        setDapatDiulang(context?.data?.diulang || '');
                        setTargetNilai(context?.data?.target || '');
                        setUbahMatkul(true);
                    }
                }

                const handleEditMatkul = async (e) => {
                    e.preventDefault();

                    // Validate Here, if ErrorValidate then setErrorMessage
                    try {
                        var validatedData = await validateForm();
                        if (!validatedData) { return; }
                        context.handleModalClose();
                    } catch (error) {
                        context.handleModalClose();
                        console.error(error.message || 'Terjadi kesalahan');
                        toast.error('Terjadi kesalahan, silahkan coba lagi', { position: 'top-left', duration: 4000 });
                        router.refresh();
                        return;
                    }

                    const editMatkul = () => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                if (
                                    !accessToken ||
                                    !userIdCookie ||
                                    !context?.data?.id ||
                                    !context?.data?.nama
                                ) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }

                                const response = await fetchWithAuth('PATCH', 'matkul', accessToken, validatedData, { id: context.data.id })

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
                        });
                    };

                    toast.promise(
                        editMatkul(),
                        {
                            loading: `${getLoadingMessage(false, 1)}`,
                            success: `${context.data.nama ?? 'Matakuliah'} berhasil diedit`,
                            error: (error) => `${error?.message ?? 'Terjadi kesalahan'}`
                        },
                        {
                            position: 'top-left',
                            duration: 4000,
                        }
                    )
                }

                const handleHapusMatkul = async (e) => {
                    e.preventDefault();
                    context.handleModalClose();

                    const deleteMatkul = () => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                if (
                                    !accessToken ||
                                    !userIdCookie ||
                                    !context?.data?.id ||
                                    !context?.data?.nama
                                ) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }

                                const response = await fetchWithAuth('DELETE', 'matkul', accessToken, null, { id: context.data.id });

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
                                                    const filteredMatkul = currentMatkul.filter(matkul => matkul.id !== `${context.data.id}`);
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
                            success: `${context.data.nama ?? 'Matakuliah'} berhasil dihapus`,
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
                            as='form'
                            onEsc={true}
                            onSubmit={ubahMatkul ? handleEditMatkul : handleHapusMatkul}
                            className={`${styles.detail__matakuliah}`}
                            style={ubahMatkul ? {
                                gridTemplateRows: '30px auto 100px',
                                overflow: 'hidden'
                            } : {}}
                        >
                            <Head title={ubahMatkul ? 'Ubah Matakuliah' : 'Detail Matakuliah'} />

                            <Inner>
                                <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--danger-color)' }}>
                                    {errorMessage}
                                </div>

                                <div className={styles.form__input_field}>
                                    <div>
                                        <input
                                            type="text"
                                            id="nama"
                                            minLength="3"
                                            maxLength="50"
                                            placeholder=" "
                                            className={`${styles.form__input} ${styles.max_length}`}
                                            value={ubahMatkul ? nama : context?.data?.nama || ''}
                                            onChange={handleNamaChange}
                                            onFocus={() => { setErrorMessage('') }}
                                            disabled={!ubahMatkul}
                                            required
                                        />
                                        <label
                                            htmlFor="nama"
                                            className={styles.form__label}
                                        >
                                            Nama
                                        </label>
                                    </div>

                                    <div className={`${styles.form__input_length} ${nama.length >= 50 ? styles.max : ''}`}>
                                        <small>{nama.length}/50</small>
                                    </div>
                                </div>

                                <div className={styles.gtc_repeat3_1fr}>
                                    <div className={styles.form__input_field}>
                                        <input
                                            type="number"
                                            id="sks"
                                            step="1"
                                            min="0"
                                            max="50"
                                            placeholder=" "
                                            className={styles.form__input}
                                            value={ubahMatkul ? sks : context?.data?.sks || ''}
                                            onChange={(e) => { setSks(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
                                            disabled={!ubahMatkul}
                                            required
                                        />
                                        <label
                                            htmlFor="sks"
                                            className={styles.form__label}
                                        >
                                            Sks
                                        </label>
                                    </div>
                                    <div className={styles.form__input_field}>
                                        <select
                                            id="nilai"
                                            className={`${styles.form__select} ${nilai || context?.data?.nilai ? styles.filled : ''}`}
                                            value={ubahMatkul ? nilai : context?.data?.nilai || ''}
                                            onChange={(e) => { setNilai(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
                                            disabled={!ubahMatkul}
                                            style={ubahMatkul ? {} : { cursor: 'auto' }}
                                            required
                                        >
                                            <option value={''} disabled hidden></option>
                                            {penilaianKey.map((nilai) => (
                                                <option value={nilai} key={crypto.randomUUID()}>{nilai}</option>
                                            ))
                                            }
                                        </select>
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
                                            step="1"
                                            min="0"
                                            max="50"
                                            placeholder=" "
                                            className={styles.form__input}
                                            value={ubahMatkul ? semester : context?.data?.semester || ''}
                                            onChange={(e) => { setSemester(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
                                            disabled={!ubahMatkul}
                                            required
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
                                        <select
                                            id="dapatDiulang"
                                            className={`${styles.form__select} ${dapatDiulang || context?.data?.diulang ? styles.filled : ''}`}
                                            value={ubahMatkul ? dapatDiulang : context?.data?.diulang || ''}
                                            onChange={(e) => { setDapatDiulang(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
                                            disabled={!ubahMatkul}
                                            style={ubahMatkul ? {} : { cursor: 'auto ' }}
                                            required
                                        >
                                            <option value={''} disabled hidden></option>
                                            <option value={'ya'}>Ya</option>
                                            <option value={'tidak'}>Tidak</option>
                                        </select>
                                        <label
                                            htmlFor="dapatDiulang"
                                            className={styles.form__label}
                                        >
                                            Bisa Diulang
                                        </label>
                                    </div>

                                    <div className={styles.form__input_field}>
                                        <select
                                            id="maxNilai"
                                            className={`${styles.form__select} ${targetNilai || context?.data?.target ? styles.filled : ''}`}
                                            value={ubahMatkul ? targetNilai : context?.data?.target || ''}
                                            onChange={(e) => { setTargetNilai(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
                                            disabled={!ubahMatkul}
                                            style={ubahMatkul ? {} : { cursor: 'auto ' }}
                                            required
                                        >
                                            <option value={''} disabled hidden></option>
                                            {penilaianKey.map((nilai) => (
                                                <option value={nilai} key={crypto.randomUUID()}>{nilai}</option>
                                            ))
                                            }
                                        </select>
                                        <label
                                            htmlFor="maxNilai"
                                            className={styles.form__label}
                                        >
                                            Target Nilai
                                        </label>
                                    </div>
                                </div>

                                <div style={{ marginTop: '.5rem', marginBottom: '1rem' }} className={styles.form__input_field}>
                                    <div>
                                        <input
                                            type="text"
                                            id="dibuat"
                                            placeholder=" "
                                            className={`${styles.form__input}`}
                                            style={{ cursor: ubahMatkul ? 'not-allowed' : 'default' }}
                                            value={context.data.dibuat ?? '-'}
                                            disabled={true}
                                            readOnly={true}
                                            required
                                        />
                                        <label
                                            htmlFor="dibuat"
                                            className={styles.form__label}
                                        >
                                            Ditambah
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.form__input_field}>
                                    <div>
                                        <input
                                            type="text"
                                            id="diedit"
                                            placeholder=" "
                                            className={`${styles.form__input}`}
                                            style={{ cursor: ubahMatkul ? 'not-allowed' : 'default' }}
                                            value={context.data.diedit ?? '-'}
                                            disabled={true}
                                            readOnly={true}
                                            required
                                        />
                                        <label
                                            htmlFor="diedit"
                                            className={styles.form__label}
                                        >
                                            Diedit
                                        </label>
                                    </div>
                                </div>
                            </Inner>

                            {ubahMatkul ?
                                <div
                                    className={styles.form__action}
                                >
                                    <button type='submit' className={styles.btn}>
                                        <h3>Simpan</h3>
                                    </button>
                                    <Button
                                        title='Batalkan'
                                        action={toggleEditMatkul}
                                        className={`${styles.btn} ${styles.cancel}`}
                                        style={{ marginTop: '.75rem' }}
                                    />
                                </div>
                                :
                                <div className={styles.form__action}>
                                    <div className={styles.gtc_repeat2_1fr} style={{ height: '100%' }}>
                                        <button style={{ marginTop: '0' }} type='submit' className={`${styles.btn} ${styles.confirm} ${styles.reset}`}>
                                            <h3>Hapus</h3>
                                        </button>
                                        <Button
                                            title='Edit'
                                            action={toggleEditMatkul}
                                            className={styles.btn}
                                        />
                                    </div>
                                </div>
                            }
                        </Layout>
                    </Backdrop>
                )
            }}
        </ModalContext.Consumer>
    )
}

export default DetailMatkul;