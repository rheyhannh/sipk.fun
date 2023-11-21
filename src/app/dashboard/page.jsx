'use client'

import { Summary } from '@/component/Card'
import { useMatkul, useUser } from '@/data/core';
import * as x from '@/data/summary';
import styles from './home.module.css'

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
                data={{ value: x.getUserMatkul(matkul), percentage: x.getUserMatkulPercentage(), lastUpdated: 'Terakhir Diupdate' }}
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

export default function DashboardPage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <AcademicCard count={3} />
            </div>
            <div>
                <h1>Dashboard Content 2</h1>
            </div>
        </div>
    )
}