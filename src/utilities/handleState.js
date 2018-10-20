import polymorph from '../polymorph';

export default function handleState(parentElement, element, state, value, globals) {
    const isHoverState = parentElement.data.states.some(state => {
        return state.type === state[0] && state.element === element;
    });

    if (!isHoverState) {
        parentElement.data.states.push({ type: state[0], element });

        element.addEventListener(state[0], function mouseEnter() {
            element.removeEventListener(state[0], mouseEnter);

            polymorph(element, value, false, globals, parentElement);
        }, false);

        element.addEventListener(state[1], function mouseLeave() {
            element.removeEventListener(state[1], mouseLeave);

            parentElement.data.states = parentElement.data.states.filter(state => {
                return !(state.type === state[0] && state.element === element);
            });

            parentElement.repaint();
        }, false);
    }
}