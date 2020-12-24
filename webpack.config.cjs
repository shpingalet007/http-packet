const webpack = require('webpack');
const path = require('path');

const { NODE_ENV } = process.env;

function getFileName(filename) {
    return `${filename}${NODE_ENV === 'production' ? '.min' : ''}.js`
}

const BabelLoader = {
    loader: 'babel-loader',
    options: {
        presets: [
            "@babel/preset-typescript",
        ],
    }
};

const modules = {
    rules: [{
        exclude: /(node_modules)/,
        use: BabelLoader
    }]
};

const BrowserPlugin = new webpack.DefinePlugin({
    "process.env": {
        BROWSER: JSON.stringify(true)
    }
});

const NodePlugin = new webpack.DefinePlugin({
    "process.env": {
        BROWSER: JSON.stringify(false)
    }
});

module.exports = [{
    /** Browser library UMD packer */
    mode: NODE_ENV || 'development',
    entry: [
        './src/class.ts',
    ],
    optimization: {
        usedExports: true,
    },
    output: {
        path: path.join(__dirname, 'client-dist'),
        filename: getFileName('http-packet'),
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    module: modules,
    plugins: [ BrowserPlugin ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
}];
