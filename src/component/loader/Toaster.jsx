'use client'

// ========== COMPONENT DEPEDENCY ========== //
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
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
                        const customColor = { error: 'var(--danger-sec-color)', success: 'var(--success-sec-color)' }
                        const isLoading = t.type === 'loading' ? true : false;
                        const isError = t.type === 'error' ? true : false;
                        const isSuccess = t.type === 'success' ? true : false;
                        const isImportant = ['loading', 'error', 'success'].includes(t.type);
                        t.iconTheme = { primary: `var(--${isError ? 'danger-sec-color' : isSuccess ? 'success-sec-color' : 'logo-second-color'})`, secondary: '#fff'}
                        
                        return (
                            <>
                                {!isLoading && icon}
                                {isLoading && (
                                    <Spinner
                                        size={'12px'}
                                        color={'var(--logo-second-color)'}
                                    />
                                )}
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
                            </>
                        )
                    }}
                </ToastBar>
            )}
        </Toaster>
    )
}

/*
============================== CODE END HERE ==============================
*/