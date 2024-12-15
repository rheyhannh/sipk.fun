'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region NEXT DEPEDENCY
import Image from 'next/image';
import error_svg from '/public/bug_fixing.svg';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { ErrorBoundary } from 'react-error-boundary';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Grafik, Target, Progress, Distribusi } from '@/component/Card';
import { Table } from '@/component/Table';
// #endregion

// #region HOOKS DEPEDENCY
import useUser from '@/hooks/swr/useUser';
import useMatkul from '@/hooks/swr/useMatkul';
import useMatkulHistory from '@/hooks/swr/useMatkulHistory';
import { useCookies } from 'next-client-cookies';
import { DashboardContext } from '@/component/provider/Dashboard';
import { ModalContext } from '@/component/provider/Modal';
// #endregion

// #region UTIL DEPEDENCY
import { handleReactErrorBoundary } from '@/lib/bugsnag';
import { getSessionTable, getSessionGrafik, getSessionTarget, getSessionDistribusi } from '@/utils/client_side';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/dashboard_matakuliah.module.css'
import 'swiper/css';
import 'swiper/css/pagination';
// #endregion

// #region ICON DEPEDENCY
import { AiOutlineAppstore } from "react-icons/ai";
// #endregion

/**
 * Props yang digunakan component `GrafikCard`
 * @typedef {Object} GrafikCardProps
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 */

/**
 * Component yang menampilkan grafik user matakuliah, sks dan indeks prestasi dengan card `Grafik` dilengkapi dengan hook `swr` untuk memperoleh data yang dibutuhkan.
 * 
 * Hook tersebut juga mengontrol `CardState` dari card tersebut
 * @param {GrafikCardProps} props GrafikCard props
 * @returns {React.ReactElement} Rendered component
 */
function GrafikCard({ universitas }) {
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const isError = matkulError || userError || !universitas || !universitas.length;
    const isLoading = matkulLoading || userLoading;
    const isValidating = matkulValidating || userValidating;

    const savedState = getSessionGrafik();

    if (isError) {
        return <Grafik state={'error'} />;
    }

    if (isLoading) {
        return <Grafik state={'loading'} />;
    }

    if (isValidating) {
        return <Grafik state={'validating'} />;
    }

    if (!matkul.length) {
        return <Grafik state={'empty'} penilaian={universitas[user[0].university_id - 1].penilaian} />
    }

    return (
        <Grafik state={'loaded'} matkul={matkul} penilaian={universitas[user[0].university_id - 1].penilaian} savedState={savedState} />
    )
}

/**
 * Props yang digunakan component `TargetCard`
 * @typedef {Object} TargetCardProps
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 */

/**
 * Component yang menampilkan jumlah matakuliah user yang `ontarget` dan tidak dengan card `Target` dilengkapi dengan hook `swr` untuk memperoleh data yang dibutuhkan.
 * 
 * Hook tersebut juga mengontrol `CardState` dari card tersebut
 * @param {TargetCardProps} props TargetCard props
 * @returns {React.ReactElement} Rendered component
 */
function TargetCard({ universitas }) {
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const isError = matkulError || userError || !universitas || !universitas.length;
    const isLoading = matkulLoading || userLoading;
    const isValidating = matkulValidating || userValidating;

    const savedState = getSessionTarget();

    if (isError) {
        return <Target state={'error'} />;
    }

    if (isLoading) {
        return <Target state={'loading'} />;
    }

    if (isValidating) {
        return <Target state={'validating'} />;
    }

    if (!matkul.length) {
        return <Target state={'empty'} penilaian={universitas[user[0].university_id - 1].penilaian} />
    }

    return (
        <Target state={'loaded'} matkul={matkul} penilaian={universitas[user[0].university_id - 1].penilaian} savedState={savedState} />
    )
}

/**
 * Props yang digunakan component `DistribusiCard`
 * @typedef {Object} DistribusiCardProps
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 */

/**
 * Component yang menampilkan distribusi matakuliah user dengan card `Distribusi` dilengkapi dengan hook `swr` untuk memperoleh data yang dibutuhkan.
 * 
 * Hook tersebut juga mengontrol `CardState` dari card tersebut
 * @param {DistribusiCardProps} props DistribusiCard props
 * @returns {React.ReactElement} Rendered component
 */
function DistribusiCard({ universitas }) {
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const isError = matkulError || userError || !universitas || !universitas.length;
    const isLoading = matkulLoading || userLoading;
    const isValidating = matkulValidating || userValidating;

    const savedState = getSessionDistribusi();

    if (isError) {
        return <Distribusi state={'error'} />;
    }

    if (isLoading) {
        return <Distribusi state={'loading'} />;
    }

    if (isValidating) {
        return <Distribusi state={'validating'} />;
    }

    if (!matkul.length) {
        return <Distribusi state={'empty'} penilaian={universitas[user[0].university_id - 1].penilaian} />
    }

    return (
        <Distribusi state={'loaded'} matkul={matkul} penilaian={universitas[user[0].university_id - 1].penilaian} savedState={savedState} />
    )
}

/**
 * Props yang digunakan component `ProgressCard`
 * @typedef {Object} ProgressCardProps
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 */

/**
 * Component yang menampilkan overall progress user matakuliah, sks dan indeks prestasi dengan card `Progress` dilengkapi dengan hook `swr` untuk memperoleh data yang dibutuhkan.
 * 
 * Hook tersebut juga mengontrol `CardState` dari card tersebut
 * @param {ProgressCardProps} props ProgressCard props
 * @returns {React.ReactElement} Rendered component
 */
function ProgressCard({ universitas }) {
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const isError = matkulError || userError || !universitas || !universitas.length;
    const isLoading = matkulLoading || userLoading;
    const isValidating = matkulValidating || userValidating;

    if (isError) {
        return <Progress state={'error'} />;
    }

    if (isLoading) {
        return <Progress state={'loading'} />;
    }

    if (isValidating) {
        return <Progress state={'validating'} />;
    }

    if (!matkul.length) {
        return <Progress state={'empty'} penilaian={universitas[user[0].university_id - 1].penilaian} />
    }

    return (
        <Progress state={'loaded'} user={user} matkul={matkul} penilaian={universitas[user[0].university_id - 1].penilaian} />
    )
}

/**
 * Props yang digunakan component `TabelSection`
 * @typedef {Object} TabelSectionProps
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 */

/**
 * Component yang menampilkan tabel matakuliah dengan component `Table` dilengkapi dengan hook `swr` untuk memperoleh data yang dibutuhkan.
 * 
 * Hook tersebut juga mengontrol state `TableState` pada table yang ditampilkan
 * @param {TabelSectionProps} props TabelSection props
 * @returns {React.ReactElement} Rendered component
 */
function TabelSection({ universitas }) {
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: matkulHistory, error: matkulHistoryError, isLoading: matkulHistoryLoading, isValidating: matkulHistoryValidating } = useMatkulHistory();
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const isLoading = matkulLoading || userLoading || matkulHistoryLoading;
    const isValidating = matkulValidating || userValidating || matkulHistoryValidating;
    const isError = matkulError || userError || matkulHistoryError || !universitas || !universitas.length;

    const sessionTable = getSessionTable();

    if (isError) {
        return <Table state={'error'} />;
    }

    if (isLoading) {
        return <Table state={'loading'} />;
    }

    return (
        <Table
            state={'loaded'}
            validating={isValidating}
            user={user[0]}
            matkul={matkul}
            sessionTable={sessionTable}
            matkulHistory={matkulHistory}
            penilaian={universitas[user[0].university_id - 1].penilaian}
        />
    )
}

function DashboardMatakuliahError() {
    const { isRichContent, setNavbarActive } = React.useContext(DashboardContext);
    const { setModal, setActive, setData } = React.useContext(ModalContext);

    const handleLogoutModal = () => {
        if (!isRichContent) { setNavbarActive(false); }
        setData(null);
        setModal('logout');
        setTimeout(() => {
            setActive(true);
        }, 50)
    }

    return (
        <div className={`${styles.wrapper} ${styles.error}`}>
            <Image src={error_svg} alt={'Logo SIPK'} />
            <div className={styles.text}>
                <h2>Terjadi Kesalahan</h2>
                <p>
                    Sepertinya terjadi kesalahan tak terduga. Kamu bisa coba login ulang dulu, ya.
                    Kalau masalah ini masih muncul setelah login ulang, kayaknya bakal ada yang lembur
                    buat benerin ini 😞
                </p>
            </div>
            <span onClick={handleLogoutModal}>Logout Disini</span>
        </div>
    );
}

/**
 * Render dashboard matakuliah page `'/dashboard/matakuliah'`
 * @param {{universitas:Array<SupabaseTypes.UniversitasData>}}
 * @returns {React.ReactElement} Rendered dashboard matakuliah page
 */
export default function DashboardMatakuliah({ universitas }) {
    const [widget, setWidget] = React.useState(true);
    const cookieResolver = useCookies();

    return (
        <ErrorBoundary
            FallbackComponent={DashboardMatakuliahError}
            onError={(error, info) => handleReactErrorBoundary(error, info, cookieResolver, 'DashboardMatakuliahError')}
        >
            <div className={styles.wrapper}>
                <div className={styles.top}>
                    <h1>Matakuliah</h1>
                    <div className={styles.top__right} onClick={() => { setWidget(!widget) }}>
                        <div className={styles.top__right_icon}>
                            <AiOutlineAppstore size={'24px'} color={widget ? 'var(--logo-second-color)' : 'var(--infoDark-color)'} />
                        </div>
                        <h3 className={styles.top__right_text}>
                            Widget
                        </h3>
                    </div>
                </div>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                        },
                        1280: {
                            slidesPerView: 3,
                        },
                        1920: {
                            slidesPerView: 4,
                        }
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    style={{
                        "--swiper-pagination-color": "var(--logo-second-color)",
                        "--swiper-pagination-bullet-inactive-color": "var(--infoDark-color)",
                    }}
                    noSwipingSelector={['#grafik_data-scroll', '#distribusi_data-scroll']}
                    modules={[Pagination]}
                    className={`${styles.insight} ${widget ? styles.active : ''}`}
                >
                    <SwiperSlide> <GrafikCard universitas={universitas} /> </SwiperSlide>
                    <SwiperSlide> <TargetCard universitas={universitas} /> </SwiperSlide>
                    <SwiperSlide> <DistribusiCard universitas={universitas} /> </SwiperSlide>
                    <SwiperSlide> <ProgressCard universitas={universitas} /> </SwiperSlide>
                </Swiper>

                <TabelSection universitas={universitas} />
            </div>
        </ErrorBoundary>
    )
}