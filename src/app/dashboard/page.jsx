// #region COMPONENT DEPEDENCY
import { AcademicCard, UpdateCard, HistoryCard } from '@/component/Card';
// #endregion

// #region UTIL DEPEDENCY
import { getUniversitasData, getNotifikasiData } from '@/utils/core_data';
// #endregion

// #region STYLE DEPEDENCY
import styles from './home.module.css';
// #endregion

// #region VARIABLES
const revalidateUniversitasData = 86400; // Revalidate every 24 hours
const revalidateNotifikasiData = 3600; // Revalidate every 1 hours
// #endregion

export default async function DashboardPage() {
    const universitas = await getUniversitasData(revalidateUniversitasData);
    const notifikasi = await getNotifikasiData(revalidateNotifikasiData);

    return (
        <div className={styles.wrapper}>
            <div className={styles.primary}>
                <h1 className={styles.wrapper__title}>Dasbor</h1>
                <div className={styles.insight}>
                    <AcademicCard count={3} universitas={universitas} />
                </div>
            </div>
            <div className={styles.secondary}>
                <div>
                    <h2 className={styles.wrapper__title}>Update</h2>
                    <UpdateCard notifikasi={notifikasi} />
                </div>
                <div className={styles.history}>
                    <h2 className={styles.wrapper__title}>Perubahan Terakhir</h2>
                    <HistoryCard count={3} universitas={universitas} />
                </div>
            </div>
        </div>
    )
}