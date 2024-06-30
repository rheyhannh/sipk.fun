'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region REACT DEPEDENCY
import { useContext } from "react"
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from "@/component/provider/Landing"
import ThemeChanger from '../_test/ThemeChanger';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/landing.module.css'
// #endregion

/**
 * Render landing page container
 * @param {{children}} props React props object
 * @param props.children Component or element children
 * @returns {ReactElement} Element react untuk render landing page container
 */
export function Container({ children }) {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice } = useContext(LandingContext);

    return (
        <main>
            <div className={styles.container}>
                <ThemeChanger/>
                {children}
            </div>
        </main>
    )
}

const ThemeChanger = () => {
    const { data: theme } = useLocalTheme();

    const handleChangeTheme = (newTheme) => {
        if (theme === newTheme) { return }
        localStorage.setItem('_theme', theme === 'dark' ? 'light' : 'dark')
        mutate('localUserTheme');
    }

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         console.log('Change theme every 3.5secs for preview.');
    //         handleChangeTheme(theme === 'dark' ? 'light' : 'dark');
    //     }, 3500);

    //     return () => {
    //         clearInterval(intervalId);
    //     };
    // }, [handleChangeTheme, theme]);

    return (
        <div
            className={styles.theme_changer}
            onClick={() => handleChangeTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'dark' ? <FiSun size={'18px'} /> : <FiMoon size={'18px'} />}
        </div>
    )
}