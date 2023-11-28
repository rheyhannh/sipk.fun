'use client'

// ========== COMPONENT DEPEDENCY ========== //
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';

// ========== ICON DEPEDENCY ========== //
import { Spinner } from './Loading';

/*
============================== CODE START HERE ==============================
*/
export default function Notification({ position }) {
    return (
        <Toaster
            toastOptions={{
                style: {
                    background: 'var(--white-color)',
                    color: 'var(--logo-second-color)'
                }
            }}
            position={'bottom-center'}
        >
            {(t) => (
                <ToastBar toast={t}>
                    {({ icon, message }) => {
                        const customColor = { error: '#FF4B4B', success: '#61D345' }
                        const isLoading = t.type === 'loading' ? true : false;
                        const isImportant = ['loading', 'error', 'success'].includes(t.type);
                        return (
                            <>
                                {!isLoading && icon}
                                <span style={
                                    {
                                        fontWeight: isImportant ? 700 : 600,
                                        color: customColor[t.type] ? customColor[t.type] : ''
                                    }}
                                >
                                    {message}
                                </span>
                                {!isLoading && (
                                    <FaTimes
                                        onClick={() => toast.dismiss(t.id)}
                                        style={{ cursor: 'pointer', color: 'crimson' }} size={'13px'}
                                    />
                                )}
                                {isLoading && (
                                    <Spinner
                                        size={'12px'}
                                        color={'var(--logo-second-color)'}
                                    />
                                )}
                            </>
                        )
                    }}
                </ToastBar>
            )}
        </Toaster>
    )
}
