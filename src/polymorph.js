import stringifyState from './utilities/stringifyState';

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
        element.polymorph = {
            rules: [],
            COMPONENTS: sQuery.getComponents.bind({...config})(element),
            SUB_COMPONENTS: sQuery.getSubComponents.bind({...config})(element)
        }

        const { COMPONENTS, SUB_COMPONENTS } = element.polymorph;

        element.repaint = function() {
            [element, ...COMPONENTS, ...SUB_COMPONENTS].forEach(el => {
                if (el.polymorph) {
                    el.polymorph.rules.forEach(rule => {
                        if (rule.context.every(ruleContext => {
                            if (ruleContext.value === 'hover') {
                                return ruleContext.source.polymorph.isHovered;
                            }
                            return sQuery.hasModifier.bind({...config})(ruleContext.source, ruleContext.value)
                        })) {
                            if (rule.dependencies) {
                                const ruleStyles = rule.styles.constructor === Array ? rule.styles[1] : rule.styles;

                                if (rule.dependencies instanceof HTMLElement) {
                                    doStyles(rule.dependencies, ruleStyles);
                                }
                                if (rule.dependencies instanceof NodeList) {
                                    rule.dependencies.forEach(dependency => {
                                        return doStyles(dependency, ruleStyles);
                                    });
                                }
                            }
                            doStyles(el, rule.styles);
                        }
                    });
                }
            });
        };
    }

    if (!element.polymorph.rules.some(rule => {
        // const equalContext = stringifyState(rule.context) == stringifyState(context);
        // const equalStyles = stringifyState(rule.styles) == stringifyState(stylesheet);

        // return equalContext && equalStyles;
    })) {
        element.polymorph.rules = element.polymorph.rules.concat({
            context: context,
            styles: stylesheet,
            dependencies: stylesheet instanceof Array && stylesheet[0] && stylesheet[0]
        });
    }

    if (typeof stylesheet === 'function') {
        stylesheet = stylesheet(element);
    }

    Object.entries(stylesheet).forEach(([key, value]) => {
        let COMPONENTS = sQuery.getComponents.bind({...config})(element, key);
        let SUB_COMPONENTS = sQuery.getSubComponents.bind({...config})(element, key);

        //Handle case where desired element for styles to be applied is manually controlled
        if (value instanceof Array && value[0]) {
            element.polymorph.rules = element.polymorph.rules.concat({
                context: context,
                styles: value[1],
                dependencies: value[0]
            });
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

            return;
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
            return;
        }
    });

    // Sort rules to ensure rules without context are applied first
    element.polymorph.rules.sort((a, b) => a.context.length - b.context.length);
}

/**
 * 
 */
function doStyles(el, styles) {
    Object.entries(typeof styles === 'function' ? styles(el) : styles).forEach(([key, value]) => {
        el.style[key] = value;
    });
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