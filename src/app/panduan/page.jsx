// #region PAGE DEPEDENCY
import Panduan from '@/page/Panduan';
// #endregion

// #region UTIL DEPEDENCY
import {
    getFaktaData
} from '@/utils/core_data';
// #endregion

export default async function RootPage() {
    const fakta = await getFaktaData();

    return (
        <Panduan fakta={fakta} />
    )
}