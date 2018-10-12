import hasModifier from './utilities/hasModifier';
// import getComponents from './utilities/getComponents';
import getModuleNamespace from './utilities/getModuleNamespace';

function getComponents() {
    return false;
}

/**
 * Set a module's styles on a DOM element instance
 * 
 * @param {*} element 
 * @param {*} styles 
 * @param {*} globals 
 * @param {*} config 
 * @param {*} parentElement 
 */
export default function polymorph(element, styles, config, globals, parentElement, context) {
    // attach repaint methods to parent element
    if (!parentElement && !element.repaint) {
        element.repaint = custom => {
            const options = Object.assign({
                clean: false
            }, custom);

            if (options.clean) {
                element.style.cssText = null;
                element.getComponents().forEach(k => k.style.cssText = null);
            }

            element.data.properties = {};

            element.getComponents().forEach(component => component.data = null);

            polymorph(element, styles, config, globals);

            element.dispatchEvent(new Event('moduledidrepaint'));
        };
    }

    if (styles.constructor === Array) {
        return styles.forEach(stylesheet => polymorph(element, stylesheet, config, globals, parentElement, context));
    }

    const values = (typeof styles === 'object') ? styles : styles(element, config, globals);

    if (values.constructor === Array) {
        if (values.every(value => value.constructor == Object)) {
            values.forEach(value => polymorph(element, value, false, globals));
        }
    }

    // initialise data interface
    element.data = element.data || { states: [], properties: {} };

    // determine parent element
    parentElement = parentElement || element;

    const componentGlue = (config && config.componentGlue) || (window.Synergy && Synergy.componentGlue) || '_';
    const modifierGlue = (config && config.modifierGlue) || (window.Synergy && Synergy.modifierGlue) || '-';

    for (let [key, value] of Object.entries(values)) {
        // @TODO get components/subcomponents properly
        const subComponent = [...element.querySelectorAll(`[class*="${componentGlue + key}"]`)].filter(sub => {
            return [...sub.classList].some(className => {
                return className.indexOf(getModuleNamespace(parentElement, componentGlue, modifierGlue)) === 0
            });
        });

        if (typeof value === 'function' || typeof value === 'object') {
            if (key.indexOf('modifier(') > -1) {
                const modifier = key.replace('modifier(', '').replace(/\)/g, '');

                if (hasModifier({ element, modifier, modifierGlue, componentGlue })) {
                    polymorph(element, value, false, globals, parentElement, modifier);
                }
            }

            else if (key === 'group' || key === 'wrapper') {
                // @TODO this currently runs for each item in the group/wrapper,
                // should ideally run just once per group/wrapper
                element.parentNode.classList.forEach(className => {
                    if (className.indexOf('group') === 0 || className.indexOf('wrapper') === 0) {
                        // apply styles to wrapper/group element
                        polymorph(
                            element.parentNode, 
                            (typeof value === 'object') ? value : value(element.parentNode), 
                            false, 
                            globals, 
                            parentElement
                        );

                        // apply styles to child modules
                        polymorph(
                            element, 
                            (typeof value === 'object') ? value : value(element), 
                            false, 
                            globals, 
                            parentElement
                        );
                    }
                });

                return;
            }

            // if target element contains child components matching `key`
            // @TODO this doesn't seem to find components, rather the below
            // subComponents condition does
            else if (getComponents({ element, componentName: key, componentGlue }).length) {
                getComponents({ element, componentName: key, componentGlue, parentElement }).forEach(_component => {
                    if (typeof value === 'object') {
                        polymorph(_component, value, false, globals, parentElement);
                    } 
                    else if (typeof value === 'function') {
                        polymorph(_component, value(_component), false, globals, parentElement);
                    }                  
                });
            }

            // @TODO this seems to find regular components, not just subComponents
            else if (subComponent.length) {
                [...subComponent].forEach(query => {
                    // @TODO this condition will need to be duplicated for regular
                    // components when you fix them
                    if (query.closest(`[data-module=${getModuleNamespace(parentElement, componentGlue, modifierGlue)}]`) === parentElement) {
                        polymorph(query, value, false, globals, parentElement);
                    }
                });
            }

            else if (key === ':hover') {
                const isHoverState = parentElement.data.states.some(state => {
                    return state.type === 'mouseenter' && state.element === element;
                });

                if (!isHoverState) {
                    parentElement.data.states.push({ type: 'mouseenter', element });

                    element.addEventListener('mouseenter', function mouseEnter() {
                        element.removeEventListener('mouseenter', mouseEnter);

                        polymorph(element, value, false, globals, parentElement);
                    }, false);

                    element.addEventListener('mouseleave', function mouseLeave() {
                        element.removeEventListener('mouseleave', mouseLeave);

                        parentElement.data.states = parentElement.data.states.filter(state => {
                            return !(state.type === 'mouseenter' && state.element === element);
                        });

                        parentElement.repaint();
                    }, false);
                }
            }

            else if (value instanceof Array) {
                if (value[0] instanceof HTMLElement) {
                    polymorph(value[0], value[1], false, globals, parentElement, context);
                }
            }

            else if (typeof value === 'function') {
                if (!element.data.properties[key] || (element.data.properties[key].context === context)) {
                    element.style[key] = value(element.style[key]);
                    element.data.properties[key] = { value: value(element.style[key]), context };
                }
            }

            else {
                // @TODO handle condition (what is it?)
            }
        }

        else {
            if (element.classList.contains('dot')) {
                // console.log(element, element.data, key, value, context);
            }

            if (!element.data.properties[key] || !element.data.properties[key].context || (element.data.properties[key].context === context)) {
                element.style[key] = value;
                element.data.properties[key] = { value, context };
            }
        }
    }

    if (element === parentElement && config !== false) {
        element.dispatchEvent(new Event('stylesdidmount'));
    }
}

polymorph.modifier = hasModifier;