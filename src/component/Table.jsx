'use client'

// ========== NEXT DEPEDENCY ========== //


// ========== REACT DEPEDENCY ========== //
import { useContext, useEffect, useState, useRef, useMemo } from 'react';

// ========== COMPONENT DEPEDENCY ========== //
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
import isNumeric from 'validator/lib/isnumeric';

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
}
    from "react-icons/io5";

/*
============================== CODE START HERE ==============================
*/
export function Table({ state, validating, user, matkul, matkulHistory, universitas }) {
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
        const [columnFilters, setColumnFilters] = useState([]);
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
                        target_nilai: matkulDihapus.current.target_nilai,
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
                        target_nilai: matkulDiubah.current.target_nilai,
                    }))
                : [];

            setData(historyEdit);
            setActiveTab(2);
            table.setPageIndex(0);
        }

        const handleTambahModal = () => {
            setModalData(null);
            setModal('tambahMatkul');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        const columnHelper = createColumnHelper();
        const columns = useMemo(
            () => [
                columnHelper.accessor('id', {
                    id: 'nomor',
                    cell: info => info.row.index + 1,
                    header: () => <span>#</span>,
                    footer: info => info.column.id,
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
                columnHelper.accessor(row => row.dapat_diulang ? <IoCheckmark size={'15px'} color={'var(--success-color)'} /> : <IoClose size={'15px'} color={'var(--danger-color)'} />, {
                    id: 'diulang',
                    cell: info => info.getValue(),
                    header: () => <span>Bisa Diulang</span>,
                    footer: info => info.column.id,
                }),
                columnHelper.accessor(row => row.dapat_diulang ? row.target_nilai.indeks : '-', {
                    id: 'target',
                    cell: info => info.getValue(),
                    header: () => <span>Target Nilai</span>,
                    footer: info => info.column.id,
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
            },
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            onColumnFiltersChange: setColumnFilters,
            autoResetAll: false,
            // debugAll: true,
        })

        // useEffect(() => {
        //     const savedState = localStorage.getItem('_table');
        //     if (savedState) {
        //         try {
        //             const state = JSON.parse(savedState);
        //             if (
        //                 'tab' in state && typeof state.tab === 'number' &&
        //                 'pageSize' in state && typeof state.pageSize === 'number' &&
        //                 'pageIndex' in state && typeof state.pageIndex === 'number' &&
        //                 'pageControlPosition' in state && typeof state.pageControlPosition === 'number'
        //             ) {
        //                 const allowedTab = [0, 1, 2];
        //                 const allowedPageControlPosition = [0, 1, 2];
        //                 const allowedPageSize = [5, 10, 25, 50, 100, matkul.length + 1];
        //                 setActiveTab(allowedTab.includes(state.tab) ? state.tab : 0);
        //                 if (state.tab === 1) { handleDeletedMatakuliahTab(); }
        //                 setPageControlPosition(allowedPageControlPosition.includes(state.pageControlPosition) ? state.pageControlPosition : 0);
        //                 table.setPageSize(allowedPageSize.includes(state.pageSize) ? state.pageSize : 5);
        //                 table.setPageIndex(state.pageIndex);
        //             } else {
        //                 throw new Error('Invalid table state');
        //             }
        //         } catch (error) {
        //             localStorage.removeItem('_table');
        //             console.error('Failed load table state');
        //         }
        //     }
        // }, [])

        useEffect(() => {
            if (table.getState().columnFilters[0]?.id === 'matakuliah') {
                if (table.getState().sorting[0]?.id !== 'matakuliah') {
                    table.setSorting([]);
                }
            }
        }, [table.getState().columnFilters[0]?.id]);

        // useEffect(() => {
        //     if (initialRender.current) {
        //         initialRender.current = false;
        //         return;
        //     }

        //     const currentState = {
        //         tab: activeTab,
        //         pageSize: table.getState().pagination.pageSize,
        //         pageIndex: table.getState().pagination.pageIndex,
        //         pageControlPosition: pageControlPosition
        //     }
        //     localStorage.setItem('_table', JSON.stringify(currentState));
        // }, [activeTab, pageControlPosition, table.getState().pagination.pageSize, table.getState().pagination.pageIndex])

        return (
            <div className={styles.container}>
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
                            Matakuliah Dihapus
                        </div>
                        <div
                            className={`${styles.btn} ${activeTab === 2 ? styles.active : ''}`}
                            onClick={activeTab !== 2 ? () => handleEditedMatakuliahTab() : null}
                        >
                            Matakuliah Diedit
                        </div>
                    </div>
                    <div className={styles.tools__right}>
                        <div className={styles.tools__search}>
                            <div className={styles.search}>
                                <Filter column={table.getHeaderGroups()[0].headers[1].column} table={table} />
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
                            <div className={styles.tools__shorcut_box}>
                                <IoSettingsOutline size={'18px'} />
                            </div>
                            <div className={styles.tools__shorcut_box}>
                                <IoFilter size={'20px'} />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={`${styles.data} ${pageControlCSS[pageControlPosition]}`}
                >
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
                                        <option key={pageSize} value={pageSize}>
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
                    </div>

                    <table>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
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
                                        const nilaiColor = isNilaiCell || isTargetCell ? universitas[`${cell.getValue()}`]?.style : '';

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
                                        <option key={pageSize} value={pageSize}>
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
                    </div>
                </div>
            </div>
        )
    }

    const ErrorTable = () => {
        return (
            <div>Error Table</div>
        )
    }

    const ValidatingTable = () => {
        return (
            <div>Validating Table</div>
        )
    }

    const EmptyTable = () => {
        return (
            <div>Loaded Table</div>
        )
    }

    if (state === 'loading') { return (<SkeletonTable />) }
    else if (state === 'loaded') { return (<LoadedTable />) }
    else if (state === 'error') { return (<ErrorTable />) }
    else if (state === 'validating') { return (<ValidatingTable />) }
    else if (state === 'empty') { return (<EmptyTable />) }
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

