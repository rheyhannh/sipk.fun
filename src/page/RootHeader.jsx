'use client'

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

const Header = ({ children, ...props }) => (
    <header className={styles.header} {...props}>
        {children}
    </header>
)

export default Header;