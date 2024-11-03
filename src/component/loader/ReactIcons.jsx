// #region TYPE DEPEDENCY
import { IconBaseProps } from 'react-icons';
// #endregion

// #region COMPONENT DEPEDENCY
import loadable from '@loadable/component';
import { ErrorBoundary } from 'react-error-boundary';
// #endregion

// #region ICON DEPEDENCY
import { FaBacteria } from 'react-icons/fa';
// #endregion

/**
 * `CLIENT COMPONENT USAGE ONLY`
 * 
 * Component untuk load icon yang tersedia pada {@link https://react-icons.github.io/react-icons/ react-icons}.
 * Jika library atau nama icon tidak ditemukan, maka error boundary akan memberikan fallback berupa icon berikut,
 * ```jsx
 * <FaBacteria size={'24px'} />
 * ```
 * @param {Object} props Icon props
 * @param {string} props.name 
 * Nama icon yang ingin digunakan 
 * - Contoh : `'FaRocket'`
 * @param {string} props.lib
 * Library icon yang ingin digunakan 
 * - Contoh : `'fa'`
 * @param {IconBaseProps} props.props
 * Props react icons yang ingin digunakan 
 * @returns {React.ReactElement} Rendered component
 */
export const Icon = ({ name, lib, props }) => {
    const ElementIcon = loadable(() => import(`react-icons/${lib}/index.js`), {
        resolveComponent: (el) => el[name]
    });

    return (
        <ErrorBoundary fallback={<FaBacteria size={'24px'} />}>
            <ElementIcon {...props} />
        </ErrorBoundary>
    );
}