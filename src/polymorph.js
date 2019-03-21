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

    // Handle case where desired element for styles to be applied is manually controlled
    if (styles.constructor === Array) {
        if (styles[0] instanceof HTMLElement) {
            return polymorph(styles[0], styles[1], config, globals);
        }

        if (styles[0] instanceof NodeList) {
            return styles[0].forEach(node => polymorph(node, styles[1], config, globals));
        }
    }

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
    element.repaint(['initial']);
}

/**
 * 
 */
function handleStyleSheet(element, stylesheet, config, context) {
    if (!element.polymorph) {
        // Setup data interface
        element.polymorph = {
            default: {}, rules: [], currentState: []
        }

        element.polymorph.COMPONENTS = sQuery.getComponents.bind(Object.assign({}, config))(element);
        element.polymorph.SUB_COMPONENTS = sQuery.getSubComponents.bind(Object.assign({}, config))(element);

        // Setup repaint() method
        element.repaint = function() {
            [element, ...element.polymorph.COMPONENTS, ...element.polymorph.SUB_COMPONENTS].forEach(el => {
                if (el.polymorph) {
                    const context = sQuery.getModifiers.bind(Object.assign({}, config))(el);

                    if (context.length) {
                        [el, ...el.polymorph.COMPONENTS, ...el.polymorph.SUB_COMPONENTS].forEach(_el => {
                            if (_el.polymorph) {
                                const contexts = _el.polymorph.currentState.concat(context.filter(item => {
                                    return _el.polymorph.currentState.indexOf(item) < 0;
                                }));

                                _el.polymorph.currentState = contexts;
                            }
                        });
                    }

                    el.polymorph.rules.forEach(rule => {

                    })
                }
            });
        };
    }

    Object.entries(stylesheet).forEach(([key, value]) => {
        const COMPONENTS = sQuery.getComponents.bind(Object.assign({}, config))(element, key);
        const SUB_COMPONENTS = sQuery.getSubComponents.bind(Object.assign({}, config))(element, key);

        //Handle case where desired element for styles to be applied is manually controlled
        if (value instanceof Array) {

        }

        // Smart handle `components`
        if (COMPONENTS.length) {
            return COMPONENTS.forEach(component => {
                return handleStyleSheet(component, value, config, context);
            });
        }

        // Smart handle `sub-components`
        if (SUB_COMPONENTS.length) {

        }

        // Handle `sub-components`
        if (key.indexOf('subComponent(') > -1) {
            const subComponent = key.replace('subComponent(', '').replace(/\)/g, '');
            const subComponents = sQuery.getSubComponents.bind(Object.assign({}, config))(element, subComponent);
        }
    
        // Handle `modifiers`
        if (key.indexOf('modifier(') > -1) {
            const modifier = key.replace('modifier(', '').replace(/\)/g, '');
        }

        // Handle `hover` interaction
        if (key === ':hover') {

        }

        // Handle `focus` interaction
        if (key === ':focus') {

        }
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