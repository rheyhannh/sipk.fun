'use client'

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Icon } from '@/component/loader/ReactIcons'
import { useEffect, useState } from 'react';
import { mutate } from 'swr';
import CountUp from 'react-countup';
import { Spinner } from "./loader/Loading";
import "react-loading-skeleton/dist/skeleton.css";
import styles from './style/card.module.css'

export function Summary({ state, icon, color, title, data }) {

    const handleRetry = () => {
        mutate('/api/matkulku')
    }

    const SkeletonCard = () => (
        <div className={`${styles.summary}`}>
            <SkeletonTheme
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
            >
                <Skeleton borderRadius={'50%'} width={"100%"} height={"100%"} containerClassName={`${styles.summary__icon} ${styles.skeleton}`} />
            </SkeletonTheme>

            <div className={styles.summary__data}>
                <div
                    style={{ width: '100%' }}
                >
                    <h3 className={styles.summary__title}>
                        <SkeletonTheme
                            baseColor="var(--skeleton-base)"
                            highlightColor="var(--skeleton-highlight)"
                        >
                            <Skeleton width={"80%"} height={"100%"} />
                        </SkeletonTheme>
                    </h3>
                    <h1>
                        <SkeletonTheme
                            baseColor="var(--skeleton-base)"
                            highlightColor="var(--skeleton-highlight)"
                        >
                            <Skeleton width={"60%"} height={"100%"} />
                        </SkeletonTheme>
                    </h1>
                </div>
                <SkeletonTheme
                    baseColor="var(--skeleton-base)"
                    highlightColor="var(--skeleton-highlight)"
                >
                    <Skeleton borderRadius={'50%'} containerClassName={`${styles.summary__progress} ${styles.skeleton}`} width={"100%"} height={"100%"} />
                </SkeletonTheme>
            </div>
            <div>
                <small>
                    <SkeletonTheme
                        baseColor="var(--skeleton-base)"
                        highlightColor="var(--skeleton-highlight)"
                    >
                        <Skeleton width={"60%"} height={"100%"} />
                    </SkeletonTheme>
                </small>
            </div>

        </div>
    )

    const LoadedCard = () => {
        const [dashArray, setDashArray] = useState('0 999');

        const getCircleDraw = (radius, percentage) => {
            const roundCircum = 2 * radius * Math.PI;
            const roundDraw = percentage * roundCircum / 100;
            return `${roundDraw.toFixed(2)} 999`;
        }

        useEffect(() => {
            setDashArray(getCircleDraw(35, data.percentage))
        }, [data])

        return (
            <div className={`${styles.summary}`}>
                <div style={{ background: color ? color : 'var(--first-color)' }} className={styles.summary__icon}>
                    {icon.name && icon.lib ?
                        <Icon name={icon.name} lib={icon.lib} props={{ size: '24px' }} />
                        : null
                    }
                </div>

                <div className={styles.summary__data}>
                    <div>
                        <h3 className={styles.summary__title}>{title}</h3>
                        <CountUp
                            start={0}
                            duration={2.5}
                            decimals={Number.isInteger(data.value) ? 0 : 2}
                            end={data.value}
                            delay={0}
                        >
                            {({ countUpRef }) => (
                                <h1
                                    ref={countUpRef} />
                            )}
                        </CountUp>
                    </div>
                    <div className={styles.summary__progress}>
                        <svg>
                            <svg
                                className={styles.summary__progress_circle}
                                style={{
                                    stroke: color ? color : 'var(--first-color)',
                                    strokeDasharray: dashArray
                                }}
                            >
                                <circle cx='50%' cy='50%' r='35'></circle>
                            </svg>
                        </svg>
                        <CountUp
                            start={0}
                            end={data.percentage}
                            duration={2.5}
                            delay={0}
                            suffix={'%'}
                        >
                            {({ countUpRef }) => (
                                <span
                                    style={{ color: color ? color : 'var(--first-color)' }}
                                    ref={countUpRef} />
                            )}
                        </CountUp>
                    </div>
                </div>
                <small>{data.lastUpdated}</small>
            </div>
        )
    }

    const ErrorCard = () => (
        <div className={styles.summary}>
            <div className={styles.error__wrapper}>
                <div className={styles.error__content} onClick={handleRetry}>
                    <h5>Gagal mengambil data</h5>
                    <h1>&#x21bb;</h1>
                </div>
            </div>
        </div>
    )

    const ValidatingCard = () => (
        <div className={styles.summary}>
            <div className={styles.validating__wrapper}>
                <div className={styles.validating__content} onClick={handleRetry}>
                    <Spinner size={'35px'} color={'var(--logo-second-color)'} />
                </div>
            </div>
        </div>
    )

    if (state === 'loading') { return (<SkeletonCard />) }
    else if (state === 'loaded') { return (<LoadedCard />) }
    else if (state === 'error') { return (<ErrorCard />) }
    else if (state === 'validating') { return (<ValidatingCard />) }
    else { return 'Unidentified Card State' }
}