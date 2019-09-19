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
    }
};
