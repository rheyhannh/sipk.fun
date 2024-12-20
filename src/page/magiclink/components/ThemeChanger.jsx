'use client'

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { mutate } from 'swr';
import { MagiclinkContext } from '@magiclink_page/provider';
// #endregion

// #region HOOKS DEPEDENCY
import useLocalTheme from '@/hooks/swr/useLocalTheme';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@magiclink_page/magiclink.module.css';
// #endregion

// #region ICON DEPEDENCY
import { FiSun, FiMoon } from 'react-icons/fi';
// #endregion

/**
 * Magiclink theme changer dengan classname yang sudah ditentukan
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props ThemeChanger props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLDivElement>, 'className'>, HTMLDivElement>} Rendered theme changer
 */
function ThemeChanger({ ...props }) {
    const { getClassnameByState } = React.useContext(MagiclinkContext);
    const { data: theme } = useLocalTheme();
    const handleChangeTheme = (newTheme) => {
        if (theme === newTheme) { return }
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark')
        mutate('localUserTheme');
    }

    return (
        <div className={`${styles.theme__outter} ${getClassnameByState()}`} {...props}>
            <div className={styles.theme__inner}>
                <div className={`${styles.circle} ${theme !== 'dark' ? styles.active : ''}`} onClick={() => { handleChangeTheme('light') }}>
                    <FiSun size={'15px'} />
                </div>
                <div className={`${styles.circle} ${theme === 'dark' ? styles.active : ''}`} onClick={() => { handleChangeTheme('dark') }}>
                    <FiMoon size={'15px'} />
                </div>
            </div>
        </div>
    )
}

export default ThemeChanger;