'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js';
import * as SupabaseTypes from '@/types/supabase.js';
import { HTMLProps } from 'react';
// #endregion

// #region NEXT DEPEDENCY
import Image from 'next/image'
// #endregion

// #region REACT DEPEDENCY
import { useContext, useState } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
import { motion, AnimatePresence } from 'framer-motion';
// #endregion

// #region STYLE DEPEDENCY
import mainStyles from '../style/main.module.css';
import universitasStyles from '../style/universitas.module.css';
// #endregion

const Universitas = () => {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist } = useContext(LandingContext);

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
            style={{
                border: '2.5px solid pink',
            }}
        >
            {children}
        </div>
    )
}

const Layout = ({ children }) => {
    return (
        <div
            className={universitasStyles.layout}
            style={{
                border: '2px solid red',
            }}
        >
            {children}
        </div>
    )
}

// #endregion

// #region Highlight Components

const Highlight = ({ children }) => {
    return (
        <div
            className={universitasStyles.highlight}
            style={{
                border: '1.5px solid green'
            }}
        >
            {children}
        </div>
    )
}

// #endregion

// #region Showcase Components 

const ShowCase = () => {
    /** @type {ContextTypes.LandingContext} */
    const { data: { universitas } } = useContext(LandingContext);
    const [selectedUniversitas, setSelectedUniversitas] = useState(null);

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
const Details = ({ universitas, selectedUniversitas, ...props }) => {
    return (
        <div
            className={universitasStyles.details}
            style={{
                border: '1px solid aqua',
            }}
            {...props}
        >
        </div>
    )
}

const Carousel = ({ universitas, selectedUniversitas, setSelectedUniversitas, ...props }) => {
    const [test, setTest] = useState([]);

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
        <div
            className={universitasStyles.carousel}
            style={{
                border: '1px solid pink',
                position: 'relative'
            }}
            {...props}
        >
            <div
                style={{
                    width: '50px',
                    height: '25px',
                    position: 'absolute',
                    top: '1rem',
                    left: '50%',
                    transform: 'translate(-50%, -1rem)',
                    border: '0.5px solid purple',
                    display: 'flex',
                    justifyContent: 'space-evenly'
                }}
            >
                <span
                    onClick={deleteTest}
                >
                    -
                </span>

                <span
                    onClick={addTest}
                >
                    +
                </span>
            </div>
            <AnimatePresence>
                {universitas.map((item, index) => (
                    <motion.div
                        key={`universitasItem-${item.id}`}
                        className={universitasStyles.item}
                        initial={{ scale: 0 }}
                        animate={{
                            scale: 1,
                            boxShadow: selectedUniversitas === index ?
                                `0 3px 10px ${item.assets.style.color.primary ?? 'rgba(0,0,0,.5)'}`
                                :
                                `0 3px 10px rgba(0,0,0,.25)`
                        }}
                        exit={{ opacity: 0 }}
                        onTap={() => setSelectedUniversitas(index)}
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
                ))}
            </AnimatePresence>
        </div>
    )
}

// #endregion

export default Universitas;