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
import { getLocalTheme } from '@/utils/client_side';

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

/*
============================== CODE START HERE ==============================
*/
export function Table({ state, validating, user, matkul, matkulHistory, penilaian }) {
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
        const [data, setData] = useState(matkul);
        const [activeTab, setActiveTab] = useState(0);
        const [isValidating, setIsValidating] = useState(validating);
        const [columnVisibility, setColumnVisibility] = useState(user?.preferences?.table?.columnVisibility || {
            nomor: true, matakuliah: true, semester: true, sks: true, nilai: true, diulang: true, target: true
        });
        const [columnFilters, setColumnFilters] = useState([]);
        const [columnOrder, setColumnOrder] = useState(user?.preferences?.table?.columnOrder || [
            'nomor', 'matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target'
        ]);
        const [tableEmptyImg, setTableEmptyImg] = useState(getLocalTheme() === 'dark' ? <Image src="https://storage.googleapis.com/sipk_assets/table_kosong_dark.svg" width={100} height={100} alt="Table Empty" /> : <Image src="https://storage.googleapis.com/sipk_assets/table_kosong.svg" width={100} height={100} alt="Table Empty" />)
        const [pageControlPosition, setPageControlPosition] = useState(user?.preferences?.table?.controlPosition || 0);
        const {
            setModal,
            setActive,
            setData: setModalData
        } = useContext(ModalContext);

        const pageControlCSS = [
            styles.page_control_bottom,
            styles.page_control_top,
            styles.page_control_both
        ]

        const getInitPageSize = () => {
            const initPageSize = user?.preferences?.table?.size;
            if (!initPageSize || !matkul || !matkul.length) {
                return 5;
            }
            else {
                const semua = matkul.length + 1;
                if (initPageSize === -1) {
                    return semua;
                } else if ([5, 10, 25, 50, 100, semua].includes(initPageSize)) {
                    return initPageSize
                } else { return 5 }
            }
        }

        const handleAllMatakuliahTab = () => {
            setData(matkul);
            setActiveTab(0);
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
                        target_nilai: matkulDihapus.current.dapat_diulang ? matkulDihapus.current.target_nilai : null,
                    }))
                : [];

            setData(historyHapus);
            setActiveTab(1);
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
                        target_nilai: matkulDihapus.current.dapat_diulang ? matkulDihapus.current.target_nilai : null,
                    }))
                : [];

            setData(historyEdit);
            setActiveTab(2);
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
                columnHelper.accessor(row => row.dapat_diulang ? row.target_nilai.indeks : '-', {
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
                pagination: {
                    pageIndex: 0,
                    pageSize: getInitPageSize(),
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
            return {size: currentPageSize === matkul.length + 1 ? -1 : currentPageSize, controlPosition: pageControlPosition, state: columnState};
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

        useEffect(() => {
            const savedState = localStorage.getItem('_table');
            if (savedState) {
                try {
                    const allowedKeys = ['nomor', 'matakuliah', 'semester', 'sks', 'nilai', 'diulang', 'target'];
                    const state = JSON.parse(savedState);
                    const validateTab = (tab) => {
                        const allowedTab = [0, 1, 2];
                        if (allowedTab.includes(tab)) {
                            if (tab === 1) { handleDeletedMatakuliahTab(); }
                            return true;
                        }
                        return false;
                    }
                    const validatePageSize = (size) => {
                        const allowedPageSize = [5, 10, 25, 50, 100, matkul.length + 1, -1];
                        if (allowedPageSize.includes(size)) {
                            return true;
                        }
                        return false;
                    }
                    const validatePageControlPosition = (state) => {
                        const allowedPageControlPosition = [0, 1, 2];
                        if (allowedPageControlPosition.includes(state)) {
                            return true;
                        }
                        return false;
                    }
                    const validateColumnOrder = (arr) => {
                        if (arr.length !== 7) {
                            return false;
                        }
                        for (const str of allowedKeys) {
                            if (!arr.includes(str)) {
                                return false;
                            }
                        }
                        return true;
                    }
                    const validateColumnVisibility = (obj) => {
                        const keys = Object.keys(obj);
                        if (keys.length !== 7 || !keys.every(key => allowedKeys.includes(key))) {
                            return false;
                        }

                        const values = Object.values(obj);
                        if (!values.every(value => typeof value === 'boolean')) {
                            return false;
                        }

                        return true;
                    }

                    if (
                        'tab' in state && typeof state.tab === 'number' &&
                        'pageSize' in state && typeof state.pageSize === 'number' &&
                        'pageIndex' in state && typeof state.pageIndex === 'number' &&
                        'pageControlPosition' in state && typeof state.pageControlPosition === 'number' &&
                        'columnOrder' in state && Array.isArray(state.columnOrder) &&
                        'columnVisibility' in state && typeof state.columnVisibility === 'object' && state.columnVisibility !== null && !Array.isArray(state.columnVisibility)
                    ) {
                        setActiveTab(validateTab(state.tab) ? state.tab : 0);
                        table.setPageSize(validatePageSize(state.pageSize) ? state.pageSize === -1 ? matkul.length + 1 : state.pageSize : 5);
                        table.setPageIndex(state.pageIndex);
                        setPageControlPosition(validatePageControlPosition(state.pageControlPosition) ? state.pageControlPosition : 0);
                        setColumnOrder(validateColumnOrder(state.columnOrder) ? state.columnOrder : []);
                        setColumnVisibility(validateColumnVisibility(state.columnVisibility) ? state.columnVisibility : {});
                    } else {
                        throw new Error('Invalid table state');
                    }
                } catch (error) {
                    localStorage.removeItem('_table');
                    console.error(error?.message || 'Something went wrong');
                    console.error('Failed to load table state');
                }
            }
        }, [])

        useEffect(() => {
            if (getLocalTheme() === 'dark') {
                setTableEmptyImg(<Image src="https://storage.googleapis.com/sipk_assets/table_kosong_dark.svg" width={100} height={100} alt="Table Empty" />);
            } else {
                setTableEmptyImg(<Image src="https://storage.googleapis.com/sipk_assets/table_kosong.svg" width={100} height={100} alt="Table Empty" />);
            }
        }, [getLocalTheme()])

        useEffect(() => {
            if (table.getState().pagination.pageIndex !== 0) {
                table.setPageIndex(0);
            }
        }, [columnFilters.filter(item => item.id === 'matakuliah')[0]?.value])

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
                columnVisibility
            }
            localStorage.setItem('_table', JSON.stringify(currentState));
        }, [activeTab, columnOrder, columnVisibility, pageControlPosition, table.getState().pagination.pageSize, table.getState().pagination.pageIndex])

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
                            Ditambah
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
                            <div className={styles.search}>
                                <Filter column={table.getColumn('matakuliah')} table={table} />
                                <div
                                    className={`${styles.search__icon} ${styles.times} ${table.getState().columnFilters[0]?.id === 'matakuliah' ? '' : styles.hide}`}
                                    onClick={() => {
                                        table.resetColumnFilters();
                                    }}
                                >
                                    <IoClose size={'18px'} />
                                </div>
                                <div
                                    className={`${styles.search__icon} ${table.getState().columnFilters[0]?.id === 'matakuliah' ? styles.active : ''}`}
                                >
                                    <IoSearchCircle size={'24px'} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.tools__shorcut}>
                            <div className={styles.tools__shorcut_box} onClick={() => { handleTambahModal() }}>
                                <IoAdd size={'22px'} />
                            </div>
                            <div className={styles.tools__shorcut_box} onClick={() => { handleSettingModal() }}>
                                <IoSettingsOutline size={'18px'} />
                            </div>
                            <div className={styles.tools__shorcut_box}>
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
                                        <tr key={row.id} >
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

function Filter({ column, table }) {
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
    const columnFilterValue = column.getFilterValue();

    return typeof firstValue === 'number' ? (
        <>
            <DebouncedInput
                type="number"
                min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                value={(columnFilterValue[0] ?? '')}
                onChange={(value) =>
                    column.setFilterValue((old) => [value, old?.[1]])
                }
                placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
            />
            <DebouncedInput
                type="number"
                min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                value={(columnFilterValue[1] ?? '')}
                onChange={(value) =>
                    column.setFilterValue((old) => [old?.[0], value])
                }
                placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
            />
        </>
    ) : (
        <DebouncedInput
            type="text"
            value={(columnFilterValue ?? '')}
            onChange={value => column.setFilterValue(value)}
            placeholder={`Cari ${column.id}`}
        />
    );
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
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value, onChange, debounce]);

    return (
        <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
    );
}

