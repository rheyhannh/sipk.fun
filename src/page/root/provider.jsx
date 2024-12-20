'use client'

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

const RICH_CONTENT_WIDTH = 1280;

/**
 * Context value untuk halaman root atau landing page `/`
 * @ContextProvider Lihat {@link RootProvider disini}
 */
export const RootContext = React.createContext(/** @type {import('@/types/context').RootContext} */({}));

/**
 * Context provider untuk halaman root atau landing page `/`
 * @ContextValue Lihat {@link RootContext disini}
 */
const RootProvider = ({ children }) => {
    const [isRichContent, setRichContent] = React.useState(
        /** @type {import('@/types/context').RootContext['isRichContent']} */
        (false)
    );
    const [isTouchDevice, setTouchDevice] = React.useState(
        /** @type {import('@/types/context').RootContext['isTouchDevice']} */
        (false)
    );
    const [showNavbarOverlay, setShowNavbarOverlay] = React.useState(
        /** @type {import('@/types/context').RootContext['showNavbarOverlay']} */
        (false)
    );

    let richMediaQuery;

    React.useEffect(() => {
        const touchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
        richMediaQuery = window.matchMedia(`(min-width: ${RICH_CONTENT_WIDTH}px)`);

        setRichContent(richMediaQuery.matches);
        if (touchDevice) setTouchDevice(true);

        richMediaQuery.addEventListener('change', handleOnMediaQueryChanges);
        window.addEventListener('touchstart', handleOnTouchStartEvent);
        window.addEventListener('mouseover', handleOnMouseOverEvent);

        return () => {
            richMediaQuery.removeEventListener('change', handleOnMediaQueryChanges);
            window.removeEventListener('touchstart', handleOnTouchStartEvent);
            window.removeEventListener('mouseover', handleOnMouseOverEvent);
        }
    }, [])

    /** 
     * Method untuk handle perubahan state dari match media {@link richMediaQuery} dengan memperbarui state `isRichContent` dan `isTouchDevice`
     * 
     * - Note : Method ini tidak dieksekusi setiap terjadi perubahan width viewport, melainkan hanya saat terjadi perubahan
     * state dari match media {@link richMediaQuery}
     * @param {MediaQueryListEvent} event 
     * */
    const handleOnMediaQueryChanges = (event) => {
        setRichContent(event.matches);
    }

    /** 
     * Method untuk handle event `touchstart` dengan memperbarui state `isTouchDevice`
     * @param {TouchEvent} event */
    const handleOnTouchStartEvent = (event) => {
        if (!isTouchDevice) { setTouchDevice(true); }
    }

    /** 
     * Method untuk handle event `mouseover` dengan memperbarui state `isTouchDevice`
     * @param {MouseEvent} event */
    const handleOnMouseOverEvent = (event) => {
        if (isTouchDevice) { setTouchDevice(false); }
    }

    return (
        <RootContext.Provider
            value={{
                isRichContent, isTouchDevice,
                showNavbarOverlay, setShowNavbarOverlay
            }}
        >
            {children}
        </RootContext.Provider>
    )
}

export default RootProvider;