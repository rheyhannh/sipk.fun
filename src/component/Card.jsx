'use client'

// ========== NEXT DEPEDENCY ========== //
import Image from "next/image";
import Link from "next/link";

// ========== REACT DEPEDENCY ========== //
import { useContext, useEffect, useState } from 'react';

// ========== COMPONENT DEPEDENCY ========== //
import { mutate } from 'swr';
import { useCookies } from 'next-client-cookies';
import { DashboardContext } from "./provider/Dashboard";
import { ModalContext } from "./provider/Modal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import CountUp from 'react-countup';
import ProgressBar from "@ramonak/react-progress-bar";
import { Icon } from '@/component/loader/ReactIcons'
import { Spinner } from "./loader/Loading";

// ========== DATA DEPEDENCY ========== //
import {
    getUserMatkul, getUserMatkulPercentage,
    getUserSks, getUserSksPercentage,
    getUserIpk, getUserIpkPercentage,
    getAllSemester, getStatsSemester,
    getStatsByNilai,
} from "@/data/summary";

// ========== STYLE DEPEDENCY ========== //
import styles from './style/card.module.css'
import "react-loading-skeleton/dist/skeleton.css";

// ========== ICON DEPEDENCY ========== //
import { IoAddOutline } from "react-icons/io5";
import { CiTrash, CiEdit } from "react-icons/ci";
import { FaInfo, FaUndo } from "react-icons/fa";
import { LuBookCopy, LuLineChart, LuBarChartHorizontalBig } from "react-icons/lu";
import { BsClipboardData } from "react-icons/bs";

/*
============================== CODE START HERE ==============================
*/
export function Summary({ state, icon, color, title, data }) {
    const userIdCookie = useCookies().get('s_user_id');
    const handleRetry = () => {
        mutate(['/api/matkul', userIdCookie])
        mutate(['/api/me', userIdCookie])
    }

    const SkeletonCard = () => (
        <div className={`${styles.summary} ${styles.skeleton}`}>
            <SkeletonTheme
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
            >
                <Skeleton borderRadius={'50%'} width={"100%"} height={"100%"} containerClassName={`${styles.summary__icon} ${styles.skeleton}`} />
            </SkeletonTheme>

            <div className={styles.summary__data}>
                <div
                    style={{ width: '100%' }}
                >
                    <h3 className={styles.summary__title}>
                        <SkeletonTheme
                            baseColor="var(--skeleton-base)"
                            highlightColor="var(--skeleton-highlight)"
                        >
                            <Skeleton width={"80%"} height={"100%"} />
                        </SkeletonTheme>
                    </h3>
                    <h1>
                        <SkeletonTheme
                            baseColor="var(--skeleton-base)"
                            highlightColor="var(--skeleton-highlight)"
                        >
                            <Skeleton width={"60%"} height={"100%"} />
                        </SkeletonTheme>
                    </h1>
                </div>
                <SkeletonTheme
                    baseColor="var(--skeleton-base)"
                    highlightColor="var(--skeleton-highlight)"
                >
                    <Skeleton borderRadius={'50%'} containerClassName={`${styles.summary__progress} ${styles.skeleton}`} width={"100%"} height={"100%"} />
                </SkeletonTheme>
            </div>
            <div>
                <small>
                    <SkeletonTheme
                        baseColor="var(--skeleton-base)"
                        highlightColor="var(--skeleton-highlight)"
                    >
                        <Skeleton width={"60%"} height={"100%"} />
                    </SkeletonTheme>
                </small>
            </div>

        </div>
    )

    const LoadedCard = () => {
        const [dashArray, setDashArray] = useState('0 999');

        const getCircleDraw = (radius, percentage) => {
            const roundCircum = 2 * radius * Math.PI;
            const roundDraw = percentage * roundCircum / 100;
            return `${roundDraw.toFixed(2)} 999`;
        }

        useEffect(() => {
            setDashArray(getCircleDraw(35, data.percentage))
        }, [data])

        return (
            <div className={`${styles.summary}`}>
                <div style={{ background: color ? color : 'var(--first-color)' }} className={styles.summary__icon}>
                    {icon.name && icon.lib ?
                        <Icon name={icon.name} lib={icon.lib} props={{ size: '24px' }} />
                        : null
                    }
                </div>

                <div className={styles.summary__data}>
                    <div>
                        <h3 className={styles.summary__title}>{title}</h3>
                        <CountUp
                            start={0}
                            duration={2.5}
                            decimals={Number.isInteger(data.value) ? 0 : 2}
                            end={data.value}
                            delay={0}
                        >
                            {({ countUpRef }) => (
                                <h1
                                    ref={countUpRef} />
                            )}
                        </CountUp>
                    </div>
                    <div className={styles.summary__progress}>
                        <svg>
                            <svg
                                className={styles.summary__progress_circle}
                                style={{
                                    stroke: color ? color : 'var(--first-color)',
                                    strokeDasharray: dashArray
                                }}
                            >
                                <circle cx='50%' cy='50%' r='35'></circle>
                            </svg>
                        </svg>
                        <CountUp
                            start={0}
                            end={data.percentage}
                            duration={2.5}
                            delay={0}
                            suffix={'%'}
                        >
                            {({ countUpRef }) => (
                                <span
                                    style={{ color: color ? color : 'var(--first-color)' }}
                                    ref={countUpRef} />
                            )}
                        </CountUp>
                    </div>
                </div>
                <small>{data.keterangan}</small>
            </div>
        )
    }

    const ErrorCard = () => (
        <div className={styles.summary}>
            <div className={styles.error__wrapper}>
                <div className={styles.error__content} onClick={handleRetry}>
                    <h5>Gagal mengambil data</h5>
                    <h1>&#x21bb;</h1>
                </div>
            </div>
        </div>
    )

    const ValidatingCard = () => (
        <div className={styles.summary}>
            <div className={styles.validating__wrapper}>
                <div className={styles.validating__content}>
                    <Spinner size={'30px'} color={'var(--logo-second-color)'} />
                </div>
            </div>
        </div>
    )

    const EmptyCard = () => {
        const {
            setModal,
            setActive,
            setData
        } = useContext(ModalContext);

        const handleTambahModal = () => {
            setData(null);
            setModal('tambahMatkul');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        return (
            <div className={styles.summary}>
                <div className={styles.empty__wrapper}>
                    <div className={styles.empty__content} onClick={() => { handleTambahModal() }}>
                        <Image
                            src={'/tambah_matkul.svg'}
                            width={100}
                            height={100}
                            alt='Tambah Matakuliah'
                            className={styles.image}
                        />
                        <h5>Tambah Matakuliah</h5>
                    </div>
                </div>
            </div>
        )
    }

    if (state === 'loading') { return (<SkeletonCard />) }
    else if (state === 'loaded') { return (<LoadedCard />) }
    else if (state === 'error') { return (<ErrorCard />) }
    else if (state === 'validating') { return (<ValidatingCard />) }
    else if (state === 'empty') { return (<EmptyCard />) }
    else { return 'Unidentified Card State' }
}

export function Notification({ state, data }) {
    const handleRetry = () => {
        mutate('/api/notifikasi')
    }

    const {
        isPhoneContent,
    } = useContext(DashboardContext);

    const SkeletonCard = () => {
        if (isPhoneContent === false) {
            const skeletonElement = Array.from({ length: 3 }, (_, index) => (
                <div className={`${styles.notification__post} ${styles.skeleton}`} key={crypto.randomUUID()}>
                    <div className={styles.notification__main}>
                        <div style={{ width: '100%' }}>
                            <SkeletonTheme
                                baseColor="var(--skeleton-base)"
                                highlightColor="var(--skeleton-highlight)"
                            >
                                <Skeleton width={"70%"} height={"100%"} />
                            </SkeletonTheme>
                        </div>
                    </div>
                    <div className={styles.notification__details}>
                        <p>
                            <SkeletonTheme
                                baseColor="var(--skeleton-base)"
                                highlightColor="var(--skeleton-highlight)"
                            >
                                <Skeleton width={"100%"} height={"100%"} count={3} />
                            </SkeletonTheme>
                        </p>
                    </div>
                </div>
            ))
            return (
                <div className={`${styles.notification} ${styles.skeleton}`}>
                    <div className={styles.notification__inner}>
                        {skeletonElement}
                    </div>
                </div>
            )
        } else if (isPhoneContent === true) {
            return (
                <>
                    Swiper Skeleton Notification
                </>
            )
        }
    }

    const LoadedCard = () => {
        if (isPhoneContent === false) {
            return (
                <div className={styles.notification}>
                    <div className={styles.notification__inner}>
                        {data.map((item, index) => {
                            const postedAt = (created_at, type) => {
                                const postedAt = type === 'unix' ? new Date(created_at * 1000) : new Date(created_at);
                                const currentDate = new Date();
                                if (postedAt.toDateString() === currentDate.toDateString()) {
                                    const timeOnly = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(postedAt);
                                    return timeOnly;
                                } else if (postedAt.toDateString() == new Date(currentDate - 86400000).toDateString()) {
                                    return 'Kemarin';
                                } else {
                                    const dateMonth = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(postedAt);
                                    return dateMonth;
                                }
                            }

                            return (
                                <Link href={item.href} className={styles.notification__post} prefetch={false} key={crypto.randomUUID()}>
                                    <div className={styles.notification__main}>
                                        <span style={{ color: item.color }}>
                                            <Icon name={item.icon.name} lib={item.icon.lib} />
                                        </span>
                                        <p>
                                            <b style={{ color: item.color }}>
                                                {item.title}
                                            </b>
                                        </p>
                                        <small>
                                            ○ {postedAt(item.unix_created_at, 'unix')}
                                        </small>
                                    </div>
                                    <div className={styles.notification__details}>
                                        {item.description}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )
        } else if (isPhoneContent === true) {
            return (
                <>
                    Swiper Notification
                </>
            )
        }
    }

    const ErrorCard = () => {
        if (isPhoneContent === false) {
            return (
                <div className={styles.notification}>
                    <div className={styles.error__wrapper}>
                        <div className={styles.error__content} onClick={handleRetry}>
                            <h5>Gagal mengambil data</h5>
                            <h1>&#x21bb;</h1>
                        </div>
                    </div>
                </div>
            )
        } else if (isPhoneContent === true) {
            return (
                <>
                    Swiper Error Notification
                </>
            )
        }
    }

    const ValidatingCard = () => {
        if (isPhoneContent === false) {
            return (
                <div className={styles.notification}>
                    <div className={styles.validating__wrapper}>
                        <div className={styles.validating__content}>
                            <Spinner size={'35px'} color={'var(--logo-second-color)'} />
                        </div>
                    </div>
                </div>
            )
        } else if (isPhoneContent === true) {
            return (
                <>
                    Swiper Validating Notification
                </>
            )
        }
    }

    const EmptyCard = () => {
        if (isPhoneContent === false) {
            return (
                <div className={styles.notification}>
                    <div className={styles.empty__wrapper}>
                        <div className={styles.empty__content}>
                            <Image
                                src={'/notifikasi_kosong.svg'}
                                width={100}
                                height={100}
                                alt='Notifikasi Kosong'
                                className={styles.image}
                            />
                            <h5>Belum Ada Notifikasi</h5>
                        </div>
                    </div>
                </div>
            )
        } else if (isPhoneContent === true) {
            return (
                <>
                    Swiper Empty Notification
                </>
            )
        }
    }

    if (state === 'loading') { return (<SkeletonCard />) }
    else if (state === 'loaded') { return (<LoadedCard />) }
    else if (state === 'error') { return (<ErrorCard />) }
    else if (state === 'validating') { return (<ValidatingCard />) }
    else if (state === 'empty') { return (<EmptyCard />) }
    else { return 'Unidentified Card State' }
}

export function History({ state, data, universitas, count }) {
    const userIdCookie = useCookies().get('s_user_id');
    const handleRetry = () => {
        mutate(['/api/matkul-history', userIdCookie])
    }

    const {
        isTouchDevice,
    } = useContext(DashboardContext);
    const {
        setModal,
        setActive,
        setData
    } = useContext(ModalContext);

    const handleTambahModal = () => {
        setData(null);
        setModal('tambahMatkul');
        setTimeout(() => {
            setActive(true);
        }, 50)
    }

    const SkeletonCard = () => {
        const skeletonElement = Array.from({ length: 3 }, (_, index) => (
            <div
                className={`${styles.history} ${styles.skeleton}`}
                key={crypto.randomUUID()}
            >
                <div className={styles.history__content}>
                    <SkeletonTheme
                        baseColor="var(--skeleton-base)"
                        highlightColor="var(--skeleton-highlight)"
                    >
                        <Skeleton borderRadius={'50%'} width={"100%"} height={"100%"} containerClassName={`${styles.history__icon} ${styles.skeleton}`} />
                    </SkeletonTheme>

                    <div className={styles.history__details}>
                        <h3>
                            <SkeletonTheme
                                baseColor="var(--skeleton-base)"
                                highlightColor="var(--skeleton-highlight)"
                            >
                                <Skeleton width={"80%"} height={"100%"} />
                            </SkeletonTheme>
                        </h3>
                        <small>
                            <SkeletonTheme
                                baseColor="var(--skeleton-base)"
                                highlightColor="var(--skeleton-highlight)"
                            >
                                <Skeleton width={"60%"} height={"100%"} />
                            </SkeletonTheme>
                        </small>
                    </div>
                    <div className={styles.history__value} style={{ width: '100%' }}>
                        <Skeleton
                            width={"50%"}
                            height={"100%"}
                            baseColor="var(--skeleton-base)"
                            highlightColor="var(--skeleton-highlight)"
                        />
                        <Skeleton
                            width={"100%"}
                            height={"100%"}
                            baseColor="var(--skeleton-base)"
                            highlightColor="var(--skeleton-highlight)"
                        />
                    </div>
                </div>
            </div>
        ))

        return (
            <>
                {skeletonElement}
                <div className={`${styles.history} ${styles.tambah} ${styles.skeleton}`}>
                    <div className={styles.content} />
                </div>
            </>
        )
    }

    const LoadedCard = () => {
        const getIcon = {
            tambah: <IoAddOutline size={'24px'} />,
            hapus: <CiTrash size={'24px'} />,
            ubah: <CiEdit size={'24px'} />
        }

        const postedAt = (created_at, type) => {
            const postedAt = type === 'unix' ? new Date(created_at * 1000) : new Date(created_at);
            const currentDate = new Date();
            if (postedAt.toDateString() === currentDate.toDateString()) {
                const timeOnly = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(postedAt);
                return timeOnly;
            } else if (postedAt.toDateString() == new Date(currentDate - 86400000).toDateString()) {
                return 'Kemarin';
            } else {
                const dateMonth = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(postedAt);
                return dateMonth;
            }
        }

        const handleEditModal = (data) => {
            setData(data);
            setModal('perubahanTerakhirDetail');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        const handleUndoModal = (data) => {
            setData(data);
            setModal('perubahanTerakhirConfirm');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        const getArrayLength = () => {
            if (count) { return data.slice(0, count) }
            else { return data }
        }

        return (
            <>
                {getArrayLength().map((item, index) => {
                    const style = universitas[item?.current?.nilai?.indeks ? item?.current?.nilai?.indeks : item?.prev?.nilai?.indeks]?.style
                    return (
                        <div
                            className={styles.history}
                            {...isTouchDevice ? { onClick: () => handleEditModal(item) } : {}}
                            key={crypto.randomUUID()}
                        >
                            <div className={styles.history__tooltip} key={crypto.randomUUID()}>
                                <div className={styles.wrapper}>
                                    <i onClick={() => { handleUndoModal(item) }}>
                                        <FaUndo size={'12px'} />
                                    </i>
                                    <i onClick={() => { handleEditModal(item) }}>
                                        <FaInfo size={'12px'} />
                                    </i>
                                </div>
                            </div>
                            <div className={styles.history__content} key={crypto.randomUUID()}>
                                <div className={`${styles.history__icon} ${item?.current?.type ? styles[item?.current?.type] : styles[item?.prev?.type]}`}>
                                    {getIcon[item?.current?.type ? item?.current?.type : item?.prev?.type]}
                                </div>
                                <div className={styles.history__details}>
                                    <h3>{item?.current?.nama ? item?.current?.nama : item?.prev?.nama}</h3>
                                    <small>{postedAt(item?.last_change_at, 'unix')}</small>
                                </div>
                                <div className={styles.history__value}>
                                    <h5 style={{ color: style ? `var(--${style}-color)` : '' }}>{item?.current?.nilai?.indeks ? item?.current?.nilai?.indeks : item?.prev?.nilai?.indeks}</h5>
                                    <h5>{item?.current?.sks ? item?.current?.sks : item?.prev?.sks} SKS</h5>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div className={`${styles.history} ${styles.tambah}`} onClick={() => { handleTambahModal() }}>
                    <div className={styles.content}>
                        <IoAddOutline size={'24px'} />
                        <h3>Tambah Matakuliah</h3>
                    </div>
                </div>
            </>
        )
    }

    const ErrorCard = () => {
        const errorElement = Array.from({ length: 3 }, (_, index) => (
            <div
                className={styles.history}
                key={crypto.randomUUID()}
            >
                <div className={styles.error__content} onClick={handleRetry}>
                    <h5>Gagal mengambil data</h5>
                    <h2>&#x21bb;</h2>
                </div>
            </div>
        ))

        return (
            <>
                {errorElement}
                <div className={`${styles.history} ${styles.tambah} ${styles.skeleton}`}>
                    <div className={styles.content} />
                </div>
            </>
        )
    }

    const ValidatingCard = () => {
        const validatingElement = Array.from({ length: 3 }, (_, index) => (
            <div
                className={styles.history}
                key={crypto.randomUUID()}
            >
                <div className={styles.validating__wrapper}>
                    <div className={styles.validating__content}>
                        <Spinner size={'25px'} color={'var(--logo-second-color)'} />
                    </div>
                </div>
            </div>
        ))

        return (
            <>
                {validatingElement}
                <div className={`${styles.history} ${styles.tambah} ${styles.skeleton}`}>
                    <div className={styles.content} />
                </div>
            </>
        )
    }

    const EmptyCard = () => {
        return (
            <div className={`${styles.history} ${styles.tambah}`} onClick={() => { handleTambahModal() }}>
                <div className={styles.content} >
                    <IoAddOutline size={'24px'} />
                    <h3>Tambah Matakuliah</h3>
                </div>
            </div>
        )
    }

    if (state === 'loading') { return (<SkeletonCard />) }
    else if (state === 'loaded') { return (<LoadedCard />) }
    else if (state === 'error') { return (<ErrorCard />) }
    else if (state === 'validating') { return (<ValidatingCard />) }
    else if (state === 'empty') { return (<EmptyCard />) }
    else { return 'Unidentified Card State' }
}

export function Total({ state, user, matkul, universitas }) {
    const userIdCookie = useCookies().get('s_user_id');
    const handleRetry = () => {
        mutate(['/api/matkul', userIdCookie])
        mutate(['/api/me', userIdCookie])
    }

    const SkeletonCard = () => {
        return (
            <div className={`${styles.total} ${styles.skeleton}`}>
                <div className={styles.total__main}>
                    <div className={styles.total__left}>
                        <div className={`${styles.total__left_subtitle} ${styles.skeleton}`}>
                            <SkeletonTheme
                                baseColor="var(--skeleton-base)"
                                highlightColor="var(--skeleton-highlight)"
                            >
                                <Skeleton width={"100%"} height={"100%"} containerClassName={`${styles.total__left_icon} ${styles.skeleton}`} />
                            </SkeletonTheme>
                            <div style={{ width: '100%' }}>
                                <h2>
                                    <SkeletonTheme
                                        baseColor="var(--skeleton-base)"
                                        highlightColor="var(--skeleton-highlight)"
                                    >
                                        <Skeleton width={"100%"} height={"100%"} />
                                    </SkeletonTheme>
                                </h2>
                            </div>
                        </div>
                        <div className={styles.total__left_title}>
                            <div style={{ width: '100%' }}>
                                <h2>
                                    <SkeletonTheme
                                        baseColor="var(--skeleton-base)"
                                        highlightColor="var(--skeleton-highlight)"
                                    >
                                        <Skeleton width={"60%"} height={"100%"} />
                                    </SkeletonTheme>
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className={styles.total__right}>
                        <div style={{ width: '100%' }} className={styles.total__right_number}>
                            <div style={{ width: '100%' }}>
                                <h1>
                                    <SkeletonTheme
                                        baseColor="var(--skeleton-base)"
                                        highlightColor="var(--skeleton-highlight)"
                                    >
                                        <Skeleton width={"100%"} height={"100%"} />
                                    </SkeletonTheme>
                                </h1>
                            </div>
                            <h2 style={{ color: 'var(--skeleton-base)', fontWeight: '400' }}>|</h2>
                            <div style={{ width: '100%' }}>
                                <p>
                                    <SkeletonTheme
                                        baseColor="var(--skeleton-base)"
                                        highlightColor="var(--skeleton-highlight)"
                                    >
                                        <Skeleton width={"100%"} height={"100%"} />
                                    </SkeletonTheme>
                                </p>
                            </div>
                        </div>
                        <div className={styles.total__right_progress}>
                            <SkeletonTheme
                                baseColor="var(--skeleton-base)"
                                highlightColor="var(--skeleton-highlight)"
                            >
                                <Skeleton width={"100%"} height={"100%"} />
                            </SkeletonTheme>
                        </div>
                    </div>
                </div>
                <div className={`${styles.total__data} ${styles.skeleton}`}>
                    <SkeletonTheme
                        baseColor="var(--skeleton-base)"
                        highlightColor="var(--skeleton-highlight)"
                    >
                        <Skeleton width={"100%"} height={"100%"} />
                    </SkeletonTheme>
                </div>
            </div>
        )
    }

    const LoadedCard = () => {
        const [dataTab, setDataTab] = useState(0);
        const [baseTab, setBaseTab] = useState(0);
        const dataType = [
            { name: 'SKS', short: '•' },
            { name: 'Matkul', short: '•' },
            { name: 'IPK', short: '•' }
        ]

        const baseType = [
            'Semester', 'Nilai'
        ]

        const handleDataTab = () => {
            if (dataTab === 2) { setDataTab(0) }
            else { setDataTab(dataTab + 1) }
            setBaseTab(0);
        }

        const handleBaseTab = () => {
            if (dataTab === 2) { return; }
            else {
                if (baseTab === 1) { setBaseTab(0) }
                else { setBaseTab(1) }
            }
        }

        const getData = (data, base) => {
            if (baseTab === 1) {
                const nilaiStats = getStatsByNilai(matkul, universitas);
                const element = nilaiStats.map((item, index) => (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            borderRight: `${index !== 4 && index !== 9 ? 'solid 1px var(--infoDark-color)' : 'none'}`
                        }}
                        key={crypto.randomUUID()}
                    >
                        <h3 style={{ color: `var(--${item.style}-sec-color)` }}>{item.indeks}</h3>
                        <span style={{ color: 'var(--dark-color)', fontWeight: '600' }}>{dataTab === 0 ? item.totalSks : dataTab === 1 ? item.totalMatakuliah : -1}{dataType[dataTab].short}</span>
                    </div>
                ))

                return (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(5,1fr)`,
                            width: '100%',
                            height: '100%',
                            padding: '.5rem'
                        }}
                    >
                        {element}
                    </div>
                )
            } else if (baseTab === 0) {
                const semesterCount = getAllSemester(matkul).length;
                return (
                    <div
                        id="total_data-scroll"
                        className={`${styles.total__data_content} ${semesterCount > 8 ? styles.scroll : ''}`}
                        style={semesterCount > 8 ? {} : { gridTemplateColumns: `repeat(${semesterCount > 4 ? 4 : semesterCount},1fr)`, }}
                    >
                        {getStatsSemester(matkul, true).map((item, index) => (
                            <div
                                className={`${styles.total__data_content_entries} ${semesterCount > 8 ? styles.scroll : ''}`}
                                key={crypto.randomUUID()}
                            >
                                <h3>{item.semester}</h3>
                                <span>{dataTab === 0 ? item.totalSks : dataTab === 1 ? item.count : dataTab === 2 ? (item.totalNilai / item.totalSks).toFixed(2) : -1}{dataType[dataTab].short}</span>
                            </div>
                        ))
                        }
                    </div>
                )
            } else {
                <h1>Empty</h1>
            }
        }

        return (
            <div className={styles.total}>
                <div className={styles.total__main}>
                    <div className={styles.total__left}>
                        <div className={styles.total__left_subtitle}>
                            <div style={{ boxShadow: 'var(--box-shadow2)' }} className={styles.total__left_icon}>
                                <BsClipboardData size={'16px'} color={'var(--logo-second-color)'} />
                            </div>
                            <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '500' }}>
                                <span onClick={handleBaseTab}>{baseType[baseTab]}</span>
                            </h3>
                        </div>
                        <div className={styles.total__left_title}>
                            <h2
                                onClick={handleDataTab}
                                style={{ color: 'var(--dark-color)' }}
                            >{dataType[dataTab].name}
                            </h2>
                        </div>
                    </div>
                    <div className={styles.total__right}>
                        <div className={styles.total__right_number}>
                            <CountUp
                                start={0}
                                duration={2.5}
                                decimals={Number.isInteger(dataTab === 0 ? getUserSks(matkul) : dataTab === 1 ? getUserMatkul(matkul) : dataTab === 2 ? getUserIpk(matkul) : -1) ? 0 : 2}
                                end={dataTab === 0 ? getUserSks(matkul) : dataTab === 1 ? getUserMatkul(matkul) : dataTab === 2 ? getUserIpk(matkul) : -1}
                                delay={0}
                            >
                                {({ countUpRef }) => (
                                    <h1 style={{ color: 'var(--success-sec-color)' }} ref={countUpRef} />
                                )}
                            </CountUp>
                            <h2 style={{ color: 'var(--infoDark-color)', fontWeight: '400' }}>|</h2>
                            <p style={{ color: 'var(--infoDark-color)' }}>
                                {dataTab === 0 ? user[0].sks_target : dataTab === 1 ? user[0].matkul_target : dataTab === 2 ? user[0].ipk_target : -1}
                            </p>
                        </div>
                        <div className={styles.total__right_progress}>
                            <ProgressBar
                                completed={dataTab === 0 ? getUserSksPercentage(user, matkul) : dataTab === 1 ? getUserMatkulPercentage(user, matkul) : dataTab === 2 ? getUserIpkPercentage(user, matkul) : -1}
                                maxCompleted={100}
                                height={'15px'}
                                labelSize={'10px'}
                                baseBgColor={'var(--inner-color-bg1)'}
                                borderRadius={'1rem'}
                                bgColor={'var(--success-sec-color)'}
                                animateOnRender={true}
                                transitionDuration={'2.5s'}

                            />
                        </div>
                    </div>
                </div>
                <div className={styles.total__data}>
                    {getData()}
                </div>
            </div>
        )
    }

    const ErrorCard = () => {
        return (
            <div className={`${styles.total} ${styles.flex}`}>
                <div className={styles.error__wrapper}>
                    <div className={styles.error__content} onClick={handleRetry}>
                        <h5>Gagal mengambil data</h5>
                        <h1>&#x21bb;</h1>
                    </div>
                </div>
            </div>
        )
    }

    const ValidatingCard = () => {
        return (
            <div className={`${styles.total} ${styles.flex}`}>
                <div className={styles.validating__wrapper}>
                    <div className={styles.validating__content}>
                        <Spinner size={'30px'} color={'var(--logo-second-color)'} />
                    </div>
                </div>
            </div>
        )
    }

    const EmptyCard = () => {
        const {
            setModal,
            setActive,
            setData
        } = useContext(ModalContext);

        const handleTambahModal = () => {
            setData(null);
            setModal('tambahMatkul');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        return (
            <div className={`${styles.total} ${styles.flex}`}>
                <div className={styles.empty__wrapper}>
                    <div className={styles.empty__content} onClick={() => { handleTambahModal() }}>
                        <Image
                            src={'/tambah_matkul.svg'}
                            width={100}
                            height={100}
                            alt='Tambah Matakuliah'
                            className={styles.image}
                        />
                        <h5>Tambah Matakuliah</h5>
                    </div>
                </div>
            </div>
        )
    }

    if (state === 'loading') { return (<SkeletonCard />) }
    else if (state === 'loaded') { return (<LoadedCard />) }
    else if (state === 'error') { return (<ErrorCard />) }
    else if (state === 'validating') { return (<ValidatingCard />) }
    else if (state === 'empty') { return (<EmptyCard />) }
    else { return 'Unidentified Card State' }
}