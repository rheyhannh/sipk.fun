// ========== NEXT DEPEDENCY ========== //
import Link from "next/link";

// ========== REACT DEPEDENCY ========== //
import { useState, useContext } from "react";

// ========== COMPONENTS DEPEDENCY ========== //
import { ModalContext } from "./provider/Modal";
import { UsersContext } from './provider/Users';
import { Accordion } from '@/component/Accordion'

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
                    if (type === 'tambah') { return (<p>Kamu ingin menghapus <b style={{fontWeight: '600'}}>{nama}</b> yang sudah ditambah?</p>) }
                    else if (type === 'hapus') { return (<p>Kamu ingin menambah kembali <b style={{fontWeight: '600'}}>{nama}</b> yang sudah dihapus?</p>) }
                    else if (type === 'ubah') { return (<p>Kamu ingin mengubah <b style={{fontWeight: '600'}}>{nama}</b> ke data sebelumnya?</p>) }
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
                            <div style={{ marginBottom: '0' }} className={styles.top}>
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
    const [nama, setNama] = useState('');
    const [sks, setSks] = useState('');
    const [nilai, setNilai] = useState('');
    const [semester, setSemester] = useState('');
    const [dapatDiulang, setDapatDiulang] = useState('');
    const [nilaiMaks, setNilaiMaks] = useState('');

    return (
        <ModalContext.Consumer>
            {context => {
                return (
                    <div className={`${styles.backdrop} ${context.active ? styles.active : ''}`}>
                        <div className={styles.tambah__matakuliah} id='modal'>
                            <div className={styles.top}>
                                <div className={styles.title}>
                                    <h2>Tambah Matakuliah</h2>
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
                                            value={nama}
                                            onChange={(e) => { setNama(e.target.value) }}
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
                                                value={sks}
                                                onChange={(e) => { setSks(e.target.value) }}
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
                                                value={nilai}
                                                onChange={(e) => { setNilai(e.target.value) }}
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
                                                value={semester}
                                                onChange={(e) => { setSemester(e.target.value) }}
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
                                                value={dapatDiulang}
                                                onChange={(e) => { setDapatDiulang(e.target.value) }}
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
                                                value={nilaiMaks}
                                                onChange={(e) => { setNilaiMaks(e.target.value) }}
                                            />
                                            <label
                                                htmlFor="maxNilai"
                                                className={styles.form__label}
                                            >
                                                Nilai Maks
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className={styles.form__action}>
                                <div className={styles.btn} onClick={() => { console.log(`Tambah ${nama ? nama : 'Matakuliah'}`); }}>
                                    <h3>Tambah {nama ? nama : 'Matakuliah'}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }}
        </ModalContext.Consumer>
    )
}