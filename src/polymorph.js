import isValidCssProperty from './utilities/isValidCssProperty';
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

    // Setup data interface
    element.polymorph = element.polymorph || {
        default: {}, rules: []
    }

    // Handle case where desired element for styles to be applied is manually controlled
    if (styles instanceof Array) {
        if (styles[0] instanceof HTMLElement) {
            return polymorph(styles[0], styles[1], config, globals);
        }

        if (styles[0] instanceof NodeList) {
            return styles[0].forEach(node => polymorph(node, styles[1], config, globals));
        }
    }

    let STYLESHEETS = (typeof styles === 'function') ? styles(element, config, globals) : styles;

    // Handle array of stylesheets
    if (STYLESHEETS.constructor === Array) {
        if (STYLESHEETS.every(value => value && value.constructor === Object)) {
            return STYLESHEETS.forEach(value => polymorph(element, value, config, globals));
        }
    }

    // Setup repaint() method
    element.repaint = function(context = 'reset') {
        let COMPONENTS = sQuery.getComponents.bind({ 
            componentGlue, modifierGlue 
        })(element);

        let SUB_COMPONENTS = sQuery.getSubComponents.bind({ 
            componentGlue, modifierGlue
        })(element);

        Object.keys(element.polymorph.default).forEach(key => {
            element.style[key] = element.polymorph.default[key];
        });

        console.log(COMPONENTS);

        element.polymorph.rules.forEach(rule => {
            if (rule.context === context) {
                Object.keys(rule.styles).forEach(key => {
                    element.style[key] = rule.styles[key];
                });
            }

            if (sQuery.hasModifier.bind({ componentGlue, modifierGlue })(element, rule.context)) {
                console.log(element, rule.styles)
            }
        });
    }

    // Loop through properties
    Object.entries(STYLESHEETS).forEach(entry => {
        const [key, value] = [entry[0], entry[1]];

        let COMPONENTS = sQuery.getComponents.bind({ 
            componentGlue, modifierGlue 
        })(element, key);

        let SUB_COMPONENTS = sQuery.getSubComponents.bind({ 
            componentGlue, modifierGlue
        })(element, key);

        //Handle case where desired element for styles to be applied is manually controlled
        if (value instanceof Array) {
            return polymorph(element, value, config, globals);
        }

        // Smart handle `components`
        if (COMPONENTS.length) {
            return COMPONENTS.forEach(COMPONENT => polymorph(COMPONENT, value, config, globals));
        }

        // Smart handle `sub-components`
        if (SUB_COMPONENTS.length) {
            return SUB_COMPONENTS.forEach(SUB_COMPONENT => polymorph(SUB_COMPONENT, value, config, globals));
        }

        // Handle `sub-components`
        if (key.indexOf('subComponent(') > -1) {
            const subComponent = key.replace('subComponent(', '').replace(/\)/g, '');
            const subComponents = sQuery.getSubComponents.bind({ componentGlue, modifierGlue })(element, subComponent);

            if (subComponents.length) {
                subComponents.forEach(subComponent => {
                    polymorph(subComponent, value, config, globals);
                });
            }

            return;
        }
    
        // Handle `modifiers`
        if (key.indexOf('modifier(') > -1) {
            const modifier = key.replace('modifier(', '').replace(/\)/g, '');

            element.polymorph.rules = element.polymorph.rules.concat({
                context: modifier,
                styles: value
            });

            return;
        }

        // Handle `hover` interaction
        if (key === ':hover') {
            element.polymorph.rules = element.polymorph.rules.concat({
                context: 'hover',
                styles: value
            });

            return;
        }

        // Handle `focus` interaction
        if (key === ':focus') {
        }

        element.polymorph.default[key] = value;
    });

    // paint default/initial styles
    element.repaint();

    element.polymorph.rules.forEach(rule => {
        if (rule.context === 'hover') {
            element.addEventListener('mouseenter', function mouseover() {
                element.repaint('hover');
            }, false);

            element.addEventListener('mouseleave', function mouseover() {
                element.repaint();
            }, false);
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