// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js'
// #endregion

// #region REACT DEPEDENCY
import { useContext } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '../provider/Landing'
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/landing.module.css'
// #endregion

export function Wrapper({ children }) {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice } = useContext(LandingContext);

    return (
        <div className={styles.wrapper}>
            <h1>isRichContent : {isRichContent ? 'true' : 'false'}</h1>
            <h1>isTouchDevice : {isTouchDevice ? 'true' : 'false'}</h1>
        </div>
    )
}