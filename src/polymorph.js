import isValidCssProperty from './utilities/isValidCssProperty';
import handleState from './utilities/handleState';
import { getComponents, getSubComponents, hasModifier } from '../../sQuery/src/api';

/**
 * Set a module's styles on a DOM element instance
 * 
 * @param {*} element 
 * @param {*} styles 
 * @param {*} config 
 * @param {*} globals 
 * @param {*} parentElement 
 * @param {*} context 
 */
export default function polymorph(element, styles, config, globals, parentElement, context) {
    const values = (typeof styles === 'object') ? styles : styles(element, config, globals);
    const componentGlue = (config && config.componentGlue) || (window.Synergy && Synergy.componentGlue) || '_';
    const modifierGlue  = (config && config.modifierGlue)  || (window.Synergy && Synergy.modifierGlue)  || '-';

    /**
     * Setup `repaint` method on parent element
     */
    if (!parentElement && !element.repaint) {
        element.repaint = custom => {
            /**
             * Merge default + custom options
             */
            const options = Object.assign({
                clean: false
            }, custom);

            /**
             * Get child components
             */
            const components = getComponents.bind({ 
                DOMNodes: element, 
                componentGlue, 
                modifierGlue, 
                parentElement: element 
            })();

            /**
             * Remove styles that were not added by polymorph
             */
            if (options.clean) {
                element.style.cssText = null;
                components.forEach(component => component.style.cssText = null);
            }

            /**
             * Clean parent element/module
             */
            element.data && Object.keys(element.data.properties).forEach(property => {
                element.style[property] = null
            });

            element.data.properties = {};

            /**
             * Clean child components
             */
            components.forEach(component => {
                component.data && Object.keys(component.data.properties).forEach(property => {
                    component.style[property] = null
                });

                component.data = null;
            });

            /**
             * Repaint the module
             */
            polymorph(element, styles, config, globals);

            element.dispatchEvent(new Event('moduledidrepaint'));
        };
    }

    /**
     * Handle array of top-level rule sets/stylesheets
     */
    if (styles.constructor === Array) {
        return styles.forEach(stylesheet => polymorph(element, stylesheet, config, globals, parentElement, context));
    }

    /**
     * Handle array of object values for cascading effect
     */
    if (values.constructor === Array) {
        if (values.every(value => value.constructor == Object)) {
            values.forEach(value => polymorph(element, value, false, globals));
        }
    }

    /**
     * Initialise data interface
     */
    element.data = element.data || { states: [], properties: {} };

    /**
     * Determine the parent element/module
     */
    parentElement = parentElement || element;

    /**
     * Loop through rule set
     */
    for (let [key, value] of Object.entries(values)) {
        const matchedComponents = getComponents.bind({ DOMNodes: element, componentGlue, modifierGlue, parentElement })(key);
        const matchedSubComponents = []; // @TODO

        /**
         * Handle object of CSS properties / function that will return an object
         * of CSS properties
         */
        if (typeof value === 'function' || typeof value === 'object') {
            /**
             * Handle `modifiers`
             */
            if (key.indexOf('modifier(') > -1) {
                const modifier = key.replace('modifier(', '').replace(/\)/g, '');

                if (hasModifier.bind({ DOMNodes: element, componentGlue, modifierGlue })(modifier)) {
                    polymorph(element, value, false, globals, parentElement, modifier);
                }
            }

            /**
             * Handle `components`
             */
            else if (matchedComponents.length) {
                matchedComponents.forEach(_component => {
                    if (typeof value === 'object') {
                        polymorph(_component, value, false, globals, parentElement);
                    } 
                    else if (typeof value === 'function') {
                        polymorph(_component, value(_component), false, globals, parentElement);
                    }                  
                });
            }

            /**
             * Handle module `group` and `wrapper`
             */
            else if (key === 'group' || key === 'wrapper') {
                // @TODO this currently runs for each item in the group/wrapper,
                // should ideally run just once per group/wrapper
                element.parentNode.classList.forEach(className => {
                    if (className.indexOf('group') === 0 || className.indexOf('wrapper') === 0) {
                        const wrapperValues = (typeof value === 'object') ? value : value(element.parentNode);
                        const childValues   = (typeof value === 'object') ? value : value(element);

                        // apply styles to wrapper/group element
                        polymorph(element.parentNode, wrapperValues, false, globals, parentElement);

                        // apply styles to child modules
                        polymorph(element, childValues, false, globals, parentElement);
                    }
                });

                return;
            }

            /**
             * Handle `sub-components`
             */
            else if (matchedSubComponents.length) {
                // @TODO
            }

            /**
             * Handle `hover` interaction
             */
            else if (key === ':hover') {
                handleState(parentElement, element, ['mouseenter', 'mouseleave'], value, globals);
            }

            /**
             * Handle `focus` interaction
             */
            else if (key === ':focus') {
                handleState(parentElement, element, ['focus', 'blur'], value, globals);
            }

            /**
             * Handle case where desired element for styles to be applied needs to be
             * manually controlled
             */
            else if (value instanceof Array) {
                if (value[0] instanceof HTMLElement) {
                    polymorph(value[0], value[1], false, globals, parentElement, context);
                }
            }

            /**
             * Handle case where CSS `value` to be applied to `element` is a function
             */
            else if (typeof value === 'function') {
                if (!element.data.properties[key] || (element.data.properties[key].context === context)) {
                    if (isValidCssProperty(key)) {
                        element.style[key] = value(element.style[key]);
                        element.data.properties[key] = { value: value(element.style[key]), context };
                    }
                }
                else {
                    // @TODO handle condition (what is it?)
                }
            }

            else {
                // @TODO handle condition (what is it?)
            }
        }

        /**
         * Handle CSS property
         */
        else {
            const props = element.data.properties;

            if (!props[key] || !props[key].context || (props[key].context === context)) {
                element.style[key] = value;

                props[key] = { value, context };
            }
        }
    }

    /**
     * Dispatch initial event when styles first mount
     */
    if (element === parentElement && config !== false) {
        element.dispatchEvent(new Event('stylesdidmount'));
    }
}

// @TODO since switching to sQuery hasModifer, this will need slight tweak
// polymorph.modifier = hasModifier;