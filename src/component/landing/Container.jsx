// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context'
// #endregion

// #region REACT DEPEDENCY
import { useContext } from "react"
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from "@/component/provider/Landing"
// #endregion

export function Container({ children }) {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice } = useContext(LandingContext);

    return (
        <main className={`landing`}>
            {children}
        </main>
    )
}