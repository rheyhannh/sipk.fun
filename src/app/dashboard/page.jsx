'use client'

// ========== COMPONENT DEPEDENCY ========== //
import { Summary, Notification, History } from '@/component/Card'

// ========== DATA DEPEDENCY ========== //
import { useMatkul, useNotifikasi, useUser, useMatkulHistory, useUniversitas } from '@/data/core';
import * as x from '@/data/summary';

// ========== STYLE DEPEDENCY ========== //
import styles from './home.module.css'

/*
============================== CODE START HERE ==============================
*/
function AcademicCard({ count }) {
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();

    if (userError || matkulError) {
        const errorCount = Array.from({ length: count }, (_, index) => (
            <Summary state='error' key={crypto.randomUUID()} error={matkul} />
        ));
        return <>{errorCount}</>;
    }

    if (userLoading || matkulLoading) {
        const loadingCount = Array.from({ length: count }, (_, index) => (
            <Summary state='loading' key={crypto.randomUUID()} />
        ));
        return <>{loadingCount}</>;
    }

    if (userValidating || matkulValidating) {
        const validatingCount = Array.from({ length: count }, (_, index) => (
            <Summary state='validating' key={crypto.randomUUID()} />
        ));
        return <>{validatingCount}</>;
    }

    if (matkul.length === 0) {
        const emptyCount = Array.from({ length: count }, (_, index) => (
            <Summary state='empty' key={crypto.randomUUID()} />
        ));
        return <>{emptyCount}</>;
    }

    return (
        <>
            <Summary
                state='loaded'
                color='var(--second-color-lighter)'
                icon={{ name: 'MdOutlineConfirmationNumber', lib: 'md' }}
                data={{ value: x.getUserSks(matkul), percentage: x.getUserSksPercentage(user, matkul), keterangan: `${user.length !== 0 ? `Targetmu ${user[0].sks_target}` : `Terakhir diupdate`}` }}
                title={'SKS'}
            >
            </Summary>

            <Summary
                state='loaded'
                color='var(--first-color)'
                icon={{ name: 'IoBookOutline', lib: 'io5' }}
                data={{ value: x.getUserMatkul(matkul), percentage: x.getUserMatkulPercentage(user, matkul), keterangan: `${user.length !== 0 ? `Targetmu ${user[0].matkul_target}` : `Terakhir diupdate`}` }}
                title={'Matakuliah'}
            >
            </Summary>

            <Summary
                state='loaded'
                color='var(--success-color)'
                icon={{ name: 'FaRegStar', lib: 'fa' }}
                data={{ value: x.getUserIpk(matkul), percentage: x.getUserIpkPercentage(user, matkul), keterangan: `${user.length !== 0 ? `Targetmu ${parseFloat(user[0].ipk_target).toFixed(2)}` : `Terakhir diupdate`}` }}
                title={'IPK'}
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

    if (userError || matkulHistoryError || universitasError) {
        return (
            <History state={'error'} />
        )
    }

    if (userLoading || matkulHistoryLoading || universitasLoading) {
        return (
            <History state={'loading'} />
        )
    }

    if (userValidating || matkulHistoryValidating || universitasValidating) {
        return (
            <History state={'validating'} />
        )
    }

    if (matkulHistory.length === 0) {
        return (
            <History state={'empty'} />
        )
    }

    return (
        <History state={'loaded'} data={matkulHistory} universitas={universitas[0].penilaian} count={count} />
    )
}

export default function DashboardPage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.primary}>
                <h1>Dasbor</h1>
                <div className={styles.insight}>
                    <AcademicCard count={3} />
                </div>
            </div>
            <div className={styles.secondary}>
                <div>
                    <h2>Update</h2>
                    <UpdateCard />
                </div>
                <div className={styles.history}>
                    <h2>Perubahan Terakhir</h2>
                    <HistoryCard count={3} />
                </div>
            </div>
        </div>
    )
}