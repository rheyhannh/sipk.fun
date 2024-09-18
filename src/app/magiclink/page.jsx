// #region PAGE DEPEDENCY
import Magiclink from '@/page/Magiclink';
// #endregion

// #region UTIL DEPEDENCY
import { getFaktaData } from '@/utils/core_data';
// #endregion

export default async function MagiclinkPage() {
    const fakta = await getFaktaData();

    return (
        <Magiclink fakta={fakta} />
    )
}