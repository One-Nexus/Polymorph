/**
 * Stringify a polymorph state
 * 
 * @see https://stackoverflow.com/a/48254637/2253888
 * 
 * @param {Object} state 
 */
export default function (state) {
    const cache = new Set();

    return JSON.stringify(state, function (key, value) {
        // Do not attempt to serialize DOM elements as the bloat causes browser to crash
        if (value instanceof HTMLElement) {
            value = '[HTMLElement]'
        }

        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
                // Circular reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                }
                catch (err) {
                    // discard key if value cannot be deduped
                    return;
                }
            }

            // Store value in our set
            cache.add(value);
        }

        return value;
    });
};