'use client'

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { MagiclinkContext } from '@magiclink_page/provider';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@magiclink_page/magiclink.module.css';
// #endregion

// #region ICON DEPEDENCY
import { FaLink, FaCheck, FaExclamation } from "react-icons/fa";
// #endregion

/**
 * Magiclink wrapper dengan classname yang sudah ditentukan
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props Wrapper props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLDivElement>, 'className'>, HTMLDivElement>} Rendered wrapper
 */
function Wrapper({ children, ...props }) {
    const { states, getClassnameByState } = React.useContext(MagiclinkContext);

    return (
        <div className={`${styles.wrapper} ${getClassnameByState()}`} {...props}>
            <div className={styles.border__wrapper}>
                <span className={`${styles.border__top} ${states.success || states.error || !states.loading ? styles.hide : ''}`} />
                <span className={`${styles.border__right} ${states.success || states.error || !states.loading ? styles.hide : ''}`} />
                <span className={`${styles.border__bottom} ${states.success || states.error || !states.loading ? styles.hide : ''}`} />
                <span className={`${styles.border__left} ${states.success || states.error || !states.loading ? styles.hide : ''}`} />
            </div>
            <div className={`${styles.icon__outter} ${getClassnameByState()}`} />
            <div className={`${styles.icon__inner} ${getClassnameByState()}`}>
                <div className={`${styles.icon} ${styles.loading} ${states.loading ? styles.active : ''} ${states.success || states.error ? styles.hide : ''}`}>
                    <FaLink />
                </div>
                <div className={`${styles.icon} ${styles.success} ${states.success ? styles.active : ''}`}>
                    <FaCheck />
                </div>
                <div className={`${styles.icon} ${styles.error} ${states.error ? styles.active : ''}`}>
                    <FaExclamation />
                </div>
            </div>
            {children}
        </div>
    )
}

export default Wrapper;