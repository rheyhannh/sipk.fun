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
import { Backdrop, Layout, Head, Inner, Button } from '@/component/modal/components';
// #endregion

// #region UTIL DEPEDENCY
import isLength from 'validator/lib/isLength';
import isInt from 'validator/lib/isInt';
import isEmpty from 'validator/lib/isEmpty';
import isFloat from 'validator/lib/isFloat'
import isAlpha from 'validator/lib/isAlpha';
import { getLoadingMessage, fetchWithAuth, getApiURL } from '@/utils/client_side';
import { handleApiResponseError } from '@/component/modal/utils';
import { handleApiErrorResponse } from '@/lib/bugsnag';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css'
// #endregion

/**
 * @typedef {Array<import('@/types/supabase').UserData>} ProfilModalData
 * Data yang digunakan pada modal {@link Profil}
 */
const Profil = () => {
    const router = useRouter();
    const cookies = useCookies();
    const userIdCookie = cookies.get('s_user_id');
    const accessToken = cookies.get('s_access_token');
    const [editProfil, setEditProfil] = React.useState(false);
    const [nama, setNama] = React.useState('');
    const [nickname, setNickname] = React.useState('');
    const [universitas, setUniversitas] = React.useState('');
    const [jurusan, setJurusan] = React.useState('');
    const [sksTarget, setSksTarget] = React.useState('');
    const [matkulTarget, setMatkulTarget] = React.useState('');
    const [ipkTarget, setIpkTarget] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleNamaChange = (e) => {
        const newNama = e.target.value;
        if (newNama.length <= 50) {
            setNama(newNama);
        }
    }

    const handleNicknameChange = (e) => {
        const newNickname = e.target.value;
        if (newNickname.length <= 20) {
            setNickname(newNickname);
        }
    }

    const handleJurusanChange = (e) => {
        const newJurusan = e.target.value;
        if (newJurusan.length <= 30) {
            setJurusan(newJurusan);
        }
    }

    const handleSksTargetChange = (e) => {
        const newSksTarget = e.target.value;
        setSksTarget(newSksTarget);
    }

    const handleMatkulTargetChange = (e) => {
        const newMatkulTarget = e.target.value;
        setMatkulTarget(newMatkulTarget);
    }

    const handleIpkTargetChange = (e) => {
        const newIpkTarget = e.target.value;
        setIpkTarget(newIpkTarget);
    }

    return (
        <ModalContext.Consumer>
            {/** @param {import('@/types/context').ModalContext<ProfilModalData>} context */ context => {
                const validateForm = () => {
                    // Validating 'Nama'
                    if (isEmpty(nama, { ignore_whitespace: true })) { setErrorMessage('Nama lengkap dibutuhkan'); return false; }
                    if (!isLength(nama, { min: 6, max: 50 })) { setErrorMessage('Nama lengkap minimal 6 karakter maksimal 50 karakter'); return false; }
                    if (!isAlpha(nama.replace(/\s/g, ''))) { setErrorMessage('Nama lengkap hanya dapat menggunakan huruf'); return false; }
                    const fullNameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
                    if (!fullNameRegex.test(nama)) { setErrorMessage('Nama lengkap hanya dapat menggunakan 1 spasi disetiap kata'); return false; }

                    // Validating 'Nickname'
                    if (isEmpty(nickname, { ignore_whitespace: true })) { setErrorMessage('Nickname dibutuhkan'); return false; }
                    if (!isLength(nickname, { min: 3, max: 20 })) { setErrorMessage('Nickname minimal 3 karakter maksimal 20 karakter'); return false; }

                    // Validating 'Jurusan'
                    if (isEmpty(jurusan, { ignore_whitespace: true })) { setErrorMessage('Jurusan dibutuhkan'); return false; }
                    if (!isLength(jurusan, { min: 6, max: 30 })) { setErrorMessage('Jurusan minimal 6 karakter maksimal 30 karakter'); return false; }

                    // Validating 'Sks Target'
                    if (isEmpty(sksTarget, { ignore_whitespace: true })) { setErrorMessage('Sks target dibutuhkan'); return false; }
                    if (!isInt(sksTarget, { min: 5, max: 1000 })) { setErrorMessage('Sks target harus angka bulat (min: 5, max: 1000)') }

                    // Validating 'Matkul Target
                    if (isEmpty(matkulTarget, { ignore_whitespace: true })) { setErrorMessage('Matakuliah target dibutuhkan'); return false; }
                    if (!isInt(matkulTarget, { min: 5, max: 1000 })) { setErrorMessage('Matakuliah target harus angka bulat (min: 5, max: 1000)') }

                    // Validating 'IPK Target'
                    if (isEmpty(ipkTarget, { ignore_whitespace: true })) { setErrorMessage('Ipk target dibutuhkan'); return false; }
                    if (!isFloat(ipkTarget, { min: 1.00, max: 4.00 })) { setErrorMessage('Ipk target harus angka (min: 1.00, max: 4.00)') }

                    return {
                        fullname: nama,
                        nickname: nickname,
                        jurusan: jurusan,
                        sks_target: sksTarget,
                        matkul_target: matkulTarget,
                        ipk_target: ipkTarget
                    }
                }

                const toggleEditProfil = () => {
                    if (editProfil) { setEditProfil(false); setErrorMessage(''); }
                    else {
                        setNama(`${context?.data[0]?.fullname}`);
                        setNickname(`${context?.data[0]?.nickname}`);
                        setUniversitas(`${context?.data[0]?.university}`);
                        setJurusan(`${context?.data[0]?.jurusan}`);
                        setSksTarget(`${context?.data[0]?.sks_target}`);
                        setMatkulTarget(`${context?.data[0]?.matkul_target}`);
                        setIpkTarget(`${context?.data[0]?.ipk_target}`);
                        setEditProfil(true);
                    }
                }

                const handleEditProfil = async (e) => {
                    e.preventDefault();

                    // Validate Here, if ErrorValidate then setErrorMessage
                    const validatedData = validateForm();
                    if (!validatedData) { return }
                    context.handleModalClose();

                    const editProfil = () => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                if (!accessToken || !userIdCookie) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }

                                const response = await fetchWithAuth('PATCH', 'me', accessToken, validatedData);

                                if (!response.ok) {
                                    const { toastMessage, refresh, navigate, parsed } = await handleApiResponseError(response);
                                    if (
                                        typeof parsed?.error?.digest === 'string' &&
                                        parsed.error.digest.startsWith('critical')
                                    ) {
                                        handleApiErrorResponse('PATCH', getApiURL('me'), parsed, cookies);
                                    }
                                    if (refresh) { router.refresh() }
                                    if (navigate && navigate?.type === 'push' && navigate?.to) { router.push(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                    if (navigate && navigate?.type === 'replace' && navigate?.to) { router.replace(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                    throw new Error(toastMessage);
                                } else {
                                    try {
                                        /** @type {{profil:import('@/types/supabase').UserData}} */
                                        const { profil } = await response.json();
                                        if (!profil) {
                                            throw new Error('Failed to update cache');
                                        }
                                        mutate(['/api/me', userIdCookie], profil, {
                                            populateCache: (profil, _) => {
                                                return [profil];
                                            },
                                            revalidate: false,
                                        });
                                        resolve();
                                    } catch (error) {
                                        mutate(['/api/me', userIdCookie]);
                                        resolve();
                                    }
                                }
                            } catch (error) { reject(error); }
                        });
                    };

                    toast.promise(
                        editProfil(),
                        {
                            loading: `${getLoadingMessage(false, 1)}`,
                            success: `Profil berhasil diperbarui`,
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
                            as={'form'}
                            onSubmit={handleEditProfil}
                            onEsc={true}
                            onEnter={(e, isLayout) => { if (isLayout && editProfil) handleEditProfil(e) }}
                            className={`${styles.profil} ${editProfil ? styles.confirm : ''}`}
                        >
                            <Head title={editProfil ? 'Edit Profil' : 'Profil'} />

                            <Inner>
                                <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--danger-color)' }}>
                                    {errorMessage}
                                </div>
                                <div className={styles.form__input_field}>
                                    <div>
                                        <input
                                            type="text"
                                            id="nama"
                                            placeholder=" "
                                            className={`${styles.form__input} ${styles.max_length}`}
                                            value={editProfil ? nama : context?.data[0]?.fullname}
                                            onChange={handleNamaChange}
                                            onFocus={() => { setErrorMessage('') }}
                                            disabled={!editProfil}
                                            required
                                        />
                                        <label
                                            htmlFor="nama"
                                            className={styles.form__label}
                                        >
                                            Nama Lengkap
                                        </label>
                                    </div>

                                    <div className={`${styles.form__input_length} ${nama.length >= 50 ? styles.max : ''}`}>
                                        <small>{editProfil ? nama.length : context?.data[0]?.fullname?.length}/50</small>
                                    </div>
                                </div>
                                <div className={styles.nc}>
                                    <div className={styles.form__input_field}>
                                        <div>
                                            <input
                                                type="text"
                                                id="nickname"
                                                placeholder=" "
                                                className={`${styles.form__input} ${styles.max_length}`}
                                                value={editProfil ? nickname : context?.data[0]?.nickname}
                                                onChange={handleNicknameChange}
                                                onFocus={() => { setErrorMessage('') }}
                                                disabled={!editProfil}
                                                required
                                            />
                                            <label
                                                htmlFor="nickname"
                                                className={styles.form__label}
                                            >
                                                Nickname
                                            </label>
                                        </div>

                                        <div className={`${styles.form__input_length} ${nickname.length >= 20 ? styles.max : ''}`}>
                                            <small>{editProfil ? nickname.length : context?.data[0]?.nickname?.length}/20</small>
                                        </div>
                                    </div>

                                    <div className={styles.form__input_field}>
                                        <div>
                                            <input
                                                type="text"
                                                id="jurusan"
                                                placeholder=" "
                                                className={`${styles.form__input} ${styles.max_length}`}
                                                value={editProfil ? jurusan : context?.data[0]?.jurusan}
                                                onChange={handleJurusanChange}
                                                onFocus={() => { setErrorMessage('') }}
                                                disabled={!editProfil}
                                                required
                                            />
                                            <label
                                                htmlFor="jurusan"
                                                className={styles.form__label}
                                            >
                                                Jurusan
                                            </label>
                                        </div>

                                        <div className={`${styles.form__input_length} ${jurusan.length >= 30 ? styles.max : ''}`}>
                                            <small>{editProfil ? jurusan.length : context?.data[0]?.jurusan?.length}/30</small>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.form__input_field}>
                                    <div>
                                        <input
                                            type="text"
                                            id="universitas"
                                            placeholder=" "
                                            className={`${styles.form__input}`}
                                            style={{ cursor: editProfil ? 'not-allowed' : 'default', color: editProfil ? 'var(--infoDark-color)' : 'inherit' }}
                                            value={editProfil ? universitas : context?.data[0]?.university}
                                            disabled={true}
                                            readOnly={true}
                                            required
                                        />
                                        <label
                                            htmlFor="universitas"
                                            className={styles.form__label}
                                        >
                                            Universitas
                                        </label>
                                    </div>
                                </div>
                                <h3 style={{ marginTop: 'var(--m-0-75)', marginBottom: 'var(--m-0-5)', textAlign: 'center', color: 'var(--dark-color)' }}>Target</h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '25% 1fr 25%',
                                    gap: '1rem'
                                }}>
                                    <div className={styles.form__input_field}>
                                        <div>
                                            <input
                                                type="number"
                                                id="sksTarget"
                                                step="1"
                                                min="5"
                                                max="1000"
                                                placeholder=" "
                                                className={`${styles.form__input}`}
                                                value={editProfil ? sksTarget : context?.data[0]?.sks_target}
                                                onChange={handleSksTargetChange}
                                                onFocus={() => { setErrorMessage('') }}
                                                disabled={!editProfil}
                                                required
                                            />
                                            <label
                                                htmlFor="sksTarget"
                                                className={styles.form__label}
                                            >
                                                Sks
                                            </label>
                                        </div>
                                    </div>

                                    <div className={styles.form__input_field}>
                                        <div>
                                            <input
                                                type="number"
                                                id="matkulTarget"
                                                step="1"
                                                min="5"
                                                max="1000"
                                                placeholder=" "
                                                className={`${styles.form__input}`}
                                                value={editProfil ? matkulTarget : context?.data[0]?.matkul_target}
                                                onChange={handleMatkulTargetChange}
                                                onFocus={() => { setErrorMessage('') }}
                                                disabled={!editProfil}
                                                required
                                            />
                                            <label
                                                htmlFor="matkulTarget"
                                                className={styles.form__label}
                                            >
                                                Matakuliah
                                            </label>
                                        </div>
                                    </div>

                                    <div className={styles.form__input_field}>
                                        <div>
                                            <input
                                                type="number"
                                                id="ipkTarget"
                                                step="0.01"
                                                min="1.00"
                                                max="4.00"
                                                placeholder=" "
                                                className={`${styles.form__input}`}
                                                value={editProfil ? ipkTarget : context?.data[0]?.ipk_target}
                                                onChange={handleIpkTargetChange}
                                                onFocus={() => { setErrorMessage('') }}
                                                disabled={!editProfil}
                                                required
                                            />
                                            <label
                                                htmlFor="ipkTarget"
                                                className={styles.form__label}
                                            >
                                                Ipk
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </Inner>

                            <div
                                style={editProfil ? {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2,1fr)',
                                    gap: '1rem'
                                } : {}}
                                className={styles.form__action}
                            >
                                {editProfil ?
                                    <>
                                        <Button
                                            title='Batalkan'
                                            action={toggleEditProfil}
                                            className={`${styles.btn} ${styles.cancel}`}
                                            style={{ marginTop: '0' }}
                                        />
                                        <button type='submit' className={styles.btn}>
                                            <h3>Simpan</h3>
                                        </button>
                                    </>
                                    :
                                    <Button
                                        title='Edit Profil'
                                        action={toggleEditProfil}
                                        className={styles.btn}
                                    />
                                }
                            </div>
                        </Layout>
                    </Backdrop>
                )
            }}
        </ModalContext.Consumer>
    )
}

export default Profil;