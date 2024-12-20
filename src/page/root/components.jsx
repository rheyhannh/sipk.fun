// #region STYLE DEPEDENCY
import styles from '@root_page/root.module.css';
// #endregion

export const Container = ({ children }) => (
    <div className={styles.container}>
        {children}
    </div>
)

export const ContainerWrapper = ({ children }) => (
    <div className={styles.container_wrap}>
        {children}
    </div>
)