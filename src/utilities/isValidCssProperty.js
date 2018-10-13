/**
 * Determine if a string is a valid CSS property
 * 
 * @param {String} query
 */
export default function isValidCssProperty(query) {
    var el = document.createElement('div');

    el.style[query] = 'initial';

    return !!el.style.cssText;
}