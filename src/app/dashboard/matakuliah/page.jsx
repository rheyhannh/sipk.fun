'use client'

// ========== REACT DEPEDENCY ========== //
import { useState } from 'react';

// ========== COMPONENT DEPEDENCY ========== //
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Total, Grafik } from '@/component/Card'
import { Table } from '@/component/Table';

// ========== DATA DEPEDENCY ========== //
import { useMatkul, useUser, useUniversitas } from '@/data/core';

// ========== STYLE DEPEDENCY ========== //
import styles from './matkul.module.css'
import 'swiper/css';
import 'swiper/css/pagination';

// ========== ICONS DEPEDENCY ========== //
import { AiOutlineAppstore } from "react-icons/ai";

/*
============================== CODE START HERE ==============================
*/
function TotalCard() {
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: universitas, error: universitasError, isLoading: universitasLoading, isValidating: universitasValidating } = useUniversitas(null, 'user', user ? user[0].university_id : undefined);

    if (matkulError || userError || universitasError) {
        return <Total state={'error'} />;
    }

    if (matkulLoading || userLoading || universitasLoading) {
        return <Total state={'loading'} />;
    }

    if (matkulValidating || userValidating || universitasValidating) {
        return <Total state={'validating'} />;
    }

    if (matkul.length === 0) {
        return <Total state={'empty'} />
    }

    return (
        <Total state={'loaded'} user={user} matkul={matkul} universitas={universitas[0].penilaian} />
    )
}

function GrafikCard() {
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();

    if (matkulError) {
        return <Grafik state={'error'} />;
    }

    if (matkulLoading) {
        return <Grafik state={'loading'} />;
    }

    if (matkulValidating) {
        return <Grafik state={'validating'} />;
    }

    if (matkul.length === 0) {
        return <Grafik state={'empty'} />
    }

    return (
        <Grafik state={'loaded'} matkul={matkul} />
    )
}

function TabelSection() {
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: universitas, error: universitasError, isLoading: universitasLoading, isValidating: universitasValidating } = useUniversitas(null, 'user', user ? user[0].university_id : undefined);
    const isLoading = matkulLoading || userLoading || universitasLoading;
    const isValidating = matkulValidating || userValidating || universitasValidating;
    const isError = matkulError || userError || universitasError;
    const isEmpty = !matkul || matkul.length === 0;

    if (isError) {
        return <Table state={'error'} />;
    }

    if (isLoading) {
        return <Table state={'loading'} />;
    }

    if (isEmpty) {
        return <Table state={'empty'} />
    }

    return (
        <Table state={'loaded'} validating={isValidating} user={user[0]} matkul={matkul} universitas={universitas[0].penilaian} />
    )
}

export default function MatakuliahPage() {
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
                    noSwipingSelector={['#total_data-scroll', '#grafik_data-scroll']}
                    modules={[Pagination]}
                    className={`${styles.insight} ${widget ? styles.active : ''}`}
                >
                    <SwiperSlide> <GrafikCard /> </SwiperSlide>
                    <SwiperSlide> <TotalCard /> </SwiperSlide>
                    <SwiperSlide> <Grafik state={'empty'} /> </SwiperSlide>
                </Swiper>

                <TabelSection />
            </div>
        </>
    )
}