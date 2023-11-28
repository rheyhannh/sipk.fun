// ========== COMPONENT DEPEDENCY ========== //
import loadable from '@loadable/component';

/*
============================== CODE START HERE ==============================
*/
export function Icon({ name, lib, props }) {
    const ElementIcon = loadable(() => import(`react-icons/${lib}/index.js`), {
        resolveComponent: (el) => el[name]
    });

    return <ElementIcon {...props} />;
}