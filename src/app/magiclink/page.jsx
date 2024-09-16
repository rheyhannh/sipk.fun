// #region PAGES DEPEDENCY
import Magiclink from '@/pages/Magiclink';
// #endregion

// #region UTIL DEPEDENCY
import { getFaktaData } from '@/utils/core_data';
// #endregion

// #region VARIABLES
const revalidateFaktaData = 10800; // Revalidate every 3 hours
// #endregion

export default async function Page() {
    const fakta = await getFaktaData(revalidateFaktaData);

    return (
        <Magiclink fakta={fakta} />
    )
}