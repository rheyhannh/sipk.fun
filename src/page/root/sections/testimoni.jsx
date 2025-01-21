'use client';

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region CONFIG DEPEDENCY
import { GLOBAL_VIEWPORT_ONCE } from '../config';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region HOOKS DEPEDENCY
import useWindowSize from '@/hooks/utils/useWindowSize';
// #endregion

// #region STYLE DEPEDENCY
import styles from '@root_page/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion } from 'framer-motion';
import { ContainerWrapper } from '../components';
import ScrollingCarousel from '@/component/motion/ScrollingCarousel';
import HighlightText from '@/component/motion/HighlightText';
import { scroller } from 'react-scroll';
// #endregion

// #region ICON DEPEDENCY
import { AiFillStar } from 'react-icons/ai';
// #endregion

/**
 * Component Description
 * @param {React.HTMLAttributes<HTMLDivElement> & {item:SupabaseTypes.RatingData}} props Card props
 * @returns {React.ReactElement} Rendered component
 */
const Card = ({ item, ...props }) => (
	<div className={styles.card} {...props}>
		<div className={styles.stars}>
			{Array.from({ length: item.rating }).map((_, index) => (
				<AiFillStar key={index} fontSize={'var(--star-fontsize)'} />
			))}
		</div>

		<p className={styles.review}>{item.review}</p>

		<div className={styles.user}>
			<div className={styles.avatar} />
			<div className={styles.info}>
				<span>{item.details.author}</span>
				<small>{item.details.universitas}</small>
			</div>
		</div>
	</div>
);

/**
 * Component Description
 * @param {{rating:Array<SupabaseTypes.RatingData>}} props Testimoni props
 * @returns {React.ReactElement} Rendered component
 */
const Testimoni = ({ rating }) => {
	const sectionRef = React.useRef(/** @type {HTMLDivElement} */ (null));

	const { width: viewportWidth } = useWindowSize();

	/** @param {React.KeyboardEvent} event */
	const handleKeyDown = (event) => {
		if (event.key === 'Tab') {
			event.preventDefault();
			if (event.shiftKey) {
				if (sectionRef.current && sectionRef.current.previousElementSibling) {
					if (viewportWidth < 1080) {
						const focusableElements =
							sectionRef.current.previousElementSibling.querySelectorAll(
								'[tabIndex="0"]'
							);
						const lastFocusableElement =
							focusableElements[focusableElements.length - 1];

						scroller.scrollTo(lastFocusableElement.id, {
							offset: -75,
							smooth: true
						});
						lastFocusableElement.focus();
					} else {
						scroller.scrollTo(sectionRef.current.previousElementSibling.id, {
							offset: -75,
							smooth: true
						});
						sectionRef.current.previousElementSibling.focus();
					}
				}
			} else {
				if (sectionRef.current && sectionRef.current.nextElementSibling) {
					scroller.scrollTo(sectionRef.current.nextElementSibling.id, {
						offset: -75,
						smooth: true
					});
					sectionRef.current.nextElementSibling.focus();
				}
			}
		}
	};

	return (
		<motion.section
			ref={sectionRef}
			id={'testimoni'}
			tabIndex={0}
			className={`${styles.section} ${styles.testimoni} ${styles.center_overflow}`}
			whileInView={'inView'}
			viewport={{ once: GLOBAL_VIEWPORT_ONCE }}
			onKeyDown={handleKeyDown}
		>
			<ContainerWrapper>
				<motion.h2
					className={styles.title}
					initial={{ visibility: 'hidden', minHeight: 85 }}
					variants={{
						inView: { visibility: 'visible', transition: { delay: 0.25 } }
					}}
				>
					<HighlightText
						useHook={false}
						preset={'mixFancyTranslate'}
						presetOptions={{
							wordStagger: 'random',
							makeVariant: true,
							variantName: 'inView'
						}}
						adjustMixFancyTranslate={{
							x: [-25, 25, 0],
							y: [-125, 125, 0],
							z: [-750, -250, 0],
							rotateX: [-5, 5, 0],
							stagger: 0.25,
							baseDelay: 0.25
						}}
						text={'Kata Mereka Tentang SIPK'}
					/>
				</motion.h2>
			</ContainerWrapper>

			<motion.div className={styles.content}>
				<ScrollingCarousel
					speed={75}
					initialDirection={'left'}
					useHoverEffect={true}
					hoverOffset={2}
					scrollEffectType={'none'}
					contentRenderOffset={-1}
					containerProps={{
						initial: { opacity: 0 },
						variants: { inView: { opacity: 1 } },
						transition: { duration: 0.75, delay: 1.5, ease: 'linear' }
					}}
				>
					{rating.map((item, index) => (
						<Card key={index} item={item} />
					))}
				</ScrollingCarousel>

				<ScrollingCarousel
					speed={75}
					initialDirection={'right'}
					useHoverEffect={true}
					hoverOffset={2}
					scrollEffectType={'none'}
					contentRenderOffset={-1}
					containerProps={{
						initial: { opacity: 0 },
						variants: { inView: { opacity: 1 } },
						transition: { duration: 0.75, delay: 1.75, ease: 'linear' }
					}}
				>
					{rating.map((item, index) => (
						<Card key={index} item={item} />
					))}
				</ScrollingCarousel>
			</motion.div>
		</motion.section>
	);
};

export default Testimoni;
