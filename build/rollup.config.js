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
        format: 'es',
        name: 'myLibrary'
    },
    plugins: [
        // rollup-plugin-commonjs应该用在其他插件转换你的模块之前 - 这是为了防止其他插件的改变破坏CommonJS的检测
        // 作用：将CommonJS模块转换为 ES2015 供 Rollup 处理
        commonjsPlugin(),
        // 作用：处理json格式文件
        json(),
        // 作用：告诉 Rollup 如何查找外部模块
        resolvePlugin({
            // 将自定义选项传递给解析插件
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),
    ],
    // 作用：指出应将哪些模块视为外部模块，否则会被打包进最终的代码里
    external: ['lodash'],
    // external: id => /lodash/.test(id)
};
