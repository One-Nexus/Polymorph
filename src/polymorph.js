// `process` and `require` are exploited to help reduce bundle size
if (typeof process === 'undefined') window.process = { env: {} };

let sQuery;

export default function polymorph(element, styles, config = {}, globals) {
    var Synergy = window.Synergy || {};

    sQuery = window.sQuery
    
    if (!process.env.SYNERGY && !sQuery) {
        sQuery = {
            getComponents: require('@onenexus/squery/src/api/getComponents').default,
            getSubComponents: require('@onenexus/squery/src/api/getSubComponents').default,
            hasModifier: require('@onenexus/squery/src/api/hasModifier').default,
            parent: require('@onenexus/squery/src/api/parent').default
        }
    }

    const modifierGlue  = config.modifierGlue  || Synergy.modifierGlue  || '-';
    const componentGlue = config.componentGlue || Synergy.componentGlue || '_';

    const { state, context } = element;

    const CONFIG = { componentGlue, modifierGlue };

    let STYLESHEET = styles;

    if (typeof styles === 'function') {
        if (state || context) {
            STYLESHEET = styles({ state, context, element }, config, globals);
        } else {
            STYLESHEET = styles(element, config, globals);
        }
    }

    if (styles.constructor === Array) {
        STYLESHEET = styles.map(style => {
            if (typeof style === 'function') {
                if (state || context) {
                    return style({ state, context, element }, config, globals);
                } else {
                    return style(element, config, globals);
                }
            } else {
                return style;
            }
        });
    }

    if (STYLESHEET.constructor === Array) {
        if (STYLESHEET.every(value => value && value.constructor === Object)) {
            STYLESHEET.forEach(value => handleStyleSheet(element, value, CONFIG));
        }
    } else {
        handleStyleSheet(element, STYLESHEET, CONFIG);
    }

    element.repaint();
}

/**
 * 
 */
function handleStyleSheet(element, stylesheet, config, context = []) {
    if (!element.polymorph) {
        const WRAPPER_ELEMENT = [].slice.call(element.parentNode.classList).some(className => {
            return (className.indexOf('group') === 0 || className.indexOf('wrapper') === 0);
        }) && element.parentNode;

        element.polymorph = {
            rules: [],
            COMPONENTS: sQuery.getComponents.bind({...config})(element),
            SUB_COMPONENTS: sQuery.getSubComponents.bind({...config})(element)
        }

        const { COMPONENTS, SUB_COMPONENTS } = element.polymorph;

        element.repaint = function(disableDependentElements) {
            let allDependentElements = [];

            if (WRAPPER_ELEMENT && WRAPPER_ELEMENT.repaint) {
                WRAPPER_ELEMENT.repaint(true)
            }

            [element, ...COMPONENTS, ...SUB_COMPONENTS].forEach(el => {    
                if (el.polymorph) {
                    el.polymorph.rules.forEach(rule => {
                        if (rule.context.every(ruleContext => {
                            if (typeof ruleContext === 'function') {
                                return ruleContext();
                            }

                            if (ruleContext.value === 'hover') {
                                return ruleContext.source.polymorph.isHovered;
                            }

                            if (ruleContext.value === 'focus') {
                                return ruleContext.source.polymorph.isFocused;
                            }

                            return sQuery.hasModifier.bind({...config})(ruleContext.source, ruleContext.value)
                        })) {
                            // `doStyles()` applies the styles and returns dependent elements
                            const dependentElements = doStyles(el, rule.styles) || [];

                            dependentElements.length && allDependentElements.push(...dependentElements);
                        }
                    });

                    if (allDependentElements.includes(el)) {
                        allDependentElements.filter(item => item !== el)
                    }
                }
            });

            if (!disableDependentElements && allDependentElements.length) {
                allDependentElements = allDependentElements.filter((item, pos) => {
                    return allDependentElements.indexOf(item) == pos;
                });

                allDependentElements.forEach(el => el.repaint && el.repaint(true));
            }
        };
    }

    element.polymorph.rules = element.polymorph.rules.concat({
        context: context,
        styles: stylesheet
    });

    if (typeof stylesheet === 'function') {
        if (element.state || element.context) {
            stylesheet = stylesheet({ state: element.state, context: element.context, element });
        } else {
            stylesheet = stylesheet(element);
        }
    }

    if (!stylesheet) return;

    Object.entries(stylesheet).forEach(([key, value]) => {
        let COMPONENTS = sQuery.getComponents.bind({...config})(element, key);
        let SUB_COMPONENTS = sQuery.getSubComponents.bind({...config})(element, key);

        if (value.styles) {
            if (value.condition) {
                context = context.concat(value.condition);
            }

            if (value.element) {
                element = value.element;
            }

            return handleStyleSheet(element, value.styles, config, context);
        }

        if (value instanceof Array) {
            if (typeof value[0] === 'undefined') {
                return;
            }

            if (value.every(val => val && typeof val === 'object' && val.constructor === Object)) {
                return value.forEach(val => handleStyleSheet(element, val, config, context));
            }

            //Handle case where desired element for styles to be applied is manually controlled
            if (value[0] instanceof HTMLElement) {
                return handleStyleSheet(value[0], value[1], config, context);
            }

            //Handle case where desired element for styles to be applied is manually controlled
            if (value[0] instanceof NodeList) {
                value[0].forEach(el => {
                    return handleStyleSheet(el, value[1], config, context);
                });
            }

            //Handle case condition to apply styles is to be manually controlled
            if (typeof value[0] === 'function') {
                return handleStyleSheet(element, value[1], config, context.concat(value[0]));
            }

            return;
        }

        // Smart handle `components`
        if (COMPONENTS.length) {
            if (value.disableCascade) {
                COMPONENTS = COMPONENTS.filter(component => {
                    return COMPONENTS.every(_component => component.contains(_component));
                });
            }

            return COMPONENTS.forEach(component => {
                return handleStyleSheet(component, value, config, context);
            });
        }

        // Smart handle `sub-components`
        if (SUB_COMPONENTS.length) {
            if (value.disableCascade) {
                SUB_COMPONENTS = SUB_COMPONENTS.filter(subComponent => {
                    const componentName = [...element.classList].reduce(($, currentValue) => {
                        if (currentValue.indexOf(config.componentGlue) > 1) {
                            const glueLength = config.componentGlue.length;
                            const nameStart = currentValue.lastIndexOf(config.componentGlue) + glueLength;

                            currentValue = currentValue.substring(nameStart, currentValue.length);

                            return currentValue.substring(0, currentValue.indexOf(config.modifierGlue));
                        }
                    }, []);

                    const parentSubComponent = sQuery.parent.bind({...config})(subComponent, componentName);

                    return element === parentSubComponent;
                });
            }

            return SUB_COMPONENTS.forEach(component => {
                return handleStyleSheet(component, value, config, context);
            });
        }

        // Handle `sub-components`
        if (key.indexOf('sub-component(') > -1) {
            const subComponent = key.replace('sub-component(', '').replace(/\)/g, '');
            const subComponents = sQuery.getSubComponents.bind({...config})(element, subComponent);

            return subComponents.forEach(component => {
                return handleStyleSheet(component, value, config, context);
            });
        }

        // Handle `components`
        if (key.indexOf('component(') > -1) {
            const component = key.replace('component(', '').replace(/\)/g, '');
            const components = sQuery.getComponents.bind({...config})(element, component);

            return components.forEach(component => {
                return handleStyleSheet(component, value, config, context);
            });
        }
    
        // Handle `modifiers`
        if (key.indexOf('modifier(') > -1) {
            const modifier = key.replace('modifier(', '').replace(/\)/g, '');

            return handleStyleSheet(element, value, config, context.concat({
                source: element,
                value: modifier
            }));
        }

        // Handle `hover` interaction
        if (key === ':hover') {
            handleStyleSheet(element, value, config, context.concat({
                source: element,
                value: 'hover'
            }));

            element.addEventListener('mouseenter', event => {
                element.polymorph.isHovered = true;

                element.repaint();
            });

            element.addEventListener('mouseleave', event => {
                element.polymorph.isHovered = false;

                element.repaint();
            });

            return;
        }

        // Handle `focus` interaction
        if (key === ':focus') {
            handleStyleSheet(element, value, config, context.concat({
                source: element,
                value: 'focus'
            }));

            element.addEventListener('focus', event => {
                element.polymorph.isFocused = true;

                element.repaint();
            });

            element.addEventListener('blur', event => {
                element.polymorph.isFocused = false;

                element.repaint();
            });

            return;
        }

        // Handle Group/Wrapper elements
        if (key === 'group' || key === 'wrapper') {
            const wrapper = element.parentNode;

            return wrapper.classList.forEach(className => {
                if (className.indexOf('group') === 0 || className.indexOf('wrapper') === 0) {
                    handleStyleSheet(wrapper, value, config, context);
                }
            });
        }
    });

    element.polymorph.rules.sort((a, b) => {
        if (!a.context.length && !b.context.length) {
            return 0;
        }
        if (a.context.length && !b.context.length) {
            return 1;
        }
        if (!a.context.length && b.context.length) {
            return -1;
        }
        if (a.context.some(c => c.value === 'hover') && b.context.some(c => c.value === 'hover')) {
            return 0;
        }
        if (b.context.some(c => c.value === 'hover')) {
            return -1;
        }
        return 0;
    });
}

/**
 * 
 */
function doStyles(element, styles) {
    if (typeof styles === 'function') {
        const { state, context } = element;

        if (state || context) {
            styles = styles({ state, context, element });
        } else {
            styles = styles(element);
        }
    }

    if (!styles) return;

    Object.entries(styles).forEach(([key, value]) => {
        if (typeof value === 'function') {
            try {
                return element.style[key] = value(element.style[key]);
            } catch(error) {
                return error;
            }
        }

        // https://stackoverflow.com/questions/55867116
        if (!isNaN(key)) {
            return;
        }

        return element.style[key] = value;
    });

    const dependentElements = Object.values(styles).reduce((accumulator, currentValue) => {
        if (currentValue instanceof Array && currentValue[0]) {
            if (currentValue[0] instanceof NodeList || currentValue[0] instanceof Array) {
                return accumulator.concat(...currentValue[0]);
            }

            return accumulator.concat(currentValue[0]);
        }

        return accumulator;
    }, []);

    return dependentElements;
}

/**
 * Attach to Window
 */
if (typeof window !== 'undefined') {
    window.polymorph = polymorph;
}