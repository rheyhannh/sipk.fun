// #region PAGE DEPEDENCY
import Root from '@/page/Root';
// #endregion

// #region UTIL DEPEDENCY
import {
    getUniversitasData,
    getRatingData,
    getNotifikasiData
} from '@/utils/core_data';
// #endregion

export default async function RootPage() {
    const universitas = await getUniversitasData();
    const rating = await getRatingData();
    const notifikasi = await getNotifikasiData();

    return (
        <Root universitas={universitas} rating={rating} notifikasi={notifikasi} />
    )
}