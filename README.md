# rollup开发依赖包（npm library）实战

> 本文涉及包版本：node 11.6.0 、npm 6.11.3、webpack 4.39.3；使用mac开发；

## 项目

[源码](https://github.com/jiaoyanlin/npm-library-demo) -> https://github.com/jiaoyanlin/npm-library-demo ，求star😄

```
npm i
npm start
```

建议开始动手实践前先浏览下本文的的 三、知识点

## 一、发布包基本流程

#### 1、使用nrm管理npm源：

> nrm：npm registry 管理工具，方便切换不同的源；我们开发的包要发布的源是https://registry.npmjs.org，更详细的安装可以参考[nrm —— 快速切换 NPM 源](https://segmentfault.com/a/1190000000473869)

```
// 安装
npm install -g nrm
// 查看
nrm ls
// 切换
nrm use taobao
// 增加源
nrm add  <registry> <url> [home]
// 删除源
nrm del <registry>
```

#### 2、发布包：

> 记得先在 https://www.npmjs.com 注册账户并在邮箱激活账户

（1）编写包代码(npm init等操作，具体在下面会提及)

（2）切换registry到npm对应链接https://registry.npmjs.org/：nrm use npm

（3）登录：npm login

（4）发布、更新：npm publish

#### 3、关于为何选择rollup而不是webpack编写一个npm包

> 为了支持tree shaking，得导出一份符合es6模块规范的代码，但是webpack不支持导出为es6模块，所以使用rollup来开发我们的包

> [rollup和webpack使用场景分析](https://www.jianshu.com/p/60070a6d7631)中提到：Rollup偏向应用于js库，webpack偏向应用于前端工程，UI库；如果你的应用场景中只是js代码，希望做ES转换，模块解析，可以使用Rollup。如果你的场景中涉及到css、html，涉及到复杂的代码拆分合并，建议使用webpack。

> rollup可以直接构建出符合es6模块规范的代码（有利于tree shaking），但是webpack不能；因此为了更好地使用es6模块化来实现tree shaking，以及优化包代码体积等原因，选用rollup来开发npm包；

## 二、使用rollup构建npm包

> 以下内容引自[rollup中文网](https://www.rollupjs.com/guide/introduction/): 为了确保你的 ES6 模块可以直接与「运行在 CommonJS（例如 Node.js 和 webpack）中的工具(tool)」使用，你可以使用 Rollup 编译为 UMD 或 CommonJS 格式，然后在 package.json 文件的 main 属性中指向当前编译的版本。如果你的 package.json 也具有 module 字段，像 Rollup 和 webpack 2 这样的 ES6 感知工具(ES6-aware tools)将会直接导入 ES6 模块版本。

> 关于rollup更加详细的介绍及使用，可以参考以下文章：[Rollup：下一代ES模块打包工具](https://zhuanlan.zhihu.com/p/75717476) 、[rollup中文网](https://www.rollupjs.com/guide/introduction/) 、[Rollup.js 实战学习笔记](https://rollupjs.org/guide/zh/)、[webpack创建library](https://chenshenhai.github.io/rollupjs-note/)


#### 1、先来个简单的demo：[源码](https://github.com/jiaoyanlin/npm-library-demo/tree/master/demos/demo-1)

（1）新建一个文件夹npm-library-demo

初始化：
```
cd npm-library-demo
npm init -y // 初始化，生成package.json
npm i rollup -D // 安装rollup
```

根据以下目录结构新增文件夹及文件：
```
npm-library-demo
    |--build
        |--rollup.config.js
    |--example
        |--index.html
    |--src
        |--main.js
        |--foo.js
```

（2）文件内容：

package.json中加入构建脚本命令：
```
"scripts": {
    "build": "rollup -c ./build/rollup.config.js"
}
```

```javascript
// rollup.config.js
const path = require('path');
const resolve = function (filePath) {
    return path.join(__dirname, '..', filePath)
}
export default {
    input: resolve('src/main.js'), // 入口文件
    output: { // 出口文件
        file: resolve('dist/bundle.js'),
        format: 'umd',
        name: 'myLibrary'
    }
};
```

```javascript
// main.js
import foo from './foo.js';
export default (function () {
	console.log(foo);
})();
```

```javascript
// foo.js
export default 'hello world!';
```

index.html:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>example</title>
</head>
<body>
    
</body>
<script src="../dist/bundle.js"></script>
</html>
```

（3）执行`npm run build`，就可以生成打包文件/dist/bundle.js，打开example/index.html控制台可以查看打包文件是否生效

#### 2、使用插件，在1的基础上进行以下操作：[源码](https://github.com/jiaoyanlin/npm-library-demo/tree/master/demos/demo-2)

在rollup中如果要处理json，就要用到插件，比如rollup-plugin-json

`npm i rollup-plugin-json -D`

```javascript
// rollup.config.js
const path = require('path');
import json from 'rollup-plugin-json';

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
    plugins: [ // 在此处使用插件
        json(),
    ],
};

```

```javascript
// main.js
import foo from './foo.js';
import { version } from '../package.json'; // 利用json插件可以获得package.json中的数据
console.log('version ' + version);
export default (function () {
	console.log(foo);
})();
```

此时再次使用`npm run build`打包，打开index.html，在控制台可以看到相关结果

其他插件使用方式类似

#### 3、Rollup 与其他工具集成

##### （1）npm packages：添加配置让rollup知道如何处理你从npm安装到node_modules文件夹中的软件包

`npm install rollup-plugin-node-resolve rollup-plugin-commonjs -D`

* rollup-plugin-node-resolve: 告诉 Rollup 如何查找外部模块
* rollup-plugin-commonjs：将CommonJS模块转换为 ES2015 供 Rollup 处理，请注意，rollup-plugin-commonjs应该用在其他插件转换你的模块之前 - 这是为了防止其他插件的改变破坏CommonJS的检测


```javascript
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import json from 'rollup-plugin-json';

const path = require('path');
const resolveFile = function (filePath) {
    return path.join(__dirname, '..', filePath)
}

export default {
    input: resolveFile('src/main.js'),
    output: {
        file: resolveFile('dist/bundle.js'),
        format: 'cjs',
    },
    plugins: [
        commonjs(),
        resolve({
            // 将自定义选项传递给解析插件
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),
        json(),
    ],
};
```

##### （2）external：有些包要处理成外部引用（例如lodash等），externals就是用来处理外部的引用，不要将这些包打包到输出文件中，减小打包文件体积

> external 接受一个模块名称的数组或一个接受模块名称的函数，如果它被视为外部引用（externals）则返回true

```javascript
// rollup.config.js
export default {
    ...,
    // 作用：指出应将哪些模块视为外部模块，否则会被打包进最终的代码里
    external: ['lodash']
    // external: id => /lodash/.test(id) // 也可以使用这种方式
};
```

安装lodash：`npm i lodash -S`
```javascript
// main.js
...
import _ from 'lodash';
console.log('-------lodash:', _.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 }));
```
可以打包试试external配置与否对打包文件的影响（直接查看dist/bundle.js）

由于此时打包生成的是cjs格式的js，可以直接在控制台执行`node ./dist/bundle.js`测试打包结果；此时index.html是没法成功加载bundle.js的，因为此时的文件是cjs的，无法直接在浏览器中使用

##### （3）babel7：

`npm i -D rollup-plugin-babel @babel/core @babel/plugin-transform-runtime @babel/preset-env`

`npm i -S @babel/runtime @babel/runtime-corejs2`

```javascript
// rollup.config.js
...
import babel from 'rollup-plugin-babel';

export default {
    ...
    plugins: [
        ...,
        babel({
            exclude: 'node_modules/**', // 只编译我们的源代码
            runtimeHelpers: true,
        }),
    ],
    external: id => {
        return /@babel\/runtime/.test(id) || /lodash/.test(id);
    }
}
```
根目录下新建文件.babelrc.js
```javascript
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
```
可以自己在main.js中加入一些es6语法，看看打包后的文件是否将es6语法编译成了es5（如const、let等）

??????? babel还有一篇相关博文补充

##### （4）引入eslint：

`npm i -D babel-eslint rollup-plugin-eslint`

> eslint位置很重要，放在babel插件后面会导致定位问题的时候出错

```javascript
// rollup.config.js
...
import { eslint } from 'rollup-plugin-eslint';

module.exports = {
    ...,
    plugins: [
        ...,
        eslint({ // eslint插件必须放在babel插件之前，不然检测的是转换后的文件，导致检测有误
            throwOnError: true,
            throwOnWarning: true,
            include: ['src/**'],
            exclude: ['node_modules/**']
        }),
        ...
    ]
}
```

根目录下新增文件.eslitrc.js
```javascript
module.exports = {
    //一旦配置了root，ESlint停止在父级目录中查找配置文件
    root: true,
    parser: "babel-eslint", // 配置babel-eslint，避免在使用es6类属性时，eslint报Parsing error: Unexpected token
    //想要支持的JS语言选项
    parserOptions: {
        //启用ES6语法支持(如果支持es6的全局变量{env: {es6: true}}，则默认启用ES6语法支持)
        //此处也可以使用年份命名的版本号：2015
        ecmaVersion: 6,
        //默认为script
        sourceType: "module",
        //支持其他的语言特性
        ecmaFeatures: {}
    },
    //代码运行的环境，每个环境都会有一套预定义的全局对象，不同环境可以组合使用
    env: {
        amd: true, // 否则会出现'require' is not defined 提示
        es6: true,
        browser: true,
        jquery: true
    },
    //访问当前源文件中未定义的变量时，no-undef会报警告。
    //如果这些全局变量是合规的，可以在globals中配置，避免这些全局变量发出警告
    globals: {
        //配置给全局变量的布尔值，是用来控制该全局变量是否允许被重写
        test_param: true,
        window: true,
        process: false,
    },
    //集成推荐的规则
    extends: ["eslint:recommended"],
    //启用额外的规则或者覆盖默认的规则
    //规则级别分别：为"off"(0)关闭、"warn"(1)警告、"error"(2)错误--error触发时，程序退出
    rules: {
        //关闭“禁用console”规则
        "no-console": "off",
        //缩进不规范警告，要求缩进为2个空格，默认值为4个空格
        "indent": ["warn", 4, {
            //设置为1时强制switch语句中case的缩进为2个空格
            "SwitchCase": 1,
        }],
        // 函数定义时括号前面要不要有空格
        "space-before-function-paren": [0, "always"],
        //定义字符串不规范错误，要求字符串使用双引号
        // quotes: ["error", "double"],
        //....
        //更多规则可查看http://eslint.cn/docs/rules/
    }
}
```
##### （5）一次编译，同时打包生成不同格式文件，如cjs、es、umd等

有两种方法：

首先，`npm i -D rollup-plugin-serve rollup-plugin-uglify`

修改packag.json
```json
{
    ...,
    "module": "es/index.js",
    "main": "lib/index.js",
    "scripts": {
        "build": "rollup -c ./build/rollup.config.js"
        "clean": "rm -rf ./dist/ ./es/ ./lib/",
        "easy": "npm run clean && NODE_ENV=development rollup -w -c ./build/easy.config.js",
        "node:dev": "npm run clean && NODE_ENV=development node ./build/dev.js",
        "node:build": "npm run clean && NODE_ENV=production node ./build/build.js",
        "start": "npm run clean && NODE_ENV=development rollup -w -c ./build/rollup.config.js",
        "build": "npm run clean && NODE_ENV=production rollup -c ./build/rollup.config.js"
   },
   "files": [
        "dist",
        "lib",
        "es",
        "types"
  ],

```

注意：mac可以直接使用NODE_ENV=development方式传递变量，window下不一定可以，如果失败请引入[cross-env](https://juejin.im/post/5c009b13f265da612e285d43)

（1）第一种方法：使用rollup命令打包

```javascript
// rollup.config.js
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babelPlugin from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import { uglify } from 'rollup-plugin-uglify';
import { eslint } from 'rollup-plugin-eslint'

const path = require('path');
const resolveFile = function (filePath) {
    return path.join(__dirname, '..', filePath)
}
const isDev = process.env.NODE_ENV !== 'production';
console.log('----------dev:', process.env.NODE_ENV, isDev)

// 通过控制outputs中对应的isExternal、isUglify值来决定打包的文件是否启用external和uglify
const outputs = [
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
const len = outputs.length;

const config = outputs.map((output, i) => {
    const isUglify = output.isUglify || false;
    const isExternal = output.isExternal || false;
    console.log('------config:', isExternal)
    return {
        input: resolveFile('src/main.js'),
        output,
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
            eslint({
                throwOnError: true,
                throwOnWarning: true,
                include: ['src/**'],
                exclude: ['node_modules/**']
            }),
            babelPlugin({
                exclude: 'node_modules/**', // 只编译我们的源代码
                runtimeHelpers: true,
            }),
            ...(
                isDev && i === len - 1 ?
                    [
                        serve({ // 使用开发服务插件
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
        external: id => {
            return !isExternal ? false :
                (/@babel\/runtime/.test(id) || /lodash/.test(id));
        }
    }
})

export default config;
```

使用`npm start`开启开发模式；使用`npm run build`可以打包出文件；总共导出三种格式文件：cjs、es、umd，umd格式的文件有压缩和未压缩

> start时如果报错“getaddrinfo ENOTFOUND localhost”，参考这篇[方法](https://segmentfault.com/a/1190000015274463)解决

（2）第二种方法：使用rollup api进行打包

build文件夹下新增文件：node.config.js、dev.js、build.js
```javascript
// node.config.js
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
```

```javascript
// dev.js
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
```

```javascript
// build.js
const rollup = require('rollup');
const { configFun, outputs } = require('./node.config.js');

outputs.forEach(async (output) => {
    const inputOptions = configFun({
        isUglify: output.isUglify,
        isExternal: output.isExternal,
    });
    build(inputOptions, output);
})

async function build(inputOptions, outputOptions) {
    console.log(`[INFO] 开始编译 ${inputOptions.input}`);
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);

    // generate code and a sourcemap
    const res = await bundle.generate(outputOptions);
    console.log(`[INFO] ${res}`);

    // or write the bundle to disk
    await bundle.write(outputOptions);
    console.log(`[SUCCESS] 编译结束 ${outputOptions.file}`);
}
```

使用`npm run node:dev`开启开发模式；使用`npm run node:build`可以打包出文件；

可以实现一个简单功能实验一下配置是否成功，比如这次提交[简单预加载图片](https://github.com/jiaoyanlin/npm-library-demo/commit/e7a48b6f0332cf68a3d888a73867dc565d63da8e)

注意：

1、examp/index.html中引入的js是umd形式的，如果我们的代码中引入了运行时需要使用到的第三方包（例如lodash等），并且没有在index.html手动将该包引入，会导致找不到该包而报错；因此我这里的配置中，输出文件如果是umd格式的，就不配置external，直接将第三方包的代码一起打包进最终的打包文件中；

2、当输出文件是cjs或者es时，配置external，即不将某些第三方包打包，减小最终的打包文件体积；由于我们把第三方包安装在“dependencies”中，当别人加载我们的这个包时，他们的项目会自动安装我们的“dependencies”中所有的包，所以可以加载到我们开发的包中涉及到的第三方包；

3、关于调试

我开发包的过程中用到了两种调试方式：

方法1：直接通过npm start启动时的http://localhost:3001来调试；由于开启了rollup的监听功能，因此当我们修改代码时，会自动构建打包出新代码，只要刷新浏览器就能看到最新的效果；

> 开启source map调试我只在方法1的调试方法中能正常使用

方法2：在项目中调试正在开发的包：

> npm link命令通过链接目录和可执行文件，实现任意位置的npm包命令的全局可执行。

在包目录下执行`npm link`(假设包名为pky-test)；

在项目目录下执行`npm link pky-test`即可使用该包(执行`npm unlink pky-test`可以删除包链接)；

在包目录下执行`npm start`可以实时打包出最新代码


#### 6、发布，增加命令实现自动打标签并根据提交记录生成changelog

`npm i -D conventional-changelog-cli`

package.json
```json
{
    ...,
    "scripts": {
        ...,
        "tag": "node ./build/version.js",
        "x": "npm --no-git-tag-version version major",
        "y": "npm --no-git-tag-version version minor",
        "z": "npm --no-git-tag-version version patch",
        "postversion": "npm run changelog && git add . && npm run tag",
        "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0",
        "prepublishOnly": "npm run build",
        "postpublish": "npm run clean"
    }
}
```

新建文件build/version.js：根据packag.json中的version提交代码并且打标签
```javascript
const fs = require('fs');
const path = require('path');
const pathname = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pathname, 'utf-8'));
let version = pkg.version;

console.log('version:', version)

const exec = require('child_process').exec;
let cmdStr = `git commit -m "v${version}" && git push && git tag -a "v${version}" -m "${version}" && git push origin --tags`;
exec(cmdStr, function (err, stdout, stderr) {
    console.log('exec:', err, stdout, stderr);
});
```

（1）执行`npm run x/y/z`可以改变package.json中的version，然后根据提交的commit信息自动生成changelog，最后会根据version提交代码并打标签；

（2）执行`npm run publish`发布代码



其他：

（1）我没有使用preversion钩子和
conventional-changelog-cli自动生成changelog，因为如果在改变版本号之前执行自动生成changelog，那么当前版本提交的commit信息不会被自动生成到changelog中（因为changelog只会生成当前版本之前的commit记录）

（2）必须遵循一定的commit规范，才能根据commit记录自动生成changelog，具体自行百度下conventional-changelog-cli的使用哦

因此，推荐的工作流：

 1.改动代码
 
 2.提交这些改动
 
 3.改变package.json中的版本号
 
 4.使用conventional-changelog工具
 
 5.提交 package.json和CHANGELOG.md文件
 
 6.打标签tag
 
 7.push代码

可以参考[使用conventional-changelog生成版本日志](https://github.com/rayliao/blog/issues/4)

## 三、知识点

> 先学习下以下两篇文章：
> [如何开发和维护一个npm项目](https://juejin.im/post/5bd32ecff265da0ab33193b4)
> [你所需要的npm知识储备都在这了](https://juejin.im/post/5d08d3d3f265da1b7e103a4d)

#### 1、package.json中需要注意的点：

（1）version: 

版本格式: [主版本号major.次版本号minor.修订号patch]

先行版本: 内部版本alpha、公测版本beta、Release candiate正式版本的候选版本rc，例如1.0.0-alpha、1.0.0-beta.1

使用npm version进行版本号管理：

```
npm version 1.0.1  # 显示设置版本号为 1.0.1
npm version major  # major + 1，其余版本号归 0
npm version minor  # minor + 1，patch 归 0
npm version patch  # patch + 1

# 预发布版本
# 当前版本号为 1.2.3
npm version prepatch  # 版本号变为 1.2.4-0，也就是 1.2.4 版本的第一个预发布版本
npm version preminor  # 版本号变为 1.3.0-0，也就是 1.3.0 版本的第一个预发布版本
npm version premajor  # 版本号变为 2.0.0-0，也就是 2.0.0 版本的第一个预发布版本
npm version prerelease  # 版本号变为 2.0.0-1，也就是使预发布版本号加一

# 在git环境下npm version会默认执行git add->git commit->git tag
npm version minor -m "feat(version): upgrade to %s"  # 可自定义commit message；%s 会自动替换为新版本号

# 模块 tag 管理
# 当前版本为1.0.1
npm version prerelease  # 1.0.2-0
npm publish --tag beta # 发布包beta版本，打上beta tag
npm dist-tag ls xxx  # 查看某个包的tag；beta: 1.0.2-0
npm install xxx@beta  # 下载beta版本 1.0.2-0
# 当prerelease版本已经稳定了，可以将prerelease版本设置为稳定版本
npm dist-tag add xxx@1.0.2-0 latest
npm dist-tag ls xxx  # latest: 1.0.2-0
```

npm version 可以更新包版本，当仓库已经被git初始化了，那么运行npm version修改完版本号以后，还会运行git add 、git commit和git tag的命令，其中commit的信息默认是自改完的版本号

（2）main、module、sideEffect：

* main、module：用来指定npm包的入口文件
* main: npm自带，一般表示符合CommonJS规范的文件入口
* module: 符合ES模块规范的文件入口，使得代码可进行Tree Shaking；并且在webpack的默认配置中，module的优先级要高于main

> 因为一般项目配置babel时，为了加速项目编译过程，会忽略node_modules中的模块，所以module入口的文件最好是符合ESmodule规范的ES5的代码（说白了就是该文件只有导入导出是用的ES6模块化语法，其他都已经转成了es5），webpack最终会把ESmodule转换为它自己的commonjs规范的代码

* sideEffect：webpack4中新增特性，表示npm包的代码是否有副作用；

> sideEffect可设置为Boolean或者数组;当为false时，表明这个包是没有副作用的，可以进行按需引用;如果为数组时，数组的每一项表示的是有副作用的文件在组件库开发的时候，如果有样式文件，需要把样式文件的路径放到sideEffect的数组中，因为UglifyJs只能识别js文件，如果不设置的话，最后打包的时候会把样式文件忽略掉。

由于webpack4引入了sideEffect，因此当第三方包设置了sideEffect时，可以直接去除没有用到的代码，比如antd组件库设置sideEffect，那在webpack4时就不用再依赖babel-plugin-import进行按需加载了，webpack打包时直接就能把没用到的代码通过tree-shaking清除掉。

> 参考文章：
> [package.json 中的 Module 字段是干嘛的](https://github.com/sunyongjian/blog/issues/37)
> [聊聊 package.json 文件中的 module 字段](https://loveky.github.io/2018/02/26/tree-shaking-and-pkg.module/)

（3）tree shaking，用来剔除 JavaScript 中用不上的死代码

> 更多详情可参考[使用 Tree Shaking](http://www.xbhub.com/wiki/webpack/4%E4%BC%98%E5%8C%96/4-10%E4%BD%BF%E7%94%A8TreeShaking.html)

要让 Tree Shaking 正常工作的前提是交给 Webpack 的 JavaScript 代码必须是采用 ES6 模块化语法的。 因为 ES6 模块化语法是静态的（导入导出语句中的路径必须是静态的字符串，而且不能放入其它代码块中），这让 Webpack 可以简单的分析出哪些 export 的被 import 过了。 如果你采用 ES5 中的模块化，例如 module.export={...}、 require(x+y)、 if(x){require('./util')}，Webpack 无法分析出哪些代码可以剔除。

基于以上说明，需要做一些配置让tree shaking生效：

第一种情况--针对项目：
* 把采用 ES6 模块化的代码直接交给 Webpack，需要配置 Babel 让其保留 ES6 模块化语句，修改 .babelrc 文件如下；要剔除用不上的代码还得经过 UglifyJS 去处理一遍，因此需要在项目中引入UglifyJSPlugin；
```
{
    "presets": [
        [
            "env",
            {
                "modules": false
            }
        ]
    ]
}
```
* 在package.json中根据实际情况设置sideEffects，详细解释请看上面的第（2）点

第二种情况--针对npm包开发：
* 提供两份代码，一份采用 CommonJS 模块化语法，一份采用 ES6 模块化语法，package.json 文件中有两个字段：

```
{
  "main": "lib/index.js", // 指明采用 CommonJS 模块化的代码入口
  "module": "es/index.js" // 指明采用 ES6 模块化的代码入口；当该代码存在时，webpack会优先加载这个代码
}
```
* 根据情况设置package.json中的sideEffects字段


> 关于tree shaking、sideEffects使用请查看：
> [Tree-Shaking性能优化实践 - 原理篇](https://juejin.im/post/5a4dc842518825698e7279a9)
> [你的Tree-Shaking并没什么卵用](https://juejin.im/post/5a5652d8f265da3e497ff3de) 
> [深入浅出 sideEffects](https://www.lindongzhou.com/article/know-sideEffects) 
> [Webpack 中的 sideEffects 到底该怎么用](https://zhuanlan.zhihu.com/p/40052192)
> 

由文章可知sideEffects并不是在项目真的不存在副作用代码时才可以设置

#### 2、控制npm发布的包包含的文件有以下方式：

* package.json#files：数组，表示可以包含哪些文件，格式和.gitignore的写法一样
* .npmignore：表示哪些文件将被忽略，格式和.gitignore的写法一样
* .gitignore：表示要忽略哪些文件

优先级：files > .npmignore > .gitignore

#### 3、package-lock.json:

* package-lock.json把所有依赖按照顺序列出来，第一次出现的包名会提升到顶层，后面重复出现的将会放入被依赖包的node_modules当中，因此会引起不完全扁平化问题。
* 在开发应用时，建议把package-lock.json文件提交到代码仓库，从而让团队成员、运维部署人员或CI系统可以在执行npm install时安装的依赖版本都是一致的。
* 但在开发一个库时，则不应把package-lock.json文件提交到仓库中。实际上，npm也默认不会把package-lock.json文件发布出去。之所以这么做，是因为库项目一般是被其他项目依赖的，在不写死的情况下，就可以复用主项目已经加载过的包，而一旦库依赖的是精确的版本号那么可能会造成包的冗余。

#### 4、npm scripts 脚本、npx、path环境变量

package.json：

```
"scripts": {
    "serve": "vue-cli-service serve",
    ...
}
```

原理: package.json 中的 bin 字段；字段 bin 表示一个可执行文件到指定文件源的映射。

例如在@vue/cli-service的package.json中：

```
"bin": {
    "vue-cli-service": "bin/vue-cli-service.js"
}
```

npx：方便调用项目内部安装的模块

PATH环境变量：执行`env`可查看当前所有环境变量；`npm run env`可查看脚本运行时的环境变量;通过npm run可在不添加路径前缀的情况下直接访问当前项目node_modules/.bin目录里面的可执行文件

#### 5、其他

（1）

```
npm outdated # 查看当前项目中可升级的模块

npm audit [--json]  # 安全漏洞检查；加上--json，以 JSON 格式生成漏洞报告

npm audit fix # 修复存在安全漏洞的依赖包（自动更新到兼容的安全版本）

npm audit fix --force # 将依赖包版本号升级到最新的大版本，而不是兼容的安全版本；尽量避免使用--force

```

（2）git提交可参考以下规范：

feat：新功能（feature）

fix：修补bug

docs：文档（documentation）

style： 格式（不影响代码运行的变动）

refactor：重构（即不是新增功能，也不是修改bug的代码变动）

test：增加测试

chore：构建过程或辅助工具的变动


（3）npm包发布流程：

[于Webpack和ES6构建NPM包](https://juejin.im/post/5ac4a4d85188255c4c107e42)

[从dist到es：发一个NPM库，我蜕了一层皮](https://segmentfault.com/a/1190000018242549)

[8102年底如何开发和维护一个npm项目](https://juejin.im/post/5bd32ecff265da0ab33193b4)


（4）几点心得：

1、对于webpack构建的项目或者包，在babel中设置`"modules": false`其实只是让项目中经过babel转化后的代码（已经是es5）仍然保留 ES6 模块化语句，也就是只有导入导出语句保留es6写法；此时webpack会自动再去转换这里的es6模块化语句；也就是ES6 模块化语句交给webpack自己去转换；

2、对于webpack构建生成的包，不支持导出为es6模块（最终都转成了es5，无法保留ES6 模块化语句不转换），因此如果开发的npm包希望导出多种格式，推荐使用rollup

3、为了加速项目编译过程，一般都会设置忽略编译node_modules中的模块，所以这就需要我们开发的npm包是编译过的；

> 一般来说，用于node环境的包，只要提供符合CMD规范的包，但用于web的包，就要提供更多的选项：

> * lib：符合commonjs规范的文件，一般放在lib这个文件夹里面，入口是mian

> * es：符合ES module规范的文件，一般放在es这个文件夹里面，入口是module

> * dist：经过压缩的文件，一般是可以通过script标签直接引用的文件

