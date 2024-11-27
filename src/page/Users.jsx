'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
import * as SupabaseTypes from '@/types/supabase';
import {
    ClientAPIResponseErrorProps as ApiResponseError,
    ClientAPIResponseSuccessProps as ApiResponseSuccess,
} from '@/constant/api_response';
// #endregion

// #region NEXT DEPEDENCY
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { mutate } from 'swr';
import { useCookies } from 'next-client-cookies';
import toast from 'react-hot-toast';
import { UsersContext } from '@/component/provider/Users';
import { ModalContext } from "@/component/provider/Modal";
import { Ball } from '@/component/loader/Loading';
// #endregion

// #region UTIL DEPEDENCY
import HCaptcha from '@hcaptcha/react-hcaptcha';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import isStrongPassword from 'validator/lib/isStrongPassword';
import isAlpha from 'validator/lib/isAlpha';
import isInt from 'validator/lib/isInt';
import isUUID from 'validator/lib/isUUID';
// #endregion

// #region DATA DEPEDENCY
import { useLocalTheme } from '@/data/core';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/users.module.css'
// #endregion

// #region ICON DEPEDENCY
import {
    FaEnvelope,
    FaLock,
    FaUser,
    FaUniversity,
    FaCheckCircle,
    FaExclamationCircle,
    FaInfoCircle,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import { FaCircleInfo, FaGear } from "react-icons/fa6";
import { FiSun } from 'react-icons/fi';
import { BiMoon } from 'react-icons/bi';
// #endregion

/**
 * Render users page `'/users'`
 * @param {{universitasData:Array<SupabaseTypes.UniversitasData>}} props Users props
 * @returns {React.ReactElement} Rendered users page
 */
export default function Users({ universitasData }) {
    /* ========== Next Hooks ========== */
    /** @type {React.MutableRefObject<HCaptcha>} */
    const captcha = React.useRef();
    const router = useRouter();
    const searchParams = useSearchParams();

    /* ========== Context ========== */
    /** @type {ContextTypes.UsersContext} */
    const {
        loginMode, setLoginMode,
        isBigContent
    } = React.useContext(UsersContext);

    /** @type {ContextTypes.ModalContext} */
    const {
        setModal,
        setActive,
        setData
    } = React.useContext(ModalContext);

    /* ========== Cookies ========== */
    const cookies = useCookies();
    const guestIdCookie = cookies.get('s_guest_id');

    /* ========== States ========== */
    // Init
    const listInputs = [
        'Email', 'Password', 'Nama Lengkap', 'Universitas', 'Email', 'Password'
    ]

    const initialInputValidator = listInputs.map((input) => (
        {
            state: `${styles.info}`,
            message: `${input} dibutuhkan`,
            status: 'empty',
        })
    );

    // Forms Inputs
    const [namaLengkap, setNamaLengkap] = React.useState('');
    const [universitas, setUniversitas] = React.useState(0);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    // Utils
    const [loading, setLoading] = React.useState({ active: false, backdrop: 'default', hideBall: false });
    const [errorMessageLogin, setErrorMessageLogin] = React.useState('');
    const [errorMessageDaftar, setErrorMessageDaftar] = React.useState('');
    const [hideLoginPassword, setHideLoginPassword] = React.useState(true);
    const [hideDaftarPassword, setHideDaftarPassword] = React.useState(true);
    const [inputValidator, setInputValidator] = React.useState(initialInputValidator);
    const [emailLogin, setEmailLogin] = React.useState(false);

    /* ========== Data ========== */
    const universitasError = !universitasData || !universitasData.length;
    const { data: theme } = useLocalTheme();

    /* ========== Images ========== */
    const emailImg = theme === 'dark' ?
        <Image src="/check_email_dark.svg" width={100} height={100} alt="Check Email" />
        : <Image src="/check_email.svg" width={100} height={100} alt="Check Email" />

    /* ========== useEffect ========== */

    React.useEffect(() => {
        window.addEventListener('focus', handleAuthCheck);

        return () => {
            window.removeEventListener('focus', handleAuthCheck);
        }
    }, [])

    React.useEffect(() => {
        // Login Mode or Daftar Mode ?
        const mode = searchParams.get('action');
        if (mode === 'daftar') { setLoginMode(false) }
        else { setLoginMode(true) }

        // Something Error ? 
        const error = searchParams.get('error');
        if (error && mode === 'login') {
            const errorList = {
                "isession": "Sesi invalid, silahkan login kembali",
                "esession": "Silahkan login terlebih dahulu",
                "ilink": "Magiclink invalid, silahkan login ulang"
            }
            router.refresh();
            setErrorMessageLogin(errorList[error] || 'Terjadi error, silahkan login kembali');
        }

        // From Logout ? 
        const logout = searchParams.get('logout');
        if (logout) { router.refresh(); }

        // Email Login ?
        const loginType = searchParams.get('type');
        if (loginType === 'email') { setEmailLogin(true); }

    }, [searchParams])

    /* ========== Methods, Functions, Helpers ========== */
    const handleAuthCheck = async () => {
        if (!cookies.get('s_access_token')) { return }
        setLoading({ active: true, backdrop: 'transparent', hideBall: true });
        try {
            const response = await fetch('/api/auth/check', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const redirectTo = searchParams.get('from');
                if (redirectTo && ['matakuliah'].includes(redirectTo)) {
                    router.replace(`/dashboard/${redirectTo}`, { scroll: false });
                } else {
                    router.replace('/dashboard', { scroll: false });
                }
            }

        } catch (error) {
            console.error('Gagal melakukan autentikasi');
        } finally {
            setLoading({ active: false });
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        if (inputValidator[0].status !== 'success' || inputValidator[1].status !== 'success') {
            toast.error('Pastikan data terisi dan valid', getToastOptions('login'));
            return;
        }

        if (!guestIdCookie || !isUUID(guestIdCookie)) {
            toast.error('Terjadi kesalahan, silahkan coba lagi', getToastOptions('login'));
            router.refresh();
            return;
        }

        setLoading({ active: true });
        captcha.current.execute({
            async: true
        })
            .then(async ({ response: token }) => {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, password: password, token: token }),
                })

                if (!response.ok) {
                    try {
                        /** @type {ApiResponseError} */
                        const { message } = await response.json();
                        if (response.status === 401) {
                            setErrorMessageLogin('Email atau password salah');
                        } else if (response.status === 429) {
                            setErrorMessageLogin(message ?? 'Terlalu banyak request, coba lagi dalam beberapa saat')
                        } else {
                            handleErrorModal('Sepertinya ada yang salah, silahkan coba lagi');
                            setErrorMessageLogin('Terjadi kesalahan saat login');
                        }
                    } catch {
                        throw new Error('Terjadi kesalahan saat login');
                    }
                } else {
                    const redirectTo = searchParams.get('from');
                    sessionStorage.clear();
                    if (redirectTo && ['matakuliah'].includes(redirectTo)) {
                        router.replace(`/dashboard/${redirectTo}`, { scroll: false });
                    } else {
                        router.replace('/dashboard', { scroll: false });
                    }
                }
            })
            .catch((error) => {
                if (error === 'challenge-closed') { setErrorMessageLogin('Captcha dibutuhkan untuk login') }
                else { setErrorMessageLogin(error?.message ? error.message : 'Terjadi kesalahan saat login') }
            })
            .finally(() => {
                setLoading({ active: false });
                captcha.current.resetCaptcha();
            });
    }

    const handleDaftar = async (e) => {
        e.preventDefault();

        if (
            inputValidator[2].status !== 'success' ||
            inputValidator[3].status !== 'success' ||
            inputValidator[4].status !== 'success' ||
            !inputValidator[5].status.includes('success')
        ) {
            toast.error('Pastikan data terisi dan valid', getToastOptions('daftar'));
            return;
        }

        if (!guestIdCookie || !isUUID(guestIdCookie)) {
            toast.error('Terjadi kesalahan, silahkan coba lagi', getToastOptions('daftar'));
            router.refresh();
            return;
        }

        setLoading({ active: true });
        captcha.current.execute({
            async: true
        })
            .then(async ({ response: token }) => {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            email: email,
                            password: password,
                            fullname: namaLengkap,
                            university_id: universitas,
                            token: token,
                        }
                    ),
                })

                if (!response.ok) {
                    try {
                        /** @type {ApiResponseError} */
                        const { message, error: { code } } = await response.json();
                        if (response.status === 429) {
                            setErrorMessageDaftar(message ?? 'Terlalu banyak request, coba lagi dalam beberapa saat')
                        } else if ((response.status === 503) && (code === 'SRV_03')) {
                            handleErrorModal('Untuk saat ini SIPK tidak menerima pendaftaran akun baru, nantikan informasi selanjutnya');
                            setErrorMessageDaftar(message);
                        } else {
                            handleErrorModal('Sepertinya ada yang salah, silahkan coba lagi');
                            setErrorMessageDaftar('Terjadi kesalahan saat daftar');
                        }
                    } catch (error) {
                        throw new Error('Terjadi kesalahan saat daftar');
                    }
                } else {
                    handleSuksesDaftarModal();
                }
            })
            .catch((error) => {
                if (error === 'challenge-closed') { setErrorMessageDaftar('Captcha dibutuhkan untuk daftar') }
                else { setErrorMessageDaftar(error?.message ? error.message : 'Terjadi kesalahan saat daftar') }
            })
            .finally(() => {
                setLoading({ active: false });
                captcha.current.resetCaptcha();
            });
    }

    const handleEmailLogin = async (e) => {
        e.preventDefault();

        if (inputValidator[0].status !== 'success') {
            toast.error('Pastikan data terisi dan valid', getToastOptions('login'));
            return;
        }

        if (!guestIdCookie || !isUUID(guestIdCookie)) {
            toast.error('Terjadi kesalahan, silahkan coba lagi', getToastOptions('login'));
            router.refresh();
            return;
        }

        setLoading({ active: true });
        captcha.current.execute({
            async: true
        })
            .then(async ({ response: token }) => {
                const response = await fetch('/api/magiclink', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, token: token }),
                })

                if (!response.ok) {
                    try {
                        /** @type {ApiResponseError} */
                        const { message } = await response.json();
                        if (response.status === 429) {
                            handleErrorModal(message ?? 'Terlalu banyak request, coba lagi dalam beberapa saat');
                        } else {
                            handleErrorModal('Sepertinya ada yang salah, silahkan coba lagi dan pastikan emailmu sudah terdaftar dan dikonfirmasi');
                        }
                    } catch {
                        handleErrorModal('Sepertinya ada yang salah, silahkan coba lagi');
                    }
                } else {
                    handleSuksesResetModal();
                }
            })
            .catch((error) => {
                if (error === 'challenge-closed') { setErrorMessageLogin('Captcha dibutuhkan untuk login') }
                else { setErrorMessageLogin(error.message ? error.message : 'Terjadi kesalahan saat login') }
            })
            .finally(() => {
                setLoading({ active: false });
                captcha.current.resetCaptcha();
            });
    }

    const getToastOptions = (form, style, icon) => {
        const duration = 3000;
        if (form === 'login') {
            if (isBigContent) {
                return { duration: duration, position: 'top-right', style: style || '', ...(icon && { icon }) }
            } else {
                return { duration: duration, position: 'bottom-center', style: style || '', ...(icon && { icon }) }
            }
        }
        else {
            if (isBigContent) {
                return { duration: duration, position: 'top-left', style: style || '', ...(icon && { icon }) }
            } else {
                return { duration: duration, position: 'top-center', style: style || '', ...(icon && { icon }) }
            }
        }
    }

    const handleSuksesDaftarModal = () => {
        setData({ image: emailImg, message: 'Periksa emailmu termasuk folder spam, untuk langkah selanjutnya.', isSuccess: true });
        setModal('default');
        setTimeout(() => {
            setActive(true);
        }, 50)
    }

    const handleSuksesResetModal = () => {
        setData({ image: emailImg, message: 'Yuk periksa emailmu termasuk folder spam, untuk langkah selanjutnya.', isSuccess: true });
        setModal('default');
        setTimeout(() => {
            setActive(true);
        }, 50)
    }

    const handleErrorModal = (message, isSuccess = false) => {
        setData({
            message, isSuccess
        })
        setModal('default');
        setTimeout(() => {
            setActive(true);
        }, 50)
    }

    const handleDaftarModal = () => {
        setData(null);
        setModal('panduanDaftar');
        setTimeout(() => {
            setActive(true);
        }, 50)
    }

    const handleShowValidator = (data, form) => {
        const { message, status } = data;
        if (status.includes('error')) {
            toast.error(message, getToastOptions(form))
        } else if (status.includes('success')) {
            if (status.includes('ok')) { toast(message, getToastOptions(form, { color: 'var(--warning-color)' }, <FaCheckCircle size={'17px'} />)) }
            else if (status.includes('weak')) { toast(message, getToastOptions(form, { color: 'var(--danger-color)' }, <FaCheckCircle size={'17px'} />)) }
            else { toast.success(message, getToastOptions(form)) }
        } else if (status.includes('empty')) {
            toast(message, getToastOptions(form, { color: 'var(--primary-color)' }, <FaInfoCircle size={'17px'} />));
        } else {
            toast(message, getToastOptions(form));
        }
    }

    const handleInputFocus = (index) => {
        setErrorMessageLogin('');
        setErrorMessageDaftar('');
        setInputValidator((prevArray) => {
            const newArray = [...prevArray];
            newArray[index] = { state: `${styles.validating}`, message: prevArray[index].message, status: 'validating' };
            return newArray;
        })
    }

    const handleInputBlur = (e, index, type, form) => {
        const
            { value } = e.target,
            { state: prevState, message: prevMessage, status: prevStatus } = inputValidator[index];
        var
            isValidated = 'empty',
            newMessage = prevMessage,
            newState = prevState,
            newStatus = prevStatus;

        // Client Data Validation
        if (isEmpty(value) || value === 0 || value === '0') {
            newMessage = `${listInputs[index]} dibutuhkan untuk ${form}`, newStatus = 'empty';
        } else if (type === 'email' && !isEmpty(value)) {
            isValidated = isLength(value, { min: 6, max: 100 });
            if (!isValidated) { newMessage = 'Email min 6, max 100 karakter', newStatus = 'error' }
            else {
                isValidated = isEmail(value);
                if (!isValidated) { newMessage = 'Format email tidak valid', newStatus = 'error' }
                else { newMessage = 'Email valid', newStatus = 'success'; }
            }
        } else if (type === 'password' && !isEmpty(value)) {
            isValidated = isLength(value, { min: 6, max: 50 });
            if (!isValidated) { newMessage = 'Password min 6, max 50 karakter', newStatus = 'error' }
            else { newMessage = 'Password valid', newStatus = 'success' }
        } else if (type === 'namalengkap' && !isEmpty(value)) {
            isValidated = isLength(value, { min: 6, max: 100 });
            if (!isValidated) { newMessage = 'Nama min 6, max 100 karakter', newStatus = 'error' }
            else {
                isValidated = isAlpha(value.replace(/\s/g, ''));
                if (!isValidated) { newMessage = 'Hanya dapat menggunakan huruf', newStatus = 'error' }
                else {
                    const fullNameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
                    isValidated = fullNameRegex.test(value);
                    if (!isValidated) { newMessage = 'Pastikan 1 spasi setiap kata', newStatus = 'error' }
                    else { newMessage = 'Nama lengkap valid', newStatus = 'success' }
                }

            }
        } else if (type === 'universitas' && value !== 0) {
            isValidated = isInt(value, { min: 1, max: 10 });
            if (!isValidated) { newMessage = 'Universitas tidak valid', newStatus = 'error' }
            else { newMessage = 'Universitas valid', newStatus = 'success' }
        }

        setInputValidator((prevArray) => {
            const newArray = [...prevArray];
            if (type === 'password' && isValidated === true && form === 'daftar') {
                const passwordPoint = isStrongPassword(value, { returnScore: true }); // Using default 'validator' options
                newMessage = passwordPoint >= 45 ? 'Password kuat' : passwordPoint >= 25 ? 'Password kurang kuat' : 'Password lemah';
                newState = passwordPoint >= 45 ? styles.valid : passwordPoint >= 25 ? `${styles.valid} ${styles.ok}` : `${styles.valid} ${styles.weak}`;
                newStatus = passwordPoint >= 45 ? 'success.strong' : passwordPoint >= 25 ? 'success.ok' : 'success.weak';
                newArray[index] = { state: `${newState}`, message: newMessage, status: newStatus }
            }
            else {
                newState = isValidated === true ? styles.valid : isValidated === false ? styles.invalid : styles.info;
                newArray[index] = { state: `${newState}`, message: `${newMessage}`, status: `${newStatus}` }
            }

            return newArray;
        })
    }

    const handleNamaLengkapChange = (e) => { setNamaLengkap(e.target.value); }
    const handleUniversitasChange = (e) => { setUniversitas(parseInt(e.target.value, 10)); }
    const handleEmailChange = (e) => { setEmail(e.target.value) }
    const handlePasswordChange = (e) => { setPassword(e.target.value) }

    const handleTogglePassword = (type) => {
        if (type === 'login') { setHideLoginPassword((current) => (current ? false : true)) }
        else { setHideDaftarPassword((current) => (current ? false : true)) }
    }

    const handleModeDaftar = () => {
        setLoginMode(false);
        router.push('/users?action=daftar', { shallow: true, scroll: false })
        setTimeout(() => { resetFormValue(); }, 1250);
    }

    const handleModeLogin = () => {
        setLoginMode(true);
        router.push('/users?action=login', { shallow: true, scroll: false })
        setTimeout(() => { resetFormValue(); }, 1250);
    }

    const handleChangeTheme = () => {
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark');
        mutate('localUserTheme');
    }

    const resetFormValue = () => {
        setEmailLogin(false);
        setNamaLengkap('');
        setUniversitas(0);
        setEmail('');
        setPassword('');
        setErrorMessageLogin('');
        setErrorMessageDaftar('');
        setInputValidator(initialInputValidator);
        captcha.current.resetCaptcha();
    }

    const getSelectColor = () => { return universitas === 0 ? 'var(--infoDark-color)' : 'var(--dark-color)'; }
    const getSelectFontWeight = () => { return universitas === 0 ? 'var(--font-medium)' : 'var(--font-semi-bold)'; }

    return (
        <>
            {loginMode === null ?
                <>
                </>
                :
                <div>
                    <Ball active={loading.active ?? false} backdrop={loading.backdrop ?? 'default'} hideBall={loading.hideBall ?? false} />
                    <div className={`${styles.container} ${loginMode ? '' : styles.sign_up_mode}`}>
                        <div className={styles.forms_container}>
                            <div className={styles.signin_signup}>
                                <HCaptcha
                                    ref={captcha}
                                    sitekey="c397ab1e-e96e-4b8a-8bb3-f2fb86e62b47"
                                    size='invisible'
                                />

                                <form
                                    onSubmit={emailLogin ? handleEmailLogin : handleLogin}
                                    onSubmitCapture={(e) => {
                                        setErrorMessageLogin('');
                                        const allInput = e.target.querySelectorAll('input');
                                        allInput.forEach(input => {
                                            input.blur();
                                        });
                                    }}
                                    className={styles.sign_in_form}
                                >
                                    <h2 className={styles.title}>{emailLogin ? 'Email Login' : 'Login'}</h2>
                                    <h3 style={{ margin: '.25rem 0', color: 'var(--danger-color)', fontWeight: 'var(--font-medium)' }}>{errorMessageLogin}</h3>
                                    <div className={styles.input_field}>
                                        <i><FaEnvelope /></i>
                                        <input
                                            type="email"
                                            name='email'
                                            placeholder="Email"
                                            autoComplete='email'
                                            value={email}
                                            onChange={handleEmailChange}
                                            onFocus={() => { handleInputFocus(0) }}
                                            onBlur={(e) => { handleInputBlur(e, 0, 'email', 'login') }}
                                            required
                                        />
                                        <i className={`${styles.validator} ${inputValidator[0].state}`}>
                                            <span onClick={() => { handleShowValidator(inputValidator[0], 'login') }}>
                                                {
                                                    inputValidator[0].state.includes(`${styles.validating}`) ? <FaGear /> :
                                                        inputValidator[0].state.includes(`${styles.valid}`) ? <FaCheckCircle /> :
                                                            inputValidator[0].state.includes(`${styles.invalid}`) ? <FaExclamationCircle /> :
                                                                <FaCircleInfo />
                                                }
                                            </span>
                                        </i>
                                    </div>
                                    <div className={`${styles.input_field} ${styles.password} ${emailLogin ? styles.hide : ''}`}>
                                        <i><FaLock /></i>

                                        <input
                                            type={hideLoginPassword ? 'password' : 'text'}
                                            name='password'
                                            placeholder="Password"
                                            autoComplete='current-password'
                                            value={password}
                                            onChange={handlePasswordChange}
                                            onFocus={() => { handleInputFocus(1) }}
                                            onBlur={(e) => { handleInputBlur(e, 1, 'password', 'login') }}
                                            required={emailLogin ? false : true}
                                        />

                                        <i className={styles.eye}>
                                            <span onClick={() => { handleTogglePassword('login') }}>
                                                {hideLoginPassword ? <FaEye /> : <FaEyeSlash />}
                                            </span>
                                        </i>

                                        <i className={`${styles.validator} ${inputValidator[1].state}`}>
                                            <span onClick={() => { handleShowValidator(inputValidator[1], 'login') }}>
                                                {
                                                    inputValidator[1].state.includes(`${styles.validating}`) ? <FaGear /> :
                                                        inputValidator[1].state.includes(`${styles.valid}`) ? <FaCheckCircle /> :
                                                            inputValidator[1].state.includes(`${styles.invalid}`) ? <FaExclamationCircle /> :
                                                                <FaCircleInfo />
                                                }
                                            </span>
                                        </i>
                                    </div>

                                    <button type='submit' className={`${styles.btn}`}>{emailLogin ? 'Submit' : 'Login'}</button>

                                    <p className={styles.social_text}>
                                        <a onClick={() => { setEmailLogin(!emailLogin); setErrorMessageLogin(''); }}>{emailLogin ? 'Klik disini untuk login pakai password.' : 'Lupa password ? Klik disini.'}</a>
                                    </p>
                                </form>
                                <form
                                    onSubmit={handleDaftar}
                                    onSubmitCapture={(e) => {
                                        setErrorMessageDaftar('');
                                        const allInput = e.target.querySelectorAll('input');
                                        allInput.forEach(input => {
                                            input.blur();
                                        });
                                    }}
                                    className={styles.sign_up_form}
                                >
                                    <h2 className={styles.title}>Daftar</h2>
                                    <h3 style={{ margin: '.25rem 0', color: 'var(--danger-color)', fontWeight: 'var(--font-medium)' }}>{errorMessageDaftar}</h3>
                                    <div className={styles.input_field}>
                                        <i><FaUser /></i>
                                        <input
                                            type="text"
                                            name='fullname'
                                            placeholder="Nama Lengkap"
                                            autoComplete='off'
                                            value={namaLengkap}
                                            onChange={handleNamaLengkapChange}
                                            onFocus={() => { handleInputFocus(2) }}
                                            onBlur={(e) => { handleInputBlur(e, 2, 'namalengkap', 'daftar') }}
                                            required
                                        />
                                        <i className={`${styles.validator} ${inputValidator[2].state}`}>
                                            <span onClick={() => { handleShowValidator(inputValidator[2], 'daftar') }}>
                                                {
                                                    inputValidator[2].state.includes(`${styles.validating}`) ? <FaGear /> :
                                                        inputValidator[2].state.includes(`${styles.valid}`) ? <FaCheckCircle /> :
                                                            inputValidator[2].state.includes(`${styles.invalid}`) ? <FaExclamationCircle /> :
                                                                <FaCircleInfo />
                                                }
                                            </span>
                                        </i>
                                    </div>
                                    <div className={styles.input_field}>
                                        <i><FaUniversity /></i>
                                        <select
                                            id='universitas'
                                            style={{
                                                background: 'transparent',
                                                fontWeight: getSelectFontWeight(),
                                                color: getSelectColor(),
                                                cursor: 'pointer',
                                                userSelect: 'none',
                                                textOverflow: 'ellipsis',
                                                outline: 'none',
                                                appearance: 'none',
                                            }}
                                            value={universitas}
                                            onChange={handleUniversitasChange}
                                            onFocus={() => { handleInputFocus(3) }}
                                            onBlur={(e) => { handleInputBlur(e, 3, 'universitas', 'daftar') }}
                                            required
                                        >
                                            <option
                                                style={{ color: 'var(--infoDark-color)' }}
                                                value={0}
                                                disabled={universitasData ? true : false}
                                                hidden={universitasData ? true : false}
                                            >
                                                {universitasError && 'Gagal memuat universitas'}
                                                {universitasData && 'Pilih Universitas'}
                                            </option>
                                            {
                                                universitasData && universitasData.map((item, index) => (
                                                    <option style={{ color: '#000' }} value={item.id} key={crypto.randomUUID()}>{item.nama}</option>
                                                ))
                                            }
                                        </select>
                                        <i className={`${styles.validator} ${inputValidator[3].state}`}>
                                            <span onClick={() => { handleShowValidator(inputValidator[3], 'daftar') }}>
                                                {
                                                    inputValidator[3].state.includes(`${styles.validating}`) ? <FaGear /> :
                                                        inputValidator[3].state.includes(`${styles.valid}`) ? <FaCheckCircle /> :
                                                            inputValidator[3].state.includes(`${styles.invalid}`) ? <FaExclamationCircle /> :
                                                                <FaCircleInfo />
                                                }
                                            </span>
                                        </i>
                                    </div>
                                    <div className={styles.input_field}>
                                        <i><FaEnvelope /></i>
                                        <input
                                            type="email"
                                            name='email'
                                            placeholder="Email"
                                            autoComplete='off'
                                            value={email}
                                            onChange={handleEmailChange}
                                            onFocus={() => { handleInputFocus(4) }}
                                            onBlur={(e) => { handleInputBlur(e, 4, 'email', 'daftar') }}
                                            required
                                        />
                                        <i className={`${styles.validator} ${inputValidator[4].state}`}>
                                            <span onClick={() => { handleShowValidator(inputValidator[4], 'daftar') }}>
                                                {
                                                    inputValidator[4].state.includes(`${styles.validating}`) ? <FaGear /> :
                                                        inputValidator[4].state.includes(`${styles.valid}`) ? <FaCheckCircle /> :
                                                            inputValidator[4].state.includes(`${styles.invalid}`) ? <FaExclamationCircle /> :
                                                                <FaCircleInfo />
                                                }
                                            </span>
                                        </i>
                                    </div>
                                    <div className={`${styles.input_field} ${styles.password}`}>
                                        <i><FaLock /></i>
                                        <input
                                            type={hideDaftarPassword ? 'password' : 'text'}
                                            name='password'
                                            placeholder="Password"
                                            autoComplete='off'
                                            value={password}
                                            onChange={handlePasswordChange}
                                            onFocus={() => { handleInputFocus(5) }}
                                            onBlur={(e) => { handleInputBlur(e, 5, 'password', 'daftar') }}
                                            required
                                        />

                                        <i className={styles.eye}>
                                            <span onClick={() => { handleTogglePassword('daftar') }}>
                                                {hideDaftarPassword ? <FaEye /> : <FaEyeSlash />}
                                            </span>
                                        </i>

                                        <i className={`${styles.validator} ${inputValidator[5].state}`}>
                                            <span onClick={() => { handleShowValidator(inputValidator[5], 'daftar') }}>
                                                {
                                                    inputValidator[5].state.includes(`${styles.validating}`) ? <FaGear /> :
                                                        inputValidator[5].state.includes(`${styles.valid}`) ? <FaCheckCircle /> :
                                                            inputValidator[5].state.includes(`${styles.invalid}`) ? <FaExclamationCircle /> :
                                                                <FaCircleInfo />
                                                }
                                            </span>
                                        </i>
                                    </div>

                                    <input type="submit" value={'daftar'} className={`${styles.btn}`} />

                                    <p className={styles.social_text}>
                                        <a onClick={() => { handleDaftarModal() }}>Butuh bantuan ? Klik disini.</a>
                                    </p>
                                </form>
                            </div>
                        </div>
                        <div className={styles.panels_container}>
                            <div className={`${styles.panel} ${styles.left_panel}`}>
                                <div className={styles.content}>
                                    <h3>Belum daftar?</h3>
                                    <p>Yuk daftar dan nikmati fitur yang ditawarkan SIPK secara gratis.</p>
                                    <button className={`${styles.btn} ${styles.transparent}`} onClick={handleModeDaftar}>Daftar</button>
                                </div>
                                <Image
                                    src="/daftar.svg"
                                    width={500}
                                    height={500}
                                    alt="Register"
                                    className={styles.image}
                                    priority
                                />
                            </div>
                            <div className={`${styles.panel} ${styles.right_panel}`}>
                                <div className={styles.content}>
                                    <h3>Sudah punya akun?</h3>
                                    <p>Silahkan klik tombol dibawah untuk login.</p>
                                    <button className={`${styles.btn} ${styles.transparent}`} onClick={handleModeLogin}>Login</button>
                                </div>
                                <Image
                                    src="/login.svg"
                                    width={500}
                                    height={500}
                                    alt="Login"
                                    className={styles.image}
                                    priority
                                />
                            </div>
                        </div>
                        <div className={styles.theme_toggle} onClick={handleChangeTheme}>
                            <i>
                                {theme === 'dark' ?
                                    <FiSun />
                                    :
                                    <BiMoon />
                                }
                            </i>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}