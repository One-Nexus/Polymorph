var sQuery = (typeof window !== 'undefined') && window.sQuery;

// `process` and `require` are exploited to help reduce bundle size
if (!sQuery || (typeof process !== 'undefined' && !process.env.SYNERGY)) {
    sQuery = {
        getComponents: require('../../../sQuery/sQuery/refactor/api/getComponents').default,
        getSubComponents: require('../../../sQuery/sQuery/refactor/api/getSubComponents').default,
        hasModifier: require('../../../sQuery/sQuery/refactor/api/hasModifier').default,
        parent: require('../../../sQuery/sQuery/refactor/api/parent').default
    }
}

export default function polymorph(element, styles, config = {}, globals) {
    var Synergy = window.Synergy || {};

    const modifierGlue  = config.modifierGlue  || Synergy.modifierGlue  || '-';
    const componentGlue = config.componentGlue || Synergy.componentGlue || '_';

    const CONFIG = { componentGlue, modifierGlue };
    const STYLESHEET = (typeof styles === 'function') ? styles(element, config, globals) : styles;

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

            if (WRAPPER_ELEMENT) {
                WRAPPER_ELEMENT.repaint(true)
            }

            [element, ...COMPONENTS, ...SUB_COMPONENTS].forEach(el => {
                if (el.polymorph) {
                    el.polymorph.rules.forEach(rule => {
                        if (rule.context.every(ruleContext => {
                            if (ruleContext.value === 'hover') {
                                return ruleContext.source.polymorph.isHovered;
                            }

                            if (ruleContext.value === 'focus') {
                                return ruleContext.source.polymorph.isFocused;
                            }

                            return sQuery.hasModifier.bind({...config})(ruleContext.source, ruleContext.value)
                        })) {
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
        stylesheet = stylesheet(element);
    }

    if (!stylesheet) return;

    Object.entries(stylesheet).forEach(([key, value]) => {
        let COMPONENTS = sQuery.getComponents.bind({...config})(element, key);
        let SUB_COMPONENTS = sQuery.getSubComponents.bind({...config})(element, key);

        //Handle case where desired element for styles to be applied is manually controlled
        if (value instanceof Array && value[0]) {
            if (value[0] instanceof HTMLElement) {
                handleStyleSheet(value[0], value[1], config, context);
            }

            if (value[0] instanceof NodeList) {
                value[0].forEach(el => {
                    return handleStyleSheet(el, value[1], config, context);
                });
            }

            return;
        }

        // Smart handle `components`
        if (COMPONENTS.length) {
            if (value.disableCascade) {
                COMPONENTS = COMPONENTS.filter(component => {
                    return COMPONENTS.every(_component => {
                        return component.contains(_component);
                    });
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
        if (key.indexOf('subComponent(') > -1) {
            const subComponent = key.replace('subComponent(', '').replace(/\)/g, '');
            const subComponents = sQuery.getSubComponents.bind({...config})(element, subComponent);

            return subComponents.forEach(component => {
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
function doStyles(el, styles) {
    if (typeof styles === 'function') {
        styles = styles(el);
    }

    Object.entries(styles).forEach(([key, value]) => {
        if (typeof value === 'function') {
            try {
                return el.style[key] = value(el.style[key]);
            } catch(error) {
                return;
            }
        }

        return el.style[key] = value;
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
 * Wrapper for sQuery `hasModifier()`
 */
polymorph.modifier = (element, modifier, modifierGlue, componentGlue) => {
    var Synergy = window.Synergy || {};

    modifierGlue  = modifierGlue  || Synergy.modifierGlue  || '-';
    componentGlue = componentGlue || Synergy.componentGlue || '_';

    return sQuery.hasModifier.bind({
        modifierGlue,
        componentGlue
    })(element, modifier);
}

/**
 * Attach to Window
 */
if (typeof window !== 'undefined') {
    window.polymorph = polymorph;
}