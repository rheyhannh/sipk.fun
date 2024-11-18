// #region TYPE DEPEDENCY
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region STYLE DEPEDENCY
import styles from './style/root.module.css';
// #endregion

const Hero = ({ universitas }) => {

    return (
        <div
            id={'home'}
            className={`${styles.section} ${styles.hero}`}
            style={{
                border: '1px solid pink'
            }}
        >

        </div>
    )
}

export default Hero;