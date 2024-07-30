// #region TYPE DEPEDENCY
import { IconBaseProps } from 'react-icons';
// #endregion

// #region COMPONENT DEPEDENCY
import loadable from '@loadable/component';
// #endregion

export const Icon = ({ name, lib, props }) => {
    const ElementIcon = loadable(() => import(`react-icons/${lib}/index.js`), {
        resolveComponent: (el) => el[name]
    });

    return <ElementIcon {...props} />;
}