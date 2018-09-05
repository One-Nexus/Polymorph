import getModuleNamespace from './getModuleNamespace';

export default function hasModifier({ element, modifier, modifierGlue, componentGlue, namespace }) {
    return [...element.classList].some(className => {
        const matchIndex = className.indexOf(modifierGlue + modifier);
        const namespaceMatch  = className.indexOf(namespace || getModuleNamespace(element, modifierGlue, componentGlue)) === 0;
        const isModifierTest1 = className.indexOf(modifierGlue + modifier + modifierGlue) > -1;
        const isModifierTest2 = matchIndex > -1 && matchIndex === (className.length - modifier.length - 1);

        return namespaceMatch && (isModifierTest1 || isModifierTest2);
    });
}