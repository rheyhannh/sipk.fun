'use client'

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

const RICH_CONTENT_WIDTH = 1280;

/**
 * @typedef {Object} RootContextProps
 * @property {boolean} isRichContent 
 * State ini berfungsi untuk mendeteksi apakah width viewport lebih dari {@link RICH_CONTENT_WIDTH rich content width} dengan menggunakan,
 * 
 * ```js
 * window.matchMedia(`(min-width: ${RICH_CONTENT_WIDTH}px)`);
 * ```
 * 
 * State ini sudah dilengkapi event listener beserta cleanupnya sehingga state akan diperbarui secara `otomatis`
 * - Initial : `false` (akan diperbarui setelah mount)
 * 
 * Normalnya rich content saat viewport `>= 1280px`
 * @property {boolean} isTouchDevice 
 * State ini berfungsi untuk mendeteksi apakah user device merupakan touch device dengan menggunakan,
 * 
 * ```js
 * const isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;
 * ```
 * 
 * State ini sudah dilengkapi event listener beserta cleanupnya sehingga state akan diperbarui secara `otomatis`
 * 
 * - Initial : `false` (akan diperbarui setelah mount)
 * - Penting : Masih terdapat bug pada listener dimana perubahan tipe device pada debugger tidak akan memperbarui state
 */

/** 
 * Shared context berupa state, variable yang digunakan pada root atau landing page.
 * 
 * Lihat `example` untuk contoh penggunaan
 * @example
 * ```jsx
 * const MyComponent = () => {
 *      // with useContext example
 *      const { foo, bar } = React.useContext(RootContext);
 *      ... // do something with shared variables
 * }
 * 
 * const Main = () => (
 *      <RootProvider>
 *          <RootContext.Consumer>               
 *              {context => (
 *                  <div>
 *                      with context consumer example
 *                      {context.foo} {context.bar}
 *                  </div>
 *              )}
 *          </RootContext.Consumer>
 *          <MyComponent/>
 *      </RootProvider>
 * )
 * ```
 * @type {React.Context<RootContextProps>} 
 */
export const RootContext = React.createContext();

/**
 * Context provider untuk halaman root atau landing page. Gunakan wrapper ini untuk share state, variable yang tersedia pada `RootContext`.
 * 
 * Lihat `example` untuk contoh penggunaan
 * @param {{children:React.ReactNode}} props RootProvider props
 * @returns {React.ReactElement} Context provider dengan shared `RootContext`
 * @example
 * ```jsx
 * const MyComponent = () => {
 *      // with useContext example
 *      const { foo, bar } = React.useContext(RootContext);
 *      ... // do something with shared variables
 * }
 * 
 * const Main = () => (
 *      <RootProvider>
 *          <RootContext.Consumer>               
 *              {context => (
 *                  <div>
 *                      with context consumer example
 *                      {context.foo} {context.bar}
 *                  </div>
 *              )}
 *          </RootContext.Consumer>
 *          <MyComponent/>
 *      </RootProvider>
 * )
 * ```
 */
export const RootProvider = ({ children }) => {
    /** @type {ReturnType<typeof React.useState<RootContextProps['isRichContent']>>} */
    const [isRichContent, setRichContent] = React.useState(false);
    /** @type {ReturnType<typeof React.useState<RootContextProps['isTouchDevice']>>} */
    const [isTouchDevice, setTouchDevice] = React.useState(false);

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
                isRichContent, isTouchDevice
            }}
        >
            {children}
        </RootContext.Provider>
    )
}