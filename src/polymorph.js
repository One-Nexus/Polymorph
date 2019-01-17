import isValidCssProperty from './utilities/isValidCssProperty';
import stringifyState from './utilities/stringifyState';

let sQuery = typeof window !== 'undefined' && window.sQuery;

if (!sQuery || (typeof process !== 'undefined' && !process.env.SYNERGY)) {
    sQuery = {
        getComponents: require('../../../sQuery/sQuery/src/api/getComponents').default,
        getSubComponents: require('../../../sQuery/sQuery/src/api/getSubComponents').default,
        hasModifier: require('../../../sQuery/sQuery/src/api/hasModifier').default,
        parent: require('../../../sQuery/sQuery/src/api/parent').default
    }
}

/**
 * Set a module's styles on a DOM element instance
 */
export default function polymorph(element, styles = {}, config, globals, parentElement, specificity = 0) {
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
            const components = sQuery.getComponents.bind({ 
                DOMNodes: element, 
                componentGlue, 
                modifierGlue, 
                parentElement: element 
            })();

            /**
             * Get child sub-components
             */
            const subComponents = sQuery.getSubComponents.bind({ 
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
                element.style[property] = null;
            });

            element.data.properties = {};

            /**
             * Clean child components
             */
            components.forEach(component => {
                component.data && Object.keys(component.data.properties).forEach(property => {
                    component.style[property] = null;
                });

                component.data = null;
            });

            /**
             * Clean child sub-components
             */
            subComponents.forEach(component => {
                component.data && Object.keys(component.data.properties).forEach(property => {
                    component.style[property] = null;
                });

                component.data = null;
            });

            /**
             * Repaint the module
             */
            polymorph(element, styles, config, globals);

            if (element.repaint.states.length) {
                element.repaint.states.forEach(style => style());
            }

            element.dispatchEvent(new Event('moduledidrepaint'));
        };

        element.repaint.states = [];
    }

    /**
     * Handle array of top-level rule sets/stylesheets
     */
    if (styles.constructor === Array) {
        return styles.forEach(stylesheet => polymorph(element, stylesheet, config, globals, parentElement, specificity));
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
        const matchedComponents = sQuery.getComponents.bind({ DOMNodes: element, componentGlue, modifierGlue, parentElement })(key);
        const matchedSubComponents = sQuery.getSubComponents.bind({ DOMNodes: element, componentGlue, modifierGlue, parentElement })(key);

        /**
         * Handle object of CSS properties / function that will return an object
         * of CSS properties
         */
        if (typeof value === 'function' || typeof value === 'object') {
            /**
             * Handle case where desired element for styles to be applied needs to be
             * manually controlled
             */
            if (value instanceof Array) {
                if (value[0] instanceof HTMLElement) {
                    polymorph(value[0], value[1], false, globals, parentElement, specificity);
                }

                if (value[0] instanceof NodeList) {
                    value[0].forEach(node => polymorph(node, value[1], false, globals, parentElement, specificity))
                }
            }
    
            /**
             * Handle `modifiers`
             */
            else if (key.indexOf('modifier(') > -1) {
                const modifier = key.replace('modifier(', '').replace(/\)/g, '');

                if (sQuery.hasModifier.bind({ DOMNodes: element, componentGlue, modifierGlue })(modifier)) {
                    specificity++;

                    polymorph(element, value, false, globals, parentElement, specificity);
                }
            }

            /**
             * Smart handle `components`
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
             * Handle `sub-components`
             */
            else if (key.indexOf('subComponent(') > -1) {
                const subComponent = key.replace('subComponent(', '').replace(/\)/g, '');
                const subComponents = sQuery.getSubComponents.bind({ DOMNodes: element, componentGlue, modifierGlue, parentElement })(subComponent);

                if (subComponents.length) {
                    subComponents.forEach(_component => {
                        if (typeof value === 'object') {
                            polymorph(_component, value, false, globals, parentElement);
                        } 
                        else if (typeof value === 'function') {
                            polymorph(_component, value(_component), false, globals, parentElement);
                        }  
                    });
                }

                return;
            }

            /**
             * Smart handle `sub-components`
             */
            else if (matchedSubComponents.length) {
                if (value.disableCascade) {
                    matchedSubComponents = matchedSubComponents.filter(subComponent => {
                        if (!element.getAttribute('data-component')) {
                            console.warn(`${element} does not have data-component attribute so disableCascade option in ${value} may not reliably work`);
                        }

                        const componentName = element.getAttribute('data-component') || [...element.classList].reduce((accumulator, currentValue) => {
                            if (currentValue.indexOf(componentGlue) > 1) {
                                currentValue = currentValue.substring(currentValue.lastIndexOf(componentGlue) + 1, currentValue.length);

                                return currentValue.substring(0, currentValue.indexOf(modifierGlue));
                            }
                        }, []);

                        const parentSubComponent = sQuery.parent.bind({ 
                            DOMNodes: subComponent,
                            modifierGlue: modifierGlue,
                            componentGlue: componentGlue
                        })(componentName);

                        return element === parentSubComponent;
                    });
                }

                matchedSubComponents.forEach(_component => {
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
             * Handle `hover` interaction
             */
            else if (key === ':hover') {
                const stringifiedState = stringifyState(values);

                const isHoverState = parentElement.data.states.some(state => {
                    return state.type === 'mouseover' && state.element === element && state.value === stringifiedState;
                });

                if (!isHoverState) {
                    parentElement.data.states.push({ 
                        type: 'mouseover', 
                        element: element, 
                        value: stringifiedState 
                    });

                    element.addEventListener('mouseover', function mouseover() {
                        element.removeEventListener('mouseover', mouseover);

                        parentElement.repaint.states.push(() => polymorph(element, value, false, globals, parentElement));

                        polymorph(element, value, false, globals, parentElement);
                    }, false);

                    element.addEventListener('mouseout', function mouseout() {
                        element.removeEventListener('mouseout', mouseout);

                        parentElement.data.states = parentElement.data.states.filter(state => {
                            return !(state.type === 'mouseover' && state.element === element && state.value === stringifiedState);
                        });

                        parentElement.repaint.states = [];

                        parentElement.repaint();
                    }, false);
                }
            }

            /**
             * Handle `focus` interaction
             */
            else if (key === ':focus') {
                // handleState(parentElement, element, ['focus', 'blur'], value, globals);

                const isFocusState = parentElement.data.states.some(state => {
                    return state.type === 'focus' && state.element === element;
                });

                if (!isFocusState) {
                    parentElement.data.states.push({ type: 'focus', element });

                    element.addEventListener('focus', function focus() {
                        element.removeEventListener('focus', focus);

                        polymorph(element, value, false, globals, parentElement);
                    }, true);

                    element.addEventListener('blur', function blur() {
                        element.removeEventListener('blur', blur);

                        parentElement.data.states = parentElement.data.states.filter(state => {
                            return !(state.type === 'focus' && state.element === element);
                        });

                        parentElement.repaint();
                    }, true);
                }
            }

            /**
             * Handle `before` pseudo element
             */
            // else if (key === ':before') {
            //     console.log(value);
            // }

            /**
             * Handle case where CSS `value` to be applied to `element` is a function
             */
            else if (typeof value === 'function') {
                if (!element.data.properties[key] || (element.data.properties[key].specificity < specificity)) {
                    if (isValidCssProperty(key)) {
                        element.style[key] = value(element.style[key]);
                        element.data.properties[key] = { value: value(element.style[key]), specificity };
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

            if (!props[key] || !props[key].specificity || (props[key].specificity < specificity)) {
                element.style[key] = value;

                props[key] = { value, specificity };
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

/**
 * Wrapper for sQuery `hasModifier()`
 */
polymorph.modifier = (element, modifier, modifierGlue, componentGlue) => {
    modifierGlue  = modifierGlue  || (window.Synergy && Synergy.modifierGlue)  || '-';
    componentGlue = componentGlue || (window.Synergy && Synergy.componentGlue) || '_';

    return sQuery.hasModifier.bind({ 
        DOMNodes: element,
        modifierGlue: modifierGlue,
        componentGlue: componentGlue
    })(modifier);
}

/**
 * Attach to Window
 */
if (typeof window !== 'undefined') {
    window.polymorph = polymorph;
}