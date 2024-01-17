// ========== NEXT DEPEDENCY ========== //
import Link from "next/link";
import { useRouter } from 'next/navigation';

// ========== REACT DEPEDENCY ========== //
import { useState, useContext, useRef } from "react";

// ========== VALIDATOR/SANITIZER DEPEDENCY ========== //
import isLength from 'validator/lib/isLength';
import isInt from 'validator/lib/isInt';
import isEmpty from 'validator/lib/isEmpty';
import isFloat from 'validator/lib/isFloat'
import isAlpha from 'validator/lib/isAlpha';

// ========== COMPONENTS DEPEDENCY ========== //
import { mutate } from 'swr';
import { useCookies } from 'next-client-cookies';
import toast from 'react-hot-toast';
import { ModalContext } from "./provider/Modal";
import { UsersContext } from './provider/Users';
import { Accordion } from '@/component/Accordion';
import { unixToDate, getLoadingMessage } from "@/utils/client_side";

// ========== DATA DEPEDENCY ========== //
import { useUser, useUniversitas } from "@/data/core";

// ========== ICONS DEPEDENCY ========== //
import { FaTimes, FaRegTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { FaRegCircleCheck } from "react-icons/fa6";
import { AiOutlineStar, AiFillStar, AiOutlineDrag } from "react-icons/ai";
import {
    IoCaretForward,
    IoCaretBack,
    IoPlayForward,
    IoPlayBack,
} from "react-icons/io5";

// ========== STYLE DEPEDENCY ========== //
import styles from './style/modal.module.css'

export const Default = () => {
    return (
        <ModalContext.Consumer>
            {context => {
                return (
                    <div className={`${styles.backdrop} ${context.active ? styles.active : ''}`}>
                        <div className={styles.default} id='modal'>
                            <div className={styles.main}>
                                {
                                    context?.data?.image
                                        ? context?.data?.image
                                        : context?.data?.isSuccess
                                            ? <FaRegCircleCheck size={'70px'} color={'var(--logo-second-color)'} />
                                            : <FaRegTimesCircle size={'70px'} color={'var(--logo-second-color)'} />
                                }
                            </div>

                            <div style={{ textAlign: 'center' }} className={styles.title}>
                                <h2>
                                    {
                                        context?.data?.title
                                            ? context?.data?.title
                                            : context?.data?.isSuccess
                                                ? 'Yeaay!'
                                                : 'Ooops!'
                                    }
                                </h2>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <p>
                                    {
                                        context?.data?.message
                                            ? context?.data?.message
                                            : context?.data?.isSuccess
                                                ? 'Berhasil memproses permintaanmu'
                                                : 'Sepertinya ada yang salah saat memproses permintaanmu.'
                                    }

                                </p>
                            </div>

                            <div className={styles.form__action}>
                                <div className={`${styles.btn} ${styles.confirm}`} onClick={() => { context.handleModalClose() }}>
                                    <h3>
                                        {
                                            context?.data?.actionText
                                                ? context?.data?.actionText
                                                : 'Tutup'
                                        }
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }}
        </ModalContext.Consumer>
    )
}

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
    const accessToken = useCookies().get('s_access_token');

    const handleLogout = async () => {
        try {
            if (!accessToken) {
                router.refresh();
                throw new Error('Terjadi kesalahan, silahkan coba lagi');
            }
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
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
                const stamp = Math.floor(Date.now() / 1000);
                localStorage.removeItem('_table');
                router.replace(`/users?logout=${stamp}`, {
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
                            context?.data?.current?.type === 'ubah' ?
                                <div className={`${styles.perubahan__terakhir} ${styles.ubah}`} id='modal'>
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
                                                        value={isSebelumForm ? context?.data?.prev?.dapat_diulang === 'true' ? 'Ya' : 'Tidak' : context?.data?.current?.dapat_diulang === 'true' ? 'Ya' : 'Tidak'}
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
                                                        context?.data?.current?.type === 'tambah' ? 'Ditambah'
                                                            : context?.data?.current?.type === 'ubah' ? 'Diedit'
                                                                : context?.data?.current?.type === 'hapus' ? 'Dihapus'
                                                                    : 'Tanggal'
                                                    }
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
                                                        value={context?.data?.current?.dapat_diulang === 'true' ? 'Ya' : 'Tidak'}
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
    const router = useRouter();
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');

    return (
        <ModalContext.Consumer>
            {context => {
                const type = context?.data?.current?.type ? context?.data?.current?.type : context?.data?.prev?.type;
                const nama = context?.data?.current?.nama ? context?.data?.current?.nama : context?.data?.prev?.nama

                const getConfirmMessage = () => {
                    if (type === 'tambah') { return (<p>Kamu ingin menghapus <b style={{ fontWeight: '600' }}>{nama}</b> yang sudah ditambah?</p>) }
                    else if (type === 'hapus') { return (<p>Kamu ingin menambah kembali <b style={{ fontWeight: '600' }}>{nama}</b> yang sudah dihapus?</p>) }
                    else if (type === 'ubah') { return (<p>Kamu ingin mengubah <b style={{ fontWeight: '600' }}>{nama}</b> ke data sebelumnya?</p>) }
                    else { return 0; }
                }

                const getConfirmTitle = () => {
                    if (type === 'tambah') { return `Hapus Matakuliah` }
                    else if (type === 'hapus') { return `Tambah Matakuliah` }
                    else if (type === 'ubah') { return `Ubah Matakuliah` }
                    else { return 0; }
                }

                const handleUndoMatkul = async (e) => {
                    if (type === 'tambah') {
                        e.preventDefault();
                        context.handleModalClose();

                        const deleteMatkul = () => {
                            return new Promise(async (resolve, reject) => {
                                try {
                                    if (!accessToken) {
                                        router.refresh();
                                        throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                    }
                                    if (!userIdCookie) {
                                        router.refresh();
                                        throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                    }

                                    const response = await fetch(`/api/matkul?id=${context?.data?.matkul_id}`, {
                                        method: 'DELETE',
                                        headers: {
                                            'Authorization': `Bearer ${accessToken}`,
                                            'Content-Type': 'application/json',
                                        },
                                    });

                                    if (!response.ok) {
                                        if (response.status === 401) {
                                            router.replace('/users?action=login&error=isession', {
                                                scroll: false
                                            });
                                            throw new Error(`Unauthorized`);
                                        } else {
                                            try {
                                                const { message } = await response.json();
                                                if (message) {
                                                    throw new Error(message);
                                                } else {
                                                    throw new Error(`Terjadi kesalahan`);
                                                }
                                            } catch (error) {
                                                console.error(error);
                                                reject(error);
                                            }
                                        }
                                    } else {
                                        try {
                                            const { ref } = await response.json();
                                            if (!ref) {
                                                throw new Error('Failed to update cache');
                                            }
                                            mutate(['/api/matkul', userIdCookie], undefined, {
                                                populateCache: (_, currentMatkul) => {
                                                    if (!currentMatkul) {
                                                        return [];
                                                    } else if (currentMatkul.length - 1 === 0) {
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
                                                        return [ref, ...filteredRef];
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
                                } catch (error) {
                                    reject(error);
                                }
                            });
                        };

                        toast.promise(
                            deleteMatkul(),
                            {
                                loading: `${getLoadingMessage(false, 0)} matakuliah`,
                                success: `${context?.data?.current?.nama} berhasil dihapus`,
                                error: (error) => `${error.message || 'Terjadi kesalahan'}`
                            },
                            {
                                position: 'top-left',
                                duration: 4000,
                            }
                        )
                    }
                    else if (type === 'hapus') {
                        e.preventDefault();
                        context.handleModalClose();

                        const addMatkul = () => {
                            return new Promise(async (resolve, reject) => {
                                try {
                                    if (!accessToken) {
                                        router.refresh();
                                        throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                    }
                                    if (!userIdCookie) {
                                        router.refresh();
                                        throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                    }

                                    const response = await fetch(`/api/matkul?ref=${context?.data?.matkul_id}`, {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': `Bearer ${accessToken}`,
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            nama: context?.data?.current?.nama,
                                            semester: context?.data?.current?.semester,
                                            sks: context?.data?.current?.sks,
                                            nilai: {
                                                indeks: context?.data?.current?.nilai?.indeks,
                                                bobot: context?.data?.current?.nilai?.bobot,
                                                akhir: context?.data?.current?.nilai?.akhir,
                                            },
                                            dapat_diulang: context?.data?.current?.dapat_diulang,
                                            target_nilai: {
                                                indeks: context?.data?.current?.target_nilai?.indeks,
                                                bobot: context?.data?.current?.target_nilai?.bobot,
                                            },
                                        }),
                                    });

                                    if (!response.ok) {
                                        if (response.status === 401) {
                                            router.replace('/users?action=login&error=isession', {
                                                scroll: false
                                            });
                                            throw new Error(`Unauthorized`);
                                        } else {
                                            try {
                                                const { message } = await response.json();
                                                if (message) {
                                                    throw new Error(message);
                                                } else {
                                                    throw new Error(`Terjadi kesalahan`);
                                                }
                                            } catch (error) {
                                                console.error(error);
                                                reject(error);
                                            }
                                        }
                                    } else {
                                        try {
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
                                                        return [ref, ...filteredRef];
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
                                } catch (error) {
                                    reject(error);
                                }
                            });
                        };

                        toast.promise(
                            addMatkul(),
                            {
                                loading: `${getLoadingMessage(false, 0)} matakuliah`,
                                success: `${context?.data?.current?.nama} berhasil ditambah`,
                                error: (error) => `${error.message || 'Terjadi kesalahan'}`
                            },
                            {
                                position: 'top-left',
                                duration: 4000,
                            }
                        )

                    }
                    else if (type === 'ubah') { console.log(`Ubah Matakuliah ${context?.data?.matkul_id}`) }
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
                                <div
                                    className={`${styles.btn} ${styles.confirm} ${context?.data?.current?.type ? styles[context?.data?.current?.type] : styles[context?.data?.prev?.type]}`}
                                    onClick={(e) => { handleUndoMatkul(e) }}
                                >
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
    const router = useRouter();
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    const [nama, setNama] = useState('');
    const [sks, setSks] = useState('');
    const [nilai, setNilai] = useState(-1);
    const [semester, setSemester] = useState('');
    const [dapatDiulang, setDapatDiulang] = useState('true');
    const [targetNilai, setTargetNilai] = useState(4);
    const [errorMessage, setErrorMessage] = useState('');

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
                            if (nilai < 0) { setErrorMessage('Nilai matakuliah dibutuhkan'); resolve(null); }
                            else {
                                if (!isInt(nilai, { min: 0, max: 4 })) { setErrorMessage('Nilai tidak valid'); resolve(null); }
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
                                    indeks: penilaianKey.find((key) => `${penilaian[key].weight}` === `${nilai}`),
                                    bobot: Number(nilai),
                                    akhir: Number(sks) * Number(nilai)
                                },
                                dapat_diulang: dapatDiulang === 'true' ? true : false,
                                target_nilai: {
                                    indeks:
                                        penilaianKey.find(
                                            (key) => `${penilaian[key].weight}` === `${targetNilai}`
                                        ) || 'A',
                                    bobot: targetNilai >= 0 ? Number(targetNilai) : 4,
                                }
                            })
                        } catch (error) { reject(error); }
                    })
                }

                const handleTambahMatkul = async (e) => {
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

                    const addMatkul = () => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                if (!accessToken) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }
                                if (!userIdCookie) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }

                                const response = await fetch('/api/matkul', {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${accessToken}`,
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(validatedData),
                                });

                                if (!response.ok) {
                                    if (response.status === 401) {
                                        router.replace('/users?action=login&error=isession', {
                                            scroll: false
                                        });
                                        throw new Error(`Unauthorized`);
                                    } else {
                                        try {
                                            const { message } = await response.json();
                                            if (message) {
                                                throw new Error(message);
                                            } else {
                                                throw new Error(`Terjadi kesalahan`);
                                            }
                                        } catch (error) {
                                            console.error(error);
                                            reject(error);
                                        }
                                    }
                                } else {
                                    try {
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
                                                } else if (currentRef.length === 0) {
                                                    return [ref];
                                                } else {
                                                    if (currentRef.length >= 3) {
                                                        const sliceCurrentRef = currentRef.slice(0, -1);
                                                        return [ref, ...sliceCurrentRef];
                                                    } else {
                                                        return [ref, ...currentRef];
                                                    }
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
                            } catch (error) {
                                reject(error);
                            }
                        });
                    };

                    toast.promise(
                        addMatkul(),
                        {
                            loading: `${getLoadingMessage(false, 1)}`,
                            success: `${nama} berhasil ditambah`,
                            error: (error) => `${error.message || 'Terjadi kesalahan'}`
                        },
                        {
                            position: 'top-left',
                            duration: 4000,
                        }
                    )
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
                                            minLength="3"
                                            maxLength="50"
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
                                            step="1"
                                            min="0"
                                            max="50"
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
                                            <option value={-1} disabled hidden></option>
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
                                            step="1"
                                            min="0"
                                            max="50"
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
                                            <option value={-1} disabled hidden></option>
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

export const Profil = () => {
    const router = useRouter();
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    const [editProfil, setEditProfil] = useState(false);
    const [nama, setNama] = useState('');
    const [nickname, setNickname] = useState('');
    const [universitas, setUniversitas] = useState('');
    const [jurusan, setJurusan] = useState('');
    const [sksTarget, setSksTarget] = useState('');
    const [matkulTarget, setMatkulTarget] = useState('');
    const [ipkTarget, setIpkTarget] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
            {context => {
                const validateForm = () => {
                    // Validating 'Nama'
                    if (isEmpty(nama, { ignore_whitespace: true })) { setErrorMessage('Nama lengkap dibutuhkan'); return false; }
                    if (!isLength(nama, { min: 6, max: 50 })) { setErrorMessage('Nama lengkap minimal 6 karakter maksimal 50 karakter'); return false; }
                    if (!isAlpha(nama.replace(/\s/g, ''))) { setErrorMessage('Nama lengkap hanya dapat menggunakan huruf'); return false; }
                    const fullNameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/;
                    if (!fullNameRegex.test(nama)) { setErrorMessage('Nama lengkap hanya dapat menggunakan 1 spasi disetiap kata'); return false; }

                    // Validating 'Nickname'
                    if (isEmpty(nickname, { ignore_whitespace: true })) { setErrorMessage('Nickname dibutuhkan'); return false; }
                    if (!isLength(nickname, { min: 6, max: 20 })) { setErrorMessage('Nickname minimal 6 karakter maksimal 20 karakter'); return false; }

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
                                if (!accessToken) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }
                                if (!userIdCookie) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }

                                const response = await fetch('/api/me', {
                                    method: 'PATCH',
                                    headers: {
                                        'Authorization': `Bearer ${accessToken}`,
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(validatedData),
                                });

                                if (!response.ok) {
                                    if (response.status === 401) {
                                        router.replace('/users?action=login&error=isession', {
                                            scroll: false
                                        });
                                        throw new Error(`Unauthorized`);
                                    } else {
                                        try {
                                            const { message } = await response.json();
                                            if (message) {
                                                const newMessage =
                                                    message.includes('alpha only pattern') ? 'Nama lengkap hanya dapat menggunakan huruf'
                                                        : message.includes('one space each word pattern') ? 'Nama lengkap hanya dapat menggunakan 1 spasi disetiap kata'
                                                            : message
                                                throw new Error(newMessage);
                                            } else {
                                                throw new Error(`Terjadi kesalahan`);
                                            }
                                        } catch (error) {
                                            console.error(error);
                                            reject(error);
                                        }
                                    }
                                } else {
                                    try {
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
                            } catch (error) {
                                reject(error);
                            }
                        });
                    };

                    toast.promise(
                        editProfil(),
                        {
                            loading: `${getLoadingMessage(false, 1)}`,
                            success: `Profil berhasil diperbarui`,
                            error: (error) => `${error.message || 'Terjadi kesalahan'}`
                        },
                        {
                            position: 'top-left',
                            duration: 4000,
                        }
                    )
                }

                return (
                    <div className={`${styles.backdrop} ${context.active ? styles.active : ''}`}>
                        <form onSubmit={handleEditProfil} className={`${styles.profil} ${editProfil ? styles.confirm : ''}`} id='modal'>
                            <div className={styles.top}>
                                <div className={styles.title}>
                                    <h2>{editProfil ? 'Edit Profil' : 'Profil'}</h2>
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
                                            style={{ cursor: editProfil ? 'not-allowed' : 'default' }}
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
                            </div>
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
                                        <div style={{ marginTop: '0' }} className={`${styles.btn} ${styles.cancel}`} onClick={toggleEditProfil}>
                                            <h3>Batalkan</h3>
                                        </div>
                                        <button type='submit' className={styles.btn}>
                                            <h3>Simpan</h3>
                                        </button>
                                    </>
                                    :
                                    <div className={styles.btn} onClick={toggleEditProfil}>
                                        <h3>Edit Profil</h3>
                                    </div>
                                }
                            </div>
                        </form>
                    </div>
                )
            }}
        </ModalContext.Consumer>
    )
}

export const Rating = () => {
    const router = useRouter();
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    const { data: user } = useUser({ revalidateOnMount: false });
    const { data: universitas } = useUniversitas({ revalidateOnMount: false }, 'user', user ? user[0].university_id : undefined);
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState('');
    const [author, setAuthor] = useState(0);
    const [editRating, setEditRating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const starsMessage = [
        'Berapa bintang yang kamu kasih untuk SIPK',
        'Mohon maaf atas pengalamanmu yang sangat kurang di SIPK, Boleh cerita apa yang perlu SIPK perbaiki?',
        'Mohon maaf atas pengalamanmu yang kurang di SIPK, Boleh cerita apa yang kurang di SIPK?',
        'Menurut kamu, apa yang SIPK perlu benahin',
        'Bintangnya engga lengkap, kaya mimin tanpa dia. Yuk ceritain kenapa kamu suka pakai SIPK. Dan jangan lupa rekomendasiin SIPK keteman kamu ya.',
        'Yuhuu, bintangnya lengkap. Yuk spill kenapa kamu suka pakai SIPK. Dan jangan lupa rekomendasiin SIPK keteman kamu ya.'
    ]

    const handleReviewChange = (e) => {
        const newReview = e.target.value;
        if (newReview.length <= 200) {
            setReview(newReview);
        }
    }

    return (
        <ModalContext.Consumer>
            {context => {
                const toggleEditRating = () => {
                    if (editRating) { setEditRating(false); setErrorMessage(''); }
                    else {
                        setStars(context?.data?.rating || 0);
                        setReview(context?.data?.review || '');
                        setAuthor(context?.data?.details?.authorType || 0);
                        setEditRating(true);
                    }
                }

                const validateForm = () => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            if (!accessToken) { throw new Error('Missing user access token'); }
                            if (!userIdCookie) { throw new Error('Missing user id'); }

                            const unallowedWords = ['http', 'https', 'www'];
                            const unallowedSymbols = ['<', '>', '&', '/', `'`, `"`];

                            // Validating & Sanitize 'Stars'
                            if (stars <= 0) { setErrorMessage('Kamu harus pilih bintang 1 - 5'); resolve(null); }
                            if (stars > 5) { setStars(5); }

                            // Validating & Sanitize 'Review'
                            if (review.length > 200) { setErrorMessage('Pesan maksimal 200 karakter'); resolve(null); }
                            if (unallowedWords.some(word => review.includes(word))) { setErrorMessage('Pesan tidak dapat mengandung URL'); resolve(null); }
                            if (unallowedSymbols.some(symbol => review.includes(symbol))) { setErrorMessage(`Pesan tidak dapat mengandung simbol > , < , & , ' , " dan /`); return false; }

                            resolve({
                                rating: stars,
                                review: review,
                                details: {
                                    author: author === 0 ? user[0].fullname : author === 1 ? user[0].nickname : 'Anonim',
                                    authorType: author,
                                    universitas: universitas[0].nama
                                }
                            })
                        } catch (error) { reject(error); }
                    })
                }

                const handleTambahRating = async (e) => {
                    e.preventDefault();

                    // Validate Here, if ErrorValidate then setErrorMessage, if ErrorCookies then router.refresh()
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

                    const addRating = () => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                if (!accessToken) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }
                                if (!userIdCookie) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }

                                const response = await fetch('/api/rating', {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${accessToken}`,
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(validatedData),
                                });

                                if (!response.ok) {
                                    if (response.status === 401) {
                                        router.replace('/users?action=login&error=isession', {
                                            scroll: false
                                        });
                                        throw new Error(`Unauthorized`);
                                    } else {
                                        try {
                                            const { message } = await response.json();
                                            if (message) {
                                                throw new Error(message);
                                            } else {
                                                throw new Error(`Terjadi kesalahan`);
                                            }
                                        } catch (error) {
                                            console.error(error);
                                            reject(error);
                                        }
                                    }
                                } else {
                                    try {
                                        const { rating } = await response.json();
                                        if (!rating) {
                                            throw new Error('Failed to update cache');
                                        }
                                        mutate(['/api/rating', userIdCookie], rating, {
                                            populateCache: (rating, current) => {
                                                return [rating]
                                            },
                                            revalidate: false,
                                        });
                                        resolve();
                                    } catch {
                                        mutate(['/api/rating', userIdCookie]);
                                        resolve();
                                    }
                                }
                            } catch (error) {
                                reject(error);
                            }
                        });
                    };

                    toast.promise(
                        addRating(),
                        {
                            loading: `${getLoadingMessage(false, 3)} rating`,
                            success: `Rating berhasil dibuat`,
                            error: (error) => `${error.message || 'Terjadi kesalahan'}`
                        },
                        {
                            position: 'top-left',
                            duration: 4000,
                        }
                    )
                }

                const handleEditRating = async (e) => {
                    e.preventDefault();

                    // Validate Here, if ErrorValidate then setErrorMessage, if ErrorCookies then router.refresh()                    const validatedData = validateForm();
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

                    const editRating = () => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                const ratingId = context?.data?.id;

                                if (!accessToken) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }
                                if (!userIdCookie) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }
                                if (!ratingId) {
                                    router.refresh();
                                    throw new Error('Terjadi kesahalan, silahkan coba lagi');
                                }

                                const response = await fetch(`/api/rating?id=${ratingId}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Authorization': `Bearer ${accessToken}`,
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(validatedData),
                                });

                                if (!response.ok) {
                                    if (response.status === 401) {
                                        router.replace('/users?action=login&error=isession', {
                                            scroll: false
                                        });
                                        throw new Error(`Unauthorized`);
                                    } else {
                                        try {
                                            const { message } = await response.json();
                                            if (message) {
                                                throw new Error(message);
                                            } else {
                                                throw new Error(`Terjadi kesalahan`);
                                            }
                                        } catch (error) {
                                            console.error(error);
                                            reject(error);
                                        }
                                    }
                                } else {
                                    try {
                                        const { rating } = await response.json();
                                        if (!rating) {
                                            throw new Error('Failed to update cache');
                                        }
                                        mutate(['/api/rating', userIdCookie], rating, {
                                            populateCache: (rating, current) => {
                                                return [rating]
                                            },
                                            revalidate: false,
                                        });
                                        resolve();
                                    } catch {
                                        mutate(['/api/rating', userIdCookie]);
                                        resolve();
                                    }
                                }
                            } catch (error) {
                                reject(error);
                            }
                        });
                    };

                    toast.promise(
                        editRating(),
                        {
                            loading: `${getLoadingMessage(false, 4)} rating`,
                            success: `Rating berhasil diperbarui`,
                            error: (error) => `${error.message || 'Terjadi kesalahan'}`
                        },
                        {
                            position: 'top-left',
                            duration: 4000,
                        }
                    )
                }

                return (
                    <div className={`${styles.backdrop} ${context.active ? styles.active : ''}`}>
                        <form onSubmit={editRating ? handleEditRating : handleTambahRating} className={`${styles.rating}`} id='modal'>
                            <div className={styles.top}>
                                <div className={styles.title}>
                                    <h2>{editRating ? 'Edit Rating' : 'Rating'}</h2>
                                </div>
                                <div className={styles.close} onClick={() => { context.handleModalClose() }}>
                                    <FaTimes />
                                </div>
                            </div>

                            <div className={styles.inner}>
                                <div style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--danger-color)' }}>
                                    {errorMessage}
                                </div>
                                {
                                    context.data ?
                                        <>
                                            <div className={styles.stars}>
                                                {
                                                    Array.from({ length: 5 }, (_, index) => (
                                                        <div
                                                            className={`${styles.star} ${editRating ? stars >= index + 1 ? styles.filled : '' : context.data.rating >= index + 1 ? styles.filled : ''} ${editRating ? '' : styles.disabled}`}
                                                            onClick={editRating ? () => { setStars(index + 1); setErrorMessage(''); } : null}
                                                            key={crypto.randomUUID()}
                                                        >
                                                            {editRating ? stars >= index + 1 ? <AiFillStar size={'100%'} /> : <AiOutlineStar size={'100%'} /> : context.data.rating >= index + 1 ? <AiFillStar size={'100%'} /> : <AiOutlineStar size={'100%'} />}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <textarea
                                                placeholder={editRating ? starsMessage[stars] : ''}
                                                value={editRating ? review : context.data.review}
                                                onChange={editRating ? handleReviewChange : null}
                                                onFocus={editRating ? () => { setErrorMessage(''); } : null}
                                                disabled={!editRating}
                                            />
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '1rem'
                                            }}>
                                                <div className={`${styles.review} ${editRating ? review.length >= 200 ? styles.max : '' : context.data.review.length >= 200 ? styles.max : ''}`}>
                                                    {editRating ? 200 - review.length + ' karakter tersisa' : ''}
                                                </div>
                                                <select
                                                    id="authorRating"
                                                    value={editRating ? author : context.data.details.authorType}
                                                    onChange={editRating ? (e) => { setAuthor(Number(e.target.value)) } : null}
                                                    onFocus={editRating ? () => { setErrorMessage('') } : null}
                                                    disabled={!editRating}
                                                    style={editRating ? {} : { cursor: 'auto' }}
                                                >
                                                    <option value={0}>Fullname</option>
                                                    <option value={1}>Nickname</option>
                                                    <option value={2}>Anonim</option>
                                                </select>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className={styles.stars}>
                                                {
                                                    Array.from({ length: 5 }, (_, index) => (
                                                        <div
                                                            className={`${styles.star} ${stars >= index + 1 ? styles.filled : ''}`}
                                                            onClick={() => { setStars(index + 1); setErrorMessage(''); }}
                                                            key={crypto.randomUUID()}
                                                        >
                                                            {stars >= index + 1 ? <AiFillStar size={'100%'} /> : <AiOutlineStar size={'100%'} />}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <textarea
                                                maxLength={200}
                                                placeholder={starsMessage[stars]}
                                                value={review}
                                                onChange={handleReviewChange}
                                                onFocus={() => { setErrorMessage('') }}
                                            />
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '1rem'
                                            }}>
                                                <div className={`${styles.review} ${review.length >= 200 ? styles.max : ''}`}>
                                                    {review.length > 0 ? 200 - review.length + ' karakter tersisa' : ''}
                                                </div>
                                                <select
                                                    id="authorRating"
                                                    value={author}
                                                    onChange={(e) => { setAuthor(Number(e.target.value)) }}
                                                    onFocus={() => { setErrorMessage('') }}
                                                >
                                                    <option value={0}>Fullname</option>
                                                    <option value={1}>Nickname</option>
                                                    <option value={2}>Anonim</option>
                                                </select>
                                            </div>
                                        </>
                                }
                            </div>

                            {
                                context.data ?
                                    <>
                                        <div
                                            style={editRating ? {
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2,1fr)',
                                                gap: '1rem'
                                            } : {}}
                                            className={styles.form__action}
                                        >
                                            {editRating ?
                                                <>
                                                    <div style={{ marginTop: '0' }} className={`${styles.btn} ${styles.cancel}`} onClick={toggleEditRating}>
                                                        <h3>Batalkan</h3>
                                                    </div>
                                                    <button type='submit' className={styles.btn}>
                                                        <h3>Simpan</h3>
                                                    </button>
                                                </>
                                                :
                                                <div className={styles.btn} onClick={toggleEditRating}>
                                                    <h3>Edit Rating</h3>
                                                </div>
                                            }
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div
                                            className={styles.form__action}
                                        >
                                            <button type='submit' className={styles.btn}>
                                                <h3>Submit</h3>
                                            </button>
                                        </div>
                                    </>
                            }
                        </form>
                    </div>
                )
            }

            }
        </ModalContext.Consumer>
    )
}

export const TabelSetting = () => {
    const router = useRouter();
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    const [editTabelSetting, setEditTabelSetting] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [activeId, setActiveId] = useState('');
    const [controlPosition, setControlPosition] = useState(0);
    const [columnState, setColumnState] = useState([
        { title: 'Nomor', id: 'nomor', visible: true },
        { title: 'Matakuliah', id: 'matakuliah', visible: true },
        { title: 'Semester', id: 'semester', visible: true },
        { title: 'Sks', id: 'sks', visible: true },
        { title: 'Nilai', id: 'nilai', visible: true },
        { title: 'Bisa Diulang', id: 'diulang', visible: true },
        { title: 'Target Nilai', id: 'target', visible: true },
    ]);
    const [errorMessage, setErrorMessage] = useState('');

    const dragItem = useRef(0);
    const draggedOverItem = useRef(0);

    const handleSort = () => {
        const cloneColumn = [...columnState];
        const temp = cloneColumn[dragItem.current];
        cloneColumn[dragItem.current] = cloneColumn[draggedOverItem.current];
        cloneColumn[draggedOverItem.current] = temp;
        setColumnState(cloneColumn);
        return cloneColumn.map(item => item.id);
    }

    const handleToggleVisibility = (id) => {
        const newColumn = columnState.map((item) =>
            item.id === id ? { ...item, visible: !item.visible } : item
        );

        setColumnState(newColumn);

        const newObj = newColumn.reduce((acc, { id, visible }) => {
            acc[id] = visible;
            return acc;
        }, {});

        return newObj;
    };

    const getTitle = (id) => {
        const column = columnState.find((item) => item.id === id);
        return column ? column.title : null;
    }

    const getColumnOrder = () => {
        const arr = columnState.map((item, index) => {
            return item.id
        })

        return arr;
    }

    const getColumnVisibility = () => {
        const obj = columnState.reduce((acc, { id, visible }) => {
            acc[id] = visible;
            return acc;
        }, {})

        return obj;
    }

    const canShiftPrev = (id) => {
        const currentIndex = columnState.findIndex((item) => item.id === id);
        if (currentIndex > 0) {
            return true;
        }
        return false;
    }

    const handleShiftPrev = (id) => {
        const currentIndex = columnState.findIndex((item) => item.id === id);
        const updatedOrder = [...columnState];
        const temp = updatedOrder[currentIndex];
        updatedOrder[currentIndex] = updatedOrder[currentIndex - 1];
        updatedOrder[currentIndex - 1] = temp;
        setColumnState(updatedOrder);
        return updatedOrder.map(item => item.id);
    };

    const canShiftNext = (id) => {
        const currentIndex = columnState.findIndex((item) => item.id === id);
        if (currentIndex < columnState.length - 1) {
            return true;
        }
        return false;
    }

    const handleShiftNext = (id) => {
        const currentIndex = columnState.findIndex((item) => item.id === id);
        const updatedOrder = [...columnState];
        const temp = updatedOrder[currentIndex];
        updatedOrder[currentIndex] = updatedOrder[currentIndex + 1];
        updatedOrder[currentIndex + 1] = temp;
        setColumnState(updatedOrder);
        return updatedOrder.map(item => item.id);
    };

    const handleShiftFirst = (id) => {
        const currentIndex = columnState.findIndex((item) => item.id === id);
        const updatedOrder = [...columnState];
        const temp = updatedOrder[currentIndex];
        updatedOrder.splice(currentIndex, 1);
        updatedOrder.unshift(temp);
        setColumnState(updatedOrder);
        return updatedOrder.map(item => item.id);
    }

    const handleShiftLast = (id) => {
        const currentIndex = columnState.findIndex((item) => item.id === id);
        const updatedOrder = [...columnState];
        const temp = updatedOrder[currentIndex];
        updatedOrder.splice(currentIndex, 1);
        updatedOrder.push(temp);
        setColumnState(updatedOrder);
        return updatedOrder.map(item => item.id);
    }

    return (
        <ModalContext.Consumer>
            {context => {
                const validateForm = () => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            if (!accessToken) { throw new Error('Missing user access token'); }
                            if (!userIdCookie) { throw new Error('Missing user id'); }

                            const allowedPageSize = [5, 10, 25, 50, 100, -1];
                            const allowedPageControlPosition = [0, 1, 2];

                            if (!allowedPageSize.includes(pageSize)) { setErrorMessage('Jumlah baris tidak diizinkan'); resolve(null); }
                            if (!allowedPageControlPosition.includes(controlPosition)) { setErrorMessage('Posisi kontrol tidak diizinkan'); resolve(null); }

                            resolve({
                                table: {
                                    size: pageSize,
                                    controlPosition,
                                    columnOrder: getColumnOrder(),
                                    columnVisibility: getColumnVisibility()
                                }
                            })
                        } catch (error) { reject(error) }
                    })
                }

                const toggleEditTabelSetting = () => {
                    if (editTabelSetting) {
                        setActiveId('');
                        setEditTabelSetting(false);
                        setErrorMessage('');
                        setPageSize(context?.data?.table?.size || 5);
                        setControlPosition(context?.data?.table?.controlPosition || 0);
                        context.data.setPageSize(context?.data?.table?.size || 5);
                        context.data.setPageControlPosition(context?.data?.table?.controlPosition || 0);
                        if (context?.data?.table?.state) {
                            setColumnState(context.data.table.state);
                            context.data.setColumnOrder(context.data.table.state.map((item, index) => item.id));
                            context.data.setColumnVisibility(context.data.table.state.reduce((acc, item) => {
                                acc[item.id] = item.visible;
                                return acc;
                            }, {}));
                        }
                    }
                    else {
                        setPageSize(context?.data?.table?.size || 5)
                        setControlPosition(context?.data?.table?.controlPosition || 0);
                        if (context?.data?.table?.state) { setColumnState(context.data.table.state); }
                        setEditTabelSetting(true);
                    }
                }

                const handleSubmitSetting = async (e) => {
                    e.preventDefault();

                    // Validate Here, if ErrorValidate then setErrorMessage, if ErrorCookies then router.refresh()
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

                    const editSetting = () => {
                        return new Promise(async (resolve, reject) => {
                            try {
                                if (!accessToken) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }
                                if (!userIdCookie) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }

                                const response = await fetch(`/api/me?type=preferences`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Authorization': `Bearer ${accessToken}`,
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(validatedData),
                                });

                                if (!response.ok) {
                                    if (response.status === 401) {
                                        router.replace('/users?action=login&error=isession', {
                                            scroll: false
                                        });
                                        throw new Error(`Unauthorized`);
                                    } else {
                                        try {
                                            const { message } = await response.json();
                                            if (message) {
                                                throw new Error(message);
                                            } else {
                                                throw new Error(`Terjadi kesalahan`);
                                            }
                                        } catch (error) {
                                            console.error(error);
                                            reject(error);
                                        }
                                    }
                                } else {
                                    try {
                                        const { profil } = await response.json();
                                        if (!profil) {
                                            throw new Error('Failed to update cache');
                                        }
                                        mutate(['/api/me', userIdCookie], profil, {
                                            populateCache: (profil, _) => {
                                                return [profil]
                                            },
                                            revalidate: false,
                                        });
                                        resolve();
                                    } catch {
                                        mutate(['/api/me', userIdCookie]);
                                        resolve();
                                    }
                                }
                            } catch (error) { reject(error); }
                        });
                    };

                    toast.promise(
                        editSetting(),
                        {
                            loading: `${getLoadingMessage(false, 5)} pengaturan tabel`,
                            success: `Pengaturan tabel berhasil disimpan`,
                            error: (error) => `${error.message || 'Terjadi kesalahan'}`
                        },
                        {
                            position: 'top-left',
                            duration: 4000,
                        }
                    )
                }

                return (
                    <div className={`${styles.backdrop} ${context.active ? styles.active : ''}`}
                    >
                        <form onSubmit={handleSubmitSetting} className={`${styles.tabel__setting}`} id='modal'>
                            <div className={styles.top}>
                                <div className={styles.title}>
                                    <h2>{editTabelSetting ? 'Atur Tabel' : 'Pengaturan Tabel'}</h2>
                                </div>
                                <div className={styles.close} onClick={() => { context.handleModalClose() }}>
                                    <FaTimes />
                                </div>
                            </div>

                            <div className={styles.inner}>
                                <div style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--danger-color)' }}>
                                    {errorMessage}
                                </div>

                                <h3 className={styles.tabel__setting_title}>Visibilitas dan Urutan Kolom</h3>
                                <div className={`${styles.tabel__setting_ordering} ${activeId ? styles.active : ''}`}>
                                    {
                                        columnState.map((item, index) => (
                                            <div
                                                className={`${styles.item} ${activeId === item.id ? styles.active : ''} ${editTabelSetting ? '' : styles.disabled}`}
                                                draggable={editTabelSetting ? true : false}
                                                onTouchEnd={editTabelSetting ? () => { setActiveId(item.id) } : null}
                                                onDragStart={editTabelSetting ? () => { dragItem.current = index } : null}
                                                onDragEnter={editTabelSetting ? () => { draggedOverItem.current = index } : null}
                                                onDragEnd={editTabelSetting ? () => { context.data.setColumnOrder(handleSort()) } : null}
                                                onDragOver={editTabelSetting ? (e) => e.preventDefault() : null}
                                                key={crypto.randomUUID()}
                                            >
                                                <div
                                                    className={`${styles.eye} ${item.visible ? '' : styles.hide}`}
                                                    onClick={editTabelSetting ? () => {
                                                        context.data.setColumnVisibility(handleToggleVisibility(item.id))
                                                    } : null}
                                                    style={editTabelSetting ? {} : { color: 'var(--infoDark-color)', cursor: 'auto' }}
                                                >
                                                    <span>
                                                        {item.visible ? <FaEye size={'15px'} /> : <FaEyeSlash size={'15px'} />}
                                                    </span>
                                                </div>

                                                <div className={styles.title}>
                                                    {item.title}
                                                </div>

                                                <div className={styles.drag} style={editTabelSetting ? {} : { color: 'var(--infoDark-color)', cursor: 'auto' }}>
                                                    <AiOutlineDrag size={'15px'} />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                                <div className={`${styles.tabel__setting_control} ${editTabelSetting && activeId ? '' : styles.hide}`}>
                                    <div
                                        className={activeId && canShiftPrev(activeId) ? '' : styles.disabled}
                                        onClick={activeId && canShiftPrev(activeId) ? () => {
                                            context.data.setColumnOrder(handleShiftFirst(activeId));
                                        } : null}
                                    >
                                        <IoPlayBack
                                            size={'16px'}
                                        />
                                    </div>

                                    <div
                                        className={activeId && canShiftPrev(activeId) ? '' : styles.disabled}
                                        onClick={activeId && canShiftPrev(activeId) ? () => {
                                            context.data.setColumnOrder(handleShiftPrev(activeId));
                                        } : null}
                                    >
                                        <IoCaretBack
                                            size={'16px'}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            fontSize: '.8rem',
                                            fontWeight: '600',
                                            color: 'var(--logo-second-color)',
                                            padding: '0'
                                        }}
                                    >
                                        {activeId ? getTitle(activeId) : null}
                                    </div>

                                    <div
                                        className={activeId && canShiftNext(activeId) ? '' : styles.disabled}
                                        onClick={activeId && canShiftNext(activeId) ? () => {
                                            context.data.setColumnOrder(handleShiftNext(activeId));
                                        } : null}
                                    >
                                        <IoCaretForward
                                            size={'16px'}
                                        />
                                    </div>

                                    <div
                                        className={activeId && canShiftNext(activeId) ? '' : styles.disabled}
                                        onClick={activeId && canShiftNext(activeId) ? () => {
                                            context.data.setColumnOrder(handleShiftLast(activeId));
                                        } : null}
                                    >
                                        <IoPlayForward
                                            size={'16px'}
                                        />
                                    </div>
                                </div>

                                <div className={styles.tabel__setting_select}>
                                    <div>
                                        <h3 style={{ marginBottom: '0' }} className={styles.tabel__setting_title}>Jumlah Baris</h3>
                                        <select
                                            id="pageSize"
                                            value={pageSize}
                                            onChange={editTabelSetting ? (e) => {
                                                setPageSize(Number(e.target.value));
                                                context.data.setPageSize(Number(e.target.value));
                                            } : null}
                                            onFocus={editTabelSetting ? () => { setErrorMessage('') } : null}
                                            disabled={!editTabelSetting}
                                            style={editTabelSetting ? {} : { cursor: 'auto' }}
                                        >
                                            {[5, 10, 25, 50, 100, -1].map((pageSize, index) => (
                                                <option key={crypto.randomUUID()} value={pageSize}>
                                                    {index === 5 ? 'Semua' : pageSize}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <h3 style={{ marginBottom: '0' }} className={styles.tabel__setting_title}>Posisi Kontrol</h3>
                                        <select
                                            id="controlPosition"
                                            value={controlPosition}
                                            onChange={editTabelSetting ? (e) => {
                                                setControlPosition(Number(e.target.value));
                                                context.data.setPageControlPosition(Number(e.target.value));
                                            } : null}
                                            onFocus={editTabelSetting ? () => { setErrorMessage('') } : null}
                                            disabled={!editTabelSetting}
                                            style={editTabelSetting ? {} : { cursor: 'auto' }}
                                        >
                                            {[{ text: 'Bawah', val: 0 }, { text: 'Atas', val: 1 }, { text: 'Semua', val: 2 }].map((item, index) => (
                                                <option key={crypto.randomUUID()} value={item.val}>
                                                    {item.text}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={editTabelSetting ? {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2,1fr)',
                                    gap: '1rem'
                                } : {}}
                                className={styles.form__action}
                            >
                                {editTabelSetting ?
                                    <>
                                        <div style={{ marginTop: '0' }} className={`${styles.btn} ${styles.cancel}`} onClick={toggleEditTabelSetting}>
                                            <h3>Batalkan</h3>
                                        </div>
                                        <button type='submit' className={styles.btn}>
                                            <h3>Simpan</h3>
                                        </button>
                                    </>
                                    :
                                    <div className={styles.btn} onClick={toggleEditTabelSetting}>
                                        <h3>Atur Tabel</h3>
                                    </div>
                                }
                            </div>
                        </form>
                    </div>
                )
            }
            }
        </ModalContext.Consumer>
    )
}

export const TabelFilter = () => {
    const [editFilter, setEditFilter] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nama, setNama] = useState('');
    const [sksMin, setSksMin] = useState('');
    const [sksMaks, setSksMaks] = useState('');
    const [semesterMin, setSemesterMin] = useState('');
    const [semesterMaks, setSemesterMaks] = useState('');
    const [nilai, setNilai] = useState('');
    const [targetNilai, setTargetNilai] = useState('');
    const [dapatDiulang, setDapatDiulang] = useState('');

    const handleNamaChange = (e) => {
        const newNama = e.target.value;
        if (newNama.length <= 50) {
            setNama(newNama);
        }
    }

    const getValueById = (id, arr) => {
        const item = arr.find(x => x.id === id);
        if (!item) { return '' }
        if (id === 'diulang') {
            return item.value ? 'ya' : 'tidak';
        }
        else if (['sks', 'semester'].includes(id)) {
            return [item.value[0] ?? '', item.value[1] ?? ''];
        } else {
            return item.value ?? '';
        }
    }

    return (
        <ModalContext.Consumer>
            {context => {
                const penilaian = context.data.penilaian;
                const penilaianKey = Object.keys(penilaian);

                const validateForm = () => {

                }

                const toggleEditFilter = () => {
                    setNama(getValueById('matakuliah', context?.data?.columnFilters))
                    setSksMin(getValueById('sks', context?.data?.columnFilters)[0])
                    setSksMaks(getValueById('sks', context?.data?.columnFilters)[1])
                    setSemesterMin(getValueById('semester', context?.data?.columnFilters)[0])
                    setSemesterMaks(getValueById('semester', context?.data?.columnFilters)[1])
                    setNilai(getValueById('nilai', context?.data?.columnFilters));
                    setTargetNilai(getValueById('target', context?.data?.columnFilters));
                    setDapatDiulang(getValueById('diulang', context?.data?.columnFilters));
                    if (editFilter) {
                        setEditFilter(false);
                        setErrorMessage('');
                    } else {
                        setEditFilter(true);
                    }
                }

                const handleResetFilter = () => {
                    setNama('');
                    setSksMin('');
                    setSksMaks('');
                    setSemesterMin('');
                    setSemesterMaks('');
                    setNilai('');
                    setTargetNilai('');
                    setDapatDiulang('');
                }

                const handleApplyFilter = () => {

                }

                return (
                    <div className={`${styles.backdrop} ${context.active ? styles.active : ''}`}>
                        <form
                            style={editFilter ? {
                                gridTemplateRows: '30px auto 100px',
                                overflow: 'hidden'
                            } : {}}
                            onSubmit={handleApplyFilter}
                            className={`${styles.tabel__filter}`}
                            id='modal'
                        >
                            <div className={styles.top}>
                                <div className={styles.title}>
                                    <h2>{editFilter ? 'Atur Filter' : 'Filter Tabel'}</h2>
                                </div>
                                <div className={styles.close} onClick={() => { context.handleModalClose() }}>
                                    <FaTimes />
                                </div>
                            </div>

                            <div className={styles.inner}>
                                <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--danger-color)' }}>
                                    {errorMessage}
                                </div>

                                <div style={{ marginBottom: '.75rem' }}>
                                    <div className={styles.form__input_field}>
                                        <div>
                                            <input
                                                type="text"
                                                id="nama"
                                                maxLength="50"
                                                placeholder=" "
                                                className={`${styles.form__input} ${styles.max_length}`}
                                                value={nama}
                                                onChange={handleNamaChange}
                                                onFocus={() => { setErrorMessage('') }}
                                                disabled={!editFilter}
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
                                </div>

                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2,1fr)',
                                        gap: '1rem',
                                        marginBottom: '1.25rem'
                                    }}
                                >
                                    <div>
                                        <h3 className={styles.tabel__filter_title}>Sks</h3>
                                        <div className={styles.tabel__filter_range}>
                                            <div className={styles.form__input_field}>
                                                <input
                                                    type="number"
                                                    id="sksMin"
                                                    step="1"
                                                    max="50"
                                                    placeholder=" "
                                                    className={styles.form__input}
                                                    value={sksMin}
                                                    onChange={(e) => { setSksMin(e.target.value) }}
                                                    onFocus={() => { setErrorMessage('') }}
                                                    disabled={!editFilter}
                                                />
                                                <label
                                                    htmlFor="sksMin"
                                                    className={styles.form__label}
                                                >
                                                    Min
                                                </label>
                                            </div>

                                            <div className={styles.form__input_field}>
                                                <input
                                                    type="number"
                                                    id="sksMaks"
                                                    step="1"
                                                    max="50"
                                                    placeholder=" "
                                                    className={styles.form__input}
                                                    value={sksMaks}
                                                    onChange={(e) => { setSksMaks(e.target.value) }}
                                                    onFocus={() => { setErrorMessage('') }}
                                                    disabled={!editFilter}
                                                />
                                                <label
                                                    htmlFor="sksMaks"
                                                    className={styles.form__label}
                                                >
                                                    Maks
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className={styles.tabel__filter_title}>Semester</h3>
                                        <div className={styles.tabel__filter_range}>
                                            <div className={styles.form__input_field}>
                                                <input
                                                    type="number"
                                                    id="semesterMin"
                                                    step="1"
                                                    max="50"
                                                    placeholder=" "
                                                    className={styles.form__input}
                                                    value={semesterMin}
                                                    onChange={(e) => { setSemesterMin(e.target.value) }}
                                                    onFocus={() => { setErrorMessage('') }}
                                                    disabled={!editFilter}
                                                />
                                                <label
                                                    htmlFor="semesterMin"
                                                    className={styles.form__label}
                                                >
                                                    Min
                                                </label>
                                            </div>

                                            <div className={styles.form__input_field}>
                                                <input
                                                    type="number"
                                                    id="semesterMaks"
                                                    step="1"
                                                    max="50"
                                                    placeholder=" "
                                                    className={styles.form__input}
                                                    value={semesterMaks}
                                                    onChange={(e) => { setSemesterMaks(e.target.value) }}
                                                    onFocus={() => { setErrorMessage('') }}
                                                    disabled={!editFilter}
                                                />
                                                <label
                                                    htmlFor="semesterMaks"
                                                    className={styles.form__label}
                                                >
                                                    Maks
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3,1fr)',
                                        gap: '1rem',
                                        marginBottom: '1.25rem'
                                    }}
                                >
                                    <div className={styles.form__input_field}>
                                        <select
                                            id="nilai"
                                            className={`${styles.form__select} ${nilai ? styles.filled : ''}`}
                                            value={nilai}
                                            onChange={(e) => { setNilai(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
                                            style={editFilter ? {} : { cursor: 'auto' }}
                                            disabled={!editFilter}
                                        >
                                            <option value={''}></option>
                                            <option value={-1}>Semua</option>
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
                                        <select
                                            id="targetNilai"
                                            className={`${styles.form__select} ${targetNilai ? styles.filled : ''}`}
                                            value={targetNilai}
                                            onChange={(e) => { setTargetNilai(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
                                            style={editFilter ? {} : { cursor: 'auto' }}
                                            disabled={!editFilter}
                                        >
                                            <option value={''}></option>
                                            <option value={-1}>Semua</option>
                                            {penilaianKey.map((nilai) => (
                                                <option value={nilai} key={crypto.randomUUID()}>{nilai}</option>
                                            ))
                                            }
                                        </select>

                                        <label
                                            htmlFor="targetNilai"
                                            className={styles.form__label}
                                        >
                                            Target Nilai
                                        </label>
                                    </div>

                                    <div className={styles.form__input_field}>
                                        <select
                                            id="dapatDiulang"
                                            className={`${styles.form__select} ${dapatDiulang ? styles.filled : ''}`}
                                            value={dapatDiulang}
                                            onChange={(e) => { setDapatDiulang(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
                                            style={editFilter ? {} : { cursor: 'auto' }}
                                            disabled={!editFilter}
                                        >
                                            <option value={''}></option>
                                            <option value={-1}>Semua</option>
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
                                </div>
                            </div>

                            {editFilter ?
                                <div
                                    className={styles.form__action}
                                >
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2,1fr)',
                                            gap: '1rem',
                                            height: '100%'
                                        }}
                                    >
                                        <div style={{ marginTop: '0' }} className={`${styles.btn} ${styles.confirm} ${styles.reset}`} onClick={handleResetFilter}>
                                            <h3>Reset</h3>
                                        </div>
                                        <button type='submit' className={styles.btn}>
                                            <h3>Simpan</h3>
                                        </button>
                                    </div>

                                    <div style={{ marginTop: '1rem' }} className={`${styles.btn} ${styles.cancel}`} onClick={toggleEditFilter}>
                                        <h3>Batalkan</h3>
                                    </div>

                                </div>
                                :
                                <div
                                    className={styles.form__action}
                                >
                                    <div className={styles.btn} onClick={toggleEditFilter}>
                                        <h3>Atur Filter</h3>
                                    </div>
                                </div>
                            }
                        </form>
                    </div>
                )
            }
            }
        </ModalContext.Consumer>
    )
}