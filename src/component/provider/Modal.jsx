'use client'

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import {
    Default,
    PanduanDaftar,
    Logout,
    PerubahanTerakhirDetail,
    PerubahanTerakhirConfirm,
    TambahMatkul,
    DetailMatkul,
    Profil,
    Rating,
    TabelSetting,
    TabelFilter,
    HapusPermanentConfirm,
    Akun,
    Tentang
} from "../Modal"
// #endregion

export const ModalContext = React.createContext();
/**
 * Modal context provider. Use this wrapper to use Modal component.
 * @param {{children:any}} props React props object
 * @param props.children Component or element children.
 * @returns {ReactElement} Modal context provider wrapper.
 */
export const ModalProvider = ({ children }) => {
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

    const handleModalPrev = () => {
        if (prevModal && modalList.type[prevModal]) {
            setData(null);
            setPrevModal(null);
            setModal(prevModal);
        }
    }

    React.useEffect(() => {
        if (active) { document.body.classList.add('disable_scroll'); }
        else { document.body.classList.remove('disable_scroll'); }

        // const handleClickOutside = (e) => {
        //     const modal = document.getElementById('modal');
        //     if (modal && !modal.contains(e.target)) {
        //         handleModalClose();
        //     }
        // }

        // document.addEventListener('click', handleClickOutside);

        // return () => {
        //     document.removeEventListener('click', handleClickOutside);
        // }
    }, [active])

    const modalList = {
        type: {
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
    }

    return (
        <ModalContext.Provider
            value={{
                modal, active, data, prevModal,
                setModal, setActive, setData, setPrevModal,
                handleModalClose, handleModalPrev
            }}
        >
            {modalList.type[modal]}
            {children}
        </ModalContext.Provider>
    )
}