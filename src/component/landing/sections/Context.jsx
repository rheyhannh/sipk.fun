'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
import * as SupabaseTypes from '@/types/supabase';
// #endregion

// #region REACT DEPEDENCY
import { useContext } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing'
import toast from 'react-hot-toast';
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/landing.module.css'
// #endregion

/**
 * Render landing page section `context`
 * @param {{data:{universitas:Array<SupabaseTypes.UniversitasData>, rating: Array<SupabaseTypes.RatingData>, notifikasi: Array<SupabaseTypes.NotifikasiData>}}} props React props object
 * @param props.data Data depedency
 * @returns {ReactElement} Element react untuk render landing page section `context`
 */
export function Context({ data = { universitas: null, rating: null, notifikasi: null } }) {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist, data } = useContext(LandingContext);

    return (
        <section className={`${styles.section} ${styles.context}`} id={'context'}>
            <div className={styles.section__name}>
                <h1>Context Provider</h1>
            </div>
            <h1>isRichContent : {isRichContent ? 'true' : 'false'}</h1>
            <h1>isTouchDevice : {isTouchDevice ? 'true' : 'false'}</h1>
            <h1>
                <a href={isAccessTokenExist ? '/dashboard' : '/users'} target={'_blank'}>
                    {isAccessTokenExist ? 'Dashboard' : 'Login atau Daftar'}
                </a>
            </h1>
            <h1>Toast Notification</h1>
            <h1>
                <span onClick={() => { toast.success('Lorem ipsum dolor sit amet.', { position: 'top-left', duration: 2500 }); }}>Success</span> |
                <span onClick={() => { toast.error('Lorem ipsum dolor sit amet.', { position: 'top-left', duration: 2500 }); }}> Error</span> |
                <span onClick={() => { toast.loading('Lorem ipsum dolor sit amet.', { position: 'top-left', duration: 5000 }); }}> Loading</span>
            </h1>
            <h1>Log Data Deps From Context</h1>
            <h1>
                <span onClick={() => { console.log('Universitas data deps'); console.log(data.universitas); }}> Universitas</span> |
                <span onClick={() => { console.log('Rating data deps'); console.log(data.rating); }}> Rating</span> |
                <span onClick={() => { console.log('Blog data deps'); console.log(data.notifikasi); }}> Blog/Notification</span>
            </h1>
        </section>
    )
}