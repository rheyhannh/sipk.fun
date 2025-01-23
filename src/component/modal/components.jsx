// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { ModalContext } from '@/component/modal/provider';
// #endregion

// #region ICON DEPEDENCY
import { FaTimes } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@/component/modal/modal.module.css';
// #endregion

/**
 * Component sebagai backdrop modal dengan classname yang sudah ditentukan
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props Backdrop props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLDivElement>, 'className'>, HTMLDivElement>} Rendered component
 */
export const Backdrop = ({ children, ...props }) => {
	const { active } = React.useContext(ModalContext);

	return (
		<div
			className={`${styles.backdrop} ${active ? styles.active : ''}`}
			{...props}
		>
			{children}
		</div>
	);
};

/**
 * Props yang digunakan component `Layout`
 * @typedef {Object} LayoutProps
 * @property {keyof React.JSX.IntrinsicElements} [as]
 * Tipe element layout
 * - Default : `'div'`
 * @property {React.HTMLProps<HTMLElement>['id']} [id]
 * Attribut id yang digunakan pada element layout
 * - Default : `'modal'`
 * @property {(event:React.KeyboardEvent<HTMLElement>, isLayout:boolean, layoutRef:React.RefObject<HTMLElement>['current']) => void} onEnter
 * Callback atau handler saat tombol enter ditekan. Contohnya dapat berupa submit form jika content modal sebuah form.
 * Terdapat param berikut,
 * - `event` : React keyboard event
 * - `isLayout` : Boolean apakah enter ditekan saat element layout sedang focus
 * - `layoutRef` : Current ref dari layout, dapat bernilai `null`
 *
 * Jika menggunakan atribut `onKeyDown`, behaviour ini akan dioverride.
 * @property {boolean | () => void} [onEsc]
 * Dapat berupa boolean jika truthy akan menutup modal saat tombol esc ditekan, atau sebuah callback saat tombol esc ditekan.
 * - Default : `true`
 *
 * Jika menggunakan atribut `onKeyDown`, behaviour ini akan dioverride.
 */

/**
 * Component sebagai layout modal dengan `className` yang tersedia pada {@link styles css module}
 * @param {Omit<React.HTMLProps<HTMLElement>, 'id' | 'onKeyDown'> & LayoutProps} props Backdrop props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLElement>, 'id' | 'onKeyDown'>, HTMLElement>} Rendered component
 */
export const Layout = ({
	as: Layout = 'div',
	id = 'modal',
	onEnter,
	onEsc = true,
	children,
	...props
}) => {
	const { handleModalClose } = React.useContext(ModalContext);
	const modalRef = React.useRef(
		/** @type {React.RefObject<HTMLElement>} */
		(null)
	);

	React.useEffect(() => {
		if (modalRef.current) {
			setTimeout(() => {
				if (modalRef.current?.focus) modalRef.current.focus();
			}, 225);
		}
	}, []);

	return (
		<Layout
			ref={modalRef}
			id={id}
			onKeyDown={(event) => {
				if (event.key === 'Enter') {
					if (onEnter && typeof onEnter === 'function') {
						onEnter(
							event,
							event.target === modalRef?.current,
							modalRef?.current
						);
					}
				} else if (event.key === 'Escape') {
					if (onEsc) {
						if (typeof onEsc === 'function') onEsc();
						else handleModalClose();
					}
				}
			}}
			tabIndex={0}
			{...props}
		>
			{children}
		</Layout>
	);
};

/**
 * Component sebagai head modal dengan classname yang sudah ditentukan. Ini berisikan judul dan tombol untuk menutup modal.
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props Backdrop props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLDivElement>, 'className'>, HTMLDivElement>} Rendered component
 */
export const Head = ({ title, ...props }) => {
	const { handleModalClose, prevModal, handleModalPrev } =
		React.useContext(ModalContext);

	return (
		<div className={styles.top} {...props}>
			{prevModal && (
				<div
					className={styles.prev}
					onClick={(event) => {
						event.target.blur();
						handleModalPrev();
					}}
					onKeyDown={(event) => {
						if (event.key === 'Enter') handleModalPrev();
					}}
					tabIndex={0}
				>
					<IoArrowBack />
				</div>
			)}
			<div className={styles.title}>
				<h2>{title}</h2>
			</div>
			<div
				className={styles.close}
				onClick={(event) => {
					event.target.blur();
					handleModalClose();
				}}
				onKeyDown={(event) => {
					if (event.key === 'Enter') handleModalClose();
				}}
				tabIndex={0}
			>
				<FaTimes />
			</div>
		</div>
	);
};

/**
 * Props yang digunakan component `Button`
 * @typedef {Object} ButtonProps
 * @property {keyof React.JSX.IntrinsicElements} [as]
 * Tipe element button
 * - Default : `'div'`
 * @property {keyof React.JSX.IntrinsicElements} titleAs
 * Tipe element title
 * - Default : `'h3'`
 * @property {string} title
 * Teks yang tampil pada button
 * @property {'close' | () => void} action
 * Dapat berupa sebuah callback yang akan dipanggil saat button ditekan atau saat button focus dan tombol Enter dipencet,
 * atau berupa `'close'` untuk menutup modal.
 *
 * Jika menggunakan atribut `onKeyDown`, behaviour ini akan dioverride.
 * @property {Array<'onKeyDown' | 'onClick'>} usePreventDefault
 * Gunakan prevent default pada saat element dienter `onKeyDown` atau ditekan `onClick` atau keduanya.
 */

/**
 * Component sebagai button modal dengan `className` yang tersedia pada {@link styles css module}
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'onKeyDown' | 'onClick' | 'tabIndex'> & ButtonProps} props Button props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLDivElement>, 'onKeyDown' | 'onClick' | 'tabIndex'>, HTMLDivElement>} Rendered component
 */
export const Button = ({
	as: Button = 'div',
	titleAs: Title = 'h3',
	title,
	action,
	usePreventDefault,
	...props
}) => {
	const { handleModalClose } = React.useContext(ModalContext);

	const handleAction = () => {
		if (action === 'close') handleModalClose();
		if (typeof action === 'function') action();
	};

	return (
		<Button
			onKeyDown={(event) => {
				if (event.key === 'Enter') {
					if (
						usePreventDefault &&
						Array.isArray(usePreventDefault) &&
						usePreventDefault.includes('onKeyDown') &&
						event?.preventDefault
					)
						event.preventDefault();
					if (action) handleAction();
				}
			}}
			onClick={(event) => {
				if (
					usePreventDefault &&
					Array.isArray(usePreventDefault) &&
					usePreventDefault.includes('onClick') &&
					event?.preventDefault
				)
					event.preventDefault();
				if (action) {
					event.currentTarget.blur();
					handleAction();
				}
			}}
			tabIndex={0}
			{...props}
		>
			<Title>{title}</Title>
		</Button>
	);
};

/**
 * Component sebagai inner modal dengan classname yang sudah ditentukan. Ini memungkinkan scroll saat content modal overflow.
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'>} props Inner props
 * @returns {React.ReactElement<Omit<React.HTMLProps<HTMLDivElement>, 'className'>, HTMLDivElement>} Rendered component
 */
export const Inner = ({ children, ...props }) => (
	<div className={styles.inner} {...props}>
		{children}
	</div>
);
