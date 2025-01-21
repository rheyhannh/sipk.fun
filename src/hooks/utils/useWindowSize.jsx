'use client';

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

/**
 * @typedef WindowSize
 * @property {number} width Window width
 * - Contoh : `1366`, `1920`
 * @property {number} height Window height
 * - Contoh : `512`, `768`
 */

/**
 * Hook custom untuk mendapatkan current window `width` dan `height`.
 * Listen window event `'resize'` untuk memperbarui state dengan width dan height terbaru,
 * ```js
 * window.addEventListener('resize');
 * ```
 * @returns {WindowSize} Object berisikan current window width dan height
 * @example
 * ```jsx
 * const MyComponent = () => {
 *      const { width, height } = useWindowSize();
 *
 *      React.useEffect(() => {
 *          console.log('Width or height changed')
 *      }, [width, height]);
 *      ...
 * }
 * ```
 */
function useWindowSize() {
	const [windowSize, setWindowSize] = React.useState(
		/** @type {WindowSize} */ ({ width: undefined, height: undefined })
	);

	React.useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight
			});
		}

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowSize;
}

export default useWindowSize;
