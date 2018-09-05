import getModuleNamespace from './getModuleNamespace';

export default function hasModifier({ element, modifier, modifierGlue, componentGlue, namespace }) {
    return [...element.classList].some(className => {
        const namespaceMatch  = className.indexOf(namespace || getModuleNamespace(element, modifierGlue, componentGlue)) === 0;
        const isModifierTest1 = className.indexOf(modifierGlue + modifier + modifierGlue) > -1;
        const isModifierTest2 = className.indexOf(modifierGlue + modifier) === (className.length - modifier.length - 1);

        return namespaceMatch && (isModifierTest1 || isModifierTest2);
    });
}