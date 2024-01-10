'use client'

// ========== NEXT DEPEDENCY ========== //
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

// ========== REACT DEPEDENCY ========== //
import { useState, useContext, useRef, useEffect } from 'react';

// ========== CAPTCHA DEPEDENCY ========== //
import HCaptcha from '@hcaptcha/react-hcaptcha';

// ========== VALIDATOR/SANITIZER DEPEDENCY ========== //
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import isStrongPassword from 'validator/lib/isStrongPassword';
import isAlpha from 'validator/lib/isAlpha';
import isInt from 'validator/lib/isInt';
import isUUID from 'validator/lib/isUUID';

// ========== COMPONENTS DEPEDENCY ========== //
import { mutate } from 'swr';
import { useCookies } from 'next-client-cookies';
import { SHA256, HmacSHA512 } from 'crypto-js';
import Hex from 'crypto-js/enc-hex';
import toast from 'react-hot-toast';
import { UsersContext } from './provider/Users';
import { ModalContext } from "./provider/Modal";
import { Ball } from '@/component/loader/Loading';

// ========== DATA DEPEDENCY ========== //
import { useLocalTheme } from '@/data/core';

// ========== STYLE DEPEDENCY ========== //
import styles from './style/form.module.css'

// ========== ICONS DEPEDENCY ========== //
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
import { useUniversitas } from '@/data/core';

/*
============================== CODE START HERE ==============================
*/
export function UsersForm() {
    /*
    ========== Next Hooks ==========
    */
    const captcha = useRef();
    const router = useRouter();
    const searchParams = useSearchParams();

    /*
    ========== Context ==========
    */
    const {
        loginMode, setLoginMode,
        isBigContent,
    } = useContext(UsersContext);
    const {
        setModal,
        setActive,
        setData
    } = useContext(ModalContext);

    /*
    ========== Cookies ==========
    */
    const guestIdCookie = useCookies().get('s_guest_id');

    /*
    ========== States ==========
    */
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
    const [namaLengkap, setNamaLengkap] = useState('');
    const [universitas, setUniversitas] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Utils
    const [loading, setLoading] = useState(false);
    const [errorMessageLogin, setErrorMessageLogin] = useState('');
    const [errorMessageDaftar, setErrorMessageDaftar] = useState('');
    const [hideLoginPassword, setHideLoginPassword] = useState(true);
    const [hideDaftarPassword, setHideDaftarPassword] = useState(true);
    const [inputValidator, setInputValidator] = useState(initialInputValidator);

    /*
    ========== Data ==========
    */
    const { data: universitasData, error: universitasError, isLoading: universitasLoading, isValidating: universitasValidating } = useUniversitas(null, 'public', 'all');
    const { data: theme } = useLocalTheme();

    /*
    ========== Images ==========
    */
    const emailImg = theme === 'dark' ?
        <Image src="https://storage.googleapis.com/sipk_assets/check_email_dark.svg" width={100} height={100} alt="Check Email" />
        : <Image src="https://storage.googleapis.com/sipk_assets/check_email.svg" width={100} height={100} alt="Check Email" />

    /*
========== useEffect ==========
*/
    useEffect(() => {
        // Login Mode or Daftar Mode ?
        const mode = searchParams.get('action');
        if (mode === 'daftar') { setLoginMode(false) }
        else { setLoginMode(true) }

        // Something Error ? 
        const error = searchParams.get('error');
        if (error && mode === 'login') {
            const errorList = {
                "isession": "Sesi invalid, silahkan login kembali",
                "esession": "Silahkan login terlebih dahulu"
            }
            router.refresh();
            setErrorMessageLogin(errorList[error] || 'Terjadi error, silahkan login kembali');
        }

        // From Logout ? 
        const logout = searchParams.get('logout');
        if (logout) { router.refresh(); }

    }, [searchParams])

    /*
    ========== Methods, Functions, Helpers ==========
    */
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

        setLoading(true);
        captcha.current.execute({
            async: true
        })
            .then(async ({ response: token }) => {
                const unixStamp = Math.round(Date.now() / 1000).toString();
                const result = Array.from(unixStamp)
                    .map(Number)
                    .filter(digit => digit !== 0)
                    .reduce((acc, digit) => acc * digit, 1);

                const nonce = result.toString();
                const nonceReverse = nonce.split('').reverse().join('');
                const hashDigest = SHA256(nonce + guestIdCookie + nonceReverse);
                const hmacDigest = HmacSHA512(hashDigest, unixStamp);
                const identifier = Hex.stringify(hmacDigest);
                const response = await fetch(`/api/login?stamp=${unixStamp}&identifier=${identifier}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, password: password, token: token }),
                })

                if (!response.ok) {
                    if (response.status === 429) {
                        setErrorMessageLogin(`Terlalu banyak request, coba lagi dalam 1 menit`);
                    } else if (response.status === 401) {
                        setErrorMessageLogin(`Terjadi kesalahan, silahkan coba lagi`);
                        router.refresh();
                    } else if (response.status === 403) {
                        setErrorMessageLogin(`Email atau password salah`);
                    } else {
                        try {
                            const { message } = await response.json();
                            if (message) { setErrorMessageLogin(message); }
                        } catch {
                            throw new Error(`Terjadi kesalahan saat login`);
                        }
                    }
                } else {
                    router.replace('/dashboard', {
                        scroll: false
                    });
                }
            })
            .catch((error) => {
                if (error === 'challenge-closed') { setErrorMessageLogin('Captcha dibutuhkan untuk login') }
                else { setErrorMessageLogin(error.message ? error.message : 'Terjadi kesalahan saat login') }
            })
            .finally(() => {
                setLoading(false);
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

        setLoading(true);
        captcha.current.execute({
            async: true
        })
            .then(async ({ response: token }) => {
                const unixStamp = Math.round(Date.now() / 1000).toString();
                const result = Array.from(unixStamp)
                    .map(Number)
                    .filter(digit => digit !== 0)
                    .reduce((acc, digit) => acc * digit, 1);

                const nonce = result.toString();
                const nonceReverse = nonce.split('').reverse().join('');
                const hashDigest = SHA256(nonce + guestIdCookie + nonceReverse);
                const hmacDigest = HmacSHA512(hashDigest, unixStamp);
                const identifier = Hex.stringify(hmacDigest);
                const response = await fetch(`/api/register?stamp=${unixStamp}&identifier=${identifier}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            email: email,
                            password: password,
                            fullname: namaLengkap,
                            university: universitasData[universitas - 1].nama,
                            university_id: universitas,
                            token: token,
                        }
                    ),
                })

                if (!response.ok) {
                    if (response.status === 429) {
                        setErrorMessageDaftar(`Terlalu banyak request, coba lagi dalam 15 menit`);
                    } else if (response.status === 401) {
                        setErrorMessageDaftar(`Terjadi kesalahan, silahkan coba lagi`);
                        router.refresh();
                    } else {
                        try {
                            const { message } = await response.json();
                            if (message) { setErrorMessageDaftar(message); }
                        } catch {
                            throw new Error(`Terjadi kesalahan saat daftar`);
                        }
                    }
                } else {
                    handleSuksesDaftarModal();
                }
            })
            .catch((error) => {
                if (error === 'challenge-closed') { setErrorMessageDaftar('Captcha dibutuhkan untuk daftar') }
                else { setErrorMessageDaftar(error.message ? error.message : 'Terjadi kesalahan saat daftar') }
            })
            .finally(() => {
                setLoading(false);
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
            if (!isValidated) { newMessage = 'Password min 6, max 100 karakter', newStatus = 'error' }
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
        router.push('/users?action=daftar', undefined, { shallow: true })
        setTimeout(() => { resetFormValue(); }, 1250);
    }
    const handleModeLogin = () => {
        setLoginMode(true);
        router.push('/users?action=login', undefined, { shallow: true })
        setTimeout(() => { resetFormValue(); }, 1250);
    }

    const handleChangeTheme = () => {
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark');
        mutate('localUserTheme');
    }

    const resetFormValue = () => {
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
                    <Ball active={loading} backdrop={true} />
                    <div className={`${styles.container} ${loginMode ? '' : styles.sign_up_mode}`}>
                        <div className={styles.forms_container}>
                            <div className={styles.signin_signup}>
                                <HCaptcha
                                    ref={captcha}
                                    sitekey="c397ab1e-e96e-4b8a-8bb3-f2fb86e62b47"
                                    size='invisible'
                                />

                                <form
                                    onSubmit={handleLogin}
                                    onSubmitCapture={(e) => {
                                        setErrorMessageLogin('');
                                        const allInput = e.target.querySelectorAll('input');
                                        allInput.forEach(input => {
                                            input.blur();
                                        });
                                    }}
                                    className={styles.sign_in_form}
                                >
                                    <h2 className={styles.title}>Login</h2>
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
                                    <div className={`${styles.input_field} ${styles.password}`}>
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
                                            required
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

                                    <button type='submit' className={`${styles.btn}`}>Login</button>

                                    <p className={styles.social_text}>
                                        <a>Lupa password ? Klik disini.</a>
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
                                            <option style={{ color: 'var(--infoDark-color)' }} value={0}>
                                                {universitasLoading && 'Loading...'}
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
                                    src="https://storage.googleapis.com/sipk_assets/daftar.svg"
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
                                    src="https://storage.googleapis.com/sipk_assets/login.svg"
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

/*
============================== CODE END HERE ==============================
*/