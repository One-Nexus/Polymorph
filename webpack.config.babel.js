import path from 'path';
import webpack from 'webpack';

export default function() {
    const entry = {
        'polymorph': './src/polymorph.js',
        'polymorph.min': './src/polymorph.js',
    };

    return {
        entry,

        output: {
            path: path.resolve(__dirname, 'dist/'),
            filename: '[name].js',
            publicPath: '/'
        },

        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                include: /\.min\.js$/,
                minimize: true,
                output: {
                    comments: false
                }
            })
        ],

        module: {
            loaders: [{
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }]
        },

        stats: { colors: true },

        devtool: false
    }
};