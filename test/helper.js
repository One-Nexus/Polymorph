require('@babel/register')({
    ignore: [
        function(filepath) {
            return filepath.indexOf('node_modules') !== -1
        }
    ]
});
require('@babel/polyfill');