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
import { Backdrop, Layout, Head, Button, Inner } from '@/component/modal/components';
// #endregion

// #region ICON DEPEDENCY
import { FaEye, FaEyeSlash } from 'react-icons/fa'
// #endregion

// #region UTIL DEPEDENCY
import { getLoadingMessage, checkStrongPassword, fetchWithAuth } from '@/utils/client_side';
import { handleApiResponseError } from '@/component/modal/utils';
import isLength from 'validator/lib/isLength';
import isEmpty from 'validator/lib/isEmpty';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css'
// #endregion

const Akun = () => {
    const router = useRouter();
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    const [editPassword, setEditPassword] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [hidePassword, setHidePassword] = React.useState(true);
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const [hidePasswordConfirm, setHidePasswordConfirm] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState('');

    const handlePasswordChange = (e) => {
        setErrorMessage('')
        const { value } = e.target;
        if (value.length <= 50) { setPassword(value) }
    }

    const handlePasswordConfirmChange = (e) => {
        setErrorMessage('')
        setPasswordConfirm(e.target.value);
    }

    const getPasswordLevelStyles = () => {
        if (password.length < 6) {
            return styles.less
        } else if (password.length > 50) {
            return styles.max
        } else {
            return styles[`${checkStrongPassword(password).level}`]
        }
    }

    const getPasswordConfirmLevelStyles = () => {
        if (password.length > 0) {
            if (passwordConfirm === password) { return styles.valid }
            else { return styles.invalid }
        }
        else {
            return ''
        }
    }

    return (
        <ModalContext.Consumer>
            {/** @param {import('@/types/context').ModalContext<any>} context */ context => {
                const toggleEditPassword = () => {
                    if (editPassword) { setEditPassword(false); setPassword(''); setPasswordConfirm(''); setErrorMessage(''); }
                    else { setEditPassword(true); }
                }

                const validateForm = () => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            if (!accessToken) { throw new Error('Missing user access token'); }
                            if (!userIdCookie) { throw new Error('Missing user id'); }

                            // Validating 'Password'
                            if (isEmpty(password, { ignore_whitespace: true })) { setErrorMessage('Password dibutuhkan'); resolve(null); }
                            else {
                                if (!isLength(password, { min: 6, max: 50 })) { setErrorMessage('Password min 6, max 50 karakter'); resolve(null); }
                            }

                            // Validating 'Password Confirm'
                            if (isEmpty(passwordConfirm, { ignore_whitespace: true })) { setErrorMessage('Konfirmasi password dibutuhkan'); resolve(null); }
                            else {
                                if (passwordConfirm !== password) { setErrorMessage('Konfirmasi password tidak sesuai'); resolve(null); }
                            }

                            resolve({
                                password
                            })
                        } catch (error) { reject(error); }
                    })
                }

                const handleEditPassword = async (e) => {
                    e.preventDefault();

                    // Validate Here, if ErrorValidate then setErrorMessage
                    try {
                        var validatedData = await validateForm();
                        if (!validatedData) { return }
                        context.handleModalClose();
                    } catch (error) {
                        context.handleModalClose();
                        console.error(error.message || 'Terjadi kesalahan');
                        toast.error('Terjadi kesalahan, silahkan coba lagi', { position: 'top-left', duration: 4000 });
                        router.refresh();
                        return;
                    }

                    const editPassword = () => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                if (!accessToken | !userIdCookie) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }

                                const response = await fetchWithAuth('PATCH', 'password', accessToken, validatedData);

                                if (!response.ok) {
                                    const { toastMessage, refresh, navigate } = await handleApiResponseError(response);
                                    if (refresh) { router.refresh() }
                                    if (navigate && navigate?.type === 'push' && navigate?.to) { router.push(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                    if (navigate && navigate?.type === 'replace' && navigate?.to) { router.replace(navigate.to, { scroll: navigate?.scrollOptions ?? true }) }
                                    throw new Error(toastMessage);
                                } else { resolve(); }
                            } catch (error) { reject(error); }
                        });
                    }

                    toast.promise(
                        editPassword(),
                        {
                            loading: `${getLoadingMessage(false, 1)}`,
                            success: `Password berhasil diganti`,
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
                            onSubmit={handleEditPassword}
                            className={`${styles.akun} ${editPassword ? styles.ganti_password : ''}`}
                        >
                            <Head title={editPassword ? 'Ganti Password' : 'Detail Akun'} />

                            <Inner>
                                <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--danger-color)' }}>
                                    {errorMessage}
                                </div>

                                {editPassword && (
                                    <div style={{ display: 'grid', gridTemplateRows: 'repeat(2,1fr)', gap: '0' }}>
                                        <div className={styles.form__input_field}>
                                            <div>
                                                <input
                                                    type={hidePassword ? 'password' : 'text'}
                                                    id="password"
                                                    placeholder=" "
                                                    autoComplete='off'
                                                    className={`${styles.form__input} ${styles.password_tool}`}
                                                    value={password}
                                                    onChange={handlePasswordChange}
                                                    onFocus={() => { setErrorMessage('') }}
                                                    disabled={!editPassword}
                                                    required
                                                />
                                                <label
                                                    htmlFor="password"
                                                    className={styles.form__label}
                                                >
                                                    Password Baru
                                                </label>
                                            </div>

                                            <div className={styles.password__tool}>
                                                <div className={`${styles.password__level} ${getPasswordLevelStyles()}`}>
                                                    <small />
                                                </div>
                                                <div className={styles.password__eye}>
                                                    <span onClick={() => setHidePassword(!hidePassword)}>
                                                        {hidePassword ? <FaEye /> : <FaEyeSlash />}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.form__input_field}>
                                            <div>
                                                <input
                                                    type={hidePasswordConfirm ? 'password' : 'text'}
                                                    id="passwordConfirm"
                                                    placeholder=" "
                                                    autoComplete='off'
                                                    className={`${styles.form__input} ${styles.password_tool}`}
                                                    value={passwordConfirm}
                                                    onChange={handlePasswordConfirmChange}
                                                    onFocus={() => { setErrorMessage('') }}
                                                    onPaste={(e) => {
                                                        e.preventDefault(); setErrorMessage('Untuk keamanan, silahkan ketik ulang password barumu'); return false;
                                                    }}
                                                    disabled={!editPassword}
                                                    required
                                                />
                                                <label
                                                    htmlFor="passwordConfirm"
                                                    className={styles.form__label}
                                                >
                                                    Konfirmasi Password Baru
                                                </label>
                                            </div>

                                            <div className={styles.password__tool}>
                                                <div className={`${styles.password__level} ${getPasswordConfirmLevelStyles()}`}>
                                                    <small />
                                                </div>
                                                <div className={styles.password__eye}>
                                                    <span onClick={() => setHidePasswordConfirm(!hidePasswordConfirm)}>
                                                        {hidePasswordConfirm ? <FaEye /> : <FaEyeSlash />}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!editPassword && (
                                    <div style={{ display: 'grid', gridTemplateRows: 'repeat(3,1fr)', gap: '0' }}>
                                        <div className={styles.form__input_field}>
                                            <div>
                                                <input
                                                    type="text"
                                                    id="email"
                                                    placeholder=" "
                                                    className={`${styles.form__input}`}
                                                    value={context?.data[0]?.email ?? '-'}
                                                    disabled={true}
                                                    readOnly={true}
                                                />
                                                <label
                                                    htmlFor="email"
                                                    className={styles.form__label}
                                                >
                                                    Email
                                                </label>
                                            </div>
                                        </div>

                                        <div className={styles.form__input_field}>
                                            <div>
                                                <input
                                                    type="text"
                                                    id="confirmedAt"
                                                    placeholder=" "
                                                    className={`${styles.form__input}`}
                                                    value={
                                                        context?.data[0]?.email_confirmed_at ?
                                                            (() => {
                                                                try {
                                                                    const date = new Date(context.data[0].email_confirmed_at);
                                                                    return date.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' });
                                                                } catch (error) {
                                                                    return '-';
                                                                }
                                                            })()
                                                            : '-'
                                                    }
                                                    disabled={true}
                                                    readOnly={true}
                                                    required
                                                />
                                                <label
                                                    htmlFor="confirmedAt"
                                                    className={styles.form__label}
                                                >
                                                    Dikonfirmasi
                                                </label>
                                            </div>
                                        </div>

                                        <div className={styles.form__input_field}>
                                            <div>
                                                <input
                                                    type="text"
                                                    id="roles"
                                                    placeholder=" "
                                                    style={{ textTransform: 'capitalize' }}
                                                    className={`${styles.form__input}`}
                                                    value={context?.data[0]?.roles ?? '-'}
                                                    disabled={true}
                                                    readOnly={true}
                                                />
                                                <label
                                                    htmlFor="roles"
                                                    className={styles.form__label}
                                                >
                                                    Status
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Inner>

                            <div
                                style={editPassword ? {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2,1fr)',
                                    gap: '1rem'
                                } : {}}
                                className={styles.form__action}
                            >
                                {editPassword ?
                                    <>
                                        <Button
                                            title='Batalkan'
                                            action={toggleEditPassword}
                                            className={`${styles.btn} ${styles.cancel}`}
                                            style={{ marginTop: '0' }}
                                        />
                                        <button type='submit' className={styles.btn}>
                                            <h3>Simpan</h3>
                                        </button>
                                    </>
                                    :
                                    <Button
                                        title='Ganti Password'
                                        action={toggleEditPassword}
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

export default Akun;