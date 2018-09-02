/**
 * Get the Module name from a Synergy query/DOM element
 * 
 * @param {*} query 
 * @param {Bool} strict
 */
export default function getModuleNamespace(query, strict = false) {
    if (query instanceof HTMLElement) {
        if (query.closest('[data-module]')) {
            return query.closest('[data-module]').getAttribute('data-module');
        }

        if (query.classList.length) {
            if (strict) {
                return query.classList[0].split(/-(.+)/)[0].split(/_(.+)/)[0];
            }

            return query.classList[0].split(/-(.+)/)[0];
        }
    }
}