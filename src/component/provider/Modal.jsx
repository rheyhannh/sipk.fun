'use client'

// ========== REACT DEPEDENCY ========== //
import { createContext, useEffect, useState } from "react"

// ========== ICONS DEPEDENCY ========== //
import {
    PanduanDaftar,
    PerubahanTerakhirDetail,
    PerubahanTerakhirConfirm,
    TambahMatkul
} from "../Modals"

/*
============================== CODE START HERE ==============================
*/
export const ModalContext = createContext();
export const ModalProvider = ({ children }) => {
    const [active, setActive] = useState(false);
    const [modal, setModal] = useState(null);
    const [data, setData] = useState(null);

    const handleModalClose = () => {
        setActive(false);
        setTimeout(() => {
            setModal(null);
            setData(null);
        }, 350);
    }

    useEffect(() => {
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
            panduanDaftar: <PanduanDaftar/>,
            perubahanTerakhirDetail: <PerubahanTerakhirDetail />,
            perubahanTerakhirConfirm: <PerubahanTerakhirConfirm />,
            tambahMatkul: <TambahMatkul/>
        }
    }

    return (
        <ModalContext.Provider
            value={{
                setModal, setActive, setData, handleModalClose,
                modal, active, data
            }}
        >
            {modalList.type[modal]}
            {children}
        </ModalContext.Provider>
    )
}