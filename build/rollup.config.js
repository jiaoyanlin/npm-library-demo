import json from 'rollup-plugin-json';
import resolvePlugin from 'rollup-plugin-node-resolve';
import commonjsPlugin from 'rollup-plugin-commonjs';
const path = require('path');

const resolve = function (filePath) {
    return path.join(__dirname, '..', filePath)
}

export default {
    input: resolve('src/main.js'),
    output: {
        file: resolve('dist/bundle.js'),
        format: 'umd',
        name: 'myLibrary'
    },
    plugins: [
        json(),
        resolvePlugin(),
        commonjsPlugin(),
    ],
};
