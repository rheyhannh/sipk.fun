'use client'

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import { useCookies } from 'next-client-cookies';
// #endregion

// #region COMPONENT DEPEDENCY
import { ErrorBoundary } from 'react-error-boundary';
// #endregion

// #region UTIL DEPEDENCY
import { handleReactErrorBoundary } from '@/lib/bugsnag';
// #endregion

// #region ICON DEPEDENCY
import { FaRegTimesCircle } from 'react-icons/fa';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css'
// #endregion
/** 
 * Object dengan key sebagai nama modal dan value element `JSX` untuk modal tersebut
 * @typedef {typeof availableModal} AvailableModal 
 * */
export const availableModal = {
    default: <Default />,
    panduanDaftar: <PanduanDaftar />,
    logout: <Logout />,
    perubahanTerakhirDetail: <PerubahanTerakhirDetail />,
    perubahanTerakhirConfirm: <PerubahanTerakhirConfirm />,
    tambahMatkul: <TambahMatkul />,
    profil: <Profil />,
    rating: <Rating />,
    tabelSetting: <TabelSetting />,
    tabelFilter: <TabelFilter />,
    detailMatkul: <DetailMatkul />,
    hapusPermanentConfirm: <HapusPermanentConfirm />,
    akun: <Akun />,
    tentang: <Tentang />
}

export const ModalContext = React.createContext(/** @type {import('@/types/context').ModalContext} */({}));
export const ModalProvider = ({ children }) => {
    const cookieResolver = useCookies();
    const [active, setActive] = React.useState(false);
    const [modal, setModal] = React.useState(null);
    const [prevModal, setPrevModal] = React.useState(null);
    const [data, setData] = React.useState(null);

    const handleModalClose = () => {
        setActive(false);
        setTimeout(() => {
            setModal(null);
            setPrevModal(null);
            setData(null);
        }, 350);
    }

    const handleModalPrev = (resetData = true) => {
        if (prevModal && availableModal[prevModal]) {
            if (resetData) { setData(null); }
            setPrevModal(null);
            setModal(prevModal);
        }
    }

    const handleShowModal = (type, data = null, beforeShowingModal, afterShowingModal) => {
        if (!type || !availableModal[type]) return;
        if (beforeShowingModal && typeof beforeShowingModal === 'function') beforeShowingModal();
        setData(data);
        setModal(type);
        setTimeout(() => {
            setActive(true);
            if (afterShowingModal && typeof afterShowingModal === 'function') afterShowingModal();
        }, 50)
    }

    React.useEffect(() => {
        if (active) { document.body.classList.add('disable_scroll'); }
        else { document.body.classList.remove('disable_scroll'); }
    }, [active])

    return (
        <ModalContext.Provider
            value={{
                modal, active, data, prevModal,
                setModal, setActive, setData, setPrevModal,
                handleModalClose, handleModalPrev, handleShowModal
            }}
        >
            <ErrorBoundary
                FallbackComponent={ModalError}
                onError={(error, info) => handleReactErrorBoundary(error, info, cookieResolver, 'ModalError')}
                onReset={() => {
                    setActive(false);
                    setModal(null);
                    setPrevModal(null);
                    setData(null);
                }}
            >
                {availableModal[modal]}
            </ErrorBoundary>
            {children}
        </ModalContext.Provider>
    )
}

function ModalError({ error, resetErrorBoundary }) {
    return (
        <div className={`${styles.backdrop} ${styles.active}`}>
            <div
                id={'modal_error'}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') resetErrorBoundary();
                    if (event.key === 'Escape') resetErrorBoundary();
                }}
                tabIndex={0}
                className={styles.default}
            >
                <div className={styles.main}>
                    <FaRegTimesCircle size={'70px'} color={'var(--logo-second-color)'} />
                </div>

                <div style={{ textAlign: 'center' }} className={styles.title}>
                    <h2>
                        Ooops!
                    </h2>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p>
                        Sepertinya terjadi kesalahan. Silahkan klik tombol dibawah atau refresh halaman.
                    </p>
                </div>

                <div className={styles.form__action}>
                    <div
                        tabIndex={'0'}
                        className={`${styles.btn} ${styles.confirm}`}
                        onClick={() => { resetErrorBoundary(); }}
                    >
                        <h3>
                            Tutup
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    )
}