export default function repaint(element, context) {
    // Reset the state/context
    const { COMPONENTS, SUB_COMPONENTS } = element.polymorph;

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
}