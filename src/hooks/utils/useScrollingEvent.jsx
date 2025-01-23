'use client';

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

/**
 * State yang mendeskripsikan tipe scroll terakhir yang dilakukan.
 * Jika tidak ada scroll yang dilakukan setelah durasi {@link useScrollingOptions.timeoutDuration timeoutDuration}, state akan direset menjadi `'stop'`.
 * Sehingga state ini dapat bernilai sebagai berikut,
 * - `'up'` : Scroll keatas
 * - `'down'` : Scroll kebawah
 * - `'stop'` : Tidak ada scroll yang dilakukan
 *
 * @typedef {'down' | 'up' | 'stop'} ScrollingType
 */

/**
 * @typedef {Object} useScrollingOptions
 * @property {number} minimumScrollPosition
 * Hanya eksekusi callback saat {@link Window.scrollY window vertikal scroll} lebih dari nilai ini
 * - Default : `0`
 * @property {number} timeoutDuration
 * Mendeskripsikan sebuah durasi dalam `ms` dimana jika tidak ada scroll setelah durasi ini, state {@link ScrollingType scrollingType} akan direset menjadi `'stop'`
 * - Default : `500`
 */

/**
 * Hook custom untuk mendeteksi {@link Window.scrollY window vertikal scroll} apakah keatas atau kebawah dan mengeksekusi callback tertentu.
 * Semua callback tidak akan dieksekusi jika posisi scroll kurang dari {@link useScrollingOptions.minimumScrollPosition minimumScrollPosition} atau,
 * ```js
 * typeof callback !== 'function'
 * ```
 *
 * Ini dapat sangat berguna jika kita ingin handle scrolling event saat posisi scroll tertentu dan juga setiap perubahan arah scroll, lihat contoh pada `example` untuk lebih detailnya
 *
 * @param {() => void} onScrollUp Callback saat scroll keatas dilakukan
 * @param {() => void} onScrollDown Callback saat scroll kebawah dilakukan
 * @param {() => void} onScrollStop Callback saat tidak ada scroll lagi yang dilakukan setelah durasi {@link useScrollingOptions.timeoutDuration timeoutDuration}
 * @param {useScrollingOptions} options Opsi yang digunakan
 * @returns {ScrollingType} State {@link ScrollingType scrollingType} dimana mendeskripsikan tipe scroll terakhir yang dilakukan
 * @example
 * ```jsx
 * const MyComponent = () => {
 *      const x = () => { console.log('callback: Going up') }
 *      const y = () => { console.log('callback: Going down') }
 *      const z = () => { console.log('callback: Scrolling stop') }
 *
 *      // Execute callback every scrolling when window.scrollY >= 768
 *      const scrollingType = useScrollingEvent(x, y, z, { minimumScrollPosition: 768 });
 *
 *      // Do something every scrolling direction changes or stop
 *      React.useEffect(() => {
 *          if (scrollingType === 'up') {
 *              console.log('Going up');
 *          } else if (scrollingType === 'down') {
 *              console.log('Going down');
 *          } else {
 *              console.log('Scrolling stop');
 *          }
 *      }, [scrollingType]);
 *      ...
 * }
 * ```
 */
function useScrollingEvent(
	onScrollUp,
	onScrollDown,
	onScrollStop,
	options = { minimumScrollPosition: 0, timeoutDuration: 500 }
) {
	const minimumScrollPosition = options?.minimumScrollPosition ?? 0;
	const timeoutDuration = options?.timeoutDuration ?? 500;

	const [prevScrollPos, setPrevScrollPos] = React.useState(
		/** @type {Window['scrollY']} */ (0)
	);
	const [scrollingType, setScrollingType] = React.useState(
		/** @type {ScrollingType} */ ('stop')
	);
	const timeoutRef = React.useRef(null);

	React.useEffect(() => {
		const handleScroll = () => {
			if (timeoutRef) clearTimeout(timeoutRef.current);

			const currentScrollPos = window.scrollY;
			const isScrollingDown = currentScrollPos > prevScrollPos;
			const isScrollingUp = currentScrollPos < prevScrollPos;
			setPrevScrollPos(currentScrollPos);

			if (isScrollingDown) {
				setScrollingType('down');
				if (
					typeof onScrollDown === 'function' &&
					currentScrollPos >= minimumScrollPosition
				)
					onScrollDown();
			}
			if (isScrollingUp) {
				setScrollingType('up');
				if (
					typeof onScrollUp === 'function' &&
					currentScrollPos >= minimumScrollPosition
				)
					onScrollUp();
			}

			timeoutRef.current = setTimeout(() => {
				setScrollingType('stop');
				if (
					typeof onScrollStop === 'function' &&
					currentScrollPos >= minimumScrollPosition
				)
					onScrollStop();
			}, timeoutDuration);
		};

		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	}, [prevScrollPos]);

	return scrollingType;
}

export default useScrollingEvent;
