module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                // "debug": true, // debug，编译的时候 console
                "useBuiltIns": false, // 是否开启自动支持 polyfill
                "modules": false, // 模块使用 es modules ，不使用 commonJS 规范
                // "targets": "> 0.25%, last 2 versions, iOS >= 8, Android >= 4.4, not dead"
            }
        ]
    ],
    plugins: [
        [
            "@babel/plugin-transform-runtime",
            {
                // useESModules：引入的helpers是否是es modules规范的；注意当打包成cjs时不能引入es modules下的代码，会报错
                // "useESModules": true,
                "corejs": 2 // 参考官方文档
            }
        ],
    ]
}
