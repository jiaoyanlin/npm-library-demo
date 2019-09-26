import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babelPlugin from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import { uglify } from 'rollup-plugin-uglify';

const path = require('path');
const resolveFile = function (filePath) {
    return path.join(__dirname, '..', filePath)
}
const isDev = process.env.NODE_ENV !== 'production';
const isUglify = false;

export default {
    input: resolveFile('src/main.js'),
    output: {
        file: resolveFile('dist/index.js'),
        format: 'umd',
        name: 'npmLibraryDemo',
        sourcemap: true,
    },
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
        ...( // 使用开发服务插件
            isDev ?
                [
                    serve({
                        port: 3001,
                        // 设置 exmaple的访问目录和dist的访问目录
                        contentBase: [resolveFile('example'), resolveFile('dist')]
                    })
                ] : isUglify ? [
                    uglify()
                ] : []
        )
    ],
    // 作用：指出应将哪些模块视为外部模块，否则会被打包进最终的代码里
    // external: id => {
    //     return !isExternal ? false :
    //         (/@babel\/runtime/.test(id) || /lodash/.test(id));
    // }
};
