// #region STYLE DEPEDENCY
import styles from '@magiclink_page/magiclink.module.css';
// #endregion

/**
 * Magiclink container dengan classname yang sudah ditentukan
 * @param {Omit<import('react').HTMLProps<HTMLDivElement>, 'className'>} props Container props
 * @returns {import('react').ReactElement<Omit<import('react').HTMLProps<HTMLDivElement>, 'className'>, HTMLDivElement>} Rendered container
 */
function Container({ children, ...props }) {
    return (
        <div className={styles.container} {...props}>
            <div className={styles.backdrop}>
                {children}
            </div>
        </div>
    )
}

export default Container;