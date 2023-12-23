// ========== NEXT DEPEDENCY ========== //
import Link from "next/link";
import { useRouter } from 'next/navigation';

// ========== REACT DEPEDENCY ========== //
import { useState, useContext } from "react";

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
import { FaTimes, FaRegTimesCircle } from 'react-icons/fa'
import { FaRegCircleCheck } from "react-icons/fa6";

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
                                                        return [matkul, ...currentMatkul];
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
    const { data: user } = useUser({ revalidateOnMount: false });
    const { data: universitas } = useUniversitas({ revalidateOnMount: false }, 'user', user ? user[0].university_id : undefined);
    const penilaian = universitas[0].penilaian;
    const penilaianKey = Object.keys(penilaian);
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
                const validateForm = () => {
                    // Validating 'Nama'
                    if (isEmpty(nama, { ignore_whitespace: true })) { setErrorMessage('Nama matakuliah dibutuhkan'); return false; }
                    else {
                        if (!isLength(nama, { min: 3, max: 50 })) { setErrorMessage('Nama matakuliah minimal 3 karakter maksimal 50 karakter'); return false; }
                    }

                    // Validating 'Sks'
                    if (isEmpty(sks, { ignore_whitespace: true })) { setErrorMessage('Sks matakuliah dibutuhkan'); return false; }
                    else {
                        if (!isInt(sks, { min: 0, max: 50 })) { setErrorMessage('Sks harus angka (min: 0, max: 50)'); return false; }
                    }

                    // Validating 'Nilai'
                    if (nilai < 0) { setErrorMessage('Nilai matakuliah dibutuhkan'); return false; }

                    // Validating 'Semester'
                    if (isEmpty(semester, { ignore_whitespace: true })) { setErrorMessage('Semester matakuliah dibutuhkan'); return false; }
                    else {
                        if (!isInt(semester, { min: 0, max: 50 })) { setErrorMessage('Semester harus angka (min: 0, max: 50)'); return false; }
                    }

                    return {
                        nama: nama,
                        semester: semester,
                        sks: sks,
                        nilai: {
                            indeks: penilaianKey.find((key) => `${penilaian[key].weight}` === `${nilai}`),
                            bobot: nilai,
                            akhir: sks * nilai
                        },
                        dapat_diulang: dapatDiulang,
                        ...(dapatDiulang === 'true'
                            ? {
                                target_nilai: {
                                    indeks:
                                        penilaianKey.find(
                                            (key) => `${penilaian[key].weight}` === `${targetNilai}`
                                        ) || 'A',
                                    bobot: targetNilai !== -1 ? targetNilai : 4,
                                },
                            }
                            : {})
                    }
                }

                const handleTambahMatkul = async (e) => {
                    e.preventDefault();

                    // Validate Here, if ErrorValidate then setErrorMessage
                    const validatedData = validateForm();
                    if (!validatedData) { return }
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
                                                    return [matkul, ...currentMatkul];
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
                                    {dapatDiulang === 'true' ?
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
                                        : <></>
                                    }
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
                                <h3 style={{ marginTop: 'var(--m-0-75)', textAlign: 'center' }}>Target</h3>
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