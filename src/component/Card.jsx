'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region NEXT DEPEDENCY
import Image from "next/image";
import Link from "next/link";
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { mutate } from 'swr';
import { useCookies } from 'next-client-cookies';
import { DashboardContext } from "./provider/Dashboard";
import { ModalContext } from "./provider/Modal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import CountUp from 'react-countup';
import ProgressBar from "@ramonak/react-progress-bar";
import { LineChart, Line, BarChart, Bar, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Icon } from '@/component/loader/ReactIcons'
import { Spinner } from "./loader/Loading";
// #endregion

// #region HOOKS DEPEDENCY
import { useMatkul, useUser, useMatkulHistory } from '@/data/core';
// #endregion

// #region UTIL DEPEDENCY
import {
    getUserMatkul, getUserMatkulPercentage,
    getUserSks, getUserSksPercentage,
    getUserIpk, getUserIpkPercentage,
    getAllSemester, getStatsSemester,
    getOnAndOffTarget, getDistribusiNilai,
} from "@/data/summary";
import { getSessionTable } from '@/utils/client_side';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/card.module.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "react-loading-skeleton/dist/skeleton.css";
// #endregion

// #region ICON DEPEDENCY
import { CiTrash, CiEdit } from "react-icons/ci";
import { FaInfo, FaUndo } from "react-icons/fa";
import { IoAnalyticsOutline, IoAddOutline } from "react-icons/io5";
import { TbTarget, TbTargetArrow, TbTargetOff, TbAtom, TbAntennaBars5 } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// #endregion

// #region TYPES DEFINITION
/**
 * @typedef {'loading' | 'loaded' | 'error' | 'validating' | 'empty'} CardState
 * Mendeskripsikan state dari sebuah card dengan keterangan berikut,
 * - `'loading'` : Data sedang difetch
 * - `'loaded'` : Data berhasil diresolve
 * - `'error'` : Terjadi error saat fetch data
 * - `'validating'` : Data sedang divalidasi
 * - `'empty'` : Data berhasil diresolve dan entry data masih kosong
 */

/**
 * @typedef {Object} CardGrafikState
 * State card `Grafik` yang diperoleh dari `sessionStorage`
 * @property {boolean | null} hideIp
 * Boolean untuk hide indeks prestasi `ip` pada card `Grafik`
 * @property {boolean | null} hideMatkul
 * Boolean untuk hide matakuliah pada card `Grafik`
 * @property {boolean | null} hideSks
 * Boolean untuk hide sks pada card `Grafik`
 */

/**
 * @typedef {Object} CardTargetState
 * State card `Target` yang diperoleh dari `sessionStorage`
 * @property {number | null} tab
 * Index tab pada card `Target`
 * @property {number | null} swiperIndex
 * Index swiper pada card `Target`
 */

/**
 * @typedef {Object} CardDistribusiState
 * State card `Target` yang diperoleh dari `sessionStorage`
 * @property {number | null} tab
 * Index tab pada card `Distribusi`
 * @property {boolean | null} hideMatkul
 * Boolean untuk hide matakuliah pada card `Distribusi`
 * @property {boolean | null} hideSks
 * Boolean untuk hide sks pada card `Distribusi`
 */
// #endregion

/**
 * Props yang digunakan component `Summary`
 * @typedef {Object} SummaryProps
 * @property {CardState} state
 * Card state
 * @property {Object} icon
 * Icon {@link https://react-icons.github.io/react-icons/ react-icons} yang digunakan
 * @property {string} icon.name
 * Nama icon pada {@link https://react-icons.github.io/react-icons/ react-icons}
 * - Contoh : `'FaRocket'`, `'IoAdd'`
 * @property {string} icon.lib
 * Library icon pada {@link https://react-icons.github.io/react-icons/ react-icons}
 * - Contoh : `'fa'`, `'io5'`
 * @property {string} color
 * Warna yang digunakan
 * - Contoh : `'var(--danger-color)'`
 * @property {React.ReactNode} title
 * Judul yang digunakan
 * @property {Object} data
 * Card data
 * @property {React.ReactNode} data.value
 * Nilai data seperti total sks, total matakuliah, dan lainnya
 * @property {React.ReactNode} data.percentage
 * Persentasi data seperti persentasi total sks, matakuliah dan lainnya
 * @property {React.ReactNode} data.keterangan
 * Keterangan yang tampil pada bagian bawah card
 * @property {SupabaseTypes.UniversitasData['penilaian']} penilaian
 * User `penilaian` yang digunakan
 */

/**
 * Card yang menampilkan overall user data seperti total sks, total matakuliah, ipk dan lainnya
 * @param {SummaryProps} props Summary props
 * @returns {React.ReactElement} Rendered component
 */
export function Summary({ state, icon, color, title, data, penilaian }) {
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
        const [dashArray, setDashArray] = React.useState('0 999');

        const getCircleDraw = (radius, percentage) => {
            const roundCircum = 2 * radius * Math.PI;
            const roundDraw = percentage * roundCircum / 100;
            return `${roundDraw.toFixed(2)} 999`;
        }

        React.useEffect(() => {
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
        /** @type {ContextTypes.ModalContext} */
        const {
            setModal,
            setActive,
            setData
        } = React.useContext(ModalContext);

        const handleTambahModal = () => {
            if (!penilaian) { return; }
            setData({ penilaian });
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

/**
 * Props yang digunakan component `Notification`
 * @typedef {Object} NotificationProps
 * @property {CardState} state
 * Card state
 * @property {Array<SupabaseTypes.NotifikasiData>} data
 * Array yang berisikan data notifikasi
 */

/**
 * Card yang menampilkan notifikasi data
 * @param {NotificationProps} props Notification props
 * @returns {React.ReactElement} Rendered component
 */
export function Notification({ state, data }) {
    const handleRetry = () => {
        mutate('/api/notifikasi')
    }

    /** @type {ContextTypes.DashboardContext} */
    const {
        isPhoneContent,
    } = React.useContext(DashboardContext);

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
                <div className={`${styles.notification} ${styles.swiper} ${styles.skeleton}`}>
                    <div className={styles.skeleton__wrapper}>
                        {
                            Array.from({ length: 2 }, (_, index) => (
                                <div
                                    className={`${styles.notification__post} ${styles.swiper} ${styles.skeleton}`}
                                    key={crypto.randomUUID()}
                                >
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
                                                <Skeleton width={"100%"} height={"100%"} count={4} />
                                            </SkeletonTheme>
                                        </p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className={`${styles.notification__pagination} ${styles.skeleton}`}>
                        {
                            Array.from({ length: 5 }, (_, index) => (
                                <div className={styles.notification__pagination_dot} key={crypto.randomUUID()} />
                            ))
                        }
                    </div>
                </div>
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
                                <Link href={item.href} target={'_blank'} className={styles.notification__post} prefetch={false} key={crypto.randomUUID()}>
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
                <div className={`${styles.notification} ${styles.swiper}`}>
                    <Swiper
                        slidesPerView={1}
                        autoplay={{
                            delay: 4500,
                            disableOnInteraction: false,
                        }}
                        spaceBetween={10}
                        breakpoints={{
                            475: {
                                slidesPerView: 2,
                                spaceBetween: 0,
                            }
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        style={{
                            "width": "100%",
                            "height": "100%",
                            "--swiper-pagination-color": "var(--logo-second-color)",
                            "--swiper-pagination-bullet-inactive-color": "var(--infoDark-color)",
                            "--swiper-pagination-bottom": "1px",
                        }}
                        modules={[Pagination, Autoplay]}
                    >
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
                                <SwiperSlide key={crypto.randomUUID()}>
                                    <Link href={item.href} target={'_blank'} className={`${styles.notification__post} ${styles.swiper}`} prefetch={false}>
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
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
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
                <div className={`${styles.notification} ${styles.swiper}`}>
                    <div className={styles.error__wrapper}>
                        <div className={styles.error__content} onClick={handleRetry}>
                            <h5>Gagal mengambil data</h5>
                            <h1>&#x21bb;</h1>
                        </div>
                    </div>
                </div>
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
                <div className={`${styles.notification} ${styles.swiper}`}>
                    <div className={styles.validating__wrapper}>
                        <div className={styles.validating__content}>
                            <Spinner size={'30px'} color={'var(--logo-second-color)'} />
                        </div>
                    </div>
                </div>
            )
        }
    }

    const EmptyCard = () => {
        if (isPhoneContent === false) {
            return (
                <div className={styles.notification}>
                    <div className={styles.empty__wrapper}>
                        <div className={styles.empty__content}>
                            <h5>Belum Ada Update</h5>
                        </div>
                    </div>
                </div>
            )
        } else if (isPhoneContent === true) {
            return (
                <div className={`${styles.notification} ${styles.swiper}`}>
                    <div className={styles.empty__wrapper}>
                        <div className={styles.empty__content}>
                            <h5>Belum Ada Update</h5>
                        </div>
                    </div>
                </div>
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

/**
 * Props yang digunakan component `History`
 * @typedef {Object} HistoryProps
 * @property {CardState} state
 * Card state
 * @property {Array<SupabaseTypes.MatkulHistoryData>} data
 * Array yang berisikan user matakuliah history
 * @property {SupabaseTypes.UniversitasData['penilaian']} penilaian
 * User `penilaian` yang digunakan
 * @property {number} count
 * Jumlah matakuliah history yang ditampilkan
 */

/**
 * Card yang menampilkan user matakuliah history
 * @param {HistoryProps} props History props
 * @returns {React.ReactElement} Rendered component
 */
export function History({ state, data, penilaian, count }) {
    const userIdCookie = useCookies().get('s_user_id');

    const handleRetry = () => {
        mutate(['/api/matkul-history', userIdCookie])
    }

    /** @type {ContextTypes.DashboardContext} */
    const {
        isTouchDevice,
    } = React.useContext(DashboardContext);

    /** @type {ContextTypes.ModalContext} */
    const {
        setModal,
        setActive,
        setData
    } = React.useContext(ModalContext);

    const handleTambahModal = () => {
        if (!penilaian) { return; }
        setData({ penilaian });
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
            if (count) { return data.slice().reverse().slice(0, count) }
            else { return data.slice().reverse() }
        }

        return (
            <>
                {getArrayLength().map((item, index) => {
                    const style = penilaian[item?.current?.nilai?.indeks ? item?.current?.nilai?.indeks : item?.prev?.nilai?.indeks]?.style
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

/**
 * Props yang digunakan component `Grafik`
 * @typedef {Object} GrafikProps
 * @property {CardState} state
 * Card state
 * @property {Array<SupabaseTypes.MatkulData>} matkul
 * Array yang berisikan user matakuliah
 * @property {SupabaseTypes.UniversitasData['penilaian']} penilaian
 * User `penilaian` yang digunakan
 * @property {CardGrafikState} savedState
 * State card `Grafik` yang diperoleh dari `sessionStorage`
 */

/**
 * Card yang menampilkan grafik user matakuliah, sks dan indeks prestasi
 * @param {GrafikProps} props Grafik props
 * @returns {React.ReactElement} Rendered component
 */
export function Grafik({ state, matkul, penilaian, savedState }) {
    const userIdCookie = useCookies().get('s_user_id');
    const handleRetry = () => {
        mutate(['/api/matkul', userIdCookie])
    }

    const SkeletonCard = () => {
        return (
            <div className={`${styles.grafik} ${styles.skeleton}`}>
                <div className={styles.grafik__main}>
                    <div className={styles.grafik__left}>
                        <div className={`${styles.grafik__left_subtitle} ${styles.skeleton}`}>
                            <SkeletonTheme
                                baseColor="var(--skeleton-base)"
                                highlightColor="var(--skeleton-highlight)"
                            >
                                <Skeleton width={"100%"} height={"100%"} containerClassName={`${styles.grafik__left_icon} ${styles.skeleton}`} />
                            </SkeletonTheme>
                            <div style={{ width: '100%' }}>
                                <h3>
                                    <SkeletonTheme
                                        baseColor="var(--skeleton-base)"
                                        highlightColor="var(--skeleton-highlight)"
                                    >
                                        <Skeleton width={"100%"} height={"100%"} />
                                    </SkeletonTheme>
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className={styles.grafik__right}>
                        <div style={{ width: '70px' }}>
                            <h3>
                                <SkeletonTheme
                                    baseColor="var(--skeleton-base)"
                                    highlightColor="var(--skeleton-highlight)"
                                >
                                    <Skeleton width={"100%"} height={"100%"} />
                                </SkeletonTheme>
                            </h3>
                        </div>
                    </div>
                </div>
                <div className={`${styles.grafik__data}`}>
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
        const [ipGrafik, setIpGrafik] = React.useState(savedState?.hideIp ?? false);
        const [matkulGrafik, setMatkulGrafik] = React.useState(savedState?.hideMatkul ?? false);
        const [sksGrafik, setSksGrafik] = React.useState(savedState?.hideSks ?? false);

        const getLineState = () => {
            if (!ipGrafik && !matkulGrafik && !sksGrafik) {
                return 0;
            } else if (!ipGrafik && !matkulGrafik && sksGrafik) {
                return 4;
            } else if (!ipGrafik && !sksGrafik && matkulGrafik) {
                return 4;
            } else if (!sksGrafik && !matkulGrafik && ipGrafik) {
                return 4;
            } else {
                return !ipGrafik ? 1 : !matkulGrafik ? 2 : !sksGrafik ? 3 : -1;
            }
        }

        const setLineState = (value) => {
            setIpGrafik(value !== 0 && value !== 1);
            setMatkulGrafik(value !== 0 && value !== 2);
            setSksGrafik(value !== 0 && value !== 3);
        };

        const customLegendText = (value, entry, index) => {
            return <span style={{ cursor: 'pointer' }}>{value}</span>
        }

        const CustomTooltip = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                return (
                    <div className={styles.grafik__tooltip}>
                        <p className={styles.grafik__tooltip_title}>{`Semester ${label}`}</p>
                        {payload.map((item, index) => (
                            <p key={`grafik-tooltip-legend-${index}`}>{item?.name && item?.value ? `${item.name} : ${item.value}` : ''}</p>
                        ))}
                    </div>
                )
            }

            return null;
        }

        const statsSemester = getStatsSemester(matkul);
        const data = statsSemester.map(({ totalNilai, totalSks, count, semester }) => ({
            semester,
            ip: (totalNilai / totalSks).toFixed(2),
            matkul: count,
            sks: totalSks,
        }));

        React.useEffect(() => {
            const currentState = {
                hideIp: ipGrafik,
                hideMatkul: matkulGrafik,
                hideSks: sksGrafik
            }
            sessionStorage.setItem('_grafik', JSON.stringify(currentState));
        }, [ipGrafik, matkulGrafik, sksGrafik])

        return (
            <div className={styles.grafik}>
                <div className={styles.grafik__main}>
                    <div className={styles.grafik__left}>
                        <div className={styles.grafik__left_subtitle}>
                            <div style={{ boxShadow: 'var(--box-shadow2)' }} className={styles.grafik__left_icon}>
                                <IoAnalyticsOutline size={'17px'} color={'var(--logo-second-color)'} />
                            </div>
                            <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '500' }}>
                                Grafik
                            </h3>
                        </div>
                    </div>
                    <div className={styles.grafik__right}>
                        <select
                            value={getLineState()}
                            onChange={e => {
                                const x = Number(e.target.value);
                                if (x === 4) { return };
                                setLineState(x);
                            }}
                        >
                            <option value={-1}>
                                Hide
                            </option>
                            {['Semua', 'Ip', 'Matakuliah', 'Sks', 'Kustom'].map((type, index) => (
                                <option key={crypto.randomUUID()} value={index} hidden={index === 4 ? true : false}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.grafik__data}>
                    <ResponsiveContainer width={'100%'} height={'100%'}>
                        <LineChart
                            id="grafik_data-scroll"
                            data={data}
                        >
                            <XAxis dataKey="semester" stroke="var(--infoDark-color)" interval={'equidistantPreserveStart'} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                formatter={customLegendText}
                                onClick={(x) => {
                                    if (x.dataKey === 'ip') { setIpGrafik(!x.inactive) }
                                    else if (x.dataKey === 'matkul') { setMatkulGrafik(!x.inactive) }
                                    else if (x.dataKey === 'sks') { setSksGrafik(!x.inactive) }
                                    else { return; }
                                }}
                            />
                            <Line name="Ip" type="monotone" dataKey="ip" stroke="var(--success-color)" dot={{ fill: 'var(--success-color)' }} hide={ipGrafik} />
                            <Line name="Matakuliah" type="monotone" dataKey="matkul" stroke="var(--warning-color)" dot={{ fill: 'var(--warning-color)' }} hide={matkulGrafik} />
                            <Line name="Sks" type="monotone" dataKey="sks" stroke="var(--danger-color)" dot={{ fill: 'var(--danger-color)' }} hide={sksGrafik} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )
    }

    const ErrorCard = () => {
        return (
            <div className={`${styles.grafik} ${styles.flex}`}>
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
            <div className={`${styles.grafik} ${styles.flex}`}>
                <div className={styles.validating__wrapper}>
                    <div className={styles.validating__content}>
                        <Spinner size={'30px'} color={'var(--logo-second-color)'} />
                    </div>
                </div>
            </div>
        )
    }

    const EmptyCard = () => {
        /** @type {ContextTypes.ModalContext} */
        const {
            setModal,
            setActive,
            setData
        } = React.useContext(ModalContext);

        const handleTambahModal = () => {
            if (!penilaian) { return; }
            setData({ penilaian });
            setModal('tambahMatkul');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        return (
            <div className={`${styles.grafik} ${styles.flex}`}>
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

/**
 * Props yang digunakan component `Target`
 * @typedef {Object} TargetProps
 * @property {CardState} state
 * Card state
 * @property {Array<SupabaseTypes.MatkulData>} matkul
 * Array yang berisikan user matakuliah
 * @property {SupabaseTypes.UniversitasData['penilaian']} penilaian
 * User `penilaian` yang digunakan
 * @property {CardTargetState} savedState
 * State card `Target` yang diperoleh dari `sessionStorage`
 */

/**
 * Card yang menampilkan jumlah matakuliah user yang `ontarget` dan tidak
 * @param {TargetProps} props Target props
 * @returns {React.ReactElement} Rendered component
 */
export function Target({ state, matkul, penilaian, savedState }) {
    const userIdCookie = useCookies().get('s_user_id');
    const handleRetry = () => {
        mutate(['/api/matkul', userIdCookie])
    }

    const SkeletonCard = () => {
        return (
            <div className={`${styles.target} ${styles.skeleton}`}>
                <div className={styles.target__main}>
                    <div className={styles.target__left}>
                        <div className={`${styles.target__left_subtitle} ${styles.skeleton}`}>
                            <SkeletonTheme
                                baseColor="var(--skeleton-base)"
                                highlightColor="var(--skeleton-highlight)"
                            >
                                <Skeleton width={"100%"} height={"100%"} containerClassName={`${styles.target__left_icon} ${styles.skeleton}`} />
                            </SkeletonTheme>
                            <div style={{ width: '100%' }}>
                                <h3>
                                    <SkeletonTheme
                                        baseColor="var(--skeleton-base)"
                                        highlightColor="var(--skeleton-highlight)"
                                    >
                                        <Skeleton width={"100%"} height={"100%"} />
                                    </SkeletonTheme>
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className={styles.target__right}>
                        <div style={{ width: '70px' }}>
                            <h3>
                                <SkeletonTheme
                                    baseColor="var(--skeleton-base)"
                                    highlightColor="var(--skeleton-highlight)"
                                >
                                    <Skeleton width={"100%"} height={"100%"} />
                                </SkeletonTheme>
                            </h3>
                        </div>
                    </div>
                </div>
                <div className={styles.target__data}>
                    <h3 className={styles.target__data_title}>
                        <SkeletonTheme
                            baseColor="var(--skeleton-base)"
                            highlightColor="var(--skeleton-highlight)"
                        >
                            <Skeleton width={"30%"} height={"90%"} />
                        </SkeletonTheme>
                    </h3>
                    <SkeletonTheme
                        baseColor="var(--skeleton-base)"
                        highlightColor="var(--skeleton-highlight)"
                        borderRadius={".5rem"}
                    >
                        <Skeleton width={"100%"} height={"90%"} />
                    </SkeletonTheme>
                    <SkeletonTheme
                        baseColor="var(--skeleton-base)"
                        highlightColor="var(--skeleton-highlight)"
                        borderRadius={".5rem"}
                    >
                        <Skeleton width={"100%"} height={"90%"} />
                    </SkeletonTheme>
                </div>
                <div className={styles.target__swiper_nav}>
                    <div className={`${styles.box} ${styles.skeleton}`}>
                        <IoIosArrowUp size={'75%'} />
                    </div>
                    <div className={`${styles.box} ${styles.skeleton}`}>
                        <IoIosArrowDown size={'75%'} />
                    </div>
                </div>
            </div>
        )
    }

    const LoadedCard = () => {
        const [type, setType] = React.useState(savedState?.tab ?? 0);
        const [swiperIndex, setSwiperIndex] = React.useState(savedState?.swiperIndex ?? 0);
        const swiperRef = React.useRef();
        const target = getOnAndOffTarget(matkul);

        const setColumnFilters = (semester, onTarget) => {
            const currentState = getSessionTable();
            const newState = {
                ...currentState,
                columnFilters: [{ id: "semester", value: [`${semester}`, `${semester}`] }, { id: "ontarget", value: onTarget }]
            }
            sessionStorage.setItem('_table', JSON.stringify(newState));
            window.dispatchEvent(new Event('on-table-session-changes'));
        }

        React.useEffect(() => {
            const currentState = {
                tab: type,
                swiperIndex: swiperIndex
            }
            sessionStorage.setItem('_target', JSON.stringify(currentState));
        }, [type, swiperIndex])

        return (
            <div className={styles.target}>
                <div className={styles.target__main}>
                    <div className={styles.target__left}>
                        <div className={styles.target__left_subtitle}>
                            <div style={{ boxShadow: 'var(--box-shadow2)' }} className={styles.target__left_icon}>
                                <TbTarget size={'17px'} color={'var(--logo-second-color)'} />
                            </div>
                            <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '500' }}>
                                Target
                            </h3>
                        </div>
                    </div>
                    <div className={styles.target__right}>
                        <select
                            value={type}
                            onChange={e => setType(Number(e.target.value))}
                        >
                            {['Matakuliah', 'Sks'].map((item, index) => (
                                <option key={crypto.randomUUID()} value={index}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <Swiper
                    modules={[Navigation]}
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onSlideChangeTransitionEnd={(swiper) => setSwiperIndex(swiper.realIndex)}
                    direction={'vertical'}
                    initialSlide={swiperIndex}
                    loop={target.length >= 3 ? true : false}
                    slidesPerView={1}
                    spaceBetween={15}
                    style={{
                        "width": "100%",
                        "height": "100%",
                    }}
                >
                    {target.map((item, index) => {
                        return (
                            <SwiperSlide className={styles.target__data} key={crypto.randomUUID()}>
                                <h3 className={styles.target__data_title}>Semester {item.semester}</h3>
                                <div className={styles.target__data_box}>
                                    <div className={styles.icon}>
                                        <TbTargetArrow color={'var(--success-color)'} size={'75%'} />
                                    </div>
                                    <div className={`${styles.details} ${styles.hit}`}>
                                        <h3>
                                            {type === 0 ? item.on_target.matkul : type === 1 ? item.on_target.sks : '-'}<span className={type === 0 ? styles.matkul : type === 1 ? styles.sks : styles.hide} />
                                        </h3>
                                        <small>On Target</small>
                                    </div>
                                    <div className={styles.more}>
                                        <small onClick={() => { setColumnFilters(item.semester, true) }} />
                                    </div>
                                </div>

                                <div className={styles.target__data_box}>
                                    <div className={styles.icon}>
                                        <TbTargetOff color={'var(--warning-color)'} size={'75%'} />
                                    </div>
                                    <div className={`${styles.details} ${styles.unhit}`}>
                                        <h3>
                                            {type === 0 ? item.off_target.matkul : type === 1 ? item.off_target.sks : '-'}<span className={type === 0 ? styles.matkul : type === 1 ? styles.sks : styles.hide} />
                                        </h3>
                                        <small>Off Target</small>
                                    </div>
                                    <div className={styles.more}>
                                        <small onClick={() => { setColumnFilters(item.semester, false) }} />
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
                <div className={styles.target__swiper_nav}>
                    <div className={styles.box} onClick={() => swiperRef.current?.slidePrev()}>
                        <IoIosArrowUp size={'75%'} />
                    </div>
                    <div className={styles.box} onClick={() => swiperRef.current?.slideNext()}>
                        <IoIosArrowDown size={'75%'} />
                    </div>
                </div>
            </div>
        )
    }

    const ErrorCard = () => {
        return (
            <div className={`${styles.target} ${styles.flex}`}>
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
            <div className={`${styles.target} ${styles.flex}`}>
                <div className={styles.validating__wrapper}>
                    <div className={styles.validating__content}>
                        <Spinner size={'30px'} color={'var(--logo-second-color)'} />
                    </div>
                </div>
            </div>
        )
    }

    const EmptyCard = () => {
        /** @type {ContextTypes.ModalContext} */
        const {
            setModal,
            setActive,
            setData
        } = React.useContext(ModalContext);

        const handleTambahModal = () => {
            if (!penilaian) { return; }
            setData({ penilaian });
            setModal('tambahMatkul');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        return (
            <div className={`${styles.target} ${styles.flex}`}>
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

/**
 * Props yang digunakan component `Distribusi`
 * @typedef {Object} DistribusiProps
 * @property {CardState} state
 * Card state
 * @property {Array<SupabaseTypes.MatkulData>} matkul
 * Array yang berisikan user matakuliah
 * @property {SupabaseTypes.UniversitasData['penilaian']} penilaian
 * User `penilaian` yang digunakan
 * @property {CardDistribusiState} savedState
 * State card `Distribusi` yang diperoleh dari `sessionStorage`
 */

/**
 * Card yang menampilkan distribusi matakuliah user
 * @param {DistribusiProps} props Distribusi props
 * @returns {React.ReactElement} Rendered component
 */
export function Distribusi({ state, matkul, penilaian, savedState }) {
    const userIdCookie = useCookies().get('s_user_id');
    const handleRetry = () => {
        mutate(['/api/matkul', userIdCookie])
    }

    const SkeletonCard = () => {
        return (
            <div className={`${styles.distribusi} ${styles.skeleton}`}>
                <div className={styles.distribusi__main}>
                    <div className={styles.distribusi__left}>
                        <div className={`${styles.distribusi__left_subtitle} ${styles.skeleton}`}>
                            <SkeletonTheme
                                baseColor="var(--skeleton-base)"
                                highlightColor="var(--skeleton-highlight)"
                            >
                                <Skeleton width={"100%"} height={"100%"} containerClassName={`${styles.grafik__left_icon} ${styles.skeleton}`} />
                            </SkeletonTheme>
                            <div style={{ width: '100%' }}>
                                <h3>
                                    <SkeletonTheme
                                        baseColor="var(--skeleton-base)"
                                        highlightColor="var(--skeleton-highlight)"
                                    >
                                        <Skeleton width={"100%"} height={"100%"} />
                                    </SkeletonTheme>
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className={styles.distribusi__right}>
                        <div style={{ width: '70px' }}>
                            <h3>
                                <SkeletonTheme
                                    baseColor="var(--skeleton-base)"
                                    highlightColor="var(--skeleton-highlight)"
                                >
                                    <Skeleton width={"100%"} height={"100%"} />
                                </SkeletonTheme>
                            </h3>
                        </div>
                    </div>
                </div>
                <div className={styles.distribusi__data}>
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
        const [semester, setSemester] = React.useState(savedState?.tab ? getAllSemester(matkul).includes(savedState.tab) ? savedState.tab : -1 : -1);
        const [matkulBar, setMatkulBar] = React.useState(savedState?.hideMatkul ?? false);
        const [sksBar, setSksBar] = React.useState(savedState?.hideSks ?? false);

        const emptyData = penilaian ? Object.keys(penilaian).map(nilai => ({
            nilai,
            matkul: 0,
            sks: 0,
            weight: penilaian[nilai].weight
        })) : [
            { "nilai": "A", "matkul": 0, "sks": 0 },
            { "nilai": "B", "matkul": 0, "sks": 0 },
            { "nilai": "C", "matkul": 0, "sks": 0 },
            { "nilai": "D", "matkul": 0, "sks": 0 },
        ];

        const data = getDistribusiNilai(matkul, penilaian, false);

        const customLegendText = (value, entry, index) => {
            return <span style={{ cursor: 'pointer' }}>{value}</span>
        }

        const CustomTooltip = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                return (
                    <div className={styles.distribusi__tooltip}>
                        <p className={styles.distribusi__tooltip_title}>{`${label}`}</p>
                        {payload.map((item, index) => (
                            <p key={`distribusi-tooltip-legend-${index}`}>{`${item.name} : ${item.value}`}</p>
                        ))}
                    </div>
                )
            }

            return null;
        }

        const CustomAxisX = ({ x, y, stroke, payload }) => {
            const nilai = payload.value;
            const color = penilaian[nilai]?.style ? `var(--${penilaian[nilai].style}-color)` : 'var(--dark-color)';
            return (
                <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={10} textAnchor="middle" fill={color}>
                        {nilai}
                    </text>
                </g>
            )
        }

        React.useEffect(() => {
            const currentState = {
                tab: semester,
                hideMatkul: matkulBar,
                hideSks: sksBar
            }
            sessionStorage.setItem('_distribusi', JSON.stringify(currentState));
        }, [semester, matkulBar, sksBar])

        return (
            <div className={styles.distribusi}>
                <div className={styles.distribusi__main}>
                    <div className={styles.distribusi__left}>
                        <div className={styles.distribusi__left_subtitle}>
                            <div style={{ boxShadow: 'var(--box-shadow2)' }} className={styles.distribusi__left_icon}>
                                <TbAntennaBars5 size={'17px'} color={'var(--logo-second-color)'} />
                            </div>
                            <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '500' }}>
                                Distribusi
                            </h3>
                        </div>
                    </div>
                    <div className={styles.distribusi__right}>
                        <select
                            value={semester}
                            onChange={e => {
                                const x = Number(e.target.value);
                                setSemester(x);
                            }}
                        >
                            <option value={-1}>
                                Semua
                            </option>
                            {
                                getAllSemester(matkul, true).map((item, index) => (
                                    <option key={crypto.randomUUID()} value={item}>
                                        Semester {item}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className={styles.distribusi__data}>
                    <ResponsiveContainer width={'100%'} height={'100%'}>
                        <BarChart
                            id="distribusi_data-scroll"
                            data={semester === -1 ? data['semua'] : data[`semester${semester}`] ? data[`semester${semester}`] : emptyData}
                        >
                            <XAxis dataKey="nilai" stroke="var(--infoDark-color)" tick={<CustomAxisX />} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accordion-bg-color)', strokeWidth: 1 }} />
                            <Legend
                                formatter={customLegendText}
                                onClick={(x) => {
                                    if (x.dataKey === 'matkul') { setMatkulBar(!x.inactive) }
                                    else if (x.dataKey === 'sks') { setSksBar(!x.inactive) }
                                    else { return; }
                                }}
                            />
                            <Bar name="Matakuliah" dataKey="matkul" fill="var(--first-color-lighter)" hide={matkulBar} />
                            <Bar name="Sks" dataKey="sks" fill="var(--second-color-lighter)" hide={sksBar} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )
    }

    const ErrorCard = () => {
        return (
            <div className={`${styles.distribusi} ${styles.flex}`}>
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
            <div className={`${styles.distribusi} ${styles.flex}`}>
                <div className={styles.validating__wrapper}>
                    <div className={styles.validating__content}>
                        <Spinner size={'30px'} color={'var(--logo-second-color)'} />
                    </div>
                </div>
            </div>
        )
    }

    const EmptyCard = () => {
        /** @type {ContextTypes.ModalContext} */
        const {
            setModal,
            setActive,
            setData
        } = React.useContext(ModalContext);

        const handleTambahModal = () => {
            if (!penilaian) { return; }
            setData({ penilaian });
            setModal('tambahMatkul');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        return (
            <div className={`${styles.distribusi} ${styles.flex}`}>
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

/**
 * Props yang digunakan component `Progress`
 * @typedef {Object} ProgressProps
 * @property {CardState} state
 * Card state
 * @property {Array<SupabaseTypes.UserData>} user
 * Array yang berisikan user data
 * @property {Array<SupabaseTypes.MatkulData>} matkul
 * Array yang berisikan user matakuliah
 * @property {SupabaseTypes.UniversitasData['penilaian']} penilaian
 * User `penilaian` yang digunakan
 */

/**
 * Card yang menampilkan overall progress user matakuliah, sks dan indeks prestasi
 * @param {ProgressProps} props Progress props
 * @returns {React.ReactElement} Rendered component
 */
export function Progress({ state, user, matkul, penilaian }) {
    const userIdCookie = useCookies().get('s_user_id');
    const handleRetry = () => {
        mutate(['/api/matkul', userIdCookie])
        mutate(['/api/me', userIdCookie])
    }

    const SkeletonCard = () => {
        return (
            <div className={`${styles.progress} ${styles.skeleton}`}>
                <div className={styles.progress__main}>
                    <div className={styles.progress__left}>
                        <div className={`${styles.progress__left_subtitle} ${styles.skeleton}`}>
                            <SkeletonTheme
                                baseColor="var(--skeleton-base)"
                                highlightColor="var(--skeleton-highlight)"
                            >
                                <Skeleton width={"100%"} height={"100%"} containerClassName={`${styles.progress__left_icon} ${styles.skeleton}`} />
                            </SkeletonTheme>
                            <div style={{ width: '100%' }}>
                                <h3>
                                    <SkeletonTheme
                                        baseColor="var(--skeleton-base)"
                                        highlightColor="var(--skeleton-highlight)"
                                    >
                                        <Skeleton width={"100%"} height={"100%"} />
                                    </SkeletonTheme>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.progress__data}>
                    {Array.from({ length: 3 }, (_, index) => (
                        <div className={styles.skeleton} key={crypto.randomUUID()}>
                            <SkeletonTheme
                                baseColor="var(--skeleton-base)"
                                highlightColor="var(--skeleton-highlight)"
                            >
                                <Skeleton width={"100%"} height={"100%"} />
                            </SkeletonTheme>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const LoadedCard = () => {
        return (
            <div className={styles.progress}>
                <div className={styles.progress__main}>
                    <div className={styles.progress__left}>
                        <div className={styles.progress__left_subtitle}>
                            <div style={{ boxShadow: 'var(--box-shadow2)' }} className={styles.target__left_icon}>
                                <TbAtom size={'17px'} color={'var(--logo-second-color)'} />
                            </div>
                            <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '500' }}>
                                Progress
                            </h3>
                        </div>
                    </div>
                </div>
                <div className={styles.progress__data}>
                    <div className={`${styles.wrapper} ${styles.sks}`}>
                        <div className={styles.top}>
                            <h3>SKS</h3>
                            <div className={styles.details}>
                                <CountUp
                                    start={0}
                                    duration={2.5}
                                    decimals={Number.isInteger(getUserSks(matkul)) ? 0 : 2}
                                    end={getUserSks(matkul)}
                                    delay={0}
                                >
                                    {({ countUpRef }) => (
                                        <h3 ref={countUpRef} />
                                    )}
                                </CountUp>
                                <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '400' }}>|</h3>
                                <small style={{ color: 'var(--infoDark-color)' }}>{user[0]?.sks_target || '-'}</small>
                            </div>
                        </div>
                        <ProgressBar
                            completed={getUserSksPercentage(user, matkul)}
                            maxCompleted={100}
                            height={'100%'}
                            isLabelVisible={false}
                            baseBgColor={'var(--inner-color-bg1)'}
                            borderRadius={'.25rem'}
                            bgColor={'var(--danger-color)'}
                            animateOnRender={true}
                            transitionDuration={'2.5s'}
                        />
                    </div>
                    <div className={`${styles.wrapper} ${styles.matkul}`}>
                        <div className={styles.top}>
                            <h3>Matakuliah</h3>
                            <div className={styles.details}>
                                <CountUp
                                    start={0}
                                    duration={2.5}
                                    decimals={Number.isInteger(getUserMatkul(matkul)) ? 0 : 2}
                                    end={getUserMatkul(matkul)}
                                    delay={0}
                                >
                                    {({ countUpRef }) => (
                                        <h3 ref={countUpRef} />
                                    )}
                                </CountUp>
                                <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '400' }}>|</h3>
                                <small style={{ color: 'var(--infoDark-color)' }}>{user[0]?.matkul_target || '-'}</small>
                            </div>
                        </div>
                        <ProgressBar
                            completed={getUserMatkulPercentage(user, matkul)}
                            maxCompleted={100}
                            height={'100%'}
                            isLabelVisible={false}
                            baseBgColor={'var(--inner-color-bg1)'}
                            borderRadius={'.25rem'}
                            bgColor={'var(--warning-color)'}
                            animateOnRender={true}
                            transitionDuration={'2.5s'}
                        />
                    </div>
                    <div className={`${styles.wrapper} ${styles.ipk}`}>
                        <div className={styles.top}>
                            <h3>IPK</h3>
                            <div className={styles.details}>
                                <CountUp
                                    start={0}
                                    duration={2.5}
                                    decimals={Number.isInteger(getUserIpk(matkul)) ? 0 : 2}
                                    end={getUserIpk(matkul)}
                                    delay={0}
                                >
                                    {({ countUpRef }) => (
                                        <h3 ref={countUpRef} />
                                    )}
                                </CountUp>
                                <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '400' }}>|</h3>
                                <small style={{ color: 'var(--infoDark-color)' }}>{user[0]?.ipk_target || '-'}</small>
                            </div>
                        </div>
                        <ProgressBar
                            completed={getUserIpkPercentage(user, matkul)}
                            maxCompleted={100}
                            height={'100%'}
                            isLabelVisible={false}
                            baseBgColor={'var(--inner-color-bg1)'}
                            borderRadius={'.25rem'}
                            bgColor={'var(--success-color)'}
                            animateOnRender={true}
                            transitionDuration={'2.5s'}
                        />
                    </div>
                </div>
            </div>
        )
    }

    const ErrorCard = () => {
        return (
            <div className={`${styles.progress} ${styles.flex}`}>
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
            <div className={`${styles.progress} ${styles.flex}`}>
                <div className={styles.validating__wrapper}>
                    <div className={styles.validating__content}>
                        <Spinner size={'30px'} color={'var(--logo-second-color)'} />
                    </div>
                </div>
            </div>
        )
    }

    const EmptyCard = () => {
        /** @type {ContextTypes.ModalContext} */
        const {
            setModal,
            setActive,
            setData
        } = React.useContext(ModalContext);

        const handleTambahModal = () => {
            if (!penilaian) { return; }
            setData({ penilaian });
            setModal('tambahMatkul');
            setTimeout(() => {
                setActive(true);
            }, 50)
        }

        return (
            <div className={`${styles.progress} ${styles.flex}`}>
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

/**
 * Props yang digunakan component `AcademicCard`
 * @typedef {Object} AcademicCardProps
 * @property {number} count
 * Jumlah card yang tampil
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 * Array yang berisikan data universitas
 */

/**
 * Component yang menampilkan user matakuliah, sks dan indeks prestasi progress dengan card {@link Summary} dilengkapi dengan hook `swr` untuk memperoleh data yang dibutuhkan.
 * 
 * Hook tersebut juga mengontrol {@link CardState} dari card tersebut
 * @param {AcademicCardProps} props AcademicCard props
 * @returns {React.ReactElement} Rendered component
 */
export function AcademicCard({ count, universitas }) {
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const isError = userError || matkulError;
    const isLoading = userLoading || matkulLoading;
    const isValidating = userValidating || matkulValidating;

    if (isError) {
        const errorCount = Array.from({ length: count }, (_, index) => (
            <Summary state='error' key={crypto.randomUUID()} />
        ));
        return <>{errorCount}</>;
    }

    if (isLoading) {
        const loadingCount = Array.from({ length: count }, (_, index) => (
            <Summary state='loading' key={crypto.randomUUID()} />
        ));
        return <>{loadingCount}</>;
    }

    if (isValidating) {
        const validatingCount = Array.from({ length: count }, (_, index) => (
            <Summary state='validating' key={crypto.randomUUID()} />
        ));
        return <>{validatingCount}</>;
    }

    if (!matkul.length) {
        const emptyCount = Array.from({ length: count }, (_, index) => (
            <Summary state='empty' penilaian={universitas[user[0].university_id - 1].penilaian} key={crypto.randomUUID()} />
        ));
        return <>{emptyCount}</>;
    }

    return (
        <>
            <Summary
                state='loaded'
                color='var(--danger-color)'
                icon={{ name: 'MdOutlineConfirmationNumber', lib: 'md' }}
                data={{ value: getUserSks(matkul), percentage: getUserSksPercentage(user, matkul), keterangan: `${user.length !== 0 ? `Targetmu ${user[0].sks_target}` : `Terakhir diupdate`}` }}
                title={'SKS'}
                penilaian={universitas[user[0].university_id - 1].penilaian}
            >
            </Summary>

            <Summary
                state='loaded'
                color='var(--warning-color)'
                icon={{ name: 'IoBookOutline', lib: 'io5' }}
                data={{ value: getUserMatkul(matkul), percentage: getUserMatkulPercentage(user, matkul), keterangan: `${user.length !== 0 ? `Targetmu ${user[0].matkul_target}` : `Terakhir diupdate`}` }}
                title={'Matakuliah'}
                penilaian={universitas[user[0].university_id - 1].penilaian}
            >
            </Summary>

            <Summary
                state='loaded'
                color='var(--success-color)'
                icon={{ name: 'FaRegStar', lib: 'fa' }}
                data={{ value: getUserIpk(matkul), percentage: getUserIpkPercentage(user, matkul), keterangan: `${user.length !== 0 ? `Targetmu ${parseFloat(user[0].ipk_target).toFixed(2)}` : `Terakhir diupdate`}` }}
                title={'IPK'}
                penilaian={universitas[user[0].university_id - 1].penilaian}
            >
            </Summary>
        </>
    )
}

/**
 * Props yang digunakan component `UpdateCard`
 * @typedef {Object} UpdateCardProps
 * @property {Array<SupabaseTypes.NotifikasiData>} notifikasi
 * Array yang berisikan notifikasi data
 */

/**
 * Component yang menampilkan notifikasi dengan card {@link Notification} dan mengatur {@link CardState} dari card tersebut
 * @param {UpdateCardProps} props UpdateCard props
 * @returns {React.ReactElement} Rendered component
 */
export function UpdateCard({ notifikasi }) {
    if (!notifikasi) {
        return (
            <Notification state={'error'} />
        )
    }

    if (!notifikasi.length) {
        return (
            <Notification state={'empty'} />
        )
    }

    return (
        <Notification state={'loaded'} data={notifikasi} />
    )
}

/**
 * Props yang digunakan component `HistoryCard`
 * @typedef {Object} HistoryCardProps
 * @property {number} count
 * Jumlah card yang tampil
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 * Array yang berisikan data universitas
 */

/**
 * Component yang menampilkan user matakuliah history dengan card {@link History} dilengkapi dengan hook `swr` untuk memperoleh data yang dibutuhkan.
 * 
 * Hook tersebut juga mengontrol {@link CardState} dari card tersebut
 * @param {React.HTMLAttributes & HistoryCardProps} props HistoryCard props
 * @returns {React.ReactElement} Rendered component
 */
export function HistoryCard({ count, universitas }) {
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: matkulHistory, error: matkulHistoryError, isLoading: matkulHistoryLoading, isValidating: matkulHistoryValidating } = useMatkulHistory();
    const isError = userError || matkulHistoryError;
    const isLoading = userLoading || matkulHistoryLoading;
    const isValidating = userValidating || matkulHistoryValidating;

    if (isError) {
        return (
            <History state={'error'} />
        )
    }

    if (isLoading) {
        return (
            <History state={'loading'} />
        )
    }

    if (isValidating) {
        return (
            <History state={'validating'} />
        )
    }

    if (!matkulHistory.length) {
        return (
            <History state={'empty'} penilaian={universitas[user[0].university_id - 1].penilaian} />
        )
    }

    return (
        <History state={'loaded'} data={matkulHistory} penilaian={universitas[user[0].university_id - 1].penilaian} count={count} />
    )
}