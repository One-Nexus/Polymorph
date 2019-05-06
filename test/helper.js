require('@babel/register')({
    ignore: [
        function(filepath) {
            const isDependency = filepath.indexOf('node_modules') !== -1;
            const isOneNexusDependency = filepath.indexOf('@onenexus') !== -1;

            return isDependency && !isOneNexusDependency;
        }
    ]
});
require('@babel/polyfill');