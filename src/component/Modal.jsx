// ========== NEXT DEPEDENCY ========== //
import Link from "next/link";
import { useRouter } from 'next/navigation';

// ========== REACT DEPEDENCY ========== //
import { useState, useContext } from "react";

// ========== VALIDATOR/SANITIZER DEPEDENCY ========== //
import isLength from 'validator/lib/isLength';
import isInt from 'validator/lib/isInt';
import isEmpty from "validator/lib/isEmpty";

// ========== COMPONENTS DEPEDENCY ========== //
import { mutate } from 'swr';
import { useCookies } from 'next-client-cookies';
import toast from 'react-hot-toast';
import { ModalContext } from "./provider/Modal";
import { UsersContext } from './provider/Users';
import { Accordion } from '@/component/Accordion'

// ========== DATA DEPEDENCY ========== //
import { useUser } from "@/data/core";
import { getPenilaianUniversitas } from "@/data/universitas";

// ========== ICONS DEPEDENCY ========== //
import { FaTimes } from 'react-icons/fa'

// ========== STYLE DEPEDENCY ========== //
import styles from './style/modal.module.css'


export const PanduanDaftar = () => {
    const {
        daftarAccordionList
    } = useContext(UsersContext);
    return (
        <ModalContext.Consumer>
            {context => {
                return (
                    <div className={`${styles.backdrop} ${context.active ? styles.active : ''}`}>
                        <div className={styles.panduan__daftar} id='modal'>
                            <div className={styles.top}>
                                <div className={styles.title}>
                                    <h2>Panduan Daftar</h2>
                                </div>
                                <div className={styles.close} onClick={() => { context.handleModalClose() }}>
                                    <FaTimes />
                                </div>
                            </div>

                            <div className={styles.inner}>
                                <p style={{ textAlign: 'justify', marginBottom: '.75rem' }}>
                                    Pastikan data yang kamu masukkan memenuhi kriteria sebagai berikut :
                                </p>
                                <Accordion item={daftarAccordionList} />
                            </div>

                            <div className={styles.form__action}>
                                <Link
                                    prefetch={false}
                                    className={styles.btn}
                                    href='/docs'
                                    target={'_blank'}
                                >
                                    <h3>Panduan Lengkap</h3>
                                </Link>
                            </div>
                        </div>

                    </div>
                )
            }}
        </ModalContext.Consumer>
    )
}

export const Logout = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            if (!response.ok) {
                if (response.status === 429) {
                    toast.error('Terlalu banyak request', { duration: 4000, position: 'top-left' })
                } else {
                    try {
                        const { message } = await response.json();
                        if (message) { toast.error(message, { duration: 4000, position: 'top-left' }) }
                        else { throw new Error(`Terjadi kesalahan`); }
                    } catch (error) {
                        console.error(error);
                        throw new Error(`Terjadi kesalahan`);
                    }
                }
            } else {
                router.replace('/users?action=login', {
                    scroll: false,
                });
            }
        } catch (error) {
            toast.error(error.message ? error.message : 'Terjadi kesalahan', { duration: 4000, position: 'top-left' })
        }
    }
    return (
        <ModalContext.Consumer>
            {context => {
                return (
                    <div className={`${styles.backdrop} ${context.active ? styles.active : ''}`}>
                        <div className={`${styles.logout} ${styles.confirm}`} id='modal'>
                            <div className={styles.top}>
                                <div className={styles.title}>
                                    <h2>Logout</h2>
                                </div>
                                <div className={styles.close} onClick={() => { context.handleModalClose() }}>
                                    <FaTimes />
                                </div>
                            </div>

                            <div style={{ color: 'var(--infoDark-color)' }}>
                                Apakah kamu ingin logout dari SIPK?
                            </div>

                            <div className={styles.form__action}>
                                <div className={`${styles.btn} ${styles.confirm}`} onClick={() => { context.handleModalClose(); handleLogout(); }}>
                                    <h3>Logout</h3>
                                </div>
                                <div className={`${styles.btn} ${styles.cancel}`} onClick={() => { context.handleModalClose(); }}>
                                    <h3>Cancel</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }}
        </ModalContext.Consumer>
    )
}

export const PerubahanTerakhirDetail = () => {
    const [isSebelumForm, setIsSebelumForm] = useState(true);
    return (
        <ModalContext.Consumer>
            {context => {
                return (
                    <div className={`${styles.backdrop} ${context.active ? styles.active : ''}`}>
                        {
                            context?.data?.current?.type === 'ubah' ? <div className={`${styles.perubahan__terakhir} ${styles.ubah}`} id='modal'>
                                <div className={styles.top}>
                                    <div className={styles.title}>
                                        <h2>Detail Matakuliah</h2>
                                    </div>
                                    <div className={styles.close} onClick={() => { context.handleModalClose() }}>
                                        <FaTimes />
                                    </div>
                                </div>
                                <div className={styles.form__type}>
                                    <span className={isSebelumForm ? styles.active : ''} onClick={() => { setIsSebelumForm(true) }}>
                                        <h3>Sebelum</h3>
                                    </span>
                                    <span className={!isSebelumForm ? styles.active : ''} onClick={() => { setIsSebelumForm(false) }}>
                                        <h3>Setelah</h3>
                                    </span>
                                </div>
                                <div className={styles.inner}>
                                    <form>
                                        <div className={styles.form__input_field}>
                                            <input
                                                type="text"
                                                id="nama"
                                                placeholder=" "
                                                className={styles.form__input}
                                                value={isSebelumForm ? context?.data?.prev?.nama : context?.data?.current?.nama}
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
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3,1fr)',
                                            gap: '1rem'
                                        }}>
                                            <div className={styles.form__input_field}>
                                                <input
                                                    type="number"
                                                    id="sks"
                                                    placeholder=" "
                                                    className={styles.form__input}
                                                    value={isSebelumForm ? context?.data?.prev?.sks : context?.data?.current?.sks}
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
                                                    value={isSebelumForm ? context?.data?.prev?.nilai : context?.data?.current?.nilai}
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
                                                    value={isSebelumForm ? context?.data?.prev?.semester : context?.data?.current?.semester}
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
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2,1fr)',
                                            gap: '1rem'
                                        }}>
                                            <div className={styles.form__input_field}>
                                                <input
                                                    type="text"
                                                    id="dapatDiulang"
                                                    placeholder=" "
                                                    className={styles.form__input}
                                                    value={isSebelumForm ? 'Ya' : 'Tidak'}
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
                                                    value={isSebelumForm ? 'A' : 'B'}
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
                                                value={isSebelumForm ? '22 November 2023, 10:52' : '24 November 2023, 21:55'}
                                                autoComplete='off'
                                                disabled
                                            />
                                            <label
                                                htmlFor="date"
                                                className={styles.form__label}
                                            >
                                                {isSebelumForm ? 'Dibuat' : 'Diedit'}
                                            </label>
                                        </div>
                                    </form>
                                </div>
                                <div className={styles.form__action}>
                                    <div className={styles.btn} onClick={() => { context.setModal('perubahanTerakhirConfirm'); }}>
                                        <h3>Batalkan</h3>
                                    </div>
                                </div>
                            </div>
                                : <div className={styles.perubahan__terakhir} id='modal'>
                                    <div className={styles.top}>
                                        <div className={styles.title}>
                                            <h2>Detail Matakuliah</h2>
                                        </div>
                                        <div className={styles.close} onClick={() => { context.handleModalClose() }}>
                                            <FaTimes />
                                        </div>
                                    </div>
                                    <div className={styles.inner}>
                                        <form>
                                            <div className={styles.form__input_field}>
                                                <input
                                                    type="text"
                                                    id="nama"
                                                    placeholder=" "
                                                    className={styles.form__input}
                                                    value={context?.data?.current?.nama ? context?.data?.current?.nama : context?.data?.prev?.nama}
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
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3,1fr)',
                                                gap: '1rem'
                                            }}>
                                                <div className={styles.form__input_field}>
                                                    <input
                                                        type="number"
                                                        id="sks"
                                                        placeholder=" "
                                                        className={styles.form__input}
                                                        value={context?.data?.current?.sks ? context?.data?.current?.sks : context?.data?.prev?.sks}
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
                                                        value={context?.data?.current?.nilai ? context?.data?.current?.nilai : context?.data?.prev?.nilai}
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
                                                        value={context?.data?.current?.semester ? context?.data?.current?.semester : context?.data?.prev?.semester}
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
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2,1fr)',
                                                gap: '1rem'
                                            }}>
                                                <div className={styles.form__input_field}>
                                                    <input
                                                        type="text"
                                                        id="dapatDiulang"
                                                        placeholder=" "
                                                        className={styles.form__input}
                                                        value={isSebelumForm ? 'Ya' : 'Tidak'}
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
                                                        value={isSebelumForm ? 'A' : 'B'}
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
                                                    value={isSebelumForm ? '22 November 2023, 10:52' : '24 November 2023, 21:55'}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                                <label
                                                    htmlFor="date"
                                                    className={styles.form__label}
                                                >
                                                    {isSebelumForm ? 'Dibuat' : 'Diedit'}
                                                </label>
                                            </div>
                                        </form>
                                    </div>
                                    <div className={styles.form__action}>
                                        <div className={styles.btn} onClick={() => { context.setModal('perubahanTerakhirConfirm'); }}>
                                            <h3>Batalkan</h3>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                )
            }}
        </ModalContext.Consumer>
    )
}

export const PerubahanTerakhirConfirm = () => {
    return (
        <ModalContext.Consumer>
            {context => {
                const getConfirmMessage = () => {
                    const type = context?.data?.current?.type ? context?.data?.current?.type : context?.data?.prev?.type;
                    const nama = context?.data?.current?.nama ? context?.data?.current?.nama : context?.data?.prev?.nama
                    if (type === 'tambah') { return (<p>Kamu ingin menghapus <b style={{ fontWeight: '600' }}>{nama}</b> yang sudah ditambah?</p>) }
                    else if (type === 'hapus') { return (<p>Kamu ingin menambah kembali <b style={{ fontWeight: '600' }}>{nama}</b> yang sudah dihapus?</p>) }
                    else if (type === 'ubah') { return (<p>Kamu ingin mengubah <b style={{ fontWeight: '600' }}>{nama}</b> ke data sebelumnya?</p>) }
                    else { return 0; }
                }

                const getConfirmTitle = () => {
                    const type = context?.data?.current?.type ? context?.data?.current?.type : context?.data?.prev?.type
                    if (type === 'tambah') { return `Hapus Matakuliah` }
                    else if (type === 'hapus') { return `Tambah Matakuliah` }
                    else if (type === 'ubah') { return `Ubah Matakuliah` }
                    else { return 0; }
                }
                return (
                    <div className={`${styles.backdrop} ${context.active ? styles.active : ''}`}>
                        <div className={`${styles.perubahan__terakhir} ${styles.confirm}`} id='modal'>
                            <div className={styles.top}>
                                <div className={styles.title}>
                                    <h2>{getConfirmTitle() ? getConfirmTitle() : 'Terjadi kesalahan'}</h2>
                                </div>
                                <div className={styles.close} onClick={() => { context.handleModalClose() }}>
                                    <FaTimes />
                                </div>
                            </div>

                            <div style={{ color: 'var(--infoDark-color)' }}>
                                {getConfirmMessage() ? getConfirmMessage() : 'Sepertinya terjadi kesalahan'}
                            </div>

                            <div className={styles.form__action}>
                                <div className={`${styles.btn} ${styles.confirm} ${context?.data?.current?.type ? styles[context?.data?.current?.type] : styles[context?.data?.prev?.type]}`}>
                                    <h3>Ya</h3>
                                </div>
                                <div className={`${styles.btn} ${styles.cancel}`} onClick={() => { context.handleModalClose(); }}>
                                    <h3>Jangan</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }}
        </ModalContext.Consumer>
    )
}

export const TambahMatkul = () => {
    const { data: user } = useUser();
    const penilaian = getPenilaianUniversitas(user[0]?.university_id);
    const penilaianKey = Object.keys(penilaian);
    const [nama, setNama] = useState('');
    const [sks, setSks] = useState('');
    const [nilai, setNilai] = useState(-1);
    const [semester, setSemester] = useState('');
    const [dapatDiulang, setDapatDiulang] = useState(true);
    const [targetNilai, setTargetNilai] = useState(4);
    const [errorMessage, setErrorMessage] = useState('');

    const userIdCookie = useCookies().get('s_user_id');

    const handleNamaChange = (e) => {
        const newNama = e.target.value;
        if (newNama.length <= 50) {
            setNama(newNama);
        }
    }

    const handleNilaiChange = (e) => {
        setNilai(e.target.value);
    }

    return (
        <ModalContext.Consumer>
            {context => {
                const validateForm = () => {
                    // Validating 'Nama'
                    if (isEmpty(nama)) { setErrorMessage('Nama matakuliah dibutuhkan'); return false; }
                    else {
                        if (!isLength(nama, { min: 3, max: 50 })) { setErrorMessage('Nama matakuliah minimal 3 karakter maksimal 50 karakter'); return false; }
                    }

                    // Validating 'Sks'
                    if (isEmpty(sks)) { setErrorMessage('Sks matakuliah dibutuhkan'); return false; }
                    else {
                        if (!isInt(sks, { min: 0, max: 50 })) { setErrorMessage('Sks harus angka (min: 0, max: 50)'); return false; }
                    }

                    // Validating 'Nilai'
                    if (nilai < 0) { setErrorMessage('Nilai matakuliah dibutuhkan'); return false; }

                    // Validating 'Semester'
                    if (isEmpty(semester)) { setErrorMessage('Semester matakuliah dibutuhkan'); return false; }
                    else {
                        if (!isInt(semester, { min: 0, max: 50 })) { setErrorMessage('Semester harus angka (min: 0, max: 50)'); return false; }
                    }

                    return {
                        nama: nama,
                        semester: semester,
                        sks: sks,
                        nilai: {
                            indeks: penilaianKey.find((key) => penilaian[key].weight === parseInt(nilai, 10)),
                            bobot: nilai,
                            akhir: sks * nilai
                        },
                        dapat_diulang: dapatDiulang || true,
                        target_nilai: {
                            indeks: penilaianKey.find((key) => penilaian[key].weight === parseInt(targetNilai, 10)) || 'A',
                            bobot: targetNilai !== -1 ? targetNilai : 4
                        }
                    }
                }

                const handleTambahMatkul = async (e) => {
                    e.preventDefault();

                    // Validate Here, if ErrorValidate then setErrorMessage
                    const validatedData = validateForm();
                    if (!validatedData) { return }
                    context.handleModalClose();

                    try {
                        const response = await fetch('/api/matkulku', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(validatedData),
                        })

                        if (!response.ok) {
                            try {
                                const { message } = await response.json();
                                if (message) { throw new Error(message); }
                                else { throw new Error(`Terjadi kesalahan`); }
                            } catch (error) {
                                console.error(error);
                                throw error;
                            }
                        } else {
                            toast.success(`${nama} berhasil ditambah`, { duration: 4000, position: 'top-left' })
                            try {
                                const { matkul, ref } = await response.json();
                                if (!matkul || !ref) { throw new Error('Failed to update cache') }
                                mutate(['/api/matkulku', userIdCookie], matkul, {
                                    populateCache: (matkul, currentMatkul) => {
                                        if (currentMatkul.length === 0) { return [matkul] }
                                        else { return [matkul, ...currentMatkul] }
                                    },
                                    revalidate: false
                                })
                                mutate(['/api/matkul-history', userIdCookie], ref, {
                                    populateCache: (ref, currentRef) => {
                                        if (currentRef.length === 0) { return [ref] }
                                        else {
                                            if (currentRef.length >= 3) {
                                                const sliceCurrentRef = currentRef.slice(0, -1);
                                                return [ref, ...sliceCurrentRef]
                                            } else {
                                                return [ref, ...currentRef]
                                            }
                                        }
                                    },
                                    revalidate: false
                                })
                            } catch {
                                mutate(['/api/matkulku', userIdCookie]);
                                mutate(['/api/matkul-history', userIdCookie]);
                            }
                        }
                    } catch (error) {
                        toast.error(error.message ? error.message : 'Terjadi kesalahan', { duration: 4000, position: 'top-left' })
                    }
                }
                return (
                    <div className={`${styles.backdrop} ${context.active ? styles.active : ''}`}>
                        <form onSubmit={handleTambahMatkul} className={`${styles.tambah__matakuliah}`} id='modal'>
                            <div className={styles.top}>
                                <div className={styles.title}>
                                    <h2>Tambah Matakuliah</h2>
                                </div>
                                <div className={styles.close} onClick={() => { context.handleModalClose() }}>
                                    <FaTimes />
                                </div>
                            </div>

                            <div className={styles.inner}>
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
                                            value={nama}
                                            onChange={handleNamaChange}
                                            onFocus={() => { setErrorMessage('') }}
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
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3,1fr)',
                                    gap: '1rem'
                                }}>
                                    <div className={styles.form__input_field}>
                                        <input
                                            type="number"
                                            id="sks"
                                            placeholder=" "
                                            className={styles.form__input}
                                            value={sks}
                                            onChange={(e) => { setSks(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
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
                                            className={`${styles.form__select} ${nilai >= 0 ? styles.filled : ''}`}
                                            value={nilai}
                                            onChange={handleNilaiChange}
                                            onFocus={() => { setErrorMessage('') }}
                                            required
                                        >
                                            <option value={-1}></option>
                                            {penilaianKey.map((nilai) => (
                                                <option value={penilaian[nilai].weight} key={crypto.randomUUID()}>{nilai}</option>
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
                                            placeholder=" "
                                            className={styles.form__input}
                                            value={semester}
                                            onChange={(e) => { setSemester(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
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
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2,1fr)',
                                    gap: '1rem'
                                }}>
                                    <div className={styles.form__input_field}>
                                        <select
                                            id="dapatDiulang"
                                            className={`${styles.form__select} ${styles.filled}`}
                                            value={dapatDiulang}
                                            onChange={(e) => { setDapatDiulang(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
                                            required
                                        >
                                            <option value={true}>Ya</option>
                                            <option value={false}>Tidak</option>
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
                                            className={`${styles.form__select} ${targetNilai >= 0 ? styles.filled : ''}`}
                                            value={targetNilai}
                                            onChange={(e) => { setTargetNilai(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
                                            required
                                        >
                                            <option value={-1}></option>
                                            {penilaianKey.map((nilai) => (
                                                <option value={penilaian[nilai].weight} key={crypto.randomUUID()}>{nilai}</option>
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
                            </div>
                            <div className={styles.form__action}>
                                <button type='submit' className={styles.btn}>
                                    <h3>Tambah</h3>
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }}
        </ModalContext.Consumer>
    )
}