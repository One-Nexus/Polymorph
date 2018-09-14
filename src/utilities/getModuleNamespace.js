/**
 * Get the Module name from a Synergy query/DOM element
 * 
 * @param {*} query - query from which to retrieve a namespace
 * @param {String} componentGlue
 * @param {String} modifierGlue
 * @param {Bool} strict - return the root module name, excluding components
 */
export default function getModuleNamespace(query, componentGlue, modifierGlue, strict = false) {
    if (query instanceof HTMLElement) {
        if (query.hasAttribute('data-module')) {
            return query.getAttribute('data-module');
        }

        if (query.classList.length) {
            if (strict) {
                return query.classList[0].split(modifierGlue)[0].split(componentGlue)[0];
            }

            return query.classList[0].split(modifierGlue)[0];
        }
    }
}