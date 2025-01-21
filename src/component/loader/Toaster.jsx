'use client';

// #region COMPONENT DEPEDENCY
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import { Spinner } from './Loading';
// #endregion

// #region ICON DEPEDENCY
import { FaTimes } from 'react-icons/fa';
// #endregion

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
						const customColor = {
							error: 'var(--danger-sec-color)',
							success: 'var(--success-sec-color)'
						};
						const isLoading = t.type === 'loading';
						const isError = t.type === 'error';
						const isSuccess = t.type === 'success';
						const isImportant = ['loading', 'error', 'success'].includes(
							t.type
						);
						t.iconTheme = {
							primary: `var(--${isError ? 'danger-sec-color' : isSuccess ? 'success-sec-color' : 'logo-second-color'})`,
							secondary: '#fff'
						};

						return (
							<>
								{!isLoading && icon}
								{isLoading && (
									<Spinner size={'12px'} color={'var(--logo-second-color)'} />
								)}
								<span
									style={{
										fontWeight: isImportant ? 700 : 600,
										color: customColor[t.type] ? customColor[t.type] : ''
									}}
								>
									{message}
								</span>
								{!isLoading && (
									<FaTimes
										onClick={() => toast.dismiss(t.id)}
										style={{ cursor: 'pointer', color: 'crimson' }}
										size={'13px'}
									/>
								)}
							</>
						);
					}}
				</ToastBar>
			)}
		</Toaster>
	);
}
