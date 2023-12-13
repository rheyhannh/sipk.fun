'use client'

// ========== COMPONENT DEPEDENCY ========== //
import { Summary, Notification, History } from '@/component/Card'

// ========== DATA DEPEDENCY ========== //
import { useMatkul, useNotifikasi, useUser, useMatkulHistory } from '@/data/core';
import { getPenilaianUniversitas } from '@/data/universitas';
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
                data={{ value: x.getUserSks(matkul), percentage: x.getUserSksPercentage(user, matkul), lastUpdated: "Terakhir Diupdate" }}
                title={'SKS'}
            >
            </Summary>

            <Summary
                state='loaded'
                color='var(--first-color)'
                icon={{ name: 'IoBookOutline', lib: 'io5' }}
                data={{ value: x.getUserMatkul(matkul), percentage: x.getUserMatkulPercentage(user, matkul), lastUpdated: 'Terakhir Diupdate' }}
                title={'Matakuliah'}
            >
            </Summary>

            <Summary
                state='loaded'
                color='var(--success-color)'
                icon={{ name: 'FaRegStar', lib: 'fa' }}
                data={{ value: x.getUserIpk(matkul), percentage: x.getUserIpkPercentage(user, matkul), lastUpdated: 'Terakhir Diupdate' }}
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

    if (userError || matkulHistoryError) {
        return (
            <History state={'error'} />
        )
    }

    if (userLoading || matkulHistoryLoading) {
        return (
            <History state={'loading'} />
        )
    }

    if (userValidating || matkulHistoryValidating) {
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
        <History state={'loaded'} data={matkulHistory} universitas={getPenilaianUniversitas(user[0]?.university_id)} count={count} />
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