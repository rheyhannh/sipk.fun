// #region COMPONENT DEPEDENCY
import loadable from '@loadable/component';
import { ErrorBoundary } from 'react-error-boundary';
// #endregion

// #region ICON DEPEDENCY
import { FaBacteria } from 'react-icons/fa';
// #endregion

/**
 * Props yang digunakan component `ReactIcons`
 * @typedef {Object} ReactIconsProps
 * @property {string} name 
 * Nama icon yang ingin digunakan 
 * - Contoh : `'FaRocket'`
 * @property {string} lib
 * Library icon yang ingin digunakan 
 * - Contoh : `'fa'`
 */

/**
 * `CLIENT COMPONENT USAGE ONLY`
 * 
 * Component untuk load dan render icon yang tersedia pada {@link https://react-icons.github.io/react-icons/ react-icons} secara dinamis
 * dengan menyediakan {@link name nama} icon dan {@link lib library} icon.
 * Jika library atau nama icon tidak ditemukan, maka error boundary akan memberikan fallback berupa icon berikut,
 * 
 * ```jsx
 * <FaBacteria size={'24px'} />
 * ```
 * 
 * Sebelum menggunakan loader ini, sangat dianjurkan untuk load icon secara statis. Gunakan loader ini jika nama icon belum diketahui
 * pada proses build. Kita belum melakukan optimasi untuk loader ini, sehingga jika ada state atau context yang berubah pada component yang menggunakan loader ini, 
 * kemungkinan besar icon akan terender ulang.
 * 
 * @param {import('react-icons').IconBaseProps & ReactIconsProps} props ReactIcons props
 * @returns {import('react').ReactElement<import('react-icons').IconBaseProps, SVGElement>} Rendered icon
 * @example 
 * ```jsx
 * // Usecase 1 'Icon name or lib based on some resources'
 * const getIcon = await fetch('someUrl');
 * const icon = await getIcon.json();
 * <ReactIcons name={icon.name} lib={icon.lib} /> 
 * 
 * // Usecase 2 'Load icon when viewport meets'
 * <LazyWrapper>
 *      <ReactIcons name={'FaBeer'} lib={'fa'} /> 
 * </LazyWrapper>
 * ```
 */
const ReactIcons = ({ name, lib, ...props }) => {
    const ElementIcon = loadable(() => import(`react-icons/${lib}/index.js`), {
        resolveComponent: (el) => el[name]
    });

    return (
        <ErrorBoundary fallback={<FaBacteria size={'24px'} />}>
            <ElementIcon {...props} />
        </ErrorBoundary>
    );
}

export default ReactIcons;