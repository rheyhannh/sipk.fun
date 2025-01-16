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
import { Summary, Notification, History } from '@/component/Card';
// #endregion

// #region HOOKS DEPEDENCY
import useUser from '@/hooks/swr/useUser';
import useMatkul from '@/hooks/swr/useMatkul';
import useMatkulHistory from '@/hooks/swr/useMatkulHistory';
import { useCookies } from 'next-client-cookies';
import { DashboardContext } from '@/page/dashboard/provider';
import { ModalContext } from '@/component/modal/provider';
// #endregion

// #region UTIL DEPEDENCY
import { handleReactErrorBoundary } from '@/lib/bugsnag';
import {
    getUserMatkul, getUserMatkulPercentage,
    getUserSks, getUserSksPercentage,
    getUserIpk, getUserIpkPercentage,
} from "@/utils/users/stats";
// #endregion

// #region STYLE DEPEDENCY
import styles from '@dashboard_page/dashboard.module.css';
// #endregion

/**
 * Props yang digunakan component `AcademicCard`
 * @typedef {Object} AcademicCardProps
 * @property {number} count
 * Jumlah card yang tampil
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 */

/**
 * Component yang menampilkan user matakuliah, sks dan indeks prestasi progress dengan card `Summary` dilengkapi dengan hook `swr` untuk memperoleh data yang dibutuhkan.
 * 
 * Hook tersebut juga mengontrol `CardState` dari card tersebut
 * @param {AcademicCardProps} props AcademicCard props
 * @returns {React.ReactElement} Rendered component
 */
export function AcademicCard({ count, universitas }) {
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const isError = userError || matkulError || !universitas || !universitas.length;
    const isLoading = userLoading || matkulLoading;
    const isValidating = userValidating || matkulValidating;

    if (isError) {
        const errorCount = Array.from({ length: count }, (_, index) => (
            <Summary state='error' key={index} />
        ));
        return <>{errorCount}</>;
    }

    if (isLoading) {
        const loadingCount = Array.from({ length: count }, (_, index) => (
            <Summary state='loading' key={index} />
        ));
        return <>{loadingCount}</>;
    }

    if (isValidating) {
        const validatingCount = Array.from({ length: count }, (_, index) => (
            <Summary state='validating' key={index} />
        ));
        return <>{validatingCount}</>;
    }

    if (!matkul.length) {
        const emptyCount = Array.from({ length: count }, (_, index) => (
            <Summary state='empty' penilaian={universitas[user[0].university_id - 1].penilaian} key={index} />
        ));
        return <>{emptyCount}</>;
    }

    return (
        <>
            <Summary
                state='loaded'
                color='var(--danger-color)'
                icon={{ name: 'MdOutlineConfirmationNumber', lib: 'md' }}
                data={{ value: getUserSks(matkul), percentage: getUserSksPercentage(user, matkul), keterangan: `Targetmu ${user[0]?.sks_target ?? '-'}` }}
                title={'SKS'}
                penilaian={universitas[user[0].university_id - 1].penilaian}
            >
            </Summary>

            <Summary
                state='loaded'
                color='var(--warning-color)'
                icon={{ name: 'IoBookOutline', lib: 'io5' }}
                data={{ value: getUserMatkul(matkul), percentage: getUserMatkulPercentage(user, matkul), keterangan: `Targetmu ${user[0]?.matkul_target ?? '-'}` }}
                title={'Matakuliah'}
                penilaian={universitas[user[0].university_id - 1].penilaian}
            >
            </Summary>

            <Summary
                state='loaded'
                color='var(--success-color)'
                icon={{ name: 'FaRegStar', lib: 'fa' }}
                data={{ value: getUserIpk(matkul), percentage: getUserIpkPercentage(user, matkul), keterangan: `Targetmu ${user[0]?.ipk_target ?? '-'}` }}
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
 */

/**
 * Component yang menampilkan notifikasi dengan card `Notification` dan mengatur `CardState` dari card tersebut
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
 */

/**
 * Component yang menampilkan user matakuliah history dengan card `History` dilengkapi dengan hook `swr` untuk memperoleh data yang dibutuhkan.
 * 
 * Hook tersebut juga mengontrol `CardState` dari card tersebut
 * @param {HistoryCardProps} props HistoryCard props
 * @returns {React.ReactElement} Rendered component
 */
export function HistoryCard({ count, universitas }) {
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: matkulHistory, error: matkulHistoryError, isLoading: matkulHistoryLoading, isValidating: matkulHistoryValidating } = useMatkulHistory();
    const isError = userError || matkulHistoryError || !universitas || !universitas.length;
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

function DashboardError() {
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
            <Image src={error_svg} alt={'Error Ilustration'} />
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
 * Render dashboard page `'/dashboard'`
 * @param {{universitas:Array<SupabaseTypes.UniversitasData>, notifikasi:Array<SupabaseTypes.NotifikasiData>}} props Dashboard props
 * @returns {React.ReactElement} Rendered dashboard page
 */
export default function Dashboard({ universitas, notifikasi }) {
    const cookieResolver = useCookies();

    return (
        <ErrorBoundary
            FallbackComponent={DashboardError}
            onError={(error, info) => handleReactErrorBoundary(error, info, cookieResolver, { boundaryLocation: 'DashboardPage' })}
        >
            <div className={styles.wrapper}>
                <div className={styles.primary}>
                    <h1 className={styles.wrapper__title}>Dashboard</h1>
                    <div className={styles.insight}>
                        <AcademicCard count={3} universitas={universitas} />
                    </div>
                </div>
                <div className={styles.secondary}>
                    <div>
                        <h2 className={styles.wrapper__title}>Pemberitahuan</h2>
                        <UpdateCard notifikasi={notifikasi} />
                    </div>
                    <div className={styles.history}>
                        <h2 className={styles.wrapper__title}>Riwayat Matakuliah</h2>
                        <HistoryCard count={3} universitas={universitas} />
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}