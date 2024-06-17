'use client'

// #region TYPE DEPEDENCY
import * as ContextTypes from '@/types/context';
// #endregion

// #region REACT DEPEDENCY
import { useContext, useEffect, useState } from 'react'
// #endregion

// #region COMPONENT DEPEDENCY
import { LandingContext } from '@/component/provider/Landing'
import toast from 'react-hot-toast';
// #endregion

// #region STYLE DEPEDENCY
import styles from '../style/context.module.css'
// #endregion

/**
 * Render landing page section `context`
 * @returns {ReactElement} Element react untuk render landing page section `context`
 */
export function Context() {
    /** @type {ContextTypes.LandingContext} */
    const { isRichContent, isTouchDevice, isAccessTokenExist, data } = useContext(LandingContext);
    const size = useWindowSize();

    return (
        <Section>
            <Title>
                <h1>Context Provider</h1>
            </Title>
            <Content>
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
                <h1>Users Viewport</h1>
                <h1>
                    <span>Width: {size.width}px | </span>
                    <span>Height : {size.height}px</span>
                </h1>
            </Content>
        </Section>
    )
}

const Section = ({ children }) => {
    return (
        <section
            id={`context-${crypto.randomUUID()}`}
            className={styles.section}
        >
            {children}
        </section>
    )
}

const Title = ({ children }) => (
    <div
        className={styles.section__name}
    >
        {children}
    </div>
)

const Content = ({ children }) => (
    <div
        className={styles.content}
    >
        {children}
    </div>
)

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
}