'use client';

// #region TYPE DEPEDENCY
import {
	HighlightTextProps,
	presetOptions
} from '@/component/motion/HighlightText';
import { HTMLMotionProps } from 'framer-motion';
// #endregion

// #region CONFIG DEPEDENCY
import { GLOBAL_VIEWPORT_ONCE } from '../config';
// #endregion

// #region DATA DEPEDENCY
import { defaultMatakuliah, defaultPenilaian } from '../data';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import { useInterval } from 'ahooks';
import useWindowSize from '@/hooks/utils/useWindowSize';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@root_page/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import {
	motion,
	useScroll,
	useTransform,
	AnimatePresence
} from 'framer-motion';
import { ProgressDummy, DistribusiDummy, GrafikDummy } from '@/component/Card';
import HighlightText from '@/component/motion/HighlightText';
import { scroller } from 'react-scroll';
// #endregion

// #region ICON DEPEDENCY
import { TbAtom, TbAntennaBars5, TbStars } from 'react-icons/tb';
import { IoAnalyticsOutline } from 'react-icons/io5';
// #endregion

// #region UTIL DEPEDENCY
import {
	shuffleArray,
	findArrayIndexByString,
	countPrevCharactersAndWords
} from '../utils';
// #endregion

/**
 * Resolve props yang digunakan pada component `HighlightText`
 * @param {string} text String teks untuk mengatur delay animasi
 * @returns {HighlightTextProps} Props yang sudah diatur
 */
const resolveTitleProps = (text) => ({
	useHook: false,
	preset: 'wavingFlyIn',
	presetOptions: {
		makeVariant: true,
		variantName: 'inView',
		customCharVariants: FITUR_CUSTOM_CHAR_VARIANTS[text] ?? {},
		customWordVariants: FITUR_CUSTOM_WORD_VARIANTS[text] ?? {}
	},
	adjustWavingFlyIn: {
		baseDelay:
			FITUR_TITLE_STAGGERED[
				findArrayIndexByString(text, FITUR_TITLE_PARAGRAPH.flat())
			]
	}
});

/** @type {HTMLMotionProps<'div'>} */
const FITUR_FITURCARD_CONTENT_PROPS = {
	initial: { y: 10, opacity: 0 },
	animate: { y: 0, opacity: 1 },
	exit: { y: 10, opacity: 0 },
	transition: { duration: 0.75 }
};

/** @type {Array<{fiturCardProps:Omit<HTMLMotionProps<'div'>, 'className' | 'variants' | 'onAnimationStart' | 'onAnimationComplete'> & FiturCardProps}>} */
const FITUR_SECTION_CONTENTS = [
	{
		fiturCardProps: {
			title: 'Distribusi Nilai',
			description:
				'Lihat distribusi nilai kamu dari setiap semester dengan bar chart yang menampilkan jumlah indeks nilai yang kamu peroleh.',
			wrapperClassname: 'sebaran_nilai',
			content: (
				<DistribusiDummy
					useAutoplay={false}
					matkul={defaultMatakuliah}
					penilaian={defaultPenilaian}
					{...FITUR_FITURCARD_CONTENT_PROPS}
				/>
			)
		}
	},
	{
		fiturCardProps: {
			title: 'Grafik Akademik',
			description:
				'Pantau perkembangan akademik kamu dari waktu ke waktu dengan grafik yang menampilkan jumlah SKS, mata kuliah, dan IP setiap semester.',
			wrapperClassname: 'grafik_progress',
			content: (
				<GrafikDummy
					matkul={defaultMatakuliah}
					{...FITUR_FITURCARD_CONTENT_PROPS}
				/>
			)
		}
	},
	{
		fiturCardProps: {
			title: 'Progres Target',
			description:
				'Lacak progres kamu menuju target akademik dengan progress bar yang menunjukkan jumlah SKS, mata kuliah, dan IPK yang telah diraih.',
			wrapperClassname: 'bar_progress',
			content: <ProgressDummy {...FITUR_FITURCARD_CONTENT_PROPS} />
		}
	}
];

/** @type {number} */
const FITUR_TITLE_DELAY_OFFSET = 0.15;

/** @type {Array<Array<string>>} */
const FITUR_TITLE_PARAGRAPH = [
	['Insight'],
	['yang', 'membantu', 'kamu'],
	['meraih', 'target', 'impianmu']
];

/** @type {Array<number>} */
const FITUR_TITLE_STAGGERED = shuffleArray(
	FITUR_TITLE_PARAGRAPH.flat().map(
		(_, index) => index * FITUR_TITLE_DELAY_OFFSET
	)
);

/** @type {Object<string, presetOptions['customCharVariants']>} */
const FITUR_CUSTOM_CHAR_VARIANTS = {
	Insight: {
		hover: {
			z: [null, -200, 0],
			scale: [null, 0.25, 0.75, 1],
			rotateX: [null, -90, -90, 1],
			opacity: [null, 0, 0, 1],
			transformOrigin: '50% 100%',
			transition: {
				duration: 1.5
			},
			options: {
				randomStart: ['scale'],
				staggerType: 'random',
				stagger: 0.075
			}
		}
	},
	meraih: {
		shape_text: {
			color: [
				null,
				'#00d16f',
				'#5d1470',
				'#1bbad6',
				'#71a819',
				'#ea83d0',
				'#c6b3ba',
				'var(--box-color-success2)'
			],
			rotateX: [null, 90, 0],
			scale: [null, 1.25, 0.45, 1.35, 1],
			options: {
				randomStart: ['color'],
				staggerType: 'first',
				stagger: 0.1
			}
		}
	},
	target: {
		shape_text: {
			color: [
				null,
				'#c5e8a4',
				'#5d1470',
				'#1bbad6',
				'#6b7772',
				'#ea83d0',
				'#9f48bf',
				'var(--dark-color)'
			],
			rotateX: [null, 90, 0],
			scale: [null, 1.25, 0.35, 1.15, 1],
			options: {
				randomStart: ['color'],
				staggerType: 'first',
				stagger: 0.1,
				baseDelay:
					countPrevCharactersAndWords(
						FITUR_TITLE_PARAGRAPH,
						false,
						'target',
						2,
						1
					).chars * 0.1
			}
		}
	},
	impianmu: {
		shape_text: {
			color: [
				null,
				'#2b769b',
				'#5d1470',
				'#1bbad6',
				'#328e91',
				'#ea83d0',
				'#f9fbfc',
				'var(--warning-color-hex)'
			],
			rotateX: [null, 90, 0],
			scale: [null, 1.25, 0.35, 1.15, 1],
			options: {
				randomStart: ['color'],
				staggerType: 'first',
				stagger: 0.1,
				baseDelay:
					countPrevCharactersAndWords(
						FITUR_TITLE_PARAGRAPH,
						false,
						'impianmu',
						2,
						2
					).chars * 0.1
			}
		}
	}
};

/** @type {Object<string, presetOptions['customWordVariants']>} */
const FITUR_CUSTOM_WORD_VARIANTS = {};

/**
 * Array yang berisikan string sebagai nama dari custom animasi variant yang dimainkan setelah animasi pertama atau animasi `inView`
 * @type {Array<string>}
 */
const FITUR_CUSTOM_VARIANT_COLLECTIONS = ['shape_text'];

/**
 * Props yang digunakan component `FiturCard`
 * @typedef {Object} FiturCardProps
 * @property {React.ReactNode} [title]
 * Judul yang digunakan
 * - Default : `'Lorem, ipsum dolor.'`
 * @property {React.ReactNode} [description]
 * Deskripsi yang digunakan
 * - Default : `'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia voluptates excepturi sit quis, assumenda ut natus quisquam nam iure magnam.'`
 * @property {string} wrapperClassname
 * Classname yang digunakan untuk wrapper `content`
 * @property {React.ReactNode} content
 * Content yang dirender
 * @property {number} contentIndex
 * Content identifier dalam bentuk angka
 */

/**
 * Component Description
 * @param {Omit<HTMLMotionProps<'div'>, 'className' | 'variants' | 'onAnimationStart' | 'onAnimationComplete'> & FiturCardProps} props FiturCard props
 * @returns {React.ReactElement} Rendered component
 */
const FiturCard = ({
	title,
	description,
	wrapperClassname,
	content,
	contentIndex = 0,
	...props
}) => {
	const [contentShowed, setContentShowed] = React.useState(false);

	return (
		<motion.div
			className={styles.card_wrapper}
			whileInView={'inView'}
			viewport={{ once: GLOBAL_VIEWPORT_ONCE, amount: 1 }}
		>
			<motion.div
				className={styles.card}
				variants={{ inView: {} }}
				onAnimationStart={() => {
					setContentShowed(false);
				}}
				onAnimationComplete={(x) => {
					if (x === 'inView') setContentShowed(true);
				}}
				{...props}
			>
				<div
					className={
						wrapperClassname
							? `${styles.card_main} ${styles[wrapperClassname]}`
							: styles.card_main
					}
				>
					<AnimatePresence>{contentShowed && content}</AnimatePresence>
				</div>

				<div className={styles.card_secondary}>
					<h3 className={styles.title_small}>
						{title ?? 'Lorem, ipsum dolor.'}
					</h3>
					<p className={styles.title_small_description}>
						{description ??
							'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quia voluptates excepturi sit quis, assumenda ut natus quisquam nam iure magnam.'}
					</p>
				</div>
			</motion.div>
		</motion.div>
	);
};

const Fitur = () => {
	const sectionRef = React.useRef(
		/** @type {HTMLDivElement} */
		(null)
	);
	const { width } = useWindowSize();
	const { scrollYProgress: sectionScrollProgress } = useScroll({
		target: sectionRef,
		smooth: 1
	});
	const scrollContent = useTransform(
		sectionScrollProgress,
		[0, 1],
		['50%', '-100%']
	);

	/** @param {React.KeyboardEvent} event */
	const handleKeyDown = (event) => {
		if (event.key === 'Tab') {
			event.preventDefault();
			if (event.shiftKey) {
				if (sectionRef.current && sectionRef.current.previousElementSibling) {
					scroller.scrollTo(sectionRef.current.previousElementSibling.id, {
						offset: -75,
						smooth: true
					});
					sectionRef.current.previousElementSibling.focus();
				}
			} else {
				if (sectionRef.current && sectionRef.current.nextElementSibling) {
					scroller.scrollTo(sectionRef.current.nextElementSibling.id, {
						offset: -75
					});
					sectionRef.current.nextElementSibling.focus();
				}
			}
		}
	};

	return (
		<section
			ref={sectionRef}
			id={'fitur'}
			tabIndex={0}
			className={`${styles.section} ${styles.fitur}`}
			onKeyDown={handleKeyDown}
		>
			<div className={styles.fitur_wrapper}>
				<TitleAnimated sectionScrollProgress={sectionScrollProgress} />

				{width > 1023 ? (
					<ContentScrolled scrollContent={scrollContent} />
				) : (
					<ContentSimple />
				)}
			</div>
		</section>
	);
};

function TitleAnimated({ sectionScrollProgress }) {
	const { width } = useWindowSize();

	const [iconSize, setIconSize] = React.useState(
		/**
		 * @type {number}
		 * Ukuran berupa width dan height yang digunakan pada icon wrapper
		 */
		(60)
	);
	const [alreadyInView, setAlreadyInView] = React.useState(
		/**
		 * @type {boolean}
		 * Boolean apakah element sudah dalam inView, ini akan bernilai true setelah animasi 'inView' selesai dimainkan.
		 */
		(false)
	);
	const [titleAnimation, setTitleAnimation] = React.useState(
		/**
		 * @type {string}
		 * Nama animasi atau variants yang dimainkan, dapat bernilai `null` saat tidak ada animasi yang dimainkan.
		 */
		(null)
	);

	const iconX = useTransform(sectionScrollProgress, [0.44, 0.66], [0, 100]);
	const iconLeft = useTransform(
		sectionScrollProgress,
		[0.44, 0.66],
		[iconSize * -1, 0]
	);

	useInterval(() => {
		if (alreadyInView) setTitleAnimation('shape_text');
	}, 5000);

	React.useEffect(() => {
		if (width > 767) setIconSize(60);
		else setIconSize(50);
	}, [width]);

	return (
		<motion.div
			className={styles.title}
			initial={{ visibility: 'hidden' }}
			style={{ '--icon-size': `${iconSize}px` }}
			variants={{ inView: { visibility: 'visible' } }}
			whileInView={'inView'}
			animate={titleAnimation ?? {}}
			onAnimationComplete={(x) => {
				if (typeof x === 'string') {
					if (FITUR_CUSTOM_VARIANT_COLLECTIONS.includes(x))
						setTitleAnimation({});
					if (x === 'inView') setAlreadyInView(true);
				}
			}}
			viewport={{
				once: GLOBAL_VIEWPORT_ONCE,
				amount: 0.66
			}}
		>
			<h2>
				<motion.div
					className={styles.icons}
					initial={{ scale: 0 }}
					variants={{
						inView: {
							scale: 1,
							transition: {
								type: 'spring',
								duration: 1.5,
								bounce: 0,
								delay:
									FITUR_TITLE_STAGGERED[
										findArrayIndexByString(
											'Insight',
											FITUR_TITLE_PARAGRAPH.flat()
										)
									]
							}
						}
					}}
				>
					<div className={`${styles.icon} ${styles.alt}`}>
						<motion.span
							initial={{ rotate: 180 }}
							style={{ x: iconX }}
							variants={{
								change: { x: 100 },
								inView: {
									rotate: 0,
									transition: {
										type: 'spring',
										duration: 2,
										bounce: 0,
										delay:
											FITUR_TITLE_STAGGERED[
												findArrayIndexByString(
													'Insight',
													FITUR_TITLE_PARAGRAPH.flat()
												)
											]
									}
								}
							}}
							transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
						>
							<IoAnalyticsOutline fontSize={'0.6em'} />
						</motion.span>
						<motion.div
							className={styles.icon_bg_wrap}
							style={{ left: iconLeft }}
							variants={{ change: { left: 0 } }}
							transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
						>
							<div className={`${styles.icon_bg} ${styles.warning}`}>
								<motion.span
									initial={{ rotate: 180 }}
									variants={{
										inView: {
											rotate: 0,
											transition: {
												type: 'spring',
												duration: 2,
												bounce: 0,
												delay:
													FITUR_TITLE_STAGGERED[
														findArrayIndexByString(
															'Insight',
															FITUR_TITLE_PARAGRAPH.flat()
														)
													]
											}
										}
									}}
									transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
								>
									<TbAtom fontSize={'0.6em'} />
								</motion.span>
							</div>
							<div className={`${styles.icon_bg} ${styles.alt}`} />
						</motion.div>
					</div>

					<div className={`${styles.icon}`}>
						<motion.span
							initial={{ rotate: 225 }}
							style={{ x: iconX }}
							variants={{
								change: { x: 100 },
								inView: {
									rotate: 0,
									transition: {
										type: 'spring',
										duration: 3,
										bounce: 0,
										delay:
											FITUR_TITLE_STAGGERED[
												findArrayIndexByString(
													'Insight',
													FITUR_TITLE_PARAGRAPH.flat()
												)
											]
									}
								}
							}}
							transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
						>
							<TbAntennaBars5 fontSize={'0.6em'} />
						</motion.span>
						<motion.div
							className={styles.icon_bg_wrap}
							style={{ left: iconLeft }}
							variants={{ change: { left: 0 } }}
							transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
						>
							<div className={`${styles.icon_bg} ${styles.alt}`}>
								<motion.span
									initial={{ rotate: 180 }}
									variants={{
										inView: {
											rotate: 0,
											transition: {
												type: 'spring',
												duration: 2,
												bounce: 0,
												delay:
													FITUR_TITLE_STAGGERED[
														findArrayIndexByString(
															'Insight',
															FITUR_TITLE_PARAGRAPH.flat()
														)
													]
											}
										}
									}}
									transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
								>
									<IoAnalyticsOutline fontSize={'0.6em'} />
								</motion.span>
							</div>
							<div className={`${styles.icon_bg}`} />
						</motion.div>
					</div>
				</motion.div>
				<HighlightText text={'Insight'} {...resolveTitleProps('Insight')} />
			</h2>

			<h2>
				<HighlightText text={'yang'} {...resolveTitleProps('yang')} />

				<span>
					<HighlightText text={'membantu'} {...resolveTitleProps('membantu')} />
				</span>
				<HighlightText text={'kamu'} {...resolveTitleProps('kamu')} />
			</h2>

			<h2>
				<HighlightText text={'meraih'} {...resolveTitleProps('meraih')} />
				<motion.div
					className={`${styles.icon}`}
					initial={{ scale: 0 }}
					variants={{
						inView: {
							scale: 1,
							transition: {
								type: 'spring',
								duration: 2,
								bounce: 0,
								delay:
									FITUR_TITLE_STAGGERED[
										findArrayIndexByString(
											'meraih',
											FITUR_TITLE_PARAGRAPH.flat()
										)
									]
							}
						}
					}}
				>
					<motion.div
						className={`${styles.icon_bg} ${styles.success}`}
						initial={{ rotate: 270 }}
						variants={{
							inView: {
								rotate: 0,
								transition: {
									type: 'spring',
									duration: 2.5,
									bounce: 0,
									delay:
										FITUR_TITLE_STAGGERED[
											findArrayIndexByString(
												'meraih',
												FITUR_TITLE_PARAGRAPH.flat()
											)
										]
								}
							},
							shape_text: {
								rotateY: [360, 0],
								scale: [null, 0.75, 1],
								transition: {
									delay:
										countPrevCharactersAndWords(
											FITUR_TITLE_PARAGRAPH,
											false,
											'target',
											2,
											1
										).chars * 0.1,
									duration: 1.25,
									times: [0, 0.6, 1]
								}
							}
						}}
					>
						<span>
							<TbStars fontSize={'0.6em'} />
						</span>
					</motion.div>
				</motion.div>
				<HighlightText text={'target'} {...resolveTitleProps('target')} />
				<HighlightText text={'impianmu'} {...resolveTitleProps('impianmu')} />
			</h2>
		</motion.div>
	);
}

function ContentSimple() {
	return (
		<motion.div className={styles.content}>
			<motion.div
				className={styles.content_inner}
				initial={{ visibility: 'hidden', opacity: 0 }}
				whileInView={{ visibility: 'visible', opacity: 1 }}
				viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
			>
				{FITUR_SECTION_CONTENTS.map((item, index) => (
					<FiturCard
						key={index}
						contentIndex={index}
						{...item.fiturCardProps}
					/>
				))}
			</motion.div>
		</motion.div>
	);
}

function ContentScrolled({ scrollContent }) {
	return (
		<motion.div className={styles.content}>
			<motion.div
				className={styles.content_inner}
				initial={{ visibility: 'hidden', opacity: 0 }}
				whileInView={{ visibility: 'visible', opacity: 1 }}
				viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
				style={{ y: scrollContent }}
			>
				{FITUR_SECTION_CONTENTS.map((item, index) => (
					<FiturCard
						key={index}
						contentIndex={index}
						{...item.fiturCardProps}
					/>
				))}
			</motion.div>
		</motion.div>
	);
}

export default Fitur;
