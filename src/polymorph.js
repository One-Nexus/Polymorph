import hasModifier from './utilities/hasModifier';
import getComponents from './utilities/getComponents';
import getModuleNamespace from './utilities/getModuleNamespace';

/**
 * Set a module's styles on a DOM element instance
 * 
 * @param {*} element 
 * @param {*} styles 
 * @param {*} globals 
 * @param {*} config 
 * @param {*} parentElement 
 */
export default function polymorph(element, styles, config, globals, parentElement) {
    // attach repaint methods to parent element
    if (!parentElement && !element.repaint) {
        element.repaint = () => {
            element.style.cssText = null;

            polymorph(element, styles, config, globals, globals);

            element.dispatchEvent(new Event('moduledidrepaint'));
        };
    }

    if (styles.constructor === Array) {
        return styles.forEach(stylesheet => polymorph(element, stylesheet, config, globals, parentElement));
    }

    const values = (typeof styles === 'object') ? styles : styles(element, config, globals);

    if (values.constructor === Array) {
        if (values.every(value => value.constructor == Object)) {
            values.forEach(value => polymorph(element, value, false, globals));
        }
    }

    // initialise data interface
    element.data = element.data || { states: [] };

    // determine parent element
    parentElement = parentElement || element;

    for (let [key, value] of Object.entries(values)) {
        const subComponent = [...element.querySelectorAll(`[class*="_${key}"]`)].filter(subComponent => {
            return [...subComponent.classList].some(className => {
                return className.indexOf(getModuleNamespace(parentElement)) === 0
            });
        });

        if (typeof value === 'function' || typeof value === 'object') {
            if (key.indexOf('modifier(') > -1) {
                const modifier = key.replace('modifier(', '').replace(/\)/g, '');

                if (hasModifier({ element, modifier, modifierGlue: '-' })) {
                    polymorph(element, value, false, globals, parentElement);
                }
            }

            else if (key === 'group' || key === 'wrapper') {
                // @TODO this currently runs for each item in the group/wrapper,
                // should ideally run just once per group/wrapper
                element.parentNode.classList.forEach(className => {
                    if (className.indexOf('group') === 0 || className.indexOf('wrapper') === 0) {
                        // apply styles to wrapper/group element
                        polymorph(element.parentNode, (typeof value === 'object') ? value : value(element.parentNode), false, globals, parentElement);
                        // apply styles to child modules
                        polymorph(element, (typeof value === 'object') ? value : value(element)[element.getAttribute('data-module')], false, globals, parentElement);
                    }
                });

                return;
            }

            // if target element contains child components matching `key`
            // @TODO be more transparent, don't depend upon the below logic
            // being indictative of the desired condition
            else if (getComponents({ element, componentName: key, componentGlue: '_' }).length) {
                getComponents({ element, componentName: key, componentGlue: '_' }).forEach(_component => {
                    if (typeof value === 'object') {
                        polymorph(_component, value, false, globals, parentElement);
                    } 
                    else if (typeof value === 'function') {
                        // @TODO getParameterNames(value), pass to `value(...)`
                        polymorph(_component, value(_component), false, globals, parentElement);
                    }                  
                });
            }

            else if (subComponent.length) {
                [...subComponent].forEach(query => polymorph(query, value, false, globals, parentElement));
            }

            else if (key === ':hover') {
                const hoverState = JSON.stringify(value);

                if (!element.data.states.includes(hoverState)) {
                    element.data.states.push(hoverState);

                    element.addEventListener('mouseenter', function mouseEnter() {
                        polymorph(element, value, false, globals, parentElement);

                        element.removeEventListener('mouseenter', mouseEnter);
                    }, false);

                    element.addEventListener('mouseleave', function mouseLeave() {
                        element.removeEventListener('mouseleave', mouseLeave);

                        element.data.states = element.data.states.filter(item => item !== hoverState);

                        parentElement.repaint();
                    }, false);
                }
            }

            else if (value instanceof Array) {
                if (value[0] instanceof HTMLElement) {
                    polymorph(value[0], value[1], false, globals, parentElement);
                }
            }

            else if (typeof value === 'function') {
                element.style[key] = value(element.style[key]);
            }

            else {

            }
        }

        else {
            element.style[key] = value;
        }
    }

    if (element === parentElement && config !== false) {
        element.dispatchEvent(new Event('stylesdidmount'));
    }
}

polymorph.modifier = hasModifier;