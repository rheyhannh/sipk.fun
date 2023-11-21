import { FaTimes } from 'react-icons/fa'
import styles from './style/modal.module.css'

export default function Modal({ children, active, setActive }) {
    return (
        <div className={`${styles.backdrop} ${active ? styles.active : ''}`}>
            <div className={styles.container}>
                {children}
                <div className={styles.close} onClick={() => { setActive(false) }}>
                    <FaTimes />
                </div>
            </div>
        </div>
    )
}