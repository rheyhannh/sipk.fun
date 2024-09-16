// #region COMPONENT DEPEDENCY
import Magiclink from "@/component/Magiclink";
// #endregion

// #region UTIL DEPEDENCY
import { getFaktaData } from '@/utils/core_data';
// #endregion

// #region VARIABLES
const revalidateFaktaData = 30;
// #endregion

export default async function Page() {
    const fakta = await getFaktaData(revalidateFaktaData);

    return (
        <Magiclink fakta={fakta} />
    )
}