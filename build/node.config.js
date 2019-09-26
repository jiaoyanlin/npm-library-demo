const json = require('rollup-plugin-json');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babelPlugin = require('rollup-plugin-babel');
const { uglify } = require('rollup-plugin-uglify');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';

const resolveFile = function (filePath) {
    return path.join(__dirname, '..', filePath)
}

module.exports.outputs = [
    {
        file: resolveFile('lib/index.js'),
        format: 'cjs',
        isExternal: true,
    },
    {
        file: resolveFile('es/index.js'),
        format: 'es',
        isExternal: true,
    },
    {
        file: resolveFile('dist/index.js'),
        format: 'umd',
        name: 'npmLibraryDemo',
    },
    {
        file: resolveFile('dist/index.min.js'),
        format: 'umd',
        name: 'npmLibraryDemo',
        isUglify: true,
    }
].map(i => {
    i.sourcemap = isDev; // 开发模式：开启sourcemap文件的生成
    return i;
});

module.exports.configFun = function config({isUglify, isExternal} = {}) {
    return {
        input: resolveFile('src/main.js'),
        plugins: [
            // rollup-plugin-commonjs应该用在其他插件转换你的模块之前 - 这是为了防止其他插件的改变破坏CommonJS的检测
            // 作用：将CommonJS模块转换为 ES2015 供 Rollup 处理
            commonjs(),
            // 作用：处理json格式文件
            json(),
            // 作用：告诉 Rollup 如何查找外部模块
            resolve({
                // 将自定义选项传递给解析插件
                customResolveOptions: {
                    moduleDirectory: 'node_modules'
                }
            }),
            babelPlugin({
                exclude: 'node_modules/**', // 只编译我们的源代码
                runtimeHelpers: true,
            }),
            ...(
                isUglify ? [ uglify() ] : []
            )
        ],
        // 作用：指出应将哪些模块视为外部模块，否则会被打包进最终的代码里
        external: id => {
            return !isExternal ? false :
                (/@babel\/runtime/.test(id) || /lodash/.test(id));
        },
    }
};
