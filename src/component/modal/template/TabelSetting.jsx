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
import { Backdrop, Layout, Head, Button, Inner } from '@/component/modal/components';
// #endregion

// #region UTIL DEPEDENCY
import { getLoadingMessage, fetchWithAuth } from '@/utils/client_side';
import { handleApiResponseError } from '@/component/modal/utils';
// #endregion

// #region ICON DEPEDENCY
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { AiOutlineDrag } from "react-icons/ai";
import {
    IoCaretForward,
    IoCaretBack,
    IoPlayForward,
    IoPlayBack,
} from "react-icons/io5";
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css'
// #endregion

/** 
 * @typedef {Object} TabelSettingModalData
 * Data yang digunakan pada modal {@link TabelSetting}
 * @property {(pageSize:import('@/types/supabase').UserData['preferences']['table']['size']) => void} setPageSize
 * Method untuk mengatur table `size`
 * @property {(columnOrder:import('@/types/supabase').UserData['preferences']['table']['columnOrder']) => void} setColumnOrder
 * Method untuk mengatur table `columnOrder`
 * @property {(controlPosition:import('@/types/supabase').UserData['preferences']['table']['controlPosition']) => void} setPageControlPosition
 * Method untuk mengatur table `controlPosition`
 * @property {(columnVisibility:import('@/types/supabase').UserData['preferences']['table']['columnVisibility']) => void} setColumnVisibility
 * Method untuk mengatur table `columnVisibility`
 * @property {Pick<import('@/types/supabase').UserData['preferences']['table'], 'size' | 'controlPosition'> & {state:Array<{title:import('@/types/table_matakuliah').ColumnTitle, id:import('@/types/table_matakuliah').ColumnId, visible:boolean}>}} table
 * Current table state. Props `state` merepresentasikan `columnOrder` dan `columnVisibility`
 */
const TabelSetting = () => {
    const router = useRouter();
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    const [editTabelSetting, setEditTabelSetting] = React.useState(false);
    const [pageSize, setPageSize] = React.useState(5);
    const [activeId, setActiveId] = React.useState('');
    const [controlPosition, setControlPosition] = React.useState(0);
    const [columnState, setColumnState] = React.useState([
        { title: 'Nomor', id: 'nomor', visible: true },
        { title: 'Matakuliah', id: 'matakuliah', visible: true },
        { title: 'Semester', id: 'semester', visible: true },
        { title: 'Sks', id: 'sks', visible: true },
        { title: 'Nilai', id: 'nilai', visible: true },
        { title: 'Bisa Diulang', id: 'diulang', visible: true },
        { title: 'Target Nilai', id: 'target', visible: true },
        { title: 'On Target', id: 'ontarget', visible: true },
    ]);
    const [errorMessage, setErrorMessage] = React.useState('');

    const dragItem = React.useRef(0);
    const draggedOverItem = React.useRef(0);

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
            {/** @param {import('@/types/context').ModalContext<TabelSettingModalData>} context */ context => {
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
                                if (!accessToken || !userIdCookie) {
                                    router.refresh();
                                    throw new Error('Terjadi kesalahan, silahkan coba lagi');
                                }

                                const response = await fetchWithAuth('PATCH', 'me', accessToken, validatedData, { type: 'preferences' });

                                if (!response.ok) {
                                    const { toastMessage, refresh, navigate } = await handleApiResponseError(response);
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
                            onSubmit={handleSubmitSetting}
                            onEsc={true}
                            onEnter={(e, isLayout) => { if (isLayout && editTabelSetting) handleSubmitSetting(e) }}
                            className={`${styles.tabel__setting}`}
                        >
                            <Head title={editTabelSetting ? 'Atur Tabel' : 'Pengaturan Tabel'} />

                            <Inner>
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
                                                    tabIndex={editTabelSetting ? '0' : '-1'}
                                                    className={`${styles.eye} ${item.visible ? '' : styles.hide}`}
                                                    onClick={editTabelSetting ? (event) => {
                                                        event.target.blur();
                                                        context.data.setColumnVisibility(handleToggleVisibility(item.id))
                                                    } : null}
                                                    onKeyDown={editTabelSetting ? (event) => {
                                                        if (event.key === 'Enter') {
                                                            context.data.setColumnVisibility(handleToggleVisibility(item.id))
                                                        }
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
                            </Inner>

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
                                        <Button
                                            title='Batalkan'
                                            action={toggleEditTabelSetting}
                                            className={`${styles.btn} ${styles.cancel}`}
                                            style={{ marginTop: '0' }}
                                        />
                                        <button type='submit' className={styles.btn}>
                                            <h3>Simpan</h3>
                                        </button>
                                    </>
                                    :
                                    <Button
                                        title='Atur Tabel'
                                        action={toggleEditTabelSetting}
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

export default TabelSetting;