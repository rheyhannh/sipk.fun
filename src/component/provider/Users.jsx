'use client'

// ========== REACT DEPEDENCY ========== //
import { createContext, useEffect, useState } from "react"

// ========== ICONS DEPEDENCY ========== //
import {
    FaCheckCircle,
    FaExclamationCircle,
} from "react-icons/fa";
import {
    FaPlus,
    FaCircleInfo,
    FaGear
} from "react-icons/fa6";

// ========== STYLE DEPEDENCY ========== //
import form from '../style/form.module.css'

/*
============================== CODE START HERE ==============================
*/
export const UsersContext = createContext();
export const UsersProvider = ({ children }) => {
    /*
    ========== States ==========
    */
    // Mode (Login or Register)
    const [loginMode, setLoginMode] = useState(null);

    // Big Content (min-width: 870px)
    const [isBigContent, setBigContent] = useState(0);

    /*
    ========== Use Effect Hook ==========
    */
    useEffect(() => {
        // Content Init
        const bigMediaQuery = window.matchMedia('(min-width: 870px)');

        const handleBigMediaQueryChange = (e) => {
            setBigContent(e.matches);
        }

        handleBigMediaQueryChange(bigMediaQuery);

        bigMediaQuery.addEventListener('change', handleBigMediaQueryChange);

        return () => {
            bigMediaQuery.removeEventListener('change', handleBigMediaQueryChange);
        }

    }, [])

    /*
    ========== Required Data ==========
    */

    const listUniversitas = [
        { id: 1, nama: 'Universitas Brawijaya' },
        { id: 2, nama: 'Universitas Diponegoro' },
        { id: 3, nama: 'Universitas Indonesia' },
        { id: 4, nama: 'Institut Teknologi Bandung' },
        { id: 5, nama: 'Universitas Airlangga' },
        { id: 6, nama: 'Institut Pertanian Bogor' },
        { id: 7, nama: 'Institut Teknologi Sepuluh November' },
        { id: 8, nama: 'Telkom University' },
        { id: 9, nama: 'Universitas Padjajaran' },
        { id: 10, nama: 'Universitas Jendral Soedirman' },
    ]

    const daftarAccordionList = [
        {
            title: 'Nama Lengkap',
            description: (
                <ul>
                    <li>Gunakan hanya huruf, tanpa simbol atau angka</li>
                    <li>Panjang minimal 6 karakter, maksimal 100</li>
                    <li>Gunakan hanya satu spasi di antara setiap kata</li>
                </ul>
            ),
            icon: <FaPlus />
        },
        {
            title: 'Universitas',
            description: (
                <ul>
                    <li>Pilih universitas yang sesuai dan tersedia</li>
                    <li>Universitas yang berbeda dapat mempengaruhi penilaian, pastikan kamu memilih yang sesuai</li>
                    <li>Jika universitasmu belum tersedia, kamu dapat daftar <span style={{ color: 'green' }}>disini</span></li>
                </ul>
            ),
            icon: <FaPlus />
        },
        {
            title: 'Email',
            description: (
                <ul>
                    <li>Gunakan email valid yang dapat dihubungi</li>
                    <li>Konfirmasi pendaftaran dengan mengklik link yang dikirimkan SIPK</li>
                </ul>

            ),
            icon: <FaPlus />
        }
        ,
        {
            title: 'Password',
            description: (
                <ul>
                    <li>Gunakan password minimal 6 karakter, maksimal 50</li>
                    <li>Disarankan kombinasi huruf kecil, huruf besar, angka dan simbol</li>
                    <li>Password lemah atau kurang kuat dapat digunakan, walaupun tidak disarankan</li>
                </ul>
            ),
            icon: <FaPlus />
        }
        ,
        {
            title: 'Keterangan Icon',
            description: (
                <div className={form.keterangan_icon}>
                    <span><FaCircleInfo color='var(--primary-color)' />  Data dibutuhkan</span>
                    <span><FaGear color='var(--logo-second-color)' />  Data sedang divalidasi</span>
                    <span><FaCheckCircle color='var(--success-color)' />  Data Valid</span>
                    <span><FaCheckCircle color='var(--warning-color)' />  Password kurang kuat</span>
                    <span><FaCheckCircle color='var(--danger-color)' />  Password lemah</span>
                    <span><FaExclamationCircle color='crimson' />  Data Invalid</span>
                </div>
            ),
            icon: <FaPlus />
        }
    ]

    return (
        <UsersContext.Provider
            value={{
                loginMode, setLoginMode,
                isBigContent, setBigContent,
                listUniversitas, daftarAccordionList
            }}
        >
            {children}
        </UsersContext.Provider>
    )
}