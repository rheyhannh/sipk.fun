// #region TYPE DEPEDENCY
import { IconBaseProps } from 'react-icons';
// #endregion

// #region COMPONENT DEPEDENCY
import loadable from '@loadable/component';
// #endregion

/**
 * Props yang digunakan component `ReactIconsLoader`
 * @typedef {Object} ReactIconsLoaderProps
 * @property {string} name 
 * Nama icon yang ingin digunakan 
 * - Contoh : `'FaRocket'`
 * @property {string} lib
 * Library icon yang ingin digunakan 
 * - Contoh : `'fa'`
 */

/**
 * Component untuk load icon yang tersedia pada {@link https://react-icons.github.io/react-icons/ react-icons}.
 * 
 * Lihat beberapa usecase pada `example`
 * @param {IconBaseProps & ReactIconsLoaderProps} props ReactIconsLoader props
 * @returns {React.ReactElement} Rendered component
 * @example 
 * ```jsx
 * // Usecase 1 'Icon name or lib based on some resources'
 * const getIcon = await fetch('someUrl');
 * const icon = await getIcon.json();
 * <ReactIconsLoader name={icon.name} lib={icon.lib} /> 
 * 
 * // Usecase 2 'Load icon when viewport meets'
 * <LazyWrapper>
 *      <ReactIconsLoader name={'FaBeer'} lib={'fa'} /> 
 * </LazyWrapper>
 * ```
 */
const ReactIconsLoader = ({ name, lib, ...props }) => {
    const ElementIcon = loadable(() => import(`react-icons/${lib}/index.js`), {
        resolveComponent: (el) => el[name]
    });

    return <ElementIcon {...props} />;
}

export default ReactIconsLoader;