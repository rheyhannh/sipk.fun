'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
import * as SupabaseTypes from '@/types/supabase';
import { MatkulDummiesProps } from '@/constant/matkul_dummies';
import { HTMLMotionProps } from 'framer-motion';
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
import { DashboardContext } from "@dashboard_page/provider";
import { ModalContext } from "./modal/provider";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import CountUp, { CountUpProps } from 'react-countup';
import ProgressBar from "@ramonak/react-progress-bar";
import { LineChart, Line, BarChart, Bar, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ReactIcons from '../loader/ReactIcons';
import { Spinner } from "./loader/Loading";
import { motion } from 'framer-motion';
// #endregion

// #region UTIL DEPEDENCY
import {
    getUserMatkul, getUserMatkulPercentage,
    getUserSks, getUserSksPercentage,
    getUserIpk, getUserIpkPercentage,
    getAllSemester, getStatsSemester,
    getOnAndOffTarget, getDistribusiNilai,
} from "@/utils/users/stats";
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
import { FaInfo, FaUndo, FaRegStar } from "react-icons/fa";
import { IoAnalyticsOutline, IoAddOutline, IoBookOutline } from "react-icons/io5";
import { TbTarget, TbTargetArrow, TbTargetOff, TbAtom, TbAntennaBars5 } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineConfirmationNumber } from "react-icons/md";
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

/**
 * Opsi animasi yang digunakan pada card `Dummy`
 * @typedef {Object} animOptions
 * @property {number} [duration]
 * Durasi animasi dalam `ms`
 * - Default : `1500`
 * @property {number} [delay]
 * Delay animasi dalam `ms`
 * - Default : `0`
 */
// #endregion

const SUMMARY_STATIC_ICONS = {
    MdOutlineConfirmationNumber: <MdOutlineConfirmationNumber size={'24px'} />,
    FaRegStar: <FaRegStar size={'24px'} />,
    IoBookOutline: <IoBookOutline size={'24px'} />,
}

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
 * Card yang menampilkan overall user data seperti total sks, total matakuliah, ipk dan lainnya.
 * 
 * Method ini berfungsi sebagai controller bagaimana card harus dirender berdasarkan `state` berikut,
 * - `loading` : Card summary saat loading, menampilkan skeleton
 * - `validating` : Card summary saat validating, menampilkan spinner
 * - `empty` : Card summary saat konten masih kosong, menampilkan button untuk menambah mata kuliah
 * - `error` : Card summary saat error atau data tidak dapat diperoleh, menampilkan button untuk retry
 * - `loaded` : Card summary saat tidak ada masalah
 * 
 * Selain state diatas, method ini akan return `null`
 * @param {SummaryProps} props Summary props
 * @returns {React.ReactElement | null} Rendered component
 */
export function Summary({ state, icon, color, title, data, penilaian }) {
    if (state === 'loading') return <SummarySkeleton />;
    if (state === 'validating') return <SummaryValidating />;
    if (state === 'empty') return <SummaryEmpty penilaian={penilaian} />;
    if (state === 'error') return <SummaryError />;
    if (state === 'loaded') return <SummaryLoaded icon={icon} color={color} title={title} data={data} />;

    return null;
}

/**
 * Card summary dengan state `loading`, menampilkan skeleton dengan layout yang sudah disesuaikan
 * @returns {React.ReactElement} Rendered component
 */
const SummarySkeleton = () => (
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

/**
 * Card summary dengan state `validating`, menampilkan spinner dengan layout yang sudah disesuaikan
 * @returns {React.ReactElement} Rendered component
 */
const SummaryValidating = () => (
    <div className={styles.summary}>
        <div className={styles.validating__wrapper}>
            <div className={styles.validating__content}>
                <Spinner size={'30px'} color={'var(--logo-second-color)'} />
            </div>
        </div>
    </div>
)

/**
 * Card summary dengan state `empty`, menampilkan button untuk menambah mata kuliah
 * @param {Pick<SummaryProps,'penilaian'>} props SummaryEmpty props
 * @returns {React.ReactElement} Rendered component
 */
const SummaryEmpty = ({ penilaian }) => {
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
                <div className={styles.empty__content} onClick={handleTambahModal}>
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

/**
 * Card summary dengan state `error`, menampilkan button untuk retry fetch user data
 * @returns {React.ReactElement} Rendered component
 */
const SummaryError = () => {
    const userIdCookie = useCookies().get('s_user_id');

    const handleRetry = () => {
        mutate(['/api/matkul', userIdCookie])
        mutate(['/api/me', userIdCookie])
    }

    return (
        <div className={styles.summary}>
            <div className={styles.error__wrapper}>
                <div className={styles.error__content} onClick={handleRetry}>
                    <h5>Gagal mengambil data</h5>
                    <h1>&#x21bb;</h1>
                </div>
            </div>
        </div>
    )
}

/**
 * Card summary dengan state `loaded`
 * @param {Omit<SummaryProps,'state'|'penilaian'>} props SummaryLoaded props
 * @returns {React.ReactElement} Rendered component
 */
const SummaryLoaded = ({ icon, color, title, data }) => {
    const [dashArray, setDashArray] = React.useState('0 999');

    const getCircleDraw = (radius, percentage) => {
        const roundCircum = 2 * radius * Math.PI;
        const roundDraw = percentage * roundCircum / 100;
        return `${roundDraw.toFixed(2)} 999`;
    }

    React.useEffect(() => {
        if (data) {
            setDashArray(getCircleDraw(35, data.percentage));
        }
    }, [data])

    return (
        <div className={`${styles.summary}`}>
            <div style={{ background: color ? color : 'var(--first-color)' }} className={styles.summary__icon}>
                {SUMMARY_STATIC_ICONS[icon?.name] ?? (
                    <ReactIcons name={icon?.name ?? 'FaRocket'} lib={icon?.lib ?? 'fa'} size={'24px'} />
                )}
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
                        preserveValue={true}
                    >
                        {({ countUpRef }) => (
                            <h1
                                ref={countUpRef} />
                        )}
                    </CountUp>
                </div>
                <div className={styles.summary__progress}>
                    <svg
                        className={styles.summary__progress_circle}
                        style={{
                            stroke: color ? color : 'var(--first-color)',
                            strokeDasharray: dashArray
                        }}
                    >
                        <circle cx='50%' cy='50%' r='35'></circle>
                    </svg>
                    <CountUp
                        start={0}
                        end={data.percentage}
                        duration={2.5}
                        delay={0}
                        suffix={'%'}
                        preserveValue={true}
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

/**
 * Card `Summary` versi dummy, dimana hanya menggunakan data statis
 * @param {Omit<SummaryProps, 'state' | 'penilaian'> & React.HTMLProps<HTMLDivElement>} props Summary props
 * @returns {React.ReactElement} Rendered component
 */
export function SummaryDummy({ icon, color, title, data, ...props }) {
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
        <div {...props} className={`${styles.summary}`}>
            <div style={{ background: color ? color : 'var(--first-color)' }} className={styles.summary__icon}>
                {SUMMARY_STATIC_ICONS[icon?.name] ?? (
                    <ReactIcons name={icon?.name ?? 'FaRocket'} lib={icon?.lib ?? 'fa'} size={'24px'} />
                )}
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
                        preserveValue={true}
                    >
                        {({ countUpRef }) => (
                            <h1
                                ref={countUpRef} />
                        )}
                    </CountUp>
                </div>
                <div className={styles.summary__progress}>
                    <svg
                        className={styles.summary__progress_circle}
                        style={{
                            stroke: color ? color : 'var(--first-color)',
                            strokeDasharray: dashArray
                        }}
                    >
                        <circle cx='50%' cy='50%' r='35'></circle>
                    </svg>
                    <CountUp
                        start={0}
                        end={data.percentage}
                        duration={2.5}
                        delay={0}
                        suffix={'%'}
                        preserveValue={true}
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
                                            {(item?.icon?.name && item?.icon?.lib) &&
                                                <ReactIcons name={item.icon.name} lib={item.icon.lib} />
                                            }
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
                                                {(item?.icon?.name && item?.icon?.lib) &&
                                                    <ReactIcons name={item.icon.name} lib={item.icon.lib} />
                                                }
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
 * Props yang digunakan component `NotificationDummy`
 * @typedef {Object} NotificationDummyProps
 * @property {Array<import('@/types/supabase').NotifikasiData>} data
 * Array yang berisikan notifikasi
 * 
 * - Defult : `[]`
 * @property {boolean} [isPhoneContent]
 * Boolean untuk menggunakan layout kecil untuk smartphone. 
 * Saat truthy ini akan dirender dengan Swipper.
 * 
 * - Default : `false`
 */

/**
 * Card `Notification` versi dummy, dimana hanya menggunakan data statis
 * @param {React.HTMLProps<HTMLDivElement> & NotificationDummyProps} props NotificationDummy props
 * @returns {React.ReactElement} Rendered component
 */
export function NotificationDummy({ data = [], isPhoneContent = false, ...props }) {
    if (isPhoneContent) return (
        <div className={`${styles.notification} ${styles.swiper}`} {...props}>
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
                            <span className={`${styles.notification__post} ${styles.swiper}`}>
                                <div className={styles.notification__main}>
                                    <span style={{ color: item.color }}>
                                        {(item?.icon?.name && item?.icon?.lib) &&
                                            <ReactIcons name={item.icon.name} lib={item.icon.lib} />
                                        }
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
                            </span>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    )
    else return (
        <div className={styles.notification} {...props}>
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
                        <span className={styles.notification__post} key={crypto.randomUUID()}>
                            <div className={styles.notification__main}>
                                <span style={{ color: item.color }}>
                                    {(item?.icon?.name && item?.icon?.lib) &&
                                        <ReactIcons name={item.icon.name} lib={item.icon.lib} />
                                    }
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
                        </span>
                    )
                })}
            </div>
        </div>
    )
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
 * Props yang digunakan component `HistoryDummy`
 * @typedef {Object} HistoryDummyProps
 * @property {MatkulDummiesProps} item
 * @property {'success'|'warning'|'danger'|'crimson'} color
 * @property {number} semester
 */

/**
 * Card `History` versi dummy, dimana hanya menggunakan data statis
 * @param {HTMLMotionProps<'div'> & HistoryDummyProps} props History dummy props
 * @returns {React.ReactElement} Rendered component
 */
export function HistoryDummy({ item, color = 'success', semester, ...props }) {
    return (
        <motion.div
            className={styles.history}
            {...props}
        >
            <div className={styles.history__content}>
                <div className={`${styles.history__icon} ${styles.tambah}`}>
                    <IoAddOutline size={'24px'} />
                </div>
                <div className={styles.history__details}>
                    <h4 style={{ color: 'var(--dark-color)' }}>
                        {item?.nama ?? 'Nama Matakuliah'}
                    </h4>
                    <small style={{ fontSize: '0.7rem' }}>
                        Semester {semester ?? item?.semester ?? 1}
                    </small>
                </div>
                <div className={styles.history__value}>
                    <h6 style={{ color: `var(--${color}-color)` }}>
                        {item?.nilai ?? 'A'}
                    </h6>
                    <h6 style={{ color: 'var(--dark-color)' }}>
                        {item?.sks ?? '3'} SKS
                    </h6>
                </div>
            </div>
        </motion.div>
    )
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

        const setColumnFilters = (semester) => {
            const currentState = getSessionTable();
            const newState = {
                ...currentState,
                columnFilters: [{ id: "semester", value: [`${semester}`, `${semester}`] }]
            }
            sessionStorage.setItem('_table', JSON.stringify(newState));
            window.dispatchEvent(new Event('on-table-session-changes'));
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
                                Grafik Akademik
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
                            onClick={(x) => {
                                if (x.activeLabel) setColumnFilters(x.activeLabel);
                            }}
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
 * Props yang digunakan component `GrafikDummy`
 * @typedef {Object} GrafikDummyProps
 * @property {animOptions} animOptions
 * Opsi animasi yang digunakan
 */

/**
 * Card `Grafik` versi dummy, dimana hanya menggunakan data statis
 * @param {Omit<HTMLMotionProps<'div'>, 'className'> & Pick<GrafikProps, 'matkul'> & GrafikDummyProps} props Grafik dummy props
 * @returns {React.ReactElement} Rendered component
 */
export function GrafikDummy({
    matkul,
    animOptions = { duration: 1500, delay: 0 },
    ...props
}) {
    const statsSemester = getStatsSemester(matkul);
    const data = statsSemester.map(({ totalNilai, totalSks, count, semester }) => ({
        semester,
        ip: (totalNilai / totalSks).toFixed(2),
        matkul: count,
        sks: totalSks,
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`${styles.grafik__tooltip} ${styles.static}`}>
                    <p className={styles.grafik__tooltip_title}>{`Semester ${label}`}</p>
                    {payload.map((item, index) => (
                        <p key={`grafik-tooltip-legend-${index}`}>{item?.name && item?.value ? `${item.name} : ${item.value}` : ''}</p>
                    ))}
                </div>
            )
        }

        return null;
    }

    return (
        <motion.div className={styles.grafik} {...props}>
            <div className={styles.grafik__main}>
                <div className={styles.grafik__left}>
                    <div className={styles.grafik__left_subtitle}>
                        <div style={{ boxShadow: 'var(--box-shadow2)' }} className={styles.grafik__left_icon}>
                            <IoAnalyticsOutline size={'17px'} color={'var(--logo-second-color)'} />
                        </div>
                        <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '500' }}>
                            Grafik Akademik
                        </h3>
                    </div>
                </div>
            </div>
            <div className={`${styles.grafik__data} ${styles.static}`}>
                <ResponsiveContainer width={'100%'} height={'100%'}>
                    <LineChart id="grafik_data-scroll" data={data}>
                        <XAxis dataKey="semester" stroke="var(--infoDark-color)" interval={'equidistantPreserveStart'} />
                        <Legend />
                        <Tooltip content={<CustomTooltip />} />
                        <Line name="Ip" type="monotone" dataKey="ip" stroke="var(--success-color)" dot={false} animationBegin={animOptions?.delay ?? 0} animationDuration={animOptions?.duration ?? 1500} />
                        <Line name="Matakuliah" type="monotone" dataKey="matkul" stroke="var(--warning-color)" dot={false} animationBegin={animOptions?.delay ?? 0} animationDuration={animOptions?.duration ?? 1500} />
                        <Line name="Sks" type="monotone" dataKey="sks" stroke="var(--danger-color)" dot={false} animationBegin={animOptions?.delay ?? 0} animationDuration={animOptions?.duration ?? 1500} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
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
                                Target Nilai
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
                                        <small>Sesuai Target</small>
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
                                        <small>Tidak Sesuai</small>
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

        const setColumnFilters = (indeksNilai) => {
            const currentState = getSessionTable();
            const newState = {
                ...currentState,
                columnFilters: [{ id: "nilai", value: [`${indeksNilai}`] }]
            }
            sessionStorage.setItem('_table', JSON.stringify(newState));
            window.dispatchEvent(new Event('on-table-session-changes'));
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
                            <h3>
                                Distribusi Nilai
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
                            onClick={(x) => {
                                if (x.activeLabel) setColumnFilters(x.activeLabel);
                            }}
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
 * Props yang digunakan component `DistribusiDummy`
 * @typedef {Object} DistribusiDummyProps
 * @property {boolean} [useAutoplay]
 * Menjalankan sebuah interval untuk menambah setiap semester saat `true`. Durasi interval dapat diatur pada props `autoplayInterval`
 * - Default : `false`
 * @property {number} [autoplayInterval]
 * Durasi interval untuk menambah setiap semester dalam detik
 * - Default : `5`
 * @property {animOptions} animOptions
 * Opsi animasi yang digunakan
 */

/**
 * Card `Distribusi` versi dummy, dimana hanya menggunakan data statis
 * @param {Omit<HTMLMotionProps<'div'>, 'className'> & Pick<DistribusiProps, 'matkul'|'penilaian'> & DistribusiDummyProps} props Distribusi dummy props
 * @returns {React.ReactElement} Rendered component
 */
export function DistribusiDummy({
    matkul,
    penilaian,
    useAutoplay = false,
    autoplayInterval = 5,
    animOptions = { duration: 1500, delay: 0 },
    ...props
}) {
    const [semester, setSemester] = React.useState(1);

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
    const maxSemester = Object.entries(data).length - 1;

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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`${styles.distribusi__tooltip} ${styles.static}`}>
                    <p className={styles.distribusi__tooltip_title}>{`${label}`}</p>
                    {payload.map((item, index) => (
                        <p key={`distribusi-tooltip-legend-${index}`}>{`${item.name} : ${item.value}`}</p>
                    ))}
                </div>
            )
        }

        return null;
    }

    React.useEffect(() => {
        if (useAutoplay) {
            const initAnim = setTimeout(() => {
                setSemester(x => x + 1);

                const loopAnim = setInterval(() => {
                    setSemester((prevIndex) => {
                        if (prevIndex >= maxSemester) {
                            return 0;
                        }
                        return prevIndex + 1;
                    });
                }, autoplayInterval * 1000);

                return () => clearInterval(loopAnim);
            }, 3000);

            return () => clearTimeout(initAnim);
        }
    }, [useAutoplay, autoplayInterval]);

    return (
        <motion.div className={styles.distribusi} {...props}>
            <div className={styles.distribusi__main}>
                <div className={styles.distribusi__left}>
                    <div className={styles.distribusi__left_subtitle}>
                        <div style={{ boxShadow: 'var(--box-shadow2)' }} className={styles.distribusi__left_icon}>
                            <TbAntennaBars5 size={'17px'} color={'var(--logo-second-color)'} />
                        </div>
                        <h3>
                            Distribusi Nilai
                        </h3>
                    </div>
                </div>
                <div className={`${styles.distribusi__right} ${styles.static}`}>
                    {semester > 0 ? `Semester ${semester}` : 'Semua'}
                </div>
            </div>
            <div className={`${styles.distribusi__data} ${styles.static}`}>
                <ResponsiveContainer width={'100%'} height={'100%'}>
                    <BarChart
                        id="distribusi_data-scroll"
                        data={semester === 0 ? data['semua'] : data[`semester${semester}`] ? data[`semester${semester}`] : emptyData}
                    >
                        <XAxis dataKey="nilai" stroke="var(--infoDark-color)" tick={<CustomAxisX />} />
                        <Legend />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accordion-bg-color)', strokeWidth: 1 }} />
                        <Bar name="Matakuliah" dataKey="matkul" fill="var(--first-color-lighter)" animationBegin={animOptions?.delay ?? 0} animationDuration={animOptions?.duration ?? 1500} />
                        <Bar name="Sks" dataKey="sks" fill="var(--second-color-lighter)" animationBegin={animOptions?.delay ?? 0} animationDuration={animOptions?.duration ?? 1500} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
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
                                Progres Target
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
 * Props yang digunakan component `ProgressDummy`
 * @typedef {Object} ProgressDummyProps
 * @property {Object} value
 * @property {number} value.sks
 * @property {number} value.matkul
 * @property {number} value.ipk
 * @property {Object} target
 * @property {number} target.sks
 * @property {number} target.matkul
 * @property {number} target.ipk
 * @property {Object} animOptions
 * Opsi animasi yang digunakan
 * @property {number} animOptions.duration
 * Durasi animasi dalam detik
 * - Default : `1.5`
 * @property {number} animOptions.delay
 * Delay animasi dalam detik
 * - Default : `0`
 * @property {CountUpProps} countUpOptions
 * Secara default menggunakan props berikut,
 * ```js
 * {
 *      start: 0,
 *      duration: animationDuration, // animOptions.duration
 *      decimals: 0 || 2, // If value are decimal, use two number behind zeros
 *      end: value, // retrieved from value props
 *      delay: animationDelay, // animOptions.delay
 *      preserveValue: true,
 * }
 * ```
 */

/**
 * Card `Progress` versi dummy, dimana hanya menggunakan data statis
 * @param {Omit<HTMLMotionProps<'div'>, 'className'> & ProgressDummyProps} props Progress dummy props
 * @returns {React.ReactElement} Rendered component
 */
export function ProgressDummy({
    value = { sks: 132, matkul: 45, ipk: 3.62 },
    target = { sks: 144, matkul: 50, ipk: 3.75 },
    animOptions = { duration: 1.5, delay: 0 },
    countUpOptions,
    ...props
}) {
    const animationDuration = animOptions?.duration ? (animOptions.duration) : 1.5;
    const animationDelay = animOptions?.delay ? (animOptions.delay) : 0;

    return (
        <motion.div className={styles.progress} {...props}>
            <div className={styles.progress__main}>
                <div className={styles.progress__left}>
                    <div className={styles.progress__left_subtitle}>
                        <div style={{ boxShadow: 'var(--box-shadow2)' }} className={styles.target__left_icon}>
                            <TbAtom size={'17px'} color={'var(--logo-second-color)'} />
                        </div>
                        <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '500' }}>
                            Progres Target
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
                                duration={animationDuration}
                                decimals={Number.isInteger(value.sks) ? 0 : 2}
                                end={value.sks}
                                delay={animationDelay}
                                preserveValue={true}
                                {...countUpOptions}
                            >
                                {({ countUpRef }) => (
                                    <h3 ref={countUpRef} />
                                )}
                            </CountUp>
                            <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '400' }}>|</h3>
                            <small style={{ color: 'var(--infoDark-color)' }}>{target.sks}</small>
                        </div>
                    </div>
                    <ProgressBar
                        completed={Math.round((value.sks / target.sks) * 100)}
                        maxCompleted={100}
                        height={'100%'}
                        isLabelVisible={false}
                        baseBgColor={'var(--inner-color-bg1)'}
                        borderRadius={'.25rem'}
                        bgColor={'var(--danger-color)'}
                        animateOnRender={true}
                        transitionDuration={`${animationDuration}s ${animationDelay}s`}
                    />
                </div>
                <div className={`${styles.wrapper} ${styles.matkul}`}>
                    <div className={styles.top}>
                        <h3>Matakuliah</h3>
                        <div className={styles.details}>
                            <CountUp
                                start={0}
                                duration={animationDuration}
                                decimals={Number.isInteger(value.matkul) ? 0 : 2}
                                end={value.matkul}
                                delay={animationDelay}
                                preserveValue={true}
                                {...countUpOptions}
                            >
                                {({ countUpRef }) => (
                                    <h3 ref={countUpRef} />
                                )}
                            </CountUp>
                            <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '400' }}>|</h3>
                            <small style={{ color: 'var(--infoDark-color)' }}>{target.matkul}</small>
                        </div>
                    </div>
                    <ProgressBar
                        completed={Math.round((value.matkul / target.matkul) * 100)}
                        maxCompleted={100}
                        height={'100%'}
                        isLabelVisible={false}
                        baseBgColor={'var(--inner-color-bg1)'}
                        borderRadius={'.25rem'}
                        bgColor={'var(--warning-color)'}
                        animateOnRender={true}
                        transitionDuration={`${animationDuration}s ${animationDelay}s`}
                    />
                </div>
                <div className={`${styles.wrapper} ${styles.ipk}`}>
                    <div className={styles.top}>
                        <h3>IPK</h3>
                        <div className={styles.details}>
                            <CountUp
                                start={0}
                                duration={animationDuration}
                                decimals={Number.isInteger(value.ipk) ? 0 : 2}
                                end={value.ipk}
                                delay={animationDelay}
                                preserveValue={true}
                                {...countUpOptions}
                            >
                                {({ countUpRef }) => (
                                    <h3 ref={countUpRef} />
                                )}
                            </CountUp>
                            <h3 style={{ color: 'var(--infoDark-color)', fontWeight: '400' }}>|</h3>
                            <small style={{ color: 'var(--infoDark-color)' }}>{target.ipk}</small>
                        </div>
                    </div>
                    <ProgressBar
                        completed={Math.round((value.ipk / target.ipk) * 100)}
                        maxCompleted={100}
                        height={'100%'}
                        isLabelVisible={false}
                        baseBgColor={'var(--inner-color-bg1)'}
                        borderRadius={'.25rem'}
                        bgColor={'var(--success-color)'}
                        animateOnRender={true}
                        transitionDuration={`${animationDuration}s ${animationDelay}s`}
                    />
                </div>
            </div>
        </motion.div>
    )
}