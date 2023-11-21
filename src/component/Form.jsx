'use client'

// ========== NEXT DEPEDENCY ========== //
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { redirect, useRouter } from 'next/navigation';

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

// ========== COMPONENTS DEPEDENCY ========== //
import toast from 'react-hot-toast';
import { ContentContext } from '@/component/provider/Content'
import { Accordion } from '@/component/Accordion'
import { Ball } from '@/component/loader/Loading';
import Modal from './Modal';

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
    FaTimes
} from "react-icons/fa";
import { FaCircleInfo, FaGear, FaPlus } from "react-icons/fa6";
import { FiSun } from 'react-icons/fi';
import { BiMoon } from 'react-icons/bi';


/*
============================== CODE START HERE ==============================
*/
export function UsersForm() {
    /*
    ========== Next Hooks ==========
    */
    const captcha = useRef();
    const router = useRouter();

    /*
    ========== Context ==========
    */
    const { theme, setTheme } = useContext(ContentContext);

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

    // Mode
    const [loginMode, setLoginMode] = useState(true);

    // Forms Inputs
    const [namaLengkap, setNamaLengkap] = useState('');
    const [universitas, setUniversitas] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Utils
    const [isBigContent, setBigContent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [allowDaftarSubmit, setAllowDaftarSubmit] = useState(false);
    const [hideLoginPassword, setHideLoginPassword] = useState(true);
    const [hideDaftarPassword, setHideDaftarPassword] = useState(true);
    const [modalDaftar, setModalDaftar] = useState(false);
    const [daftarAccordion, setDaftarAccordion] = useState(Array(5).fill(false));
    const [captchaToken, setCaptchaToken] = useState('');
    const [inputValidator, setInputValidator] = useState(initialInputValidator);

    /*
    ========== Use Effect Hook ==========
    */
    useEffect(() => {
        // Content Init
        const bigMediaQuery = window.matchMedia('(min-width: 870px)');

        const handleBigMediaQueryChange = (e) => {
            setBigContent(e.matches);
        }

        handleBigMediaQueryChange(bigMediaQuery);

        bigMediaQuery.addEventListener('change', handleBigMediaQueryChange);

        return () => {
            bigMediaQuery.removeEventListener('change', handleBigMediaQueryChange);
        }

    }, []);

    /*
    ========== Required Data ==========
    */
    const listUniversitas = [
        { id: 1, nama: 'Universitas Brawijaya' },
        { id: 2, nama: 'Universitas Diponegoro' },
        { id: 3, nama: 'Universitas Indonesia' },
        { id: 4, nama: 'Institut Teknologi Bandung' },
        { id: 5, nama: 'Universitas Airlangga' },
        { id: 6, nama: 'Institut Pertanian Bogor' },
        { id: 7, nama: 'Institut Teknologi Sepuluh November' },
        { id: 8, nama: 'Telkom University' },
        { id: 9, nama: 'Universitas Padjajaran' },
        { id: 10, nama: 'Universitas Jendral Soedirman' },
    ]

    const daftarAccordionList = [
        {
            title: 'Kriteria Nama Lengkap',
            description: (
                <ul>
                    <li>Gunakan hanya huruf, tanpa simbol atau angka</li>
                    <li>Panjang minimal 6 karakter, maksimal 100</li>
                    <li>Gunakan hanya satu spasi di antara setiap kata</li>
                </ul>
            ),
            icon: <FaPlus />
        },
        {
            title: 'Kriteria Universitas',
            description: (
                <ul>
                    <li>Pilih universitas yang sesuai dan tersedia</li>
                    <li>Universitas yang berbeda dapat mempengaruhi penilaian, pastikan kamu memilih yang sesuai</li>
                    <li>Jika universitasmu belum tersedia, kamu dapat daftar <span style={{ color: 'green' }}>disini</span></li>
                </ul>
            ),
            icon: <FaPlus />
        },
        {
            title: 'Kriteria Email',
            description: (
                <ul>
                    <li>Gunakan email valid yang dapat dihubungi</li>
                    <li>Konfirmasi pendaftaran dengan mengklik link yang dikirimkan SIPK</li>
                </ul>

            ),
            icon: <FaPlus />
        }
        ,
        {
            title: 'Kriteria Password',
            description: (
                <ul>
                    <li>Gunakan password minimal 6 karakter, maksimal 50</li>
                    <li>Disarankan kombinasi huruf kecil, huruf besar, angka dan simbol</li>
                    <li>Password lemah atau kurang kuat dapat digunakan, walaupun tidak disarankan</li>
                </ul>
            ),
            icon: <FaPlus />
        }
        ,
        {
            title: 'Keterangan Icon',
            description: (
                <div className={styles.keterangan_icon}>
                    <span><FaCircleInfo color='var(--primary-color)' />  Data dibutuhkan</span>
                    <span><FaGear color='var(--logo-second-color)' />  Data sedang divalidasi</span>
                    <span><FaCheckCircle color='var(--success-color)' />  Data Valid</span>
                    <span><FaCheckCircle color='var(--warning-color)' />  Password kurang kuat</span>
                    <span><FaCheckCircle color='var(--danger-color)' />  Password lemah</span>
                    <span><FaExclamationCircle color='crimson' />  Data Invalid</span>
                </div>
            ),
            icon: <FaPlus />
        }
    ]

    /*
    ========== Methods, Functions, Helpers ==========
    */
    const handleLogin = async (e) => {
        e.preventDefault();

        if (inputValidator[0].status !== 'success' || inputValidator[1].status !== 'success') {
            toast.error('Pastikan data terisi dan valid', getToastOptions('login'))
            return;
        }

        setLoading(true);
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
                    if (response.status === 429) {
                        setErrorMessage(`Terlalu banyak request, coba lagi dalam 1 menit`)
                    } else {
                        try {
                            const { message } = await response.json();
                            if (message) { setErrorMessage(message) }
                        } catch {
                            throw new Error(`Terjadi kesalahan saat login`);
                        }
                    }
                } else {
                    const { data } = await response.json();
                    // Do something with data. (set cookies, etc)
                    router.push('/dashboard');
                }
            })
            .catch((error) => {
                if (error === 'challenge-closed') { setErrorMessage('Captcha dibutuhkan untuk login') }
                else { setErrorMessage(error.message ? error.message : 'Terjadi kesalahan saat login') }
            })
            .finally(() => {
                setLoading(false);
                captcha.current.resetCaptcha();
            });
    }

    const handleDaftarAccordion = (index) => {
        setDaftarAccordion((prevArray) => {
            const currentVal = prevArray[index];
            const newArray = Array(prevArray.length).fill(false);
            newArray[index] = currentVal ? false : true;
            return newArray;
        })
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
        setErrorMessage('');
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

        // Allow Daftar Forms Submit
        if (
            inputValidator[2].status === 'success' &&
            inputValidator[3].status === 'success' &&
            inputValidator[4].status === 'success' &&
            inputValidator[5].status === 'success'
        ) { setAllowDaftarSubmit(true) }
        else { setAllowDaftarSubmit(false) }
    }

    const handleNamaLengkapChange = (e) => { setNamaLengkap(e.target.value); }
    const handleUniversitasChange = (e) => { setUniversitas(parseInt(e.target.value, 10)); }
    const handleEmailChange = (e) => { setEmail(e.target.value) }
    const handlePasswordChange = (e) => { setPassword(e.target.value) }

    const handleTogglePassword = (type) => {
        if (type === 'login') { setHideLoginPassword((current) => (current ? false : true)) }
        else { setHideDaftarPassword((current) => (current ? false : true)) }
    }

    const handleModeDaftar = () => { setLoginMode(false); setTimeout(() => { resetFormValue(); }, 1250); }
    const handleModeLogin = () => { setLoginMode(true); setTimeout(() => { resetFormValue(); }, 1250); }

    const handleChangeTheme = () => {
        setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
        document.body.classList.toggle('dark-theme', theme !== 'dark');
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark')
    }

    const resetFormValue = () => {
        setNamaLengkap('');
        setUniversitas(0);
        setEmail('');
        setPassword('');
        setErrorMessage('');
        setInputValidator(initialInputValidator);
        // captcha.current.resetCaptcha();
    }

    const getSelectColor = () => { return universitas === 0 ? 'var(--infoDark-color)' : 'var(--dark-color)'; }
    const getSelectFontWeight = () => { return universitas === 0 ? 'var(--font-medium)' : 'var(--font-semi-bold)'; }

    return (
        <>
            <Ball active={loading} backdrop={true} />
            <Modal active={modalDaftar} setActive={setModalDaftar}>
                <h2 style={{ textAlign: 'center' }}>Panduan Daftar</h2>
                <p style={{ textAlign: 'justify', margin: '1.25rem 0 1rem 0' }}>
                    Pastikan data yang kamu masukkan memenuhi kriteria sebagai berikut :
                </p>

                <Accordion item={daftarAccordionList} />

                <p style={{ textAlign: 'justify', margin: '1.25rem 0 .5rem 0' }}>
                    Jika kamu masih binggung, kamu dapat membaca panduan lengkap <span style={{ color: 'green' }}>disini </span>
                    atau kamu dapat menghubungi admin <span style={{ color: 'green' }}>disini</span>
                </p>

            </Modal>
            <div className={`${styles.container} ${loginMode ? '' : styles.sign_up_mode}`}>
                <div className={styles.forms_container}>
                    <div className={styles.signin_signup}>
                        <HCaptcha
                            ref={captcha}
                            sitekey="c397ab1e-e96e-4b8a-8bb3-f2fb86e62b47"
                            onVerify={setCaptchaToken}
                            onClose={() => { setErrorMessage('Captcha diperlukan untuk login') }}
                            size='invisible'
                        />

                        <form onSubmit={handleLogin} className={styles.sign_in_form}>
                            <h2 className={styles.title}>Login</h2>
                            <h3 style={{ margin: '.25rem 0', color: 'var(--danger-color)', fontWeight: 'var(--font-medium)' }}>{errorMessage}</h3>
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

                            {/* <input type="submit" value={'login'} className={`${styles.btn} ${styles.solid}`} /> */}
                            <button type='submit' className={`${styles.btn} ${styles.solid}`}>Login</button>

                            <p className={styles.social_text}>
                                <a>Lupa password ? Klik disini.</a>
                            </p>
                        </form>
                        <form className={styles.sign_up_form}>
                            <h2 className={styles.title}>Daftar</h2>
                            <h3 style={{ margin: '.25rem 0', color: 'var(--danger-color)', fontWeight: 'var(--font-medium)' }}>{errorMessage}</h3>
                            <div className={styles.input_field}>
                                <i><FaUser /></i>
                                <input
                                    type="text"
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
                                    <option style={{ color: 'var(--infoDark-color)' }} value={0}>Pilih Universitas</option>
                                    {
                                        listUniversitas.map((item, index) => (
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

                            <input type="submit" value={'daftar'} className={`${styles.btn} ${styles.solid}`} />

                            <p className={styles.social_text}>
                                <a onClick={() => { setModalDaftar(true) }}>Butuh bantuan ? Klik disini.</a>
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
                            alt="Register"
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
        </>
    )
}



/*
============================== CODE END HERE ==============================
*/