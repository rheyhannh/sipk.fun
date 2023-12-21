'use client'

// ========== REACT DEPEDENCY ========== //
import { useState, useContext } from 'react';

// ========== COMPONENT DEPEDENCY ========== //
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Total } from '@/component/Card'
import { DashboardContext } from "@/component/provider/Dashboard";

// ========== DATA DEPEDENCY ========== //
import { useMatkul, useNotifikasi, useUser, useMatkulHistory } from '@/data/core';
import { getPenilaianUniversitas } from '@/data/universitas';
import * as x from '@/data/summary';

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

export default function MatakuliahPage() {
    const [widget, setWidget] = useState(true);
    const { isTouchDevice } = useContext(DashboardContext);

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
                        }
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    style={{
                        "--swiper-pagination-color": "var(--logo-second-color)",
                        "--swiper-pagination-bullet-inactive-color": "var(--infoDark-color)",
                    }}
                    {...(isTouchDevice ? { noSwipingSelector: '#abcde' } : {})}
                    modules={[Pagination]}
                    className={`${styles.insight} ${widget ? styles.active : ''}`}
                >
                    <SwiperSlide>
                        <Total state={'loading'} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <TotalCard />
                    </SwiperSlide>
                    <SwiperSlide>
                        <Total state={'empty'} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <Total state={'error'} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <Total state={'validating'} />
                    </SwiperSlide>
                </Swiper>

                <div>
                    <h1>Tabel</h1>
                </div>
            </div>
        </>
    )
}