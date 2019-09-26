const path = require('path');
const serve = require('rollup-plugin-serve');
const rollup = require('rollup');
const { configFun, outputs } = require('./node.config.js');

const resolveFile = function (filePath) {
    return path.join(__dirname, '..', filePath)
}

let watchOptions = [];
const len = outputs.length;
outputs.forEach((output, i) => {
    let options = {
        isUglify: output.isUglify,
        isExternal: output.isExternal,
    }
    let config = {
        output,
        ...configFun(options)
    };
    if (i === len - 1) {
        config.plugins.push(
            serve({ // 使用开发服务插件
                port: 3001,
                // 设置 exmaple的访问目录和dist的访问目录
                contentBase: [resolveFile('example'), resolveFile('dist')]
            })
        );
    }
    watchOptions.push(config);
});

const watcher = rollup.watch(watchOptions);

watcher.on('event', event => {
    // event.code 会是下面其中一个：
    //   START        — 监听器正在启动（重启）
    //   BUNDLE_START — 构建单个文件束
    //   BUNDLE_END   — 完成文件束构建
    //   END          — 完成所有文件束构建
    //   ERROR        — 构建时遇到错误
    //   FATAL        — 遇到无可修复的错误
    switch (event.code) {
        case 'START':
            console.log(`[info] 监听器正在启动（重启）`);
            break;
        case 'BUNDLE_START':
            console.log(`[info] 开始构建 ${event.output}`);
            break;
        case 'BUNDLE_END':
            console.log(`[info] 完成构建 ${event.output}`);
            console.log(`[info] 构建时长 ${event.duration}`);
            break;
        case 'END':
            console.log(`[info] 完成所有构建`);
            break;
        case 'ERROR':
        case 'FATAL':
            console.log(`[error] 构建发生错误`);
    }
});

// 停止监听
// watcher.close();
