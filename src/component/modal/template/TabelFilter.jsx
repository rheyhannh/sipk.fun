// #region NEXT DEPEDENCY
import { useRouter } from 'next/navigation';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import toast from 'react-hot-toast';
import { ModalContext } from '@/component/modal/provider';
import { Backdrop, Layout, Head, Button, Inner } from '@/component/modal/components';
// #endregion

// #region UTIL DEPEDENCY
import isLength from 'validator/lib/isLength';
import isInt from 'validator/lib/isInt';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css'
// #endregion

/**
 * @typedef {Object} TabelFilterModalData
 * Data yang digunakan pada modal {@link TabelFilter}
 * @property {(reset?:boolean, index:number) => void} setPageIndex
 * Method untuk mengatur table `pageIndex` atau halaman tabel dengan param berikut,
 * - `reset` : Setel halaman tabel ke halaman pertama, dimana jika `true` param `index` akan dihiraukan. Default value `false`
 * - `index` : Halaman table dimulai dari `1`
 * @property {(columnFilters:Array<{id:import('@/types/table_matakuliah').ColumnId, value:string | [string, string]}>) => void} setColumnFilters
 * Method untuk mengatur table `columnFilters`. Nilai filter atau props `value` dapat berupa string atau array yang merepresentasikan nilai `min` dan `max`
 * ```js
 * // Contoh
 * const columnFilters = [
 *      {id:'sks', value:['2', '4']},
 *      {id:'semester', value:'1'},
 *      {id:'matakuliah', value:'jaringan'}
 * ]
 * ```
 * Contoh diatas akan memfilter matakuliah dengan sks 2 sampai 4 dimana matakuliah semester 1 dan matakuliah yang mengandung keyword 'jaringan'
 * @property {Object} currentFilters
 * Current table state untuk `columnFilters` yang digunakan
 * @property {'ya' | 'tidak'} currentFilters.diulang 
 * Filter column `diulang` dengan `'ya'` maka hanya menampilkan matakuliah yang dapat diulang jika `'tidak'` hanya menampilkan matakuliah yang tidak dapat diulang
 * @property {string} currentFilters.matakuliah
 * Filter column `matakuliah` dengan keyword tertentu
 * ```js
 * // Contoh
 * const matakuliahFilter = 'jaringan'
 * ```
 * Contoh diatas akan memfilter matakuliah dengan keyword `'jaringan'`
 * @property {Array<import('@/types/sipk').DefaultIndeksNilai>} currentFilters.nilai
 * Filter column `nilai` dengan nilai tertentu
 * ```js
 * // Contoh
 * const nilaiFilter = ['A', 'D']
 * ```
 * Contoh diatas akan memfilter matakuliah dengan nilai `'A'` dan `'D'`
 * @property {'ya' | 'tidak'} currentFilters.ontarget
 * Filter column `ontarget` dengan `'ya'` maka hanya menampilkan matakuliah yang ontarget jika `'tidak'` hanya menampilkan matakuliah yang tidak ontarget
 * @property {[string, string]} currentFilters.semester
 * Filter column `semester` dengan batas tertentu
 * ```js
 * // Contoh
 * const semesterFilter = ['3', '6']
 * ```
 * Contoh diatas akan memfilter matakuliah semester 3 - 6
 * @property {[string, string]} currentFilters.sks
 * Filter column `sks` dengan batas tertentu
 * ```js
 * // Contoh
 * const sksFilter = ['1', '3']
 * ```
 * Contoh diatas akan memfilter matakuliah dengan sks 1 - 3
 * @property {Array<import('@/types/sipk').DefaultIndeksNilai>} currentFilters.target
 * Filter column `target` dengan target nilai tertentu
 * ```js
 * // Contoh
 * const targetFilter = ['B', 'C']
 * ```
 * Contoh diatas akan memfilter matakuliah dengan target nilai `'B'` dan `'C'`
 * @property {import('@/types/supabase').UniversitasData['penilaian']} penilaian
 * Indeks nilai yang digunakan pada universitas tertentu. Perlu diingat setiap universitas mungkin menggunakan indeks nilai yang berbeda, sehingga beberapa key dari property ini dapat bernilai `null`
 * - Note : Selalu gunakan optional chaining atau nullish coalescing saat mengakses key dari property ini untuk menghindari error
 */
const TabelFilter = () => {
    const router = useRouter();
    const [editFilter, setEditFilter] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [nama, setNama] = React.useState('');
    const [sksMin, setSksMin] = React.useState('');
    const [sksMaks, setSksMaks] = React.useState('');
    const [semesterMin, setSemesterMin] = React.useState('');
    const [semesterMaks, setSemesterMaks] = React.useState('');
    const [filteredNilai, setFilteredNilai] = React.useState([]);
    const [filteredTargetNilai, setFilteredTargetNilai] = React.useState([]);
    const [dapatDiulang, setDapatDiulang] = React.useState('');
    const [onTarget, setOnTarget] = React.useState('');

    const handleNamaChange = (e) => {
        const newNama = e.target.value;
        if (newNama.length <= 50) {
            setNama(newNama);
        }
    }

    return (
        <ModalContext.Consumer>
            {/** @param {import('@/types/context').ModalContext<TabelFilterModalData>} context */ context => {
                const penilaian = context.data.penilaian;
                const penilaianKey = Object.keys(penilaian);

                const getBooleanFilteredNilai = (filter) => {
                    if (!filter || !filter.length || !Array.isArray(filter)) {
                        return Array.from({ length: penilaianKey.length }, () => false);
                    }
                    return penilaianKey.map((value) => filter.includes(value.toUpperCase()));
                }

                const validateForm = () => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const allValue = [-1, '-1'];
                            if (nama) {
                                if (!isLength(nama, { max: 50 })) { setErrorMessage('Nama matakuliah maksimal 50 karakter'); resolve(null); }
                            }
                            if (sksMin && sksMaks) {
                                if (!isInt(sksMin, { min: 0, max: 50 })) {
                                    setErrorMessage('Sks minimal harus angka 0 - 50'); resolve(null);
                                }
                                if (!isInt(sksMaks, { min: 0, max: 50 })) {
                                    setErrorMessage('Sks maksimal harus angka 0 - 50'); resolve(null);
                                }
                                if (sksMin > sksMaks) {
                                    setErrorMessage('Sks maksimal harus lebih besar dari sks minimal'); resolve(null);
                                }
                            }
                            if (sksMin) {
                                if (!isInt(sksMin, { min: 0, max: 50 })) {
                                    setErrorMessage('Sks minimal harus angka 0 - 50'); resolve(null);
                                }
                            }
                            if (sksMaks) {
                                if (!isInt(sksMaks, { min: 0, max: 50 })) {
                                    setErrorMessage('Sks maksimal harus angka 0 - 50'); resolve(null);
                                }
                            }
                            if (semesterMin && semesterMaks) {
                                if (!isInt(semesterMin, { min: 0, max: 50 })) {
                                    setErrorMessage('Semester minimal harus angka 0 - 50'); resolve(null);
                                }
                                if (!isInt(semesterMaks, { min: 0, max: 50 })) {
                                    setErrorMessage('Semester maksimal harus angka 0 - 50'); resolve(null);
                                }
                                if (semesterMin > semesterMaks) {
                                    setErrorMessage('Semester maksimal harus lebih besar dari minimal semester'); resolve(null);
                                }
                            }
                            if (semesterMin) {
                                if (!isInt(semesterMin, { min: 0, max: 50 })) {
                                    setErrorMessage('Semester minimal harus angka 0 - 50'); resolve(null);
                                }
                            }
                            if (semesterMaks) {
                                if (!isInt(semesterMaks, { min: 0, max: 50 })) {
                                    setErrorMessage('Semester maksimal harus angka 0 - 50'); resolve(null);
                                }
                            }

                            const filters = [];
                            const setNilaiFilters = penilaianKey.filter((_, index) => filteredNilai[index]);
                            const setTargetNilaiFilters = penilaianKey.filter((_, index) => filteredTargetNilai[index]);
                            if (nama) { filters.push({ id: 'matakuliah', value: nama }) }
                            if (sksMin || sksMaks) { filters.push({ id: 'sks', value: [sksMin, sksMaks] }) }
                            if (semesterMin || semesterMaks) { filters.push({ id: 'semester', value: [semesterMin, semesterMaks] }) }
                            if (setNilaiFilters.length) { filters.push({ id: 'nilai', value: setNilaiFilters }) }
                            if (setTargetNilaiFilters.length) { filters.push({ id: 'target', value: setTargetNilaiFilters }) }
                            if (dapatDiulang && !allValue.includes(dapatDiulang)) { filters.push({ id: 'diulang', value: dapatDiulang === 'ya' ? true : false }) }
                            if (onTarget && !allValue.includes(onTarget)) { filters.push({ id: 'ontarget', value: onTarget === 'ya' ? true : false }) }
                            resolve(filters);
                        } catch (error) { reject(error) }
                    })
                }

                const toggleEditFilter = () => {
                    if (editFilter) { setEditFilter(false); setErrorMessage(''); }
                    else {
                        setNama(context?.data?.currentFilters?.matakuliah || '');
                        setSksMin(context?.data?.currentFilters?.sks[0] || '');
                        setSksMaks(context?.data?.currentFilters?.sks[1] || '');
                        setSemesterMin(context?.data?.currentFilters?.semester[0] || '');
                        setSemesterMaks(context?.data?.currentFilters?.semester[1] || '');
                        setFilteredNilai(getBooleanFilteredNilai(context?.data?.currentFilters?.nilai));
                        setFilteredTargetNilai(getBooleanFilteredNilai(context?.data?.currentFilters?.target));
                        setDapatDiulang(context?.data?.currentFilters?.diulang || '');
                        setOnTarget(context?.data?.currentFilters?.ontarget || '')
                        setEditFilter(true);
                    }
                }

                const handleResetFilter = () => {
                    setNama('');
                    setSksMin('');
                    setSksMaks('');
                    setSemesterMin('');
                    setSemesterMaks('');
                    setFilteredNilai(getBooleanFilteredNilai(null));
                    setFilteredTargetNilai(getBooleanFilteredNilai(null));
                    setDapatDiulang('');
                    setOnTarget('');
                }

                const handleApplyFilter = async (e) => {
                    e.preventDefault();

                    // Validate Here, if ErrorValidate then setErrorMessage, if ErrorCookies then router.refresh()
                    try {
                        var validatedData = await validateForm();
                        if (!validatedData) { return }
                        context.handleModalClose();
                        context.data.setColumnFilters(validatedData);
                        context.data.setPageIndex(true);
                        toast.success('Filter berhasil diterapkan', { position: 'top-left', duration: 4000 });
                    } catch (error) {
                        context.handleModalClose();
                        console.error(error.message || 'Terjadi kesalahan');
                        toast.error('Terjadi kesalahan, silahkan coba lagi', { position: 'top-left', duration: 4000 });
                        router.refresh();
                        return;
                    }
                }

                return (
                    <Backdrop>
                        <Layout
                            as={'form'}
                            onSubmit={handleApplyFilter}
                            onEsc={true}
                            onEnter={(e, isLayout) => { if (isLayout && editFilter) handleApplyFilter(e) }}
                            style={editFilter ? {
                                gridTemplateRows: '30px auto 100px',
                                overflow: 'hidden'
                            } : {}}
                            className={`${styles.tabel__filter}`}
                        >
                            <Head title={editFilter ? 'Atur Filter' : 'Filter Tabel'} />

                            <Inner>
                                <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--danger-color)' }}>
                                    {errorMessage}
                                </div>

                                <div className={styles.ftmn}>
                                    <div className={styles.form__input_field}>
                                        <div>
                                            <input
                                                type="text"
                                                id="nama"
                                                maxLength="50"
                                                placeholder=" "
                                                className={`${styles.form__input} ${styles.max_length}`}
                                                value={editFilter ? nama : context?.data?.currentFilters?.matakuliah || ''}
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

                                <div className={styles.ftmss}>
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
                                                    value={editFilter ? sksMin : context?.data?.currentFilters?.sks[0] || ''}
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
                                                    value={editFilter ? sksMaks : context?.data?.currentFilters?.sks[1] || ''}
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
                                                    value={editFilter ? semesterMin : context?.data?.currentFilters?.semester[0] || ''}
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
                                                    value={editFilter ? semesterMaks : context?.data?.currentFilters?.semester[1] || ''}
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

                                <div className={styles.ftmntb}>
                                    <div className={styles.form__input_field}>
                                        <select
                                            id="dapatDiulang"
                                            className={`${styles.form__select} ${editFilter ? dapatDiulang ? styles.filled : '' : context?.data?.currentFilters?.diulang ? styles.filled : ''}`}
                                            value={editFilter ? dapatDiulang : context?.data?.currentFilters?.diulang || ''}
                                            onChange={(e) => { setDapatDiulang(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
                                            disabled={!editFilter}
                                            style={editFilter ? {} : { cursor: 'auto' }}
                                        >
                                            <option value={''} disabled hidden></option>
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
                                    <div className={styles.form__input_field}>
                                        <select
                                            id="onTarget"
                                            className={`${styles.form__select} ${editFilter ? onTarget ? styles.filled : '' : context?.data?.currentFilters?.ontarget ? styles.filled : ''}`}
                                            value={editFilter ? onTarget : context?.data?.currentFilters?.ontarget || ''}
                                            onChange={(e) => { setOnTarget(e.target.value) }}
                                            onFocus={() => { setErrorMessage('') }}
                                            disabled={!editFilter}
                                            style={editFilter ? {} : { cursor: 'auto' }}
                                        >
                                            <option value={''} disabled hidden></option>
                                            <option value={-1}>Semua</option>
                                            <option value={'ya'}>Ya</option>
                                            <option value={'tidak'}>Tidak</option>
                                        </select>

                                        <label
                                            htmlFor="onTarget"
                                            className={styles.form__label}
                                        >
                                            On Target
                                        </label>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.25rem' }} className={styles.ftmn}>
                                    <div>
                                        <h3 style={{ marginBottom: '.5rem' }} className={styles.tabel__filter_title}>Nilai</h3>
                                        <div className={styles.tabel__filter_check}>
                                            {penilaianKey.map((key, index) => {
                                                const type = editFilter ? penilaian[key]?.style ?? 'primary' : 'disabled';
                                                return (
                                                    <span
                                                        tabIndex={editFilter ? '0' : '-1'}
                                                        onClick={editFilter ? (event) => {
                                                            event.target.blur();
                                                            const updatedState = filteredNilai.map((item, i) => (i === index ? !item : item));
                                                            setFilteredNilai(updatedState);
                                                        } : null}
                                                        onKeyDown={editFilter ? (event) => {
                                                            if (event.key === 'Enter') {
                                                                const updatedState = filteredNilai.map((item, i) => (i === index ? !item : item));
                                                                setFilteredNilai(updatedState);
                                                            }
                                                        } : null}
                                                        className={`${styles.item} ${styles[type]} ${filteredNilai[index] ? styles.active : ''}`} key={key}
                                                    >
                                                        {key}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.ftmn}>
                                    <div>
                                        <h3 style={{ marginBottom: '.5rem' }} className={styles.tabel__filter_title}>Target Nilai</h3>
                                        <div className={styles.tabel__filter_check}>
                                            {penilaianKey.map((key, index) => {
                                                const type = editFilter ? penilaian[key]?.style ?? 'primary' : 'disabled';
                                                return (
                                                    <span
                                                        tabIndex={editFilter ? '0' : '-1'}
                                                        onClick={editFilter ? (event) => {
                                                            event.target.blur();
                                                            const updatedState = filteredTargetNilai.map((item, i) => (i === index ? !item : item));
                                                            setFilteredTargetNilai(updatedState);
                                                        } : null}
                                                        onKeyDown={editFilter ? (event) => {
                                                            if (event.key === 'Enter') {
                                                                const updatedState = filteredTargetNilai.map((item, i) => (i === index ? !item : item));
                                                                setFilteredTargetNilai(updatedState);
                                                            }
                                                        } : null}
                                                        className={`${styles.item} ${styles[type]} ${filteredTargetNilai[index] ? styles.active : ''}`} key={key}
                                                    >
                                                        {key}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </Inner>

                            {editFilter ?
                                <div className={styles.form__action}>
                                    <div className={styles.gtc_repeat2_1fr} style={{ height: '100%' }}>
                                        <Button
                                            title='Reset'
                                            action={handleResetFilter}
                                            className={`${styles.btn} ${styles.confirm} ${styles.reset}`}
                                            style={{ marginTop: '0' }}
                                        />
                                        <button type='submit' className={styles.btn}>
                                            <h3>Simpan</h3>
                                        </button>
                                    </div>

                                    <Button
                                        title='Batalkan'
                                        action={toggleEditFilter}
                                        className={`${styles.btn} ${styles.cancel}`}
                                        style={{ marginTop: '.75rem' }}
                                    />
                                </div>
                                :
                                <div className={styles.form__action} >
                                    <Button
                                        title='Atur Filter'
                                        action={toggleEditFilter}
                                        className={styles.btn}
                                    />
                                </div>
                            }
                        </Layout>
                    </Backdrop>
                )
            }
            }
        </ModalContext.Consumer>
    )
}

export default TabelFilter;