'use client'

// #region COMPONENT DEPEDENCY
import { Summary, Notification, History } from '@/component/Card';
// #endregion

// #region DATA DEPEDENCY
import { useMatkul, useNotifikasi, useUser, useMatkulHistory, useUniversitas } from '@/data/core';
import * as x from '@/data/summary';
// #endregion

// #region STYLE DEPEDENCY
import styles from './home.module.css';
// #endregion

function AcademicCard({ count }) {
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: universitas, error: universitasError, isLoading: universitasLoading, isValidating: universitasValidating } = useUniversitas(null, 'user', user ? user[0].university_id : undefined);
    const isError = userError || matkulError || universitasError;
    const isLoading = userLoading || matkulLoading || universitasLoading;
    const isValidating = userValidating || matkulValidating || universitasValidating;

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
            <Summary state='empty' penilaian={universitas[0].penilaian} key={crypto.randomUUID()} />
        ));
        return <>{emptyCount}</>;
    }

    return (
        <>
            <Summary
                state='loaded'
                color='var(--danger-color)'
                icon={{ name: 'MdOutlineConfirmationNumber', lib: 'md' }}
                data={{ value: x.getUserSks(matkul), percentage: x.getUserSksPercentage(user, matkul), keterangan: `${user.length !== 0 ? `Targetmu ${user[0].sks_target}` : `Terakhir diupdate`}` }}
                title={'SKS'}
                penilaian={universitas[0].penilaian}
            >
            </Summary>

            <Summary
                state='loaded'
                color='var(--warning-color)'
                icon={{ name: 'IoBookOutline', lib: 'io5' }}
                data={{ value: x.getUserMatkul(matkul), percentage: x.getUserMatkulPercentage(user, matkul), keterangan: `${user.length !== 0 ? `Targetmu ${user[0].matkul_target}` : `Terakhir diupdate`}` }}
                title={'Matakuliah'}
                penilaian={universitas[0].penilaian}
            >
            </Summary>

            <Summary
                state='loaded'
                color='var(--success-color)'
                icon={{ name: 'FaRegStar', lib: 'fa' }}
                data={{ value: x.getUserIpk(matkul), percentage: x.getUserIpkPercentage(user, matkul), keterangan: `${user.length !== 0 ? `Targetmu ${parseFloat(user[0].ipk_target).toFixed(2)}` : `Terakhir diupdate`}` }}
                title={'IPK'}
                penilaian={universitas[0].penilaian}
            >
            </Summary>
        </>
    )
}

function UpdateCard() {
    const { data: notifikasi, error: notifikasiError, isLoading: notifikasiLoading, isValidating: notifikasiValidating } = useNotifikasi();

    if (notifikasiError) {
        return (
            <Notification state={'error'} />
        )
    }

    if (notifikasiLoading) {
        return (
            <Notification state={'loading'} />
        )
    }

    if (notifikasiValidating) {
        return (
            <Notification state={'validating'} />
        )
    }

    if (notifikasi.length === 0) {
        return (
            <Notification state={'empty'} />
        )
    }

    return (
        <Notification state={'loaded'} data={notifikasi} />
    )
}

function HistoryCard({ count }) {
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: matkulHistory, error: matkulHistoryError, isLoading: matkulHistoryLoading, isValidating: matkulHistoryValidating } = useMatkulHistory();
    const { data: universitas, error: universitasError, isLoading: universitasLoading, isValidating: universitasValidating } = useUniversitas(null, 'user', user ? user[0].university_id : undefined);
    const isError = userError || matkulHistoryError || universitasError;
    const isLoading = userLoading || matkulHistoryLoading || universitasLoading;
    const isValidating = userValidating || matkulHistoryValidating || universitasValidating;

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
            <History state={'empty'} penilaian={universitas[0].penilaian} />
        )
    }

    return (
        <History state={'loaded'} data={matkulHistory} penilaian={universitas[0].penilaian} count={count} />
    )
}

export default function DashboardPage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.primary}>
                <h1 className={styles.wrapper__title}>Dasbor</h1>
                <div className={styles.insight}>
                    <AcademicCard count={3} />
                </div>
            </div>
            <div className={styles.secondary}>
                <div>
                    <h2 className={styles.wrapper__title}>Update</h2>
                    <UpdateCard />
                </div>
                <div className={styles.history}>
                    <h2 className={styles.wrapper__title}>Perubahan Terakhir</h2>
                    <HistoryCard count={3} />
                </div>
            </div>
        </div>
    )
}