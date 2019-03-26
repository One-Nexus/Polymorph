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
            STYLESHEET.forEach(value => handleStyleSheet(element, value, CONFIG, 'default'));
        }
    } else {
        handleStyleSheet(element, STYLESHEET, CONFIG, 'default');
    }

    // paint default/initial styles
    element.repaint();
}

/**
 * 
 */
function handleStyleSheet(element, stylesheet, config, context, _context = []) {
    if (!element.polymorph) {
        // Setup data interface
        element.polymorph = {
            default: {}, rules: [], currentState: []
        }

        element.polymorph.COMPONENTS = sQuery.getComponents.bind({...config})(element);
        element.polymorph.SUB_COMPONENTS = sQuery.getSubComponents.bind({...config})(element);

        const { COMPONENTS, SUB_COMPONENTS } = element.polymorph;

        // Setup repaint() method
        element.repaint = function(_context = []) {
            // Reset the state/context
            [element, ...COMPONENTS, ...SUB_COMPONENTS].forEach(el => {
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

            [element, ...COMPONENTS, ...SUB_COMPONENTS].forEach(el => {
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
                        if (rule._context.length && !rule._context.includes('default')) {
                            const curState = el.polymorph.currentState.reduce((states, state) => {
                                return states.concat(state.value);
                            }, []);

                            if (rule._context.every(ruleContext => curState.includes(ruleContext))) {
                                // console.log(curState, rule._context, context);

                                if (el.className === 'navigation__dropdown') {
                                    // console.log(el, rule.styles);
                                }
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
        _context: _context,
        styles: stylesheet
    });

    if (typeof stylesheet === 'function' && context === 'default') {
        stylesheet = stylesheet(element);
    }

    Object.entries(stylesheet).forEach(([key, value]) => {
        const COMPONENTS = sQuery.getComponents.bind({...config})(element, key);
        const SUB_COMPONENTS = sQuery.getSubComponents.bind({...config})(element, key);

        //Handle case where desired element for styles to be applied is manually controlled
        if (value instanceof Array && value[0]) {
            if (value[0] instanceof HTMLElement) {
                return handleStyleSheet(value[0], value[1], config, context, _context);
            }
    
            if (value[0] instanceof NodeList) {
                return value[0].forEach(node => handleStyleSheet(node, value[1], config, context, _context));
            }
        }

        // Smart handle `components`
        if (COMPONENTS.length) {
            return COMPONENTS.forEach(component => {
                return handleStyleSheet(component, value, config, context, _context);
            });
        }

        // Smart handle `sub-components`
        if (SUB_COMPONENTS.length) {
            return SUB_COMPONENTS.forEach(component => {
                return handleStyleSheet(component, value, config, context, _context);
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

            return handleStyleSheet(element, value, config, modifier, _context.concat(modifier));
        }

        // Handle `hover` interaction
        if (key === ':hover') {
            handleStyleSheet(element, value, config, 'hover', _context.concat('hover'));

            element.addEventListener('mouseenter', event => {
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
        if (el.className === 'navigation__dropdown') {
            console.log(el, key, value);
        }
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