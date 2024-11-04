'use client'

// ========== TYPE DEPEDENCY ========== //
import * as ContextTypes from '../types/context.js'

// ========== NEXT DEPEDENCY ========== //
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// ========== REACT DEPEDENCY ========== //
import { useContext, useEffect, useState, useRef, useMemo } from 'react';

// ========== COMPONENT DEPEDENCY ========== //
import { mutate } from 'swr';
import { useCookies } from 'next-client-cookies';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'
import toast from 'react-hot-toast';
import { ModalContext } from "./provider/Modal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Spinner } from "./loader/Loading";

// ========== UTIL DEPEDENCY ========== //
import { getLoadingMessage, getSessionTable, unixToDate } from '@/utils/client_side';

// ========== STYLE DEPEDENCY ========== //
import styles from './style/table.module.css'
import "react-loading-skeleton/dist/skeleton.css";

// ========== ICON DEPEDENCY ========== //
import {
    IoSearchCircle,
    IoAdd,
    IoSettingsOutline,
    IoFilter,
    IoClose,
    IoCheckmark,
    IoCaretForward,
    IoCaretBack,
    IoPlayForward,
    IoPlayBack,
    IoArrowDownSharp,
    IoArrowUpSharp
} from "react-icons/io5";
import { FaInfo, FaPen, FaTrash, FaAngleLeft, FaUndo } from "react-icons/fa";

/*
============================== CODE START HERE ==============================
*/

export function Table({ state, validating, user, sessionTable, matkul, matkulHistory, penilaian }) {
    const router = useRouter();
    const userIdCookie = useCookies().get('s_user_id');
    const accessToken = useCookies().get('s_access_token');
    const handleRetry = () => {
        mutate(['/api/me', userIdCookie])
        mutate(['/api/matkul', userIdCookie])
        mutate(['/api/matkul-history', userIdCookie])
        // Mutate universitas
    }

    const SkeletonTable = () => {
        const tableLoadingImg = <Image src="/table_loading.svg" width={100} height={100} alt="Table Loading" />;

        return (
            <div className={`${styles.container}`}>
                <div className={styles.tools}>
                    <div className={`${styles.tools__tabs} ${styles.skeleton}`}>
                        {['134px', '70px', '55px'].map((item, index) => (
                            <div style={{ minWidth: item }} className={`${styles.btn} ${styles.skeleton}`} key={crypto.randomUUID()}>
                                <SkeletonTheme
                                    baseColor="var(--skeleton-base)"
                                    highlightColor="var(--skeleton-highlight)"
                                >
                                    <Skeleton width={"100%"} height={"100%"} borderRadius={"35px"} />
                                </SkeletonTheme>
                            </div>
                        ))}
                    </div>
                    <div className={styles.tools__right}>
                        <div className={styles.tools__search}>
                            <div className={`${styles.search} ${styles.skeleton}`}>
                                <SkeletonTheme
                                    baseColor="var(--skeleton-base)"
                                    highlightColor="var(--skeleton-highlight)"
                                >
                                    <Skeleton width={"100%"} height={"100%"} borderRadius={"35px"} />
                                </SkeletonTheme>
                            </div>
                        </div>
                        <div className={styles.tools__shorcut}>
                            {Array.from({ length: 3 }, (_, index) => (
                                <SkeletonTheme
                                    baseColor="var(--skeleton-base)"
                                    highlightColor="var(--skeleton-highlight)"
                                    key={crypto.randomUUID()}
                                >
                                    <Skeleton width={"100%"} height={"100%"} borderRadius={"2rem"} />
                                </SkeletonTheme>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.loading}>
                    <div className={styles.image}>{tableLoadingImg}</div>
                    <h5 className={styles.loading__dots}>Memuat Tabel</h5>
                </div>
            </div>
        )
    }

    const LoadedTable = () => {
        const initialRender = useRef(true);
        const [activeTab, setActiveTab] = useState(sessionTable?.tab ?? 0);
        const [data, setData] = useState(() => {
            if (activeTab === 1) {
                return matkulHistory.length ?
                    matkulHistory
                        .filter(history => history.current.type === 'hapus')
                        .map(matkulDihapus => ({
                            id: matkulDihapus.matkul_id,
                            nama: matkulDihapus.current.nama,
                            semester: matkulDihapus.current.semester,
                            sks: matkulDihapus.current.sks,
                            nilai: matkulDihapus.current.nilai,
                            dapat_diulang: matkulDihapus.current.dapat_diulang,
                            target_nilai: matkulDihapus.current.target_nilai,
                        }))
                    : [];
            } else if (activeTab === 2) {
                return matkulHistory.length ?
                    matkulHistory
                        .filter(history => history.current.type === 'ubah')
                        .map(matkulDiubah => ({
                            id: matkulDiubah.matkul_id,
                            nama: matkulDiubah.current.nama,
                            semester: matkulDiubah.current.semester,
                            sks: matkulDiubah.current.sks,
                            nilai: matkulDiubah.current.nilai,
                            dapat_diulang: matkulDiubah.current.dapat_diulang,
                            target_nilai: matkulDiubah.current.target_nilai,
                        }))
                    : [];
            } else {
                return matkul;
            }
        });
        const [isValidating, setIsValidating] = useState(validating);
        const [columnVisibility, setColumnVisibility] = useState(sessionTable?.columnVisibility ?? user?.preferences?.table?.columnVisibility ?? {
            nomor: true, matakuliah: true, semester: true, sks: true, nilai: true, diulang: true, target: true, ontarget: true
        });
        const [columnFilters, setColumnFilters] = useState(sessionTable?.columnFilters ?? []);
        const [columnOrder, setColumnOrder] = useState(sessionTable?.columnOrder ?? user?.preferences?.table?.columnOrder ?? [
            'nomor', 'matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target', 'ontarget'
        ]);
        const [pageControlPosition, setPageControlPosition] = useState(sessionTable?.pageControlPosition ?? user?.preferences?.table?.controlPosition ?? 0);
        const [rowAction, setRowAction] = useState(sessionTable?.rowAction ?? true);
        const [pagesIndex, setPagesIndex] = useState(sessionTable?.pageIndex ? sessionTable.pageIndex + 1 : 1);
        /** @type {ContextTypes.ModalContext} */
        const {
            setModal,
            setActive,
            setData: setModalData
        } = useContext(ModalContext);

        const tableEmptyImg = <Image src="/table_kosong.svg" width={100} height={100} alt="Table Empty" />;

        const pageControlCSS = [
            styles.page_control_bottom,
            styles.page_control_top,
            styles.page_control_both
        ]

        const handleAllMatakuliahTab = () => {
            setActiveTab(0);
            setData(matkul);
            table.setPageIndex(0);
            setPagesIndex(1);
        }

        const handleDeletedMatakuliahTab = () => {
            const historyHapus = matkulHistory.length ?
                matkulHistory
                    .filter(history => history.current.type === 'hapus')
                    .map(matkulDihapus => ({
                        id: matkulDihapus.matkul_id,
                        nama: matkulDihapus.current.nama,
                        semester: matkulDihapus.current.semester,
                        sks: matkulDihapus.current.sks,
                        nilai: matkulDihapus.current.nilai,
                        dapat_diulang: matkulDihapus.current.dapat_diulang,
                        target_nilai: matkulDihapus.current.target_nilai,
                    }))
                : [];
            setActiveTab(1);
            setData(historyHapus);
            table.setPageIndex(0);
            setPagesIndex(1);
        }

        const handleEditedMatakuliahTab = () => {
            const historyEdit = matkulHistory.length ?
                matkulHistory
                    .filter(history => history.current.type === 'ubah')
                    .map(matkulDiubah => ({
                        id: matkulDiubah.matkul_id,
                        nama: matkulDiubah.current.nama,
                        semester: matkulDiubah.current.semester,
                        sks: matkulDiubah.current.sks,
                        nilai: matkulDiubah.current.nilai,
                        dapat_diulang: matkulDiubah.current.dapat_diulang,
                        target_nilai: matkulDiubah.current.target_nilai,
                    }))
                : [];
            setActiveTab(2);
            setData(historyEdit);
            table.setPageIndex(0);
            setPagesIndex(1);
        }

        const columnHelper = createColumnHelper();
        const columns = useMemo(
            () => [
                columnHelper.accessor('id', {
                    id: 'nomor',
                    cell: info => info.row.index + 1,
                    header: () => <span>#</span>,
                    footer: info => info.column.id,
                    sortingFn: (x, y) => {
                        return x.index > y.index ? -1 : x.index < y.index ? 1 : 0
                    }
                }),
                columnHelper.accessor('nama', {
                    id: 'matakuliah',
                    cell: info => info.getValue(),
                    header: () => <span>Matakuliah</span>,
                    footer: info => info.column.id,
                    invertSorting: true,
                }),
                columnHelper.accessor(row => row.semester, {
                    id: 'semester',
                    cell: info => info.getValue(),
                    header: () => <span>Semester</span>,
                    footer: info => info.column.id,
                    invertSorting: true,
                }),
                columnHelper.accessor('sks', {
                    id: 'sks',
                    cell: info => info.getValue(),
                    header: () => <span>Sks</span>,
                    footer: info => info.column.id,
                    invertSorting: true,
                }),
                columnHelper.accessor(row => row.nilai.indeks, {
                    id: 'nilai',
                    cell: info => info.getValue(),
                    header: () => <span>Nilai</span>,
                    footer: info => info.column.id,
                    filterFn: (x, columnId, filterValue) => {
                        const val = x.getValue(columnId);
                        return filterValue.includes(val);
                    },
                    sortingFn: (x, y, columnId) => {
                        const xVal = penilaian?.[x.getValue(columnId)]?.weight;
                        const yVal = penilaian?.[y.getValue(columnId)]?.weight;

                        if (!xVal || !yVal) { return 0 }
                        return xVal > yVal ? -1 : yVal > xVal ? 1 : 0;
                    },
                }),
                columnHelper.accessor(row => row.dapat_diulang, {
                    id: 'diulang',
                    cell: info => info.getValue() ? <IoCheckmark size={'15px'} color={'var(--success-color)'} /> : <IoClose size={'15px'} color={'var(--danger-color)'} />,
                    header: () => <span>Bisa Diulang</span>,
                    footer: info => info.column.id,
                    invertSorting: true,
                }),
                columnHelper.accessor(row => row.target_nilai.indeks, {
                    id: 'target',
                    cell: info => info.getValue(),
                    header: () => <span>Target Nilai</span>,
                    filterFn: (x, columnId, filterValue) => {
                        const val = x.getValue(columnId);
                        return filterValue.includes(val);
                    },
                    sortingFn: (x, y, columnId) => {
                        const xVal = penilaian?.[x.getValue(columnId)]?.weight;
                        const yVal = penilaian?.[y.getValue(columnId)]?.weight;

                        if (!xVal || !yVal) { return 0 }
                        return xVal > yVal ? -1 : yVal > xVal ? 1 : 0;
                    },
                }),
                columnHelper.accessor(row => row.nilai.bobot >= row.target_nilai.bobot, {
                    id: 'ontarget',
                    cell: info => info.getValue() ? <IoCheckmark size={'15px'} color={'var(--success-color)'} /> : <IoClose size={'15px'} color={'var(--danger-color)'} />,
                    header: () => <span>On Target</span>,
                    invertSorting: true,
                }),
            ],
            []
        )

        const table = useReactTable({
            data,
            columns,
            initialState: {
                sorting: sessionTable.columnSorting ?? [],
                pagination: {
                    pageIndex: sessionTable.pageIndex ?? 0,
                    pageSize:
                        (sessionTable.pageSize ?? user?.preferences?.table?.size) === -1
                            ? matkul.length + 1
                            : (sessionTable.pageSize ?? user?.preferences?.table?.size) ?? 5,
                }
            },
            state: {
                columnFilters,
                columnOrder,
                columnVisibility,
            },
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            onColumnFiltersChange: setColumnFilters,
            onColumnVisibilityChange: setColumnVisibility,
            onColumnOrderChange: setColumnOrder,
            autoResetAll: false,
            // debugAll: true,
        })

        const setPageSize = (size) => {
            if (size === -1) {
                table.setPageSize(matkul.length + 1);
            } else {
                table.setPageSize(size);
            }
        }

        const setPageIndex = (reset = false, index) => {
            if (reset) { table.setPageIndex(0); setPagesIndex(1); }
            else { table.setPageIndex(index); setPagesIndex(index + 1) }
        }

        const getTablePreferences = () => {
            const currentPageSize = table.getState().pagination.pageSize;
            const titleKey = {
                nomor: "Nomor", matakuliah: "Matakuliah", semester: "Semester", sks: "Sks", nilai: "Nilai", diulang: "Bisa Diulang", target: "Target Nilai", ontarget: "On Target"
            }
            const columnState = columnOrder.map((id, index) => {
                const title = titleKey[id];
                const visible = columnVisibility[id];
                return { title, id, visible };
            })
            return { size: currentPageSize === matkul.length + 1 ? -1 : currentPageSize, controlPosition: pageControlPosition, state: columnState };
        }

        const getTableFilters = () => {
            const searchId = ['matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target', 'ontarget'];
            const result = {};
            searchId.forEach((id) => {
                const item = columnFilters.find((item) => item.id === id);
                if (id === 'diulang' || id === 'ontarget') {
                    result[id] = item ? item.value ? 'ya' : 'tidak' : '';
                } else {
                    result[id] = item ? item.value : '';
                }
            })
            return result;
        }

        const getCreatedAtById = (id) => {
            const item = matkul.find(entry => entry.id === id);
            return item ? item.created_at ? item.created_at : null : null;
        }

        const getUpdatedAtById = (id) => {
            const item = matkul.find(entry => entry.id === id);
            return item ? item.updated_at ? item.updated_at : null : null;
        }

        const getRefId = (matkulId) => {
            const item = matkulHistory.find(entry => entry.matkul_id === matkulId);
            return item ? item.id ? item.id : null : null;
        }

        const getRef = (matkulId) => {
            const item = matkulHistory.find(entry => entry.matkul_id === matkulId);
            return item ? { ...item, fromTabel: true } : null;
        }

        const isSearchActive = () => {
            return columnFilters.some(filter => filter.id === 'matakuliah');
        };

        const isTableFiltered = () => {
            return columnFilters.length > 0;
        }

        const handleHapusMatakuliah = async (e, matkulId, matkulNama) => {
            e.preventDefault();

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
                        if (!matkulId) {
                            router.refresh();
                            throw new Error('Terjadi kesalahan, silahkan coba lagi');
                        }
                        if (!matkulNama) {
                            router.refresh();
                            throw new Error('Terjadi kesalahan, silahkan coba lagi');
                        }

                        const response = await fetch(`/api/matkul?id=${matkulId}`, {
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
                                            const filteredMatkul = currentMatkul.filter(matkul => matkul.id !== `${matkulId}`);
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
                                            return [...filteredRef, ref];
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
                    } catch (error) { reject(error) }
                })
            }

            toast.promise(
                deleteMatkul(),
                {
                    loading: `${getLoadingMessage(false, 0)} matakuliah`,
                    success: `${matkulNama ?? 'Matakuliah'} berhasil dihapus`,
                    error: (error) => `${error.message || 'Terjadi kesalahan'}`
                },
                {
                    position: 'top-left',
                    duration: 4000,
                }
            )
        }

        const handleTambahModal = () => {
            if (!penilaian) { return; }
            setModalData({ penilaian });
            setModal('tambahMatkul');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        const handleHapusPermanentModal = (item) => {
            setModalData(item);
            setModal('hapusPermanentConfirm');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        const handleDetailModal = (item, edit = false) => {
            if (!penilaian) { return; }
            setModalData({ penilaian, ...item, edit });
            setModal('detailMatkul');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        const handleUndoModal = (matkulId) => {
            const ref = getRef(matkulId);
            setModalData(ref);
            setModal('perubahanTerakhirDetail');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        const handleUndoConfirmModal = (matkulId) => {
            const ref = getRef(matkulId);
            setModalData(ref);
            setModal('perubahanTerakhirConfirm');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        const handleSettingModal = () => {
            setModalData({ setPageSize, setColumnOrder, setPageControlPosition, setColumnVisibility, table: getTablePreferences() });
            setModal('tabelSetting');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        const handleFilterModal = () => {
            setModalData({ setPageIndex, setColumnFilters, currentFilters: getTableFilters(), penilaian });
            setModal('tabelFilter');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        useEffect(() => {
            function applyTableState() {
                const { columnFilters } = getSessionTable();
                if (columnFilters) {
                    setColumnFilters(columnFilters);
                }
            }

            window.addEventListener('on-table-session-changes', applyTableState);

            return () => {
                window.removeEventListener('on-table-session-changes', applyTableState);
            }
        }, [])

        useEffect(() => {
            if (initialRender.current) {
                initialRender.current = false;
                return;
            }

            const currentPageSize = table.getState().pagination.pageSize;
            const currentState = {
                tab: activeTab,
                pageSize: currentPageSize === matkul.length + 1 ? -1 : currentPageSize,
                pageIndex: table.getState().pagination.pageIndex,
                pageControlPosition,
                columnOrder,
                columnVisibility,
                columnFilters,
                columnSorting: table.getState().sorting,
                rowAction
            }
            sessionStorage.setItem('_table', JSON.stringify(currentState));
        }, [activeTab, columnOrder, columnVisibility, columnFilters, pageControlPosition, rowAction, table.getState().pagination.pageSize, table.getState().pagination.pageIndex, table.getState().sorting])

        return (
            <div className={`${styles.container} ${pageControlCSS[pageControlPosition]}`}>
                <div className={`${styles.validating} ${isValidating ? '' : styles.hide}`}>
                    <Spinner size={'35px'} color={'var(--logo-second-color)'} />
                </div>
                <div className={styles.tools}>
                    <div className={styles.tools__tabs}>
                        <div
                            className={`${styles.btn} ${activeTab === 0 ? styles.active : ''}`}
                            onClick={activeTab !== 0 ? () => handleAllMatakuliahTab() : null}
                        >
                            Semua Matakuliah
                        </div>
                        <div
                            className={`${styles.btn} ${activeTab === 1 ? styles.active : ''}`}
                            onClick={activeTab !== 1 ? () => handleDeletedMatakuliahTab() : null}
                        >
                            Dihapus
                        </div>
                        <div
                            className={`${styles.btn} ${activeTab === 2 ? styles.active : ''}`}
                            onClick={activeTab !== 2 ? () => handleEditedMatakuliahTab() : null}
                        >
                            Diedit
                        </div>
                    </div>
                    <div className={styles.tools__right}>
                        <div className={styles.tools__search}>
                            <CariMatakuliah initValue={table.getColumn('matakuliah').getFilterValue()} column={table.getColumn('matakuliah')} table={table} isSearchActive={isSearchActive} setPagesIndex={setPagesIndex} />
                        </div>
                        <div className={styles.tools__shorcut}>
                            <div className={styles.tools__shorcut_box} onClick={() => { handleTambahModal() }}>
                                <IoAdd size={'22px'} />
                            </div>
                            <div className={styles.tools__shorcut_box} onClick={() => { handleSettingModal() }}>
                                <IoSettingsOutline size={'18px'} />
                            </div>
                            <div className={`${styles.tools__shorcut_box} ${isTableFiltered() ? styles.active : ''}`} onClick={() => { handleFilterModal() }}>
                                <IoFilter size={'20px'} />
                            </div>
                        </div>
                    </div>
                </div>

                {data.length ?
                    <>
                        <div className={styles.pagination}>
                            <div className={styles.pagination__pages}>
                                <div className={styles.pagination__pages_number}>
                                    <select
                                        value={table.getState().pagination.pageSize}
                                        onChange={e => {
                                            table.setPageSize(Number(e.target.value))
                                        }}
                                    >
                                        {[5, 10, 25, 50, 100, matkul.length + 1].map((pageSize, index) => (
                                            <option key={crypto.randomUUID()} value={pageSize}>
                                                {index === 5 ? 'Semua' : pageSize}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.pagination__pages_details}>
                                    Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                                </div>
                            </div>
                            <div className={styles.pagination__control}>
                                <div
                                    onClick={table.getCanPreviousPage() ? () => { table.setPageIndex(0); setPagesIndex(1); } : null}
                                    className={`${styles.pagination__navs} ${!table.getCanPreviousPage() ? styles.disabled : ''}`}
                                >
                                    <IoPlayBack size={'16px'} />
                                </div>
                                <div
                                    onClick={table.getCanPreviousPage() ? () => { table.previousPage(); setPagesIndex(prev => prev - 1) } : null}
                                    className={`${styles.pagination__navs} ${!table.getCanPreviousPage() ? styles.disabled : ''}`}
                                >
                                    <IoCaretBack size={'16px'} />
                                </div>
                                <div className={styles.pagination__input}>
                                    <input
                                        type="number"
                                        value={pagesIndex}
                                        onChange={e => {
                                            if (e.target.value) {
                                                const page = Number(e.target.value) - 1;
                                                table.setPageIndex(page)
                                                setPagesIndex(page + 1);
                                            } else {
                                                setPagesIndex(e.target.value);
                                            }
                                        }}
                                        onBlur={() => { if (!pagesIndex) { setPagesIndex(table.getState().pagination.pageIndex + 1) } }}
                                    />
                                </div>
                                <div
                                    onClick={table.getCanNextPage() ? () => { table.nextPage(); setPagesIndex(prev => prev + 1); } : null}
                                    className={`${styles.pagination__navs} ${!table.getCanNextPage() ? styles.disabled : ''}`}
                                >
                                    <IoCaretForward size={'16px'} />
                                </div>
                                <div
                                    onClick={table.getCanNextPage() ? () => { table.setPageIndex(table.getPageCount() - 1); setPagesIndex(table.getPageCount()) } : null}
                                    className={`${styles.pagination__navs} ${!table.getCanNextPage() ? styles.disabled : ''}`}
                                >
                                    <IoPlayForward size={'16px'} />
                                </div>
                            </div>
                            <div className={styles.pagination__control_details}>
                                Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                            </div>
                        </div>

                        <div className={`${styles.data}`}
                        >
                            <table>
                                <thead>
                                    {table.getHeaderGroups().map(headerGroup => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map(header => (
                                                <th key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : (
                                                            <div
                                                            >
                                                                <span
                                                                    className={`${styles.head} ${header.column.getIsSorted() ? styles.sorted : ''}`}
                                                                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'auto' }}
                                                                    onClick={header.column.getToggleSortingHandler()}
                                                                >
                                                                    {flexRender(
                                                                        header.column.columnDef.header,
                                                                        header.getContext()
                                                                    )}
                                                                    {{
                                                                        asc: header.column.id === 'diulang' || header.column.id === 'ontarget' ? <IoCheckmark /> : <IoArrowDownSharp />,
                                                                        desc: header.column.id === 'diulang' || header.column.id === 'ontarget' ? <IoClose /> : <IoArrowUpSharp />,
                                                                    }[header.column.getIsSorted()] ?? null}
                                                                </span>
                                                            </div>
                                                        )}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody>
                                    {table.getRowModel().rows.map(row => (
                                        <tr
                                            onClick={(e) => {
                                                if (!e.target.closest(`.${styles.action}`)) {
                                                    if (activeTab === 0) {
                                                        const createdAt = getCreatedAtById(row.getValue('nomor'));
                                                        const updatedAt = getUpdatedAtById(row.getValue('nomor'));
                                                        const itemData = {
                                                            id: row.getValue('nomor'),
                                                            nama: row.getValue('matakuliah'),
                                                            sks: `${row.getValue('sks')}`,
                                                            nilai: `${row.getValue('nilai')}`,
                                                            semester: `${row.getValue('semester')}`,
                                                            diulang: row.getValue('diulang') ? 'ya' : 'tidak',
                                                            target: row.getValue('target'),
                                                            dibuat: createdAt ? unixToDate(createdAt, null, { dateStyle: 'full', timeStyle: 'medium' }) : '-',
                                                            diedit: updatedAt ? unixToDate(updatedAt, null, { dateStyle: 'full', timeStyle: 'medium' }) : '-',
                                                        }
                                                        handleDetailModal(itemData, false)
                                                    } else {
                                                        handleUndoModal(row.getValue('nomor'));
                                                    }
                                                }
                                            }}
                                            key={row.id}
                                        >
                                            {row.getVisibleCells().map(cell => {
                                                const cellType = cell.id.split('_')[1];
                                                const isNilaiCell = cellType === 'nilai';
                                                const isTargetCell = cellType === 'target';
                                                const nilaiColor = isNilaiCell || isTargetCell ? penilaian[`${cell.getValue()}`]?.style : '';

                                                return (
                                                    <td
                                                        key={cell.id}
                                                        className={`${styles[cellType]}`}
                                                        {...isNilaiCell || isTargetCell ? { style: { color: nilaiColor ? `var(--${nilaiColor}-color)` : '' } } : {}}
                                                    >
                                                        <span
                                                            {...isNilaiCell || isTargetCell ? {
                                                                style:
                                                                {
                                                                    display: 'inline-block',
                                                                    fontWeight: '500',
                                                                    lineHeight: '28px',
                                                                    minWidth: '28px',
                                                                    minHeight: '28px',
                                                                    background: nilaiColor ? `var(--box-color-${nilaiColor})` : 'var(--box-color-bg2)',
                                                                    borderRadius: '50%'
                                                                }
                                                            } :
                                                                {}}
                                                        >
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </span>
                                                    </td>
                                                )
                                            })}
                                            {row.getVisibleCells().length ?
                                                <RowAction
                                                    activeTab={activeTab}
                                                    row={row}
                                                    rowAction={rowAction}
                                                    setRowAction={setRowAction}
                                                    handleHapusMatakuliah={handleHapusMatakuliah}
                                                    handleDetailModal={handleDetailModal}
                                                    handleUndoModal={handleUndoModal}
                                                    handleUndoConfirmModal={handleUndoConfirmModal}
                                                    handleHapusPermanentModal={handleHapusPermanentModal}
                                                    getCreatedAtById={getCreatedAtById}
                                                    getUpdatedAtById={getUpdatedAtById}
                                                    getRefId={getRefId}
                                                />
                                                :
                                                <>
                                                </>
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles.pagination}>
                            <div className={styles.pagination__pages}>
                                <div className={styles.pagination__pages_number}>
                                    <select
                                        value={table.getState().pagination.pageSize}
                                        onChange={e => {
                                            table.setPageSize(Number(e.target.value))
                                        }}
                                    >
                                        {[5, 10, 25, 50, 100, matkul.length + 1].map((pageSize, index) => (
                                            <option key={crypto.randomUUID()} value={pageSize}>
                                                {index === 5 ? 'Semua' : pageSize}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.pagination__pages_details}>
                                    Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                                </div>
                            </div>
                            <div className={styles.pagination__control}>
                                <div
                                    onClick={table.getCanPreviousPage() ? () => { table.setPageIndex(0); setPagesIndex(1); } : null}
                                    className={`${styles.pagination__navs} ${!table.getCanPreviousPage() ? styles.disabled : ''}`}
                                >
                                    <IoPlayBack size={'16px'} />
                                </div>
                                <div
                                    onClick={table.getCanPreviousPage() ? () => { table.previousPage(); setPagesIndex(prev => prev - 1) } : null}
                                    className={`${styles.pagination__navs} ${!table.getCanPreviousPage() ? styles.disabled : ''}`}
                                >
                                    <IoCaretBack size={'16px'} />
                                </div>
                                <div className={styles.pagination__input}>
                                    <input
                                        type="number"
                                        value={pagesIndex}
                                        onChange={e => {
                                            if (e.target.value) {
                                                const page = Number(e.target.value) - 1;
                                                table.setPageIndex(page)
                                                setPagesIndex(page + 1);
                                            } else {
                                                setPagesIndex(e.target.value);
                                            }
                                        }}
                                        onBlur={() => { if (!pagesIndex) { setPagesIndex(table.getState().pagination.pageIndex + 1) } }}
                                    />
                                </div>
                                <div
                                    onClick={table.getCanNextPage() ? () => { table.nextPage(); setPagesIndex(prev => prev + 1); } : null}
                                    className={`${styles.pagination__navs} ${!table.getCanNextPage() ? styles.disabled : ''}`}
                                >
                                    <IoCaretForward size={'16px'} />
                                </div>
                                <div
                                    onClick={table.getCanNextPage() ? () => { table.setPageIndex(table.getPageCount() - 1); setPagesIndex(table.getPageCount()); } : null}
                                    className={`${styles.pagination__navs} ${!table.getCanNextPage() ? styles.disabled : ''}`}
                                >
                                    <IoPlayForward size={'16px'} />
                                </div>
                            </div>
                            <div className={styles.pagination__control_details}>
                                Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                            </div>
                        </div>
                    </> :
                    <div className={styles.empty}>
                        <div className={styles.image}>{tableEmptyImg}</div>
                        <h5>Tabel Kosong</h5>
                    </div>
                }
            </div>
        )
    }

    const ErrorTable = () => {
        return (
            <div className={`${styles.container} ${styles.error}`}>
                <div className={styles.error__content} onClick={handleRetry}>
                    <h5>Gagal mengambil data</h5>
                    <h1>&#x21bb;</h1>
                </div>
            </div>
        )
    }

    if (state === 'loading') { return (<SkeletonTable />) }
    else if (state === 'loaded') { return (<LoadedTable />) }
    else if (state === 'error') { return (<ErrorTable />) }
    else { return 'Unidentified Table State' }
}

function CariMatakuliah({
    column, table, isSearchActive, setPagesIndex
}) {
    const matakuliahFilterValue = column.getFilterValue() ?? '';

    return (
        <div className={styles.search}>
            <DebouncedInput
                type='text'
                value={matakuliahFilterValue}
                onChange={value => {
                    if (matakuliahFilterValue !== value) {
                        table.setPageIndex(0);
                        setPagesIndex(1);
                    }
                    column.setFilterValue(value);
                }}
                placeholder={'Cari matakuliah'}
            />
            <div
                className={`${styles.search__icon} ${styles.times} ${isSearchActive() ? '' : styles.hide}`}
                onClick={() => { column.setFilterValue('') }}
            >
                <IoClose size={'18px'} />
            </div>
            <div
                className={`${styles.search__icon} ${isSearchActive() ? styles.active : ''}`}
            >
                <IoSearchCircle size={'24px'} />
            </div>
        </div>
    )
}

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value, debounce])

    return (
        <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
    )
}

function RowAction({
    activeTab,
    row,
    rowAction,
    setRowAction,
    handleHapusMatakuliah,
    handleDetailModal,
    handleUndoModal,
    handleUndoConfirmModal,
    handleHapusPermanentModal,
    getCreatedAtById,
    getUpdatedAtById,
    getRefId
}) {
    return (
        <td className={`${styles.action} ${rowAction ? styles.expand : ''}`}>
            <div className={styles.wrapper}>
                <i onClick={() => setRowAction(!rowAction)}>
                    <FaAngleLeft size={'13px'} />
                </i>
                {activeTab === 1 ?
                    <i onClick={() => {
                        const itemData = {
                            id: row.getValue('nomor'),
                            refId: getRefId(row.getValue('nomor')),
                            nama: row.getValue('matakuliah'),
                        }
                        handleHapusPermanentModal(itemData);
                    }}>
                        <FaTrash size={'13px'} />
                    </i> :
                    <i onClick={(e) => { handleHapusMatakuliah(e, row.getValue('nomor'), row.getValue('matakuliah')) }}>
                        <FaTrash size={'13px'} />
                    </i>
                }
                {activeTab === 1 || activeTab === 2 ?
                    <>
                        <i onClick={() => { handleUndoConfirmModal(row.getValue('nomor')) }}>
                            <FaUndo size={'13px'} />
                        </i>
                        <i onClick={() => { handleUndoModal(row.getValue('nomor')) }}>
                            <FaInfo size={'13px'} />
                        </i>
                    </>
                    :
                    <>
                        <i onClick={() => {
                            const createdAt = getCreatedAtById(row.getValue('nomor'));
                            const updatedAt = getUpdatedAtById(row.getValue('nomor'));
                            const itemData = {
                                id: row.getValue('nomor'),
                                nama: row.getValue('matakuliah'),
                                sks: `${row.getValue('sks')}`,
                                nilai: `${row.getValue('nilai')}`,
                                semester: `${row.getValue('semester')}`,
                                diulang: row.getValue('diulang') ? 'ya' : 'tidak',
                                target: row.getValue('target'),
                                dibuat: createdAt ? unixToDate(createdAt, null, { dateStyle: 'full', timeStyle: 'medium' }) : '-',
                                diedit: updatedAt ? unixToDate(updatedAt, null, { dateStyle: 'full', timeStyle: 'medium' }) : '-',
                            }
                            handleDetailModal(itemData, true);
                        }}
                        >
                            <FaPen size={'13px'} />
                        </i>
                        <i onClick={() => {
                            const createdAt = getCreatedAtById(row.getValue('nomor'));
                            const updatedAt = getUpdatedAtById(row.getValue('nomor'));
                            const itemData = {
                                id: row.getValue('nomor'),
                                nama: row.getValue('matakuliah'),
                                sks: `${row.getValue('sks')}`,
                                nilai: `${row.getValue('nilai')}`,
                                semester: `${row.getValue('semester')}`,
                                diulang: row.getValue('diulang') ? 'ya' : 'tidak',
                                target: row.getValue('target'),
                                dibuat: createdAt ? unixToDate(createdAt, null, { dateStyle: 'full', timeStyle: 'medium' }) : '-',
                                diedit: updatedAt ? unixToDate(updatedAt, null, { dateStyle: 'full', timeStyle: 'medium' }) : '-',
                            }
                            handleDetailModal(itemData, false)
                        }}>
                            <FaInfo size={'13px'} />
                        </i>
                    </>
                }
            </div>
        </td>
    )
}

/*
============================== CODE END HERE ==============================
*/