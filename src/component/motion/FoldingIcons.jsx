// #region TYPE DEPEDENCY
import * as FoldingIconsProps from './types/FoldingIcons';
// #endregion

// #region REACT DEPEDENCY
import { useState, useEffect } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from 'framer-motion';
// #endregion

// #region UTIL DEPEDENCY
import PropTypes from 'prop-types';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/folding_icons.module.css';
// #endregion

/**
 * Box icon atau teks konten dengan animasi lipat. Konten diisi melalui props `contents`. Animasi dimainkan untuk mengganti konten ke index setelahnya `currentContent + 1`.
 *
 * Animasi dapat dimainkan secara berulang setelah component mount dengan tipe animasi `repeat` atau dikontrol dengan state dari parent dengan tipe animasi `stateChanges`. Contoh penggunaan sebagai berikut,
 *
 * ```js
 * // 'repeat' //
 * const animationOptions = {type: 'repeat'}
 * const repeatOptions = {delay: 10, interval: 7.5}
 *
 * <FoldingIcons animationOptions={animationOptions} repeatOptions={repeatOptions}/>
 * // Animasi akan dimainkan setelah 10 detik dari component mount, dan berulang setiap 7.5 detik
 *
 * // 'stateChanges' //
 * const [animate, setAnimate] = useState(false);
 * const animationOptions = {type: 'stateChanges'}
 * const repeatOptions = {useParentState: true, parentStateValue: animate, parentStateSetter: setAnimate, autoUpdateParentState: true}
 *
 * <FoldingIcons animationOptions={animationOptions} stateChangesOptions={stateChangesOptions}/>
 * // Animasi akan dimainkan saat animate true, setelah animasi selesai callback parentStateSetter akan dipanggil untuk update state
 * ```
 * @param {Object} props Component props
 * @param {Array<FoldingIconsProps.ContentEntry>} [props.contents]
 * Array dengan content entry. Default menggunakan array berikut,
 * ```js
 * const contents = [
 *  { icon: '0', color: '#ffffff', backgroundColor: '#0b3d91' },
 *  { icon: '1', color: '#000000', backgroundColor: '#ffcc00' },
 *  { icon: '2', color: '#ffffff', backgroundColor: '#d2691e' },
 *  { icon: '3', color: '#000000', backgroundColor: '#66cdaa' },
 *  { icon: '4', color: '#ffffff', backgroundColor: '#8b0000' },
 *  { icon: '5', color: '#000000', backgroundColor: '#088567' },
 * ]
 * ```
 * @param {FoldingIconsProps.ContentStyleOptions} props.contentOptions
 * Opsi style `content` yang dapat dirubah
 * @param {FoldingIconsProps.ContainerStyleOptions} props.containerOptions
 * Opsi style `container` yang dapat dirubah
 * @param {FoldingIconsProps.DividerStyleOptions} props.dividerOptions
 * Opsi style `divider` yang dapat dirubah
 * @param {FoldingIconsProps.ContainerProps} props.containerProps
 * Props untuk `container`
 * - Note : Props yang tersedia pada `motion` dapat digunakan
 * @param {FoldingIconsProps.AnimationOptions} props.animationOptions
 * Pengaturan animasi yang digunakan
 * ```js
 * // Default animationOptions
 * const type = 'stateChanges';
 * const duration = 0.5;
 * const onStart = undefined;
 * const onComplete = undefined;
 * const animationOptions = {type, duration, onStart, onComplete}
 * ```
 * @param {FoldingIconsProps.StateChangesOptions} props.stateChangesOptions
 * Pengaturan animasi tipe `'stateChanges'`
 * ```js
 * // Default stateChangesOptions
 * const useParentState = false;
 * const parentStateValue = false;
 * const parentStateSetter = undefined;
 * const autoUpdateParentState = false;
 * const stateChangesOptions = {useParentState, parentStateValue, parentStateSetter, autoUpdateParentState}
 * ```
 * @param {FoldingIconsProps.RepeatOptions} props.repeatOptions
 * Pengaturan animasi tipe `'repeatOptions'`
 * ```js
 * // Default repeatOptions
 * const delay = 5;
 * const interval = 5;
 * const repeatOptions = {delay, interval}
 * ```
 * @returns {JSX.Element} Rendered component
 */
const FoldingIcons = ({
	contents = [
		{ icon: '0', color: '#ffffff', backgroundColor: '#0b3d91' },
		{ icon: '1', color: '#000000', backgroundColor: '#ffcc00' },
		{ icon: '2', color: '#ffffff', backgroundColor: '#d2691e' },
		{ icon: '3', color: '#000000', backgroundColor: '#66cdaa' },
		{ icon: '4', color: '#ffffff', backgroundColor: '#8b0000' },
		{ icon: '5', color: '#000000', backgroundColor: '#088567' }
	],
	contentOptions = {},
	containerOptions = {},
	dividerOptions = {},
	containerProps = {},
	animationOptions = {
		type: 'stateChanges',
		duration: 0.5
	},
	stateChangesOptions = {
		useParentState: false,
		parentStateValue: false,
		autoUpdateParentState: false
	},
	repeatOptions = {
		delay: 5,
		interval: 5
	}
}) => {
	const [zIndexValue, setZIndexValue] = useState(1);
	const [currentContent, setCurrentContent] = useState(0);
	const [isAnimating, setIsAnimating] = useState(
		animationOptions.type === 'stateChanges'
			? stateChangesOptions.useParentState
				? (stateChangesOptions.parentStateValue ?? false)
				: false
			: false
	);

	const size = contentOptions.fontSize ?? '5rem';
	const defaultContentsEntry = {
		icon: 'Null',
		color: '#262626',
		backgroundColor: '#ff6341'
	};
	const defaultStyles = {
		container: {
			width: `calc(${size} * 3.4)`,
			height: `calc(${size} * 2.4)`
		},
		content: {
			width: `calc(${size} * 2.6)`,
			height: `calc(${size} * 1.8)`,
			fontSize: size
		}
	};

	const handleOnAnimationStart = () => {
		// Call onStart callback if provided
		if (animationOptions.onStart) {
			animationOptions.onStart(
				currentContent + 1 >= contents.length ? 0 : currentContent + 1
			);
		}
	};

	const handleOnAnimationComplete = () => {
		setZIndexValue((value) => value + 1);
		setCurrentContent((value) =>
			value + 1 >= contents.length ? 0 : value + 1
		);
		setIsAnimating(false);

		// Call parentStateSetter callback to update state, only when :
		// autoUpdateParentState === true && parentStateSetter provided
		if (
			animationOptions.type === 'stateChanges' &&
			stateChangesOptions.autoUpdateParentState &&
			stateChangesOptions.parentStateSetter
		) {
			stateChangesOptions.parentStateSetter(!isAnimating);
		}

		// Call onComplete callback if provided
		if (animationOptions.onComplete) {
			animationOptions.onComplete(
				currentContent + 1 >= contents.length ? 0 : currentContent + 1
			);
		}
	};

	const Container = ({ children, ...props }) => {
		return (
			<motion.div
				className={styles.container}
				style={{
					...(() => {
						const { custom, ...restProps } = containerOptions;
						return { ...defaultStyles.container, ...restProps, ...custom };
					})()
				}}
				{...props}
			>
				{children}
			</motion.div>
		);
	};

	const CurrentContent = () => (
		<>
			<motion.div
				className={styles.wrapper}
				style={{
					zIndex: zIndexValue * -1
				}}
				initial={{
					top: '50%',
					left: '50%',
					translateX: '-50%',
					translateY: '-50%',
					rotateX: 0
				}}
				animate={
					isAnimating
						? {
								top: '50%',
								left: '50%',
								translateX: '-50%',
								translateY: '-50%',
								rotateX: -180,
								transition: { duration: animationOptions.duration ?? 0.5 }
							}
						: {}
				}
				onAnimationStart={handleOnAnimationStart}
			>
				<div
					style={{
						...defaultStyles.content,
						color: contents[currentContent].color ?? defaultContentsEntry.color,
						backgroundColor:
							contents[currentContent].backgroundColor ??
							defaultContentsEntry.backgroundColor,
						...(() => {
							const { custom, ...restProps } = contentOptions;
							return { ...restProps, ...custom };
						})()
					}}
					className={styles.content}
				>
					{contents[currentContent].icon ?? defaultContentsEntry.icon}
				</div>
			</motion.div>

			<div
				className={styles.wrapper}
				style={{
					zIndex: zIndexValue
				}}
			>
				<div
					style={{
						...defaultStyles.content,
						color: contents[currentContent].color ?? defaultContentsEntry.color,
						backgroundColor:
							contents[currentContent].backgroundColor ??
							defaultContentsEntry.backgroundColor,
						...(() => {
							const { custom, ...restProps } = contentOptions;
							return { ...restProps, ...custom };
						})()
					}}
					className={styles.content}
				>
					{contents[currentContent].icon ?? defaultContentsEntry.icon}
				</div>
			</div>
		</>
	);

	const NextContent = () => (
		<>
			<div
				className={styles.wrapper}
				style={{
					zIndex: (zIndexValue + 1) * -1
				}}
			>
				<div
					style={{
						...defaultStyles.content,
						color:
							contents[
								currentContent + 1 >= contents.length ? 0 : currentContent + 1
							].color ?? defaultContentsEntry.color,
						backgroundColor:
							contents[
								currentContent + 1 >= contents.length ? 0 : currentContent + 1
							].backgroundColor ?? defaultContentsEntry.backgroundColor,
						...(() => {
							const { custom, ...restProps } = contentOptions;
							return { ...restProps, ...custom };
						})()
					}}
					className={styles.content}
				>
					{contents[
						currentContent + 1 >= contents.length ? 0 : currentContent + 1
					].icon ?? defaultContentsEntry.icon}
				</div>
			</div>

			<motion.div
				className={styles.wrapper}
				style={{
					zIndex: zIndexValue + 1
				}}
				initial={{
					top: '50%',
					left: '50%',
					translateX: '-50%',
					translateY: '-50%',
					rotateX: 180
				}}
				animate={{
					top: '50%',
					left: '50%',
					translateX: '-50%',
					translateY: '-50%',
					rotateX: 0,
					transition: { duration: animationOptions.duration ?? 0.5 }
				}}
				onAnimationComplete={handleOnAnimationComplete}
			>
				<div
					style={{
						...defaultStyles.content,
						color:
							contents[
								currentContent + 1 >= contents.length ? 0 : currentContent + 1
							].color ?? defaultContentsEntry.color,
						backgroundColor:
							contents[
								currentContent + 1 >= contents.length ? 0 : currentContent + 1
							].backgroundColor ?? defaultContentsEntry.backgroundColor,
						...(() => {
							const { custom, ...restProps } = contentOptions;
							return { ...restProps, ...custom };
						})()
					}}
					className={styles.content}
				>
					{contents[
						currentContent + 1 >= contents.length ? 0 : currentContent + 1
					].icon ?? defaultContentsEntry.icon}
				</div>
			</motion.div>
		</>
	);

	const Divider = () => (
		<div
			className={styles.divider}
			style={{
				...(() => {
					const { custom, ...restProps } = dividerOptions;
					return { ...restProps, ...custom };
				})(),
				zIndex: zIndexValue + 2
			}}
		/>
	);

	useEffect(() => {
		if (animationOptions.type !== 'repeat') {
			return;
		}

		const startAnimation = () => {
			setIsAnimating(true);
			const intervalId = setInterval(
				() => {
					setIsAnimating(true);
				},
				(repeatOptions.interval ?? 5) * 1000
			);

			return () => clearInterval(intervalId);
		};

		const timeoutId = setTimeout(
			startAnimation,
			(repeatOptions.delay ?? 5) * 1000
		);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [animationOptions.type, repeatOptions.delay, repeatOptions.interval]);

	useEffect(() => {
		if (animationOptions.type !== 'stateChanges') {
			return;
		}
		if (stateChangesOptions.useParentState) {
			setIsAnimating(stateChangesOptions.parentStateValue);
		}
	}, [
		animationOptions.type,
		stateChangesOptions.useParentState,
		stateChangesOptions.parentStateValue
	]);

	return (
		<Container {...containerProps}>
			<CurrentContent />
			{isAnimating && <NextContent />}
			<Divider />
		</Container>
	);
};

FoldingIcons.propTypes = {
	contents: PropTypes.arrayOf(
		PropTypes.shape({
			icon: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.element,
				PropTypes.elementType
			]),
			color: PropTypes.string,
			backgroundColor: PropTypes.string
		})
	),
	contentOptions: PropTypes.shape({
		fontSize: PropTypes.string,
		width: PropTypes.string,
		height: PropTypes.string,
		borderRadius: PropTypes.string,
		custom: PropTypes.object // [FIX] If possible should be match to CSSProperties
	}),
	containerOptions: PropTypes.shape({
		width: PropTypes.string,
		height: PropTypes.string,
		backgroundColor: PropTypes.string,
		borderColor: PropTypes.string,
		borderWidth: PropTypes.string,
		borderStyle: PropTypes.string,
		borderRadius: PropTypes.string,
		custom: PropTypes.object // [FIX] If possible should be match to CSSProperties
	}),
	dividerOptions: PropTypes.shape({
		width: PropTypes.string,
		height: PropTypes.string,
		custom: PropTypes.object // [FIX] If possible should be match to CSSProperties
	}),
	containerProps: PropTypes.object, // [FIX] If possible should be match to HTMLProps
	animationOptions: PropTypes.shape({
		type: PropTypes.oneOf(['stateChanges', 'repeat']),
		duration: PropTypes.number,
		onStart: PropTypes.func,
		onComplete: PropTypes.func
	}),
	stateChangesOptions: PropTypes.shape({
		useParentState: PropTypes.bool,
		parentStateValue: PropTypes.bool,
		parentStateSetter: PropTypes.func,
		autoUpdateParentState: PropTypes.bool
	}),
	repeatOptions: PropTypes.shape({
		delay: PropTypes.number,
		interval: PropTypes.number
	})
};

export default FoldingIcons;
