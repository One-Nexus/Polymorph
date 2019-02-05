import isValidCssProperty from './utilities/isValidCssProperty';
import stringifyState from './utilities/stringifyState';

var sQuery = (typeof window !== 'undefined') && window.sQuery;

// `process` and `require` are exploited to help reduce bundle size
if (!sQuery || (typeof process !== 'undefined' && !process.env.SYNERGY)) {
    sQuery = {
        getComponents: require('../../../sQuery/sQuery/src/api/getComponents').default,
        getSubComponents: require('../../../sQuery/sQuery/src/api/getSubComponents').default,
        hasModifier: require('../../../sQuery/sQuery/src/api/hasModifier').default,
        parent: require('../../../sQuery/sQuery/src/api/parent').default
    }
}

export default function polymorph(element, styles, config = {}, globals, context) {
    var Synergy = window.Synergy || {};

    const modifierGlue  = config.modifierGlue  || Synergy.modifierGlue  || '-';
    const componentGlue = config.componentGlue || Synergy.componentGlue || '_';

    /**
     * Handle case where desired element for styles to be applied needs to be
     * manually controlled
     */
    if (styles instanceof Array) {
        if (styles[0] instanceof HTMLElement) {
            return polymorph(styles[0], styles[1], config, globals, context);
        }

        if (styles[0] instanceof NodeList) {
            return styles[0].forEach(node => polymorph(node, styles[1], config, globals, context));
        }
    }

    let STYLESHEETS = styles;

    if (typeof styles === 'function') {
        STYLESHEETS = styles(element, config, globals);
    }

    element.repaint = element.repaint || [];

    /**
     * Handle array of stylesheets
     */
    if (STYLESHEETS.constructor === Array) {
        if (STYLESHEETS.every(value => value.constructor == Object)) {
            return STYLESHEETS.forEach(value => polymorph(element, value, config, globals, context));
        }
    }

    const STATE = stringifyState(STYLESHEETS);

    if (!context && !element.repaint.some(state => stringifyState(state) === STATE)) {
        if (!context) {
            element.repaint.push(STYLESHEETS);
        }
    }

    Object.entries(STYLESHEETS).forEach(entry => {
        const [key, value] = [entry[0], entry[1]];

        let COMPONENTS = sQuery.getComponents.bind({ 
            DOMNodes: element, componentGlue, modifierGlue 
        })(key);

        let SUB_COMPONENTS = sQuery.getSubComponents.bind({ 
            DOMNodes: element, componentGlue, modifierGlue
        })(key);

        /**
         * Smart handle `components`
         */
        if (COMPONENTS.length) {
            return COMPONENTS.forEach(COMPONENT => polymorph(COMPONENT, value, config, globals, context));
        }

        /**
         * Smart handle `sub-components`
         */
        if (SUB_COMPONENTS.length) {
            if (value.disableCascade) {
                SUB_COMPONENTS = SUB_COMPONENTS.filter(subComponent => {
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

            return SUB_COMPONENTS.forEach(SUB_COMPONENT => polymorph(SUB_COMPONENT, value, config, globals, context));
        }

        /**
         * Handle `hover` interaction
         */
        if (!context && key === ':hover') {
            element.addEventListener('mouseover', function mouseover() {
                console.log(element, value);
                polymorph(element, value, config, globals, 'mouseover');
            }, false);

            element.addEventListener('mouseout', function mouseout() {
                console.log(element.repaint);
                element.repaint.forEach(STYLESHEET => {
                    polymorph(element, STYLESHEET, config, globals, 'mouseout');
                })
            }, false);
        }
    
        /**
         * Handle `modifiers`
         */
        if (key.indexOf('modifier(') > -1) {
            const modifier = key.replace('modifier(', '').replace(/\)/g, '');

            if (sQuery.hasModifier.bind({ DOMNodes: element, componentGlue, modifierGlue })(modifier)) {
                polymorph(element, value, config, globals, context);
            }

            return;
        }

        element.style[key] = value;
    });
}

/**
 * Set a module's styles on a DOM element instance
 */
function _polymorph(element, styles = {}, config = {}, globals, parentElement, specificity = 0) {
    var Synergy = window.Synergy || {};

    const modifierGlue  = config.modifierGlue  || Synergy.modifierGlue  || '-';
    const componentGlue = config.componentGlue || Synergy.componentGlue || '_';

    const values = (typeof styles === 'object') ? styles : styles(element, config, globals);

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
    var Synergy = window.Synergy || {};

    modifierGlue  = modifierGlue  || Synergy.modifierGlue  || '-';
    componentGlue = componentGlue || Synergy.componentGlue || '_';

    return sQuery.hasModifier.bind({ 
        DOMNodes: element,
        modifierGlue,
        componentGlue
    })(modifier);
}

/**
 * Attach to Window
 */
if (typeof window !== 'undefined') {
    window.polymorph = polymorph;
}