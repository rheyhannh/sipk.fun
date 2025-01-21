// #region TYPE DEPEDENCY
import { IntersectionOptions } from 'react-intersection-observer';
// #endregion

// #region REACT DEPEDENCY
import * as React from 'react';
// #endregion

// #region COMPONENT DEPEDENCY
import { InView } from 'react-intersection-observer';
// #endregion

/**
 * Props yang digunakan component `LazyWrapper`
 * @typedef {Object} LazyWrapperProps
 * @property {keyof React.JSX.IntrinsicElements} [as]
 * Tipe element wrapper dalam string
 * - Default : `'div'`
 * @property {IntersectionOptions} lazyOptions
 * Opsi {@link https://www.npmjs.com/package/react-intersection-observer#options react-intersection-observer} yang digunakan
 * ```js
 * // Default 'options'
 * const options = {
 *      triggerOnce: true
 * }
 * ```
 */

/**
 * Component wrapper untuk conditional rendering `children` saat berada didalam viewport
 * @param {Omit<React.HTMLProps<HTMLElement>, 'ref'> & LazyWrapperProps} props LazyWrapper props
 * @returns {React.ReactElement} Rendered component
 */
const LazyWrapper = ({
	as: Component = 'div',
	lazyOptions,
	children,
	...props
}) => (
	<InView triggerOnce {...lazyOptions}>
		{({ inView, ref }) => (
			<Component ref={ref} {...props}>
				{inView ? children : null}
			</Component>
		)}
	</InView>
);

export default LazyWrapper;
