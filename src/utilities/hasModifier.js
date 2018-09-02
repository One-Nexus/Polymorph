import getModuleNamespace from './getModuleNamespace';

export default function hasModifier({ element, namespace, modifier, modifierGlue }) {
    let matches = [];

    matches.push(...[...element.classList].filter(className => {
        return className.indexOf(namespace || getModuleNamespace(element)) === 0
    }).map(target => target.split(modifierGlue).slice(1))[0]);

    return matches.includes(modifier);
}