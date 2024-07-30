// #region COMPONENT DEPEDENCY
import loadable from '@loadable/component';
// #endregion

export function Icon({ name, lib, props }) {
    const ElementIcon = loadable(() => import(`react-icons/${lib}/index.js`), {
        resolveComponent: (el) => el[name]
    });

    return <ElementIcon {...props} />;
}