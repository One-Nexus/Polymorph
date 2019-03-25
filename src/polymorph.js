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
            STYLESHEET.forEach(value => handleStyleSheet(element, value, CONFIG, 'default'));
        }
    } else {
        handleStyleSheet(element, STYLESHEET, CONFIG, 'default');
    }

    // paint default/initial styles
    element.repaint([
        {
            source: element,
            value: ['initial']
        }
    ]);
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

        element.polymorph.COMPONENTS = sQuery.getComponents.bind({...config})(element);
        element.polymorph.SUB_COMPONENTS = sQuery.getSubComponents.bind({...config})(element);

        // Setup repaint() method
        element.repaint = function(_context = []) {
            // Reset the state/context
            [element, ...element.polymorph.COMPONENTS, ...element.polymorph.SUB_COMPONENTS].forEach(el => {
                if (el.polymorph) {
                    el.polymorph.currentState = el.polymorph.currentState.filter(state => {
                        if (state.source.contains(el)) {
                            if (state.value.every(_state => sQuery.hasModifier.bind({...config})(state.source, _state))) {
                                return true;
                            }
                        }
                    }).concat(_context);
                }
            });

            [element, ...element.polymorph.COMPONENTS, ...element.polymorph.SUB_COMPONENTS].forEach(el => {
                if (el.polymorph) {
                    const modifiers = sQuery.getModifiers.bind({...config})(el);

                    if (modifiers.length) {
                        [el, ...el.polymorph.COMPONENTS, ...el.polymorph.SUB_COMPONENTS].forEach(_el => {
                            if (_el.polymorph) {
                                const context = {
                                    value: modifiers,
                                    source: el
                                }

                                if (_el.polymorph.currentState.some(state => JSON.stringify(state.value) === JSON.stringify(modifiers) && state.source === el)) {
                                    return;
                                }

                                _el.polymorph.currentState = _el.polymorph.currentState.concat(context);
                            }
                        });
                    }

                    el.polymorph.rules.forEach(rule => {
                        if (rule.context && rule.context !== 'default') {
                            if (el.polymorph.currentState.some(state => state.value.includes(rule.context))) {
                                doStyles(el, rule.styles);
                            }
                        } else {
                            doStyles(el, rule.styles);
                        }
                    })
                }
            });
        };
    }

    element.polymorph.rules = element.polymorph.rules.concat({
        context: context,
        styles: stylesheet
    });

    if (typeof stylesheet === 'function') {
        stylesheet = stylesheet(element);
    }

    Object.entries(stylesheet).forEach(([key, value]) => {
        const COMPONENTS = sQuery.getComponents.bind({...config})(element, key);
        const SUB_COMPONENTS = sQuery.getSubComponents.bind({...config})(element, key);

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

            return handleStyleSheet(element, value, config, modifier);
        }

        // Handle `hover` interaction
        if (key === ':hover') {
            handleStyleSheet(element, value, config, 'hover');

            element.addEventListener('mouseenter', event => {
                // console.log(element, value);
                // doStyles(element, value);
                element.repaint([
                    {
                        value: ['hover'],
                        source: element
                    }
                ]);
            });

            element.addEventListener('mouseleave', event => {
                element.repaint();
            });

            return;
        }

        // Handle `focus` interaction
        if (key === ':focus') {
            return;
        }
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