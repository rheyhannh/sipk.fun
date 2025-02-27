'use client';

// #region CONFIG DEPEDENCY
import { GLOBAL_VIEWPORT_ONCE } from '../config';
// #endregion

// #region NEXT DEPEDENCY
import Link from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useMeasure from 'react-use-measure';
import { useInterval } from 'ahooks';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from 'framer-motion';
import { LogoSipkFill } from '@/loader/StaticImages';
import HighlightText from '@/component/motion/HighlightText';
import { scroller } from 'react-scroll';
import {
	BUTTONSIMPLE_MAIN_PRESET,
	BUTTONSIMPLE_SECONDARY_PRESET
} from './hero';
import { ButtonSimpleForwarded } from '@/component/Button';
// #endregion

// #region ICON DEPEDENCY
import { FiLogIn, FiUserPlus } from 'react-icons/fi';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@root_page/root.module.css';
// #endregion

// #region UTIL DEPEDENCY
import {
	shuffleArray,
	findArrayIndexByString,
	countPrevCharactersAndWords
} from '@root_page/utils';
// #endregion

/**
 * String sebagai title yang digunakan pada section `Mulai Sekarang`
 */
const MULAISEKARANG_TITLE = 'Mulai Sekarang';

/**
 * Number yang mendeskripsikan stagger offset untuk setiap kata pada description
 */
const MULAISEKARANG_DESCRIPTION_DELAY_OFFSET = 0.075;

/**
 * Array yang berisikan array of string yang mendeskripsikan paragraf untuk setiap kata pada description
 */
const MULAISEKARANG_DESCRIPTION_PARAGRAPH = [
	['Akses', 'semua', 'fitur', 'secara', 'gratis!'],
	['Daftar', 'sekarang', 'atau', 'login', 'jika', 'sudah', 'punya', 'akun.'],
	['Jangan', 'lewatkan,'],
	['kuota', 'pendaftaran', 'terbatas!']
];

/**
 * Array of string yang berisikan kata yang digunakan pada description
 */
const MULAISEKARANG_DESCRIPTION_WORDS =
	MULAISEKARANG_DESCRIPTION_PARAGRAPH.flat();

/**
 * Array of number yang mendeskripsikan delay animasi untuk setiap kata pada description.
 * Ini dihitung dengan hasil perkalian index dari array {@link MULAISEKARANG_DESCRIPTION_PARAGRAPH paragraph} yang sudah diacak dengan {@link MULAISEKARANG_DESCRIPTION_DELAY_OFFSET stagger offset}.
 */
const MULAISEKARANG_DESCRIPTION_STAGGERED = shuffleArray(
	MULAISEKARANG_DESCRIPTION_PARAGRAPH.flat().map(
		(_, index) => index * MULAISEKARANG_DESCRIPTION_DELAY_OFFSET
	)
);

/**
 * Object yang merepresentasikan custom variants yang digunakan untuk setiap kata pada description
 */
const MULAISEKARANG_DESCRIPTION_CUSTOM_CHAR_VARIANTS =
	/** @type {Object<string, import('@/component/motion/HighlightText').presetOptions['customCharVariants']>} */ ({
		kuota: {
			color_text: {
				color: [null, 'var(--infoDark-color)', 'var(--danger-sec-color)'],
				scale: [1, 1.3, 1],
				transition: {
					duration: 0.3
				},
				options: {
					staggerType: 'first',
					stagger: 0.05
				}
			}
		},
		pendaftaran: {
			color_text: {
				color: [null, 'var(--infoDark-color)', 'var(--danger-sec-color)'],
				scale: [1, 1.3, 1],
				transition: {
					duration: 0.3
				},
				options: {
					staggerType: 'first',
					stagger: 0.05,
					baseDelay:
						countPrevCharactersAndWords(
							MULAISEKARANG_DESCRIPTION_PARAGRAPH,
							false,
							'pendaftaran',
							3,
							1
						).chars * 0.05
				}
			}
		},
		'terbatas!': {
			color_text: {
				color: [null, 'var(--infoDark-color)', 'var(--danger-sec-color)'],
				scale: [1, 1.3, 1],
				transition: {
					duration: 0.3
				},
				options: {
					staggerType: 'first',
					stagger: 0.05,
					baseDelay:
						countPrevCharactersAndWords(
							MULAISEKARANG_DESCRIPTION_PARAGRAPH,
							false,
							'terbatas!',
							3,
							2
						).chars * 0.05
				}
			}
		}
	});

/**
 * Array of string yang mendeskripsikan custom variants name yang tersedia
 */
const MULAISEKARANG_CUSTOM_VARIANT_COLLECTIONS = ['color_text'];

/**
 * Array of number dengan length `4` yang mendeskripsikan delay animasi untuk setiap element dimana dihitung setelah `section` inView.
 * - Index `0` : Delay animasi element logo
 * - Index `1` : Delay animasi element title
 * - Index `2` : Delay animasi element description
 * - Index `3` : Delay animasi element buttons
 */
const MULAISEKARANG_DELAY_ANIMATION = [0.225, 0.5, 1.25, 3.25];

const MulaiSekarang = () => {
	const sectionRef = React.useRef(
		/** @type {React.RefObject<HTMLDivElement>} */
		(null)
	);
	const [descriptionInView, setDescriptionInView] = React.useState(
		/**
		 * @type {boolean}
		 * Boolean apakah element teks description sudah dalam inView, ini akan bernilai true setelah animasi 'inView' selesai dimainkan.
		 */
		(false)
	);
	const [animateVariant, setAnimateVariant] = React.useState(
		/**
		 * @type {string}
		 * Nama animasi atau variants yang dimainkan, dapat bernilai `null` saat tidak ada animasi yang dimainkan.
		 */
		(null)
	);
	const [titleRef, { width: titleWidth }] = useMeasure();

	/** @param {React.KeyboardEvent} event */
	const handleKeyDown = (event) => {
		if (event.key === 'Tab') {
			if (event.shiftKey) {
				if (
					sectionRef.current &&
					sectionRef.current === document.activeElement &&
					sectionRef.current.previousElementSibling
				) {
					event.preventDefault();
					scroller.scrollTo(sectionRef.current.previousElementSibling.id, {
						offset: -75,
						smooth: true
					});
					sectionRef.current.previousElementSibling.focus();
				}
			} else {
				if (sectionRef.current) {
					const focusableElements = Array.from(
						sectionRef.current.querySelectorAll('[tabIndex="0"]')
					);
					const isLastFocusableElement =
						focusableElements[focusableElements.length - 1] ===
						document.activeElement;
					if (isLastFocusableElement) {
						event.preventDefault();
						event.target.blur();
						scroller.scrollTo('footer-shorcuts', { smooth: true });
					}
				}
			}
		}
	};

	useInterval(() => {
		if (descriptionInView) setAnimateVariant('color_text');
	}, 5000);

	return (
		<motion.section
			ref={sectionRef}
			id={'mulai_sekarang'}
			tabIndex={0}
			className={`${styles.section} ${styles.mulai_sekarang}`}
			whileInView={'inView'}
			viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
			animate={animateVariant ?? {}}
			onAnimationComplete={(x) => {
				if (typeof x === 'string') {
					if (MULAISEKARANG_CUSTOM_VARIANT_COLLECTIONS.includes(x))
						setAnimateVariant({});
					if (x === 'inView') setDescriptionInView(true);
				}
			}}
			onKeyDown={handleKeyDown}
		>
			<motion.div
				initial={{ scale: 1.5, opacity: 0 }}
				variants={{
					inView: { scale: 1, opacity: 1 },
					hide: { scale: 1.5, opacity: 0 }
				}}
				transition={{
					type: 'spring',
					duration: 0.75,
					delay: MULAISEKARANG_DELAY_ANIMATION[0]
				}}
				className={styles.logo}
			>
				<LogoSipkFill priority={true} />
			</motion.div>

			<motion.h1
				ref={titleRef}
				className={styles.title_big}
				initial={{ visibility: 'hidden' }}
				variants={{ inView: { visibility: 'visible' } }}
				transition={{
					type: 'spring',
					delayChildren: MULAISEKARANG_DELAY_ANIMATION[1]
				}}
			>
				<HighlightText
					text={MULAISEKARANG_TITLE}
					useHook={false}
					preset={'wavingTranslate'}
					presetOptions={{
						makeVariant: true,
						variantName: 'inView'
					}}
					adjustWavingTranslate={{
						perspective: 500,
						duration: 0.75,
						baseDelay: MULAISEKARANG_DELAY_ANIMATION[1]
					}}
				/>
			</motion.h1>

			<motion.div
				className={styles.title_big_description}
				style={{ width: 0.9 * titleWidth }}
				transition={{
					type: 'spring',
					delayChildren: MULAISEKARANG_DELAY_ANIMATION[2]
				}}
			>
				<motion.span
					className={styles.words}
					initial={{ visibility: 'hidden' }}
					variants={{
						inView: { visibility: 'visible' },
						hide: { visibility: 'hidden' }
					}}
				>
					{MULAISEKARANG_DESCRIPTION_WORDS.map((word, wordIndex) => (
						<HighlightText
							key={`word-${wordIndex}`}
							text={word}
							{...resolveDescriptionProps(word)}
						/>
					))}
				</motion.span>
			</motion.div>

			<motion.div className={styles.title_big_cta}>
				<motion.div
					initial={{ scale: 0 }}
					variants={{
						inView: {
							scale: 1,
							transition: {
								delay: MULAISEKARANG_DELAY_ANIMATION[3],
								type: 'spring',
								bounce: 0.2
							}
						},
						hide: { scale: 0 }
					}}
				>
					<Link
						href={'/users?action=login&utm_source=slp'}
						passHref
						legacyBehavior
					>
						<ButtonSimpleForwarded
							id='mulai_sekarang-cta-secondary'
							{...BUTTONSIMPLE_SECONDARY_PRESET}
							style={{
								...BUTTONSIMPLE_SECONDARY_PRESET?.style,
								gap: '0.35rem',
								fontWeight: 500
							}}
						>
							Masuk <FiLogIn className={styles.icon} />
						</ButtonSimpleForwarded>
					</Link>
				</motion.div>

				<motion.div
					initial={{ scale: 0 }}
					variants={{
						inView: {
							scale: 1,
							transition: {
								delay: MULAISEKARANG_DELAY_ANIMATION[3],
								type: 'spring',
								bounce: 0.2
							}
						},
						hide: { scale: 0 }
					}}
				>
					<Link
						href={'/users?action=daftar&utm_source=slp'}
						passHref
						legacyBehavior
					>
						<ButtonSimpleForwarded
							id='mulai_sekarang-cta-main'
							{...BUTTONSIMPLE_MAIN_PRESET}
							style={{
								...BUTTONSIMPLE_MAIN_PRESET?.style,
								gap: '0.35rem',
								fontWeight: 500
							}}
						>
							Daftar <FiUserPlus className={styles.icon} />
						</ButtonSimpleForwarded>
					</Link>
				</motion.div>
			</motion.div>
		</motion.section>
	);
};

/**
 * Resolve props yang digunakan pada component `HighlightText`
 * @param {string} text String teks untuk mengatur delay animasi
 * @returns {import('@/component/motion/HighlightText').HighlightTextProps} Props yang sudah diatur
 */
function resolveDescriptionProps(text) {
	return {
		useHook: false,
		preset: 'mixFancyTranslate',
		presetOptions: {
			makeVariant: true,
			variantName: 'inView',
			customCharVariants:
				MULAISEKARANG_DESCRIPTION_CUSTOM_CHAR_VARIANTS[text] ?? {},
			customWordVariants: {}
		},
		adjustMixFancyTranslate: {
			baseDelay:
				MULAISEKARANG_DESCRIPTION_STAGGERED[
					findArrayIndexByString(text, MULAISEKARANG_DESCRIPTION_WORDS)
				] + MULAISEKARANG_DELAY_ANIMATION[2],
			duration: 1.25,
			x: ['-150%', '150%', '0%'],
			y: ['-75%', '75%', '0%'],
			z: [-500, 500, 0]
		}
	};
}

export default MulaiSekarang;
