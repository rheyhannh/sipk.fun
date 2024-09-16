'use client'

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Grafik, Target, Progress, Distribusi } from '@/component/Card';
import { Table } from '@/component/Table';
// #endregion

// #region HOOKS DEPEDENCY
import { useMatkul, useUser, useMatkulHistory } from '@/data/core';
// #endregion

// #region UTIL DEPEDENCY
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

export default function DashboardMatakuliah({ universitas }) {
    const [widget, setWidget] = React.useState(true);

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
        </>
    )
}