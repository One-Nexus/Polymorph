import isValidCssProperty from './utilities/isValidCssProperty';
import stringifyState from './utilities/stringifyState';

var sQuery = (typeof window !== 'undefined') && window.sQuery;

// `process` and `require` are exploited to help reduce bundle size
if (!sQuery || (typeof process !== 'undefined' && !process.env.SYNERGY)) {
    sQuery = {
        getComponents: require('../../../sQuery/sQuery/refactor/api/getComponents').default,
        getSubComponents: require('../../../sQuery/sQuery/refactor/api/getSubComponents').default,
        getModifiers: require('../../../sQuery/sQuery/refactor/api/getModifiers').default,
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

    // Loop through properties
    if (STYLESHEET.constructor === Array) {
        if (STYLESHEET.every(value => value && value.constructor === Object)) {
            STYLESHEET.forEach(value => handleStyleSheet(element, value, CONFIG));
        }
    } else {
        handleStyleSheet(element, STYLESHEET, CONFIG);
    }

    // paint default/initial styles
    element.repaint();
}

/**
 * 
 */
function handleStyleSheet(element, stylesheet, config, context = []) {
    if (!element.polymorph) {
        // Setup data interface
        element.polymorph = {
            // default: {}, rules: [], currentState: []
            rules: []
        }

        element.polymorph.COMPONENTS = sQuery.getComponents.bind({...config})(element);
        element.polymorph.SUB_COMPONENTS = sQuery.getSubComponents.bind({...config})(element);

        const { COMPONENTS, SUB_COMPONENTS } = element.polymorph;

        // Setup repaint() method
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
                            doStyles(el, rule.styles);
                        }
                    });
                }
            });
        };
    }

    element.polymorph.rules = element.polymorph.rules.concat({
        context: context,
        context: context,
        styles: stylesheet
    });

    if (typeof stylesheet === 'function') {
        stylesheet = stylesheet(element);
    }

    Object.entries(stylesheet).forEach(([key, value]) => {
        const COMPONENTS = sQuery.getComponents.bind({...config})(element, key);
        let SUB_COMPONENTS = sQuery.getSubComponents.bind({...config})(element, key);

        //Handle case where desired element for styles to be applied is manually controlled
        if (value instanceof Array && value[0]) {
            if (value[0] instanceof HTMLElement) {
                return handleStyleSheet(value[0], value[1], config, context);
            }
    
            if (value[0] instanceof NodeList) {
                return value[0].forEach(node => handleStyleSheet(node, value[1], config, context));
            }
        }

        // Smart handle `components`
        if (COMPONENTS.length) {
            return COMPONENTS.forEach(component => {
                return handleStyleSheet(component, value, config, context);
            });
        }

        // Smart handle `sub-components`
        if (SUB_COMPONENTS.length) {
            if (value.disableCascade) {
                SUB_COMPONENTS = SUB_COMPONENTS.filter(subComponent => {
                    const componentName = [...element.classList].reduce((accumulator, currentValue) => {
                        if (currentValue.indexOf(config.componentGlue) > 1) {
                            currentValue = currentValue.substring(currentValue.lastIndexOf(config.componentGlue) + 1, currentValue.length);

                            return currentValue.substring(1, currentValue.indexOf(config.modifierGlue));
                        }
                    }, []);

                    const parentSubComponent = sQuery.parent.bind({...config})(subComponent, componentName);

                    if (parentSubComponent) {
                        // console.log(subComponent, parentSubComponent);
                    }

                    // return element === parentSubComponent;
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
                delete element.polymorph.isHovered;

                element.repaint();
            });

            return;
        }

        // Handle `focus` interaction
        if (key === ':focus') {
            return;
        }
    });

    // Sort Array to ensure rules without context are applied first
    element.polymorph.rules.sort((a, b) => {
        return a.context.length - b.context.length;
    });
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