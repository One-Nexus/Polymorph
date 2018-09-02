import getModuleNamespace from './getModuleNamespace';

/**
 * @param {*} componentName 
 */
export default function getComponents({ element, componentName = '', modifier, namespace, componentGlue }) {
    const query = (namespace || getModuleNamespace(element, 'strict')) + (componentName ? (componentGlue + componentName) : '');

    return [].concat(...[...element.querySelectorAll(`[class*="${query}"]`)].filter(component => {
        return ([...component.classList].some(className => {
            const isComponent = (className.split(componentGlue).length - 1) === 1;
            const isQueryMatch = className.indexOf(query) === 0;

            if (modifier) {
                return isQueryMatch && isComponent && className.indexOf(modifier) > -1;
            } else {
                return isQueryMatch && isComponent;
            }
        }));
    }));
}