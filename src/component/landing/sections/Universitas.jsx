'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context.js'
// #endregion

// #region NEXT DEPEDENCY
import Image from 'next/image'
// #endregion

// #region REACT DEPEDENCY
import { useContext } from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing';
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

// #endregion

export default Universitas;