'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js'
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
            <h1>Universitas Section</h1>
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

const ShowCase = ({ children }) => {
    return (
        <div
            className={universitasStyles.showcase}
            style={{
                border: '1.5px solid yellow'
            }}
        >
            {children}
        </div>
    )
}

// #endregion

export default Universitas;