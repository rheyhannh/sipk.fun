'use client'

// ========== REACT DEPEDENCY ========== //
import { useState } from 'react';

// ========== COMPONENT DEPEDENCY ========== //
import { Total } from '@/component/Card'

// ========== DATA DEPEDENCY ========== //
import { useMatkul, useNotifikasi, useUser, useMatkulHistory } from '@/data/core';
import { getPenilaianUniversitas } from '@/data/universitas';
import * as x from '@/data/summary';

// ========== STYLE DEPEDENCY ========== //
import styles from './matkul.module.css'

// ========== ICONS DEPEDENCY ========== //
import { AiOutlineAppstore } from "react-icons/ai";

/*
============================== CODE START HERE ==============================
*/
function TotalCard() {
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();

    if (matkulError || userError) {
        return <Total state={'error'} />;
    }

    if (matkulLoading || userLoading) {
        return <Total state={'loading'} />;
    }

    if (matkulValidating || userValidating) {
        return <Total state={'validating'} />;
    }

    if (matkul.length === 0) {
        return <Total state={'empty'} />
    }

    return (
        <Total state={'loaded'} user={user} matkul={matkul} universitas={getPenilaianUniversitas(user[0]?.university_id)} />
    )
}

export default function ProfilPage() {
    const [widget, setWidget] = useState(true);

    return (
        <>
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
                <div className={`${styles.insight} ${widget ? styles.active : ''}`}>
                    <Total state={'empty'} />
                    <Total state={'error'} />
                    <TotalCard />
                </div>
                <div>
                    <h1>Tabel</h1>
                </div>
            </div>
        </>
    )
}