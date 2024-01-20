'use client'

// ========== NEXT DEPEDENCY ========== //
import Image from 'next/image';

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
import { ModalContext } from "./provider/Modal";
import { Spinner } from "./loader/Loading";

// ========== DATA DEPEDENCY ========== //


// ========== STYLE DEPEDENCY ========== //
import styles from './style/table.module.css'

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
    const userIdCookie = useCookies().get('s_user_id');
    const handleRetry = () => {
        mutate(['/api/me', userIdCookie])
        mutate(['/api/matkul', userIdCookie])
        mutate(['/api/matkul-history', userIdCookie])
        // Mutate universitas
    }

    const SkeletonTable = () => {
        return (
            <div>Skeleton Table</div>
        )
    }

    const LoadedTable = () => {
        const initialRender = useRef(true);
        const [activeTab, setActiveTab] = useState(sessionTable.tab ?? 0);
        const [data, setData] = useState(() => {
            if (activeTab === 1) {
                return matkulHistory.length ?
                    matkulHistory
                        .filter(history => history.current.type === 'hapus')
                        .map(matkulDihapus => ({
                            id: matkulDihapus.id,
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
                            id: matkulDiubah.id,
                            nama: matkulDiubah.current.nama,
                            semester: matkulDiubah.current.semester,
                            sks: matkulDiubah.current.sks,
                            nilai: matkulDiubah.current.nilai,
                            dapat_diulang: matkulDiubah.current.dapat_diulang,
                            target_nilai: matkulDihapus.current.target_nilai,
                        }))
                    : [];
            } else {
                return matkul;
            }
        });
        const [isValidating, setIsValidating] = useState(validating);
        const [columnVisibility, setColumnVisibility] = useState(sessionTable.columnVisibility ?? user?.preferences?.table?.columnVisibility ?? {
            nomor: true, matakuliah: true, semester: true, sks: true, nilai: true, diulang: true, target: true
        });
        const [columnFilters, setColumnFilters] = useState(sessionTable.columnFilters ?? []);
        const [columnOrder, setColumnOrder] = useState(sessionTable.columnOrder ?? user.preferences.table.columnOrder ?? [
            'nomor', 'matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target'
        ]);
        const [pageControlPosition, setPageControlPosition] = useState(sessionTable.pageControlPosition ?? user.preferences.table.controlPosition ?? 0);
        const [rowAction, setRowAction] = useState(sessionTable.rowAction ?? true);
        const {
            setModal,
            setActive,
            setData: setModalData
        } = useContext(ModalContext);

        const tableEmptyImg = <Image src="https://storage.googleapis.com/sipk_assets/table_kosong.svg" width={100} height={100} alt="Table Empty" />;

        const pageControlCSS = [
            styles.page_control_bottom,
            styles.page_control_top,
            styles.page_control_both
        ]

        const handleAllMatakuliahTab = () => {
            setActiveTab(0);
            setData(matkul);
            table.setPageIndex(0);
        }

        const handleDeletedMatakuliahTab = () => {
            const historyHapus = matkulHistory.length ?
                matkulHistory
                    .filter(history => history.current.type === 'hapus')
                    .map(matkulDihapus => ({
                        id: matkulDihapus.id,
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
        }

        const handleEditedMatakuliahTab = () => {
            const historyEdit = matkulHistory.length ?
                matkulHistory
                    .filter(history => history.current.type === 'ubah')
                    .map(matkulDiubah => ({
                        id: matkulDiubah.id,
                        nama: matkulDiubah.current.nama,
                        semester: matkulDiubah.current.semester,
                        sks: matkulDiubah.current.sks,
                        nilai: matkulDiubah.current.nilai,
                        dapat_diulang: matkulDiubah.current.dapat_diulang,
                        target_nilai: matkulDihapus.current.target_nilai,
                    }))
                : [];
            setActiveTab(2);
            setData(historyEdit);
            table.setPageIndex(0);
        }

        const columnHelper = createColumnHelper();
        const columns = useMemo(
            () => [
                columnHelper.accessor('id', {
                    id: 'nomor',
                    cell: info => info.row.index + 1,
                    header: () => <span>#</span>,
                    footer: info => info.column.id,
                    enableSorting: false,
                }),
                columnHelper.accessor('nama', {
                    id: 'matakuliah',
                    cell: info => info.getValue(),
                    header: () => <span>Matakuliah</span>,
                    footer: info => info.column.id,
                }),
                columnHelper.accessor(row => row.semester, {
                    id: 'semester',
                    cell: info => info.getValue(),
                    header: () => <span>Semester</span>,
                    footer: info => info.column.id,
                }),
                columnHelper.accessor('sks', {
                    id: 'sks',
                    cell: info => info.getValue(),
                    header: () => <span>Sks</span>,
                    footer: info => info.column.id,
                }),
                columnHelper.accessor(row => row.nilai.indeks, {
                    id: 'nilai',
                    cell: info => info.getValue(),
                    header: () => <span>Nilai</span>,
                    footer: info => info.column.id,
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
            if (reset) { table.setPageIndex(0) }
            else { table.setPageIndex(index) }
        }

        const getTablePreferences = () => {
            const currentPageSize = table.getState().pagination.pageSize;
            const titleKey = {
                nomor: "Nomor", matakuliah: "Matakuliah", semester: "Semester", sks: "Sks", nilai: "Nilai", diulang: "Bisa Diulang", target: "Target Nilai"
            }
            const columnState = columnOrder.map((id, index) => {
                const title = titleKey[id];
                const visible = columnVisibility[id];
                return { title, id, visible };
            })
            return { size: currentPageSize === matkul.length + 1 ? -1 : currentPageSize, controlPosition: pageControlPosition, state: columnState };
        }

        const getTableFilters = () => {
            const searchId = ['matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target'];
            const result = {};
            searchId.forEach((id) => {
                const item = columnFilters.find((item) => item.id === id);
                if (id === 'diulang') {
                    result[id] = item ? item.value ? 'ya' : 'tidak' : '';
                } else {
                    result[id] = item ? item.value : '';
                }
            })
            return result;
        }

        const isSearchActive = () => {
            return columnFilters.some(filter => filter.id === 'matakuliah');
        };

        const isTableFiltered = () => {
            return columnFilters.length > 0;
        }

        const handleTambahModal = () => {
            if (!penilaian) { return; }
            setModalData({ penilaian });
            setModal('tambahMatkul');
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
                            <CariMatakuliah initValue={table.getColumn('matakuliah').getFilterValue()} column={table.getColumn('matakuliah')} table={table} isSearchActive={isSearchActive} />
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
                                    onClick={table.getCanPreviousPage() ? () => table.setPageIndex(0) : null}
                                    className={`${styles.pagination__navs} ${!table.getCanPreviousPage() ? styles.disabled : ''}`}
                                >
                                    <IoPlayBack size={'16px'} />
                                </div>
                                <div
                                    onClick={table.getCanPreviousPage() ? () => table.previousPage() : null}
                                    className={`${styles.pagination__navs} ${!table.getCanPreviousPage() ? styles.disabled : ''}`}
                                >
                                    <IoCaretBack size={'16px'} />
                                </div>
                                <div className={styles.pagination__input}>
                                    <input
                                        type="number"
                                        min={1}
                                        value={table.getState().pagination.pageIndex + 1}
                                        onChange={e => {
                                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                                            table.setPageIndex(page)
                                        }}
                                    />
                                </div>
                                <div
                                    onClick={table.getCanNextPage() ? () => table.nextPage() : null}
                                    className={`${styles.pagination__navs} ${!table.getCanNextPage() ? styles.disabled : ''}`}
                                >
                                    <IoCaretForward size={'16px'} />
                                </div>
                                <div
                                    onClick={table.getCanNextPage() ? () => table.setPageIndex(table.getPageCount() - 1) : null}
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
                                                                        asc: header.column.id === 'diulang' ? <IoCheckmark /> : <IoArrowDownSharp />,
                                                                        desc: header.column.id === 'diulang' ? <IoClose /> : <IoArrowUpSharp />,
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
                                                    console.log('Detail Modal');
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
                                            {row.getVisibleCells().length ? <RowAction activeTab={activeTab} rowAction={rowAction} setRowAction={setRowAction} /> : <></>}
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
                                    onClick={table.getCanPreviousPage() ? () => table.setPageIndex(0) : null}
                                    className={`${styles.pagination__navs} ${!table.getCanPreviousPage() ? styles.disabled : ''}`}
                                >
                                    <IoPlayBack size={'16px'} />
                                </div>
                                <div
                                    onClick={table.getCanPreviousPage() ? () => table.previousPage() : null}
                                    className={`${styles.pagination__navs} ${!table.getCanPreviousPage() ? styles.disabled : ''}`}
                                >
                                    <IoCaretBack size={'16px'} />
                                </div>
                                <div className={styles.pagination__input}>
                                    <input
                                        type="number"
                                        min={1}
                                        value={table.getState().pagination.pageIndex + 1}
                                        onChange={e => {
                                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                                            table.setPageIndex(page)
                                        }}
                                    />
                                </div>
                                <div
                                    onClick={table.getCanNextPage() ? () => table.nextPage() : null}
                                    className={`${styles.pagination__navs} ${!table.getCanNextPage() ? styles.disabled : ''}`}
                                >
                                    <IoCaretForward size={'16px'} />
                                </div>
                                <div
                                    onClick={table.getCanNextPage() ? () => table.setPageIndex(table.getPageCount() - 1) : null}
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
    column, table, isSearchActive
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
    }, [value, onChange, debounce])

    return (
        <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
    )
}

function RowAction({
    activeTab, rowAction, setRowAction
}) {
    return (
        <td className={`${styles.action} ${rowAction ? styles.expand : ''}`}>
            <div className={styles.wrapper}>
                <i onClick={() => setRowAction(!rowAction)}>
                    <FaAngleLeft size={'13px'} />
                </i>
                <i onClick={() => { console.log('Modal Confirm Delete Matakuliah'); }}>
                    <FaTrash size={'13px'} />
                </i>
                {activeTab === 1 || activeTab === 2 ?
                    <i onClick={() => { console.log('Undo Modal') }}>
                        <FaUndo size={'13px'} />
                    </i> :
                    <i onClick={() => { console.log('Edit Modal') }}>
                        <FaPen size={'13px'} />
                    </i>
                }
                <i onClick={() => { console.log(`Detail Modal`) }}>
                    <FaInfo size={'13px'} />
                </i>
            </div>
        </td>
    )
}

