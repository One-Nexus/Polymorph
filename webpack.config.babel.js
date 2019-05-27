import path from 'path';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

export default function() {
    const entry = {
        'polymorph': './src/polymorph.js',
        'polymorph.min': './src/polymorph.js',
    };

    return {
        entry,

        mode: 'production',

        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: '[name].js',
            publicPath: '/',
            globalObject: 'typeof self !== \'undefined\' ? self : this',
            libraryTarget: 'umd'
        },

        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    include: /\.min\.js$/,
                    uglifyOptions: {
                        output: {
                            comments: false
                        }
                    }
                })
            ]
        },

        module: {
            rules: [{
                test: /\.(js)$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader'
                }
            }]
        },

        node: {
            process: false,
            Buffer: false
        },

        stats: { colors: true },

        devtool: false
    }
};