// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@root_page/root.module.css';
// #endregion

export const Container = ({ children }) => (
    <div className={styles.container}>
        {children}
    </div>
)

/**
 * Component Description
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props ContainerWrapper props
 * @returns {React.ReactElement} Rendered component
 */
export const ContainerWrapper = ({ children, ...props }) => (
    <div className={styles.container_wrap} {...props}>
        {children}
    </div>
)