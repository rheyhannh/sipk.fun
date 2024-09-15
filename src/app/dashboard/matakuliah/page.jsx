'use client'

// #region REACT DEPEDENCY
import { useState } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Grafik, Target, Progress, Distribusi } from '@/component/Card';
import { Table } from '@/component/Table';
// #endregion

// #region HOOKS DEPEDENCY
import { useMatkul, useUser, useUniversitas, useMatkulHistory } from '@/data/core';
// #endregion

// #region UTIL DEPEDENCY
import { getSessionTable, getSessionGrafik, getSessionTarget, getSessionDistribusi } from '@/utils/client_side';
// #endregion

// #region STYLE DEPEDENCY
import styles from './matkul.module.css'
import 'swiper/css';
import 'swiper/css/pagination';
// #endregion

// #region ICON DEPEDENCY
import { AiOutlineAppstore } from "react-icons/ai";
// #endregion

function GrafikCard() {
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: universitas, error: universitasError, isLoading: universitasLoading, isValidating: universitasValidating } = useUniversitas(null, 'user', user ? user[0].university_id : undefined);
    const isError = userError || matkulError || universitasError;
    const isLoading = userLoading || matkulLoading || universitasLoading;
    const isValidating = userValidating || matkulValidating || universitasValidating;

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
        return <Grafik state={'empty'} penilaian={universitas[0].penilaian} />
    }

    return (
        <Grafik state={'loaded'} matkul={matkul} penilaian={universitas[0].penilaian} savedState={savedState} />
    )
}

function TargetCard() {
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: universitas, error: universitasError, isLoading: universitasLoading, isValidating: universitasValidating } = useUniversitas(null, 'user', user ? user[0].university_id : undefined);
    const isError = userError || matkulError || universitasError;
    const isLoading = userLoading || matkulLoading || universitasLoading;
    const isValidating = userValidating || matkulValidating || universitasValidating;

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
        return <Target state={'empty'} penilaian={universitas[0].penilaian} />
    }

    return (
        <Target state={'loaded'} matkul={matkul} penilaian={universitas[0].penilaian} savedState={savedState} />
    )
}

function DistribusiCard() {
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: universitas, error: universitasError, isLoading: universitasLoading, isValidating: universitasValidating } = useUniversitas(null, 'user', user ? user[0].university_id : undefined);
    const isError = matkulError || userError || universitasError;
    const isLoading = matkulLoading || userLoading || universitasLoading;
    const isValidating = matkulValidating || userValidating || universitasValidating;

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
        return <Distribusi state={'empty'} penilaian={universitas[0].penilaian} />
    }

    return (
        <Distribusi state={'loaded'} matkul={matkul} penilaian={universitas[0].penilaian} savedState={savedState} />
    )
}

function ProgressCard() {
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: universitas, error: universitasError, isLoading: universitasLoading, isValidating: universitasValidating } = useUniversitas(null, 'user', user ? user[0].university_id : undefined);
    const isError = matkulError || userError || universitasError;
    const isLoading = matkulLoading || userLoading || universitasLoading;
    const isValidating = matkulValidating || userValidating || universitasValidating;

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
        return <Progress state={'empty'} penilaian={universitas[0].penilaian} />
    }

    return (
        <Progress state={'loaded'} user={user} matkul={matkul} penilaian={universitas[0].penilaian} />
    )
}

function TabelSection() {
    const { data: matkul, error: matkulError, isLoading: matkulLoading, isValidating: matkulValidating } = useMatkul();
    const { data: matkulHistory, error: matkulHistoryError, isLoading: matkulHistoryLoading, isValidating: matkulHistoryValidating } = useMatkulHistory();
    const { data: user, error: userError, isLoading: userLoading, isValidating: userValidating } = useUser();
    const { data: universitas, error: universitasError, isLoading: universitasLoading, isValidating: universitasValidating } = useUniversitas(null, 'user', user ? user[0].university_id : undefined);
    const isLoading = matkulLoading || userLoading || universitasLoading || matkulHistoryLoading;
    const isValidating = matkulValidating || userValidating || universitasValidating || matkulHistoryValidating;
    const isError = matkulError || userError || universitasError || matkulHistoryError;

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
            user={user[0]} matkul={matkul}
            sessionTable={sessionTable}
            matkulHistory={matkulHistory}
            penilaian={universitas[0].penilaian}
        />
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
                    noSwipingSelector={['#grafik_data-scroll', '#distribusi_data-scroll']}
                    modules={[Pagination]}
                    className={`${styles.insight} ${widget ? styles.active : ''}`}
                >
                    <SwiperSlide> <GrafikCard /> </SwiperSlide>
                    <SwiperSlide> <TargetCard /> </SwiperSlide>
                    <SwiperSlide> <DistribusiCard /> </SwiperSlide>
                    <SwiperSlide> <ProgressCard /> </SwiperSlide>
                </Swiper>

                <TabelSection />
            </div>
        </>
    )
}