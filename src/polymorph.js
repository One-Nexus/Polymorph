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
     * Setup data interface
     */
    element.polymorph = element.polymorph || {
        rules: [], data: {}
    }

    /**
     * Setup repaint() method
     */
    element.repaint = element.repaint || function(context = 'repaint') {
        // console.log(element.polymorph.data.background)
        element.polymorph.rules.forEach(STYLESHEET => {
            polymorph(element, STYLESHEET, config, globals, context);
        });
    }

    /**
     * Handle case where desired element for styles to be applied is manually controlled
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

    /**
     * Handle array of stylesheets
     */
    if (STYLESHEETS.constructor === Array) {
        if (STYLESHEETS.every(value => value && value.constructor == Object)) {
            return STYLESHEETS.forEach(value => polymorph(element, value, config, globals, context));
        }
    }

    const STATE = stringifyState(STYLESHEETS);

    if (!context && !element.polymorph.rules.some(state => stringifyState(state) === STATE)) {
        if (STYLESHEETS.background === 'red') {
            console.log('foo')
        }
        element.polymorph.rules.push(STYLESHEETS);
    }

    /**
     * Loop through properties
     */
    Object.entries(STYLESHEETS).forEach(entry => {
        const [key, value] = [entry[0], entry[1]];

        let COMPONENTS = sQuery.getComponents.bind({ 
            DOMNodes: element, componentGlue, modifierGlue 
        })(key);

        let SUB_COMPONENTS = sQuery.getSubComponents.bind({ 
            DOMNodes: element, componentGlue, modifierGlue
        })(key);

        /**
         * Handle case where desired element for styles to be applied is manually controlled
         */
        if (value instanceof Array) {
            return polymorph(element, value, config, globals, context);
        }

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
                    // @TODO look to move this logic to sQuery
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
         * Handle `sub-components`
         */
        if (key.indexOf('subComponent(') > -1) {
            const subComponent = key.replace('subComponent(', '').replace(/\)/g, '');
            const subComponents = sQuery.getSubComponents.bind({ DOMNodes: element, componentGlue, modifierGlue })(subComponent);

            if (subComponents.length) {
                subComponents.forEach(_component => {
                    polymorph(_component, value, config, globals, context); 
                });
            }

            return;
        }

        /**
         * Handle `hover` interaction
         */
        if (key === ':hover') {
            if (!context) {
                element.addEventListener('mouseover', function mouseover() {
                    polymorph(element, value, config, globals, 'mouseover');
                }, false);

                element.addEventListener('mouseout', function mouseout() {
                    // let f = {};

                    // for (let [key, value] of Object.entries(element.polymorph.data)) {
                    //     f[key] = value.prevState;
                    // }

                    // console.log(f);

                    polymorph(element, value, config, globals, 'reset');

                    element.repaint('repaint');
                }, false);
            }

            return;
        }

        /**
         * Handle `focus` interaction
         */
        if (key === ':focus') {
            if (!context) {
                element.addEventListener('focus', function focus() {
                    polymorph(element, value, config, globals, 'focus');
                }, false);

                element.addEventListener('blur', function blur() {
                    polymorph(element, value, config, globals, 'reset');

                    element.repaint('blur');
                }, false);
            }

            return;
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

        /**
         * Handle module `group` and `wrapper`
         */
        if (key === 'group' || key === 'wrapper') {
            // @TODO this currently runs for each item in the group/wrapper,
            // should ideally run just once per group/wrapper
            element.parentNode.classList.forEach(className => {
                if (className.indexOf('group') === 0 || className.indexOf('wrapper') === 0) {
                    const wrapperValues = (typeof value === 'object') ? value : value(element.parentNode);
                    const childValues   = (typeof value === 'object') ? value : value(element);

                    // apply styles to wrapper/group element
                    polymorph(element.parentNode, wrapperValues, config, globals, context);

                    // apply styles to child modules
                    polymorph(element, childValues, config, globals, context);
                }
            });

            return;
        }

        /**
         * Handle case where CSS `value` to be applied to `element` is a function
         */
        if (typeof value === 'function') {
            if (isValidCssProperty(key)) {
                element.style[key] = value(element.style[key]);
            }

            return;
        }

        /**
         * Key is not a CSS property
         * @TODO look for better solution
         */
        if (!isNaN(key)) return;

        /**
         * Reverse styles applied by hover
         */
        if (context === 'reset') {
            console.log(key, value);
            return element.style[key] = element.polymorph.data[key] ? element.polymorph.data[key].prevState : 'initial';
        }

        /**
         * Apply the CSS property to the element
         */
        element.polymorph.data[key] = {
            prevState: element.style[key],
            context: context
        }

        // console.log(key, element.polymorph.data[key])
        
        element.style[key] = value;
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