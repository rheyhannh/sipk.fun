'use client'

// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
import { AnimatedElementProps } from './RootComponents';
// #endregion

// #region CONFIG DEPEDENCY
import {
    GLOBAL_VIEWPORT_ONCE,
    UNIVERSITAS_SECTION_TITLE,
    UNIVERSITAS_SECTION_DESCRIPTION,
    UNIVERSITAS_SECTION_BUTTON,
    UNIVERSITAS_ITEMS_LAYOUT,
} from './RootConfig';
// #endregion

// #region NEXT DEPEDENCY
import Image, { ImageProps } from 'next/image';
import Link, { LinkProps } from 'next/link';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

// #region COMPONENT DEPEDENCY
import { motion, useScroll, useSpring } from 'framer-motion';
import { AnimatedElement, ScrollingCarousel } from './RootComponents';
import { scroller } from 'react-scroll';
// #endregion

// #region ICON DEPEDENCY
import { FiExternalLink } from 'react-icons/fi';
// #endregion

// #region UTIL DEPEDENCY
import {
    replacePlaceholders,
    generateRandomNumber,
    generateRandomNumberFixedRange,
    generateRandomFloat,
} from './RootUtils';
// #endregion

/**
 * Props yang digunakan component `LogoUniversitas`
 * @typedef {Object} LogoUniversitasProps
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 * @property {SupabaseTypes.UniversitasData['id']} [universitasId]
 * Id universitas yang dipilih
 * - Default : `1`
 * @property {number} universitasIndex
 * Index array untuk universitas yang dipilih
 * @property {ImageProps['width']} [width]
 * Logo universitas width
 * - Default : `96`
 * @property {ImageProps['width']} [height]
 * Logo universitas height
 * - Default : `96`
 * @property {ImageProps['alt']} [alt]
 * Logo universitas alt
 * - Default : `'Logo [Nama Universitas]'`
 */

/**
 * Logo universitas menggunakan component `Image` pada {@link Image next/image}. 
 * 
 * Gunakan param {@link universitasId} untuk memilih universitas berdasarkan id atau {@link universitasIndex} untuk memilih universitas berdasarkan index array
 * @param {Omit<ImageProps, 'src'> & LogoUniversitasProps} props LogoUniversitas props
 * @returns {React.ReactElement} Rendered component
 */
const LogoUniversitas = ({
    universitas,
    universitasId = 1,
    universitasIndex,
    width = 96,
    height = 96,
    ...props
}) => {
    const index = universitasIndex ?? universitas.findIndex((item) => item.id === universitasId);

    return (
        <Image
            src={`/universitas/${universitas[index]?.assets?.logo ?? universitas[0]?.assets?.logo}`}
            alt={`Logo ${universitas[index]?.nama ?? universitas[0]?.nama}`}
            width={width}
            height={height}
            {...props}
        />
    )
}

/**
 * Props yang digunakan component `ScrollingItem`
 * @typedef {Object} ScrollingItemProps
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 * @property {number} index
 * Mengacu pada index `universitas` yang digunakan
 * @property {boolean} isActive
 * Boolean apakah element aktif atau tidak dimana saat aktif akan mengganti `color`
 */

/**
 * Element pada scrolling container yang menampilkan logo universitas dengan nama universitas
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'className'> & ScrollingItemProps} props ScrollingItem props
 * @returns {React.ReactElement} Rendered component
 */
const ScrollingItem = ({ universitas, index, isActive, ...props }) => (
    <div className={`${styles.item} ${isActive ? styles.active : ''}`} {...props}>
        <div className={styles.logo}>
            <LogoUniversitas
                universitas={universitas}
                universitasIndex={index}
                width={30}
                height={30}
            />
        </div>
        <h3 className={styles.title_small}>
            {universitas[index]?.nama ?? universitas[0]?.nama}
        </h3>
    </div>
)

/**
 * Props yang digunakan component `ButtonLink`
 * @typedef {Object} ButtonLinkProps
 * @property {React.ReactNode} [text]
 * Teks button
 * - Default `'Lorem'`
 * @property {'default' | 'secondary'} [type]
 * Tipe button yang digunakan
 * - Default : `'default'`
 * @property {boolean} [isOpenNewTab]
 * Boolean yang menyatakan apakah link dibuka di tab baru atau tidak.
 * Saat `true` akan menggunakan atribut target dengan nilai `_blank` dan menambahkan icon disamping teks
 * - Default : `false`
 */

/**
 * Button yang menggunakan component Link pada `next/link`
 * @param {Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps & ButtonLinkProps} props ButtonLink props
 * @returns {React.ReactElement} Rendered component
 */
const ButtonLink = ({ text = 'Lorem', type = 'default', isOpenNewTab, ...props }) => (
    <Link
        className={`${styles.btn} ${type === 'secondary' ? styles.secondary : ''}`}
        onClickCapture={(event) => { event.target.blur() }}
        {...(isOpenNewTab || false ? { target: '_blank' } : {})}
        {...props}
    >
        {text}
        {isOpenNewTab && (
            <FiExternalLink className={styles.external} />
        )}
    </Link>
)

/**
 * Components
 * @param {{universitas:Array<SupabaseTypes.UniversitasData>}} props Root props
 * @returns {React.ReactElement} Rendered component
 */
const Universitas = ({ universitas }) => {
    /** @type {React.MutableRefObject<HTMLDivElement>} */
    const sectionRef = React.useRef(null);
    const [activeUnivId, setActiveUnivId] = React.useState(0);
    /** @type {ReturnType<typeof React.useState<Array<Pick<AnimatedElementProps, 'timeframe' | 'animations'>>>>} */
    const [iconAnimProps, setIconAnimProps] = React.useState([]);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end end"]
    });

    const sectionScrollProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const replacedDescription = replacePlaceholders(UNIVERSITAS_SECTION_DESCRIPTION, {
        jumlah_universitas: universitas.length
    })

    const generateIconAnimProps = () => {
        return Array.from({ length: universitas.length }, (_, index) => {
            if (index % 2 === 0) {
                return {
                    timeframe: [0.25, generateRandomFloat(0.8, 0.95)],
                    animations: {
                        z: [generateRandomNumberFixedRange(125, 250), 0],
                        scale: [generateRandomFloat(0.1, 1.25), 1],
                        opacity: [0, 1],
                        rotateX: [generateRandomNumber(-75, -35), 0],
                        rotateY: [generateRandomNumber(-45, 45), 0],
                    }
                }
            } else {
                return {
                    timeframe: [0.25, generateRandomFloat(0.8, 0.95)],
                    animations: {
                        z: [generateRandomNumberFixedRange(125, 250), 0],
                        scale: [generateRandomFloat(0.1, 1.25), 1],
                        opacity: [0, 1],
                        rotateX: [generateRandomNumber(35, 75), 0],
                        rotateY: [generateRandomNumber(-45, 45), 0],
                    }
                }
            }
        })
    }

    /** @param {React.KeyboardEvent} event */
    const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
            if (!event.shiftKey) {
                if (sectionRef.current && sectionRef.current.nextElementSibling) {
                    const focusableElements = Array.from(sectionRef.current.querySelectorAll('[tabIndex="0"]'));
                    const isLastFocusableElement = focusableElements[focusableElements.length - 1] === document.activeElement;
                    if (isLastFocusableElement) {
                        event.preventDefault();
                        scroller.scrollTo(sectionRef.current.nextElementSibling.id, { offset: -75, smooth: true });
                        sectionRef.current.nextElementSibling.focus();
                    }
                }
            }
        }
    }

    React.useEffect(() => {
        setIconAnimProps(generateIconAnimProps());
    }, []);

    let itemFlatIndex = -1;
    let itemIndex = 0;

    return (
        <section
            ref={sectionRef}
            id={'universitas'}
            tabIndex={0}
            className={`${styles.section} ${styles.universitas}`}
            onKeyDown={handleKeyDown}
        >
            <div className={styles.inner}>
                <div className={styles.layout}>
                    <div className={styles.text}>
                        <AnimatedElement
                            as={'h2'}
                            className={styles.title}
                            style={{ transformOrigin: '-25% -100%' }}
                            timeframe={[0.1, 0.74]}
                            animations={{
                                rotateX: [-65, 0],
                                rotateY: [35, 0],
                                opacity: [0, 1]
                            }}
                            scrollProgress={sectionScrollProgress}
                        >
                            {UNIVERSITAS_SECTION_TITLE}
                        </AnimatedElement>

                        <AnimatedElement
                            as={'p'}
                            className={styles.title_description}
                            timeframe={[0.25, 0.77]}
                            animations={{ opacity: [0, 1], y: [30, 0] }}
                            scrollProgress={sectionScrollProgress}
                        >
                            {replacedDescription}
                        </AnimatedElement>

                        <AnimatedElement
                            as={'div'}
                            className={styles.title_cta}
                            timeframe={[0.5, 0.8]}
                            animations={{ opacity: [0, 1], y: [50, 0] }}
                            scrollProgress={sectionScrollProgress}
                        >
                            {UNIVERSITAS_SECTION_BUTTON.map((props, index) => (
                                <ButtonLink key={index} {...props} />
                            ))}
                        </AnimatedElement>
                    </div>

                    <div className={styles.content}>
                        {(iconAnimProps.length > 0) && UNIVERSITAS_ITEMS_LAYOUT.map((config, layoutIndex) => {
                            const currentItems = universitas.slice(itemIndex, itemIndex + config.count);
                            itemIndex += config.count;

                            return (currentItems.length > 0) && (
                                <div key={layoutIndex} className={styles.icons} style={config.style}>
                                    {currentItems.map((item, index) => {
                                        itemFlatIndex += 1;
                                        return (
                                            <AnimatedElement
                                                key={index}
                                                className={`${styles.icon} ${activeUnivId === item.id ? styles.active : ''}`}
                                                data-univshort={item.short.toLowerCase()}
                                                style={{
                                                    transformOrigin: '100% 200%'
                                                }}
                                                scrollProgress={sectionScrollProgress}
                                                onClick={() => { setActiveUnivId(item.id) }}
                                                {...iconAnimProps[itemFlatIndex]}
                                            >
                                                <LogoUniversitas universitas={universitas} universitasId={item.id} />
                                            </AnimatedElement>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2.5, ease: 'linear' }}
                viewport={{
                    once: GLOBAL_VIEWPORT_ONCE,
                }}
                className={styles.scrolling}
            >
                <div className={styles.items}>
                    <ScrollingCarousel
                        initialDirection={'left'}
                        useHoverEffect={false}
                        scrollEffectType={'reverse'}
                        contentGap={35}
                        contentRenderOffset={-1}
                        containerProps={{ style: { top: '50%', transform: 'translate(-50%, -50%)' } }}
                    >
                        {universitas.map((item, index) => (
                            <ScrollingItem
                                key={index}
                                universitas={universitas}
                                index={index}
                                isActive={activeUnivId === item.id}
                                data-univshort={item.short.toLowerCase()}
                            />
                        ))}
                    </ScrollingCarousel>
                </div>

                <div className={styles.items}>
                    <ScrollingCarousel
                        initialDirection={'right'}
                        useHoverEffect={false}
                        scrollEffectType={'reverse'}
                        contentGap={35}
                        contentRenderOffset={-1}
                        containerProps={{ style: { top: '50%', transform: 'translate(-50%, -50%)' } }}
                    >
                        {universitas.map((item, index) => (
                            <ScrollingItem
                                key={index}
                                universitas={universitas}
                                index={index}
                                isActive={activeUnivId === item.id}
                                data-univshort={item.short.toLowerCase()}
                            />
                        ))}
                    </ScrollingCarousel>
                </div>
            </motion.div>

        </section>
    )
}

export default Universitas;