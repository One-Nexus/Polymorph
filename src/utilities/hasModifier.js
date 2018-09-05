import getModuleNamespace from './getModuleNamespace';

export default function hasModifier({ element, modifier, modifierGlue, namespace }) {
    return [...element.classList].some(className => {
        const namespaceMatch = className.indexOf(namespace || getModuleNamespace(element)) === 0;
        // @TODO be more strict with modifierMatch so it only matches exact
        // modifier and not any modifier that starts with `modifier`
        const modifierMatch = className.indexOf(modifierGlue + modifier) > -1;

        return namespaceMatch && modifierMatch;
    });
}

// export default function hasModifier({ element, namespace, modifier, modifierGlue }) {
//     let matches = [];

//     matches.push(...[...element.classList].filter(className => {
//         return className.indexOf(namespace || getModuleNamespace(element)) === 0
//     }).map(target => target.split(modifierGlue).slice(1))[0]);

//     return matches.includes(modifier);
// }