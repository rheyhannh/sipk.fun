'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js';
import * as SupabaseTypes from '@/types/supabase.js';
// #endregion

// #region NEXT DEPEDENCY
import Image from 'next/image'
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import TextBox from '@/component/motion/TextBox';
// #endregion

// #region UTIL DEPEDENCY
import { getCommonAnimationVariants } from '@/component/motion/_helper';
// #endregion

// #region STYLE DEPEDENCY
import mainStyles from '../style/main.module.css';
import universitasStyles from '../style/universitas.module.css';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
// #endregion

const Universitas = () => {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist } = React.useContext(LandingContext);

    return (
        <Section>
            <Container>
                <Layout>
                    <Highlight>

                    </Highlight>

                    <ShowCase />
                </Layout>
            </Container>
        </Section>
    )
}

// #region Main Components

const Section = ({ children }) => {
    return (
        <section
            id='universitas'
            className={`${mainStyles.section} ${mainStyles.universitas}`}
        >
            {children}
        </section>
    )
}

const Container = ({ children }) => {
    return (
        <div
            className={universitasStyles.container}
        >
            {children}
        </div>
    )
}

const Layout = ({ children }) => {
    return (
        <div
            className={universitasStyles.layout}
        >
            {children}
        </div>
    )
}

// #endregion

// #region Highlight Components

const Highlight = () => {
    const highlight = 'Lebih dari 10 universitas bisa pakai SIPK';
    const highlightArray = highlight.split(' ');
    return (
        <motion.div
            className={universitasStyles.highlight}
            initial={'hide'}
            whileInView={[
                'highlightText_show'
            ]}
            transition={{
                delayChildren: 0.3,
                staggerChildren: 0.1
            }}
        >
            {highlightArray.map((item, index) => (
                <TextBox
                    key={`universitas_highlight_text-${index}`}
                    text={item}
                    useBoxShadow={false}
                    enterAnimation={'custom'}
                    customEnterAnimation={{
                        hide: getCommonAnimationVariants('flyUp').hide,
                        highlightText_show: getCommonAnimationVariants('flyUp').show,
                    }}
                    style={{
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        backgroundColor: 'none',
                        textTransform: 'capitalize',
                    }}
                />
            ))}
        </motion.div>
    )
}

// #endregion

// #region Showcase Components 

const ShowCase = () => {
    /** @type {ContextTypes.LandingContext} */
    const { data: { universitas } } = React.useContext(LandingContext);
    const [selectedUniversitas, setSelectedUniversitas] = React.useState(null);

    return (
        <div
            className={universitasStyles.showcase}
            style={{
                border: '1.5px solid yellow'
            }}
        >
            <Details
                universitas={universitas}
                selectedUniversitas={selectedUniversitas}
                key={'universitas_details'}
            />
            <Carousel
                universitas={universitas}
                selectedUniversitas={selectedUniversitas}
                setSelectedUniversitas={setSelectedUniversitas}
                key={'universitas_carousel'}
            />
        </div>
    )
}

/**
 * Props yang digunakan pada component `Details`
 * @typedef {Object} DetailsProps
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 * Array yang berisikan data universitas yang tersedia
 * @property {?number} selectedUniversitas
 * State berupa index dari `universitas` yang aktif
 * - Note : Intial state bernilai `null`
 */

/**
 * Element yang menampilkan detail universitas yang aktif pada state `selectedUniversitas`
 * @param {React.HTMLAttributes<HTMLDivElement> & DetailsProps} props Component props
 * @returns {React.ReactElement} Rendered component
 */
const List = ({ universitas, selectedUniversitas, swiperCarousel, ...props }) => {
    const [shuffledUniversitas, setShuffledUniversitas] = React.useState(universitas);

    const shuffleUniversitas = () => {
        const shuffled = [...shuffledUniversitas];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setShuffledUniversitas(shuffled);
    }

    React.useEffect(() => {
        shuffleUniversitas();
    }, [])

    return (
        <div
            className={universitasStyles.list}
            {...props}
        >
            <motion.div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    maxWidth: 1000,
                }}
                initial={'hide'}
                whileInView={[
                    'listUniversitasItem_show'
                ]}
                transition={{
                    delayChildren: 0.5,
                    staggerChildren: 0.1
                }}
            >
                {shuffledUniversitas.map((item, index) => (
                    <TextBox
                        key={`universitasListItem-${item.id}`}
                        text={item.nama}
                        useBoxShadow={false}
                        enterAnimation={'custom'}
                        customEnterAnimation={{
                            hide: getCommonAnimationVariants('scaleFromSmall').hide,
                            listUniversitasItem_show: getCommonAnimationVariants('scaleFromSmall').show,
                        }}
                        style={{
                            margin: selectedUniversitas === item.id ? '2.5px 5px 5px 2.5px' : '1.25px 2.5px 2.5px 1.25px',
                            fontSize: selectedUniversitas === item.id ? '1.5rem' : '1rem',
                            padding: selectedUniversitas === item.id ? 'calc(0.4 * 1.5rem)' : 'calc(0.4 * 1rem)',
                            borderRadius: selectedUniversitas === item.id ? 'calc(0.4 * 1.5rem)' : 'calc(0.4 * 1rem)',
                            color: 'var(--landing-copyInverse)',
                            fontWeight: selectedUniversitas === item.id ? '600' : '500',
                            cursor: 'pointer',
                        }}
                        otherProps={{
                            layout: true,
                            onClick: () => {
                                if (swiperCarousel) { swiperCarousel.slideToLoop(item.id - 1) }
                            },
                        }}
                    />
                ))}
            </motion.div>
        </div>
    )
}

/**
 * Props yang digunakan pada component `Carousel`
 * @typedef {Object} CarouselProps
 * @property {Array<SupabaseTypes.UniversitasData>} universitas
 * Array yang berisikan data universitas yang tersedia
 * @property {?number} selectedUniversitas
 * State berupa index dari `universitas` yang aktif
 * - Note : Intial state bernilai `null`
 * @property {(value:number) => void} setSelectedUniversitas
 * Method untuk set `selectedUniversitas` dengan parameter `value` berupa number dari `universitas` yang aktif
 */

/**
 * Element yang menampilkan universitas yang tersedia
 * @param {React.HTMLAttributes<HTMLDivElement> & CarouselProps} props Component props
 * @returns {React.ReactElement} Rendered component
 */
const Carousel = ({ universitas, selectedUniversitas, setSelectedUniversitas, setSwiperCarousel, ...props }) => {
    const [test, setTest] = React.useState([]);

    const addTest = () => {
        const placeAt = test.length > 0 ? Math.floor(Math.random() * test.length) : 0;
        const updatedTest = [...test];
        updatedTest.splice(placeAt, 0, crypto.randomUUID());
        setTest(updatedTest);
    }

    const deleteTest = () => {
        if (test.length === 0) { return }
        const removeAt = Math.floor(Math.random() * test.length);
        const updatedTest = [...test];
        updatedTest.splice(removeAt, 1);
        setTest(updatedTest);
    }

    return (
        <Swiper
            breakpoints={{
                1024: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                1440: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                }
            }}
            centeredSlides={true}
            loop={true}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            effect={'coverflow'}
            coverflowEffect={{
                depth: 200,
                modifier: 2,
                rotate: 0,
                scale: 0.8,
                slideShadows: false,
                stretch: 0,
            }}
            modules={[Autoplay, EffectCoverflow]}
            className={universitasStyles.swiper}
            onSwiper={(swiper) => { setSwiperCarousel(swiper) }}
            onRealIndexChange={(swiper) => { setSelectedUniversitas(swiper.realIndex + 1) }}
        >
            {universitas.map((item, index) => (
                <SwiperSlide
                    className={universitasStyles.swiper_slide}
                    key={`universitasCarouselItem-${item.id}`}
                >
                    {({ isPrev, isActive, isNext, isVisible }) => (
                        <motion.div
                            className={universitasStyles.item}
                            initial={getCommonAnimationVariants('flyUp').hide}
                            animate={{
                                boxShadow: isActive ?
                                    `0 3px 10px ${item.assets.style.color.primary}` : `0 3px 10px rgba(0,0,0,.5)`,
                            }}
                            whileInView={getCommonAnimationVariants('flyUp').show}
                            transition={{
                                delay: 0.4
                            }}
                            layout
                        >
                            <Image
                                src={`/universitas/${item.assets.logo}`}
                                alt={`Logo ${item.short}`}
                                width={100}
                                height={100}
                                className={item.short === 'TELKOM' ? universitasStyles.telkom : item.short === 'UNPAD' ? universitasStyles.unpad : null}
                            />
                        </motion.div>
                    )}
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

// #endregion

export default Universitas;